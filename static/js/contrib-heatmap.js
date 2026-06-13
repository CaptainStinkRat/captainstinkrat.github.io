(function() {
  var username = 'captainstinkrat';
  var container = document.getElementById('contrib-heatmap');
  if (!container) return;

  var loading = document.getElementById('contrib-loading');
  var chartUrl = 'https://ghchart.rshah.org/' + username;

  var img = new Image();
  img.onload = function() {
    if (loading) loading.style.display = 'none';
    img.classList.add('contrib-img-loaded');
    container.appendChild(img);
  };
  img.onerror = function() {
    if (loading) loading.textContent = 'Could not load contribution graph.';
  };
  img.src = chartUrl;
})();
