---
title: "Pipeline Part 2"
date: 2025-04-16T11:15:03+00:00
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
description: "Pipeline Part 2"
canonicalURL: "https://cyberwizardlabs.com/posts/pipeline-part2"
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
This is a continuation of the last part in the Pipelines Series.

Now that I had my self-hosted runner ready to go and assigned to take workflows, I was ready to start with making my first pipeline.

Github is really good about providing necessary steps and files that are needed for certain task and this is no different.

After i went into actions, I was able to pick a .yaml template. I went ahead with the basic Simple Workflow yaml.

``````
...
Name: CI

On:
      Push:
          Branches: [ "main" ]
      Pull_request:
          Branches: [ "main" ]
....
``````

Essentially, the blank.yaml that was provided runs a "hello, world" script on an ubuntu-latest runner. Not bad.

One of the issues I mentioned before with developers and pushing to production is the fact that without proper workflows or chain of command, it can get hairy quickly.

To answer this concern, I decided to keep the 
````
On:
     Push:
         Branches: [ "main" ]
``````
As the start of the workflow. This would mean that I can make merges from different branches using 
`````
Git checkout -b "branchName;"
`````
And initiate the workflow with approving the Pull request into main. Sweet, I was very happy with this so far.

I went ahead and gutted everything else out of the .yaml besides a few parts.
`````
Runs on: self-hosted
`````
This was part of the self-hosted runner part that I mentioned before. 

The other piece that I kept was
``````
- uses: actions/checkout@v4
``````
And the naming of the build/jobs.

So I had the framework, now it was time to throw in the commands I needed to be ran on the self-hosted runner.

I decided on a multi-line script structure. I knew I wanted to build the container each time so I started with 
`````
Docker build
`````

Easy enough but, I needed to pass in some arguments. I haven't mentioned until now but, I have decided on running a Discord chat bot as the script that I was going to use for testing.

This worked for a couple reasons but, mainly it was good because it was something I could test externally with new commands post pipeline.

I will go in more detail next part as a separate section in itself but, I knew that for my script I was going to need to pass in an environment variable for the Discord secret API key. Knowing this the new command looked like this
```````
Run : |
  Docker build \
  --build-arg DISCORD_SECRET="${{ secrets.DISCORD_SECRET}}" \
-t discordapp .
```````
Nice, I was happy with this

>Side note: I'm not going to go in much detail about this but, a concept that took me a >little while to fully grasp was the fact that the runner has access to the repository >as if it were just a directory in the runner. That's why the build command for the >docker file doesn't mention any dockerfile that it's pointed to. That Dockerfile was >already constructed and in my repository
 
Now that I had the start of the file, there were a few pieces that I needed to work through for a docker repository and a container orchestration piece.

In this next part, I'll go over the repository for my docker images and the container orchestration/container image pusher that I settled on.
