---
title: "My first post"
date: 2025-04-15T11:30:03+00:00
weight: 1
# aliases: ["/first"]
tags: ["intro" ]
author: "Isaac"
# author: ["Me", "You"] # multiple authors
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false
description: "My first post"
canonicalURL: "https://cyberwizardlabs.com/posts/first-post"
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

I have a new site and for my first project that I'm documenting, I'm going to go over some of the Gitops stuffs I've been playing with.

As a start, I'm fairly new to the world of Gitops so I wanted to try my hand at a push-to-production pipeline that I can ad-hoc add commands from my IDE and see those changes instantly.

There are a few pieces that I knew would play a part:
1) Github Actions
2) something to code to see instant feedback
3) I knew I wanted it to be containerized so a container orchestrator
4) Container Repository
5) a method to pull in those container images when I made updates

After I knew what I needed it was time to start with each piece. I'm going to break up these posts into each of the pieces so for now, I will update you guys later.