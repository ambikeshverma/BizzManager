const webpush = require('web-push');
const keys = webpush.generateVAPIDKeys();
console.log(keys);


//  <script>
// if ('serviceWorker' in navigator && 'PushManager' in window) {
//   navigator.serviceWorker.register('/sw.js').then(async function (register) {
//     console.log('✅ Service Worker registered.');

//     const newVapidKey = "BH8Am4taHfPDONGhl8kh5cQ1AmNYRVL-D-aWiIMdMJbBWyg6IYTtsERyL4mToEIvOvwW60GwFl2ftcOFQVgqtYw";

//     const existingSubscription = await register.pushManager.getSubscription();

//     // If notifications are allowed
//     if (Notification.permission === "granted") {
//       if (!existingSubscription) {
//         console.log("ℹ️ No subscription found. Subscribing...");
//         await subscribeUser(register);
//       } else {
//         // Attempt to send a test request to verify it's not expired (optional)
//         console.log("🔁 Replacing old subscription...");
//         await existingSubscription.unsubscribe();
//         await subscribeUser(register);
//       }
//     } else if (Notification.permission === "default") {
//       const permission = await Notification.requestPermission();
//       if (permission === "granted") {
//         await subscribeUser(register);
//       } else {
//         console.log("❌ Notification permission denied.");
//       }
//     } else {
//       console.log("🚫 Permission previously denied.");
//     }

//     async function subscribeUser(register) {
//       try {
//         const subscription = await register.pushManager.subscribe({
//           userVisibleOnly: true,
//           applicationServerKey: urlBase64ToUint8Array(newVapidKey)
//         });

//         console.log("📦 New subscription:", subscription);

//         await fetch("/subscribe", {
//           method: "POST",
//           body: JSON.stringify(subscription),
//           headers: { "Content-Type": "application/json" }
//         });

//         console.log("✅ Subscription sent to backend");
//       } catch (err) {
//         console.error("❌ Subscription failed:", err);
//       }
//     }

//     function urlBase64ToUint8Array(base64String) {
//       const padding = '='.repeat((4 - base64String.length % 4) % 4);
//       const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
//       const rawData = window.atob(base64);
//       const outputArray = new Uint8Array(rawData.length);
//       for (let i = 0; i < rawData.length; ++i) {
//         outputArray[i] = rawData.charCodeAt(i);
//       }
//       return outputArray;
//     }
//   });
// }
//</script>