---
title: "Member join on Discord"
date: 2025-04-19T14:45:03+00:00
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
async def on_member_join(member):
```

Next I needed the bot to pull the Channel ID for the *#general* chat. When I got that, all I needed to do 

```
channel = bot.get_channel(channel_ID)
```

I needed to pull the guild ID next and set it for the bot to retrieve

```
guild = bot.get_guild(GUILD_ID)
```

Great, now I added an exception for if the channel did not exist and after that, I wanted the script to open and read the GIF i wanted to play. Then I set that to a variable I could call with the File attribute.

```
if channel is not None:
        with open('summon.gif','rb') as f:
            picture = discord.File(f)
```

Noiw  the last part was to send the message and, with the role ID, set the role of the new member

```
await channel.send(f'Welcome to the server, {member.mention}!')
        await channel.send(file=picture)
        role = get(guild.roles,id=ROLE_ID)
        await member.add_roles(role)
```

And that was that. Now when a new member joined, a GIF would play, they would get a notification mention, and their role would be set.