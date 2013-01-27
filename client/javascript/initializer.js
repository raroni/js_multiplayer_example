(function() {
  function initialize() {
    var client = new Client(window.document);
    client.start();
  }
  window.addEventListener('load', initialize);
})();
