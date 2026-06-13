(function() {
  const username = 'captainstinkrat';
  const container = document.getElementById('github-activity');
  if (!container) return;

  const apiUrl = `https://api.github.com/users/${username}/events/public?per_page=10`;

  fetch(apiUrl)
    .then(res => {
      if (!res.ok) throw new Error('GitHub API error');
      return res.json();
    })
    .then(events => {
      if (!events || events.length === 0) {
        container.innerHTML = '<p class="activity-empty">No recent public activity.</p>';
        return;
      }

      let html = '<div class="activity-list">';
      events.forEach(event => {
        const date = new Date(event.created_at);
        const dateStr = date.toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        });
        const repo = event.repo.name;
        const repoUrl = `https://github.com/${repo}`;

        let icon = '📝';
        let desc = '';

        switch (event.type) {
          case 'PushEvent':
            icon = '⬆️';
            const commits = event.payload.commits || [];
            const count = commits.length;
            const msg = commits[0] ? commits[0].message.split('\n')[0] : '';
            desc = `Pushed ${count} commit${count > 1 ? 's' : ''}`;
            if (msg) desc += `: "${msg}"`;
            break;
          case 'CreateEvent':
            icon = '✨';
            desc = `Created ${event.payload.ref_type}${event.payload.ref ? ' ' + event.payload.ref : ''}`;
            break;
          case 'IssuesEvent':
            icon = event.payload.action === 'opened' ? '❗' : '✅';
            desc = `${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} issue: ${event.payload.issue.title}`;
            break;
          case 'PullRequestEvent':
            icon = event.payload.action === 'opened' ? '🔀' : '✅';
            desc = `${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} PR: ${event.payload.pull_request.title}`;
            break;
          case 'ForkEvent':
            icon = '🍴';
            desc = `Forked ${event.payload.forkee.full_name}`;
            break;
          case 'WatchEvent':
            icon = '⭐';
            desc = 'Starred the repo';
            break;
          default:
            icon = '📌';
            desc = event.type.replace(/([A-Z])/g, ' $1').trim();
        }

        html += `
          <div class="activity-item">
            <span class="activity-icon">${icon}</span>
            <div class="activity-body">
              <a href="${repoUrl}" class="activity-repo" target="_blank" rel="noopener">${repo}</a>
              <span class="activity-desc">${desc}</span>
              <span class="activity-date">${dateStr}</span>
            </div>
          </div>
        `;
      });
      html += '</div>';
      container.innerHTML = html;
    })
    .catch(err => {
      container.innerHTML = `<p class="activity-error">Could not load GitHub activity. <a href="https://github.com/${username}" target="_blank" rel="noopener">View on GitHub →</a></p>`;
    });
})();
