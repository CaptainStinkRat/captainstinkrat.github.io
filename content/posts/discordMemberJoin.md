---
title: "Member join on Discord"
date: 2025-04-19T10:45:03+00:00
# weight: 1
#aliases: ["/posts"]
tags: ["Coding"]
author: "Isaac"
# author: ["Me", "You"] # multiple authors
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false
description: "Discord bot when a member joins"
canonicalURL: "https://cyberwizardlabs.com/posts/memberJoin"
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

Hey guys,

So I wanted to have a few custom things happen when a member joined my guild on Discord.

First I wanted a custom Gif to play and I also wanted their role to be set to the *newb* role.

In order to do both of these, I needed the bot.event to be set on member join. Easy enough with

```
@bot.event
async def on_member_join():
```

Next I needed the bot to pull the Channel ID for the *#general* chat. When I got that, all I needed to do 