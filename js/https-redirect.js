(function () {
  var host = location.hostname;
  if (location.protocol !== 'http:') return;
  if (host !== 'unlockmxpro.com' && host !== 'www.unlockmxpro.com') return;
  location.replace('https://' + host + location.pathname + location.search + location.hash);
})();
