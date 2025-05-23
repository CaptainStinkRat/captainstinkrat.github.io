---
title: "Silverbullet and Git"
date: 2025-04-22T20:30:03+00:00
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
description: "Silverbullet and Git"
canonicalURL: "https://cyberwizardlabs.com/posts/silverbullet"
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

In a previous post, I talked a bit about a note-taking application called *Silverbullet*. Like I mentioned in that post, I have playing with it a bit and have found some use cases for it that I wanted to share.

With v2 of *Silverbullet*, the **CONFIG** settings are a bit different so spawned this post. Some of the previous documentation for the **plugs** have incomplete or old information so I wanted to provide both an update on my *Silverbullet* use and small guide on getting the **Git** plug to work.

Like I mentioned, the **CONFIG** page that is used for *Silverbullet* is now a bit different in that all settings go in there.

To get the **Git** plug installed there are a few things that you need to do. First you need to add this to the **plugs** section in the config.set

```
config.set {
  plugs = {
    "github:silverbulletmd/silverbullet-git/git.plug.js"
  }
}
```

Now notice, this is the same URL from the [original](‘https://github.com/silverbulletmd/silverbullet-git’) instructions, it is just formatted differently.

The next change is adding the **Git** config changes you want within the same _**Space-Lua**_ config

```
git = {
  autoSync = true
}
```

Now that you have that added, syncing can occur to your Git repository from *Silverbullet*. I got a tip from a friend about adding a command to force the **Git Sync** and I’m a huge fan of this. To add a command shortcut to **Git Sync**, 

```
shortcuts = {
  {
    command = 'Git: Sync',
    key = "Ctrl-Alt-."
    }
}
```

Now with that, this is our final configuration in the _**space-lua**_ block in the **CONFIG** page

```
config.set {
  plugs = {
    -- Add your plugs here (https://silverbullet.md/Plugs)
    "github:silverbulletmd/silverbullet-git/git.plug.js"
  },
  git = {
    autoSync = true
  },
  shortcuts = {
    {
      command = 'Git: Sync',
      key = "Ctrl-Alt-."
    }
  }
}
```

Once, you have that, just open your command palette and click **Plugs: Update** and for good measure, **System: reload**.

Now, that should take care of the *Silverbullet* side, there are some things you will need to do on the actual container side.

To start, go ahead and get a shell inside the hosting container

```
docker exec -it silverbullet /bin/bash
```

Now change in the **/space** directory and **Git init** inside there. 

```
cd /space
git init
```

Now you will want to configure your user name and email for **Git** and set the **pull.rebase** to *false*

```
git config user.name "username"
git config user.email "email"
git config pull.rebase false
```

After that we are going to add the **remote** branch with your *personal access token* from **Github**. Then, we will add the branch *main*, add all files ending in the extension for markdown, commit, and push to *main*.

```
git remote add origin https://PAT@github.com/user/repo
git branch -m main
git add *.md
git commit -m “Initial commit”
git push origin main
```

Now that you have done that, you need to do one last command inside this container and that is

```
git push --set-upstream origin main
```

After that, you should be setup to **Git: Sync** within *Silverbullet*.