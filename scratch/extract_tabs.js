const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt');
let content = fs.readFileSync(filePath, 'utf8');

function extractBlock(content, searchStr) {
    const startIdx = content.indexOf(searchStr);
    if (startIdx === -1) {
        console.error("Could not find start string:", searchStr);
        return null;
    }
    
    // Find the opening brace '{'
    const openBraceIdx = content.indexOf('{', startIdx);
    if (openBraceIdx === -1) {
        console.error("Could not find opening brace for:", searchStr);
        return null;
    }
    
    let braceCount = 1;
    let i = openBraceIdx + 1;
    while (braceCount > 0 && i < content.length) {
        if (content[i] === '{') braceCount++;
        else if (content[i] === '}') braceCount--;
        i++;
    }
    
    if (braceCount === 0) {
        return {
            start: startIdx,
            open: openBraceIdx,
            end: i,
            body: content.slice(openBraceIdx + 1, i - 1)
        };
    }
    console.error("Could not find matching closing brace for:", searchStr);
    return null;
}

const menuBlock = extractBlock(content, '                            "MENU" -> {');
const kotBlock = extractBlock(content, '                            "KOT" -> {');
const billingBlock = extractBlock(content, '                            "BILLING" -> {');

if (!menuBlock || !kotBlock || !billingBlock) {
    console.error('Failed to locate all sub-tab blocks.');
    process.exit(1);
}

console.log({
    menuStart: menuBlock.start,
    menuEnd: menuBlock.end,
    kotStart: kotBlock.start,
    kotEnd: kotBlock.end,
    billingStart: billingBlock.start,
    billingEnd: billingBlock.end
});

function dedent28(text) {
    return text.split('\n').map(line => {
        if (line.startsWith('                            ')) {
            return line.slice(28);
        }
        return line;
    }).join('\n');
}

const menuBody = dedent28(menuBlock.body);
const kotBody = dedent28(kotBlock.body);
const billingBody = dedent28(billingBlock.body);

const menuCall = `                            "MENU" -> {
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
                            }`;

const kotCall = `                            "KOT" -> {
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
                                    onActiveSubTabChange = { activeSubTab = it }
                                )
                            }`;

const billingCall = `                            "BILLING" -> {
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
                                    onShowHistoryDialogChange = { showHistoryDialog = it }
                                )
                            }`;

// Replace the contiguous block from menuBlock.start to billingBlock.end
let newContent = content.slice(0, menuBlock.start) + 
                 menuCall + '\n' + 
                 kotCall + '\n' + 
                 billingCall + 
                 content.slice(billingBlock.end);

// Add Context import at the top
newContent = newContent.replace('import android.widget.Toast', 'import android.content.Context\nimport android.widget.Toast');

// Composable helper functions to append at the bottom
const menuSubTabFunction = `
@Composable
fun MenuSubTab(
    searchQuery: String,
    foodTypeFilter: String,
    onFoodTypeFilterChange: (String) -> Unit,
    selectedCategory: String,
    categories: List<com.example.sasloopmanager.data.Category>,
    isLoading: Boolean,
    error: String?,
    sortedItems: List<com.example.sasloopmanager.data.MenuItem>,
    cart: Map<com.example.sasloopmanager.data.MenuItem, Int>,
    oldKotItems: Map<com.example.sasloopmanager.data.MenuItem, Int>,
    selectedPriceTier: String,
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
    var showCategoryMenu by remember { mutableStateOf(false) }

${menuBody}
}
`;

const kotSubTabFunction = `
@Composable
fun KotSubTab(
    editingOrderId: String?,
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
    onActiveSubTabChange: (String) -> Unit
) {
    val CardDark = MaterialTheme.colorScheme.surface
    val CardBorderDark = MaterialTheme.colorScheme.outline
    val InputDark = MaterialTheme.colorScheme.surfaceVariant
    val TextPrimary = MaterialTheme.colorScheme.onBackground
    val TextSecondary = MaterialTheme.colorScheme.onSurfaceVariant
    val isLoading by billingViewModel.isLoading.collectAsStateWithLifecycle()

${kotBody}
}
`;

const billingSubTabFunction = `
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
    editingOrderId: String?,
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
    onShowHistoryDialogChange: (Boolean) -> Unit
) {
    val CardDark = MaterialTheme.colorScheme.surface
    val CardBorderDark = MaterialTheme.colorScheme.outline
    val InputDark = MaterialTheme.colorScheme.surfaceVariant
    val TextPrimary = MaterialTheme.colorScheme.onBackground
    val TextSecondary = MaterialTheme.colorScheme.onSurfaceVariant
    val isLoading by billingViewModel.isLoading.collectAsStateWithLifecycle()

${billingBody}
}
`;

const finalContent = newContent.trim() + '\n\n' + menuSubTabFunction + '\n' + kotSubTabFunction + '\n' + billingSubTabFunction + '\n';
fs.writeFileSync(filePath, finalContent, 'utf8');
console.log('Successfully extracted and refactored all sub-tabs with brace counting!');
