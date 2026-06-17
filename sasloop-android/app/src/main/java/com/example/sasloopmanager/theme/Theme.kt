package com.example.sasloopmanager.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.ui.graphics.Color
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp

private val SaSLoopDarkColorScheme = darkColorScheme(
    primary = SaSGreen,
    onPrimary = TextWhite,
    primaryContainer = SaSGreenDark,
    onPrimaryContainer = TextWhite,
    secondary = SaSGreenLight,
    onSecondary = TextWhite,
    background = BgDark,
    onBackground = TextPrimary,
    surface = CardDark,
    onSurface = TextPrimary,
    surfaceVariant = InputDark,
    onSurfaceVariant = TextSecondary,
    outline = CardBorderDark,
    error = StatusDanger,
    onError = TextWhite,
)

private val SaSLoopLightColorScheme = androidx.compose.material3.lightColorScheme(
    primary = SaSGreen,
    onPrimary = TextWhite,
    primaryContainer = SaSGreenLight,
    onPrimaryContainer = TextWhite,
    secondary = SaSGreenDark,
    onSecondary = TextWhite,
    background = Color(0xFFF8FAFC),
    onBackground = Color(0xFF0F172A),
    surface = Color.White,
    onSurface = Color(0xFF0F172A),
    surfaceVariant = Color(0xFFF1F5F9),
    onSurfaceVariant = TextSecondary,
    outline = Color(0xFFE2E8F0),
    error = StatusDanger,
    onError = TextWhite,
)

@Composable
fun SaSLoopManagerTheme(
    darkTheme: Boolean = true,
    content: @Composable () -> Unit,
) {
    val colorScheme = if (darkTheme) SaSLoopDarkColorScheme else SaSLoopLightColorScheme
    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}

@Composable
fun IosToggle(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier
) {
    // iPhone-style switch dimensions: width = 42.dp, height = 24.dp
    val width = 42.dp
    val height = 24.dp
    val thumbSize = 20.dp
    val padding = 2.dp

    val trackColor = if (checked) SaSGreen else Color(0xFFD1D1D6)

    val thumbOffset by animateDpAsState(
        targetValue = if (checked) width - thumbSize - (padding * 2) else 0.dp,
        animationSpec = tween(durationMillis = 200),
        label = "thumbOffset"
    )

    Box(
        modifier = modifier
            .width(width)
            .height(height)
            .clip(RoundedCornerShape(height / 2))
            .background(trackColor)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null
            ) {
                onCheckedChange(!checked)
            }
            .padding(padding),
        contentAlignment = Alignment.CenterStart
    ) {
        Box(
            modifier = Modifier
                .offset(x = thumbOffset)
                .size(thumbSize)
                .clip(RoundedCornerShape(50))
                .background(Color.White)
        )
    }
}
