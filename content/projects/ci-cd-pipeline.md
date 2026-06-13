---
title: "Self-Hosted CI/CD Pipeline"
description: "End-to-end CI/CD with self-hosted GitHub Actions runners on Raspberry Pi"
date: 2025-04-16
repo: "https://github.com/CaptainStinkRat/captainstinkrat.github.io"
language: "YAML"
status: "active"
featured: true
weight: 3
tags: ["DevOps", "CI/CD", "GitHub Actions", "Raspberry Pi"]
---

A fully self-hosted CI/CD pipeline using GitHub Actions with a Raspberry Pi runner, orchestrating automated builds, tests, and deployments across multiple environments.

## Architecture

The pipeline uses a self-hosted GitHub Actions runner deployed on a Raspberry Pi connected via Tailscale, enabling secure builds without exposing ports.

```yaml
# .github/workflows/main.yml
name: Deploy Pipeline
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4
      
      - name: Build
        run: |
          docker build -t myapp:${{ github.sha }} .
      
      - name: Test
        run: |
          docker run myapp:${{ github.sha }} pytest
      
      - name: Deploy
        run: |
          docker tag myapp:${{ github.sha }} myapp:latest
          docker-compose up -d
```

## Runner Setup

```bash
# On the Raspberry Pi:
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.323.0/actions-runner-linux-x64-2.323.0.tar.gz

# Configure
./config.sh --url https://github.com/CaptainStinkRat/myapp --token $TOKEN

# Start
./run.sh
```

## Git History

```git
commit e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4
Author: CaptainStinkRat
Date:   Wed Apr 16 2025

    feat: Add multi-stage deployment pipeline
    
    Implements dev → staging → production promotion
    with automated testing gates at each stage.

commit f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5
Author: CaptainStinkRat
Date:   Sun Mar 30 2025

    fix: Pipeline timeout handling
    
    Increases job timeout for slow Raspberry Pi builds
    and adds retry logic for flaky network tests.
```

## Pipeline Flow

1. **Push** to `main` triggers the workflow
2. **Build** step compiles the application
3. **Test** runs the full test suite
4. **Deploy** promotes to production if tests pass
5. **Notify** sends status to Discord
