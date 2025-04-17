---
title: "Different Tome Provider"
date: 2025-04-17T11:45:03+00:00
# weight: 1
#aliases: ["/posts"]
tags: ["HomeLab"]
author: "Isaac"
# author: ["Me", "You"] # multiple authors
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false
description: "Different tomes for different problems"
canonicalURL: "https://cyberwizardlabs.com/posts/differentTome"
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

So in a previous post, I talked about a note-taking server called **Standard Notes** and I have played with it a bit.

There are some really good things about the server but, I wanted something else. Through the large amount of note-taking spaces, I had heard of one previously that I thought I might try my hand at.

That note-taking service is called **Silverbullet**. Now there is a lot that can be said about **Silverbullet** but, for everything that it has, it’s no incredibly simple to setup.

To setup, you will need:

- Docker installed
- for serving up out of the VM in the instance, reverse proxy
- A little bit of time

When you have all three, we can get started.

First thing you will need to do is run

```
mkdir -p space
```

After that, just run 

```bash
docker run -d --restart unless-stopped --name silverbullet -p 3000:3000 -v ./space:/space ghcr.io/silverbulletmd/silverbullet:v2
```

Fantastic, you now have a **Silverbullet** instances listening on port 3000. Next, we want to go ahead and create our reverse proxy. For this example, we are going to leverage Caddy.

Just open your favorite word editor and save the below as Caddyfile (no need for any file extension)

```
your.url {
    reverse_proxy http://localhost:3000
}
```

Now just run a

```bash
caddy start
```

Cool, the last step is to go into your DNS record and set an A record to put to that public IP address.

> **_NOTE:_** This would be an awesome app to run with Tailscale. Maybe even leverage Tailscale funnel

Now, just point your browser to that URL that you set up to resolve that public IP address and you’re set.

So just what can **Silverbullet** do? Well, all of this was written in **Silverbullet** so that’s a start.

There are a lot of features to explore with this so I’m going to take some time to look through those features but, I just wanted a quick post about setting this tool up.