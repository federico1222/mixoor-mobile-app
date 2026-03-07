const {
  withMainApplication,
  withDangerousMod,
} = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

const PACKAGE_NAME = "com.mixoor.app";
const PACKAGE_PATH = PACKAGE_NAME.replace(/\./g, "/");

const WALLET_DISCOVERY_MODULE = `package ${PACKAGE_NAME}

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
`;

const WALLET_DISCOVERY_PACKAGE = `package ${PACKAGE_NAME}

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class WalletDiscoveryPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> =
        listOf(WalletDiscoveryModule(reactContext))

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> =
        emptyList()
}
`;

function withWalletDiscoveryFiles(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const targetDir = path.join(
        projectRoot,
        "android",
        "app",
        "src",
        "main",
        "java",
        ...PACKAGE_PATH.split("/")
      );

      fs.mkdirSync(targetDir, { recursive: true });

      fs.writeFileSync(
        path.join(targetDir, "WalletDiscoveryModule.kt"),
        WALLET_DISCOVERY_MODULE
      );
      fs.writeFileSync(
        path.join(targetDir, "WalletDiscoveryPackage.kt"),
        WALLET_DISCOVERY_PACKAGE
      );

      return config;
    },
  ]);
}

function withWalletDiscoveryMainApplication(config) {
  return withMainApplication(config, (config) => {
    const contents = config.modResults.contents;

    // Add WalletDiscoveryPackage() to getPackages() if not already there
    if (!contents.includes("WalletDiscoveryPackage")) {
      config.modResults.contents = contents.replace(
        "PackageList(this).packages",
        "PackageList(this).packages.apply {\n              add(WalletDiscoveryPackage())\n            }"
      );
    }

    return config;
  });
}

function withWalletDiscovery(config) {
  config = withWalletDiscoveryFiles(config);
  config = withWalletDiscoveryMainApplication(config);
  return config;
}

module.exports = withWalletDiscovery;
