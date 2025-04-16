---
title: "Pipeline Part 3"
date: 2025-04-16T11:45:03+00:00
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
description: "Pipeline Part 3"
canonicalURL: "https://cyberwizardlabs.com/posts/pipeline-part3"
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

As I mentioned before in an earlier part, there was a specific tool that was on my self-hosted runner that plays an important role in this next few steps.

That being Tailscale.

I'm not going to go into great detail about what Tailscale is but, just know, it allows me to talk to all my devices inside my Tailnet without exposing anything externally.

Very nifty to have and makes connecting/hosting things really easy.

Like I mentioned, my github self-hosted runner has Tailscale on it as well as my container stack on a different Raspberry Pi I have at my house. This means that anything hosted on the main "server" Pi, as I will call it, can be interacted with by my self-hosted runner.

With that being said, let's talk a bit about Portainer.

Portainer is a container orchestration tool and is really handy for keeping containers up as well as pulling images to make those containers fairly quickly. The setup is pretty minimal, needing only a docker compose or a docker run command, and not necessarily needed but, nice to have is an agent installed on the stack as well.

To keep things fairly painless, I went ahead and ran the container using the docker run command. Before you run the docker run command, you will want to create a docker volume. I did this by running
````
docker volume create portainer_data
````
After that, it was as easy as running
````
docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:lts
````
After running that command, all you have to do is go to your Tailscale IP on another machine that is part of your Tailnet on port 8000

Once you have created your first admin account, you can take a look around inside Portainer. Portainer listens on your docker socket so you will most likely already have a local set of container stacks but, I always think it's good to go ahead and run the agent container as well.

If you are following along with this as a guide, you will want to go under the 
````
Environment-related
````
Tab on the left hand side and select
```
Environments
```

From there, go ahead and click the
```
add environment
```
button on the right hand side.

This will start a wizard for you. For this, we are going to go ahead and click Docker Standalone. What is given to you next is a set of docker run commands that will register an agent container for your stack. That docker run command is
```
docker run -d \
  -p 9001:9001 \
  --name portainer_agent \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /var/lib/docker/volumes:/var/lib/docker/volumes \
  -v /:/host \
  portainer/agent:2.27.3
```
Make note of the name that you choose (if you use the above command it will be portainer_agent) as well as the port (which will be 9001).

Go ahead and put that Name and Environment address (for this it was my tailscale IP and port 9001) and you should be good to go!

Go back to your Environments tab and click connect on that newly created Environment. Congratulations! You are portaining now.

After I had this going, I kind of just let it sit there. It's more important later when we get to creating containers but, for now, it's just hanging out.

In the next part, I'll go over the docker repository that I settled on for the containers coming out of the pipeline and soon, we will be on the way to actually getting to that workflow. Exciting stuff!