package com.example.sasloopmanager

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.ui.platform.LocalContext
import android.widget.Toast
import android.content.Context
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.graphics.vector.path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import coil.compose.AsyncImage
import coil.request.ImageRequest
import com.example.sasloopmanager.data.BASE_URL
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.sasloopmanager.data.MenuItem
import com.example.sasloopmanager.data.TableItem
import com.example.sasloopmanager.data.SelectedModifier
import com.example.sasloopmanager.data.OptionGroup
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.ui.draw.shadow
import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import com.example.sasloopmanager.theme.*
import kotlinx.coroutines.delay
import androidx.compose.ui.text.font.FontFamily
import com.example.sasloopmanager.data.PrinterHelper
import androidx.compose.foundation.Canvas
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.Dp
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BillingScreen(billingViewModel: BillingViewModel, user: com.example.sasloopmanager.data.UserProfile? = null) {
    val catalog by billingViewModel.catalog.collectAsStateWithLifecycle()
    val categories by billingViewModel.categories.collectAsStateWithLifecycle()
    val selectedCategory by billingViewModel.selectedCategory.collectAsStateWithLifecycle()
    val searchQuery by billingViewModel.searchQuery.collectAsStateWithLifecycle()
    val cart by billingViewModel.cart.collectAsStateWithLifecycle()
    val oldKotItems by billingViewModel.oldKotItems.collectAsStateWithLifecycle()
    val tables by billingViewModel.tables.collectAsStateWithLifecycle()
    val activeOrders by billingViewModel.activeOrders.collectAsStateWithLifecycle()
    val tableStatuses by billingViewModel.tableStatuses.collectAsStateWithLifecycle()
    val tableActiveTimestamps by billingViewModel.tableActiveTimestamps.collectAsStateWithLifecycle()
    val tableCarts by billingViewModel.tableCarts.collectAsStateWithLifecycle()
    val customerHistory by billingViewModel.customerHistory.collectAsStateWithLifecycle()
    val staffList by billingViewModel.staffList.collectAsStateWithLifecycle()
    val flowState by billingViewModel.flowState.collectAsStateWithLifecycle()
    val activeFlow by billingViewModel.activeFlow.collectAsStateWithLifecycle()
    val selectedTable by billingViewModel.selectedTable.collectAsStateWithLifecycle()
    val isLoading by billingViewModel.isLoading.collectAsStateWithLifecycle()
    val error by billingViewModel.error.collectAsStateWithLifecycle()
    val orderSuccess by billingViewModel.orderSuccess.collectAsStateWithLifecycle()
    val editingOrderId by billingViewModel.editingOrderId.collectAsStateWithLifecycle()
    val posSettings by billingViewModel.posSettings.collectAsStateWithLifecycle()
    val optionGroups by billingViewModel.optionGroups.collectAsStateWithLifecycle()
    val selectedPriceTier by billingViewModel.selectedPriceTier.collectAsStateWithLifecycle()
    val currentOrderType by billingViewModel.currentOrderType.collectAsStateWithLifecycle()
    var selectedItemForModifiers by remember { mutableStateOf<MenuItem?>(null) }

    val BgDark = MaterialTheme.colorScheme.background
    val CardDark = MaterialTheme.colorScheme.surface
    val CardBorderDark = MaterialTheme.colorScheme.outline
    val InputDark = MaterialTheme.colorScheme.surfaceVariant
    val TextPrimary = MaterialTheme.colorScheme.onBackground
    val TextSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    val isTableOccupied = remember(selectedTable, activeOrders) {
        val tbl = selectedTable
        tbl != null && activeOrders.any {
            it.tableNumber == tbl.tableName ||
            it.tableName == tbl.tableName ||
            it.tableNumber == tbl.id.toString()
        }
    }

    val activeOrder = remember(editingOrderId, activeOrders) {
        activeOrders.find { it.id == editingOrderId }
    }

    // Sub-tab state for ordering view (mirroring Order/KOT and Billing tabs of Windows POS)
    var activeSubTab by remember(flowState, activeFlow, selectedTable, editingOrderId) {
        mutableStateOf(if ((activeFlow == "DINEIN" && isTableOccupied) || editingOrderId != null) "BILLING" else "MENU")
    }

    // Food Type filter for catalog menu (ALL, VEG, NON-VEG)
    var foodTypeFilter by remember(flowState, activeFlow) { mutableStateOf("ALL") }

    // Table Department filter for select table screen (ALL, AC, Non-AC etc)
    var selectedDepartment by remember(flowState, activeFlow) { mutableStateOf("ALL") }

    // Billing Inputs state at screen level (persistent per session)
    var customerName by remember(flowState, activeFlow, selectedTable, posSettings) {
        val tbl = selectedTable
        val defaultName = if (posSettings.tableNameAsCustomerName) {
            if (activeFlow == "DINEIN" && tbl != null) {
                tbl.tableName
            } else {
                when (activeFlow) {
                    "QUICK_BILL" -> "Quick Bill"
                    "TAKEAWAY_DELIVERY" -> "Direct"
                    "PREORDER" -> "Pre Order"
                    else -> ""
                }
            }
        } else {
            ""
        }
        mutableStateOf(defaultName)
    }
    var customerPhone by remember(flowState, activeFlow, selectedTable) { mutableStateOf("") }
    var customerAddress by remember(flowState, activeFlow, selectedTable) { mutableStateOf("") }
    var orderType by remember(flowState, activeFlow, selectedTable) {
        mutableStateOf(
            when (activeFlow) {
                "DINEIN" -> "DINE-IN"
                "PREORDER" -> "PRE-ORDER"
                else -> "TAKEAWAY"
            }
        )
    }
    var paymentMethod by remember(flowState, activeFlow, selectedTable) { mutableStateOf("CASH") }
    var discountInput by remember(flowState, activeFlow, selectedTable) { mutableStateOf("") }
    var serviceChargeInput by remember(flowState, activeFlow, selectedTable) { mutableStateOf("") }
    var deliveryChargeInput by remember(flowState, activeFlow, selectedTable) { mutableStateOf("") }
    var preOrderIdInput by remember(flowState, activeFlow, selectedTable) {
        mutableStateOf("PRE-" + System.currentTimeMillis().toString().takeLast(6))
    }
    var advancePaidInput by remember(flowState, activeFlow, selectedTable) { mutableStateOf("") }
    var preOrderDate by remember(flowState, activeFlow, selectedTable) {
        val sdf = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.getDefault())
        mutableStateOf(sdf.format(java.util.Date()))
    }
    var preOrderTime by remember(flowState, activeFlow, selectedTable) {
        val sdf = java.text.SimpleDateFormat("HH:mm", java.util.Locale.getDefault())
        mutableStateOf(sdf.format(java.util.Date()))
    }
    var preOrderTypeInput by remember(flowState, activeFlow, selectedTable) {
        mutableStateOf("PICKUP")
    }

    val context = LocalContext.current
    var kotNote by remember(flowState, activeFlow, selectedTable) { mutableStateOf("") }
    var coversCount by remember(flowState, activeFlow, selectedTable) { mutableStateOf("") }
    var ebillEnabled by remember(flowState, activeFlow, selectedTable) { mutableStateOf(false) }
    var selectedWaiter by remember(flowState, activeFlow, selectedTable) { mutableStateOf<String?>(null) }
    var isComplimentaryOrder by remember(flowState, activeFlow, selectedTable) { mutableStateOf(false) }

    var showDiscountDialog by remember { mutableStateOf(false) }
    var showChargesDialog by remember { mutableStateOf(false) }
    var showWaiterDialog by remember { mutableStateOf(false) }
    var showHistoryDialog by remember { mutableStateOf(false) }
    var showPreviewDialog by remember { mutableStateOf(false) }
    var showCustomerDialog by remember { mutableStateOf(false) }
    var showNoteDialog by remember { mutableStateOf(false) }
    var showPaymentDialog by remember { mutableStateOf(false) }
    var showOldKotDialog by remember { mutableStateOf(false) }
    var showSplitBillDialog by remember { mutableStateOf(false) }
    var showCategoryMenu by remember { mutableStateOf(false) }
    var selectedDialCode by remember(flowState, activeFlow, selectedTable) { mutableStateOf("+91") }
    var selectedCountryFlag by remember(flowState, activeFlow, selectedTable) { mutableStateOf("🇮🇳") }
    var selectedCountryCode by remember(flowState, activeFlow, selectedTable) { mutableStateOf("IN") }
    var showCountryDropdown by remember { mutableStateOf(false) }

    // Combine old KOT items + new cart items for billing
    val billingItems = remember(oldKotItems, cart) {
        val combined = oldKotItems.toMutableMap()
        cart.forEach { (item, qty) ->
            combined[item] = (combined[item] ?: 0) + qty
        }
        combined.toMap()
    }

    var hasAutoRedirected by remember { mutableStateOf(false) }
    LaunchedEffect(posSettings, flowState, user) {
        if (!hasAutoRedirected && flowState == BillingFlowState.SELECT_FLOW) {
            hasAutoRedirected = true
            when (posSettings.defaultTab) {
                "Dine In" -> {
                    if (user == null || user.isMposAllowed("Dine In")) {
                        billingViewModel.selectFlow("DINEIN")
                    }
                }
                "Quick Bill" -> {
                    if (user == null || user.isMposAllowed("Quick Bill")) {
                        billingViewModel.selectFlow("QUICK_BILL")
                    }
                }
                "PickUp" -> {
                    if (user == null || user.isMposAllowed("Pickup")) {
                        billingViewModel.selectFlow("TAKEAWAY_DELIVERY")
                    }
                }
                "Delivery" -> {
                    if (user == null || user.isMposAllowed("Delivery")) {
                        billingViewModel.selectFlow("TAKEAWAY_DELIVERY")
                    }
                }
                "Pre Order" -> {
                    billingViewModel.selectFlow("PREORDER")
                }
            }
        }
    }

    LaunchedEffect(orderType) {
        billingViewModel.setCurrentOrderType(orderType)
    }

    // Populate customer details automatically if editing an active order
    LaunchedEffect(selectedTable, activeOrders, editingOrderId, activeFlow) {
        val table = selectedTable
        val activeOrder = if (activeFlow == "DINEIN" && table != null) {
            activeOrders.find {
                it.tableNumber == table.tableName ||
                        it.tableName == table.tableName ||
                        it.tableNumber == table.id.toString()
            }
        } else if (editingOrderId != null) {
            activeOrders.find { it.id == editingOrderId }
        } else {
            null
        }

        if (activeOrder != null) {
            val isCurrentPhoneEmpty = customerPhone.isBlank()
            val isCurrentNameEmpty = customerName.isBlank() || 
                    customerName == "Walk-in" ||
                    customerName == "Quick Bill" || 
                    customerName == "Direct" || 
                    customerName == "Pre Order" || 
                    (table != null && customerName == table.tableName)

            if (isCurrentPhoneEmpty || isCurrentNameEmpty) {
                if (isCurrentNameEmpty) {
                    customerName = activeOrder.customerName ?: ""
                }
                val rawAddress = activeOrder.address ?: ""
                if (activeFlow == "PREORDER" && rawAddress.startsWith("Scheduled: ")) {
                    try {
                        val parts = rawAddress.split(" | ")
                        val schedPart = parts.getOrNull(0)?.removePrefix("Scheduled: ") ?: ""
                        val schedSubParts = schedPart.split(" ")
                        preOrderDate = schedSubParts.getOrNull(0) ?: preOrderDate
                        preOrderTime = schedSubParts.getOrNull(1) ?: preOrderTime
                        
                        val addrPart = parts.getOrNull(1)?.removePrefix("Address: ") ?: ""
                        customerAddress = addrPart
                        
                        val typePart = parts.getOrNull(2)?.removePrefix("Type: ") ?: ""
                        if (typePart.isNotBlank()) {
                            preOrderTypeInput = typePart
                        }
                    } catch (e: Exception) {
                        customerAddress = rawAddress
                    }
                } else {
                    customerAddress = rawAddress
                }
                if (isCurrentPhoneEmpty) {
                    val rawPhone = activeOrder.customerNumber ?: ""
                    val parsed = parsePhoneNumber(rawPhone)
                    selectedCountryCode = parsed.first
                    selectedCountryFlag = parsed.second
                    selectedDialCode = parsed.third
                    
                    val sortedCodes = countryCodes.sortedByDescending { it.dialCode.length }
                    val country = sortedCodes.find { rawPhone.startsWith(it.dialCode) }
                    if (country != null) {
                        selectedCountryCode = country.code
                        selectedCountryFlag = country.flag
                        selectedDialCode = country.dialCode
                        customerPhone = rawPhone.substring(country.dialCode.length)
                    } else {
                        val dialCodeNoPlus = sortedCodes.find { rawPhone.startsWith(it.dialCode.removePrefix("+")) }
                        if (dialCodeNoPlus != null) {
                            selectedCountryCode = dialCodeNoPlus.code
                            selectedCountryFlag = dialCodeNoPlus.flag
                            selectedDialCode = dialCodeNoPlus.dialCode
                            customerPhone = rawPhone.substring(dialCodeNoPlus.dialCode.removePrefix("+").length)
                        } else {
                            selectedCountryCode = "IN"
                            selectedCountryFlag = "🇮🇳"
                            selectedDialCode = "+91"
                            customerPhone = rawPhone
                        }
                    }
                }
                paymentMethod = activeOrder.paymentMethod ?: "CASH"
            }
        }
    }

    val filteredItems = catalog.filter { item ->
        val matchesCategory = selectedCategory == "ALL" || item.category == selectedCategory
        val isNonVeg = item.subCategory?.lowercase()?.contains("non") == true ||
                item.displayName.lowercase().contains("chicken") ||
                item.displayName.lowercase().contains("mutton")
        val matchesFoodType = when (foodTypeFilter) {
            "VEG" -> !isNonVeg
            "NON-VEG" -> isNonVeg
            else -> true
        }
        val matchesSearch = item.displayName.contains(searchQuery, ignoreCase = true) ||
                (item.description?.contains(searchQuery, ignoreCase = true) == true) ||
                (item.code?.contains(searchQuery, ignoreCase = true) == true)
        matchesCategory && matchesFoodType && matchesSearch
    }

    val sortedItems = remember(filteredItems, posSettings.sortItemsBy) {
        when (posSettings.sortItemsBy) {
            "alphabetical" -> filteredItems.sortedBy { it.displayName }
            "short_code" -> filteredItems.sortedBy { it.code ?: "" }
            else -> filteredItems
        }
    }

    // Success notification dialog
    if (orderSuccess == true) {
        AlertDialog(
            onDismissRequest = { billingViewModel.resetOrderSuccess() },
            title = { Text("Success", color = Color.White, fontWeight = FontWeight.Bold) },
            text = { Text("POS Order processed successfully!", color = TextPrimary) },
            confirmButton = {
                TextButton(
                    onClick = { billingViewModel.resetOrderSuccess() },
                    colors = ButtonDefaults.textButtonColors(contentColor = SaSGreen)
                ) {
                    Text("OK", fontWeight = FontWeight.Bold)
                }
            },
            containerColor = CardDark
        )
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            // ── Top Header ──────────────────────────────────────────────
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(CardDark)
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (flowState != BillingFlowState.SELECT_FLOW) {
                        IconButton(
                            onClick = { billingViewModel.goBack() },
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary, modifier = Modifier.size(20.dp))
                        }
                        Spacer(modifier = Modifier.width(6.dp))
                    }
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = when (flowState) {
                                BillingFlowState.SELECT_FLOW -> "POS Billing"
                                BillingFlowState.SELECT_TABLE -> "Select Table"
                                BillingFlowState.ORDERING -> {
                                    when (activeFlow) {
                                        "DINEIN" -> "Table: ${selectedTable?.tableName ?: "Unknown"}"
                                        "TAKEAWAY_DELIVERY" -> "Takeaway / Delivery"
                                        "QUICK_BILL" -> "Quick Bill"
                                        "PREORDER" -> "Pre-Order"
                                        else -> "POS Billing"
                                    }
                                }
                            },
                            color = TextPrimary,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Black
                        )
                        if (flowState == BillingFlowState.ORDERING && activeFlow == "DINEIN" && selectedTable?.departmentName != null) {
                            Text(
                                text = "  •  ${selectedTable?.departmentName ?: ""}",
                                color = TextSecondary,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }

                // Header Right Actions
                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (flowState == BillingFlowState.SELECT_TABLE) {
                        IconButton(onClick = { billingViewModel.fetchTablesAndActiveOrders() }) {
                            Icon(Icons.Default.Refresh, "Refresh", tint = SaSGreen)
                        }
                    } else if (flowState == BillingFlowState.ORDERING) {
                        IconButton(onClick = { billingViewModel.loadCatalogAndCategories() }) {
                            Icon(Icons.Default.Refresh, "Refresh Menu", tint = SaSGreen)
                        }
                        if (cart.isNotEmpty()) {
                            IconButton(onClick = { billingViewModel.clearCart() }) {
                                Icon(Icons.Default.Clear, "Clear Cart", tint = StatusDanger)
                            }
                        }
                    }
                }
            }

            HorizontalDivider(color = CardBorderDark)

            // ── Screen Content ──────────────────────────────────────────
            when (flowState) {
                BillingFlowState.SELECT_FLOW -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(20.dp),
                        verticalArrangement = Arrangement.Center,
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "CHOOSE TERMINAL FLOW",
                            color = TextSecondary,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 2.sp,
                            modifier = Modifier.padding(bottom = 24.dp)
                        )

                        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(16.dp)
                            ) {
                                if (!posSettings.disableTabDineIn && (user == null || user.isMposAllowed("Dine In"))) {
                                    FlowCard(
                                        modifier = Modifier.weight(1f),
                                        title = "Dine In",
                                        subtext = "Table KOTs & Bills",
                                        icon = Icons.Default.Restaurant,
                                        iconColor = SaSGreen,
                                        onClick = { billingViewModel.selectFlow("DINEIN") }
                                    )
                                }
                                if (!posSettings.disableTabPickup && (user == null || user.isMposAllowed("Pickup") || user.isMposAllowed("Delivery"))) {
                                    FlowCard(
                                        modifier = Modifier.weight(1f),
                                        title = "Takeaway / Delivery",
                                        subtext = "Counter & Home orders",
                                        icon = Icons.Default.LocalShipping,
                                        iconColor = StatusInfo,
                                        onClick = { billingViewModel.selectFlow("TAKEAWAY_DELIVERY") }
                                    )
                                }
                            }
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(16.dp)
                            ) {
                                if (!posSettings.disableTabQuickBill && (user == null || user.isMposAllowed("Quick Bill"))) {
                                    FlowCard(
                                        modifier = Modifier.weight(1f),
                                        title = "Quick Bill",
                                        subtext = "Direct billing & payment",
                                        icon = Icons.Default.FlashOn,
                                        iconColor = SaSGreenLight,
                                        onClick = { billingViewModel.selectFlow("QUICK_BILL") }
                                    )
                                }
                                if (!posSettings.disableTabPreOrder) {
                                    FlowCard(
                                        modifier = Modifier.weight(1f),
                                        title = "Pre-Order",
                                        subtext = "Bookings & advances",
                                        icon = Icons.Default.EventNote,
                                        iconColor = StatusWarning,
                                        onClick = { billingViewModel.selectFlow("PREORDER") }
                                    )
                                }
                            }
                        }
                    }
                }

                BillingFlowState.SELECT_TABLE -> {
                    if (isLoading && tables.isEmpty()) {
                        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                            CircularProgressIndicator(color = SaSGreen)
                        }
                    } else {
                        // Extract unique departments from tables list
                        val departments = remember(tables) {
                            listOf("ALL") + tables.mapNotNull { it.departmentName }.distinct()
                        }
                        // Filter tables by department
                        val filteredTables = remember(tables, selectedDepartment) {
                            if (selectedDepartment == "ALL") tables else tables.filter { it.departmentName == selectedDepartment }
                        }

                        Column(modifier = Modifier.fillMaxSize()) {
                            // Department Filter Chips
                            if (posSettings.showTableDepartments && departments.size > 1) {
                                LazyRow(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(CardDark)
                                        .padding(horizontal = 16.dp, vertical = 10.dp),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    items(departments) { dept ->
                                        val isSelected = selectedDepartment == dept
                                        FilterChip(
                                            selected = isSelected,
                                            onClick = { selectedDepartment = dept },
                                            label = { Text(dept.uppercase(), fontSize = 11.sp, fontWeight = FontWeight.Bold) },
                                            colors = FilterChipDefaults.filterChipColors(
                                                selectedContainerColor = SaSGreen,
                                                selectedLabelColor = Color.White,
                                                containerColor = InputDark,
                                                labelColor = TextSecondary
                                            ),
                                            border = FilterChipDefaults.filterChipBorder(
                                                enabled = true,
                                                selected = isSelected,
                                                borderColor = CardBorderDark,
                                                selectedBorderColor = SaSGreen
                                            )
                                        )
                                    }
                                }
                                HorizontalDivider(color = CardBorderDark)
                            }

                            LazyVerticalGrid(
                                columns = GridCells.Fixed(2),
                                modifier = Modifier.fillMaxSize(),
                                contentPadding = PaddingValues(16.dp),
                                horizontalArrangement = Arrangement.spacedBy(12.dp),
                                verticalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                items(filteredTables) { table ->
                                    val activeOrder = activeOrders.find {
                                        it.tableNumber == table.tableName ||
                                                it.tableName == table.tableName ||
                                                it.tableNumber == table.id.toString()
                                    }
                                    val draftCartForTable = remember(tableCarts, table.tableName) {
                                        tableCarts[table.tableName] ?: emptyMap()
                                    }
                                    val hasDraft = draftCartForTable.isNotEmpty()
                                    val resolvedStatus = remember(tableStatuses, activeOrder, hasDraft) {
                                        if (hasDraft) {
                                            "ITEMS_IN_KOT"
                                        } else {
                                            val serverStatus = tableStatuses[table.id.toString()]
                                            if (serverStatus != null && serverStatus.uppercase() != "AVAILABLE") {
                                                serverStatus
                                            } else if (activeOrder != null) {
                                                "SAVED"
                                            } else {
                                                "AVAILABLE"
                                            }
                                        }
                                    }

                                    val draftTotal = remember(draftCartForTable) {
                                        draftCartForTable.entries.sumOf { (item, qty) -> item.price * qty }
                                    }
                                    val draftCount = remember(draftCartForTable) {
                                        draftCartForTable.values.sum()
                                    }

                                    val savedCount = remember(activeOrder) {
                                        if (activeOrder?.items != null) {
                                            try {
                                                val jsonStr = if (activeOrder.items is String) activeOrder.items else com.google.gson.Gson().toJson(activeOrder.items)
                                                val typeToken = object : com.google.gson.reflect.TypeToken<List<Map<String, Any>>>() {}.type
                                                val list = com.google.gson.Gson().fromJson<List<Map<String, Any>>>(jsonStr, typeToken)
                                                list.sumOf { (it["qty"] ?: it["quantity"] ?: 1).toString().toDoubleOrNull()?.toInt() ?: 1 }
                                            } catch (e: Exception) {
                                                1
                                            }
                                        } else 0
                                    }

                                    val activeTimestamp = tableActiveTimestamps[table.tableName]
                                        ?: tableActiveTimestamps[table.id.toString()]
                                        ?: activeOrder?.createdAt?.let {
                                            try {
                                                java.time.Instant.parse(it).toEpochMilli()
                                            } catch (e: Exception) {
                                                try {
                                                    val sdf = java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", java.util.Locale.US)
                                                    sdf.timeZone = java.util.TimeZone.getTimeZone("UTC")
                                                    sdf.parse(it)?.time
                                                } catch (e2: Exception) {
                                                    null
                                                }
                                            }
                                        }
                                    TableCard(
                                        table = table,
                                        status = resolvedStatus,
                                        orderTotal = if (posSettings.isTaxInclusive) {
                                             val tableSubtotal = (activeOrder?.subtotal ?: activeOrder?.totalPrice ?: 0.0) + draftTotal
                                             val tableServiceCharge = if (posSettings.enableServiceCharge) tableSubtotal * (posSettings.serviceChargeRate / 100.0) else 0.0
                                             val rawTotal = tableSubtotal + tableServiceCharge
                                             if (posSettings.autoRoundOff) Math.round(rawTotal).toDouble() else rawTotal
                                         } else {
                                             val tableSubtotal = (activeOrder?.subtotal ?: activeOrder?.totalPrice ?: 0.0) + draftTotal
                                             val tableTax = tableSubtotal * (posSettings.taxRate / 100.0)
                                             val tableServiceCharge = if (posSettings.enableServiceCharge) tableSubtotal * (posSettings.serviceChargeRate / 100.0) else 0.0
                                             val rawTotal = tableSubtotal + tableTax + tableServiceCharge
                                             if (posSettings.autoRoundOff) Math.round(rawTotal).toDouble() else rawTotal
                                         },
                                        orderItemsCount = savedCount + draftCount,
                                        onClick = { billingViewModel.selectTable(table) },
                                        showBillDetails = posSettings.showBillDetailsOnTable,
                                        showOrderStatus = posSettings.showOrderStatusOnTable,
                                        currency = posSettings.currency,
                                        decimalPlaces = posSettings.decimalPlaces,
                                        showKOTNoOnTable = posSettings.showKOTNoOnTable,
                                        displayTimeOnTable = posSettings.displayTimeOnTable,
                                        activeOrder = activeOrder,
                                        activeTimestamp = activeTimestamp,
                                        isSelected = selectedTable?.id == table.id
                                    )
                                }
                            }
                        }
                    }
                }

                BillingFlowState.ORDERING -> {
                    Column(modifier = Modifier.fillMaxSize()) {
                        // Sub-Tab Switcher (Menu vs Order/KOT vs Billing)
                        val selectedTabIndex = when (activeSubTab) {
                            "MENU" -> 0
                            "KOT" -> 1
                            "BILLING" -> 2
                            else -> 0
                        }
                        TabRow(
                            selectedTabIndex = selectedTabIndex,
                            containerColor = CardDark,
                            contentColor = SaSGreen,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Tab(
                                selected = activeSubTab == "MENU",
                                onClick = { activeSubTab = "MENU" },
                                text = {
                                    Text(
                                        text = "Menu",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.sp,
                                        color = if (activeSubTab == "MENU") SaSGreen else TextSecondary
                                    )
                                }
                            )
                            Tab(
                                selected = activeSubTab == "KOT",
                                onClick = { activeSubTab = "KOT" },
                                text = {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            text = "Order/KOT",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 13.sp,
                                            color = if (activeSubTab == "KOT") SaSGreen else TextSecondary
                                        )
                                        val totalItems = cart.values.sum()
                                        if (totalItems > 0) {
                                            Spacer(Modifier.width(6.dp))
                                            Surface(
                                                color = SaSGreen,
                                                shape = CircleShape,
                                                modifier = Modifier.size(16.dp)
                                            ) {
                                                Box(contentAlignment = Alignment.Center) {
                                                    Text(
                                                        text = "$totalItems",
                                                        color = Color.White,
                                                        fontSize = 9.sp,
                                                        fontWeight = FontWeight.Bold
                                                    )
                                                }
                                            }
                                        }
                                    }
                                }
                            )
                            Tab(
                                selected = activeSubTab == "BILLING",
                                onClick = { activeSubTab = "BILLING" },
                                text = {
                                    Text(
                                        text = "Billing",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.sp,
                                        color = if (activeSubTab == "BILLING") SaSGreen else TextSecondary
                                    )
                                }
                            )
                        }

                        HorizontalDivider(color = CardBorderDark)

                        when (activeSubTab) {
                            "MENU" -> {
                                MenuSubTab(
                                    searchQuery = searchQuery,
                                    foodTypeFilter = foodTypeFilter,
                                    onFoodTypeFilterChange = { foodTypeFilter = it },
                                    selectedCategory = selectedCategory,
                                    categories = categories,
                                    isLoading = isLoading,
                                    error = error,
                                    sortedItems = sortedItems,
                                    cart = cart,
                                    oldKotItems = oldKotItems,
                                    selectedPriceTier = selectedPriceTier,
                                    currentOrderType = currentOrderType,
                                    optionGroups = optionGroups,
                                    posSettings = posSettings,
                                    billingViewModel = billingViewModel,
                                    onSelectItemForModifiers = { selectedItemForModifiers = it },
                                    onActiveSubTabChange = { activeSubTab = it }
                                )
                            }
                            "KOT" -> {
                                KotSubTab(
                                    editingOrderId = editingOrderId,
                                    activeOrders = activeOrders,
                                    selectedTable = selectedTable,
                                    cart = cart,
                                    oldKotItems = oldKotItems,
                                    activeFlow = activeFlow,
                                    preOrderDate = preOrderDate,
                                    onPreOrderDateChange = { preOrderDate = it },
                                    preOrderTime = preOrderTime,
                                    onPreOrderTimeChange = { preOrderTime = it },
                                    preOrderTypeInput = preOrderTypeInput,
                                    onPreOrderTypeInputChange = { preOrderTypeInput = it },
                                    customerName = customerName,
                                    onCustomerNameChange = { customerName = it },
                                    customerPhone = customerPhone,
                                    onCustomerPhoneChange = { customerPhone = it },
                                    selectedDialCode = selectedDialCode,
                                    onSelectedDialCodeChange = { selectedDialCode = it },
                                    customerAddress = customerAddress,
                                    onCustomerAddressChange = { customerAddress = it },
                                    selectedWaiter = selectedWaiter,
                                    posSettings = posSettings,
                                    billingViewModel = billingViewModel,
                                    user = user,
                                    context = context,
                                    onActiveSubTabChange = { activeSubTab = it },
                                    kotNote = kotNote,
                                    onKotNoteChange = { kotNote = it },
                                    coversCount = coversCount,
                                    onCoversCountChange = { coversCount = it },
                                    isComplimentaryOrder = isComplimentaryOrder,
                                    onIsComplimentaryOrderChange = { isComplimentaryOrder = it },
                                    ebillEnabled = ebillEnabled,
                                    onEbillEnabledChange = { ebillEnabled = it },
                                    selectedCountryFlag = selectedCountryFlag,
                                    onSelectedCountryFlagChange = { selectedCountryFlag = it },
                                    selectedCountryCode = selectedCountryCode,
                                    onSelectedCountryCodeChange = { selectedCountryCode = it },
                                    showCountryDropdown = showCountryDropdown,
                                    onShowCountryDropdownChange = { showCountryDropdown = it },
                                    onShowDiscountDialogChange = { showDiscountDialog = it },
                                    onShowChargesDialogChange = { showChargesDialog = it },
                                    onShowWaiterDialogChange = { showWaiterDialog = it },
                                    onShowHistoryDialogChange = { showHistoryDialog = it },
                                    onClearAllFields = {
                                        customerPhone = ""
                                        customerName = ""
                                        customerAddress = ""
                                        kotNote = ""
                                        coversCount = ""
                                        selectedWaiter = null
                                        isComplimentaryOrder = false
                                        billingViewModel.clearCart()
                                    }
                                )
                            }
                            "BILLING" -> {
                                BillingSubTab(
                                    billingItems = billingItems,
                                    posSettings = posSettings,
                                    orderType = orderType,
                                    discountInput = discountInput,
                                    onDiscountInputChange = { discountInput = it },
                                    serviceChargeInput = serviceChargeInput,
                                    onServiceChargeInputChange = { serviceChargeInput = it },
                                    deliveryChargeInput = deliveryChargeInput,
                                    onDeliveryChargeInputChange = { deliveryChargeInput = it },
                                    advancePaidInput = advancePaidInput,
                                    onAdvancePaidInputChange = { advancePaidInput = it },
                                    isComplimentaryOrder = isComplimentaryOrder,
                                    onIsComplimentaryOrderChange = { isComplimentaryOrder = it },
                                    customerName = customerName,
                                    customerPhone = customerPhone,
                                    customerAddress = customerAddress,
                                    preOrderDate = preOrderDate,
                                    preOrderTime = preOrderTime,
                                    preOrderTypeInput = preOrderTypeInput,
                                    editingOrderId = editingOrderId,
                                    preOrderIdInput = preOrderIdInput,
                                    activeFlow = activeFlow,
                                    selectedTable = selectedTable,
                                    selectedWaiter = selectedWaiter,
                                    user = user,
                                    billingViewModel = billingViewModel,
                                    context = context,
                                    onShowPaymentDialogChange = { showPaymentDialog = it },
                                    onShowOldKotDialogChange = { showOldKotDialog = it },
                                    onShowSplitBillDialogChange = { showSplitBillDialog = it },
                                    onShowPreviewDialogChange = { showPreviewDialog = it },
                                    onShowDiscountDialogChange = { showDiscountDialog = it },
                                    onShowChargesDialogChange = { showChargesDialog = it },
                                    onShowWaiterDialogChange = { showWaiterDialog = it },
                                    onShowHistoryDialogChange = { showHistoryDialog = it },
                                    ebillEnabled = ebillEnabled,
                                    onEbillEnabledChange = { ebillEnabled = it },
                                    selectedDialCode = selectedDialCode,
                                    paymentMethod = paymentMethod
                                )
                            }
                        }
                    }
                }
            }

            if (showPaymentDialog) {
                PaymentDialog(
                    onDismissRequest = { showPaymentDialog = false },
                    billingItems = billingItems,
                    discountInput = discountInput,
                    serviceChargeInput = serviceChargeInput,
                    deliveryChargeInput = deliveryChargeInput,
                    posSettings = posSettings,
                    orderType = orderType,
                    isComplimentaryOrder = isComplimentaryOrder,
                    advancePaidInput = advancePaidInput,
                    paymentMethod = paymentMethod,
                    onPaymentMethodChange = { paymentMethod = it },
                    customerName = customerName,
                    customerPhone = customerPhone,
                    selectedDialCode = selectedDialCode,
                    customerAddress = customerAddress,
                    activeFlow = activeFlow,
                    preOrderDate = preOrderDate,
                    preOrderTime = preOrderTime,
                    preOrderTypeInput = preOrderTypeInput,
                    preOrderIdInput = preOrderIdInput,
                    selectedTable = selectedTable,
                    selectedWaiter = selectedWaiter,
                    user = user,
                    billingViewModel = billingViewModel,
                    context = context
                )
            }

            val itemForModifiers = selectedItemForModifiers
            if (itemForModifiers != null) {
                ItemCustomizationDialog(
                    item = itemForModifiers,
                    optionGroups = optionGroups,
                    onDismiss = { selectedItemForModifiers = null },
                    onAdd = { selected, note ->
                        billingViewModel.addCustomItemToCart(itemForModifiers, selected, note)
                        selectedItemForModifiers = null
                    },
                    currency = posSettings.currency
                )
            }

            if (showOldKotDialog) {
                OldKotDialog(
                    onDismissRequest = { showOldKotDialog = false },
                    oldKotItems = oldKotItems,
                    billingViewModel = billingViewModel,
                    posSettings = posSettings,
                    context = context,
                    user = user
                )
            }

            if (showSplitBillDialog) {
                SplitBillDialog(
                    onDismissRequest = { showSplitBillDialog = false },
                    billingItems = billingItems,
                    posSettings = posSettings,
                    orderType = orderType,
                    discountInput = discountInput,
                    serviceChargeInput = serviceChargeInput,
                    deliveryChargeInput = deliveryChargeInput,
                    isComplimentaryOrder = isComplimentaryOrder,
                    context = context
                )
            }

            if (showWaiterDialog) {
                WaiterSelectionDialog(
                    onDismissRequest = { showWaiterDialog = false },
                    staffList = staffList,
                    selectedWaiter = selectedWaiter,
                    onSelectWaiter = { selectedWaiter = it }
                )
            }

            if (showPreviewDialog) {
                val currentActiveOrder = remember(selectedTable, activeOrders, editingOrderId, activeFlow) {
                    val table = selectedTable
                    if (activeFlow == "DINEIN" && table != null) {
                        activeOrders.find {
                            it.tableNumber == table.tableName ||
                                    it.tableName == table.tableName ||
                                    it.tableNumber == table.id.toString()
                        }
                    } else if (editingOrderId != null) {
                        activeOrders.find { it.id == editingOrderId }
                    } else {
                        null
                    }
                }
                val previewBillNo = currentActiveOrder?.billNo ?: currentActiveOrder?.id?.toString() ?: "PREVIEW"

                PreviewDialog(
                    onDismissRequest = { showPreviewDialog = false },
                    billingItems = billingItems,
                    discountInput = discountInput,
                    serviceChargeInput = serviceChargeInput,
                    deliveryChargeInput = deliveryChargeInput,
                    posSettings = posSettings,
                    orderType = orderType,
                    isComplimentaryOrder = isComplimentaryOrder,
                    customerName = customerName,
                    customerPhone = customerPhone,
                    selectedDialCode = selectedDialCode,
                    customerAddress = customerAddress,
                    activeFlow = activeFlow,
                    selectedTable = selectedTable,
                    selectedWaiter = selectedWaiter,
                    user = user,
                    billingViewModel = billingViewModel,
                    context = context,
                    billNo = previewBillNo
                )
            }
        }
    }
}

// ── Flow Card ────────────────────────────────────────────────────────
@Composable
private fun FlowCard(
    modifier: Modifier = Modifier,
    title: String,
    subtext: String,
    icon: ImageVector,
    iconColor: Color,
    onClick: () -> Unit
) {
    val cardColor = MaterialTheme.colorScheme.surface
    val borderColor = MaterialTheme.colorScheme.outline
    val textSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    Card(
        modifier = modifier
            .height(130.dp)
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = cardColor),
        border = BorderStroke(1.dp, borderColor)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(14.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(iconColor.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, null, tint = iconColor, modifier = Modifier.size(20.dp))
            }
            Column {
                Text(title, color = MaterialTheme.colorScheme.onSurface, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(3.dp))
                Text(subtext, color = textSecondary, fontSize = 10.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
            }
        }
    }
}

// ── Table Card ──────────────────────────────────────────────
@Composable
private fun TableCard(
    table: TableItem,
    status: String,
    orderTotal: Double?,
    orderItemsCount: Int,
    onClick: () -> Unit,
    showBillDetails: Boolean,
    showOrderStatus: Boolean,
    currency: String,
    decimalPlaces: Int,
    showKOTNoOnTable: Boolean,
    displayTimeOnTable: Boolean,
    activeOrder: com.example.sasloopmanager.data.Order?,
    activeTimestamp: Long?,
    isSelected: Boolean = false
) {
    val statusUpper = status.uppercase()
    val isOccupied = statusUpper != "AVAILABLE" && statusUpper != "VACANT"

    var ticks by remember { mutableStateOf(0) }
    if (displayTimeOnTable && activeTimestamp != null && activeTimestamp > 0) {
        LaunchedEffect(activeTimestamp) {
            while (true) {
                delay(60000L)
                ticks++
            }
        }
    }

    val statusColor = when (statusUpper) {
        "PRINTED" -> TableStatusPrinted
        "SAVED" -> TableStatusSaved
        "BILL_SAVED" -> TableStatusBillSaved
        "ITEMS_IN_KOT" -> TableStatusItemsInKot
        "DRAFT_PRINTED" -> TableStatusDraftPrinted
        "RESERVED" -> TableStatusReserved
        "ORDERING" -> TableStatusOrdering
        else -> TableStatusAvailable
    }

    val displayStatus = when (statusUpper) {
        "BILL_SAVED" -> "BILL SAVED"
        "ITEMS_IN_KOT" -> "ITEMS IN KOT"
        "DRAFT_PRINTED" -> "DRAFT PRINTED"
        "AVAILABLE" -> "VACANT"
        else -> statusUpper
    }

    val cardColor = statusColor
    val borderColor = Color.White.copy(alpha = 0.15f)
    val badgeBgColor = Color.White.copy(alpha = 0.2f)
    val badgeTextColor = Color.White

    val borderStroke = if (isSelected) {
        BorderStroke(3.5.dp, Color(0xFFE67E22))
    } else {
        BorderStroke(1.dp, borderColor)
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(105.dp)
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = cardColor),
        border = borderStroke
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp)
        ) {
            Column(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = table.tableName,
                        color = Color.White,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Black
                    )

                    Row(
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        if (displayTimeOnTable && activeTimestamp != null && activeTimestamp > 0) {
                            val elapsedMin = remember(activeTimestamp, ticks) {
                                (System.currentTimeMillis() - activeTimestamp) / (1000 * 60)
                            }
                            val elapsedStr = if (elapsedMin >= 60) "${elapsedMin / 60}h ${elapsedMin % 60}m" else "${elapsedMin}m"
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = Color.Black.copy(alpha = 0.25f)
                            ) {
                                Text(
                                    text = elapsedStr,
                                    color = Color.White,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp)
                                )
                            }
                        }

                        if (showKOTNoOnTable && activeOrder != null) {
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = Color.Black.copy(alpha = 0.25f)
                            ) {
                                Text(
                                    text = "KOT #${activeOrder.id}",
                                    color = Color.White,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp)
                                )
                            }
                        }

                        if (showOrderStatus) {
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = badgeBgColor,
                            ) {
                                Text(
                                    text = displayStatus,
                                    color = badgeTextColor,
                                    fontSize = 8.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp)
                                )
                            }
                        }
                    }
                }

                if (isOccupied && orderTotal != null && showBillDetails) {
                    Column {
                        Text(
                            text = "$orderItemsCount item(s)",
                            color = Color.White.copy(alpha = 0.7f),
                            fontSize = 11.sp
                        )
                        Text(
                            text = "$currency ${String.format(java.util.Locale.US, "%.${decimalPlaces}f", orderTotal)}",
                            color = Color.White,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                } else {
                    Text(
                        text = table.departmentName ?: "General Section",
                        color = Color.White.copy(alpha = 0.7f),
                        fontSize = 11.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}

// ── Menu Item Card ────────────────────────────────────────────────────────────
@Composable
private fun MenuItemCard(
    item: MenuItem,
    qtyInCart: Int,
    punchedQty: Int,
    onAdd: () -> Unit,
    onRemove: () -> Unit,
    isCompact: Boolean,
    currency: String,
    showItemCodeDetails: Boolean,
    decimalPlaces: Int,
    showItemImage: Boolean = true,
    showItemsDetails: Boolean = true,
    showItemsPrepTime: Boolean = true
) {
    val cardColor = MaterialTheme.colorScheme.surface
    val borderColor = MaterialTheme.colorScheme.outline
    val inputColor = MaterialTheme.colorScheme.surfaceVariant
    val textSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    val paddingVal = if (isCompact) 8.dp else 12.dp
    val nameSize = if (isCompact) 11.sp else 13.sp
    val priceSize = if (isCompact) 12.sp else 14.sp
    val buttonSize = if (isCompact) 22.dp else 26.dp
    val iconSize = if (isCompact) 10.dp else 14.dp
    val qtyTextSize = if (isCompact) 11.sp else 13.sp
    val spaceHeight = if (isCompact) 4.dp else 8.dp

    val isNonVeg = item.subCategory?.lowercase()?.contains("non") == true ||
        item.displayName.lowercase().contains("chicken") ||
        item.displayName.lowercase().contains("mutton")
    val foodTypeColor = if (isNonVeg) StatusDanger else SaSGreen

    val showVisualCard = showItemImage && !isCompact
    val hasImage = showItemImage && !item.imageUrl.isNullOrBlank()
    val imageUrl = item.imageUrl?.let { url ->
        if (url.startsWith("http")) {
            url
        } else {
            val cleanUrl = url.trimStart('/')
            BASE_URL.trimEnd('/') + "/" + cleanUrl
        }
    }
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = cardColor),
        border = BorderStroke(1.dp, borderColor)
    ) {
        if (showVisualCard) {
            // ── Image/Gradient Visual Card Layout (matches Windows POS) ──
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp)
            ) {
                if (hasImage && imageUrl != null) {
                    // Background image (global ImageLoader configured in SaSLoopApplication)
                    AsyncImage(
                        model = ImageRequest.Builder(LocalContext.current)
                            .data(imageUrl)
                            .crossfade(true)
                            .listener(
                                onError = { _, result -> 
                                    android.util.Log.e("CoilImage", "Error loading: $imageUrl, error: ${result.throwable.message}")
                                }
                            )
                            .build(),
                        contentDescription = item.displayName,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                } else {
                    // Nice gradient placeholder matching Windows POS style
                    val colors = listOf(
                        Color(0xFF34495e), Color(0xFF2c3e50), Color(0xFF16a085), Color(0xFF27ae60),
                        Color(0xFF2980b9), Color(0xFF8e44ad), Color(0xFFd35400), Color(0xFFc0392b)
                    )
                    val baseColor = colors[Math.abs(item.displayName.hashCode()) % colors.size]
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                Brush.linearGradient(
                                    colors = listOf(baseColor.copy(alpha = 0.65f), Color.Transparent)
                                )
                            )
                    )
                }
                // Gradient overlay from bottom
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                colors = listOf(
                                    Color.Transparent,
                                    Color.Black.copy(alpha = 0.25f),
                                    Color.Black.copy(alpha = 0.85f)
                                ),
                                startY = 0f,
                                endY = Float.POSITIVE_INFINITY
                            )
                        )
                )

                // Food type indicator (top-right)
                Surface(
                    shape = CircleShape,
                    color = foodTypeColor,
                    modifier = Modifier
                        .size(10.dp)
                        .align(Alignment.TopEnd)
                        .offset(x = (-8).dp, y = 8.dp)
                ) {}

                // Quantity badge (top-left) when items in cart
                val totalQty = qtyInCart + punchedQty
                if (totalQty > 0) {
                    Surface(
                        shape = CircleShape,
                        color = SaSGreen,
                        modifier = Modifier
                            .size(22.dp)
                            .align(Alignment.TopStart)
                            .offset(x = 6.dp, y = 6.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(
                                text = "$totalQty",
                                color = Color.White,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }

                // Prep Time Badge on Image layout (top-left, next to quantity if present)
                if (showItemsPrepTime) {
                    val resolvedPrepTime = item.prepTime ?: item.preparationTime ?: ((item.id % 3) * 5 + 10)
                    Surface(
                        shape = RoundedCornerShape(4.dp),
                        color = Color.Black.copy(alpha = 0.7f),
                        modifier = Modifier
                            .align(Alignment.TopStart)
                            .offset(x = if (totalQty > 0) 34.dp else 6.dp, y = 6.dp)
                    ) {
                        Text(
                            text = "🕒 ${resolvedPrepTime}m",
                            color = Color.White,
                            fontSize = 8.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                        )
                    }
                }

                // Bottom overlay: Name, code, price
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .align(Alignment.BottomStart)
                        .padding(horizontal = 8.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Bottom
                ) {
                    Column(modifier = Modifier.weight(1f, fill = false)) {
                        Text(
                            text = item.displayName,
                            color = Color.White,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis
                        )
                        if (showItemCodeDetails && !item.code.isNullOrBlank()) {
                            Text(
                                text = "#${item.code}",
                                color = Color.White.copy(alpha = 0.7f),
                                fontSize = 8.sp
                            )
                        }
                        if (showItemsDetails && !item.description.isNullOrBlank()) {
                            Text(
                                text = item.description,
                                color = Color.White.copy(alpha = 0.8f),
                                fontSize = 8.sp,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                    }
                    Spacer(Modifier.width(4.dp))
                    Text(
                        text = "$currency ${String.format(java.util.Locale.US, "%.${decimalPlaces}f", item.price)}",
                        color = Color.White,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                // Tap overlay to add
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .clickable { onAdd() }
                )
            }
        } else {
            // ── Text-only Card Layout (original) ──
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .then(if (!isCompact) Modifier.height(120.dp) else Modifier)
                    .padding(paddingVal)
            ) {
                // Veg/Non-veg Dot Indicator & Category
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Surface(
                            shape = CircleShape,
                            color = foodTypeColor,
                            modifier = Modifier.size(if (isCompact) 6.dp else 8.dp)
                        ) {}
                        if (showItemsPrepTime) {
                            val resolvedPrepTime = item.prepTime ?: item.preparationTime ?: ((item.id % 3) * 5 + 10)
                            Text(
                                text = "🕒 ${resolvedPrepTime}m",
                                color = textSecondary,
                                fontSize = 8.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                    Text(
                        text = item.category?.uppercase() ?: "MAIN",
                        color = textSecondary,
                        fontSize = 8.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Spacer(Modifier.height(spaceHeight))

                // Item Name
                Text(
                    text = item.displayName,
                    color = MaterialTheme.colorScheme.onSurface,
                    fontSize = nameSize,
                    fontWeight = FontWeight.Bold,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )

                if (showItemCodeDetails && !item.code.isNullOrBlank()) {
                    Spacer(Modifier.height(2.dp))
                    Text(
                        text = item.code,
                        color = textSecondary,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Medium
                    )
                }

                // Item Description
                if (showItemsDetails) {
                    item.description?.takeIf { it.isNotBlank() }?.let {
                        Spacer(Modifier.height(2.dp))
                        Text(
                            text = it,
                            color = textSecondary,
                            fontSize = if (isCompact) 8.sp else 10.sp,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }

                if (!isCompact) {
                    Spacer(Modifier.weight(1f))
                } else {
                    Spacer(Modifier.height(spaceHeight))
                }

                // Bottom controls: Price & Quantity buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "$currency ${String.format(java.util.Locale.US, "%.${decimalPlaces}f", item.price)}",
                        color = SaSGreen,
                        fontSize = priceSize,
                        fontWeight = FontWeight.Black
                    )

                    val totalQty = qtyInCart + punchedQty
                    if (totalQty > 0) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(if (isCompact) 4.dp else 8.dp)
                        ) {
                            val canRemove = qtyInCart > 0
                            Box(
                                modifier = Modifier
                                    .size(buttonSize)
                                    .clip(CircleShape)
                                    .background(
                                        if (canRemove) inputColor else Color.Transparent
                                    )
                                    .clickable(enabled = canRemove) { onRemove() },
                                contentAlignment = Alignment.Center
                            ) {
                                if (!canRemove) {
                                    Icon(Icons.Default.Lock, null, tint = textSecondary, modifier = Modifier.size(if (isCompact) 10.dp else 12.dp))
                                } else {
                                    Icon(Icons.Default.Remove, null, tint = MaterialTheme.colorScheme.onSurface, modifier = Modifier.size(iconSize))
                                }
                            }
                            Text(
                                text = "$totalQty",
                                color = MaterialTheme.colorScheme.onSurface,
                                fontSize = qtyTextSize,
                                fontWeight = FontWeight.Bold
                            )
                            Box(
                                modifier = Modifier
                                    .size(buttonSize)
                                    .clip(CircleShape)
                                    .background(SaSGreen)
                                    .clickable { onAdd() },
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Add, null, tint = Color.White, modifier = Modifier.size(iconSize))
                            }
                        }
                    } else {
                        Button(
                            onClick = onAdd,
                            colors = ButtonDefaults.buttonColors(containerColor = SaSGreen),
                            shape = RoundedCornerShape(6.dp),
                            contentPadding = PaddingValues(horizontal = if (isCompact) 8.dp else 10.dp, vertical = 2.dp),
                            modifier = Modifier.height(buttonSize)
                        ) {
                            Text("Add", fontSize = if (isCompact) 9.sp else 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        }
                    }
                }
            }
        }
    }
}

private fun formatPrice(price: Double, posSettings: com.example.sasloopmanager.data.PosSettings): String {
    return String.format(java.util.Locale.US, "%.${posSettings.decimalPlaces}f", price)
}

@Composable
fun ReceiptRow(
    label: String,
    value: String,
    isBold: Boolean = false,
    color: Color = Color.Unspecified,
    fontSize: androidx.compose.ui.unit.TextUnit = 12.sp
) {
    val textPrimary = MaterialTheme.colorScheme.onSurface
    val textSecondary = MaterialTheme.colorScheme.onSurfaceVariant
    val displayColor = if (color == Color.Unspecified) {
        if (isBold) textPrimary else textSecondary
    } else color

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label,
            color = if (isBold) textPrimary else textSecondary,
            fontSize = fontSize,
            fontWeight = if (isBold) FontWeight.Bold else FontWeight.Normal
        )
        Text(
            text = value,
            color = displayColor,
            fontSize = fontSize,
            fontWeight = if (isBold) FontWeight.Black else FontWeight.Bold
        )
    }
}

@Composable
private fun ItemCustomizationDialog(
    item: MenuItem,
    optionGroups: List<OptionGroup>,
    onDismiss: () -> Unit,
    onAdd: (List<SelectedModifier>, String) -> Unit,
    currency: String
) {
    var selectedModifiers by remember { mutableStateOf(emptyList<SelectedModifier>()) }
    var kitchenNote by remember { mutableStateOf("") }
    val context = LocalContext.current

    val itemOptionGroups = remember(item.id, optionGroups) {
        optionGroups.filter { og -> og.itemId == item.id }
    }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = CardDark),
            border = BorderStroke(1.dp, CardBorderDark)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = item.displayName.uppercase(),
                            color = Color.White,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Black
                        )
                        Text(
                            text = "Customize your selection",
                            color = TextSecondary,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = Color.White)
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Scrollable options list
                Column(
                    modifier = Modifier
                        .weight(1f, fill = false)
                        .verticalScroll(rememberScrollState())
                ) {
                    itemOptionGroups.forEach { og ->
                        Text(
                            text = "${og.name.uppercase()} (Min: ${og.minSelectable}, Max: ${og.maxSelectable})",
                            color = TextSecondary,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Black,
                            modifier = Modifier.padding(vertical = 8.dp)
                        )

                        val options = og.options ?: emptyList()
                        options.chunked(2).forEach { rowOptions ->
                            Row(
                                modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                rowOptions.forEach { opt ->
                                    val isSelected = selectedModifiers.any { it.name == opt.name && it.groupId == og.id }
                                    val optionPrice = opt.price

                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .clip(RoundedCornerShape(12.dp))
                                            .background(if (isSelected) SaSGreen else InputDark)
                                            .border(
                                                width = 1.dp,
                                                color = if (isSelected) SaSGreen else CardBorderDark,
                                                shape = RoundedCornerShape(12.dp)
                                            )
                                            .clickable {
                                                val sameGroupMods = selectedModifiers.filter { it.groupId == og.id }
                                                val exists = selectedModifiers.any { it.name == opt.name && it.groupId == og.id }

                                                if (exists) {
                                                    selectedModifiers = selectedModifiers.filterNot { it.name == opt.name && it.groupId == og.id }
                                                } else {
                                                    if (og.maxSelectable == 1) {
                                                        selectedModifiers = selectedModifiers.filterNot { it.groupId == og.id } + SelectedModifier(opt.name, optionPrice, og.id)
                                                    } else if (sameGroupMods.size < og.maxSelectable) {
                                                        selectedModifiers = selectedModifiers + SelectedModifier(opt.name, optionPrice, og.id)
                                                    } else {
                                                        Toast.makeText(context, "Max ${og.maxSelectable} options allowed for ${og.name}", Toast.LENGTH_SHORT).show()
                                                    }
                                                }
                                            }
                                            .padding(12.dp)
                                    ) {
                                        Column {
                                            Text(
                                                text = opt.name.uppercase(),
                                                color = Color.White,
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Bold
                                            )
                                            Text(
                                                text = "+ $currency ${String.format(java.util.Locale.US, "%.2f", optionPrice)}",
                                                color = if (isSelected) Color.White.copy(alpha = 0.8f) else TextSecondary,
                                                fontSize = 9.sp,
                                                fontWeight = FontWeight.Medium
                                            )
                                        }
                                    }
                                }
                                if (rowOptions.size < 2) {
                                    Spacer(modifier = Modifier.weight(1f))
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                    }

                    Text(
                        text = "KITCHEN NOTE",
                        color = TextSecondary,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Black,
                        modifier = Modifier.padding(vertical = 8.dp)
                    )
                    OutlinedTextField(
                        value = kitchenNote,
                        onValueChange = { kitchenNote = it },
                        placeholder = { Text("Ex: No Onions, Less Salt...", fontSize = 11.sp, color = TextSecondary) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(75.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = SaSGreen,
                            unfocusedBorderColor = CardBorderDark,
                            focusedContainerColor = InputDark,
                            unfocusedContainerColor = InputDark,
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        ),
                        shape = RoundedCornerShape(12.dp),
                        maxLines = 2,
                        textStyle = TextStyle(fontSize = 11.sp)
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = {
                        for (og in itemOptionGroups) {
                            val sameGroupMods = selectedModifiers.filter { it.groupId == og.id }
                            if (sameGroupMods.size < og.minSelectable) {
                                Toast.makeText(context, "Please select at least ${og.minSelectable} option(s) for ${og.name}", Toast.LENGTH_LONG).show()
                                return@Button
                            }
                        }
                        onAdd(selectedModifiers, kitchenNote)
                    },
                    modifier = Modifier.fillMaxWidth().height(48.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = SaSGreen)
                ) {
                    Text(
                        text = "ADD TO ORDER",
                        color = Color.White,
                        fontWeight = FontWeight.Black,
                        fontSize = 12.sp,
                        letterSpacing = 1.sp
                    )
                }
            }
        }
    }
}

data class CountryCodeItem(val code: String, val dialCode: String, val flag: String, val name: String)

private val countryCodes = listOf(
    CountryCodeItem("IN", "+91", "🇮🇳", "India"),
    CountryCodeItem("US", "+1", "🇺🇸", "United States"),
    CountryCodeItem("GB", "+44", "🇬🇧", "United Kingdom"),
    CountryCodeItem("AE", "+971", "🇦🇪", "United Arab Emirates"),
    CountryCodeItem("SA", "+966", "🇸🇦", "Saudi Arabia"),
    CountryCodeItem("QA", "+974", "🇶🇦", "Qatar"),
    CountryCodeItem("OM", "+968", "🇴🇲", "Oman"),
    CountryCodeItem("BH", "+973", "🇧🇭", "Bahrain"),
    CountryCodeItem("KW", "+965", "🇰🇼", "Kuwait"),
    CountryCodeItem("CA", "+1", "🇨🇦", "Canada"),
    CountryCodeItem("AU", "+61", "🇦🇺", "Australia"),
    CountryCodeItem("SG", "+65", "🇸🇬", "Singapore"),
    CountryCodeItem("MY", "+60", "🇲🇾", "Malaysia"),
    CountryCodeItem("PK", "+92", "🇵🇰", "Pakistan"),
    CountryCodeItem("BD", "+880", "🇧🇩", "Bangladesh"),
    CountryCodeItem("LK", "+94", "🇱🇰", "Sri Lanka"),
    CountryCodeItem("NP", "+977", "🇳🇵", "Nepal"),
    CountryCodeItem("DE", "+49", "🇩🇪", "Germany"),
    CountryCodeItem("FR", "+33", "🇫🇷", "France"),
    CountryCodeItem("IT", "+39", "🇮🇹", "Italy"),
    CountryCodeItem("ES", "+34", "🇪🇸", "Spain"),
    CountryCodeItem("NL", "+31", "🇳🇱", "Netherlands"),
    CountryCodeItem("CH", "+41", "🇨🇭", "Switzerland"),
    CountryCodeItem("SE", "+46", "🇸🇪", "Sweden"),
    CountryCodeItem("NO", "+47", "🇳🇴", "Norway"),
    CountryCodeItem("NZ", "+64", "🇳🇿", "New Zealand"),
    CountryCodeItem("ZA", "+27", "🇿🇦", "South Africa"),
    CountryCodeItem("JP", "+81", "🇯🇵", "Japan"),
    CountryCodeItem("CN", "+86", "🇨🇳", "China")
)

private fun parsePhoneNumber(fullPhone: String): Triple<String, String, String> {
    val cleanPhone = fullPhone.trim()
    val sortedCodes = countryCodes.sortedByDescending { it.dialCode.length }
    for (country in sortedCodes) {
        if (cleanPhone.startsWith(country.dialCode)) {
            return Triple(country.code, country.flag, cleanPhone.substring(country.dialCode.length))
        }
        val dialCodeNoPlus = country.dialCode.removePrefix("+")
        if (cleanPhone.startsWith(dialCodeNoPlus)) {
            return Triple(country.code, country.flag, cleanPhone.substring(dialCodeNoPlus.length))
        }
    }
    return Triple("IN", "🇮🇳", cleanPhone)
}

@Composable
private fun CompactTextField(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    modifier: Modifier = Modifier,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    singleLine: Boolean = true,
    fontSize: androidx.compose.ui.unit.TextUnit = 11.sp,
    shape: androidx.compose.foundation.shape.CornerBasedShape = RoundedCornerShape(18.dp)
) {
    val TextPrimary = MaterialTheme.colorScheme.onBackground
    val TextSecondary = MaterialTheme.colorScheme.onSurfaceVariant
    val InputDark = MaterialTheme.colorScheme.surfaceVariant
    val CardBorderDark = MaterialTheme.colorScheme.outline

    BasicTextField(
        value = value,
        onValueChange = onValueChange,
        textStyle = TextStyle(color = TextPrimary, fontSize = fontSize, fontWeight = FontWeight.Medium),
        singleLine = singleLine,
        keyboardOptions = keyboardOptions,
        cursorBrush = SolidColor(SaSGreen),
        modifier = modifier
            .height(40.dp)
            .background(InputDark, shape)
            .border(1.dp, CardBorderDark, shape)
            .padding(horizontal = 12.dp),
        decorationBox = { innerTextField ->
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.CenterStart
            ) {
                if (value.isEmpty()) {
                    Text(
                        text = placeholder,
                        color = TextSecondary,
                        fontSize = fontSize,
                        fontWeight = FontWeight.Medium,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                innerTextField()
            }
        }
    )
}

@Composable
private fun ThermalGridRow(left: String, right: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(left, color = Color.Black, fontSize = 9.sp)
        Text(right, color = Color.Black, fontSize = 9.sp)
    }
}

@Composable
private fun ThermalReceiptRow(
    label: String,
    value: String,
    isBold: Boolean = false,
    fontSize: androidx.compose.ui.unit.TextUnit = 9.sp
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Spacer(modifier = Modifier.weight(1f))
        Text(
            text = label,
            color = Color.Black,
            fontSize = fontSize,
            fontWeight = if (isBold) FontWeight.Bold else FontWeight.Normal,
            modifier = Modifier.padding(end = 8.dp)
        )
        Text(
            text = value,
            color = Color.Black,
            fontSize = fontSize,
            fontWeight = if (isBold) FontWeight.Bold else FontWeight.Normal,
            modifier = Modifier.width(80.dp),
            textAlign = TextAlign.End
        )
    }
}

@Composable
fun OldKotDialog(
    onDismissRequest: () -> Unit,
    oldKotItems: Map<com.example.sasloopmanager.data.MenuItem, Int>,
    billingViewModel: BillingViewModel,
    posSettings: com.example.sasloopmanager.data.PosSettings,
    context: Context,
    user: com.example.sasloopmanager.data.UserProfile? = null
) {
    val dkBg = Color(0xFF0d1117)
    val dkHeader = Color(0xFF161b22)
    val dkInput = Color(0xFF21262d)
    val dkBorder = Color(0xFF30363d)
    val dkTextPrimary = Color(0xFFc9d1d9)
    val dkTextSecondary = Color(0xFF8b949e)

    val selectedOldKotItems = remember { mutableStateMapOf<Int, Boolean>() }
    val oldKotItemReasons = remember { mutableStateMapOf<Int, String>() }
    var selectAllOldKot by remember { mutableStateOf(false) }
    val oldKotEntries = oldKotItems.entries.toList()

    Dialog(onDismissRequest = {
        onDismissRequest()
        selectedOldKotItems.clear()
        oldKotItemReasons.clear()
        selectAllOldKot = false
    }) {
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = dkBg),
            border = BorderStroke(1.dp, dkBorder),
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp)
        ) {
            Column {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(dkHeader)
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Old KOT", color = dkTextPrimary, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = Color.Transparent,
                        modifier = Modifier.size(28.dp).clickable {
                            onDismissRequest()
                            selectedOldKotItems.clear()
                            oldKotItemReasons.clear()
                            selectAllOldKot = false
                        }
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text("✕", color = dkTextSecondary, fontSize = 14.sp)
                        }
                    }
                }

                Row(
                    modifier = Modifier.fillMaxWidth().background(dkBg).padding(horizontal = 12.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.End,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.clickable {
                            val newVal = !selectAllOldKot
                            selectAllOldKot = newVal
                            oldKotEntries.forEachIndexed { idx, _ -> selectedOldKotItems[idx] = newVal }
                        }
                    ) {
                        Checkbox(
                            checked = selectAllOldKot,
                            onCheckedChange = { checked ->
                                selectAllOldKot = checked
                                oldKotEntries.forEachIndexed { idx, _ -> selectedOldKotItems[idx] = checked }
                            },
                            colors = CheckboxDefaults.colors(checkedColor = SaSGreen, uncheckedColor = dkTextSecondary),
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(Modifier.width(4.dp))
                        Text("Select All", color = dkTextPrimary, fontSize = 11.sp)
                    }
                }

                HorizontalDivider(color = dkBorder)

                Row(
                    modifier = Modifier.fillMaxWidth().background(dkHeader).padding(horizontal = 8.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Item Name", color = dkTextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
                    Text("Qty", color = dkTextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.width(70.dp), textAlign = TextAlign.Center)
                    Text("Amount", color = dkTextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.width(56.dp), textAlign = TextAlign.End)
                    Text("Actions", color = dkTextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.width(80.dp), textAlign = TextAlign.Center)
                }

                HorizontalDivider(color = dkBorder)

                if (oldKotEntries.isEmpty()) {
                    Box(modifier = Modifier.fillMaxWidth().height(100.dp), contentAlignment = Alignment.Center) {
                        Text("No items found in bill.", color = dkTextSecondary, fontStyle = FontStyle.Italic, fontSize = 12.sp)
                    }
                } else {
                    LazyColumn(modifier = Modifier.fillMaxWidth().heightIn(max = 280.dp)) {
                        items(oldKotEntries.size) { idx ->
                            val entry = oldKotEntries[idx]
                            val item = entry.key
                            val qty = entry.value
                            val isSelected = selectedOldKotItems[idx] ?: false
                            val itemAmount = item.price * qty
                            val modifierTotal = (item.selectedModifiers ?: emptyList()).sumOf { it.price } * qty

                            Column(modifier = Modifier.fillMaxWidth().background(if (idx % 2 == 0) Color.Transparent else dkHeader.copy(alpha = 0.5f))) {
                                Row(modifier = Modifier.fillMaxWidth().padding(horizontal = 8.dp, vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = if (item.priceLabel != null) "${item.displayName} (${item.priceLabel})" else item.displayName,
                                            color = dkTextPrimary, fontWeight = FontWeight.Medium, fontSize = 11.sp, maxLines = 2, overflow = TextOverflow.Ellipsis
                                        )
                                        if (!item.selectedModifiers.isNullOrEmpty()) {
                                            item.selectedModifiers.forEach { mod ->
                                                Text("+ ${mod.name}", color = dkTextSecondary, fontSize = 9.sp, fontStyle = FontStyle.Italic)
                                            }
                                        }
                                    }
                                    Row(modifier = Modifier.width(70.dp), horizontalArrangement = Arrangement.Center, verticalAlignment = Alignment.CenterVertically) {
                                        Surface(shape = CircleShape, color = dkInput, border = BorderStroke(1.dp, dkBorder), modifier = Modifier.size(22.dp).clickable { billingViewModel.updateOldKotItemQty(item, (qty - 1).coerceAtLeast(1)) }) {
                                            Box(contentAlignment = Alignment.Center) { Text("—", color = dkTextSecondary, fontSize = 9.sp, fontWeight = FontWeight.Bold) }
                                        }
                                        Text("$qty", color = dkTextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold, modifier = Modifier.width(22.dp), textAlign = TextAlign.Center)
                                        Surface(shape = CircleShape, color = dkInput, border = BorderStroke(1.dp, dkBorder), modifier = Modifier.size(22.dp).clickable { billingViewModel.updateOldKotItemQty(item, qty + 1) }) {
                                            Box(contentAlignment = Alignment.Center) { Text("+", color = dkTextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold) }
                                        }
                                    }
                                    Text(formatPrice(itemAmount + modifierTotal, posSettings), color = dkTextPrimary, fontWeight = FontWeight.SemiBold, fontSize = 11.sp, modifier = Modifier.width(56.dp), textAlign = TextAlign.End)
                                    Column(modifier = Modifier.width(80.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                                        Checkbox(
                                            checked = isSelected,
                                            onCheckedChange = { checked -> selectedOldKotItems[idx] = checked; selectAllOldKot = oldKotEntries.indices.all { selectedOldKotItems[it] == true } },
                                            colors = CheckboxDefaults.colors(checkedColor = SaSGreen, uncheckedColor = dkTextSecondary),
                                            modifier = Modifier.size(18.dp)
                                        )
                                        Spacer(Modifier.height(2.dp))
                                        BasicTextField(
                                            value = oldKotItemReasons[idx] ?: "",
                                            onValueChange = { oldKotItemReasons[idx] = it },
                                            textStyle = TextStyle(color = dkTextPrimary, fontSize = 9.sp),
                                            cursorBrush = SolidColor(SaSGreen),
                                            singleLine = true,
                                            modifier = Modifier.fillMaxWidth().height(20.dp).background(dkInput, RoundedCornerShape(4.dp)).border(1.dp, dkBorder, RoundedCornerShape(4.dp)).padding(horizontal = 4.dp, vertical = 2.dp),
                                            decorationBox = { innerTextField ->
                                                Box(contentAlignment = Alignment.CenterStart) {
                                                    if ((oldKotItemReasons[idx] ?: "").isEmpty()) { Text("Reason", color = dkTextSecondary.copy(alpha = 0.5f), fontSize = 8.sp) }
                                                    innerTextField()
                                                }
                                            }
                                        )
                                    }
                                }
                                HorizontalDivider(color = dkBorder.copy(alpha = 0.5f))
                            }
                        }
                    }
                }

                Row(
                    modifier = Modifier.fillMaxWidth().background(dkHeader).padding(horizontal = 8.dp, vertical = 10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        Surface(shape = RoundedCornerShape(8.dp), color = dkInput, modifier = Modifier.clickable {
                            if (user?.isMposAllowed("Dine In", "cancel_kot") == false) {
                                Toast.makeText(context, "Access Denied: You do not have permission for this action.", Toast.LENGTH_SHORT).show()
                                return@clickable
                            }
                            val selected = oldKotEntries.filterIndexed { idx, _ -> selectedOldKotItems[idx] == true }.map { it.key }.toSet()
                            if (selected.isEmpty()) {
                                Toast.makeText(context, "No items selected!", Toast.LENGTH_SHORT).show()
                            } else if (selected.size == oldKotEntries.size) {
                                billingViewModel.cancelEntireActiveOrder("Deleted all KOT items") { success ->
                                    if (success) {
                                        Toast.makeText(context, "Entire order cancelled and table freed", Toast.LENGTH_SHORT).show()
                                        onDismissRequest()
                                        selectedOldKotItems.clear()
                                        oldKotItemReasons.clear()
                                        selectAllOldKot = false
                                        billingViewModel.goBack()
                                    } else {
                                        Toast.makeText(context, "Failed to cancel order", Toast.LENGTH_SHORT).show()
                                    }
                                }
                            } else {
                                billingViewModel.removeOldKotItems(selected)
                                selectedOldKotItems.clear()
                                selectAllOldKot = false
                                Toast.makeText(context, "Selected items deleted", Toast.LENGTH_SHORT).show()
                            }
                        }) {
                            Text("Delete KOT", color = dkTextPrimary, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp))
                        }
                        Surface(shape = RoundedCornerShape(8.dp), color = dkInput, modifier = Modifier.clickable {
                            if (user?.isMposAllowed("Dine In", "cancel_kot") == false) {
                                Toast.makeText(context, "Access Denied: You do not have permission for this action.", Toast.LENGTH_SHORT).show()
                                return@clickable
                            }
                            val selectedIndices = selectedOldKotItems.filter { it.value }.keys
                            if (selectedIndices.isEmpty()) {
                                Toast.makeText(context, "No items selected!", Toast.LENGTH_SHORT).show()
                            } else {
                                val missingReason = selectedIndices.any { (oldKotItemReasons[it] ?: "").isBlank() }
                                if (missingReason) {
                                    Toast.makeText(context, "Please provide a reason for all cancelled items!", Toast.LENGTH_SHORT).show()
                                } else {
                                    val selected = selectedIndices.map { oldKotEntries[it].key }.toSet()
                                    val firstReason = selectedIndices.map { oldKotItemReasons[it] ?: "" }.firstOrNull { it.isNotBlank() } ?: "Cancelled all items"
                                    if (selected.size == oldKotEntries.size) {
                                        billingViewModel.cancelEntireActiveOrder(firstReason) { success ->
                                            if (success) {
                                                Toast.makeText(context, "Entire order cancelled and table freed", Toast.LENGTH_SHORT).show()
                                                onDismissRequest()
                                                selectedOldKotItems.clear()
                                                oldKotItemReasons.clear()
                                                selectAllOldKot = false
                                                billingViewModel.goBack()
                                            } else {
                                                Toast.makeText(context, "Failed to cancel order", Toast.LENGTH_SHORT).show()
                                            }
                                        }
                                    } else {
                                        billingViewModel.removeOldKotItems(selected)
                                        selectedOldKotItems.clear()
                                        oldKotItemReasons.clear()
                                        selectAllOldKot = false
                                        Toast.makeText(context, "Selected items cancelled", Toast.LENGTH_SHORT).show()
                                    }
                                }
                            }
                        }) {
                            Text("Cancel KOT", color = dkTextPrimary, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp))
                        }
                    }
                    Button(
                        onClick = {
                            onDismissRequest()
                            selectedOldKotItems.clear()
                            oldKotItemReasons.clear()
                            selectAllOldKot = false
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = SaSGreen),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 6.dp)
                    ) {
                        Text("OK", color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun SplitBillDialog(
    onDismissRequest: () -> Unit,
    billingItems: Map<com.example.sasloopmanager.data.MenuItem, Int>,
    posSettings: com.example.sasloopmanager.data.PosSettings,
    orderType: String,
    discountInput: String,
    serviceChargeInput: String,
    deliveryChargeInput: String,
    isComplimentaryOrder: Boolean,
    context: Context
) {
    val CardDark = MaterialTheme.colorScheme.surface
    val CardBorderDark = MaterialTheme.colorScheme.outline
    val InputDark = MaterialTheme.colorScheme.surfaceVariant
    val TextPrimary = MaterialTheme.colorScheme.onBackground
    val TextSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    val subtotal = billingItems.entries.sumOf { (item, qty) -> item.price * qty }
    val discount = discountInput.toDoubleOrNull() ?: 0.0
    val serviceCharge = serviceChargeInput.toDoubleOrNull() ?: 0.0
    val deliveryCharge = if (orderType == "DELIVERY") (deliveryChargeInput.toDoubleOrNull() ?: 0.0) else 0.0
    val taxRate = posSettings.taxRate
    val isInclusive = posSettings.isTaxInclusive
    val taxableAmount = (subtotal - discount).coerceAtLeast(0.0)
    val computedTax = if (isInclusive) {
        taxableAmount * (taxRate / (100.0 + taxRate))
    } else {
        taxableAmount * (taxRate / 100.0)
    }
    val cgst = computedTax / 2.0
    val sgst = computedTax / 2.0
    val calculatedTotal = if (isInclusive) {
        taxableAmount + serviceCharge + deliveryCharge
    } else {
        taxableAmount + cgst + sgst + serviceCharge + deliveryCharge
    }
    val finalTotal = if (isComplimentaryOrder) 0.0 else calculatedTotal

    Dialog(onDismissRequest = onDismissRequest) {
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = CardDark),
            border = BorderStroke(1.dp, CardBorderDark),
            modifier = Modifier.fillMaxWidth().padding(16.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text(
                    text = "Split Bill (Total: ${posSettings.currency} ${formatPrice(finalTotal, posSettings)})",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )

                var splitTab by remember { mutableStateOf(0) }

                TabRow(
                    selectedTabIndex = splitTab,
                    containerColor = InputDark,
                    contentColor = SaSGreen,
                    modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(8.dp))
                ) {
                    Tab(
                        selected = splitTab == 0,
                        onClick = { splitTab = 0 },
                        text = { Text("Portion", color = if (splitTab == 0) SaSGreen else TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold) }
                    )
                    Tab(
                        selected = splitTab == 1,
                        onClick = { splitTab = 1 },
                        text = { Text("Percent", color = if (splitTab == 1) SaSGreen else TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold) }
                    )
                    Tab(
                        selected = splitTab == 2,
                        onClick = { splitTab = 2 },
                        text = { Text("Item", color = if (splitTab == 2) SaSGreen else TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold) }
                    )
                }

                if (splitTab == 0) {
                    var portions by remember { mutableStateOf(2) }
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                        Text("Number of portions: $portions", color = Color.White, fontSize = 13.sp)
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            (2..5).forEach { num ->
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .background(if (portions == num) SaSGreen else InputDark, RoundedCornerShape(8.dp))
                                        .clickable { portions = num }
                                        .padding(vertical = 8.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text("$num Ways", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                                }
                            }
                        }
                        Spacer(Modifier.height(4.dp))
                        Text(
                            text = "Each person pays: ${posSettings.currency} ${formatPrice(finalTotal / portions, posSettings)}",
                            color = SaSGreenLight,
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp
                        )
                    }
                } else if (splitTab == 1) {
                    var percentInput by remember { mutableStateOf("50") }
                    val pct = percentInput.toDoubleOrNull() ?: 50.0
                    val share1 = finalTotal * (pct / 100.0)
                    val share2 = finalTotal - share1

                    Column(verticalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                        Text("Enter percentage for Share 1:", color = Color.White, fontSize = 13.sp)
                        CompactTextField(
                            value = percentInput,
                            onValueChange = { percentInput = it },
                            placeholder = "50",
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.fillMaxWidth()
                        )
                        Spacer(Modifier.height(4.dp))
                        Text("Share 1 (${formatPrice(pct, posSettings)}%): ${posSettings.currency} ${formatPrice(share1, posSettings)}", color = SaSGreen, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text("Share 2 (${formatPrice(100.0 - pct, posSettings)}%): ${posSettings.currency} ${formatPrice(share2, posSettings)}", color = SaSGreenLight, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    }
                } else {
                    val itemAssignments = remember { mutableStateMapOf<String, Boolean>() }
                    val itemsList = billingItems.entries.toList()

                    LazyColumn(
                        modifier = Modifier.fillMaxWidth().heightIn(max = 160.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        items(itemsList) { entry ->
                            val item = entry.key
                            val qty = entry.value
                            val itemKey = "${item.id}_${item.selectedModifiers?.hashCode() ?: 0}_${item.kitchenNote?.hashCode() ?: 0}"
                            val isBillB = itemAssignments[itemKey] ?: false

                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(InputDark, RoundedCornerShape(8.dp))
                                    .padding(horizontal = 8.dp, vertical = 6.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "${if (item.priceLabel != null) "${item.displayName} (${item.priceLabel})" else item.displayName} x $qty",
                                    color = Color.White,
                                    fontSize = 11.sp,
                                    modifier = Modifier.weight(1f)
                                )
                                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                    Box(
                                        modifier = Modifier
                                            .background(if (!isBillB) SaSGreen else CardDark, RoundedCornerShape(4.dp))
                                            .clickable { itemAssignments[itemKey] = false }
                                            .padding(horizontal = 8.dp, vertical = 4.dp)
                                    ) {
                                        Text("Bill A", color = Color.White, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    }
                                    Box(
                                        modifier = Modifier
                                            .background(if (isBillB) SaSGreen else CardDark, RoundedCornerShape(4.dp))
                                            .clickable { itemAssignments[itemKey] = true }
                                            .padding(horizontal = 8.dp, vertical = 4.dp)
                                    ) {
                                        Text("Bill B", color = Color.White, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                    }

                    val totalA = itemsList.sumOf { entry ->
                        val item = entry.key
                        val qty = entry.value
                        val itemKey = "${item.id}_${item.selectedModifiers?.hashCode() ?: 0}_${item.kitchenNote?.hashCode() ?: 0}"
                        val isBillB = itemAssignments[itemKey] ?: false
                        if (!isBillB) item.price * qty else 0.0
                    }
                    val totalB = itemsList.sumOf { entry ->
                        val item = entry.key
                        val qty = entry.value
                        val itemKey = "${item.id}_${item.selectedModifiers?.hashCode() ?: 0}_${item.kitchenNote?.hashCode() ?: 0}"
                        val isBillB = itemAssignments[itemKey] ?: false
                        if (isBillB) item.price * qty else 0.0
                    }

                    Column(verticalArrangement = Arrangement.spacedBy(4.dp), modifier = Modifier.fillMaxWidth()) {
                        Text("Bill A Subtotal: ${posSettings.currency} ${formatPrice(totalA, posSettings)}", color = SaSGreen, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        Text("Bill B Subtotal: ${posSettings.currency} ${formatPrice(totalB, posSettings)}", color = SaSGreenLight, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }
                }

                Row(
                    modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = onDismissRequest,
                        colors = ButtonDefaults.buttonColors(containerColor = InputDark),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Cancel", color = TextPrimary)
                    }
                    Button(
                        onClick = {
                            onDismissRequest()
                            Toast.makeText(context, "Bill split successfully", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = SaSGreen),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Split", color = Color.White)
                    }
                }
            }
        }
    }
}

@Composable
fun PreviewDialog(
    onDismissRequest: () -> Unit,
    billingItems: Map<com.example.sasloopmanager.data.MenuItem, Int>,
    discountInput: String,
    serviceChargeInput: String,
    deliveryChargeInput: String,
    posSettings: com.example.sasloopmanager.data.PosSettings,
    orderType: String,
    isComplimentaryOrder: Boolean,
    customerName: String,
    customerPhone: String,
    selectedDialCode: String,
    customerAddress: String,
    activeFlow: String,
    selectedTable: com.example.sasloopmanager.data.TableItem?,
    selectedWaiter: String?,
    user: com.example.sasloopmanager.data.UserProfile?,
    billingViewModel: BillingViewModel,
    context: Context,
    billNo: String
) {
    val dkBg = Color(0xFF0d1117)
    val dkHeader = Color(0xFF161b22)
    val dkInput = Color(0xFF21262d)
    val dkBorder = Color(0xFF30363d)
    val dkTextPrimary = Color(0xFFc9d1d9)
    val dkTextSecondary = Color(0xFF8b949e)

    Dialog(onDismissRequest = onDismissRequest) {
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = dkBg),
            border = BorderStroke(1.dp, dkBorder),
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp)
                .fillMaxHeight(0.9f)
        ) {
            Column(modifier = Modifier.fillMaxSize()) {
                // Header row matching Windows diagnostics HUD
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(dkHeader)
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("RECEIPT SYSTEM DIAGNOSTICS", color = SaSGreen, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text("BILL ID: $billNo // SECURE CORE PROT v19.2", color = dkTextSecondary, fontSize = 10.sp)
                    }
                    IconButton(onClick = onDismissRequest, modifier = Modifier.size(24.dp)) {
                        Text("✕", color = dkTextSecondary, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    }
                }

                // Scrollable receipt container simulating thermal paper roll
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .background(Color(0xFF141923))
                        .padding(16.dp),
                    contentAlignment = Alignment.TopCenter
                ) {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .verticalScroll(rememberScrollState()),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(4.dp),
                        border = BorderStroke(1.dp, Color.LightGray)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp)
                        ) {
                            // Render Bill Preview directly (No tabs, KOT tab removed)
                            BillPreviewContent(
                                billingItems = billingItems,
                                discountInput = discountInput,
                                serviceChargeInput = serviceChargeInput,
                                deliveryChargeInput = deliveryChargeInput,
                                posSettings = posSettings,
                                orderType = orderType,
                                isComplimentaryOrder = isComplimentaryOrder,
                                customerName = customerName,
                                customerPhone = customerPhone,
                                customerAddress = customerAddress,
                                selectedTable = selectedTable,
                                selectedWaiter = selectedWaiter,
                                user = user,
                                billNo = billNo
                            )
                        }
                    }
                }

                // Bottom execution row
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(dkHeader)
                        .padding(horizontal = 8.dp, vertical = 10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Button(
                        onClick = {
                            // Trigger Bill Print
                            val subtotal = billingItems.entries.sumOf { (item, qty) -> item.price * qty }
                            val discount = discountInput.toDoubleOrNull() ?: 0.0
                            val serviceCharge = serviceChargeInput.toDoubleOrNull() ?: 0.0
                            val deliveryCharge = deliveryChargeInput.toDoubleOrNull() ?: 0.0
                            val taxableAmount = (subtotal - discount).coerceAtLeast(0.0)
                            val taxRate = posSettings.taxRate
                            val isInclusive = posSettings.isTaxInclusive
                            val computedTax = if (isInclusive) {
                                taxableAmount * (taxRate / (100.0 + taxRate))
                            } else {
                                taxableAmount * (taxRate / 100.0)
                            }
                            val cgst = computedTax / 2.0
                            val sgst = computedTax / 2.0
                            val grandTotal = if (isInclusive) {
                                taxableAmount + serviceCharge + deliveryCharge
                            } else {
                                taxableAmount + computedTax + serviceCharge + deliveryCharge
                            }

                            val fullCustomerNumber = if (customerPhone.isBlank()) "" else "${selectedDialCode}${customerPhone}"
                            billingViewModel.triggerBillPrint(
                                billNo = billNo,
                                customerName = customerName.ifBlank { "POS Guest" },
                                customerPhone = fullCustomerNumber,
                                customerAddress = customerAddress,
                                orderType = if (activeFlow == "DINEIN") "DINE-IN" else "TAKEAWAY",
                                items = billingItems,
                                subtotal = subtotal,
                                discount = discount,
                                cgst = cgst,
                                sgst = sgst,
                                serviceCharge = serviceCharge,
                                deliveryCharge = deliveryCharge,
                                finalTotal = grandTotal,
                                tableName = selectedTable?.tableName ?: "Direct",
                                waiterName = selectedWaiter,
                                preOrderAdvance = 0.0,
                                preOrderBalance = 0.0,
                                paymentMethod = "CASH",
                                userName = user?.name ?: user?.username ?: "admin",
                                referenceNo = "",
                                tipAmount = 0.0
                            )
                            Toast.makeText(context, "Bill Print Triggered", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = SaSGreen),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                        modifier = Modifier.weight(1.2f).padding(end = 4.dp)
                    ) {
                        Text("EXECUTE PRINT", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                    }

                    Button(
                        onClick = onDismissRequest,
                        colors = ButtonDefaults.buttonColors(containerColor = dkInput),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                        modifier = Modifier.weight(0.8f).padding(start = 4.dp)
                    ) {
                        Text("Close", color = dkTextPrimary, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                    }
                }
            }
        }
    }
}

@Composable
fun DashedDivider(
    color: Color = Color.Black,
    thickness: Dp = 1.dp,
    dashLength: Dp = 4.dp,
    gapLength: Dp = 3.dp,
    modifier: Modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
) {
    Canvas(modifier = modifier.height(thickness)) {
        val pathEffect = PathEffect.dashPathEffect(floatArrayOf(dashLength.toPx(), gapLength.toPx()), 0f)
        drawLine(
            color = color,
            start = Offset(0f, size.height / 2f),
            end = Offset(size.width, size.height / 2f),
            strokeWidth = thickness.toPx(),
            pathEffect = pathEffect
        )
    }
}

@Composable
fun BillPreviewContent(
    billingItems: Map<com.example.sasloopmanager.data.MenuItem, Int>,
    discountInput: String,
    serviceChargeInput: String,
    deliveryChargeInput: String,
    posSettings: com.example.sasloopmanager.data.PosSettings,
    orderType: String,
    isComplimentaryOrder: Boolean,
    customerName: String,
    customerPhone: String,
    customerAddress: String,
    selectedTable: com.example.sasloopmanager.data.TableItem?,
    selectedWaiter: String?,
    user: com.example.sasloopmanager.data.UserProfile?,
    billNo: String
) {
    val subtotal = billingItems.entries.sumOf { (item, qty) -> item.price * qty }
    val discount = discountInput.toDoubleOrNull() ?: 0.0
    val serviceCharge = serviceChargeInput.toDoubleOrNull() ?: 0.0
    val deliveryCharge = deliveryChargeInput.toDoubleOrNull() ?: 0.0
    val taxableAmount = (subtotal - discount).coerceAtLeast(0.0)
    val taxRate = posSettings.taxRate
    val isInclusive = posSettings.isTaxInclusive
    val computedTax = if (isInclusive) {
        taxableAmount * (taxRate / (100.0 + taxRate))
    } else {
        taxableAmount * (taxRate / 100.0)
    }
    val cgst = computedTax / 2.0
    val sgst = computedTax / 2.0
    val grandTotal = if (isInclusive) {
        taxableAmount + serviceCharge + deliveryCharge
    } else {
        taxableAmount + computedTax + serviceCharge + deliveryCharge
    }

    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Business Name
        val businessName = (posSettings.businessName.takeIf { it.isNotBlank() }
            ?: posSettings.receiptHeader.takeIf { it.isNotBlank() }
            ?: "SHAHE TEHZEEB RESTAURANT").uppercase(Locale.US)
        Text(businessName, color = Color.Black, fontSize = 11.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)

        // Address Lines
        val displayAddress = posSettings.address.ifBlank { "Ist Floor Rather Plaza Kangan\nJ&K-191202" }
        displayAddress.split("\n").forEach { line ->
            Text(line.trim(), color = Color.Black, fontSize = 8.sp, textAlign = TextAlign.Center)
        }

        // Contact No & GSTIN
        val displayPhone = posSettings.phone.ifBlank { "9906123989" }
        Text("Contact No: ${displayPhone.trim()}", color = Color.Black, fontSize = 8.sp, textAlign = TextAlign.Center)
        val displayGstin = posSettings.gstin.ifBlank { "01BNIPB3099J1Z4" }
        Text("GSTIN : ${displayGstin.trim()}", color = Color.Black, fontSize = 8.sp, textAlign = TextAlign.Center)

        // Date/Time
        val sdf = SimpleDateFormat("dd-MM-yyyy HH:mm:ss a", Locale.US)
        Text(sdf.format(Date()), color = Color.Black, fontSize = 8.sp, textAlign = TextAlign.Center)

        DashedDivider()
        val sectionTitle = if (orderType.equals("PRE-ORDER", ignoreCase = true)) "PRE-ORDER BOOKING RECEIPT" else "RETAIL INVOICE"
        Text(
            sectionTitle,
            color = Color.Black,
            fontSize = 9.sp,
            fontWeight = FontWeight.Bold,
            style = TextStyle(textDecoration = androidx.compose.ui.text.style.TextDecoration.Underline),
            textAlign = TextAlign.Center
        )
        DashedDivider()

        // Info Grid with bold labels matching Windows printed POS
        val tblName = if (selectedTable == null) "Direct" else selectedTable.tableName
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Row(modifier = Modifier.weight(1f)) {
                Text("Table: ", color = Color.Black, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                Text(tblName, color = Color.Black, fontSize = 8.sp)
            }
            Row(modifier = Modifier.weight(1f), horizontalArrangement = Arrangement.End) {
                Text("Bill: ", color = Color.Black, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                Text(billNo, color = Color.Black, fontSize = 8.sp)
            }
        }
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Row(modifier = Modifier.weight(1f)) {
                Text("Order: ", color = Color.Black, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                Text(orderType, color = Color.Black, fontSize = 8.sp)
            }
            Row(modifier = Modifier.weight(1f), horizontalArrangement = Arrangement.End) {
                Text("Payment: ", color = Color.Black, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                Text("CASH", color = Color.Black, fontSize = 8.sp)
            }
        }
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Row(modifier = Modifier.weight(1f)) {
                Text("Waiter: ", color = Color.Black, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                Text(selectedWaiter ?: "Default", color = Color.Black, fontSize = 8.sp)
            }
            Row(modifier = Modifier.weight(1f), horizontalArrangement = Arrangement.End) {
                Text("User: ", color = Color.Black, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                Text(user?.name ?: user?.username ?: "admin", color = Color.Black, fontSize = 8.sp)
            }
        }

        // Customer details
        val ignoredNames = listOf("pos guest", "table guest", "walk-in", "")
        val isTableName = selectedTable != null && customerName.trim().lowercase(Locale.US) == selectedTable.tableName.trim().lowercase(Locale.US)
        val hasValidCustName = customerName.trim().lowercase(Locale.US) !in ignoredNames && !isTableName
        val hasValidCustPhone = customerPhone.isNotBlank()
        val ignoredAddresses = listOf("dine-in", "dine in", "pickup", "takeaway", "")
        val hasValidCustAddress = customerAddress.trim().lowercase(Locale.US) !in ignoredAddresses

        if (hasValidCustName || hasValidCustPhone || hasValidCustAddress) {
            DashedDivider()
            if (hasValidCustName) {
                Row(modifier = Modifier.fillMaxWidth()) {
                    Text("Cust Name: ", color = Color.Black, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                    Text(customerName, color = Color.Black, fontSize = 8.sp)
                }
            }
            if (hasValidCustPhone) {
                Row(modifier = Modifier.fillMaxWidth()) {
                    Text("Cust Mobile: ", color = Color.Black, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                    Text(customerPhone, color = Color.Black, fontSize = 8.sp)
                }
            }
            if (hasValidCustAddress) {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Text("Delivery Address:", color = Color.Black, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                    Text(customerAddress, color = Color.Black, fontSize = 8.sp)
                }
            }
        }

        DashedDivider()
        Text("FOOD ITEMS", color = Color.Black, fontSize = 9.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
        DashedDivider()

        // Item headers matching Windows POS: Item Name, Qty., Amount, Total
        Row(modifier = Modifier.fillMaxWidth()) {
            Text("Item Name", color = Color.Black, fontSize = 8.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1.8f))
            Text("Qty.", color = Color.Black, fontSize = 8.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(0.6f), textAlign = TextAlign.Center)
            Text("Amount", color = Color.Black, fontSize = 8.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(0.8f), textAlign = TextAlign.End)
            Text("Total", color = Color.Black, fontSize = 8.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(0.9f), textAlign = TextAlign.End)
        }
        DashedDivider()

        // Item List
        var idx = 1
        billingItems.forEach { (item, qty) ->
            val name = "$idx.${item.displayName.uppercase(Locale.US)}"
            val priceStr = String.format(Locale.US, "%.2f", item.price)
            val amtStr = String.format(Locale.US, "%.2f", item.price * qty)
            idx++

            Row(modifier = Modifier.fillMaxWidth().padding(vertical = 1.dp)) {
                Text(name, color = Color.Black, fontSize = 8.sp, modifier = Modifier.weight(1.8f))
                Text("$qty", color = Color.Black, fontSize = 8.sp, modifier = Modifier.weight(0.6f), textAlign = TextAlign.Center)
                Text(priceStr, color = Color.Black, fontSize = 8.sp, modifier = Modifier.weight(0.8f), textAlign = TextAlign.End)
                Text(amtStr, color = Color.Black, fontSize = 8.sp, modifier = Modifier.weight(0.9f), textAlign = TextAlign.End)
            }
            if (item.selectedModifiers?.isNotEmpty() == true) {
                item.selectedModifiers.forEach { mod ->
                    val modPriceStr = if (mod.price > 0) " (Rs ${String.format(Locale.US, "%.2f", mod.price)})" else ""
                    Text("  + ${mod.name.uppercase(Locale.US)}$modPriceStr", color = Color.Gray, fontSize = 7.sp, modifier = Modifier.align(Alignment.Start))
                }
            }
        }

        DashedDivider()

        // Summary Calculations matching Windows printed POS format
        @Composable
        fun formatSummaryRow(label: String, value: String) {
            Row(
                modifier = Modifier.fillMaxWidth().padding(vertical = 1.dp),
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(label, color = Color.Black, fontSize = 8.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f), textAlign = TextAlign.End)
                Text(value, color = Color.Black, fontSize = 8.sp, fontWeight = FontWeight.Bold, modifier = Modifier.width(90.dp), textAlign = TextAlign.End)
            }
        }

        formatSummaryRow("Amount:", "${posSettings.currency} ${String.format(Locale.US, "%.2f", subtotal)}")
        if (discount > 0) {
            formatSummaryRow("Discount:", "-${String.format(Locale.US, "%.2f", discount)}")
        }
        if (deliveryCharge > 0) {
            formatSummaryRow("Additional Charges:", "${posSettings.currency} ${String.format(Locale.US, "%.2f", deliveryCharge)}")
        }
        if (serviceCharge > 0) {
            formatSummaryRow("Service Charge:", "${posSettings.currency} ${String.format(Locale.US, "%.2f", serviceCharge)}")
        }

        if (!posSettings.hideTaxOnBill) {
            val taxRateHalf = posSettings.taxRate / 2.0
            formatSummaryRow("CGST (${String.format(Locale.US, "%.1f", taxRateHalf)}%):", "${posSettings.currency} ${String.format(Locale.US, "%.2f", cgst)}")
            formatSummaryRow("SGST (${String.format(Locale.US, "%.1f", taxRateHalf)}%):", "${posSettings.currency} ${String.format(Locale.US, "%.2f", sgst)}")
        }

        DashedDivider()
        Row(
            modifier = Modifier.fillMaxWidth().padding(vertical = 2.dp),
            horizontalArrangement = Arrangement.End,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Grand Total:", color = Color.Black, fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f), textAlign = TextAlign.End)
            Text("${posSettings.currency} ${String.format(Locale.US, "%.2f", grandTotal)}", color = Color.Black, fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.width(90.dp), textAlign = TextAlign.End)
        }

        Text(
            (PrinterHelper.numberToWords(grandTotal)).lowercase(Locale.US),
            color = Color.Black,
            fontSize = 7.sp,
            fontStyle = FontStyle.Italic,
            modifier = Modifier.align(Alignment.Start).padding(top = 2.dp)
        )

        // Scan to Pay / Review QR section
        if (posSettings.printReviewQr && posSettings.googleReviewUrl.isNotBlank()) {
            DashedDivider()
            Text("RATE YOUR EXPERIENCE", color = Color.Black, fontSize = 8.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
            Spacer(modifier = Modifier.height(4.dp))
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .border(1.dp, Color.Black)
                    .padding(4.dp),
                contentAlignment = Alignment.Center
            ) {
                Text("[ REVIEW QR CODE ]", color = Color.Black, fontSize = 7.sp, textAlign = TextAlign.Center)
            }
        } else if (posSettings.printUpiQr && posSettings.upiId.isNotBlank()) {
            DashedDivider()
            Text("SCAN TO PAY", color = Color.Black, fontSize = 8.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
            Spacer(modifier = Modifier.height(4.dp))
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .border(1.dp, Color.Black)
                    .padding(4.dp),
                contentAlignment = Alignment.Center
            ) {
                Text("[ UPI QR CODE ]", color = Color.Black, fontSize = 7.sp, textAlign = TextAlign.Center)
            }
        }

        DashedDivider()
        val greeting = posSettings.greetingMessage.ifBlank { "THANK YOU! VISIT AGAIN" }.uppercase(Locale.US)
        Text(greeting, color = Color.Black, fontSize = 8.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
        val appVersion = posSettings.appVersion.ifBlank { "SaSLoop POS Version: 19.02" }
        Text(appVersion, color = Color.Black, fontSize = 7.sp, textAlign = TextAlign.Center)
        DashedDivider()
    }
}

@Composable
fun PaymentDialog(
    onDismissRequest: () -> Unit,
    billingItems: Map<com.example.sasloopmanager.data.MenuItem, Int>,
    discountInput: String,
    serviceChargeInput: String,
    deliveryChargeInput: String,
    posSettings: com.example.sasloopmanager.data.PosSettings,
    orderType: String,
    isComplimentaryOrder: Boolean,
    advancePaidInput: String,
    paymentMethod: String,
    onPaymentMethodChange: (String) -> Unit,
    customerName: String,
    customerPhone: String,
    selectedDialCode: String,
    customerAddress: String,
    activeFlow: String,
    preOrderDate: String,
    preOrderTime: String,
    preOrderTypeInput: String,
    preOrderIdInput: String,
    selectedTable: com.example.sasloopmanager.data.TableItem?,
    selectedWaiter: String?,
    user: com.example.sasloopmanager.data.UserProfile?,
    billingViewModel: BillingViewModel,
    context: Context
) {
    val CardDark = MaterialTheme.colorScheme.surface
    val CardBorderDark = MaterialTheme.colorScheme.outline
    val InputDark = MaterialTheme.colorScheme.surfaceVariant
    val TextPrimary = MaterialTheme.colorScheme.onBackground
    val TextSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    val tableStatuses by billingViewModel.tableStatuses.collectAsStateWithLifecycle()
    val selectedTableStatus = remember(selectedTable, tableStatuses) {
        selectedTable?.let { tableStatuses[it.id.toString()]?.uppercase() }
    }
    val isSettleEnabled = activeFlow != "DINEIN" || selectedTableStatus == "BILL_SAVED" || selectedTableStatus == "PRINTED"

    Dialog(onDismissRequest = onDismissRequest) {
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = CardDark),
            border = BorderStroke(1.dp, CardBorderDark),
            modifier = Modifier.fillMaxWidth().padding(16.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text(
                    text = "Select Payment Method",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )

                val subtotal = billingItems.entries.sumOf { (item, qty) -> item.price * qty }
                val discount = discountInput.toDoubleOrNull() ?: 0.0
                val taxableAmount = (subtotal - discount).coerceAtLeast(0.0)
                
                val taxRate = posSettings.taxRate
                val isInclusive = posSettings.isTaxInclusive
                val computedTax = if (isInclusive) {
                    taxableAmount * (taxRate / (100.0 + taxRate))
                } else {
                    taxableAmount * (taxRate / 100.0)
                }
                val cgst = computedTax / 2.0
                val sgst = computedTax / 2.0

                val defaultServiceCharge = if (posSettings.enableServiceCharge && orderType == "DINE-IN") {
                    taxableAmount * (posSettings.serviceChargeRate / 100.0)
                } else {
                    0.0
                }
                val serviceCharge = serviceChargeInput.toDoubleOrNull() ?: defaultServiceCharge
                val deliveryCharge = if (orderType == "DELIVERY") (deliveryChargeInput.toDoubleOrNull() ?: 0.0) else 0.0

                val calculatedTotal = if (isInclusive) {
                    taxableAmount + serviceCharge + deliveryCharge
                } else {
                    taxableAmount + cgst + sgst + serviceCharge + deliveryCharge
                }
                val totalBeforeRounding = if (isComplimentaryOrder) 0.0 else calculatedTotal
                val finalTotal = if (posSettings.autoRoundOff) {
                    kotlin.math.round(totalBeforeRounding)
                } else {
                    totalBeforeRounding
                }
                val advancePaid = advancePaidInput.toDoubleOrNull() ?: 0.0
                val remainingBalance = (finalTotal - advancePaid).coerceAtLeast(0.0)

                var isSplitPayment by remember { mutableStateOf(false) }
                var splitPaidAmountInput by remember { mutableStateOf("") }
                var splitCreditAmountInput by remember { mutableStateOf("") }
                var splitPaymentMethod by remember { mutableStateOf("CASH") }

                Text(
                    text = "Amount to Pay: ${posSettings.currency}${formatPrice(remainingBalance, posSettings)}",
                    color = SaSGreen,
                    fontWeight = FontWeight.Black,
                    fontSize = 16.sp
                )

                Row(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Split Payment (Credit)", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    Switch(
                        checked = isSplitPayment,
                        onCheckedChange = { checked ->
                            isSplitPayment = checked
                            if (checked) {
                                splitPaidAmountInput = String.format(java.util.Locale.US, "%.2f", remainingBalance)
                                splitCreditAmountInput = "0.00"
                            } else {
                                splitPaidAmountInput = ""
                                splitCreditAmountInput = ""
                            }
                        },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = SaSGreen,
                            checkedTrackColor = SaSGreen.copy(alpha = 0.5f)
                        )
                    )
                }

                if (!isSplitPayment) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf("CASH", "UPI").forEach { method ->
                            val isSelected = paymentMethod == method
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (isSelected) SaSGreen else InputDark)
                                    .border(1.dp, if (isSelected) SaSGreen else CardBorderDark, RoundedCornerShape(8.dp))
                                    .clickable { onPaymentMethodChange(method) }
                                    .padding(vertical = 12.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(method, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            }
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf("CARD", "CREDIT").forEach { method ->
                            val isSelected = paymentMethod == method
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (isSelected) SaSGreen else InputDark)
                                    .border(1.dp, if (isSelected) SaSGreen else CardBorderDark, RoundedCornerShape(8.dp))
                                    .clickable { onPaymentMethodChange(method) }
                                    .padding(vertical = 12.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(method, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            }
                        }
                    }
                } else {
                    Text("Select payment method for paid portion:", color = TextSecondary, fontSize = 10.sp, modifier = Modifier.align(Alignment.Start))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf("CASH", "UPI", "CARD").forEach { method ->
                            val isSelected = splitPaymentMethod == method
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (isSelected) SaSGreen else InputDark)
                                    .border(1.dp, if (isSelected) SaSGreen else CardBorderDark, RoundedCornerShape(8.dp))
                                    .clickable { splitPaymentMethod = method }
                                    .padding(vertical = 8.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(method, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                            }
                        }
                    }
                    
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text("Paid Amount", color = TextSecondary, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            BasicTextField(
                                value = splitPaidAmountInput,
                                onValueChange = { input ->
                                    splitPaidAmountInput = input
                                    val pVal = input.toDoubleOrNull() ?: 0.0
                                    val cVal = (remainingBalance - pVal).coerceAtLeast(0.0)
                                    splitCreditAmountInput = String.format(java.util.Locale.US, "%.2f", cVal)
                                },
                                textStyle = TextStyle(color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold),
                                singleLine = true,
                                cursorBrush = SolidColor(SaSGreen),
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(36.dp)
                                    .background(InputDark, RoundedCornerShape(8.dp))
                                    .border(1.dp, CardBorderDark, RoundedCornerShape(8.dp))
                                    .padding(horizontal = 8.dp, vertical = 6.dp)
                            )
                        }
                        Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text("To Credit", color = TextSecondary, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            BasicTextField(
                                value = splitCreditAmountInput,
                                onValueChange = { input ->
                                    splitCreditAmountInput = input
                                    val cVal = input.toDoubleOrNull() ?: 0.0
                                    val pVal = (remainingBalance - cVal).coerceAtLeast(0.0)
                                    splitPaidAmountInput = String.format(java.util.Locale.US, "%.2f", pVal)
                                },
                                textStyle = TextStyle(color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold),
                                singleLine = true,
                                cursorBrush = SolidColor(SaSGreen),
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(36.dp)
                                    .background(InputDark, RoundedCornerShape(8.dp))
                                    .border(1.dp, CardBorderDark, RoundedCornerShape(8.dp))
                                    .padding(horizontal = 8.dp, vertical = 6.dp)
                            )
                        }
                    }
                }

                Row(
                    modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = onDismissRequest,
                        colors = ButtonDefaults.buttonColors(containerColor = InputDark),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Cancel", color = TextPrimary)
                    }
                    Button(
                        onClick = {
                            if (!isSettleEnabled) {
                                Toast.makeText(context, "Please save or print the bill first", Toast.LENGTH_SHORT).show()
                                return@Button
                            }
                            onDismissRequest()
                            val fullCustomerNumber = if (customerPhone.isBlank()) "" else "${selectedDialCode}${customerPhone}"
                            val finalAddress = if (activeFlow == "PREORDER") {
                                "Scheduled: $preOrderDate $preOrderTime | Address: $customerAddress | Type: $preOrderTypeInput"
                            } else {
                                customerAddress
                            }
                            billingViewModel.settleOrder(
                                customerName = customerName,
                                customerNumber = fullCustomerNumber,
                                address = finalAddress,
                                paymentMethod = if (isSplitPayment) "SPLIT" else paymentMethod,
                                orderType = orderType,
                                discountAmount = discount,
                                serviceCharge = serviceCharge,
                                deliveryCharge = deliveryCharge,
                                cgst = cgst,
                                sgst = sgst,
                                preOrderId = if (orderType == "PRE-ORDER" || activeFlow == "PREORDER") preOrderIdInput else null,
                                preOrderAdvance = if (orderType == "PRE-ORDER" || activeFlow == "PREORDER") advancePaid else null,
                                preOrderBalance = if (orderType == "PRE-ORDER" || activeFlow == "PREORDER") remainingBalance else null,
                                tableName = selectedTable?.tableName ?: "Direct",
                                waiterName = selectedWaiter,
                                shouldPrint = false,
                                checkoutType = "SETTLE",
                                userName = user?.name ?: user?.username ?: "admin",
                                paidAmountInput = if (isSplitPayment) splitPaidAmountInput.toDoubleOrNull() else null,
                                creditAmountInput = if (isSplitPayment) splitCreditAmountInput.toDoubleOrNull() else null
                            ) { success ->
                                if (success) {
                                    Toast.makeText(context, "Settle via ${if (isSplitPayment) "SPLIT" else paymentMethod} Successful", Toast.LENGTH_SHORT).show()
                                }
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = SaSGreen),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Settle", color = Color.White)
                    }
                }
            }
        }
    }
}

@Composable
fun MenuSubTab(
    searchQuery: String,
    foodTypeFilter: String,
    onFoodTypeFilterChange: (String) -> Unit,
    selectedCategory: String,
    categories: List<com.example.sasloopmanager.data.CategoryItem>,
    isLoading: Boolean,
    error: String?,
    sortedItems: List<com.example.sasloopmanager.data.MenuItem>,
    cart: Map<com.example.sasloopmanager.data.MenuItem, Int>,
    oldKotItems: Map<com.example.sasloopmanager.data.MenuItem, Int>,
    selectedPriceTier: Int,
    currentOrderType: String,
    optionGroups: List<com.example.sasloopmanager.data.OptionGroup>,
    posSettings: com.example.sasloopmanager.data.PosSettings,
    billingViewModel: BillingViewModel,
    onSelectItemForModifiers: (com.example.sasloopmanager.data.MenuItem) -> Unit,
    onActiveSubTabChange: (String) -> Unit
) {
    val CardDark = MaterialTheme.colorScheme.surface
    val CardBorderDark = MaterialTheme.colorScheme.outline
    val InputDark = MaterialTheme.colorScheme.surfaceVariant
    val TextPrimary = MaterialTheme.colorScheme.onBackground
    val TextSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    var showCategoriesDialog by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxSize()) {
        // Professional Search Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(CardDark)
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Search Field
            Box(
                modifier = Modifier
                    .weight(1f)
                    .height(42.dp)
                    .background(InputDark, RoundedCornerShape(21.dp))
                    .border(1.dp, CardBorderDark, RoundedCornerShape(21.dp))
                    .padding(horizontal = 14.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Default.Search,
                        contentDescription = "Search",
                        tint = SaSGreen,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    BasicTextField(
                        value = searchQuery,
                        onValueChange = { billingViewModel.setSearchQuery(it) },
                        textStyle = TextStyle(
                            color = TextPrimary,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium
                        ),
                        singleLine = true,
                        cursorBrush = SolidColor(SaSGreen),
                        modifier = Modifier.weight(1f),
                        decorationBox = { innerTextField ->
                            Box(contentAlignment = Alignment.CenterStart) {
                                if (searchQuery.isEmpty()) {
                                    Text(
                                        "Search items, codes...",
                                        color = TextSecondary.copy(alpha = 0.6f),
                                        fontSize = 13.sp
                                    )
                                }
                                innerTextField()
                            }
                        }
                    )
                    if (searchQuery.isNotEmpty()) {
                        IconButton(
                            onClick = { billingViewModel.setSearchQuery("") },
                            modifier = Modifier.size(20.dp)
                        ) {
                            Icon(
                                Icons.Default.Close,
                                contentDescription = "Clear",
                                tint = TextSecondary,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                }
            }

            // Veg/Non-Veg Checkbox + Toggle
            val showAll = foodTypeFilter == "ALL"
            val isVegMode = foodTypeFilter != "NON-VEG" // true = VEG, false = NON-VEG

            // Show All Checkbox
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .clickable {
                        if (showAll) {
                            onFoodTypeFilterChange("VEG")
                        } else {
                            onFoodTypeFilterChange("ALL")
                        }
                    }
            ) {
                Checkbox(
                    checked = showAll,
                    onCheckedChange = {
                        if (it) onFoodTypeFilterChange("ALL") else onFoodTypeFilterChange("VEG")
                    },
                    colors = CheckboxDefaults.colors(
                        checkedColor = SaSGreen,
                        uncheckedColor = TextSecondary.copy(alpha = 0.5f),
                        checkmarkColor = Color.White
                    ),
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    "All",
                    color = if (showAll) SaSGreen else TextSecondary,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            // iOS-style Toggle for Veg/Non-Veg (disabled when "All" checkbox is checked)
            val toggleAlpha = if (showAll) 0.35f else 1f
            Box(
                modifier = Modifier
                    .width(80.dp)
                    .height(30.dp)
                    .clip(RoundedCornerShape(15.dp))
                    .background(
                        if (showAll) CardBorderDark.copy(alpha = 0.3f)
                        else if (isVegMode) SaSGreen.copy(alpha = 0.15f)
                        else StatusDanger.copy(alpha = 0.15f),
                        RoundedCornerShape(15.dp)
                    )
                    .border(
                        1.dp,
                        if (showAll) CardBorderDark.copy(alpha = 0.3f)
                        else if (isVegMode) SaSGreen.copy(alpha = 0.4f)
                        else StatusDanger.copy(alpha = 0.4f),
                        RoundedCornerShape(15.dp)
                    )
                    .clickable(enabled = !showAll) {
                        onFoodTypeFilterChange(if (isVegMode) "NON-VEG" else "VEG")
                    }
                    .padding(horizontal = 3.dp, vertical = 3.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                // Track labels
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier.weight(1f),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            "VEG",
                            fontSize = 8.sp,
                            fontWeight = FontWeight.Black,
                            color = if (!isVegMode || showAll) TextSecondary.copy(alpha = toggleAlpha)
                                    else SaSGreen.copy(alpha = 0f)
                        )
                    }
                    Box(
                        modifier = Modifier.weight(1f),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            "N-VEG",
                            fontSize = 8.sp,
                            fontWeight = FontWeight.Black,
                            color = if (isVegMode || showAll) TextSecondary.copy(alpha = toggleAlpha)
                                    else StatusDanger.copy(alpha = 0f)
                        )
                    }
                }

                // Sliding thumb
                val thumbOffset by animateDpAsState(
                    targetValue = if (isVegMode) 0.dp else 38.dp,
                    animationSpec = tween(durationMillis = 200),
                    label = "vegToggle"
                )
                Box(
                    modifier = Modifier
                        .offset(x = thumbOffset)
                        .size(width = 36.dp, height = 24.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(
                            if (showAll) CardBorderDark.copy(alpha = 0.5f)
                            else if (isVegMode) SaSGreen else StatusDanger
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (isVegMode) "VEG" else "N-VEG",
                        fontSize = 7.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                }
            }
        }

        // Price Tier Selector Row (Full names: Sale Price 1, 2, 3)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(CardDark)
                .padding(horizontal = 12.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            listOf(1, 2, 3).forEach { tier ->
                val isSelected = selectedPriceTier == tier
                val tierLabel = when (tier) {
                    1 -> "Sale Price 1"
                    2 -> "Sale Price 2"
                    3 -> "Sale Price 3"
                    else -> "Sale Price $tier"
                }
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .height(38.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (isSelected) SaSGreen else InputDark)
                        .border(
                            1.dp,
                            if (isSelected) SaSGreen else CardBorderDark,
                            RoundedCornerShape(8.dp)
                        )
                        .clickable { billingViewModel.setPriceTier(tier) },
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = tierLabel,
                        color = if (isSelected) Color.White else TextPrimary,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        HorizontalDivider(color = CardBorderDark)

        val cartTotal = remember(cart) { cart.entries.sumOf { (item, qty) -> item.price * qty } }
        val cartCount = remember(cart) { cart.values.sum() }
        val hasCartItems = cartCount > 0
        val gridBottomPadding = if (hasCartItems) 90.dp else 16.dp

        Box(modifier = Modifier.fillMaxSize().weight(1f)) {
            if (isLoading) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = SaSGreen)
                }
            } else if (error != null) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text(error, color = StatusDanger, fontSize = 13.sp)
                }
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(if (posSettings.showCompactItemView) 3 else 2),
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(start = 12.dp, top = 12.dp, end = 12.dp, bottom = gridBottomPadding),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(sortedItems) { item ->
                        val qtyInCart = cart[item] ?: 0
                        val punchedQty = oldKotItems[item] ?: 0
                        MenuItemCard(
                            item = item,
                            qtyInCart = qtyInCart,
                            punchedQty = punchedQty,
                            onAdd = { billingViewModel.addToCart(item) },
                            onRemove = { billingViewModel.removeFromCart(item) },
                            isCompact = posSettings.showCompactItemView,
                            currency = posSettings.currency,
                            showItemCodeDetails = posSettings.showItemsCodeDetails,
                            decimalPlaces = posSettings.decimalPlaces,
                            showItemImage = posSettings.showItemImage,
                            showItemsDetails = posSettings.showItemsDetails,
                            showItemsPrepTime = posSettings.showItemsPrepTime
                        )
                    }
                }
            }

            // Categories Floating Button (FAB)
            val fabBottomPadding by animateDpAsState(
                targetValue = if (hasCartItems) 88.dp else 16.dp,
                animationSpec = tween(durationMillis = 250),
                label = "categoryFabPadding"
            )

            FloatingActionButton(
                onClick = { showCategoriesDialog = true },
                containerColor = SaSGreen,
                contentColor = Color.White,
                shape = CircleShape,
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(bottom = fabBottomPadding, end = 16.dp)
                    .size(56.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.GridView,
                    contentDescription = "Categories",
                    modifier = Modifier.size(24.dp)
                )
            }

            // "View Order" Bottom Bar
            androidx.compose.animation.AnimatedVisibility(
                visible = hasCartItems,
                enter = slideInVertically(initialOffsetY = { it }) + fadeIn(),
                exit = slideOutVertically(targetOffsetY = { it }) + fadeOut(),
                modifier = Modifier.align(Alignment.BottomCenter)
            ) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp)
                        .clickable { onActiveSubTabChange("KOT") },
                    shape = RoundedCornerShape(28.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
                    border = BorderStroke(1.dp, SaSGreen.copy(alpha = 0.5f))
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 20.dp, vertical = 12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .background(SaSGreen.copy(alpha = 0.15f), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.ShoppingCart,
                                    contentDescription = "Cart",
                                    tint = SaSGreen,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                            Column {
                                Text(
                                    text = "$cartCount Item${if (cartCount > 1) "s" else ""} Selected",
                                    color = TextPrimary,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "Total: ${posSettings.currency} ${String.format(java.util.Locale.US, "%.${posSettings.decimalPlaces}f", cartTotal)}",
                                    color = SaSGreen,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Black
                                )
                            }
                        }

                        Button(
                            onClick = { onActiveSubTabChange("KOT") },
                            colors = ButtonDefaults.buttonColors(containerColor = SaSGreen),
                            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                            shape = RoundedCornerShape(20.dp)
                        ) {
                            Text(
                                text = "View Order",
                                color = Color.White,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Icon(
                                imageVector = Icons.Default.ArrowForward,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                }
            }
        }

        // Category dialog
        if (showCategoriesDialog) {
            val dialogCategories = remember(categories) {
                if (categories.any { it.name.equals("ALL", ignoreCase = true) }) {
                    categories
                } else {
                    listOf(com.example.sasloopmanager.data.CategoryItem(id = -1, name = "ALL", sortingOrder = 0)) + categories
                }
            }

            Dialog(onDismissRequest = { showCategoriesDialog = false }) {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = CardDark),
                    border = BorderStroke(1.dp, CardBorderDark),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                        .heightIn(max = 450.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Select Category",
                                color = TextPrimary,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold
                            )
                            IconButton(
                                onClick = { showCategoriesDialog = false },
                                modifier = Modifier.size(24.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Close,
                                    contentDescription = "Close",
                                    tint = TextSecondary,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        LazyColumn(
                            verticalArrangement = Arrangement.spacedBy(6.dp),
                            modifier = Modifier.weight(1f, fill = false)
                        ) {
                            items(dialogCategories) { category ->
                                val isSelected = selectedCategory == category.name
                                Card(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(50.dp)
                                        .clickable {
                                            billingViewModel.setCategory(category.name)
                                            showCategoriesDialog = false
                                        },
                                    shape = RoundedCornerShape(8.dp),
                                    colors = CardDefaults.cardColors(
                                        containerColor = if (isSelected) SaSGreen else InputDark
                                    ),
                                    border = if (isSelected) null else BorderStroke(1.dp, CardBorderDark)
                                ) {
                                    Row(
                                        modifier = Modifier
                                            .fillMaxSize()
                                            .padding(horizontal = 16.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(
                                            text = category.name,
                                            color = if (isSelected) Color.White else TextPrimary,
                                            fontSize = 13.sp,
                                            fontWeight = FontWeight.Bold,
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
                                        )
                                        if (isSelected) {
                                            Icon(
                                                imageVector = Icons.Default.Check,
                                                contentDescription = "Selected",
                                                tint = Color.White,
                                                modifier = Modifier.size(18.dp)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun KotSubTab(
    editingOrderId: Int?,
    activeOrders: List<com.example.sasloopmanager.data.Order>,
    selectedTable: com.example.sasloopmanager.data.TableItem?,
    cart: Map<com.example.sasloopmanager.data.MenuItem, Int>,
    oldKotItems: Map<com.example.sasloopmanager.data.MenuItem, Int>,
    activeFlow: String,
    preOrderDate: String,
    onPreOrderDateChange: (String) -> Unit,
    preOrderTime: String,
    onPreOrderTimeChange: (String) -> Unit,
    preOrderTypeInput: String,
    onPreOrderTypeInputChange: (String) -> Unit,
    customerName: String,
    onCustomerNameChange: (String) -> Unit,
    customerPhone: String,
    onCustomerPhoneChange: (String) -> Unit,
    selectedDialCode: String,
    onSelectedDialCodeChange: (String) -> Unit,
    customerAddress: String,
    onCustomerAddressChange: (String) -> Unit,
    selectedWaiter: String?,
    posSettings: com.example.sasloopmanager.data.PosSettings,
    billingViewModel: BillingViewModel,
    user: com.example.sasloopmanager.data.UserProfile?,
    context: Context,
    onActiveSubTabChange: (String) -> Unit,
    kotNote: String,
    onKotNoteChange: (String) -> Unit,
    coversCount: String,
    onCoversCountChange: (String) -> Unit,
    isComplimentaryOrder: Boolean,
    onIsComplimentaryOrderChange: (Boolean) -> Unit,
    ebillEnabled: Boolean,
    onEbillEnabledChange: (Boolean) -> Unit,
    selectedCountryFlag: String,
    onSelectedCountryFlagChange: (String) -> Unit,
    selectedCountryCode: String,
    onSelectedCountryCodeChange: (String) -> Unit,
    showCountryDropdown: Boolean,
    onShowCountryDropdownChange: (Boolean) -> Unit,
    onShowDiscountDialogChange: (Boolean) -> Unit,
    onShowChargesDialogChange: (Boolean) -> Unit,
    onShowWaiterDialogChange: (Boolean) -> Unit,
    onShowHistoryDialogChange: (Boolean) -> Unit,
    onClearAllFields: () -> Unit
) {
    val CardDark = MaterialTheme.colorScheme.surface
    val CardBorderDark = MaterialTheme.colorScheme.outline
    val InputDark = MaterialTheme.colorScheme.surfaceVariant
    val TextPrimary = MaterialTheme.colorScheme.onBackground
    val TextSecondary = MaterialTheme.colorScheme.onSurfaceVariant
    val isLoading by billingViewModel.isLoading.collectAsStateWithLifecycle()

    val combinedItems = cart

    if (showCountryDropdown) {
        Dialog(onDismissRequest = { onShowCountryDropdownChange(false) }) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = CardDark),
                border = BorderStroke(1.dp, CardBorderDark),
                modifier = Modifier.fillMaxWidth().padding(16.dp).heightIn(max = 400.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Select Country", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp, modifier = Modifier.padding(bottom = 12.dp))
                    LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        items(countryCodes) { country ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        onSelectedCountryCodeChange(country.code)
                                        onSelectedCountryFlagChange(country.flag)
                                        onSelectedDialCodeChange(country.dialCode)
                                        onShowCountryDropdownChange(false)
                                    }
                                    .padding(vertical = 8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(country.flag, fontSize = 18.sp, modifier = Modifier.width(32.dp))
                                Text(country.name, color = Color.White, fontSize = 14.sp, modifier = Modifier.weight(1f))
                                Text(country.dialCode, color = SaSGreen, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                            }
                            HorizontalDivider(color = CardBorderDark)
                        }
                    }
                }
            }
        }
    }

    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Table Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFFF1F3F6))
                .padding(horizontal = 16.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Item Name", modifier = Modifier.weight(2f), fontWeight = FontWeight.Bold, fontSize = 11.sp, color = Color(0xFF1B2A47))
            Text("Qty", modifier = Modifier.weight(1f), fontWeight = FontWeight.Bold, fontSize = 11.sp, color = Color(0xFF1B2A47), textAlign = TextAlign.Center)
            Text("Amount", modifier = Modifier.weight(1f), fontWeight = FontWeight.Bold, fontSize = 11.sp, color = Color(0xFF1B2A47), textAlign = TextAlign.End)
        }

        // Scrollable Items Area
        if (combinedItems.isEmpty()) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "No items",
                    color = TextSecondary,
                    fontSize = 14.sp,
                    fontStyle = FontStyle.Italic
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {

                // Show new cart items
                items(cart.entries.toList()) { entry ->
                    val item = entry.key
                    val qty = entry.value
                    val itemTotal = (item.price + (item.selectedModifiers ?: emptyList()).sumOf { it.price }) * qty
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(2f)) {
                            Text(item.displayName, color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            Text("New Cart Item", color = StatusWarning, fontSize = 9.sp, fontWeight = FontWeight.SemiBold)
                        }
                        Row(
                            modifier = Modifier.weight(1f),
                            horizontalArrangement = Arrangement.Center,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            IconButton(
                                onClick = { billingViewModel.removeFromCart(item) },
                                modifier = Modifier.size(24.dp)
                            ) {
                                Icon(Icons.Default.RemoveCircleOutline, "Remove", tint = StatusDanger, modifier = Modifier.size(16.dp))
                            }
                            Text("$qty", color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Black)
                            IconButton(
                                onClick = { billingViewModel.addToCart(item) },
                                modifier = Modifier.size(24.dp)
                            ) {
                                Icon(Icons.Default.AddCircleOutline, "Add", tint = SaSGreen, modifier = Modifier.size(16.dp))
                            }
                        }
                        Text(
                            text = formatPrice(itemTotal, posSettings),
                            color = TextPrimary,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.weight(1f),
                            textAlign = TextAlign.End
                        )
                    }
                    HorizontalDivider(color = CardBorderDark.copy(alpha = 0.5f))
                }
            }
        }

        // Footer Section
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(CardDark)
                .padding(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {


            // Row 2: Customer Inputs (Dial Dropdown, Mobile, Name, History, Waiter, Checkbox)
            val searchResults by billingViewModel.searchResults.collectAsStateWithLifecycle()
            var showCustomerDropdown by remember { mutableStateOf(false) }

            var selectedCustomer by remember { mutableStateOf<com.example.sasloopmanager.data.SearchedCustomer?>(null) }

            LaunchedEffect(customerPhone, searchResults) {
                if (searchResults.isNotEmpty()) {
                    val fullInputNumber = (selectedDialCode + customerPhone).replace("+", "")
                    val matched = searchResults.find {
                        val cleanNum = (it.number ?: "").replace("+", "")
                        cleanNum == fullInputNumber || cleanNum == customerPhone.replace("+", "")
                    }
                    if (matched != null) {
                        selectedCustomer = matched
                    }
                }
            }

            LaunchedEffect(customerPhone) {
                selectedCustomer?.let { cust ->
                    val cleanInput = customerPhone.replace("+", "")
                    val cleanSelected = (cust.number ?: "").replace("+", "")
                    val fullInput = (selectedDialCode + customerPhone).replace("+", "")
                    if (cleanInput != cleanSelected && fullInput != cleanSelected) {
                        selectedCustomer = null
                    }
                }

                if (customerPhone.length >= 3) {
                    billingViewModel.searchCustomers(customerPhone)
                    showCustomerDropdown = true
                } else {
                    billingViewModel.clearSearchResults()
                    showCustomerDropdown = false
                }
            }

            Box(modifier = Modifier.fillMaxWidth()) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    // Country Code Dropdown + Mobile Input (grouped)
                    Row(
                        modifier = Modifier
                            .weight(1.3f)
                            .height(36.dp)
                            .background(InputDark, RoundedCornerShape(18.dp))
                            .border(1.dp, CardBorderDark, RoundedCornerShape(18.dp))
                            .padding(horizontal = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            modifier = Modifier
                                .clickable { onShowCountryDropdownChange(true) },
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(text = selectedCountryFlag, fontSize = 11.sp)
                            Spacer(modifier = Modifier.width(2.dp))
                            Text(text = selectedDialCode, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                            Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = TextPrimary, modifier = Modifier.size(12.dp))
                        }
                        Spacer(modifier = Modifier.width(4.dp))
                        BasicTextField(
                            value = customerPhone,
                            onValueChange = onCustomerPhoneChange,
                            textStyle = TextStyle(color = TextPrimary, fontSize = 11.sp, fontWeight = FontWeight.Medium),
                            singleLine = true,
                            cursorBrush = SolidColor(SaSGreen),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                            modifier = Modifier.weight(1f),
                            decorationBox = { innerTextField ->
                                Box(contentAlignment = Alignment.CenterStart) {
                                    if (customerPhone.isEmpty()) {
                                        Text("Customer Mobile", color = TextSecondary, fontSize = 10.sp)
                                    }
                                    innerTextField()
                                }
                            }
                        )
                    }

                    // Customer Name Input
                    BasicTextField(
                        value = customerName,
                        onValueChange = onCustomerNameChange,
                        textStyle = TextStyle(color = TextPrimary, fontSize = 11.sp, fontWeight = FontWeight.Medium),
                        singleLine = true,
                        cursorBrush = SolidColor(SaSGreen),
                        modifier = Modifier
                            .weight(1f)
                            .height(36.dp)
                            .background(InputDark, RoundedCornerShape(18.dp))
                            .border(1.dp, CardBorderDark, RoundedCornerShape(18.dp))
                            .padding(horizontal = 12.dp),
                        decorationBox = { innerTextField ->
                            Box(contentAlignment = Alignment.CenterStart) {
                                if (customerName.isEmpty()) {
                                    Text("Customer Name", color = TextSecondary, fontSize = 10.sp)
                                }
                                innerTextField()
                            }
                        }
                    )

                    // History button
                    IconButton(onClick = { onShowHistoryDialogChange(true) }, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.History, contentDescription = "History", tint = TextPrimary, modifier = Modifier.size(20.dp))
                    }

                    // Waiter selection
                    IconButton(onClick = { onShowWaiterDialogChange(true) }, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.Person, contentDescription = "Waiter", tint = TextPrimary, modifier = Modifier.size(20.dp))
                    }

                    // Checkbox
                    Checkbox(
                        checked = ebillEnabled,
                        onCheckedChange = onEbillEnabledChange,
                        colors = CheckboxDefaults.colors(checkedColor = SaSGreen, uncheckedColor = TextSecondary),
                        modifier = Modifier.size(20.dp)
                    )
                }

                // Customer Search Dropdown
                if (showCustomerDropdown && searchResults.isNotEmpty()) {
                    Card(
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = CardDark),
                        border = BorderStroke(1.dp, SaSGreen.copy(alpha = 0.5f)),
                        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
                        modifier = Modifier
                            .fillMaxWidth(0.6f)
                            .padding(top = 40.dp)
                            .heightIn(max = 180.dp)
                    ) {
                        LazyColumn(
                            modifier = Modifier.padding(4.dp),
                            verticalArrangement = Arrangement.spacedBy(2.dp)
                        ) {
                            items(searchResults) { customer ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable {
                                            selectedCustomer = customer
                                            onCustomerPhoneChange(customer.number ?: "")
                                            onCustomerNameChange(customer.name ?: "")
                                            onCustomerAddressChange(customer.address ?: "")
                                            showCustomerDropdown = false
                                            billingViewModel.clearSearchResults()
                                        }
                                        .padding(horizontal = 12.dp, vertical = 8.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Icon(Icons.Default.Person, contentDescription = null, tint = SaSGreen, modifier = Modifier.size(16.dp))
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = customer.name ?: "Unknown",
                                            color = TextPrimary,
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold,
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
                                        )
                                        Text(
                                            text = customer.number ?: "",
                                            color = SaSGreen,
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.SemiBold
                                        )
                                    }
                                }
                                HorizontalDivider(color = CardBorderDark.copy(alpha = 0.3f))
                            }
                        }
                    }
                }
            }

            // Row 3: Customer Add, Circular Add Button, KOT Note, Covers, Trash
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                // Customer Add (Address)
                BasicTextField(
                    value = customerAddress,
                    onValueChange = onCustomerAddressChange,
                    textStyle = TextStyle(color = TextPrimary, fontSize = 11.sp, fontWeight = FontWeight.Medium),
                    singleLine = true,
                    cursorBrush = SolidColor(SaSGreen),
                    modifier = Modifier
                        .weight(1.2f)
                        .height(36.dp)
                        .background(InputDark, RoundedCornerShape(18.dp))
                        .border(1.dp, CardBorderDark, RoundedCornerShape(18.dp))
                        .padding(horizontal = 12.dp),
                    decorationBox = { innerTextField ->
                        Box(contentAlignment = Alignment.CenterStart) {
                            if (customerAddress.isEmpty()) {
                                Text("Customer Add", color = TextSecondary, fontSize = 10.sp)
                            }
                            innerTextField()
                        }
                    }
                )

                // Plus circle button
                Box(
                    modifier = Modifier
                        .size(28.dp)
                        .clip(CircleShape)
                        .background(Color(0xFF1B2A47))
                        .clickable {
                            Toast.makeText(context, "Customer Info Updated", Toast.LENGTH_SHORT).show()
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Add", tint = Color.White, modifier = Modifier.size(16.dp))
                }

                // KOT Note
                BasicTextField(
                    value = kotNote,
                    onValueChange = onKotNoteChange,
                    textStyle = TextStyle(color = TextPrimary, fontSize = 11.sp, fontWeight = FontWeight.Medium),
                    singleLine = true,
                    cursorBrush = SolidColor(SaSGreen),
                    modifier = Modifier
                        .weight(1.2f)
                        .height(36.dp)
                        .background(InputDark, RoundedCornerShape(18.dp))
                        .border(1.dp, CardBorderDark, RoundedCornerShape(18.dp))
                        .padding(horizontal = 12.dp),
                    decorationBox = { innerTextField ->
                        Box(contentAlignment = Alignment.CenterStart) {
                            if (kotNote.isEmpty()) {
                                Text("KOT Note", color = TextSecondary, fontSize = 10.sp)
                            }
                            innerTextField()
                        }
                    }
                )

                // Covers
                BasicTextField(
                    value = coversCount,
                    onValueChange = onCoversCountChange,
                    textStyle = TextStyle(color = TextPrimary, fontSize = 11.sp, fontWeight = FontWeight.Medium),
                    singleLine = true,
                    cursorBrush = SolidColor(SaSGreen),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier
                        .weight(0.7f)
                        .height(36.dp)
                        .background(InputDark, RoundedCornerShape(18.dp))
                        .border(1.dp, CardBorderDark, RoundedCornerShape(18.dp))
                        .padding(horizontal = 12.dp),
                    decorationBox = { innerTextField ->
                        Box(contentAlignment = Alignment.CenterStart) {
                            if (coversCount.isEmpty()) {
                                Text("Covers", color = TextSecondary, fontSize = 10.sp)
                            }
                            innerTextField()
                        }
                    }
                )

                // Trash icon
                IconButton(
                    onClick = onClearAllFields,
                    modifier = Modifier.size(32.dp)
                ) {
                    Icon(Icons.Default.Delete, contentDescription = "Clear", tint = Color.Red, modifier = Modifier.size(20.dp))
                }
            }

            selectedCustomer?.let { cust ->
                val bal = cust.balance ?: 0.0
                Spacer(modifier = Modifier.height(4.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            if (bal >= 0) SaSGreen.copy(alpha = 0.08f) else StatusDanger.copy(alpha = 0.08f),
                            RoundedCornerShape(8.dp)
                        )
                        .border(
                            1.dp,
                            if (bal >= 0) SaSGreen.copy(alpha = 0.3f) else StatusDanger.copy(alpha = 0.3f),
                            RoundedCornerShape(8.dp)
                        )
                        .padding(horizontal = 10.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Payment,
                            contentDescription = "Payment",
                            tint = if (bal >= 0) SaSGreen else StatusDanger,
                            modifier = Modifier.size(14.dp)
                        )
                        Text(
                            text = if (bal >= 0) "Balance: ${posSettings.currency}${String.format(java.util.Locale.US, "%.2f", bal)}"
                                   else "Due: ${posSettings.currency}${String.format(java.util.Locale.US, "%.2f", Math.abs(bal))}",
                            color = if (bal >= 0) SaSGreen else StatusDanger,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Black
                        )
                    }
                    if (bal < 0) {
                        var showPayDueDialog by remember { mutableStateOf(false) }
                        
                        Button(
                            onClick = { showPayDueDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = SaSGreen),
                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 0.dp),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.height(26.dp)
                        ) {
                            Text("Pay Due", color = Color.White, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        }
                        
                        if (showPayDueDialog) {
                            PayDueDialog(
                                customer = cust,
                                onDismiss = { showPayDueDialog = false },
                                billingViewModel = billingViewModel,
                                posSettings = posSettings,
                                context = context
                            )
                        }
                    }
                }
            }

            // Green Total Banner
            val subtotal = combinedItems.entries.sumOf { (item, qty) -> item.price * qty }
            val formattedTotal = formatPrice(subtotal, posSettings)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(SaSGreen, RoundedCornerShape(4.dp))
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Total:    $formattedTotal",
                    color = Color.White,
                    fontWeight = FontWeight.Black,
                    fontSize = 18.sp
                )
            }

            // Action Buttons: Save & Print & Save
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Save KOT
                Button(
                    onClick = {
                        if (cart.isEmpty()) {
                            Toast.makeText(context, "No new items to save", Toast.LENGTH_SHORT).show()
                        } else {
                            val fullCustomerNumber = if (customerPhone.isBlank()) "" else "${selectedDialCode}${customerPhone}"
                            billingViewModel.saveKOT(
                                customerName = customerName,
                                customerNumber = fullCustomerNumber,
                                address = customerAddress,
                                orderType = if (activeFlow == "DINEIN") "DINE-IN" else "TAKEAWAY",
                                kotNote = kotNote,
                                waiterName = selectedWaiter,
                                shouldPrint = false
                            ) { success ->
                                if (success) {
                                    Toast.makeText(context, "KOT Saved Successfully", Toast.LENGTH_SHORT).show()
                                    onActiveSubTabChange("BILLING")
                                }
                            }
                        }
                    },
                    enabled = !isLoading,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1B2A47)),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .weight(1f)
                        .height(44.dp)
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(16.dp))
                    } else {
                        Text("Save", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    }
                }

                // Print & Save
                Button(
                    onClick = {
                        if (cart.isEmpty()) {
                            Toast.makeText(context, "No new items to save", Toast.LENGTH_SHORT).show()
                        } else {
                            val fullCustomerNumber = if (customerPhone.isBlank()) "" else "${selectedDialCode}${customerPhone}"
                            billingViewModel.saveKOT(
                                customerName = customerName,
                                customerNumber = fullCustomerNumber,
                                address = customerAddress,
                                orderType = if (activeFlow == "DINEIN") "DINE-IN" else "TAKEAWAY",
                                kotNote = kotNote,
                                waiterName = selectedWaiter,
                                shouldPrint = true
                            ) { success ->
                                if (success) {
                                    Toast.makeText(context, "KOT Saved & Printed Successfully", Toast.LENGTH_SHORT).show()
                                    onActiveSubTabChange("BILLING")
                                }
                            }
                        }
                    },
                    enabled = !isLoading,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1B2A47)),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .weight(1f)
                        .height(44.dp)
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(16.dp))
                    } else {
                        Text("Print & Save", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    }
                }
            }
        }
    }
}

@Composable
fun BillingSubTab(
    billingItems: Map<com.example.sasloopmanager.data.MenuItem, Int>,
    posSettings: com.example.sasloopmanager.data.PosSettings,
    orderType: String,
    discountInput: String,
    onDiscountInputChange: (String) -> Unit,
    serviceChargeInput: String,
    onServiceChargeInputChange: (String) -> Unit,
    deliveryChargeInput: String,
    onDeliveryChargeInputChange: (String) -> Unit,
    advancePaidInput: String,
    onAdvancePaidInputChange: (String) -> Unit,
    isComplimentaryOrder: Boolean,
    onIsComplimentaryOrderChange: (Boolean) -> Unit,
    customerName: String,
    customerPhone: String,
    customerAddress: String,
    preOrderDate: String,
    preOrderTime: String,
    preOrderTypeInput: String,
    editingOrderId: Int?,
    preOrderIdInput: String,
    activeFlow: String,
    selectedTable: com.example.sasloopmanager.data.TableItem?,
    selectedWaiter: String?,
    user: com.example.sasloopmanager.data.UserProfile?,
    billingViewModel: BillingViewModel,
    context: Context,
    onShowPaymentDialogChange: (Boolean) -> Unit,
    onShowOldKotDialogChange: (Boolean) -> Unit,
    onShowSplitBillDialogChange: (Boolean) -> Unit,
    onShowPreviewDialogChange: (Boolean) -> Unit,
    onShowDiscountDialogChange: (Boolean) -> Unit,
    onShowChargesDialogChange: (Boolean) -> Unit,
    onShowWaiterDialogChange: (Boolean) -> Unit,
    onShowHistoryDialogChange: (Boolean) -> Unit,
    ebillEnabled: Boolean,
    onEbillEnabledChange: (Boolean) -> Unit,
    selectedDialCode: String,
    paymentMethod: String
) {
    val CardDark = MaterialTheme.colorScheme.surface
    val CardBorderDark = MaterialTheme.colorScheme.outline
    val InputDark = MaterialTheme.colorScheme.surfaceVariant
    val TextPrimary = MaterialTheme.colorScheme.onBackground
    val TextSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    val tableStatuses by billingViewModel.tableStatuses.collectAsStateWithLifecycle()
    val selectedTableStatus = remember(selectedTable, tableStatuses) {
        selectedTable?.let { tableStatuses[it.id.toString()]?.uppercase() }
    }
    val isSettleEnabled = activeFlow != "DINEIN" || selectedTableStatus == "BILL_SAVED" || selectedTableStatus == "PRINTED"

    val subtotal = billingItems.entries.sumOf { (item, qty) -> item.price * qty }
    val discount = discountInput.toDoubleOrNull() ?: 0.0
    val taxableAmount = (subtotal - discount).coerceAtLeast(0.0)

    val taxRate = posSettings.taxRate
    val isInclusive = posSettings.isTaxInclusive
    val computedTax = if (isInclusive) {
        taxableAmount * (taxRate / (100.0 + taxRate))
    } else {
        taxableAmount * (taxRate / 100.0)
    }
    val cgst = computedTax / 2.0
    val sgst = computedTax / 2.0

    val defaultServiceCharge = if (posSettings.enableServiceCharge && orderType == "DINE-IN") {
        taxableAmount * (posSettings.serviceChargeRate / 100.0)
    } else {
        0.0
    }
    val serviceCharge = serviceChargeInput.toDoubleOrNull() ?: defaultServiceCharge
    val deliveryCharge = if (orderType == "DELIVERY") (deliveryChargeInput.toDoubleOrNull() ?: 0.0) else 0.0

    val calculatedTotal = if (isInclusive) {
        taxableAmount + serviceCharge + deliveryCharge
    } else {
        taxableAmount + cgst + sgst + serviceCharge + deliveryCharge
    }
    val totalBeforeRounding = if (isComplimentaryOrder) 0.0 else calculatedTotal
    val finalTotal = if (posSettings.autoRoundOff) {
        kotlin.math.round(totalBeforeRounding)
    } else {
        totalBeforeRounding
    }
    val advancePaid = advancePaidInput.toDoubleOrNull() ?: 0.0
    val remainingBalance = (finalTotal - advancePaid).coerceAtLeast(0.0)

    Column(
        modifier = Modifier
            .fillMaxSize()
    ) {
        // Top Green Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(SaSGreen)
                .padding(horizontal = 16.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "Bill ${editingOrderId ?: ""}",
                color = Color.White,
                fontWeight = FontWeight.Bold,
                fontSize = 15.sp
            )

            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .border(1.dp, Color.White, RoundedCornerShape(12.dp))
                        .clickable { onShowOldKotDialogChange(true) }
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text("Old KOT", color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }

                Box(
                    modifier = Modifier
                        .border(1.dp, Color.White, RoundedCornerShape(12.dp))
                        .clickable {
                            if (!isSettleEnabled) {
                                Toast.makeText(context, "Please save or print the bill first", Toast.LENGTH_SHORT).show()
                            } else {
                                onShowSplitBillDialogChange(true)
                            }
                        }
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text("Split Bill", color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }

            Text(
                text = selectedTable?.tableName ?: when (activeFlow) {
                    "QUICK_BILL" -> "Quick Bill"
                    "PREORDER" -> "Pre-Order"
                    else -> "Takeaway"
                },
                color = Color.White,
                fontWeight = FontWeight.Bold,
                fontSize = 15.sp
            )
        }

        // Table Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFFF1F3F6))
                .padding(horizontal = 16.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Item Name", modifier = Modifier.weight(2f), fontWeight = FontWeight.Bold, fontSize = 11.sp, color = Color(0xFF1B2A47))
            Text("Qty", modifier = Modifier.weight(1f), fontWeight = FontWeight.Bold, fontSize = 11.sp, color = Color(0xFF1B2A47), textAlign = TextAlign.Center)
            Text("Amount", modifier = Modifier.weight(1f), fontWeight = FontWeight.Bold, fontSize = 11.sp, color = Color(0xFF1B2A47), textAlign = TextAlign.End)
        }

        // Scrollable Receipt Items
        if (billingItems.isEmpty()) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "No items",
                    color = TextSecondary,
                    fontSize = 14.sp,
                    fontStyle = FontStyle.Italic
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                items(billingItems.entries.toList()) { entry ->
                    val item = entry.key
                    val qty = entry.value
                    val itemTotal = (item.price + (item.selectedModifiers ?: emptyList()).sumOf { it.price }) * qty
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(2f)) {
                            Text(item.displayName, color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            if (!item.selectedModifiers.isNullOrEmpty()) {
                                item.selectedModifiers.forEach { mod ->
                                    Text("+ ${mod.name}", color = TextSecondary, fontSize = 9.sp, fontStyle = FontStyle.Italic)
                                }
                            }
                        }
                        Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.Center) {
                            Text("$qty", color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Black)
                        }
                        Text(
                            text = formatPrice(itemTotal, posSettings),
                            color = TextPrimary,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.weight(1f),
                            textAlign = TextAlign.End
                        )
                    }
                    HorizontalDivider(color = CardBorderDark.copy(alpha = 0.5f))
                }
            }
        }

        // Bottom Controls Container
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(CardDark)
                .padding(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Row 1: Footer icons (Waiter outline, Waiter cloche, eBill checkbox)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = { onShowWaiterDialogChange(true) }, modifier = Modifier.size(36.dp)) {
                    Icon(Icons.Default.Person, contentDescription = "Select Waiter", tint = TextPrimary, modifier = Modifier.size(24.dp))
                }
                Spacer(modifier = Modifier.width(6.dp))
                IconButton(onClick = {
                    Toast.makeText(context, "Waiter notified", Toast.LENGTH_SHORT).show()
                }, modifier = Modifier.size(36.dp)) {
                    Icon(Icons.Default.Notifications, contentDescription = "Call Waiter", tint = TextPrimary, modifier = Modifier.size(24.dp))
                }
                Spacer(modifier = Modifier.width(12.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.clickable { onEbillEnabledChange(!ebillEnabled) }
                ) {
                    Checkbox(
                        checked = ebillEnabled,
                        onCheckedChange = onEbillEnabledChange,
                        colors = CheckboxDefaults.colors(checkedColor = SaSGreen, uncheckedColor = TextSecondary),
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(2.dp))
                    Text("eBill", color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }

            // Green Total payable banner with Action Icons (Preview, Print, Discount, Payment)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(SaSGreen, RoundedCornerShape(4.dp))
                    .padding(horizontal = 12.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Total:    ${formatPrice(remainingBalance, posSettings)}",
                    color = Color.White,
                    fontWeight = FontWeight.Black,
                    fontSize = 18.sp
                )

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    IconButton(onClick = { onShowPreviewDialogChange(true) }, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.Visibility, contentDescription = "Preview", tint = Color.White, modifier = Modifier.size(20.dp))
                    }
                    IconButton(
                        onClick = {
                            val fullCustomerNumber = if (customerPhone.isBlank()) "" else "${selectedDialCode}${customerPhone}"
                            val finalAddress = if (activeFlow == "PREORDER") {
                                "Scheduled: $preOrderDate $preOrderTime | Address: $customerAddress | Type: $preOrderTypeInput"
                            } else {
                                customerAddress
                            }
                            billingViewModel.settleOrder(
                                customerName = customerName,
                                customerNumber = fullCustomerNumber,
                                address = finalAddress,
                                paymentMethod = paymentMethod,
                                orderType = orderType,
                                discountAmount = discount,
                                serviceCharge = serviceCharge,
                                deliveryCharge = deliveryCharge,
                                cgst = cgst,
                                sgst = sgst,
                                preOrderId = if (orderType == "PRE-ORDER" || activeFlow == "PREORDER") preOrderIdInput else null,
                                preOrderAdvance = if (orderType == "PRE-ORDER" || activeFlow == "PREORDER") advancePaid else null,
                                preOrderBalance = if (orderType == "PRE-ORDER" || activeFlow == "PREORDER") remainingBalance else null,
                                tableName = selectedTable?.tableName ?: "Direct",
                                waiterName = selectedWaiter,
                                shouldPrint = true,
                                checkoutType = "PRINT",
                                userName = user?.name ?: user?.username ?: "admin"
                            ) { success ->
                                if (success) {
                                    Toast.makeText(context, "Bill Printed Successfully", Toast.LENGTH_SHORT).show()
                                }
                            }
                        },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(Icons.Default.Print, contentDescription = "Print", tint = Color.White, modifier = Modifier.size(20.dp))
                    }
                    IconButton(onClick = { onShowDiscountDialogChange(true) }, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.LocalOffer, contentDescription = "Discount", tint = Color.White, modifier = Modifier.size(20.dp))
                    }
                    IconButton(onClick = { onShowPaymentDialogChange(true) }, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.Payment, contentDescription = "Payment Methods", tint = Color.White, modifier = Modifier.size(20.dp))
                    }
                }
            }

            // Bottom Actions: Save Bill, Print & Save, Payment
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Save Bill
                Button(
                    onClick = {
                        val fullCustomerNumber = if (customerPhone.isBlank()) "" else "${selectedDialCode}${customerPhone}"
                        val finalAddress = if (activeFlow == "PREORDER") {
                            "Scheduled: $preOrderDate $preOrderTime | Address: $customerAddress | Type: $preOrderTypeInput"
                        } else {
                            customerAddress
                        }
                        billingViewModel.settleOrder(
                            customerName = customerName,
                            customerNumber = fullCustomerNumber,
                            address = finalAddress,
                            paymentMethod = paymentMethod,
                            orderType = orderType,
                            discountAmount = discount,
                            serviceCharge = serviceCharge,
                            deliveryCharge = deliveryCharge,
                            cgst = cgst,
                            sgst = sgst,
                            preOrderId = if (orderType == "PRE-ORDER" || activeFlow == "PREORDER") preOrderIdInput else null,
                            preOrderAdvance = if (orderType == "PRE-ORDER" || activeFlow == "PREORDER") advancePaid else null,
                            preOrderBalance = if (orderType == "PRE-ORDER" || activeFlow == "PREORDER") remainingBalance else null,
                            tableName = selectedTable?.tableName ?: "Direct",
                            waiterName = selectedWaiter,
                            shouldPrint = false,
                            checkoutType = "SAVE",
                            userName = user?.name ?: user?.username ?: "admin"
                        ) { success ->
                            if (success) {
                                Toast.makeText(context, "Bill Saved Successfully", Toast.LENGTH_SHORT).show()
                                billingViewModel.goBack()
                            }
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1B2A47)),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .weight(1f)
                        .height(44.dp)
                ) {
                    Text("Save Bill", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }

                // Print & Save
                Button(
                    onClick = {
                        val fullCustomerNumber = if (customerPhone.isBlank()) "" else "${selectedDialCode}${customerPhone}"
                        val finalAddress = if (activeFlow == "PREORDER") {
                            "Scheduled: $preOrderDate $preOrderTime | Address: $customerAddress | Type: $preOrderTypeInput"
                        } else {
                            customerAddress
                        }
                        billingViewModel.settleOrder(
                            customerName = customerName,
                            customerNumber = fullCustomerNumber,
                            address = finalAddress,
                            paymentMethod = paymentMethod,
                            orderType = orderType,
                            discountAmount = discount,
                            serviceCharge = serviceCharge,
                            deliveryCharge = deliveryCharge,
                            cgst = cgst,
                            sgst = sgst,
                            preOrderId = if (orderType == "PRE-ORDER" || activeFlow == "PREORDER") preOrderIdInput else null,
                            preOrderAdvance = if (orderType == "PRE-ORDER" || activeFlow == "PREORDER") advancePaid else null,
                            preOrderBalance = if (orderType == "PRE-ORDER" || activeFlow == "PREORDER") remainingBalance else null,
                            tableName = selectedTable?.tableName ?: "Direct",
                            waiterName = selectedWaiter,
                            shouldPrint = true,
                            checkoutType = "PRINT",
                            userName = user?.name ?: user?.username ?: "admin"
                        ) { success ->
                            if (success) {
                                Toast.makeText(context, "Bill Saved & Printed Successfully", Toast.LENGTH_SHORT).show()
                                billingViewModel.goBack()
                            }
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1B2A47)),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .weight(1.2f)
                        .height(44.dp)
                ) {
                    Text("Print & Save", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }

                // Payment (Select methods)
                Button(
                    onClick = {
                        if (!isSettleEnabled) {
                            Toast.makeText(context, "Please save or print the bill first", Toast.LENGTH_SHORT).show()
                        } else {
                            onShowPaymentDialogChange(true)
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1B2A47)),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .weight(1f)
                        .height(44.dp)
                ) {
                    Text("Payment", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }
            }

            // Settle Bill Button (Full Width)
            Button(
                onClick = {
                    if (!isSettleEnabled) {
                        Toast.makeText(context, "Please save or print the bill first", Toast.LENGTH_SHORT).show()
                        return@Button
                    }
                    val fullCustomerNumber = if (customerPhone.isBlank()) "" else "${selectedDialCode}${customerPhone}"
                    val finalAddress = if (activeFlow == "PREORDER") {
                        "Scheduled: $preOrderDate $preOrderTime | Address: $customerAddress | Type: $preOrderTypeInput"
                    } else {
                        customerAddress
                    }
                    billingViewModel.settleOrder(
                        customerName = customerName,
                        customerNumber = fullCustomerNumber,
                        address = finalAddress,
                        paymentMethod = paymentMethod,
                        orderType = orderType,
                        discountAmount = discount,
                        serviceCharge = serviceCharge,
                        deliveryCharge = deliveryCharge,
                        cgst = cgst,
                        sgst = sgst,
                        preOrderId = if (orderType == "PRE-ORDER" || activeFlow == "PREORDER") preOrderIdInput else null,
                        preOrderAdvance = if (orderType == "PRE-ORDER" || activeFlow == "PREORDER") advancePaid else null,
                        preOrderBalance = if (orderType == "PRE-ORDER" || activeFlow == "PREORDER") remainingBalance else null,
                        tableName = selectedTable?.tableName ?: "Direct",
                        waiterName = selectedWaiter,
                        shouldPrint = false,
                        checkoutType = "SETTLE",
                        userName = user?.name ?: user?.username ?: "admin"
                    ) { success ->
                        if (success) {
                            Toast.makeText(context, "Settle via $paymentMethod Successful", Toast.LENGTH_SHORT).show()
                            billingViewModel.goBack()
                        }
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1B2A47)),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(44.dp)
            ) {
                Text(
                    text = "Settle Bill",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp
                )
            }
        }
    }
}




val ClocheIcon: ImageVector = ImageVector.Builder(
    name = "ClocheIcon",
    defaultWidth = 24.dp,
    defaultHeight = 24.dp,
    viewportWidth = 24f,
    viewportHeight = 24f
).path(
    fill = null,
    stroke = SolidColor(Color(0xFF000000)),
    strokeLineWidth = 2.5f,
    strokeLineCap = StrokeCap.Round
) {
    moveTo(3f, 20f)
    lineTo(21f, 20f)
}.path(
    fill = SolidColor(Color(0xFF000000)),
    stroke = SolidColor(Color(0xFF000000)),
    strokeLineWidth = 2.5f,
    strokeLineCap = StrokeCap.Round,
    strokeLineJoin = StrokeJoin.Round
) {
    moveTo(19f, 16f)
    arcTo(7f, 7f, 0f, false, false, 5f, 16f)
    close()
}.path(
    fill = null,
    stroke = SolidColor(Color(0xFF000000)),
    strokeLineWidth = 2.5f,
    strokeLineCap = StrokeCap.Round
) {
    moveTo(12f, 5f)
    lineTo(12f, 9f)
    moveTo(10f, 5f)
    lineTo(14f, 5f)
}.build()


@Composable
fun WaiterSelectionDialog(
    onDismissRequest: () -> Unit,
    staffList: List<com.example.sasloopmanager.data.StaffUser>,
    selectedWaiter: String?,
    onSelectWaiter: (String?) -> Unit
) {
    val CardDark = MaterialTheme.colorScheme.surface
    val CardBorderDark = MaterialTheme.colorScheme.outline
    val TextPrimary = MaterialTheme.colorScheme.onBackground
    val TextSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    val waiters = remember(staffList) {
        staffList.filter { s ->
            val des = (s.designationName ?: "").lowercase(java.util.Locale.US)
            val role = (s.role ?: "").lowercase(java.util.Locale.US)
            des.contains("waiter") || role.contains("waiter")
        }
    }

    Dialog(onDismissRequest = onDismissRequest) {
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = CardDark),
            border = BorderStroke(1.dp, CardBorderDark),
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
                .heightIn(max = 400.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = ClocheIcon,
                        contentDescription = null,
                        tint = SaSGreen,
                        modifier = Modifier.size(18.dp)
                    )
                    Text(
                        text = "SELECT WAITER / STAFF",
                        fontWeight = FontWeight.Black,
                        fontSize = 12.sp,
                        color = TextPrimary,
                        modifier = Modifier.weight(1f)
                    )
                    IconButton(onClick = onDismissRequest, modifier = Modifier.size(24.dp)) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Close",
                            tint = TextSecondary,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }

                HorizontalDivider(color = CardBorderDark.copy(alpha = 0.5f))

                if (waiters.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .weight(1f),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "No staff members with waiter designation found.",
                            color = TextSecondary,
                            fontSize = 11.sp,
                            textAlign = TextAlign.Center
                        )
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier.weight(1f),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        item {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(if (selectedWaiter == null) SaSGreen.copy(alpha = 0.1f) else Color.Transparent)
                                    .border(
                                        width = 1.dp,
                                        color = if (selectedWaiter == null) SaSGreen else CardBorderDark.copy(alpha = 0.3f),
                                        shape = RoundedCornerShape(12.dp)
                                    )
                                    .clickable {
                                        onSelectWaiter(null)
                                        onDismissRequest()
                                    }
                                    .padding(10.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                RadioButton(
                                    selected = selectedWaiter == null,
                                    onClick = {
                                        onSelectWaiter(null)
                                        onDismissRequest()
                                    },
                                    colors = RadioButtonDefaults.colors(selectedColor = SaSGreen)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Default / None",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimary
                                )
                            }
                        }

                        items(waiters) { waiter ->
                            val isSelected = selectedWaiter == waiter.name
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(if (isSelected) SaSGreen.copy(alpha = 0.1f) else Color.Transparent)
                                    .border(
                                        width = 1.dp,
                                        color = if (isSelected) SaSGreen else CardBorderDark.copy(alpha = 0.3f),
                                        shape = RoundedCornerShape(12.dp)
                                    )
                                    .clickable {
                                        onSelectWaiter(waiter.name)
                                        onDismissRequest()
                                    }
                                    .padding(10.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                RadioButton(
                                    selected = isSelected,
                                    onClick = {
                                        onSelectWaiter(waiter.name)
                                        onDismissRequest()
                                    },
                                    colors = RadioButtonDefaults.colors(selectedColor = SaSGreen)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Column {
                                    Text(
                                        text = waiter.name ?: "Unknown",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = TextPrimary
                                    )
                                    Text(
                                        text = waiter.designationName ?: "Waiter",
                                        fontSize = 9.sp,
                                        color = TextSecondary,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun PayDueDialog(
    customer: com.example.sasloopmanager.data.SearchedCustomer,
    onDismiss: () -> Unit,
    billingViewModel: BillingViewModel,
    posSettings: com.example.sasloopmanager.data.PosSettings,
    context: Context
) {
    val CardDark = MaterialTheme.colorScheme.surface
    val CardBorderDark = MaterialTheme.colorScheme.outline
    val InputDark = MaterialTheme.colorScheme.surfaceVariant
    val TextPrimary = MaterialTheme.colorScheme.onBackground
    val TextSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    var amountInput by remember { mutableStateOf(String.format(java.util.Locale.US, "%.2f", Math.abs(customer.balance ?: 0.0))) }
    var selectedMethod by remember { mutableStateOf("CASH") }
    var notesInput by remember { mutableStateOf("") }
    val isLoading by billingViewModel.isLoading.collectAsStateWithLifecycle()

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = CardDark),
            border = BorderStroke(1.dp, CardBorderDark),
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text(
                    text = "Pay Outstanding Due",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
                Text(
                    text = "${customer.name ?: "Customer"} (${customer.number})",
                    color = TextSecondary,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium
                )

                val originalDue = Math.abs(customer.balance ?: 0.0)
                Text(
                    text = "Current Due: ${posSettings.currency}${String.format(java.util.Locale.US, "%.2f", originalDue)}",
                    color = StatusDanger,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp
                )

                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Text("Amount to Pay", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    BasicTextField(
                        value = amountInput,
                        onValueChange = { amountInput = it },
                        textStyle = TextStyle(color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold),
                        singleLine = true,
                        cursorBrush = SolidColor(SaSGreen),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(38.dp)
                            .background(InputDark, RoundedCornerShape(8.dp))
                            .border(1.dp, CardBorderDark, RoundedCornerShape(8.dp))
                            .padding(horizontal = 12.dp, vertical = 8.dp)
                    )
                }

                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Text("Payment Method", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        listOf("CASH", "UPI", "CARD").forEach { method ->
                            val isSelected = selectedMethod == method
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (isSelected) SaSGreen else InputDark)
                                    .border(1.dp, if (isSelected) SaSGreen else CardBorderDark, RoundedCornerShape(8.dp))
                                    .clickable { selectedMethod = method }
                                    .padding(vertical = 8.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(method, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                            }
                        }
                    }
                }

                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Text("Comments / Reason", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    BasicTextField(
                        value = notesInput,
                        onValueChange = { notesInput = it },
                        textStyle = TextStyle(color = TextPrimary, fontSize = 11.sp, fontWeight = FontWeight.Normal),
                        singleLine = true,
                        cursorBrush = SolidColor(SaSGreen),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(38.dp)
                            .background(InputDark, RoundedCornerShape(8.dp))
                            .border(1.dp, CardBorderDark, RoundedCornerShape(8.dp))
                            .padding(horizontal = 12.dp, vertical = 8.dp)
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = onDismiss,
                        colors = ButtonDefaults.buttonColors(containerColor = InputDark),
                        modifier = Modifier.weight(1f),
                        enabled = !isLoading
                    ) {
                        Text("Cancel", color = TextPrimary)
                    }
                    Button(
                        onClick = {
                            val amt = amountInput.toDoubleOrNull()
                            if (amt == null || amt <= 0.0) {
                                Toast.makeText(context, "Please enter a valid amount", Toast.LENGTH_SHORT).show()
                                return@Button
                            }
                            billingViewModel.payCustomerDue(
                                phone = customer.number ?: "",
                                amount = amt,
                                paymentMethod = selectedMethod,
                                reason = notesInput.takeIf { it.isNotBlank() }
                            ) { success, msg ->
                                Toast.makeText(context, msg, Toast.LENGTH_SHORT).show()
                                if (success) {
                                    onDismiss()
                                }
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = SaSGreen),
                        modifier = Modifier.weight(1f),
                        enabled = !isLoading
                    ) {
                        Text("Pay", color = Color.White)
                    }
                }
            }
        }
    }
}
