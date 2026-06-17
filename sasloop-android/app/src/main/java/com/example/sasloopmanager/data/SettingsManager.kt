package com.example.sasloopmanager.data

import android.content.Context
import com.google.gson.Gson

data class PosSettings(
    var businessName: String = "",
    var address: String = "Ist Floor Rather Plaza Kangan\nJ&K-191202",
    var phone: String = "9906123989",
    var gstin: String = "01BNIPB3099J1Z4",
    var printerType: String = "THERMAL_80MM",
    var printerConnection: String = "USB",
    var printerIp: String = "",
    var printerName: String = "Default Thermal Printer",
    var autoPrintKOT: Boolean = true,
    var receiptHeader: String = "SHAHE TEHZEEB RESTAURANT",
    var receiptFooter: String = "Ist Floor Rather Plaza Kangan\nJ&K-191202\nContact No: 9906123989\nGSTIN : 01BNIPB3099J1Z4",
    var appVersion: String = "SaSLoop POS Version: 19.02",
    var greetingMessage: String = "THANK YOU! VISIT AGAIN",
    var showLogoOnReceipt: Boolean = true,
    var currency: String = "Rs",
    var taxRate: Double = 5.0,
    var taxName: String = "GST",
    var isTaxInclusive: Boolean = false,
    var hideTaxOnBill: Boolean = false,
    var enableServiceCharge: Boolean = false,
    var serviceChargeRate: Double = 5.0,
    var autoRoundOff: Boolean = true,
    var decimalPlaces: Int = 2,
    var upiId: String = "",
    var upiPaymentMethod: String = "direct",
    var printUpiQr: Boolean = false,
    var qrMode: String = "dynamic",
    var showBillDetailsOnTable: Boolean = true,
    var showOrderStatusOnTable: Boolean = false,
    var showTableDepartments: Boolean = true,
    var showCompactItemView: Boolean = false,
    var showItemsCodeDetails: Boolean = false,
    var sortItemsBy: String = "top_sold_qty",
    var defaultTab: String = "Dine In",
    var disableSaveKOT: Boolean = false,
    var disableSaveBill: Boolean = false,
    var showItemImage: Boolean = true,
    var showItemsPrepTime: Boolean = true,
    var tableNameAsCustomerName: Boolean = false,
    var showKOTNoOnTable: Boolean = false,
    var displayTimeOnTable: Boolean = false,
    var separateView: Boolean = true,
    var showItemsDetails: Boolean = true,
    var showPreOrderDateFilter: Boolean = false,
    var showVirtualKeyboard: Boolean = false,
    var quickBillDefaultKOTPrint: Boolean = false,
    var quickBillDefaultBillPrint: Boolean = false,
    var printKOTOnAccept: Boolean = false,
    var printBillOnAccept: Boolean = false,
    var showDirectCompleteButton: Boolean = false,
    var successNotificationSound: String = "",
    var cancelNotificationSound: String = "",
    var disableTabDineIn: Boolean = false,
    var disableTabPickup: Boolean = false,
    var disableTabQuickBill: Boolean = false,
    var disableTabPreOrder: Boolean = false,
    var countAdvanceInSales: Boolean = false,
    var printReviewQr: Boolean = false,
    var googleReviewUrl: String = ""
)

object SettingsManager {
    private const val PREFS_NAME = "sasloop_terminal_settings"
    private const val SETTINGS_KEY = "pos_settings"
    private val gson = Gson()

    fun getSettings(context: Context): PosSettings {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val json = prefs.getString(SETTINGS_KEY, null)
        return if (json != null) {
            try {
                val settings = gson.fromJson(json, PosSettings::class.java)
                val jsonObject = gson.fromJson(json, com.google.gson.JsonObject::class.java)
                if (!jsonObject.has("autoPrintKOT")) settings.autoPrintKOT = true
                if (!jsonObject.has("showLogoOnReceipt")) settings.showLogoOnReceipt = true
                if (!jsonObject.has("showBillDetailsOnTable")) settings.showBillDetailsOnTable = true
                if (!jsonObject.has("showTableDepartments")) settings.showTableDepartments = true
                if (!jsonObject.has("showItemImage")) settings.showItemImage = true
                if (!jsonObject.has("showItemsPrepTime")) settings.showItemsPrepTime = true
                if (!jsonObject.has("separateView")) settings.separateView = true
                if (!jsonObject.has("showItemsDetails")) settings.showItemsDetails = true
                if (!jsonObject.has("decimalPlaces")) settings.decimalPlaces = 2
                
                var migrated = false
                if (settings.phone == "9906495133/7006089744" || settings.phone == "+917006089744" || settings.phone == "7006089744") {
                    settings.phone = "9906123989"
                    migrated = true
                }
                if (settings.receiptFooter.contains("9906495133/7006089744")) {
                    settings.receiptFooter = settings.receiptFooter.replace("9906495133/7006089744", "9906123989")
                    migrated = true
                }
                if (settings.receiptFooter.contains("+917006089744")) {
                    settings.receiptFooter = settings.receiptFooter.replace("+917006089744", "9906123989")
                    migrated = true
                }
                if (settings.receiptFooter.contains("7006089744")) {
                    settings.receiptFooter = settings.receiptFooter.replace("7006089744", "9906123989")
                    migrated = true
                }
                if (migrated) {
                    saveSettings(context, settings)
                }

                settings
            } catch (e: Exception) {
                PosSettings()
            }
        } else {
            PosSettings()
        }
    }

    fun saveSettings(context: Context, settings: PosSettings) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val json = gson.toJson(settings)
        prefs.edit().putString(SETTINGS_KEY, json).apply()
    }
}
