package com.example.sasloopmanager

import android.app.Application
import android.content.Context
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.sasloopmanager.data.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

// ─── Auth ViewModel ──────────────────────────────────────────────────────────
sealed class AuthState {
    object Loading : AuthState()
    object Unauthenticated : AuthState()
    data class Authenticated(val user: UserProfile) : AuthState()
}

sealed class LoginResult {
    object Success : LoginResult()
    data class Error(val message: String) : LoginResult()
}

class AuthViewModel(application: Application) : AndroidViewModel(application) {
    private val ctx: Context get() = getApplication<Application>().applicationContext

    private val _authState = MutableStateFlow<AuthState>(AuthState.Loading)
    val authState: StateFlow<AuthState> = _authState.asStateFlow()

    init {
        checkToken()
    }

    private fun checkToken() {
        viewModelScope.launch {
            try {
                val token = TokenManager.getToken(ctx).first()
                if (!token.isNullOrBlank()) {
                    ApiClient.setTokenProvider { token }
                    val res = ApiClient.api.getProfile()
                    if (res.isSuccessful && res.body() != null) {
                        _authState.value = AuthState.Authenticated(res.body()!!)
                    } else {
                        TokenManager.clearToken(ctx)
                        _authState.value = AuthState.Unauthenticated
                    }
                } else {
                    _authState.value = AuthState.Unauthenticated
                }
            } catch (e: Exception) {
                _authState.value = AuthState.Unauthenticated
            }
        }
    }

    suspend fun login(username: String, password: String): LoginResult {
        return try {
            val res = ApiClient.api.posLogin(LoginRequest(username, password))
            if (res.isSuccessful && res.body() != null) {
                val token = res.body()!!.token
                TokenManager.saveToken(ctx, token)
                ApiClient.setTokenProvider { token }
                val profile = ApiClient.api.getProfile()
                if (profile.isSuccessful && profile.body() != null) {
                    _authState.value = AuthState.Authenticated(profile.body()!!)
                    LoginResult.Success
                } else {
                    LoginResult.Error("Login succeeded but profile fetch failed")
                }
            } else {
                val err = res.errorBody()?.string() ?: "Invalid credentials"
                LoginResult.Error(err)
            }
        } catch (e: Exception) {
            LoginResult.Error(e.message ?: "Network error. Check your connection.")
        }
    }

    fun logout() {
        viewModelScope.launch {
            TokenManager.clearToken(ctx)
            _authState.value = AuthState.Unauthenticated
        }
    }
}

// ─── Dashboard ViewModel ──────────────────────────────────────────────────────
class DashboardViewModel : ViewModel() {
    private val _stats = MutableStateFlow<DashboardStats?>(null)
    val stats: StateFlow<DashboardStats?> = _stats.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    init { fetchStats() }

    fun fetchStats() {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            try {
                val res = ApiClient.api.getDashboardStats()
                if (res.isSuccessful) {
                    _stats.value = res.body()
                } else {
                    _error.value = "Failed to load dashboard"
                }
            } catch (e: Exception) {
                _error.value = "Network error: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }
}

// ─── Orders ViewModel ─────────────────────────────────────────────────────────
class OrdersViewModel : ViewModel() {
    private val _orders = MutableStateFlow<List<Order>>(emptyList())
    val orders: StateFlow<List<Order>> = _orders.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    private val _selectedFilter = MutableStateFlow("ALL")
    val selectedFilter: StateFlow<String> = _selectedFilter.asStateFlow()

    init { fetchOrders() }

    fun fetchOrders(status: String? = null) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            try {
                val res = ApiClient.api.getOrders(status = status?.takeIf { it != "ALL" })
                if (res.isSuccessful) {
                    val allOrders = res.body() ?: emptyList()
                    _orders.value = if (status != null && status != "ALL") {
                        allOrders.filter { it.status?.equals(status, ignoreCase = true) == true }
                    } else {
                        allOrders
                    }
                } else {
                    _error.value = "Failed to load orders"
                }
            } catch (e: Exception) {
                _error.value = "Network error: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun setFilter(filter: String) {
        _selectedFilter.value = filter
        fetchOrders(if (filter == "ALL") null else filter)
    }

    fun updateOrderStatus(orderId: Int, newStatus: String, onDone: (Boolean) -> Unit) {
        viewModelScope.launch {
            try {
                val res = ApiClient.api.updateOrderStatus(orderId, UpdateStatusRequest(newStatus))
                if (res.isSuccessful) {
                    // Update locally
                    _orders.value = _orders.value.map { o ->
                        if (o.id == orderId) o.copy(status = newStatus) else o
                    }
                    onDone(true)
                } else {
                    onDone(false)
                }
            } catch (e: Exception) {
                onDone(false)
            }
        }
    }
}

// ─── Billing ViewModel ────────────────────────────────────────────────────────
enum class BillingFlowState {
    SELECT_FLOW,
    SELECT_TABLE,
    ORDERING
}

class BillingViewModel(application: Application) : AndroidViewModel(application) {
    private val ctx: Context get() = getApplication<Application>().applicationContext

    private val _posSettings = MutableStateFlow<PosSettings>(PosSettings())
    val posSettings: StateFlow<PosSettings> = _posSettings.asStateFlow()

    private val _catalog = MutableStateFlow<List<MenuItem>>(emptyList())
    val catalog: StateFlow<List<MenuItem>> = _catalog.asStateFlow()

    private val _categories = MutableStateFlow<List<CategoryItem>>(emptyList())
    val categories: StateFlow<List<CategoryItem>> = _categories.asStateFlow()

    private val _optionGroups = MutableStateFlow<List<OptionGroup>>(emptyList())
    val optionGroups: StateFlow<List<OptionGroup>> = _optionGroups.asStateFlow()

    private val _tables = MutableStateFlow<List<TableItem>>(emptyList())
    val tables: StateFlow<List<TableItem>> = _tables.asStateFlow()

    private val _activeOrders = MutableStateFlow<List<Order>>(emptyList())
    val activeOrders: StateFlow<List<Order>> = _activeOrders.asStateFlow()

    private val _tableStatuses = MutableStateFlow<Map<String, String>>(emptyMap())
    val tableStatuses: StateFlow<Map<String, String>> = _tableStatuses.asStateFlow()

    private val _tableActiveTimestamps = MutableStateFlow<Map<String, Long>>(emptyMap())
    val tableActiveTimestamps: StateFlow<Map<String, Long>> = _tableActiveTimestamps.asStateFlow()

    private val _tableBills = MutableStateFlow<Map<String, Any>>(emptyMap())
    val tableBills: StateFlow<Map<String, Any>> = _tableBills.asStateFlow()

    private val _tableBillNumbers = MutableStateFlow<Map<String, Any>>(emptyMap())
    val tableBillNumbers: StateFlow<Map<String, Any>> = _tableBillNumbers.asStateFlow()

    private val _flowState = MutableStateFlow(BillingFlowState.SELECT_FLOW)
    val flowState: StateFlow<BillingFlowState> = _flowState.asStateFlow()

    private val _activeFlow = MutableStateFlow("") // DINEIN, TAKEAWAY_DELIVERY, QUICK_BILL, PREORDER
    val activeFlow: StateFlow<String> = _activeFlow.asStateFlow()

    private val _selectedTable = MutableStateFlow<TableItem?>(null)
    val selectedTable: StateFlow<TableItem?> = _selectedTable.asStateFlow()

    private val _selectedCategory = MutableStateFlow("ALL")
    val selectedCategory: StateFlow<String> = _selectedCategory.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _cart = MutableStateFlow<Map<MenuItem, Int>>(emptyMap())
    val cart: StateFlow<Map<MenuItem, Int>> = _cart.asStateFlow()

    private val _selectedPriceTier = MutableStateFlow(1)
    val selectedPriceTier: StateFlow<Int> = _selectedPriceTier.asStateFlow()

    private val _currentOrderType = MutableStateFlow("TAKEAWAY")
    val currentOrderType: StateFlow<String> = _currentOrderType.asStateFlow()

    fun setPriceTier(tier: Int) {
        _selectedPriceTier.value = tier
    }

    fun setCurrentOrderType(type: String) {
        _currentOrderType.value = type
    }

    fun resolveItemPriceLabel(tier: Int): String? {
        return when (tier) {
            2 -> "Takeaway"
            3 -> "Delivery"
            else -> null
        }
    }

    fun resolveItemPrice(item: MenuItem, tier: Int, orderType: String = ""): Double {
        return when (tier) {
            2 -> item.multiplePricing?.get("TAKEAWAY") ?: item.salePrice2 ?: item.price
            3 -> item.multiplePricing?.get("DELIVERY") ?: item.salePrice3 ?: item.price
            else -> item.multiplePricing?.get("DINE_IN") ?: item.price
        }
    }

    private val _oldKotItems = MutableStateFlow<Map<MenuItem, Int>>(emptyMap())
    val oldKotItems: StateFlow<Map<MenuItem, Int>> = _oldKotItems.asStateFlow()

    private val _editingOrderId = MutableStateFlow<Int?>(null)
    val editingOrderId: StateFlow<Int?> = _editingOrderId.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    private val _orderSuccess = MutableStateFlow<Boolean?>(null)
    val orderSuccess: StateFlow<Boolean?> = _orderSuccess.asStateFlow()

    private val _tableCarts = MutableStateFlow<Map<String, Map<MenuItem, Int>>>(emptyMap())
    val tableCarts: StateFlow<Map<String, Map<MenuItem, Int>>> = _tableCarts.asStateFlow()

    private val _customerHistory = MutableStateFlow<CustomerHistoryResponse?>(null)
    val customerHistory: StateFlow<CustomerHistoryResponse?> = _customerHistory.asStateFlow()

    private val _searchResults = MutableStateFlow<List<SearchedCustomer>>(emptyList())
    val searchResults: StateFlow<List<SearchedCustomer>> = _searchResults.asStateFlow()

    private val _staffList = MutableStateFlow<List<StaffUser>>(emptyList())
    val staffList: StateFlow<List<StaffUser>> = _staffList.asStateFlow()

    private val _outletQrs = MutableStateFlow<List<QrCodeItem>>(emptyList())
    val outletQrs: StateFlow<List<QrCodeItem>> = _outletQrs.asStateFlow()

    init {
        loadCatalogAndCategories()
        loadSettings()
        fetchStaff()
        fetchOutletQrs()
    }

    private fun loadSettings() {
        _posSettings.value = SettingsManager.getSettings(ctx)
    }

    fun updateSettings(newSettings: PosSettings) {
        _posSettings.value = newSettings
        SettingsManager.saveSettings(ctx, newSettings)
    }

    fun loadCatalogAndCategories() {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            try {
                val catRes = ApiClient.api.getCategories()
                val itemsRes = ApiClient.api.getCatalog()
                
                // Fetch option groups (non-blocking)
                try {
                    val ogRes = ApiClient.api.getOptionGroups()
                    if (ogRes.isSuccessful) {
                        _optionGroups.value = ogRes.body() ?: emptyList()
                        android.util.Log.i("CatalogLoad", "Loaded option groups: ${_optionGroups.value.size}")
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                }

                if (catRes.isSuccessful && itemsRes.isSuccessful) {
                    _categories.value = catRes.body()?.filter { 
                        !it.name.equals("uncategorized", ignoreCase = true) && 
                        !it.name.equals("uncategorised", ignoreCase = true) 
                    } ?: emptyList()
                    val items = itemsRes.body() ?: emptyList()
                    android.util.Log.i("CatalogLoad", "Loaded catalog: ${items.size} items")
                    val filteredCatalog = items.filter { item ->
                        if (item.category?.equals("Uncategorized", ignoreCase = true) == true ||
                            item.category?.equals("Uncategorised", ignoreCase = true) == true) {
                            val hasCategorized = items.any { other ->
                                other.displayName.equals(item.displayName, ignoreCase = true) &&
                                !other.category.isNullOrBlank() &&
                                !other.category.equals("Uncategorized", ignoreCase = true) &&
                                !other.category.equals("Uncategorised", ignoreCase = true)
                            }
                            !hasCategorized
                        } else {
                            true
                        }
                    }
                    android.util.Log.i("CatalogLoad", "Filtered catalog down to: ${filteredCatalog.size} items")
                    _catalog.value = filteredCatalog
                } else {
                    _error.value = "Failed to load catalog from server"
                }
            } catch (e: Exception) {
                _error.value = "Network error: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun fetchTablesAndActiveOrders() {
        viewModelScope.launch {
            try {
                val tablesRes = ApiClient.api.getTables()
                if (tablesRes.isSuccessful) {
                    _tables.value = tablesRes.body() ?: emptyList()
                }
                
                val ordersRes = ApiClient.api.getOrders(status = "ACTIVE")
                if (ordersRes.isSuccessful) {
                    val allOrders = ordersRes.body() ?: emptyList()
                    _activeOrders.value = allOrders.filter { 
                        it.status?.equals("ACTIVE", ignoreCase = true) == true || 
                        it.status?.equals("PENDING", ignoreCase = true) == true
                    }
                }

                val activeStateRes = ApiClient.api.getActiveState()
                if (activeStateRes.isSuccessful) {
                    val body = activeStateRes.body()
                    _tableStatuses.value = body?.tableStatuses ?: emptyMap()
                    _tableActiveTimestamps.value = body?.tableActiveTimestamps ?: emptyMap()
                    _tableBills.value = body?.tableBills ?: emptyMap()
                    _tableBillNumbers.value = body?.tableBillNumbers ?: emptyMap()
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun selectFlow(flow: String) {
        _activeFlow.value = flow
        _selectedTable.value = null
        _editingOrderId.value = null
        _oldKotItems.value = emptyMap()
        _cart.value = emptyMap()

        if (flow == "DINEIN") {
            _flowState.value = BillingFlowState.SELECT_TABLE
            fetchTablesAndActiveOrders()
        } else {
            _flowState.value = BillingFlowState.ORDERING
        }
    }

    fun selectTable(table: TableItem) {
        _selectedTable.value = table
        _flowState.value = BillingFlowState.ORDERING

        // Check if this table has an active order
        val activeOrder = _activeOrders.value.find { 
            it.tableNumber == table.tableName || it.tableName == table.tableName || it.tableNumber == table.id.toString() 
        }

        val serverBillItemsObj = _tableBills.value[table.id.toString()]
        if (serverBillItemsObj != null) {
            val parsedBills = parseOrderItems(serverBillItemsObj, _catalog.value)
            _oldKotItems.value = parsedBills
            _editingOrderId.value = activeOrder?.id
        } else if (activeOrder != null) {
            _editingOrderId.value = activeOrder.id
            val parsedOld = parseOrderItems(activeOrder.items, _catalog.value)
            _oldKotItems.value = parsedOld
        } else {
            _editingOrderId.value = null
            _oldKotItems.value = emptyMap()
        }

        // Load draft cart for this table if any exists
        val draftCart = _tableCarts.value[table.tableName] ?: emptyMap()
        _cart.value = draftCart
    }

    fun selectOrderForEditing(order: Order) {
        _editingOrderId.value = order.id
        val parsedOld = parseOrderItems(order.items, _catalog.value)
        _oldKotItems.value = parsedOld
        _cart.value = emptyMap()
        val flow = when (order.orderType?.uppercase()) {
            "DINE-IN", "DINEIN" -> "DINEIN"
            "PRE-ORDER", "PREORDER" -> "PREORDER"
            "QUICKBILL", "QUICK_BILL", "QUICK-BILL", "QUICK BILL" -> "QUICK_BILL"
            else -> "TAKEAWAY_DELIVERY"
        }
        _activeFlow.value = flow
        val table = _tables.value.find {
            it.tableName == order.tableNumber || it.tableName == order.tableName || it.id.toString() == order.tableNumber
        }
        if (table != null) {
            _selectedTable.value = table
        } else {
            _selectedTable.value = null
        }
        _flowState.value = BillingFlowState.ORDERING
    }

    fun goBack() {
        when (_flowState.value) {
            BillingFlowState.ORDERING -> {
                if (_activeFlow.value == "DINEIN") {
                    _flowState.value = BillingFlowState.SELECT_TABLE
                } else {
                    _flowState.value = BillingFlowState.SELECT_FLOW
                }
            }
            BillingFlowState.SELECT_TABLE -> {
                _flowState.value = BillingFlowState.SELECT_FLOW
            }
            else -> {}
        }
    }

    private fun parseOrderItems(itemsObj: Any?, catalog: List<MenuItem>): Map<MenuItem, Int> {
        val result = mutableMapOf<MenuItem, Int>()
        if (itemsObj == null) return result
        try {
            val gson = com.google.gson.Gson()
            val jsonStr = if (itemsObj is String) itemsObj else gson.toJson(itemsObj)
            val typeToken = object : com.google.gson.reflect.TypeToken<List<Map<String, Any>>>() {}.type
            val list = gson.fromJson<List<Map<String, Any>>>(jsonStr, typeToken)
            if (list != null) {
                for (map in list) {
                    val name = map["name"] as? String ?: map["product_name"] as? String ?: ""
                    val qty = (map["qty"] ?: map["quantity"] ?: 1).toString().toDoubleOrNull()?.toInt() ?: 1
                    val price = (map["price"] ?: 0.0).toString().toDoubleOrNull() ?: 0.0
                    
                    // Parse selected modifiers
                    val modifiersList = mutableListOf<SelectedModifier>()
                    val modsObj = map["modifiers"]
                    if (modsObj is List<*>) {
                        for (mod in modsObj) {
                            if (mod is Map<*, *>) {
                                val modName = mod["name"] as? String ?: ""
                                val modPrice = (mod["price"] ?: 0.0).toString().toDoubleOrNull() ?: 0.0
                                val modGroupId = (mod["groupId"] ?: 0).toString().toDoubleOrNull()?.toInt() ?: 0
                                modifiersList.add(SelectedModifier(modName, modPrice, modGroupId))
                            }
                        }
                    }
                    
                    val note = map["kitchenNote"] as? String ?: map["note"] as? String ?: ""

                    val matchedItem = catalog.find { 
                        it.displayName.equals(name, ignoreCase = true) || 
                        it.productName?.equals(name, ignoreCase = true) == true || 
                        it.name?.equals(name, ignoreCase = true) == true 
                    } ?: MenuItem(
                        id = (map["id"] ?: map["product_id"] ?: 0).toString().toDoubleOrNull()?.toInt() ?: 0,
                        code = null,
                        productName = name,
                        name = name,
                        price = price,
                        availability = true,
                        imageUrl = null,
                        description = null,
                        kotCategory = null,
                        category = null,
                        subCategory = null
                    )
                    val customizedItem = matchedItem.copy(
                        price = price,
                        selectedModifiers = modifiersList,
                        kitchenNote = note
                    )
                    result[customizedItem] = qty
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return result
    }

    fun setCategory(categoryName: String) {
        _selectedCategory.value = categoryName
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    private fun syncActiveCartToTableCarts() {
        val tbl = _selectedTable.value
        if (tbl != null) {
            val currentCarts = _tableCarts.value.toMutableMap()
            if (_cart.value.isEmpty()) {
                currentCarts.remove(tbl.tableName)
            } else {
                currentCarts[tbl.tableName] = _cart.value
            }
            _tableCarts.value = currentCarts
        }
    }

    fun addCustomItemToCart(item: MenuItem, selected: List<SelectedModifier>, note: String) {
        val hasOpts = _optionGroups.value.any { og -> og.itemId == item.id }
        val tier = _selectedPriceTier.value
        val resolvedPrice = resolveItemPrice(item, tier, _currentOrderType.value)
        val label = resolveItemPriceLabel(tier)
        val basePrice = if (hasOpts) 0.0 else resolvedPrice
        val unitPrice = basePrice + selected.sumOf { it.price }
        val customizedItem = item.copy(
            price = unitPrice,
            selectedModifiers = selected,
            kitchenNote = note,
            priceLabel = label
        )
        val current = _cart.value.toMutableMap()
        current[customizedItem] = (current[customizedItem] ?: 0) + 1
        _cart.value = current
        syncActiveCartToTableCarts()
    }

    fun addToCart(item: MenuItem) {
        val tier = _selectedPriceTier.value
        val resolvedPrice = resolveItemPrice(item, tier, _currentOrderType.value)
        val label = resolveItemPriceLabel(tier)
        val resolvedItem = item.copy(price = resolvedPrice, priceLabel = label)
        val current = _cart.value.toMutableMap()
        current[resolvedItem] = (current[resolvedItem] ?: 0) + 1
        _cart.value = current
        syncActiveCartToTableCarts()
    }

    fun removeFromCart(item: MenuItem) {
        val current = _cart.value.toMutableMap()
        val key = current.keys.find { it == item }
            ?: current.keys.find { it.id == item.id && it.price == item.price && it.selectedModifiers == item.selectedModifiers && it.kitchenNote == item.kitchenNote && it.priceLabel == item.priceLabel }
        if (key != null) {
            val qty = current[key] ?: 0
            if (qty > 0) {
                if (qty > 1) {
                    current[key] = qty - 1
                } else {
                    current.remove(key)
                }
                _cart.value = current
                syncActiveCartToTableCarts()
            }
        }
    }

    fun updateCartQty(item: MenuItem, newQty: Int) {
        val current = _cart.value.toMutableMap()
        // Match by exact item (id + price + modifiers + note + label)
        val key = current.keys.find { it == item }
            ?: current.keys.find { it.id == item.id && it.price == item.price && it.selectedModifiers == item.selectedModifiers && it.kitchenNote == item.kitchenNote && it.priceLabel == item.priceLabel }
        if (newQty <= 0) {
            if (key != null) {
                current.remove(key)
            }
        } else {
            if (key != null) {
                current[key] = newQty
            } else {
                current[item] = newQty
            }
        }
        _cart.value = current
        syncActiveCartToTableCarts()
    }


    fun clearCart() {
        _cart.value = emptyMap()
        _oldKotItems.value = emptyMap()
        _editingOrderId.value = null
        _selectedTable.value?.let { tbl ->
            val currentCarts = _tableCarts.value.toMutableMap()
            currentCarts.remove(tbl.tableName)
            _tableCarts.value = currentCarts
        }
    }

    fun updateOldKotItemQty(item: MenuItem, newQty: Int) {
        val current = _oldKotItems.value.toMutableMap()
        val key = current.keys.find { it == item }
            ?: current.keys.find { it.id == item.id && it.price == item.price && it.selectedModifiers == item.selectedModifiers && it.kitchenNote == item.kitchenNote && it.priceLabel == item.priceLabel }
        if (newQty <= 0) {
            if (key != null) current.remove(key)
        } else {
            if (key != null) current[key] = newQty else current[item] = newQty
        }
        _oldKotItems.value = current
    }

    fun removeOldKotItems(items: Set<MenuItem>) {
        val current = _oldKotItems.value.toMutableMap()
        items.forEach { item ->
            val key = current.keys.find { it == item }
                ?: current.keys.find { it.id == item.id && it.price == item.price && it.selectedModifiers == item.selectedModifiers && it.kitchenNote == item.kitchenNote && it.priceLabel == item.priceLabel }
            if (key != null) current.remove(key)
        }
        _oldKotItems.value = current
    }

    fun cancelEntireActiveOrder(reason: String, onDone: (Boolean) -> Unit) {
        val orderId = _editingOrderId.value
        if (orderId == null) {
            onDone(false)
            return
        }
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val res = ApiClient.api.updateOrderStatus(orderId, UpdateStatusRequest(status = "CANCELLED", rejectionReason = reason))
                if (res.isSuccessful) {
                    val order = _activeOrders.value.find { it.id == orderId }
                    val tblName = order?.tableName ?: order?.tableNumber
                    val tbl = _tables.value.find { it.tableName == tblName || it.id.toString() == tblName } ?: _selectedTable.value

                    tbl?.let { t ->
                        val tableId = t.id.toString()
                        val nextStatuses = _tableStatuses.value.toMutableMap()
                        val nextBills = _tableBills.value.toMutableMap()
                        val nextTimestamps = _tableActiveTimestamps.value.toMutableMap()
                        val nextBillNumbers = _tableBillNumbers.value.toMutableMap()

                        nextStatuses.remove(tableId)
                        nextBills.remove(tableId)
                        nextTimestamps.remove(tableId)
                        nextBillNumbers.remove(tableId)

                        _tableStatuses.value = nextStatuses
                        _tableBills.value = nextBills
                        _tableActiveTimestamps.value = nextTimestamps
                        _tableBillNumbers.value = nextBillNumbers

                        val currentCarts = _tableCarts.value.toMutableMap()
                        currentCarts.remove(t.tableName)
                        _tableCarts.value = currentCarts
                    }

                    _activeOrders.value = _activeOrders.value.filter { it.id != orderId }
                    clearCart()
                    syncActiveStateToServer()
                    fetchTablesAndActiveOrders()
                    onDone(true)
                } else {
                    onDone(false)
                }
            } catch (e: Exception) {
                e.printStackTrace()
                onDone(false)
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun resetOrderSuccess() {
        _orderSuccess.value = null
    }

    // Save KOT: punches order to kitchen, keeping status = ACTIVE
    fun saveKOT(
        customerName: String,
        customerNumber: String,
        address: String,
        orderType: String,
        kotNote: String = "",
        waiterName: String? = null,
        shouldPrint: Boolean = false,
        onDone: (Boolean) -> Unit
    ) {
        if (_cart.value.isEmpty()) {
            onDone(false)
            return
        }

        viewModelScope.launch {
            _isLoading.value = true
            try {
                val combinedMap = mutableMapOf<MenuItem, Int>()
                _oldKotItems.value.forEach { (item, qty) ->
                    combinedMap[item] = qty
                }
                _cart.value.forEach { (item, qty) ->
                    combinedMap[item] = (combinedMap[item] ?: 0) + qty
                }

                val itemsList = combinedMap.map { (item, qty) ->
                    val labeledName = if (item.priceLabel != null) "${item.displayName} (${item.priceLabel})" else item.displayName
                    OrderItemInput(
                        id = item.id,
                        name = labeledName,
                        price = item.price,
                        qty = qty,
                        modifiers = item.selectedModifiers?.takeIf { it.isNotEmpty() }
                    )
                }
                val totalPrice = combinedMap.entries.sumOf { (item, qty) -> item.price * qty }

                val orderId = _editingOrderId.value
                val request = CreateOrderRequest(
                    customerName = customerName.takeIf { it.isNotBlank() } ?: "Table Guest",
                    customerNumber = customerNumber,
                    paymentMethod = "CASH",
                    status = "ACTIVE",
                    orderType = orderType,
                    tableNumber = _selectedTable.value?.tableName ?: "0",
                    totalPrice = totalPrice,
                    items = itemsList,
                    address = address.takeIf { it.isNotBlank() },
                    source = "POS_ANDROID"
                )

                val res = if (orderId != null) {
                    ApiClient.api.updateOrder(orderId, request)
                } else {
                    ApiClient.api.createOrder(request)
                }

                if (res.isSuccessful && res.body() != null) {
                    val order = res.body()!!
                    _editingOrderId.value = order.id
                    _oldKotItems.value = combinedMap.toMap()
                    _cart.value = emptyMap()
                    _selectedTable.value?.let { tbl ->
                        val currentCarts = _tableCarts.value.toMutableMap()
                        currentCarts.remove(tbl.tableName)
                        _tableCarts.value = currentCarts

                        val tableId = tbl.id.toString()
                        val itemsListForActiveState = combinedMap.map { (item, qty) ->
                            val labeledName = if (item.priceLabel != null) "${item.displayName} (${item.priceLabel})" else item.displayName
                            mapOf(
                                "id" to item.id,
                                "name" to labeledName,
                                "product_name" to labeledName,
                                "qty" to qty,
                                "quantity" to qty,
                                "price" to item.price,
                                "modifiers" to (item.selectedModifiers ?: emptyList()),
                                "kitchenNote" to (item.kitchenNote ?: ""),
                                "note" to (item.kitchenNote ?: "")
                            )
                        }

                        val nextStatuses = _tableStatuses.value.toMutableMap()
                        nextStatuses[tableId] = "SAVED"
                        _tableStatuses.value = nextStatuses

                        val nextBills = _tableBills.value.toMutableMap()
                        nextBills[tableId] = itemsListForActiveState
                        _tableBills.value = nextBills

                        val nextTimestamps = _tableActiveTimestamps.value.toMutableMap()
                        if (nextTimestamps[tableId] == null) {
                            nextTimestamps[tableId] = System.currentTimeMillis()
                        }
                        _tableActiveTimestamps.value = nextTimestamps

                        syncActiveStateToServer()
                    }

                    // Trigger WiFi printer automatically if configured
                    if (shouldPrint && (_activeFlow.value != "QUICK_BILL" || _posSettings.value.quickBillDefaultKOTPrint)) {
                        triggerKOTPrint(
                            tableName = _selectedTable.value?.tableName ?: "0",
                            kotId = order.id.toString(),
                            items = combinedMap.toMap(),
                            notes = kotNote,
                            waiterName = waiterName
                        )
                    }

                    fetchTablesAndActiveOrders() // Refresh table statuses
                    _orderSuccess.value = true
                    onDone(true)
                } else {
                    onDone(false)
                }
            } catch (e: Exception) {
                onDone(false)
            } finally {
                _isLoading.value = false
            }
        }
    }

    // Checkout/Pay: completes payment, status = COMPLETED
    fun settleOrder(
        customerName: String,
        customerNumber: String,
        address: String,
        paymentMethod: String,
        orderType: String,
        discountAmount: Double,
        serviceCharge: Double,
        deliveryCharge: Double,
        cgst: Double,
        sgst: Double,
        preOrderId: String? = null,
        preOrderAdvance: Double? = null,
        preOrderBalance: Double? = null,
        tableName: String = "Direct",
        waiterName: String? = null,
        shouldPrint: Boolean = true,
        checkoutType: String = "SETTLE",
        userName: String = "admin",
        referenceNo: String = "",
        tipAmount: Double = 0.0,
        paidAmountInput: Double? = null,
        creditAmountInput: Double? = null,
        onDone: (Boolean) -> Unit
    ) {
        if (_cart.value.isEmpty() && _oldKotItems.value.isEmpty()) {
            onDone(false)
            return
        }

        viewModelScope.launch {
            _isLoading.value = true
            try {
                val combinedMap = mutableMapOf<MenuItem, Int>()
                _oldKotItems.value.forEach { (item, qty) ->
                    combinedMap[item] = qty
                }
                _cart.value.forEach { (item, qty) ->
                    combinedMap[item] = (combinedMap[item] ?: 0) + qty
                }

                val itemsList = combinedMap.map { (item, qty) ->
                    val labeledName = if (item.priceLabel != null) "${item.displayName} (${item.priceLabel})" else item.displayName
                    OrderItemInput(
                        id = item.id,
                        name = labeledName,
                        price = item.price,
                        qty = qty,
                        modifiers = item.selectedModifiers?.takeIf { it.isNotEmpty() }
                    )
                }
                val subtotal = combinedMap.entries.sumOf { (item, qty) -> item.price * qty }
                val finalTotal = subtotal + serviceCharge + deliveryCharge + cgst + sgst + tipAmount - discountAmount

                val isPreOrder = orderType.equals("PRE-ORDER", ignoreCase = true) || _activeFlow.value.equals("PREORDER", ignoreCase = true)
                val finalTotalPrice = if (isPreOrder && checkoutType == "SETTLE" && _posSettings.value.countAdvanceInSales) {
                    val adv = preOrderAdvance ?: 0.0
                    (finalTotal - adv).coerceAtLeast(0.0)
                } else {
                    finalTotal
                }

                val orderId = _editingOrderId.value
                val request = CreateOrderRequest(
                    customerName = customerName.takeIf { it.isNotBlank() } ?: "Walk-in",
                    customerNumber = customerNumber,
                    paymentMethod = paymentMethod,
                    status = if (checkoutType == "SAVE") "PENDING" else "COMPLETED",
                    orderType = orderType,
                    tableNumber = _selectedTable.value?.tableName ?: "0",
                    totalPrice = finalTotalPrice,
                    items = itemsList,
                    address = address.takeIf { it.isNotBlank() },
                    source = "POS_ANDROID",
                    discountAmount = discountAmount,
                    serviceCharge = serviceCharge,
                    deliveryCharge = deliveryCharge,
                    taxCgst = cgst,
                    taxSgst = sgst,
                    tipAmount = tipAmount,
                    paidAmount = if (paymentMethod.equals("CREDIT", ignoreCase = true)) 0.0 
                                 else if (paymentMethod.equals("SPLIT", ignoreCase = true)) (paidAmountInput ?: 0.0)
                                 else finalTotalPrice,
                    creditAmount = if (paymentMethod.equals("CREDIT", ignoreCase = true)) finalTotalPrice 
                                   else if (paymentMethod.equals("SPLIT", ignoreCase = true)) (creditAmountInput ?: 0.0)
                                   else 0.0,
                    preOrderId = preOrderId,
                    preOrderAdvance = preOrderAdvance,
                    preOrderBalance = preOrderBalance,
                    referenceNo = referenceNo,
                    waiterName = waiterName
                )

                val res = if (orderId != null) {
                    ApiClient.api.updateOrder(orderId, request)
                } else {
                    ApiClient.api.createOrder(request)
                }

                if (res.isSuccessful && res.body() != null) {
                    val order = res.body()!!

                    // Trigger WiFi printer automatically if configured
                    if (checkoutType != "SAVE" && shouldPrint && (_activeFlow.value != "QUICK_BILL" || _posSettings.value.quickBillDefaultBillPrint)) {
                        triggerBillPrint(
                            billNo = order.billNo ?: "NEW",
                            customerName = customerName.takeIf { it.isNotBlank() } ?: "Walk-in",
                            customerPhone = customerNumber,
                            customerAddress = address,
                            orderType = orderType,
                            items = combinedMap.toMap(),
                            subtotal = subtotal,
                            discount = discountAmount,
                            cgst = cgst,
                            sgst = sgst,
                            serviceCharge = serviceCharge,
                            deliveryCharge = deliveryCharge,
                            finalTotal = finalTotal,
                            tableName = tableName,
                            waiterName = waiterName,
                            preOrderAdvance = preOrderAdvance ?: 0.0,
                            preOrderBalance = preOrderBalance ?: 0.0,
                            paymentMethod = paymentMethod,
                            userName = userName,
                            referenceNo = referenceNo,
                            tipAmount = tipAmount
                        )
                    }

                    // Update active state
                    val tbl = _tables.value.find { it.tableName == tableName || it.id.toString() == tableName } ?: _selectedTable.value
                    tbl?.let { t ->
                        val tableId = t.id.toString()
                        val nextStatuses = _tableStatuses.value.toMutableMap()
                        val nextBills = _tableBills.value.toMutableMap()
                        val nextTimestamps = _tableActiveTimestamps.value.toMutableMap()
                        val nextBillNumbers = _tableBillNumbers.value.toMutableMap()

                        if (checkoutType == "SETTLE") {
                            nextStatuses.remove(tableId)
                            nextBills.remove(tableId)
                            nextTimestamps.remove(tableId)
                            nextBillNumbers.remove(tableId)
                        } else {
                            nextStatuses[tableId] = if (checkoutType == "PRINT") "PRINTED" else if (checkoutType == "SAVE") "BILL_SAVED" else "SAVED"
                            val itemsListForActiveState = combinedMap.map { (item, qty) ->
                                val labeledName = if (item.priceLabel != null) "${item.displayName} (${item.priceLabel})" else item.displayName
                                mapOf(
                                    "id" to item.id,
                                    "name" to labeledName,
                                    "product_name" to labeledName,
                                    "qty" to qty,
                                    "quantity" to qty,
                                    "price" to item.price,
                                    "modifiers" to (item.selectedModifiers ?: emptyList()),
                                    "kitchenNote" to (item.kitchenNote ?: ""),
                                    "note" to (item.kitchenNote ?: "")
                                )
                            }
                            nextBills[tableId] = itemsListForActiveState
                            if (nextTimestamps[tableId] == null) {
                                nextTimestamps[tableId] = System.currentTimeMillis()
                            }
                            nextBillNumbers[tableId] = order.billNo ?: "NEW"
                        }

                        _tableStatuses.value = nextStatuses
                        _tableBills.value = nextBills
                        _tableActiveTimestamps.value = nextTimestamps
                        _tableBillNumbers.value = nextBillNumbers

                        syncActiveStateToServer()
                    }

                    if (checkoutType == "SETTLE") {
                        if (orderId != null) {
                            _activeOrders.value = _activeOrders.value.filter { it.id != orderId }
                        }
                        clearCart()
                        _flowState.value = BillingFlowState.SELECT_FLOW
                    } else {
                        _editingOrderId.value = order.id
                        _oldKotItems.value = combinedMap.toMap()
                        _cart.value = emptyMap()
                        
                        tbl?.let { t ->
                            val currentCarts = _tableCarts.value.toMutableMap()
                            currentCarts.remove(t.tableName)
                            _tableCarts.value = currentCarts
                        }
                    }

                    fetchTablesAndActiveOrders() // Refresh table statuses
                    _orderSuccess.value = true
                    onDone(true)
                } else {
                    onDone(false)
                }
            } catch (e: Exception) {
                e.printStackTrace()
                onDone(false)
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun fetchCustomerHistory(phone: String) {
        if (phone.isBlank()) {
            _customerHistory.value = null
            return
        }
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val res = ApiClient.api.getCustomerHistory(phone)
                if (res.isSuccessful) {
                    _customerHistory.value = res.body()
                } else {
                    _customerHistory.value = null
                }
            } catch (e: Exception) {
                e.printStackTrace()
                _customerHistory.value = null
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun fetchStaff() {
        viewModelScope.launch {
            try {
                val res = ApiClient.api.getStaff()
                if (res.isSuccessful) {
                    _staffList.value = res.body() ?: emptyList()
                    android.util.Log.i("StaffLoad", "Loaded staff: ${_staffList.value.size}")
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun fetchOutletQrs() {
        viewModelScope.launch {
            try {
                val res = ApiClient.api.getQRs()
                if (res.isSuccessful) {
                    _outletQrs.value = res.body()?.filter { it.isActive } ?: emptyList()
                    android.util.Log.i("QrsLoad", "Loaded active QRs: ${_outletQrs.value.size}")
                }

            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun syncActiveStateToServer() {
        viewModelScope.launch {
            try {
                val tablesMapped = _tables.value.map { t ->
                    mapOf(
                        "id" to t.id,
                        "table_name" to t.tableName,
                        "department_name" to t.departmentName,
                        "is_temporary" to false
                    )
                }
                val activeState = ActiveStateResponse(
                    tableStatuses = _tableStatuses.value,
                    tableBills = _tableBills.value,
                    tableActiveTimestamps = _tableActiveTimestamps.value,
                    tableBillNumbers = _tableBillNumbers.value,
                    tables = tablesMapped
                )
                val request = SaveActiveStateRequest(activeState)
                ApiClient.api.saveActiveState(request)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun triggerKOTPrint(
        tableName: String,
        kotId: String,
        items: Map<MenuItem, Int>,
        notes: String,
        waiterName: String? = null
    ) {
        val settings = _posSettings.value
        if (settings.printerConnection == "WiFi" && settings.printerIp.isNotBlank()) {
            viewModelScope.launch {
                val ip = settings.printerIp
                val bytes = PrinterHelper.generateKOTBytes(tableName, kotId, items, notes, waiterName, settings)
                val success = PrinterHelper.printToSocket(ip, 9100, bytes)
                withContext(kotlinx.coroutines.Dispatchers.Main) {
                    if (success) {
                        android.widget.Toast.makeText(ctx, "KOT Printed Successfully", android.widget.Toast.LENGTH_SHORT).show()
                    } else {
                        android.widget.Toast.makeText(ctx, "WiFi KOT Print Failed. Check IP: $ip", android.widget.Toast.LENGTH_LONG).show()
                    }
                }
            }
        }
    }

    fun triggerBillPrint(
        billNo: String,
        customerName: String,
        customerPhone: String,
        customerAddress: String,
        orderType: String,
        items: Map<MenuItem, Int>,
        subtotal: Double,
        discount: Double,
        cgst: Double,
        sgst: Double,
        serviceCharge: Double,
        deliveryCharge: Double,
        finalTotal: Double,
        tableName: String = "Direct",
        waiterName: String? = null,
        preOrderAdvance: Double = 0.0,
        preOrderBalance: Double = 0.0,
        paymentMethod: String = "CASH",
        userName: String = "admin",
        referenceNo: String = "",
        tipAmount: Double = 0.0
    ) {
        val settings = _posSettings.value
        if (settings.printerConnection == "WiFi" && settings.printerIp.isNotBlank()) {
            viewModelScope.launch {
                val ip = settings.printerIp
                val bytes = PrinterHelper.generateBillBytes(
                    billNo = billNo,
                    customerName = customerName,
                    customerPhone = customerPhone,
                    customerAddress = customerAddress,
                    orderType = orderType,
                    items = items,
                    subtotal = subtotal,
                    discount = discount,
                    cgst = cgst,
                    sgst = sgst,
                    serviceCharge = serviceCharge,
                    deliveryCharge = deliveryCharge,
                    finalTotal = finalTotal,
                    tableName = tableName,
                    waiterName = waiterName,
                    settings = settings,
                    preOrderAdvance = preOrderAdvance,
                    preOrderBalance = preOrderBalance,
                    paymentMethod = paymentMethod,
                    userName = userName,
                    referenceNo = referenceNo,
                    tipAmount = tipAmount
                )
                val success = PrinterHelper.printToSocket(ip, 9100, bytes)
                withContext(kotlinx.coroutines.Dispatchers.Main) {
                    if (success) {
                        android.widget.Toast.makeText(ctx, "Bill Printed Successfully", android.widget.Toast.LENGTH_SHORT).show()
                    } else {
                        android.widget.Toast.makeText(ctx, "WiFi Bill Print Failed. Check IP: $ip", android.widget.Toast.LENGTH_LONG).show()
                    }
                }
            }
        }
    }

    fun searchCustomers(query: String) {
        if (query.isBlank()) {
            _searchResults.value = emptyList()
            return
        }
        viewModelScope.launch {
            try {
                val res = ApiClient.api.searchCustomers(query)
                if (res.isSuccessful) {
                    _searchResults.value = res.body() ?: emptyList()
                } else {
                    _searchResults.value = emptyList()
                }
            } catch (e: Exception) {
                e.printStackTrace()
                _searchResults.value = emptyList()
            }
        }
    }

    fun clearSearchResults() {
        _searchResults.value = emptyList()
    }

    fun saveCustomer(
        name: String,
        phone: String,
        address: String,
        onDone: (Boolean, String) -> Unit
    ) {
        if (phone.isBlank()) {
            onDone(false, "Customer phone number is required")
            return
        }
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val request = SaveCustomerRequest(
                    name = name.ifBlank { "Customer" },
                    number = phone,
                    address = address.takeIf { it.isNotBlank() },
                    points = 0,
                    balance = 0.0
                )
                val res = ApiClient.api.saveCustomer(request)
                if (res.isSuccessful && res.body()?.success == true) {
                    onDone(true, "Customer saved successfully")
                } else {
                    val errorMsg = res.errorBody()?.string() ?: "Failed to save customer"
                    onDone(false, errorMsg)
                }
            } catch (e: Exception) {
                onDone(false, "Network error: ${e.message}")
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun onOrderAccepted(order: Order) {
        val settings = _posSettings.value
        val itemsMap = parseOrderItems(order.items, _catalog.value)
        if (settings.printKOTOnAccept) {
            triggerKOTPrint(
                tableName = order.tableName ?: order.tableNumber ?: "0",
                kotId = order.id.toString(),
                items = itemsMap,
                notes = "",
                waiterName = null
            )
        }
        if (settings.printBillOnAccept) {
            triggerBillPrint(
                billNo = order.billNo ?: order.id.toString(),
                customerName = order.customerName ?: "Walk-in",
                customerPhone = order.customerNumber ?: "",
                customerAddress = order.address ?: "",
                orderType = order.orderType ?: "Takeaway",
                items = itemsMap,
                subtotal = order.subtotal ?: itemsMap.entries.sumOf { it.key.price * it.value },
                discount = 0.0,
                cgst = 0.0,
                sgst = 0.0,
                serviceCharge = 0.0,
                deliveryCharge = 0.0,
                finalTotal = order.totalPrice ?: 0.0,
                tableName = order.tableName ?: order.tableNumber ?: "Direct",
                waiterName = null
            )
        }
    }

    fun payCustomerDue(
        phone: String,
        amount: Double,
        paymentMethod: String,
        reason: String? = null,
        onDone: (Boolean, String) -> Unit
    ) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val request = com.example.sasloopmanager.data.PayDueRequest(
                    phone = phone,
                    amount = amount,
                    paymentMethod = paymentMethod,
                    reason = reason
                )
                val res = ApiClient.api.payDue(request)
                if (res.isSuccessful && res.body()?.success == true) {
                    searchCustomers(phone)
                    onDone(true, "Due payment successful")
                } else {
                    val errorMsg = res.errorBody()?.string() ?: "Failed to record due payment"
                    onDone(false, errorMsg)
                }
            } catch (e: Exception) {
                e.printStackTrace()
                onDone(false, "Network error: ${e.message}")
            } finally {
                _isLoading.value = false
            }
        }
    }
}
