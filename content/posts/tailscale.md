---
title: "Tail of scale, eye of newt..."
date: 2025-04-16T13:30:03+00:00
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
description: "Scratching the surface of Tailscale and it's mystical properties"
canonicalURL: "https://cyberwizardlabs.com/posts/tailscale"
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
So in my previous post, I talked a bit about Tailscale and the more I thought about it, the more I wanted to make a post talking more in-depth on what it is.

Now, I'm not a networking guy by any stretch of the imagination but, I do love computers and making them talk and that's where Tailscale has made my life way easier.

Essentially, Tailscale is a free service that allows you to connect devices as if they were on a LAN together. I'm making it a lot less complicated and there are so many moving pieces but, that's the gist of it.

The example I used before was having a few Raspberry Pi's that can talk to each other as well as any of my other devices within my Tailnet. Pretty cool if you ask me. 

It's been really nice to have because of the revamp in my self-hosted lab setup and not having to expose anything externally. It also means I can take my iPad or iPhone, use cellular data, and hit my self-hosted services from anywhere.

Let's take another topic I want to talk a bit about, Coder. I have a Coder server self-hosted on my Raspberry Pi and this allows me to Git pull, clone, push, and commit from anywhere. Coder includes a VS Code server component that means I can have my IDE right in my browser. With Tailscale, I just start up the server and hit it with my Tailscale IP.

How it works is like this: you have an account with Tailscale and each of your devices, you run a tailscale agent. You have your regular IP address of your NIC but, you get assigned a Tailscale IP as well. This IP is what you use to connect to different services.

In the case of my Github runner, I'm able to hit Github using my NIC and then with my Tailscale IP, I can hit all the resources/containers in my Tailnet. 

The best part: it's amazingly simple to get running. I'm going to use a virtual machine I have in Azure as a test bed for the commands to show how easy it is.

First, I will go ahead and use my SSH key pair to SSH into my virtual machine. Next, I'll login into Tailscale.com. If this is your first time, go ahead and make an account. 

Go ahead and click the 
````
Add Device
````
drop down box and select 
````
Client device
````

Now pick your flavor of OS. For this, I'm going with Linux because that's what I'm virtual machine in Azure is running on. Click
````
Copy command
````
and slap that bad boy in your command line and hit enter.

There you have it! It will install for you. Next all you have to do is type
````
sudo tailscale up
````
and wait a bit. Copy that link that gets posted and there you have it. You have your first device in your Tailnet!

Now there are a lot of tools that come with Tailscale. Tools like: magicDNS, sharing your tailnet with friends, access control lists, HTTPS certs for your magicDNS, and much more. 

Explore and get lost. Tailscale is amazing to have and makes connecting so easy.