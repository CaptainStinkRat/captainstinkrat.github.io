---
title: "Pipeline Part 1"
date: 2025-04-16T09:45:03+00:00
# weight: 1
aliases: ["/posts"]
tags: ["HomeLab"]
author: "Isaac"
# author: ["Me", "You"] # multiple authors
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false
description: "Part 1 of my pipeline series"
canonicalURL: "https://cyberwizardlabs.com/posts/pipeline-part1"
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
As discussed in my first post, I initially wanted to lay out a plan for a pipeline in Github that would automagically push changes to a development environment as I coded.

The first problem with this is: developers (myself included) are trigger happy. They love to push changes because I mean why not.

The second problem I had was that I wanted the app to run continuously.

Keeping these two things in mind, I hopped over to Github and started learning about pipelines. Now I have messed a bit with Gitlab pipelines so I had a general idea of what to expect.

I logged into my happy little Github and clicked the 
````
Actions
````
button. 
Easy Peasy except I wanted to be self-hosted on everything thing I could so, that meant there would be some steps prior to jumping right in.

I had a Raspberry Pi sitting around so I decided "Hey, why not image this little guy, slap a tailscale node on it, and set it up as a runner"

So I did just that.

Luckily, Github has amazing documentation and getting that all sorted meant just running a few commands.

The first command (per the Github action documentation) is
```
mkdir actions-runner && cd actions-runner
```
Not bad, next the documentation gives this command
````
curl -o actions-runner-linux-x64-2.323.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.323.0/actions-runner-linux-x64-2.323.0.tar.gz
`````
Again not bad at all, next the command that's given is to validate the hash
`````
echo "0dbc9bf5a58620fc52cb6cc0448abcca964a8d74b5f39773b7afcad9ab691e19  actions-runner-linux-x64-2.323.0.tar.gz" | shasum -a 256 -c
`````
 
Last in this downloading series of commands, you want to extract the installer using
`````
tar xzf ./actions-runner-linux-x64-2.323.0.tar.gz
`````

Not bad at all! 

Cool, so now we have the installer installed on the runner, we will want to configure it.

The two commands for this are
`````
./config.sh --url https://github.com/githubName/githubRepo --token **string**
`````
`````
./run.sh
`````

And there you have it! You have a self-hosted runner! Congratulations!
To use this bad boy, we will add the following
`````
runs-on: self-hosted
`````
to our yaml when we are creating actions.

At this point, I felt pretty good. I have a tailscaled self-hosted runner on a Raspberry Pi and attached it to my Github actions.

What was next took a while to unpack...