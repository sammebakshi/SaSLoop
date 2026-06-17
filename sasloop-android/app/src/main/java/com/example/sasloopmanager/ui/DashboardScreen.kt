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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.sasloopmanager.data.DashboardStats
import com.example.sasloopmanager.data.UserProfile
import com.example.sasloopmanager.theme.*

@Composable
fun DashboardScreen(
    user: UserProfile?,
    dashboardViewModel: DashboardViewModel,
    onLogout: () -> Unit,
    currency: String = "Rs"
) {
    val stats by dashboardViewModel.stats.collectAsStateWithLifecycle()
    val isLoading by dashboardViewModel.isLoading.collectAsStateWithLifecycle()
    val error by dashboardViewModel.error.collectAsStateWithLifecycle()

    val bg = MaterialTheme.colorScheme.background
    val card = MaterialTheme.colorScheme.surface
    val border = MaterialTheme.colorScheme.outline
    val textSecondary = MaterialTheme.colorScheme.onSurfaceVariant
    val onSurface = MaterialTheme.colorScheme.onSurface

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(bg)
    ) {
        // ── Top Bar ──────────────────────────────────────────────────────
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(card)
                .padding(horizontal = 20.dp, vertical = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    "Good ${getGreeting()}, ${user?.name ?: user?.username ?: "Manager"} 👋",
                    color = onSurface,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    user?.businessName ?: "SaSLoop POS",
                    color = textSecondary,
                    fontSize = 12.sp
                )
            }
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = { dashboardViewModel.fetchStats() }) {
                    Icon(Icons.Default.Refresh, "Refresh", tint = SaSGreen)
                }
                IconButton(onClick = onLogout) {
                    Icon(Icons.Default.Logout, "Logout", tint = textSecondary)
                }
            }
        }

        if (isLoading) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = SaSGreen)
            }
            return@Column
        }

        error?.let { err ->
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.WifiOff, null, tint = textSecondary, modifier = Modifier.size(48.dp))
                    Spacer(Modifier.height(12.dp))
                    Text(err, color = textSecondary, fontSize = 14.sp)
                    Spacer(Modifier.height(16.dp))
                    Button(
                        onClick = { dashboardViewModel.fetchStats() },
                        colors = ButtonDefaults.buttonColors(containerColor = SaSGreen)
                    ) { Text("Retry") }
                }
            }
            return@Column
        }

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // ── Stats Grid ──────────────────────────────────────────────
            item {
                Text(
                    "TODAY'S OVERVIEW",
                    color = textSecondary,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 2.sp,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    StatCard(
                        modifier = Modifier.weight(1f),
                        label = "Today's Sales",
                        value = "$currency ${String.format("%.0f", stats?.todayRevenue ?: 0.0)}",
                        icon = Icons.Default.TrendingUp,
                        iconColor = SaSGreen
                    )
                    StatCard(
                        modifier = Modifier.weight(1f),
                        label = "Total Orders",
                        value = "${stats?.todayOrders ?: 0}",
                        icon = Icons.Default.Receipt,
                        iconColor = StatusInfo
                    )
                }
                Spacer(Modifier.height(12.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    StatCard(
                        modifier = Modifier.weight(1f),
                        label = "Active Tables",
                        value = "${stats?.activeTables ?: 0}",
                        icon = Icons.Default.TableRestaurant,
                        iconColor = StatusWarning
                    )
                    StatCard(
                        modifier = Modifier.weight(1f),
                        label = "Pending",
                        value = "${stats?.pendingOrders ?: 0}",
                        icon = Icons.Default.HourglassBottom,
                        iconColor = StatusDanger
                    )
                }
            }

            // ── Revenue Summary ─────────────────────────────────────────
            stats?.let { s ->
                item {
                    Text(
                        "REVENUE SUMMARY",
                        color = textSecondary,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 2.sp,
                        modifier = Modifier.padding(bottom = 8.dp)
                    )
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = card),
                        border = androidx.compose.foundation.BorderStroke(1.dp, border)
                    ) {
                        Column(modifier = Modifier.padding(20.dp)) {
                            RevenueRow("This Week", "$currency ${String.format("%.0f", s.weekRevenue ?: 0.0)}", SaSGreen)
                            HorizontalDivider(color = border, modifier = Modifier.padding(vertical = 12.dp))
                            RevenueRow("This Month", "$currency ${String.format("%.0f", s.monthRevenue ?: 0.0)}", SaSGreenLight)
                            HorizontalDivider(color = border, modifier = Modifier.padding(vertical = 12.dp))
                            RevenueRow("All Time", "$currency ${String.format("%.0f", s.totalRevenue ?: 0.0)}", StatusInfo)
                        }
                    }
                }

                // ── Device / Channel Sales ──────────────────────────────────
                s.salesBySource?.let { sourceSales ->
                    if (sourceSales.isNotEmpty()) {
                        item {
                            Text(
                                "DEVICE / CHANNEL SALES",
                                color = textSecondary,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 2.sp,
                                modifier = Modifier.padding(bottom = 8.dp)
                            )
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(16.dp),
                                colors = CardDefaults.cardColors(containerColor = card),
                                border = androidx.compose.foundation.BorderStroke(1.dp, border)
                            ) {
                                Column(modifier = Modifier.padding(20.dp)) {
                                    sourceSales.forEachIndexed { index, ss ->
                                        val formattedSource = when (ss.source.uppercase()) {
                                            "POS_WINDOWS" -> "Windows POS (Online)"
                                            "POS_WINDOWS_OFFLINE" -> "Windows POS (Offline)"
                                            "POS_ANDROID" -> "Android POS / Mobile"
                                            "QR_MENU" -> "QR Code Menu"
                                            "ONLINE_ORDER" -> "Online Ordering"
                                            else -> ss.source.replace("_", " ")
                                        }
                                        RevenueRow(
                                            label = "$formattedSource (${ss.count} orders)",
                                            value = "$currency ${String.format("%.0f", ss.total)}",
                                            valueColor = if (ss.source.contains("ANDROID")) SaSGreen else StatusInfo
                                        )
                                        if (index < sourceSales.size - 1) {
                                            HorizontalDivider(color = border, modifier = Modifier.padding(vertical = 12.dp))
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
private fun StatCard(
    modifier: Modifier = Modifier,
    label: String,
    value: String,
    icon: ImageVector,
    iconColor: Color
) {
    val card = MaterialTheme.colorScheme.surface
    val border = MaterialTheme.colorScheme.outline
    val textSecondary = MaterialTheme.colorScheme.onSurfaceVariant
    val onSurface = MaterialTheme.colorScheme.onSurface

    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = card),
        border = androidx.compose.foundation.BorderStroke(1.dp, border)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(iconColor.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, null, tint = iconColor, modifier = Modifier.size(20.dp))
            }
            Spacer(Modifier.height(12.dp))
            Text(value, color = onSurface, fontSize = 22.sp, fontWeight = FontWeight.Black)
            Text(label, color = textSecondary, fontSize = 11.sp, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
private fun RevenueRow(label: String, value: String, valueColor: Color) {
    val textSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(label, color = textSecondary, fontSize = 14.sp)
        Text(value, color = valueColor, fontSize = 18.sp, fontWeight = FontWeight.Bold)
    }
}

private fun getGreeting(): String {
    val hour = java.util.Calendar.getInstance().get(java.util.Calendar.HOUR_OF_DAY)
    return when {
        hour < 12 -> "Morning"
        hour < 17 -> "Afternoon"
        else -> "Evening"
    }
}
