package com.mixoor.app

import android.content.Context
import android.content.Intent
import android.net.Uri
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class WalletDiscoveryModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "WalletDiscovery"

    @ReactMethod
    fun getAvailableWallets(promise: Promise) {
        try {
            val intent = Intent(Intent.ACTION_VIEW).apply {
                data = Uri.parse("solana-wallet://")
                addCategory(Intent.CATEGORY_BROWSABLE)
            }
            val pm = reactApplicationContext.packageManager
            val resolveInfos = pm.queryIntentActivities(intent, 0)

            val wallets = Arguments.createArray()
            val seen = mutableSetOf<String>()

            for (info in resolveInfos) {
                val packageName = info.activityInfo.packageName
                if (seen.add(packageName)) {
                    val wallet = Arguments.createMap()
                    wallet.putString("packageName", packageName)
                    wallet.putString("appName", info.loadLabel(pm).toString())
                    wallets.pushMap(wallet)
                }
            }

            promise.resolve(wallets)
        } catch (e: Exception) {
            promise.reject("WALLET_DISCOVERY_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun setTargetWallet(packageName: String?) {
        reactApplicationContext
            .getSharedPreferences("wallet_target", Context.MODE_PRIVATE)
            .edit()
            .putString("target_package", packageName)
            .apply()
    }

    @ReactMethod
    fun clearTargetWallet() {
        reactApplicationContext
            .getSharedPreferences("wallet_target", Context.MODE_PRIVATE)
            .edit()
            .remove("target_package")
            .apply()
    }
}
