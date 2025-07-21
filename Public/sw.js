self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "/icon-192.png",
    badge: "/icon-72.png"
    
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
