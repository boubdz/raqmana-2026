/**
 * OneSignal Web Push Notifier for Raqmana
 * Automatically broadcasts push notifications to all subscribers
 */

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID || "0a805f59-03b6-41cf-92d4-6f25db136459";
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

/**
 * Send a web push notification to all subscribers
 * @param {Object} options
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification body text
 * @param {string} options.url - Target URL when clicked
 * @param {string} [options.icon] - Optional custom icon URL
 */
export async function sendPushNotification({ title, message, url, icon = "https://www.raqmanadz.com/icon-192x192.png" }) {
  if (!ONESIGNAL_REST_API_KEY || !ONESIGNAL_APP_ID) {
    console.log("⚠️ [OneSignal] Missing App ID or API Key, skipping push.");
    return { success: false, reason: "Missing credentials" };
  }

  const payload = {
    app_id: ONESIGNAL_APP_ID,
    included_segments: ["All", "Subscribed Users"],
    headings: {
      ar: title,
      en: title,
    },
    contents: {
      ar: message,
      en: message,
    },
    url: url || "https://www.raqmanadz.com",
    chrome_web_icon: icon,
    chrome_web_badge: "https://www.raqmanadz.com/favicon-32x32.png",
    priority: 10, // High priority
  };

  try {
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (response.ok && !data.errors) {
      console.log(`🔔 [OneSignal] الإشعار أرسل بنجاح! Recipients: ${data.recipients || 0} (ID: ${data.id})`);
      return { success: true, data };
    } else {
      console.error("❌ [OneSignal] فشل إرسال الإشعار:", data.errors || data);
      return { success: false, errors: data.errors };
    }
  } catch (err) {
    console.error("❌ [OneSignal] خطأ اتصال أثناء إرسال الإشعار:", err.message);
    return { success: false, error: err.message };
  }
}
