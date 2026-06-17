const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../sasloop-android/app/src/main/java/com/example/sasloopmanager/ui/BillingScreen.kt');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to LF
const hasCRLF = content.includes('\r\n');
if (hasCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

// 1. Add import for RadioButton and RadioButtonDefaults if not already present
if (!content.includes('import androidx.compose.material3.RadioButton')) {
  content = content.replace(
    'import androidx.compose.material3.RadioButtonDefaults',
    'import androidx.compose.material3.RadioButton\nimport androidx.compose.material3.RadioButtonDefaults'
  );
}

// 2. Add WaiterSelectionDialog composable function at the end of the file
const dialogCode = `
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
        val filtered = staffList.filter { s ->
            val des = (s.designationName ?: "").lowercase(java.util.Locale.US)
            val role = (s.role ?: "").lowercase(java.util.Locale.US)
            des.contains("waiter") || role.contains("waiter")
        }
        if (filtered.isEmpty()) staffList else filtered
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
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "SELECT WAITER",
                        fontWeight = FontWeight.Black,
                        fontSize = 12.sp,
                        color = TextPrimary
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
`;

// Append the new dialog at the end of the file
content += '\n' + dialogCode.trim() + '\n';
console.log('Success: Appended WaiterSelectionDialog composable.');

// 3. Render WaiterSelectionDialog if showWaiterDialog is true in dialogs block
const targetDialogCheck = `            if (showPreviewDialog) {`;
const replacementDialogCheck = `            if (showWaiterDialog) {
                WaiterSelectionDialog(
                    onDismissRequest = { showWaiterDialog = false },
                    staffList = staffList,
                    selectedWaiter = selectedWaiter,
                    onSelectWaiter = { selectedWaiter = it }
                )
            }

            if (showPreviewDialog) {`;

if (content.includes(targetDialogCheck)) {
  content = content.replace(targetDialogCheck, replacementDialogCheck);
  console.log('Success: Added showWaiterDialog render check.');
} else {
  console.log('Error: showPreviewDialog marker not found.');
}

// 4. Update KotSubTab parameters list to include onClearAllFields
const targetKotSubTabParams = `    onShowWaiterDialogChange: (Boolean) -> Unit,
    onShowHistoryDialogChange: (Boolean) -> Unit
) {`;
const replacementKotSubTabParams = `    onShowWaiterDialogChange: (Boolean) -> Unit,
    onShowHistoryDialogChange: (Boolean) -> Unit,
    onClearAllFields: () -> Unit
) {`;

if (content.includes(targetKotSubTabParams)) {
  content = content.replace(targetKotSubTabParams, replacementKotSubTabParams);
  console.log('Success: Updated KotSubTab signature.');
} else {
  console.log('Error: KotSubTab parameters target not found.');
}

// 5. Update KotSubTab call in BillingScreen to pass onClearAllFields callback
const targetKotSubTabCall = `                                    onShowWaiterDialogChange = { showWaiterDialog = it },
                                    onShowHistoryDialogChange = { showHistoryDialog = it }
                                )`;
const replacementKotSubTabCall = `                                    onShowWaiterDialogChange = { showWaiterDialog = it },
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
                                )`;

if (content.includes(targetKotSubTabCall)) {
  content = content.replace(targetKotSubTabCall, replacementKotSubTabCall);
  console.log('Success: Updated KotSubTab invocation.');
} else {
  console.log('Error: KotSubTab call target not found.');
}

// 6. Remove Row 1: Action Icons in KotSubTab
const targetKotRow1 = `            // Row 1: Action Icons (Right aligned: Gift, Ribbon, File+)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = { onIsComplimentaryOrderChange(!isComplimentaryOrder) }, modifier = Modifier.size(36.dp)) {
                    Icon(
                        imageVector = Icons.Default.Redeem,
                        contentDescription = "Gift",
                        tint = if (isComplimentaryOrder) SaSGreen else TextPrimary,
                        modifier = Modifier.size(24.dp)
                    )
                }
                Spacer(modifier = Modifier.width(8.dp))
                IconButton(onClick = { onShowDiscountDialogChange(true) }, modifier = Modifier.size(36.dp)) {
                    Icon(Icons.Default.LocalOffer, contentDescription = "Discount", tint = TextPrimary, modifier = Modifier.size(24.dp))
                }
                Spacer(modifier = Modifier.width(8.dp))
                IconButton(onClick = { onShowChargesDialogChange(true) }, modifier = Modifier.size(36.dp)) {
                    Icon(Icons.Default.Description, contentDescription = "Charges", tint = TextPrimary, modifier = Modifier.size(24.dp))
                }
            }`;

if (content.includes(targetKotRow1)) {
  content = content.replace(targetKotRow1, '');
  console.log('Success: Removed Row 1 action icons from KotSubTab.');
} else {
  console.log('Error: KotSubTab Row 1 action icons target not found.');
}

// 7. Update Trash Icon click listener in KotSubTab to use onClearAllFields
const targetTrashIcon = `                // Trash icon
                IconButton(
                    onClick = { billingViewModel.clearCart() },
                    modifier = Modifier.size(32.dp)
                ) {
                    Icon(Icons.Default.Delete, contentDescription = "Clear", tint = Color.Red, modifier = Modifier.size(20.dp))
                }`;

const replacementTrashIcon = `                // Trash icon
                IconButton(
                    onClick = onClearAllFields,
                    modifier = Modifier.size(32.dp)
                ) {
                    Icon(Icons.Default.Delete, contentDescription = "Clear", tint = Color.Red, modifier = Modifier.size(20.dp))
                }`;

if (content.includes(targetTrashIcon)) {
  content = content.replace(targetTrashIcon, replacementTrashIcon);
  console.log('Success: Updated Trash icon action in KotSubTab.');
} else {
  console.log('Error: KotSubTab Trash icon action target not found.');
}

// 8. Remove the first three icons (Redeem, LocalOffer, Description) in BillingSubTab Row 1
const targetBillingRow1 = `            // Row 1: Footer icons (Gift, Ribbon, File+, Waiter outline, Waiter cloche, eBill checkbox)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = { onIsComplimentaryOrderChange(!isComplimentaryOrder) }, modifier = Modifier.size(36.dp)) {
                    Icon(
                        imageVector = Icons.Default.Redeem,
                        contentDescription = "Gift",
                        tint = if (isComplimentaryOrder) SaSGreen else TextPrimary,
                        modifier = Modifier.size(24.dp)
                    )
                }
                Spacer(modifier = Modifier.width(6.dp))
                IconButton(onClick = { onShowDiscountDialogChange(true) }, modifier = Modifier.size(36.dp)) {
                    Icon(Icons.Default.LocalOffer, contentDescription = "Discount", tint = TextPrimary, modifier = Modifier.size(24.dp))
                }
                Spacer(modifier = Modifier.width(6.dp))
                IconButton(onClick = { onShowChargesDialogChange(true) }, modifier = Modifier.size(36.dp)) {
                    Icon(Icons.Default.Description, contentDescription = "Charges", tint = TextPrimary, modifier = Modifier.size(24.dp))
                }
                Spacer(modifier = Modifier.width(6.dp))
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
            }`;

const replacementBillingRow1 = `            // Row 1: Footer icons (Waiter outline, Waiter cloche, eBill checkbox)
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
            }`;

if (content.includes(targetBillingRow1)) {
  content = content.replace(targetBillingRow1, replacementBillingRow1);
  console.log('Success: Updated BillingSubTab footer icons.');
} else {
  console.log('Error: BillingSubTab footer icons target not found.');
}

// Convert back to CRLF if needed
if (hasCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully wrote BillingScreen.kt!');
