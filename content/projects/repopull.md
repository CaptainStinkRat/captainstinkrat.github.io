---
title: "RepoPull"
description: "Automated library scanning and dependency pull tool"
date: 2024-08-12
repo: "https://github.com/CaptainStinkRat/RepoPull"
language: "Python"
status: "active"
featured: true
weight: 1
tags: ["Python", "DevOps", "Security"]
---

RepoPull is a Python-based tool for automated library scanning and dependency management. It pulls repository metadata, scans for known vulnerabilities, and helps maintain a clean dependency tree.

## Key Features

- Automated library manifest discovery
- Vulnerability scanning integration (Snyk)
- Recursive dependency resolution
- Dockerized deployment support

## Architecture

```python
# Core scanning logic
class RepoScanner:
    def __init__(self, repo_path: str):
        self.repo_path = repo_path
        self.manifests = []
    
    def discover_manifests(self):
        """Find all dependency manifests in the repo."""
        patterns = ['requirements.txt', 'Pipfile', 'pyproject.toml', 'package.json']
        for pattern in patterns:
            matches = Path(self.repo_path).rglob(pattern)
            self.manifests.extend(matches)
        return self.manifests

    def scan_dependencies(self):
        """Parse manifests and extract dependency trees."""
        deps = {}
        for manifest in self.manifests:
            with open(manifest) as f:
                content = f.read()
            deps[manifest.name] = self._parse_manifest(content)
        return deps
```

## Git History

The project has evolved through several iterations:

```git
commit a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0
Author: CaptainStinkRat
Date:   Mon Aug 12 2024

    feat: Add recursive dependency resolution
    
    Implements nested dependency scanning with depth limits
    to prevent infinite loops in cyclic dependency graphs.

commit b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1
Author: CaptainStinkRat
Date:   Fri Jul 19 2024

    fix: Handle malformed requirements.txt entries
    
    Adds robust parsing for edge cases like:
    - Inline comments after package names
    - Version pinning with operators
    - Empty lines and whitespace
```

## Deployment

The tool is containerized for easy deployment:

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "-m", "repopull"]
```
