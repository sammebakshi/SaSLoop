package com.example.sasloopmanager.data

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*
import java.util.concurrent.TimeUnit

const val BASE_URL = "https://sasloop.in/"

interface SaSLoopApi {
    // Auth
    @POST("api/auth/pos-login")
    suspend fun posLogin(@Body request: LoginRequest): Response<LoginResponse>

    @GET("api/auth/profile")
    suspend fun getProfile(): Response<UserProfile>

    // Dashboard
    @GET("api/analytics/dashboard-stats")
    suspend fun getDashboardStats(): Response<DashboardStats>

    // Orders
    @GET("api/orders")
    suspend fun getOrders(
        @Query("status") status: String? = null,
        @Query("page") page: Int? = 1,
        @Query("limit") limit: Int? = 50
    ): Response<List<Order>>

    @GET("api/orders/recent")
    suspend fun getRecentOrders(): Response<List<Order>>

    @PUT("api/orders/{id}/status")
    suspend fun updateOrderStatus(
        @Path("id") id: Int,
        @Body body: UpdateStatusRequest
    ): Response<ApiResponse>

    // Billing POS
    @GET("api/catalog")
    suspend fun getCatalog(): Response<List<MenuItem>>

    @GET("api/catalog/categories")
    suspend fun getCategories(): Response<List<CategoryItem>>

    @GET("api/pos/option-groups")
    suspend fun getOptionGroups(): Response<List<OptionGroup>>

    @POST("api/orders")
    suspend fun createOrder(@Body body: CreateOrderRequest): Response<Order>

    @GET("api/pos/tables")
    suspend fun getTables(): Response<List<TableItem>>

    @GET("api/pos/active-state")
    suspend fun getActiveState(): Response<ActiveStateResponse>

    @POST("api/pos/active-state")
    suspend fun saveActiveState(@Body body: SaveActiveStateRequest): Response<ApiResponse>

    @PUT("api/orders/{id}")
    suspend fun updateOrder(
        @Path("id") id: Int,
        @Body body: CreateOrderRequest
    ): Response<Order>

    @GET("api/crm/customers/{phone}/history")
    suspend fun getCustomerHistory(@Path("phone") phone: String): Response<CustomerHistoryResponse>

    @GET("api/crm/customers/search")
    suspend fun searchCustomers(@Query("query") query: String): Response<List<SearchedCustomer>>

    @POST("api/crm/customers/pay-due")
    suspend fun payDue(@Body body: PayDueRequest): Response<PayDueResponse>

    @POST("api/crm/customers")
    suspend fun saveCustomer(@Body body: SaveCustomerRequest): Response<SaveCustomerResponse>

    @GET("api/brand/users")
    suspend fun getStaff(): Response<List<StaffUser>>

    @GET("api/pos/qrs")
    suspend fun getQRs(): Response<List<QrCodeItem>>
}

// ─── Retrofit singleton with auth header ─────────────────────────────────────
object ApiClient {
    private var tokenProvider: (() -> String?)? = null
    var deviceId: String = ""

    fun setTokenProvider(provider: () -> String?) {
        tokenProvider = provider
    }

    fun initDeviceId(context: android.content.Context) {
        val prefs = context.getSharedPreferences("sasloop_prefs", android.content.Context.MODE_PRIVATE)
        var id = prefs.getString("device_id", null)
        if (id.isNullOrEmpty()) {
            id = "AND-" + java.util.UUID.randomUUID().toString()
            prefs.edit().putString("device_id", id).apply()
        }
        deviceId = id
    }

    private val okHttpClient by lazy {
        OkHttpClient.Builder()
            .connectTimeout(12, TimeUnit.SECONDS)
            .readTimeout(12, TimeUnit.SECONDS)
            .addInterceptor { chain ->
                val token = tokenProvider?.invoke()
                val originalRequest = chain.request()
                val newUrl = originalRequest.url.newBuilder()
                    .addQueryParameter("terminal", "POS_ANDROID")
                    .build()
                val request = originalRequest.newBuilder()
                    .url(newUrl)
                    .apply {
                        if (!token.isNullOrBlank()) {
                            addHeader("Authorization", "Bearer $token")
                        }
                        if (deviceId.isNotEmpty()) {
                            addHeader("X-Device-ID", deviceId)
                        }
                    }.build()
                chain.proceed(request)
            }
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            })
            .build()
    }

    val api: SaSLoopApi by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(SaSLoopApi::class.java)
    }
}
