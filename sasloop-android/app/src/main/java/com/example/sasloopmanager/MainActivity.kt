package com.example.sasloopmanager

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import android.content.Context
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.sasloopmanager.theme.SaSLoopManagerTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val sharedPrefs = remember { getSharedPreferences("sasloop_prefs", Context.MODE_PRIVATE) }
            var isDarkTheme by remember { 
                mutableStateOf(sharedPrefs.getBoolean("is_dark_theme", true)) 
            }
            
            SaSLoopManagerTheme(darkTheme = isDarkTheme) {
                MainNavigation(
                    isDarkTheme = isDarkTheme,
                    onThemeToggle = { 
                        val newValue = !isDarkTheme
                        isDarkTheme = newValue
                        sharedPrefs.edit().putBoolean("is_dark_theme", newValue).apply()
                    }
                )
            }
        }
    }
}
