package com.example.sasloopmanager

import android.app.Application
import coil.ImageLoader
import coil.ImageLoaderFactory

/**
 * Custom Application class that configures Coil's global ImageLoader.
 *
 * By implementing ImageLoaderFactory we guarantee that every AsyncImage
 * (and any code that calls ImageLoader.Builder(context)) automatically
 * inherits these settings — no need for a per‑composable custom loader.
 *
 * Key settings:
 *  • networkObserverEnabled(false)  – the device connects to the backend
 *    via ADB reverse‑port‑forwarding (127.0.0.1:5000).  Android's
 *    ConnectivityManager does NOT see loopback traffic as a network, so
 *    Coil's default NetworkObserver marks the app "offline" and injects
 *    an only‑if‑cached header, causing HTTP 504 on every image request.
 *  • respectCacheHeaders(false)     – the Express backend serves uploads
 *    with `cache-control: public, max-age=0`, which would cause Coil to
 *    treat every cached asset as stale and re‑fetch.
 */
class SaSLoopApplication : Application(), ImageLoaderFactory {
    override fun onCreate() {
        super.onCreate()
        com.example.sasloopmanager.data.ApiClient.initDeviceId(this)
    }

    override fun newImageLoader(): ImageLoader {
        return ImageLoader.Builder(this)
            .networkObserverEnabled(false)
            .respectCacheHeaders(false)
            .crossfade(true)
            .build()
    }
}
