// Unregister all service workers to prevent ServicePortal SW from interfering with LinguaFlow
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(reg => reg.unregister());
  });
}
