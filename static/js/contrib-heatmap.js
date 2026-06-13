(function() {
  var username = 'captainstinkrat';
  var container = document.getElementById('contrib-heatmap');
  if (!container) return;

  var loading = document.getElementById('contrib-loading');
  var chartUrl = 'https://ghchart.rshah.org/' + username;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', chartUrl, true);
  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
      if (loading) loading.style.display = 'none';
      var wrapper = document.createElement('div');
      wrapper.innerHTML = xhr.responseText;
      var svg = wrapper.querySelector('svg');
      if (svg) {
        svg.style.maxWidth = '100%';
        svg.style.height = 'auto';
        svg.style.borderRadius = '6px';
        container.appendChild(svg);
      }
    } else {
      if (loading) loading.textContent = 'Could not load contribution graph.';
    }
  };
  xhr.onerror = function() {
    if (loading) loading.textContent = 'Could not load contribution graph.';
  };
  xhr.send();
})();
