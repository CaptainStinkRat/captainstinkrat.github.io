---
title: "Discord Community Bot"
description: "A Discord bot for member management and community engagement"
date: 2025-04-01
repo: "https://github.com/CaptainStinkRat/discord-bot"
language: "Python"
status: "active"
featured: true
weight: 2
tags: ["Python", "Discord", "Bot"]
---

A feature-rich Discord bot built for server management, member greeting, and community engagement. Handles everything from welcome messages to automated moderation.

## Key Features

- Custom member join/leave notifications
- Role-based access control
- Automated welcome messages with embed cards
- Moderation command suite

## Member Join Handler

```python
import discord
from discord.ext import commands

class MemberEvents(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
    
    @commands.Cog.listener()
    async def on_member_join(self, member):
        """Send a welcome message when a new member joins."""
        welcome_channel = discord.utils.get(
            member.guild.text_channels, 
            name="welcome"
        )
        
        embed = discord.Embed(
            title=f"Welcome to {member.guild.name}!",
            description=f"Hey {member.mention}, glad you're here!",
            color=0x00ff00
        )
        embed.set_thumbnail(url=member.display_avatar.url)
        embed.add_field(
            name="Server Rules",
            value="Check out #rules to get started",
            inline=False
        )
        embed.set_footer(text=f"Member #{len(member.guild.members)}")
        
        await welcome_channel.send(embed=embed)
```

## Git History

```git
commit c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2
Author: CaptainStinkRat
Date:   Tue Apr 1 2025

    feat: Add role-based welcome messages
    
    Different roles now get customized welcome embeds
    based on how they joined (invite link, discovery, etc.)

commit d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3
Author: CaptainStinkRat
Date:   Sat Mar 15 2025

    fix: Rate limit handling for welcome messages
    
    Implements exponential backoff when Discord API
    returns 429 Too Many Requests during mass joins.
```

## Running Locally

```bash
# Clone and setup
git clone https://github.com/CaptainStinkRat/discord-bot
cd discord-bot
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure
export DISCORD_TOKEN="your-bot-token"
export WELCOME_CHANNEL="welcome"

# Run
python bot.py
```
