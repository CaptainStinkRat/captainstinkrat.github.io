---
title: "Silverbullet Push"
date: 2025-04-24T16:30:03+00:00
#weight: 1
# aliases: ["/first"]
tags: ["HomeLab", "coding"]
author: "Isaac"
# author: ["Me", "You"] # multiple authors
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false
description: "Silverbullet and Pipelines"
canonicalURL: "https://cyberwizardlabs.com/posts/silverbullet2"
disableHLJS: true # to disable highlightjs
disableShare: false
disableHLJS: false
hideSummary: false
searchHidden: true
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
ShowRssButtonInSectionTermList: true
UseHugoToc: true
cover:
    image: "<image path/url>" # image path/url
    alt: "<alt text>" # alt text
    caption: "<text>" # display caption under cover
    relative: false # when using page bundles set this to true
    hidden: true # only hide on current single page
editPost:
    URL: "https://github.com/captainstinkrat/captainstinkrat.github.io/content"
    Text: "Suggest Changes" # edit text
    appendFilePath: true # to append file path to Edit link
---


Hey everyone,

So recently I talked about the **Git** plug for *Silverbullet* and backing up my notes into **Github**. This has worked amazingly and I wanted to add the ability to make *draft* webpage that would be sent to my Hugo repository.

I wanted to be able to make notes and the *draft* on *Silverbullet* and push that to **Github** without it firing off a pipeline but, when added to a certain folder, it will fire off a pipeline to push to my remote repository.

To start, I opened the **actions** tab and went to create a custom workflow. I wanted to open push if the file was in a certain directory in my repository, so I started with

```
on:
  push:
    paths:
      ['drafts/*']
  workflow_dispatch:
```

This meant only files added to the **drafts** folder within my **Git: Sync** from *Silverbullet* would be pushed to my Hugo host **Github Repository**. The next part was to add the job

```
jobs:
  build:
    runs-on:ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run a Git push
```

With the job created, I could start with the commands that I wanted the Ubuntu runner to do. First, I had to define an **environment** variable to point to my *PAT*. Then I had to remove the original **.git** instance on the runner, **git init** a new one and **git pull** the remote repository of the Hugo host.

```
env:
            token : ${{ secrets.token}}
        run: |
          rm -rf .git
          git init
          git remote add origin https://$token@github.com/captainstinkrat/captainstinkrat.github.io.git 
          git config --global user.name "captainstinkrat"
          git config --global user.email "tatejonathan182@gmail.com"
          git checkout -b $GITHUB_RUN_ID
          git add drafts
          git commit -m "$GITHUB_RUN_ID"
          git pull --rebase=true origin main --allow-unrelated-histories
          git push --set-upstream https://$token@github.com/captainstinkrat/captainstinkrat.github.io.git $GITHUB_RUN_ID
```

With that done, I could test. I started with this very draft of this post within *Silverbullet* under no folder. I think renamed the file to include the **drafts** folder and last did my **Git: Sync** command to sync the file.

