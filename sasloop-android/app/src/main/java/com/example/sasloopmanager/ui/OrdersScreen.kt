package com.example.sasloopmanager

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.sasloopmanager.data.Order
import com.example.sasloopmanager.theme.*

private val FILTERS = listOf("ALL", "PENDING", "ACTIVE", "COMPLETED", "CANCELLED")

@Composable
fun OrdersScreen(
    ordersViewModel: OrdersViewModel,
    currency: String = "Rs",
    showDirectCompleteButton: Boolean = false,
    onOrderAccepted: (Order) -> Unit = {},
    onEditOrder: (Order) -> Unit = {}
) {
    val orders by ordersViewModel.orders.collectAsStateWithLifecycle()
    val isLoading by ordersViewModel.isLoading.collectAsStateWithLifecycle()
    val selectedFilter by ordersViewModel.selectedFilter.collectAsStateWithLifecycle()
    val error by ordersViewModel.error.collectAsStateWithLifecycle()

    val BgDark = MaterialTheme.colorScheme.background
    val CardDark = MaterialTheme.colorScheme.surface
    val CardBorderDark = MaterialTheme.colorScheme.outline
    val InputDark = MaterialTheme.colorScheme.surfaceVariant
    val TextPrimary = MaterialTheme.colorScheme.onBackground
    val TextSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
    ) {
        // ── Header ────────────────────────────────────────────────────────
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(CardDark)
                .padding(horizontal = 20.dp, vertical = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("Live Orders", color = TextPrimary, fontSize = 20.sp, fontWeight = FontWeight.Black)
                Text("${orders.size} order(s)", color = TextSecondary, fontSize = 12.sp)
            }
            IconButton(onClick = { ordersViewModel.fetchOrders() }) {
                Icon(Icons.Default.Refresh, "Refresh", tint = SaSGreen)
            }
        }

        // ── Filter Chips ──────────────────────────────────────────────────
        LazyRow(
            modifier = Modifier
                .fillMaxWidth()
                .background(CardDark)
                .padding(horizontal = 16.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(FILTERS) { filter ->
                FilterChip(
                    selected = selectedFilter == filter,
                    onClick = { ordersViewModel.setFilter(filter) },
                    label = {
                        Text(
                            filter,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = SaSGreen,
                        selectedLabelColor = Color.White,
                        containerColor = InputDark,
                        labelColor = TextSecondary
                    ),
                    border = FilterChipDefaults.filterChipBorder(
                        enabled = true,
                        selected = selectedFilter == filter,
                        borderColor = CardBorderDark,
                        selectedBorderColor = SaSGreen
                    )
                )
            }
        }

        HorizontalDivider(color = CardBorderDark)

        if (isLoading) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = SaSGreen)
            }
            return@Column
        }

        error?.let {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.WifiOff, null, tint = TextSecondary, modifier = Modifier.size(48.dp))
                    Spacer(Modifier.height(12.dp))
                    Text(it, color = TextSecondary)
                    Spacer(Modifier.height(12.dp))
                    Button(
                        onClick = { ordersViewModel.fetchOrders() },
                        colors = ButtonDefaults.buttonColors(containerColor = SaSGreen)
                    ) { Text("Retry") }
                }
            }
            return@Column
        }

        if (orders.isEmpty()) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.ReceiptLong, null, tint = TextSecondary, modifier = Modifier.size(64.dp))
                    Spacer(Modifier.height(12.dp))
                    Text("No orders found", color = TextSecondary, fontSize = 14.sp)
                }
            }
            return@Column
        }

        // ── Orders List ───────────────────────────────────────────────────
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(orders, key = { it.id }) { order ->
                OrderCard(
                    order = order,
                    onAccept = {
                        ordersViewModel.updateOrderStatus(order.id, "ACTIVE") { success ->
                            if (success) {
                                onOrderAccepted(order)
                            }
                        }
                    },
                    onReject = {
                        ordersViewModel.updateOrderStatus(order.id, "CANCELLED") { }
                    },
                    onComplete = {
                        ordersViewModel.updateOrderStatus(order.id, "COMPLETED") { }
                    },
                    onEdit = {
                        onEditOrder(order)
                    },
                    currency = currency,
                    showDirectCompleteButton = showDirectCompleteButton
                )
            }
        }
    }
}

@Composable
private fun OrderCard(
    order: Order,
    onAccept: () -> Unit,
    onReject: () -> Unit,
    onComplete: () -> Unit,
    onEdit: () -> Unit,
    currency: String,
    showDirectCompleteButton: Boolean
) {
    val BgDark = MaterialTheme.colorScheme.background
    val CardDark = MaterialTheme.colorScheme.surface
    val CardBorderDark = MaterialTheme.colorScheme.outline
    val InputDark = MaterialTheme.colorScheme.surfaceVariant
    val TextPrimary = MaterialTheme.colorScheme.onBackground
    val TextSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    val statusColor = when (order.status?.uppercase()) {
        "PENDING" -> PendingColor
        "ACTIVE", "ACCEPTED" -> ActiveColor
        "COMPLETED" -> CompletedColor
        "CANCELLED", "REJECTED" -> CancelledColor
        else -> TextSecondary
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = CardDark),
        border = androidx.compose.foundation.BorderStroke(1.dp, CardBorderDark)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Row 1: Order number + status badge
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    val billDisplay = order.billNo?.takeIf { it.isNotBlank() } ?: order.id.toString()
                    Text(
                        "Bill #$billDisplay",
                        color = TextPrimary,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        order.tableName ?: order.tableNumber ?: order.orderType ?: "Takeaway",
                        color = TextSecondary,
                        fontSize = 12.sp
                    )
                }
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = statusColor.copy(alpha = 0.15f)
                ) {
                    Text(
                        order.status?.uppercase() ?: "UNKNOWN",
                        color = statusColor,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }
            }

            Spacer(Modifier.height(10.dp))
            HorizontalDivider(color = CardBorderDark)
            Spacer(Modifier.height(10.dp))

            // Row 2: Customer + Amount
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text("Customer", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    Text(
                        order.customerName?.takeIf { it.isNotBlank() } ?: "Walk-in",
                        color = TextPrimary,
                        fontSize = 13.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                Column(horizontalAlignment = Alignment.End) {
                    Text("Total", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    Text(
                        "$currency ${String.format("%.2f", order.totalPrice ?: 0.0)}",
                        color = SaSGreen,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Black
                    )
                }
            }

            // Action Buttons (only for PENDING)
            if (order.status?.uppercase() == "PENDING") {
                Spacer(Modifier.height(12.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedButton(
                        onClick = onReject,
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = CancelledColor),
                        border = androidx.compose.foundation.BorderStroke(1.dp, CancelledColor.copy(alpha = 0.5f))
                    ) {
                        Text("Reject", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                    OutlinedButton(
                        onClick = onEdit,
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = SaSGreen),
                        border = androidx.compose.foundation.BorderStroke(1.dp, SaSGreen.copy(alpha = 0.5f))
                    ) {
                        Text("Edit", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                    Button(
                        onClick = onAccept,
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = SaSGreen)
                    ) {
                        Text("Accept", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }
                }
            }

            // Edit and Complete buttons for ACTIVE/ACCEPTED orders
            if (order.status?.uppercase() in listOf("ACTIVE", "ACCEPTED")) {
                Spacer(Modifier.height(12.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedButton(
                        onClick = onEdit,
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = SaSGreen),
                        border = androidx.compose.foundation.BorderStroke(1.dp, SaSGreen.copy(alpha = 0.5f))
                    ) {
                        Icon(Icons.Default.Edit, null, modifier = Modifier.size(16.dp), tint = SaSGreen)
                        Spacer(Modifier.width(6.dp))
                        Text("Edit / Bill", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = SaSGreen)
                    }
                    Button(
                        onClick = onComplete,
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = StatusInfo)
                    ) {
                        Icon(Icons.Default.CheckCircle, null, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(6.dp))
                        Text("Complete", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }
                }
            }
        }
    }
}
