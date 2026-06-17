package com.example.sasloopmanager.data

import com.google.gson.annotations.SerializedName
import com.example.sasloopmanager.AppTab

// ─── Auth ───────────────────────────────────────────────────────────────────
data class LoginRequest(val username: String, val password: String)
data class LoginResponse(val token: String, val message: String?)

data class RestaurantSettings(
    @SerializedName("print_upi_qr") val printUpiQr: Boolean? = false
)

data class BusinessDetails(
    val id: Int,
    val settings: RestaurantSettings? = null
)
data class UserProfile(
    val id: Int,
    val username: String?,
    val name: String?,
    @SerializedName("business_name") val businessName: String?,
    val email: String?,
    val phone: String?,
    val role: String?,
    @SerializedName("business_details") val businessDetails: BusinessDetails? = null,
    @SerializedName("staff_permissions") val staffPermissions: Map<String, Any>? = null
) {
    fun isSupervisor(): Boolean {
        val userRole = role?.lowercase() ?: ""
        return userRole == "brand_owner" || userRole == "master_admin" || userRole.contains("admin") || userRole.contains("manager")
    }

    fun isStoreModuleAllowed(moduleName: String): Boolean {
        if (isSupervisor()) return true
        val storeModules = staffPermissions?.get("store_modules") as? Map<String, Any> ?: return true
        
        var key = moduleName
        if (key == "Online Order") key = "Digital Order"
        if (key == "Supply Chain") key = "Inventory Management"
        if (key == "Whatsapp Marketing") key = "WhatsApp Marketing"
        
        val module = storeModules[key] as? Map<String, Any>
        if (module != null && module["visible"] == false) {
            return false
        }
        return true
    }

    fun isMposAllowed(section: String, subKey: String? = null): Boolean {
        if (isSupervisor()) return true
        val mposAccess = staffPermissions?.get("mpos_access") as? Map<String, Any> ?: return true
        val sectionPermissions = mposAccess[section] as? Map<String, Any> ?: return true

        if (subKey == null) {
            return sectionPermissions["visible"] != false
        }
        return sectionPermissions[subKey] != false
    }

    fun isTabAllowed(tab: AppTab): Boolean {
        return when (tab) {
            AppTab.DASHBOARD -> isStoreModuleAllowed("Revenue Dashboard")
            AppTab.ORDERS -> isMposAllowed("Receipts", "visible")
            AppTab.BILLING -> isMposAllowed("Dine In") || isMposAllowed("Quick Bill") || isMposAllowed("Pickup") || isMposAllowed("Delivery")
            AppTab.REPORTS -> isStoreModuleAllowed("Reports") && isMposAllowed("Reports", "visible")
            AppTab.SETTINGS -> isMposAllowed("Settings", "visible")
        }
    }
}

data class SourceSales(
    val source: String,
    val total: Double,
    val count: Int
)

data class DashboardStats(
    @SerializedName("today_revenue") val todayRevenue: Double?,
    @SerializedName("today_orders") val todayOrders: Int?,
    @SerializedName("active_tables") val activeTables: Int?,
    @SerializedName("pending_orders") val pendingOrders: Int?,
    @SerializedName("total_revenue") val totalRevenue: Double?,
    @SerializedName("week_revenue") val weekRevenue: Double?,
    @SerializedName("month_revenue") val monthRevenue: Double?,
    @SerializedName("salesBySource") val salesBySource: List<SourceSales>? = null
)

// ─── Orders ──────────────────────────────────────────────────────────────────
data class Order(
    val id: Int,
    @SerializedName("bill_no") val billNo: String?,
    @SerializedName("customer_name") val customerName: String?,
    @SerializedName("customer_number") val customerNumber: String?,
    val address: String? = null,
    @SerializedName("order_type") val orderType: String?,
    @SerializedName("table_number") val tableNumber: String?,
    @SerializedName("table_name") val tableName: String?,
    @SerializedName("payment_method") val paymentMethod: String?,
    @SerializedName("total_price") val totalPrice: Double?,
    @SerializedName("subtotal") val subtotal: Double?,
    val status: String?,
    @SerializedName("created_at") val createdAt: String?,
    val items: Any? // Can be String or List
)

data class OrdersResponse(
    val orders: List<Order>?,
    val total: Int?
)

data class UpdateStatusRequest(
    val status: String,
    @SerializedName("rejection_reason") val rejectionReason: String? = null,
    val source: String? = "POS_ANDROID"
)

data class ApiResponse(val success: Boolean, val message: String?)

// ─── Billing POS Models ──────────────────────────────────────────────────────
data class SelectedModifier(
    val name: String,
    val price: Double,
    @SerializedName("groupId") val groupId: Int
)

data class OptionItem(
    val id: Int,
    val name: String,
    @SerializedName("price_override") val priceOverride: String?
) {
    val price: Double get() = priceOverride?.toDoubleOrNull() ?: 0.0
}

data class OptionGroup(
    val id: Int,
    val name: String,
    @SerializedName("min_selectable") val minSelectable: Int,
    @SerializedName("max_selectable") val maxSelectable: Int,
    @SerializedName("item_id") val itemId: Int?,
    @SerializedName("outlet_menu_item_id") val outletMenuItemId: Int?,
    val options: List<OptionItem>?
)

data class MenuItem(
    val id: Int,
    val code: String?,
    @SerializedName("product_name") val productName: String? = null,
    val name: String? = null,
    @SerializedName("item_name") val itemName: String? = null,
    val price: Double,
    val availability: Boolean?,
    @SerializedName("image_url") val imageUrl: String?,
    val description: String?,
    @SerializedName("kot_category") val kotCategory: String?,
    val category: String?,
    @SerializedName("sub_category") val subCategory: String?,
    val selectedModifiers: List<SelectedModifier>? = emptyList(),
    val kitchenNote: String? = "",
    @SerializedName("prep_time") val prepTime: Int? = null,
    @SerializedName("preparation_time") val preparationTime: Int? = null,
    @SerializedName("sale_price_2") val salePrice2: Double? = null,
    @SerializedName("sale_price_3") val salePrice3: Double? = null,
    @SerializedName("multiple_pricing") val multiplePricing: Map<String, Double>? = null,
    val priceLabel: String? = null
) {
    val displayName: String get() = (productName ?: itemName ?: name ?: "").ifBlank { "Item #$id" }
}

data class CategoryItem(
    val id: Int,
    val name: String,
    @SerializedName("sorting_order") val sortingOrder: Int?
)

data class OrderItemInput(
    val id: Int,
    val name: String,
    val price: Double,
    val qty: Int,
    val modifiers: List<SelectedModifier>? = null
)

data class CreateOrderRequest(
    @SerializedName("customer_name") val customerName: String,
    @SerializedName("customer_number") val customerNumber: String,
    @SerializedName("payment_method") val paymentMethod: String,
    val status: String,
    @SerializedName("order_type") val orderType: String,
    @SerializedName("table_number") val tableNumber: String,
    @SerializedName("total_price") val totalPrice: Double,
    val items: List<OrderItemInput>,
    val address: String? = null,
    val source: String = "POS_ANDROID",
    @SerializedName("discount_amount") val discountAmount: Double? = null,
    @SerializedName("service_charge") val serviceCharge: Double? = null,
    @SerializedName("delivery_charge") val deliveryCharge: Double? = null,
    @SerializedName("tax_cgst") val taxCgst: Double? = null,
    @SerializedName("tax_sgst") val taxSgst: Double? = null,
    @SerializedName("tip_amount") val tipAmount: Double? = null,
    @SerializedName("paid_amount") val paidAmount: Double? = null,
    @SerializedName("credit_amount") val creditAmount: Double? = null,
    @SerializedName("pre_order_id") val preOrderId: String? = null,
    @SerializedName("pre_order_advance") val preOrderAdvance: Double? = null,
    @SerializedName("pre_order_balance") val preOrderBalance: Double? = null,
    @SerializedName("reference_no") val referenceNo: String? = null,
    @SerializedName("waiter_name") val waiterName: String? = null
)

data class TableItem(
    val id: Int,
    @SerializedName("table_name") val tableName: String,
    @SerializedName("department_id") val departmentId: Int?,
    @SerializedName("department_name") val departmentName: String?
)

data class ActiveStateResponse(
    @SerializedName("tableStatuses") val tableStatuses: Map<String, String>? = null,
    @SerializedName("tableBills") val tableBills: Map<String, Any>? = null,
    @SerializedName("tableActiveTimestamps") val tableActiveTimestamps: Map<String, Long>? = null,
    @SerializedName("tableBillNumbers") val tableBillNumbers: Map<String, Any>? = null,
    @SerializedName("tables") val tables: List<Any>? = null
)

data class SaveActiveStateRequest(
    @SerializedName("activeState") val activeState: ActiveStateResponse
)

data class CustomerOrderHistoryItem(
    val id: Int,
    @SerializedName("bill_no") val billNo: String?,
    @SerializedName("order_reference") val orderReference: String?,
    @SerializedName("total_price") val totalPrice: Double?,
    @SerializedName("payment_method") val paymentMethod: String?,
    @SerializedName("payment_status") val paymentStatus: String?,
    val status: String?,
    val items: Any?,
    @SerializedName("created_at") val createdAt: String?
)

data class CustomerTransactionHistoryItem(
    val id: Int,
    val type: String?,
    val amount: Double?,
    val points: Int?,
    val reason: String?,
    @SerializedName("created_at") val createdAt: String?
)

data class CustomerHistoryResponse(
    val orders: List<CustomerOrderHistoryItem>?,
    val transactions: List<CustomerTransactionHistoryItem>?
)

data class StaffUser(
    val id: Int,
    val name: String?,
    val username: String?,
    val role: String?,
    @SerializedName("designation_name") val designationName: String?,
    val status: String?,
    val phone: String?
)

data class SearchedCustomer(
    val id: Int,
    val name: String?,
    val number: String?,
    val address: String?,
    val balance: Double? = 0.0,
    val points: Int? = 0
)

data class PayDueRequest(
    val phone: String,
    val amount: Double,
    val paymentMethod: String,
    val reason: String? = null
)

data class CustomerLoyaltyInfo(
    val id: Int? = null,
    val name: String? = null,
    @SerializedName("customer_number") val customerNumber: String? = null,
    val points: Int? = null,
    val balance: Double? = null,
    @SerializedName("total_spent") val totalSpent: Double? = null,
    @SerializedName("last_visit") val lastVisit: String? = null
)

data class PayDueResponse(
    val success: Boolean,
    val loyalty: CustomerLoyaltyInfo? = null,
    val message: String? = null
)

data class SaveCustomerRequest(
    val name: String,
    val number: String,
    val address: String? = null,
    val points: Int? = 0,
    val balance: Double? = 0.0
)

data class SaveCustomerResponse(
    val success: Boolean,
    val customer: SearchedCustomer?,
    val message: String? = null
)

data class QrCodeItem(
    val id: Int,
    val name: String,
    val brand: String,
    @SerializedName("upi_id") val upiId: String,
    @SerializedName("qr_type") val qrType: String,
    @SerializedName("is_active") val isActive: Boolean
)
