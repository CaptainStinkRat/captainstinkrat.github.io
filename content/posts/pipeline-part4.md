---
title: "Pipeline Part 4"
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
description: "Pipeline Part 4"
canonicalURL: "https://cyberwizardlabs.com/posts/pipeline-part4"
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
Now that I had Portainer up and my runner primed, I was ready to get started with what container repository I wanted to use.

There are several out there and admittedly, I feel like I should have gone with Harbor but, I ended up using Docker Hub.

The main reason for this was because I had an account already and used it in my Gitlab pipeline creation (might re-visit this journey later). All I had to do is login and create my public repository. Not bad at all.

There were a few commands that are really useful to have and necessary to build the containers.

The first being 
````
Docker login --username "username" --password "password"
````
Luckily, with Github secrets, I could pass both arguments to the docker login command without hardcoding any of my credentials. Very nice.

The next command was 
````
Docker tag "name-of-container" "docker-username"/"name-of-repo":"tag"
````
This step was for tagging the container image with a tag and name as well as setting a repository destination.

Now that I had the image named, logged in, and tagged, I was ready to push the container. Easily enough the command
````
Docker push "docker-username"/"container-name":"tag"
````
Did the trick.

At this point, the container would be pushed and ready to get pulled down from my Portainer. I went ahead and slapped that in my run script in my yaml for my pipeline as part of the steps to push the container.

Now I had the pipeline essentially ready to go, the next part I'll go over my Dockerfile because that's where the script gets put into the container and automagically ran. 

Now that I had the framework of the pipeline made (which I will go over with details later), I was ready to get started. Except there was one thing that I mentioned earlier that I never showed.

That would be my Dockerfile! Inside my repository where my Github pipeline sits, there is a Dockerfile that is the baseline for the containers I was going to be building and pushing.

This Dockerfile had a few steps in it that were necessary for the build to work. 

The first piece was the image that I pulled. I needed an image that would have a Python baseline for the script to be ran in. 

I started with Dockerfile with
````
FROM python:3
````
This is the image that Python recommends using for running Python scripts on boot.

The next few pieces were again, recommended by Python for running an application within a container. Those pieces were
````
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
````

Essentially this would change the working directory, copy in the requirements.txt from the same working repository, and pip install all the packages needed for the build to run.

The next part was copying in the script to run on container start. Since all of this was being ran on my Github runner, I could reference the script directly from the repository the same way I did with the requirements.txt. I added
````
COPY discordBot.py ./
````
To the Dockerfile and it was looking good to go now. The last piece, and again this was recommended from the Python Docker application running commands, was to have a command prompt run on boot that would run the script.

To do this step, I added
````
CMD [ "python", "./discordBot.py" ]
````
to the end of the Dockerfile and I was ready to go.

There was one final piece that I needed to add and that was copying in an .env file for passing in my Discord bot token to the script. I did that with
````
COPY .ENV ./
````
I also included this same .env file in my .gitignore so that on pulls, it would not be pulled and it could just be used in the container building and script running.

The end result for the Dockerfile looked like this
````
FROM python:3

WORKDIR /usr/src/app
COPY .env ./
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY discordBot.py ./

CMD [ "python", "./discordBot.py" ]
````