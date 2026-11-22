package com.hima.phonenumberhint

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.app.PendingIntent
import androidx.activity.result.ActivityResult
import androidx.activity.result.IntentSenderRequest
import androidx.activity.result.contract.ActivityResultContracts
import com.google.android.gms.auth.api.identity.GetPhoneNumberHintIntentRequest
import com.google.android.gms.auth.api.identity.Identity
import com.google.android.gms.common.api.ApiException
import expo.modules.kotlin.Promise
import expo.modules.kotlin.activityresult.AppContextActivityResultContract
import expo.modules.kotlin.activityresult.AppContextActivityResultLauncher
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class PhoneNumberHintModule : Module() {
  private var pendingPromise: Promise? = null
  private var pendingIntent: PendingIntent? = null
  private var activityResultLauncher: AppContextActivityResultLauncher<String, ActivityResult>? = null

  private val phoneHintContract = object : AppContextActivityResultContract<String, ActivityResult> {
    override fun createIntent(context: Context, input: String): Intent {
      val intentSender = pendingIntent?.intentSender
        ?: throw IllegalStateException("Phone number hint intent is unavailable.")
      val request = IntentSenderRequest.Builder(intentSender).build()
      return ActivityResultContracts.StartIntentSenderForResult().createIntent(context, request)
    }

    override fun parseResult(input: String, resultCode: Int, intent: Intent?) =
      ActivityResult(resultCode, intent)
  }

  override fun definition() = ModuleDefinition {
    Name("PhoneNumberHint")

    RegisterActivityContracts {
      activityResultLauncher = registerForActivityResult(phoneHintContract)
    }

    AsyncFunction("requestPhoneNumberHint") { promise: Promise ->
      val activity = appContext.currentActivity
      if (activity == null) {
        promise.reject("E_NO_ACTIVITY", "No active Android activity.", null)
        return@AsyncFunction
      }

      if (pendingPromise != null) {
        promise.reject("E_REQUEST_IN_PROGRESS", "A phone number hint request is already in progress.", null)
        return@AsyncFunction
      }

      pendingPromise = promise
      val request = GetPhoneNumberHintIntentRequest.builder().build()
      Identity.getSignInClient(activity)
        .getPhoneNumberHintIntent(request)
        .addOnSuccessListener { pendingIntent ->
          val launcher = activityResultLauncher
          if (launcher == null) {
            rejectPendingPromise(
              "E_LAUNCH_FAILED",
              "The phone number hint result handler is unavailable.",
              IllegalStateException("Phone number hint result handler is not registered.")
            )
            return@addOnSuccessListener
          }

          this@PhoneNumberHintModule.pendingIntent = pendingIntent
          try {
            launcher.launch(REQUEST_KEY) { result ->
              handleActivityResult(activity, result)
            }
          } catch (error: IllegalStateException) {
            this@PhoneNumberHintModule.pendingIntent = null
            rejectPendingPromise("E_LAUNCH_FAILED", "Unable to open the phone number hint.", error)
          }
        }
        .addOnFailureListener { error ->
          rejectPendingPromise("E_HINT_FAILED", "Unable to retrieve a phone number hint.", error)
        }
    }
  }

  private fun handleActivityResult(activity: Activity, result: ActivityResult) {
    val promise = pendingPromise ?: return
    pendingPromise = null
    pendingIntent = null

    if (result.resultCode == Activity.RESULT_CANCELED) {
      promise.resolve(null)
      return
    }

    val data = result.data
    if (result.resultCode != Activity.RESULT_OK || data == null) {
      promise.reject("E_HINT_RESULT", "The phone number hint returned no result.", null)
      return
    }

    try {
      promise.resolve(Identity.getSignInClient(activity).getPhoneNumberFromIntent(data))
    } catch (error: ApiException) {
      promise.reject("E_HINT_RESULT", "Unable to read the selected phone number.", error)
    }
  }

  private fun rejectPendingPromise(code: String, message: String, error: Exception) {
    val promise = pendingPromise ?: return
    pendingPromise = null
    pendingIntent = null
    promise.reject(code, message, error)
  }

  private companion object {
    const val REQUEST_KEY = "phone-number-hint"
  }
}
