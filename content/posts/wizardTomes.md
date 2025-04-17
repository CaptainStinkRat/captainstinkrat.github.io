---
title: "Tomes of a Wizard"
date: 2025-04-16T20:30:03+00:00
#weight: 1
# aliases: ["/first"]
tags: ["HomeLab"]
author: "Isaac"
# author: ["Me", "You"] # multiple authors
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false
description: "Writing some magical tomes"
canonicalURL: "https://cyberwizardlabs.com/posts/wizardtomes"
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

So as I ramp up my use of this blog, I'm starting to find there might be a lot of value in doing some note taking on my journeys. Previously, I have taken notes sparingly but, now I feel it would be a good time to start.

On that note, I know there are a lot of chooses for note-taking applications out there but, I wanted a few key things out of the service I chose.

1) I wanted to be able to self-host it
2) I wanted to be able to use my cellphone with it
3) A sleek design would be nice
4) because I was starting to use markdown more, several ways of taking notes was preferred.

I did a bit of searching and I was able to land on a solution, [Standard Notes]('https://standardnotes.com/'). Looking into how I wanted to host this, I saw that they had a Docker installation. Perfect!

I fired up an Azure VM (thanks Microsoft for the free credits) and ssh'd into my public IP address.

I won't go into the steps for installing Docker but, [here]('https://docs.docker.com/engine/install/ubuntu/') is a link that might help.

One of the first things I wanted to do was install Caddy on this VM. That was easy enough with a

```
sudo apt-get install caddy
```

>note: If you are following along, make sure to run Caddy stop

Next I wrote my Caddyfile. I knew I was going to leverage my Cyberwizardlabs domain and having a reverse proxy in front would be good.

Here was my Caddyfile

```
notes.cyberwizardlabs {
      reverse_proxy http://localhost:3000
}
```

Now in following [along]('https://standardnotes.com/help/self-hosting/docker') with these instructions, I went ahead and created a directory, pulled the .env, and generated the keys.

Next was to pull in the LocalStack bootstrap script with

```
curl https://raw.githubusercontent.com/standardnotes/server/main/docker/localstack_bootstrap.sh > localstack_bootstrap.sh
chmod +x localstack_bootstrap.sh
```

Last of these steps, I pulled in the docker-compose.yaml with

```
curl https://raw.githubusercontent.com/standardnotes/server/main/docker-compose.example.yml > docker-compose.yml
```

More keys to generate for safe passwords and when that is all done

```
docker compose pull && docker compose up -d
```

Cool, now that was up, it was time to go into Porkbun's DNS and add an entry. The entry was

```
A **x.x.x.x** notes.cyberwizardlabs.com
```

Now I had the containers up, the address set, last thing I needed was to run the Caddy service.

Before I could do that, I had one last step to add to my Azure VM. Azure VM's have wonky permission sets so I run

```
sudo setcap CAP_NET_BIND_SERVICE=+eip $(which caddy)
```

After that, it's just a 

```
caddy run
```

Cool, we had the server started! [Here]('https://app.standardnotes.com/') I made a free account. After I downloaded the App, I turned on the the custom server under Advanced options and put in *notes.cyberwizardlabs.com*

I was off to the races, I downloaded the app on my phone, did the same thing and now I had a self-hosted note-taking app. Awesome!