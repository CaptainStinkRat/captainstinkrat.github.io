(function() {
  const username = 'captainstinkrat';
  const container = document.getElementById('contrib-heatmap');
  if (!container) return;

  const chartUrl = 'https://ghchart.rshah.org/' + username;

  fetch(chartUrl)
    .then(function(res) {
      if (!res.ok) throw new Error('Failed to load chart');
      return res.text();
    })
    .then(function(svgText) {
      container.innerHTML = svgText;
      var svg = container.querySelector('svg');
      if (!svg) {
        container.innerHTML = '<p class="activity-empty">No contribution data available.</p>';
        return;
      }

      svg.removeAttribute('width');
      svg.removeAttribute('height');
      svg.style.width = '100%';
      svg.style.height = 'auto';
      svg.style.maxWidth = '720px';
      svg.style.display = 'block';
      svg.style.margin = '0 auto';

      var rects = svg.querySelectorAll('rect[fill]');
      var count = rects.length;
      rects.forEach(function(rect, i) {
        rect.style.transition = 'fill 0.3s ease';
        rect.style.animation = 'heatWave 0.8s ease-out ' + (i * 6) + 'ms both';
      });

      var anim = document.createElement('style');
      anim.textContent = '@keyframes heatWave { from { opacity: 0; transform: scaleY(0); } to { opacity: 1; transform: scaleY(1); } }';
      container.appendChild(anim);
    })
    .catch(function() {
      container.innerHTML = '<p class="activity-error">Could not load contribution graph. <a href="https://github.com/' + username + '" target="_blank" rel="noopener">View on GitHub →</a></p>';
    });
})();
