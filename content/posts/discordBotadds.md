---
title: "Adding to the Discord bot"
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
description: "Discord bot add"
canonicalURL: "https://cyberwizardlabs.com/posts/addingdiscordbot"
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

So I've been tinkering a bit with my Discord bot and recently got a request to add functionality to know how long someone has been in the Discord and associating it with a rank. Not too bad of an ask.

I opened by Discord bot script I had been working on and got to work. The first thing I needed to add was a bot.command section to listen for a chat call out with the command_prefix.

We set the command_prefix in the previous part so I won't rehash that but, to add that functionality, I just added

```
@bot.command()
async def joined(ctx):
```

Now that I had that started, I could add the parameters I needed for the script. I wanted to take multiple arguments for member name so I need to account for that as well as accounting for passing through the member name. I did that by adding

```
async def joined(ctx,*,member: discord.Member)
```

Now the command could take multiple arguments, very nice. 

I knew that there was going to be a time element to the script so I added **from datetime import datetime, timezone** to the top of the script. 

It was time to get into the *time* part of the script. First I needed to take the current time (setting the timezone to UTC) as well as the time that the member joined. I did that with

```
currentTime = datetime.now(timezone.utc)
timeLapsed = member.joined_at
```

Nice and simple. Now I needed to get the time that had been earned by the member. I did that with 

```
timeEarned = currentTime - timeLapsed
```

Now, if I had printed out this string for *datetime*, it would be in a particular format and I wanted it to be in days, hours, minutes. To do that, all I did was

```
days = timeEarned.days
seconds = timeEarned.seconds
hours = seconds // 3600
minutes = (seconds % 3600) // 60
remaining_seconds = seconds % 60
```

Alright now that that was sorted, I could send that as a reply with

```
await ctx.send(f'{member} joined on {member.joined_at} which is {days} days {hours} hours {minutes} minutes ago.')
```

Now I wanted to set ranks by day brackets. I started with days

First, I created a role that everyone started with named *newb*. I took that ID from the Server settings and set that as the CurrentRole

```
CurrentRole = get(message.guild.roles,id=ROLE_ID)
```

>note: for this to work, I had to include **from discord.utils import get** to the import list

Next, I set a parameter for days less than 5, it would change your rank to *tester*. I would have to remove the old role, get the new role ID, and add that to the member. Then I posted a message about what role the person was

```
if days < 5:
    role = get(message.guild.roles,id=1363178475305042051)
    await member.remove_roles(CurrentRole)
    await member.add_roles(role)
    await message.channel.send(f'{message.author} joined on {member,joined_at}      
        which is {days} days {hours} hours {minutes} minutes ago.')
    await message.channel.send(f'That\'s the {role} role')
```

and that was that. When members would type "join time", their rank would be set to their joined time on the server.
