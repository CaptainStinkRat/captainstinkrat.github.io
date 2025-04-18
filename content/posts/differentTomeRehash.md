---
title: "Different Tome Provider Rehash featuring Tailscale"
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
description: "A rehash of the Silverbullet server"
canonicalURL: "https://cyberwizardlabs.com/posts/differentTomeRehash"
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

So I recently posted about self-hosting in an Azure VM a *Silverbullet* instance and it so far has worked wonders.

The only issue is that I know those free Azure credits are going to run out at some point plus I already have everything Tailscaled together in my Tailnet so why not this as well?

With Tailscale, I can do just that and there is even a function that will me hit it from anywhere outside my Tailnet as well.

I've talked about the installation for *Silverbullet* so I won't rehash that but, there is a difference now. Instead of a public IP address, I can use Tailscale Magic DNS to set a hostname and even get a cert.

All I had to do was head over to [Tailscale]('https://login.tailscale.com/') and under my device, click the **DNS** button.

This is the important bit, selecting a name. When you get your cert made, you are stuck with the name for your Tailnet. Mine is **Gorgon-catla** and I think that was a solid name so I've kept it.

Now that you have that, and made sure **MagicDNS** was turned on, you are ready to go ahead with Tailscale Funnel.

**Tailscale Funnel** is a command that allows you to serve a Tailscale IP address as if it was a public IP. It also auto applies your cert from your Tailnet. Win-Win. This way I could access my stuff on devices outside my Tailnet when I was out of the house and didn't have devices on my Tailnet.

The command to run for Tailscale Funnel is

```
Tailscale funnel ((port))
```

That will serve whatever service you have on that port out to the internet. Very cool.

I went ahead and wrote in my **~/.bashrc** that command to listen on the port the *Silverbullet* container was listening on and I was off to the races.

I went ahead and took down the funnel because I would only really need that when I wasn't at home and called it a day.

As an aside, I've been loving *Silverbullet*. There are just so many features that it's capable of doing and I've barely scratched the surface.

I've been theorycrafting about a way to get those pages out of Silverbullet and pushed to this blog and I think that might be a fun project to try.
