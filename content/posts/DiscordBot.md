---
title: "Discord Bot"
date: 2025-04-18T10:45:03+00:00
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
description: "Building a Discord bot"
canonicalURL: "https://cyberwizardlabs.com/posts/DiscordBot"
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

So today I wanted to start off a new set of posts revolved around coding. I was thinking about what kind of project I wanted to work on and I thought, I've already done the pipeline series that featured a Discord bot, why not that.

So to start on the bot, there were a few things I needed so I created a repo, git cloned it, and started on just that.

The first thing was to make a **requirements.txt** file. This would house all the dependencies that I needed for the script to run.

I created the requirements.txt and tossed in what I would need
```
requests
discord
python-dotenv
discord[commands]
bs4
OSRSBytes
wom.py
```

Now that I had that sorted, I could create the Python environment. The command for that inside VS Code is 

```
Python: Create environment...
```

I just followed the prompts and I had my environment created. One of the benefits of doiing it in that order, it allowed me to install the depencies inside the environment.

Okay, the ground work had been laid, it was time to start coding.

I wanted to start with a bare minimum import and then add as I went so just to get the bot to function, I went ahead and started my import list like this

```
import discord
from discord.ext import commands
import asyncio
```

The first thing we needed to set in the code is the **intents**. Essentially this was a base permission set that the bot has.

```
intents = discord.Intents.default()
intents.message_content = True
```

Next we need to initialize the bot and set the client to a variable we can call later.

```
bot = commands.Bot(command_prefix='!', intents=intents)
```

I went with the command prefix being **!** for this bot. You can choose most anything else special character wise but, I just stuck with that. 

Alright, now we could start adding commands. The first thing I wanted to have was an *on ready* event. This would just be feedback that the bot was ready to take commands. This would not be sent to the channel and only sent to the terminal.

```
@bot.event
async def on_ready():
    print(f'We have logged in as {bot.user.name}')
```

Alright good stuff. Now we will know when the bot is live and ready for commands. For a simple test, I wanted to go ahead and add a command to just display my avatar when i said hi.

````
@bot.command()
async def hi(ctx,member: discord.Member):
    await ctx.send(member.display_avatar)
````

Sweet, now it was time to test it out. Now, in order to get the bot to connect to the account for posting, I was going to need to create a Client Key. I knew I didn't want that to be hard-coded in the script and I knew this was going to end up being a Docker container, I went with a .env file.

I went ahead and added **from dotenv import load_dotenv** into my import list at the top. Next I went to the Discord [developer]('https://discord.com/developers') and went to create an application.

I decided to name the bot **Wizard Bot** so no real reason and I went to Bot on the left hand side and clicked **Token**. I copied that key, created an .env file in my working directory, and slapped that in their with a variable set.

Next, I went back into the Python script and put **import os** in my import list as well as put

```
load_dotenv()
clientKey = os.getenv("VARIABLE")
bot.run(f'{clientKey}')
```

At that point, I was ready to test. I ran my script and ...
It worked!

![screenshot1](/images/screenshot1.jpg)

After a test, I was set on the bot working. For another test, I wanted to make a random Wizard quote happen when certain words were said.

I had to include **import random** into the import list and this had to add a few quotes that it could choose from.

```
quotes = ['The stars have alligned','Let us walk in the Wizard\'s path','✨✨']
quote = random.choice(quotes)
```

Now I wanted this to be said when certain words were typed so that meant a event not a command.

````
@bot.event()
async def on_message(message):
    if message.author == bot.user:
        return
    if message.content.startwith('Alacazam'):
        quotes = ['The stars have alligned','Let us walk in the Wizard\'s path','✨✨']
        quote = random.choice(quotes)
        await message.channel.send(quote)
````

Nice, after testing it worked well. Now, I had a good baseline. On future parts, I'll add to the bot as I go.