package com.example.sasloopmanager

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.sasloopmanager.theme.*

// ── Tab Definitions ──────────────────────────────────────────────────────────
enum class AppTab(val label: String, val icon: ImageVector) {
    DASHBOARD("Dashboard", Icons.Default.Home),
    ORDERS("Orders", Icons.Default.ReceiptLong),
    BILLING("Billing", Icons.Default.ShoppingCart),
    REPORTS("Reports", Icons.Default.BarChart),
    SETTINGS("Settings", Icons.Default.Settings)
}

@Composable
fun MainNavigation(
    isDarkTheme: Boolean,
    onThemeToggle: () -> Unit,
    authViewModel: AuthViewModel = viewModel()
) {
    val authState by authViewModel.authState.collectAsStateWithLifecycle()

    when (val state = authState) {
        is AuthState.Loading -> {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(MaterialTheme.colorScheme.background),
                contentAlignment = androidx.compose.ui.Alignment.Center
            ) {
                CircularProgressIndicator(color = SaSGreen)
            }
        }
        is AuthState.Unauthenticated -> {
            LoginScreen(
                isDarkTheme = isDarkTheme,
                onThemeToggle = onThemeToggle,
                authViewModel = authViewModel
            )
        }
        is AuthState.Authenticated -> {
            MainApp(
                user = state.user,
                isDarkTheme = isDarkTheme,
                onThemeToggle = onThemeToggle,
                onLogout = { authViewModel.logout() }
            )
        }
    }
}

@Composable
private fun MainApp(
    user: com.example.sasloopmanager.data.UserProfile?,
    isDarkTheme: Boolean,
    onThemeToggle: () -> Unit,
    onLogout: () -> Unit
) {
    val billingViewModel: BillingViewModel = viewModel()
    val posSettings by billingViewModel.posSettings.collectAsStateWithLifecycle()

    LaunchedEffect(user) {
        if (user != null) {
            val currentSettings = billingViewModel.posSettings.value
            var updated = false
            val newSettings = currentSettings.copy()
            val expectedBusinessName = user.businessName ?: ""
            if (newSettings.businessName != expectedBusinessName) {
                newSettings.businessName = expectedBusinessName
                updated = true
            }
            if (newSettings.receiptHeader.isBlank() || newSettings.receiptHeader == "SHAHE TEHZEEB RESTAURANT") {
                if (expectedBusinessName.isNotBlank()) {
                    newSettings.receiptHeader = expectedBusinessName
                    updated = true
                }
            }
            val expectedPhone = user.phone ?: ""
            if (expectedPhone.isNotBlank() && (newSettings.phone.isBlank() || newSettings.phone == "9906495133/7006089744" || newSettings.phone == "9906123989" || newSettings.phone == "+917006089744" || newSettings.phone == "7006089744")) {
                newSettings.phone = expectedPhone
                updated = true
            }
            if (updated) {
                billingViewModel.updateSettings(newSettings)
            }
        }
    }

    val defaultTabMapped = remember(posSettings) {
        when (posSettings.defaultTab) {
            "Dine In", "Quick Bill", "PickUp", "Delivery", "Pre Order" -> AppTab.BILLING
            else -> AppTab.DASHBOARD
        }
    }
    var selectedTab by remember(defaultTabMapped) { mutableStateOf(defaultTabMapped) }

    LaunchedEffect(selectedTab, user) {
        user?.let {
            if (!it.isTabAllowed(selectedTab)) {
                val allowedTab = AppTab.entries.firstOrNull { tab -> it.isTabAllowed(tab) }
                if (allowedTab != null) {
                    selectedTab = allowedTab
                }
            }
        }
    }

    val dashboardViewModel: DashboardViewModel = viewModel()
    val ordersViewModel: OrdersViewModel = viewModel()

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 0.dp
            ) {
                AppTab.entries.filter { user == null || user.isTabAllowed(it) }.forEach { tab ->
                    NavigationBarItem(
                        selected = selectedTab == tab,
                        onClick = { selectedTab = tab },
                        icon = {
                            Icon(
                                tab.icon,
                                contentDescription = tab.label,
                                modifier = Modifier.size(22.dp)
                            )
                        },
                        label = {
                            Text(
                                tab.label,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = SaSGreen,
                            selectedTextColor = SaSGreen,
                            unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                            unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant,
                            indicatorColor = SaSGreen.copy(alpha = 0.15f)
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding)) {
            when (selectedTab) {
                AppTab.DASHBOARD -> DashboardScreen(
                    user = user,
                    dashboardViewModel = dashboardViewModel,
                    onLogout = onLogout,
                    currency = posSettings.currency
                )
                AppTab.ORDERS -> OrdersScreen(
                    ordersViewModel = ordersViewModel,
                    currency = posSettings.currency,
                    showDirectCompleteButton = posSettings.showDirectCompleteButton,
                    onOrderAccepted = { billingViewModel.onOrderAccepted(it) },
                    onEditOrder = { order ->
                        billingViewModel.selectOrderForEditing(order)
                        selectedTab = AppTab.BILLING
                    }
                )
                AppTab.BILLING -> BillingScreen(billingViewModel = billingViewModel, user = user)
                AppTab.REPORTS -> ReportsScreen()
                AppTab.SETTINGS -> SettingsScreen(
                    user = user,
                    isDarkTheme = isDarkTheme,
                    onThemeToggle = onThemeToggle,
                    onLogout = onLogout,
                    billingViewModel = billingViewModel
                )
            }
        }
    }
}

// ── Reports Screen (placeholder) ──────────────────────────────────────────────
@Composable
fun ReportsScreen() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentAlignment = androidx.compose.ui.Alignment.Center
    ) {
        Column(horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally) {
            Icon(
                Icons.Default.BarChart,
                null,
                tint = SaSGreen,
                modifier = Modifier.size(64.dp)
            )
            Spacer(Modifier.height(16.dp))
            Text(
                "Sales Reports",
                color = MaterialTheme.colorScheme.onBackground,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                "Coming soon",
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontSize = 14.sp
            )
        }
    }
}

// ── Settings Screen ───────────────────────────────────────────────────────────
@Composable
fun SettingsScreen(
    user: com.example.sasloopmanager.data.UserProfile?,
    isDarkTheme: Boolean,
    onThemeToggle: () -> Unit,
    onLogout: () -> Unit,
    billingViewModel: BillingViewModel
) {
    val posSettings by billingViewModel.posSettings.collectAsStateWithLifecycle()
    val outletQrs by billingViewModel.outletQrs.collectAsStateWithLifecycle()

    LaunchedEffect(Unit) {
        billingViewModel.fetchOutletQrs()
    }

    var businessName by remember(posSettings) { mutableStateOf(posSettings.businessName) }
    var address by remember(posSettings) { mutableStateOf(posSettings.address) }
    var phone by remember(posSettings) { mutableStateOf(posSettings.phone) }
    var gstin by remember(posSettings) { mutableStateOf(posSettings.gstin) }
    
    var receiptHeader by remember(posSettings) { mutableStateOf(posSettings.receiptHeader) }
    var receiptFooter by remember(posSettings) { mutableStateOf(posSettings.receiptFooter) }
    var greetingMessage by remember(posSettings) { mutableStateOf(posSettings.greetingMessage) }
    var showLogoOnReceipt by remember(posSettings) { mutableStateOf(posSettings.showLogoOnReceipt) }

    var taxName by remember(posSettings) { mutableStateOf(posSettings.taxName) }
    var taxRateInput by remember(posSettings) { mutableStateOf(posSettings.taxRate.toString()) }
    var isTaxInclusive by remember(posSettings) { mutableStateOf(posSettings.isTaxInclusive) }
    var enableServiceCharge by remember(posSettings) { mutableStateOf(posSettings.enableServiceCharge) }
    var serviceChargeRateInput by remember(posSettings) { mutableStateOf(posSettings.serviceChargeRate.toString()) }
    var autoRoundOff by remember(posSettings) { mutableStateOf(posSettings.autoRoundOff) }

    var upiId by remember(posSettings) { mutableStateOf(posSettings.upiId) }
    var printUpiQr by remember(posSettings) { mutableStateOf(posSettings.printUpiQr) }
    var printReviewQr by remember(posSettings) { mutableStateOf(posSettings.printReviewQr) }
    var googleReviewUrl by remember(posSettings) { mutableStateOf(posSettings.googleReviewUrl) }
    var upiPaymentMethod by remember(posSettings) { mutableStateOf(posSettings.upiPaymentMethod) }

    var qrMode by remember(posSettings) { mutableStateOf(posSettings.qrMode) }

    var printerType by remember(posSettings) { mutableStateOf(posSettings.printerType) }
    var printerConnection by remember(posSettings) { mutableStateOf(posSettings.printerConnection) }
    var printerIp by remember(posSettings) { mutableStateOf(posSettings.printerIp) }
    var printerName by remember(posSettings) { mutableStateOf(posSettings.printerName) }
    var autoPrintKOT by remember(posSettings) { mutableStateOf(posSettings.autoPrintKOT) }
    
    var currency by remember(posSettings) { mutableStateOf(posSettings.currency) }
    var decimalPlacesInput by remember(posSettings) { mutableStateOf(posSettings.decimalPlaces.toString()) }

    var showBillDetailsOnTable by remember(posSettings) { mutableStateOf(posSettings.showBillDetailsOnTable) }
    var showOrderStatusOnTable by remember(posSettings) { mutableStateOf(posSettings.showOrderStatusOnTable) }
    var showTableDepartments by remember(posSettings) { mutableStateOf(posSettings.showTableDepartments) }
    var showCompactItemView by remember(posSettings) { mutableStateOf(posSettings.showCompactItemView) }
    var showItemsCodeDetails by remember(posSettings) { mutableStateOf(posSettings.showItemsCodeDetails) }
    var sortItemsBy by remember(posSettings) { mutableStateOf(posSettings.sortItemsBy) }
    var defaultTab by remember(posSettings) { mutableStateOf(posSettings.defaultTab) }
    var disableSaveKOT by remember(posSettings) { mutableStateOf(posSettings.disableSaveKOT) }
    var disableSaveBill by remember(posSettings) { mutableStateOf(posSettings.disableSaveBill) }
    var showItemImage by remember(posSettings) { mutableStateOf(posSettings.showItemImage) }
    var showItemsPrepTime by remember(posSettings) { mutableStateOf(posSettings.showItemsPrepTime) }
    var tableNameAsCustomerName by remember(posSettings) { mutableStateOf(posSettings.tableNameAsCustomerName) }
    var showKOTNoOnTable by remember(posSettings) { mutableStateOf(posSettings.showKOTNoOnTable) }
    var displayTimeOnTable by remember(posSettings) { mutableStateOf(posSettings.displayTimeOnTable) }
    var separateView by remember(posSettings) { mutableStateOf(true) }
    var showItemsDetails by remember(posSettings) { mutableStateOf(posSettings.showItemsDetails) }
    var showPreOrderDateFilter by remember(posSettings) { mutableStateOf(posSettings.showPreOrderDateFilter) }
    var showVirtualKeyboard by remember(posSettings) { mutableStateOf(false) }
    var quickBillDefaultKOTPrint by remember(posSettings) { mutableStateOf(posSettings.quickBillDefaultKOTPrint) }
    var disableTabDineIn by remember(posSettings) { mutableStateOf(posSettings.disableTabDineIn) }
    var disableTabPickup by remember(posSettings) { mutableStateOf(posSettings.disableTabPickup) }
    var disableTabQuickBill by remember(posSettings) { mutableStateOf(posSettings.disableTabQuickBill) }
    var disableTabPreOrder by remember(posSettings) { mutableStateOf(posSettings.disableTabPreOrder) }
    var hideTaxOnBill by remember(posSettings) { mutableStateOf(posSettings.hideTaxOnBill) }
    var countAdvanceInSales by remember(posSettings) { mutableStateOf(posSettings.countAdvanceInSales) }
    var quickBillDefaultBillPrint by remember(posSettings) { mutableStateOf(posSettings.quickBillDefaultBillPrint) }
    var printKOTOnAccept by remember(posSettings) { mutableStateOf(posSettings.printKOTOnAccept) }
    var printBillOnAccept by remember(posSettings) { mutableStateOf(posSettings.printBillOnAccept) }
    var showDirectCompleteButton by remember(posSettings) { mutableStateOf(posSettings.showDirectCompleteButton) }
    var successNotificationSound by remember(posSettings) { mutableStateOf(posSettings.successNotificationSound) }
    var cancelNotificationSound by remember(posSettings) { mutableStateOf(posSettings.cancelNotificationSound) }

    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(horizontal = 20.dp)
    ) {
        Spacer(Modifier.height(20.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                "Settings",
                color = MaterialTheme.colorScheme.onBackground,
                fontSize = 24.sp,
                fontWeight = FontWeight.Black
            )
            val context = androidx.compose.ui.platform.LocalContext.current
            Button(
                onClick = {
                    val updated = com.example.sasloopmanager.data.PosSettings(
                        businessName = businessName,
                        address = address,
                        phone = phone,
                        gstin = gstin,
                        receiptHeader = receiptHeader,
                        receiptFooter = receiptFooter,
                        greetingMessage = greetingMessage,
                        showLogoOnReceipt = showLogoOnReceipt,
                        taxName = taxName,
                        taxRate = taxRateInput.toDoubleOrNull() ?: 5.0,
                        isTaxInclusive = isTaxInclusive,
                        enableServiceCharge = enableServiceCharge,
                        serviceChargeRate = serviceChargeRateInput.toDoubleOrNull() ?: 5.0,
                        autoRoundOff = autoRoundOff,
                        upiId = upiId,
                        upiPaymentMethod = upiPaymentMethod,
                        printUpiQr = printUpiQr,
                        qrMode = qrMode,
                        printerType = printerType,
                        printerConnection = printerConnection,
                        printerIp = printerIp,
                        printerName = printerName,
                        autoPrintKOT = autoPrintKOT,
                        currency = currency,
                        decimalPlaces = decimalPlacesInput.toIntOrNull() ?: 2,
                        showBillDetailsOnTable = showBillDetailsOnTable,
                        showOrderStatusOnTable = showOrderStatusOnTable,
                        showTableDepartments = showTableDepartments,
                        showCompactItemView = showCompactItemView,
                        showItemsCodeDetails = showItemsCodeDetails,
                        sortItemsBy = sortItemsBy,
                        defaultTab = defaultTab,
                        disableSaveKOT = disableSaveKOT,
                        disableSaveBill = disableSaveBill,
                        showItemImage = showItemImage,
                        showItemsPrepTime = showItemsPrepTime,
                        tableNameAsCustomerName = tableNameAsCustomerName,
                        showKOTNoOnTable = showKOTNoOnTable,
                        displayTimeOnTable = displayTimeOnTable,
                        separateView = true,
                        showItemsDetails = showItemsDetails,
                        showPreOrderDateFilter = showPreOrderDateFilter,
                        showVirtualKeyboard = false,
                        quickBillDefaultKOTPrint = quickBillDefaultKOTPrint,
                        quickBillDefaultBillPrint = quickBillDefaultBillPrint,
                        printKOTOnAccept = printKOTOnAccept,
                        printBillOnAccept = printBillOnAccept,
                        showDirectCompleteButton = showDirectCompleteButton,
                        successNotificationSound = successNotificationSound,
                        cancelNotificationSound = cancelNotificationSound,
                        disableTabDineIn = disableTabDineIn,
                        disableTabPickup = disableTabPickup,
                        disableTabQuickBill = disableTabQuickBill,
                        disableTabPreOrder = disableTabPreOrder,
                        hideTaxOnBill = hideTaxOnBill,
                        countAdvanceInSales = countAdvanceInSales,
                        printReviewQr = printReviewQr,
                        googleReviewUrl = googleReviewUrl
                    )
                    billingViewModel.updateSettings(updated)
                    android.widget.Toast.makeText(context, "Settings Saved Successfully!", android.widget.Toast.LENGTH_SHORT).show()
                },
                modifier = Modifier.height(38.dp),
                contentPadding = PaddingValues(horizontal = 14.dp, vertical = 0.dp),
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(containerColor = SaSGreen)
            ) {
                Icon(Icons.Default.Save, null, tint = Color.White, modifier = Modifier.size(16.dp))
                Spacer(Modifier.width(6.dp))
                Text("Save", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
        }
        Spacer(Modifier.height(20.dp))

        Column(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .verticalScroll(scrollState)
        ) {
            // Profile Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
            ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        shape = RoundedCornerShape(22.dp),
                        color = SaSGreen,
                        modifier = Modifier.size(44.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(
                                (user?.name ?: user?.username ?: "U").take(1).uppercase(),
                                color = Color.White,
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Black
                            )
                        }
                    }
                    Spacer(Modifier.width(14.dp))
                    Column {
                        Text(
                            user?.name ?: user?.username ?: "User",
                            color = MaterialTheme.colorScheme.onSurface,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            user?.role ?: "POS Manager",
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontSize = 12.sp
                        )
                    }
                }
                Spacer(Modifier.height(16.dp))
                HorizontalDivider(color = MaterialTheme.colorScheme.outline)
                Spacer(Modifier.height(16.dp))
                Text(
                    "Business: ${user?.businessName ?: "SaSLoop"}",
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontSize = 13.sp
                )
                user?.phone?.let {
                    Text(
                        "Phone: $it",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontSize = 13.sp
                    )
                }
            }
        }

        Spacer(Modifier.height(12.dp))

        // 1. Outlet & Receipt
        SettingsSectionCard(title = "Outlet & Receipt", icon = Icons.Default.Business) {
            SettingsTextField("Business Display Name", businessName, { businessName = it }, enabled = false)
            SettingsTextField("Store Address", address, { address = it }, singleLine = false)
            SettingsTextField("Contact Number", phone, { phone = it }, keyboardType = KeyboardType.Phone)
            SettingsTextField("GSTIN / Tax ID", gstin, { gstin = it })
            SettingsTextField("Receipt Header Note", receiptHeader, { receiptHeader = it })
            SettingsTextField("Receipt Footer Note", receiptFooter, { receiptFooter = it }, singleLine = false)
            SettingsTextField("Greeting Message", greetingMessage, { greetingMessage = it })
            SettingsToggleRow(
                title = "Show Logo on Receipt",
                description = "Display logo on print receipt template",
                checked = showLogoOnReceipt,
                onCheckedChange = { showLogoOnReceipt = it }
            )
        }

        // 2. Taxes & Operational Charges
        SettingsSectionCard(title = "Taxes & Service Charges", icon = Icons.Default.Receipt) {
            SettingsTextField("Tax Name", taxName, { taxName = it })
            SettingsTextField("Tax Rate (%)", taxRateInput, { taxRateInput = it }, keyboardType = KeyboardType.Decimal)
            SettingsToggleRow(
                title = "Is Tax Inclusive",
                description = "Prices in the menu are inclusive of tax",
                checked = isTaxInclusive,
                onCheckedChange = { isTaxInclusive = it }
            )
            SettingsToggleRow(
                title = "Enable Service Charge",
                description = "Add automatic service charges to bills",
                checked = enableServiceCharge,
                onCheckedChange = { enableServiceCharge = it }
            )
            if (enableServiceCharge) {
                SettingsTextField("Service Charge Rate (%)", serviceChargeRateInput, { serviceChargeRateInput = it }, keyboardType = KeyboardType.Decimal)
            }
            SettingsToggleRow(
                title = "Auto Round-Off",
                description = "Round totals to nearest whole number",
                checked = autoRoundOff,
                onCheckedChange = { autoRoundOff = it }
            )
            SettingsToggleRow(
                title = "Hide Tax on Bill",
                description = "Do not display tax breakdown on printed bills",
                checked = hideTaxOnBill,
                onCheckedChange = { hideTaxOnBill = it }
            )
            SettingsToggleRow(
                title = "Count advance payment in today's sales",
                description = "Count pre-order advance payments in today's revenue calculations immediately upon booking",
                checked = countAdvanceInSales,
                onCheckedChange = { countAdvanceInSales = it }
            )
        }

        // 3. UPI QR Payments
        SettingsSectionCard(title = "Payment Integrations & QR", icon = Icons.Default.Payment) {
            Text(
                text = "RECEIPT QR CODE OPTION",
                fontSize = 9.sp,
                fontWeight = FontWeight.Black,
                color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f),
                modifier = Modifier.padding(bottom = 6.dp)
            )
            Row(
                modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                val isNone = !printUpiQr && !printReviewQr
                val isPayment = printUpiQr
                val isReview = printReviewQr

                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (isNone) SaSGreen else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.2f))
                        .border(
                            width = 1.dp,
                            color = if (isNone) SaSGreen else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f),
                            shape = RoundedCornerShape(12.dp)
                        )
                        .clickable {
                            printUpiQr = false
                            printReviewQr = false
                        }
                        .padding(vertical = 10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "NONE",
                        color = if (isNone) Color.White else MaterialTheme.colorScheme.onSurface,
                        fontWeight = FontWeight.Black,
                        fontSize = 9.sp
                    )
                }

                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (isPayment) SaSGreen else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.2f))
                        .border(
                            width = 1.dp,
                            color = if (isPayment) SaSGreen else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f),
                            shape = RoundedCornerShape(12.dp)
                        )
                        .clickable {
                            printUpiQr = true
                            printReviewQr = false
                        }
                        .padding(vertical = 10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "PAYMENT QR",
                        color = if (isPayment) Color.White else MaterialTheme.colorScheme.onSurface,
                        fontWeight = FontWeight.Black,
                        fontSize = 9.sp
                    )
                }

                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (isReview) SaSGreen else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.2f))
                        .border(
                            width = 1.dp,
                            color = if (isReview) SaSGreen else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f),
                            shape = RoundedCornerShape(12.dp)
                        )
                        .clickable {
                            printUpiQr = false
                            printReviewQr = true
                        }
                        .padding(vertical = 10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "GOOGLE REVIEW QR",
                        color = if (isReview) Color.White else MaterialTheme.colorScheme.onSurface,
                        fontWeight = FontWeight.Black,
                        fontSize = 9.sp
                    )
                }
            }

            if (printUpiQr) {
                if (outletQrs.isEmpty()) {
                    Text(
                        text = "No active QR codes configured in Back Office.",
                        color = MaterialTheme.colorScheme.error,
                        fontSize = 12.sp,
                        modifier = Modifier.padding(vertical = 8.dp)
                    )
                } else {
                    val qrNames = outletQrs.map { it.name }
                    val activeQrName = outletQrs.find { it.upiId == upiId }?.name ?: outletQrs.firstOrNull()?.name ?: ""

                    LaunchedEffect(outletQrs) {
                        val currentActive = outletQrs.find { it.upiId == upiId }
                        if (currentActive == null && outletQrs.isNotEmpty()) {
                            val firstQr = outletQrs.first()
                            upiId = firstQr.upiId
                        }
                    }

                    Text(
                        text = "SELECT ACTIVE QR CODE",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Black,
                        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f),
                        modifier = Modifier.padding(bottom = 6.dp, top = 6.dp)
                    )
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        outletQrs.forEach { entry ->
                            val isActive = entry.upiId == upiId
                            val entryIsUrl = entry.upiId.startsWith("http://", ignoreCase = true) || 
                                             entry.upiId.startsWith("https://", ignoreCase = true) || 
                                             entry.upiId.startsWith("upi://", ignoreCase = true)
                            val brandInitial = when (entry.brand.lowercase(java.util.Locale.US)) {
                                "paytm" -> "P"
                                "phonepe" -> "P"
                                "gpay" -> "G"
                                "bhim" -> "B"
                                "amazonpay" -> "A"
                                else -> "U"
                            }
                            val brandColor = when (entry.brand.lowercase(java.util.Locale.US)) {
                                "paytm" -> Color(0xFF00BAF2)
                                "phonepe" -> Color(0xFF5F259F)
                                "gpay" -> Color(0xFF4285F4)
                                "bhim" -> Color(0xFF00838F)
                                "amazonpay" -> Color(0xFFFF9900)
                                else -> Color(0xFF6B7280)
                            }
                            
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(if (isActive) SaSGreen.copy(alpha = 0.1f) else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.1f))
                                    .border(
                                        width = 1.dp,
                                        color = if (isActive) SaSGreen else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f),
                                        shape = RoundedCornerShape(12.dp)
                                    )
                                    .clickable { upiId = entry.upiId }
                                    .padding(10.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                RadioButton(
                                    selected = isActive,
                                    onClick = { upiId = entry.upiId },
                                    colors = RadioButtonDefaults.colors(selectedColor = SaSGreen)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Box(
                                    modifier = Modifier
                                        .size(24.dp)
                                        .clip(RoundedCornerShape(6.dp))
                                        .background(brandColor),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = brandInitial,
                                        color = Color.White,
                                        fontSize = 8.sp,
                                        fontWeight = FontWeight.Black
                                    )
                                }
                                Spacer(modifier = Modifier.width(10.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = entry.name,
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Black,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                    Text(
                                        text = entry.upiId,
                                        fontSize = 9.sp,
                                        fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f)
                                    )
                                }
                                Spacer(modifier = Modifier.width(6.dp))
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(4.dp))
                                        .background(MaterialTheme.colorScheme.onSurface.copy(alpha = 0.05f))
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text(
                                        text = if (entryIsUrl) "URL" else "VPA",
                                        fontSize = 8.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }
                    }

                    val isSelectedUrl = upiId.startsWith("http://", ignoreCase = true) || 
                                        upiId.startsWith("https://", ignoreCase = true) || 
                                        upiId.startsWith("upi://", ignoreCase = true)

                    Spacer(modifier = Modifier.height(10.dp))

                    if (!isSelectedUrl) {
                        Text(
                            text = "QR PRINT SETTINGS",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Black,
                            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f),
                            modifier = Modifier.padding(bottom = 6.dp)
                        )
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            val isDynamic = qrMode == "dynamic"
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(if (isDynamic) SaSGreen else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.2f))
                                    .border(
                                        width = 1.dp,
                                        color = if (isDynamic) SaSGreen else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f),
                                        shape = RoundedCornerShape(12.dp)
                                    )
                                    .clickable { qrMode = "dynamic" }
                                    .padding(vertical = 10.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "⚡ DYNAMIC QR (BILL AMOUNT)",
                                    color = if (isDynamic) Color.White else MaterialTheme.colorScheme.onSurface,
                                    fontWeight = FontWeight.Black,
                                    fontSize = 9.sp
                                )
                            }
                            val isStatic = qrMode != "dynamic"
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(if (isStatic) SaSGreen else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.2f))
                                    .border(
                                        width = 1.dp,
                                        color = if (isStatic) SaSGreen else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f),
                                        shape = RoundedCornerShape(12.dp)
                                    )
                                    .clickable { qrMode = "static" }
                                    .padding(vertical = 10.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "📌 STATIC QR (FIXED VPA)",
                                    color = if (isStatic) Color.White else MaterialTheme.colorScheme.onSurface,
                                    fontWeight = FontWeight.Black,
                                    fontSize = 9.sp
                                )
                            }
                        }
                    } else {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.1f))
                                .padding(10.dp)
                        ) {
                            Text(
                                text = "📌 Selected QR code will print the exact payment URL. No billing amount modifier will be applied.",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                    }

                    val currentQr = outletQrs.find { it.upiId == upiId }
                    if (currentQr != null) {
                        val displayType = if (isSelectedUrl) "URL" else qrMode.uppercase(java.util.Locale.US)
                        Text(
                            text = "Details: ${currentQr.brand.uppercase(java.util.Locale.US)} ($displayType) - ${currentQr.upiId}",
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f),
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Column(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
                        Text(
                            text = "INTEGRATION MODE",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Black,
                            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f),
                            modifier = Modifier.padding(bottom = 4.dp)
                        )
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.1f))
                                .border(
                                    width = 1.dp,
                                    color = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f),
                                    shape = RoundedCornerShape(12.dp)
                                )
                                .padding(horizontal = 12.dp, vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "Direct UPI (Manual Settle)",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Icon(
                                imageVector = Icons.Default.ArrowDropDown,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                }
            }

            if (printReviewQr) {
                SettingsTextField("Google Review URL", googleReviewUrl, { googleReviewUrl = it })
            }
        }

        // 4. Printer & Operations
        SettingsSectionCard(title = "Printer & KOT Operations", icon = Icons.Default.Print) {
            SettingsSelectorRow("Paper Width", listOf("THERMAL_80MM", "THERMAL_58MM", "A4"), printerType, { printerType = it })
            SettingsSelectorRow("Connection Type", listOf("USB", "WiFi", "Bluetooth"), printerConnection, { printerConnection = it })
            if (printerConnection == "WiFi") {
                SettingsTextField("Printer IP Address", printerIp, { printerIp = it })
            } else {
                SettingsTextField(if (printerConnection == "USB") "System Printer Name" else "Bluetooth Device ID", printerName, { printerName = it })
            }
            SettingsToggleRow(
                title = "Auto-Print KOT",
                description = "Instantly print KOT after sending to kitchen",
                checked = autoPrintKOT,
                onCheckedChange = { autoPrintKOT = it }
            )
        }

        // 5. General Options
        SettingsSectionCard(title = "General Settings", icon = Icons.Default.Settings) {
            SettingsTextField("Currency Symbol", currency, { currency = it })
            SettingsTextField("Decimal Places", decimalPlacesInput, { decimalPlacesInput = it }, keyboardType = KeyboardType.Number)
        }

        // 6. Operational & Table Views
        SettingsSectionCard(title = "Operational & Table Views", icon = Icons.Default.Info) {
            SettingsToggleRow(
                title = "Show Bill Details on Table",
                description = "Display item counts and total amount on table card",
                checked = showBillDetailsOnTable,
                onCheckedChange = { showBillDetailsOnTable = it }
            )
            SettingsToggleRow(
                title = "Show Order Status on Table",
                description = "Display order status badge on table card",
                checked = showOrderStatusOnTable,
                onCheckedChange = { showOrderStatusOnTable = it }
            )
            SettingsToggleRow(
                title = "Show Table Departments Filter",
                description = "Display AC/Non-AC filter tabs",
                checked = showTableDepartments,
                onCheckedChange = { showTableDepartments = it }
            )
            SettingsToggleRow(
                title = "Show KOT No placed on Table",
                description = "Display current table KOT number",
                checked = showKOTNoOnTable,
                onCheckedChange = { showKOTNoOnTable = it }
            )
            SettingsToggleRow(
                title = "Display Time on Table",
                description = "Show elapsed time on table cards",
                checked = displayTimeOnTable,
                onCheckedChange = { displayTimeOnTable = it }
            )
            SettingsToggleRow(
                title = "Table Name as Customer Name",
                description = "Use table name as default customer name for counter/delivery",
                checked = tableNameAsCustomerName,
                onCheckedChange = { tableNameAsCustomerName = it }
            )
        }

        // 7. Menu & Item Options
        SettingsSectionCard(title = "Menu & Item Options", icon = Icons.Default.ShoppingCart) {
            SettingsToggleRow(
                title = "Show Compact Item View",
                description = "Use a 3-column compact grid for the menu",
                checked = showCompactItemView,
                onCheckedChange = { showCompactItemView = it }
            )
            SettingsToggleRow(
                title = "Show Item Code Details",
                description = "Display product code under the name",
                checked = showItemsCodeDetails,
                onCheckedChange = { showItemsCodeDetails = it }
            )
            SettingsToggleRow(
                title = "Show Items Details",
                description = "Display item description in menu cards",
                checked = showItemsDetails,
                onCheckedChange = { showItemsDetails = it }
            )
            SettingsSelectorRow("Sort Items By", listOf("top_sold_qty", "top_sold_amt", "short_code", "alphabetical"), sortItemsBy, { sortItemsBy = it })
            SettingsSelectorRow("Default Startup Tab", listOf("Dine In", "Quick Bill", "PickUp", "Delivery", "Pre Order"), defaultTab, { defaultTab = it })
            SettingsToggleRow(
                title = "Show Item Image",
                description = "Display images for menu item cards",
                checked = showItemImage,
                onCheckedChange = { showItemImage = it }
            )
            SettingsToggleRow(
                title = "Show Items Prep Time",
                description = "Display expected preparation delay badge",
                checked = showItemsPrepTime,
                onCheckedChange = { showItemsPrepTime = it }
            )
            SettingsToggleRow(
                title = "Show Pre-Order Date Filter",
                description = "Display date filter for pre-orders",
                checked = showPreOrderDateFilter,
                onCheckedChange = { showPreOrderDateFilter = it }
            )
        }

        // 8. Disable Tabs
        SettingsSectionCard(title = "Disable Tabs", icon = Icons.Default.Block) {
            SettingsToggleRow(
                title = "Disable Dine In",
                description = "Hide the Dine In tab from flow selection",
                checked = disableTabDineIn,
                onCheckedChange = { disableTabDineIn = it }
            )
            SettingsToggleRow(
                title = "Disable PickUp",
                description = "Hide the PickUp / Delivery tab",
                checked = disableTabPickup,
                onCheckedChange = { disableTabPickup = it }
            )
            SettingsToggleRow(
                title = "Disable Quick Bill",
                description = "Hide the Quick Bill tab",
                checked = disableTabQuickBill,
                onCheckedChange = { disableTabQuickBill = it }
            )
            SettingsToggleRow(
                title = "Disable Pre Order",
                description = "Hide the Pre Order tab",
                checked = disableTabPreOrder,
                onCheckedChange = { disableTabPreOrder = it }
            )
        }

        // 9. Quick Bill Settings
        SettingsSectionCard(title = "Quick Bill Settings", icon = Icons.Default.FlashOn) {
            SettingsToggleRow(
                title = "Default Print KOT",
                description = "Automatically print KOT in quick bill mode",
                checked = quickBillDefaultKOTPrint,
                onCheckedChange = { quickBillDefaultKOTPrint = it }
            )
            SettingsToggleRow(
                title = "Default Print Bill",
                description = "Automatically print Bill in quick bill mode",
                checked = quickBillDefaultBillPrint,
                onCheckedChange = { quickBillDefaultBillPrint = it }
            )
        }

        // Online Orders Settings
        SettingsSectionCard(title = "Online Orders Settings", icon = Icons.Default.CloudDownload) {
            SettingsToggleRow(
                title = "Print KOT on Accept",
                description = "Auto-print KOT receipt when accepting live orders",
                checked = printKOTOnAccept,
                onCheckedChange = { printKOTOnAccept = it }
            )
            SettingsToggleRow(
                title = "Print Bill on Accept",
                description = "Auto-print Bill receipt when accepting live orders",
                checked = printBillOnAccept,
                onCheckedChange = { printBillOnAccept = it }
            )
            SettingsToggleRow(
                title = "Show Direct Complete Button",
                description = "Display a Direct Complete button on pending live order cards",
                checked = showDirectCompleteButton,
                onCheckedChange = { showDirectCompleteButton = it }
            )
        }

        // 8. Checkout Rules
        SettingsSectionCard(title = "Checkout Rules", icon = Icons.Default.Payment) {
            SettingsToggleRow(
                title = "Show Save KOT Button",
                description = "Show Save KOT button in KOT actions footer",
                checked = !disableSaveKOT,
                onCheckedChange = { disableSaveKOT = !it }
            )
            SettingsToggleRow(
                title = "Show Save Bill Button",
                description = "Show Save Bill button in billing actions footer",
                checked = !disableSaveBill,
                onCheckedChange = { disableSaveBill = !it }
            )
        }

        Spacer(Modifier.height(20.dp))

        // Theme Toggle Row
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 14.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = if (isDarkTheme) Icons.Default.DarkMode else Icons.Default.LightMode,
                        contentDescription = "Theme",
                        tint = SaSGreen,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(14.dp))
                    Text(
                        text = "Dark Mode",
                        color = MaterialTheme.colorScheme.onSurface,
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                }
                IosToggle(
                    checked = isDarkTheme,
                    onCheckedChange = { onThemeToggle() }
                )
            }
        }

        Spacer(Modifier.height(20.dp))

        // Logout Button
        Button(
            onClick = onLogout,
            modifier = Modifier.fillMaxWidth().height(52.dp),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.buttonColors(containerColor = StatusDanger)
        ) {
            Icon(Icons.Default.Logout, null, tint = Color.White, modifier = Modifier.size(18.dp))
            Spacer(Modifier.width(8.dp))
            Text("Logout", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
        }

        Spacer(Modifier.height(30.dp))
        }
    }
}

@Composable
fun SettingsSectionCard(
    title: String,
    icon: ImageVector,
    content: @Composable ColumnScope.() -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(bottom = 12.dp)
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = title,
                    tint = SaSGreen,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(Modifier.width(8.dp))
                Text(
                    text = title.uppercase(),
                    color = MaterialTheme.colorScheme.onSurface,
                    fontWeight = FontWeight.Black,
                    fontSize = 11.sp,
                    letterSpacing = 1.sp
                )
            }
            content()
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsTextField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    keyboardType: KeyboardType = KeyboardType.Text,
    singleLine: Boolean = true,
    enabled: Boolean = true
) {
    Column(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
        Text(
            text = label.uppercase(),
            fontSize = 9.sp,
            fontWeight = FontWeight.Black,
            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f),
            modifier = Modifier.padding(bottom = 4.dp)
        )
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
            singleLine = singleLine,
            maxLines = if (singleLine) 1 else 4,
            enabled = enabled,
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = SaSGreen,
                unfocusedBorderColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f),
                focusedLabelColor = SaSGreen,
                unfocusedLabelColor = MaterialTheme.colorScheme.onSurfaceVariant,
                focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f),
                unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.15f),
                focusedTextColor = MaterialTheme.colorScheme.onSurface,
                unfocusedTextColor = MaterialTheme.colorScheme.onSurface
            ),
            textStyle = androidx.compose.ui.text.TextStyle(fontSize = 13.sp, fontWeight = FontWeight.Bold)
        )
    }
}

@Composable
fun SettingsToggleRow(
    title: String,
    description: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Column(modifier = Modifier.weight(1f).padding(end = 16.dp)) {
            Text(
                text = title,
                color = MaterialTheme.colorScheme.onSurface,
                fontWeight = FontWeight.Bold,
                fontSize = 13.sp
            )
            Text(
                text = description,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontSize = 10.sp
            )
        }
        IosToggle(
            checked = checked,
            onCheckedChange = onCheckedChange
        )
    }
}

@Composable
fun SettingsSelectorRow(
    label: String,
    options: List<String>,
    selectedOption: String,
    onOptionSelected: (String) -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
        Text(
            text = label.uppercase(),
            fontSize = 9.sp,
            fontWeight = FontWeight.Black,
            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f),
            modifier = Modifier.padding(bottom = 4.dp)
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            options.forEach { option ->
                val isSelected = option == selectedOption
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (isSelected) SaSGreen else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.2f))
                        .border(
                            1.dp,
                            if (isSelected) SaSGreen else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f),
                            RoundedCornerShape(8.dp)
                        )
                        .clickable { onOptionSelected(option) }
                        .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = option.replace("THERMAL_", "").replace("MM", " mm"),
                        color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface,
                        fontWeight = FontWeight.Bold,
                        fontSize = 11.sp
                    )
                }
            }
        }
    }
}
