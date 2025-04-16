---
title: "Pipeline Final"
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
description: "Pipeline Final"
canonicalURL: "https://cyberwizardlabs.com/posts/pipeline-final"
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
Now that I had the pipeline ready, it was time to decide what to test it with.

This was pretty easy to settle on, I already had an idea of what i wanted to make prior to creating the pipeline and that was a Discord bot.

I will go in detail later about the bot itself but, I had the ground work and I was ready to test. First, I opened up my VS Code and authenticated into my Github for easy cloning and pushing. 

After this I went to the top of my VS Code instances and typed into the command palette
````
>git clone
````
And selected the repository to clone. Now that I had the repository cloned, I made a Python environment inside this folder and, having pulled my requirements.txt from the repository, had all the libraries I needed installed.

Like I said earlier, I will go in more detail in a separate post specifically about the code but, in order to test the workflow, there were a few steps to follow.

After I made the changes I wanted to make to the bot, I would go into the terminal in my VS Code and type the command
````
Git checkout -b "branch-name"
````
At that point, I was in the branch name I included in the command and was ready to add the changes I made and add a commit. The commands I needed to run for these two actions were
````
Git add .
Git commit -m "message-here"
````
Finally, I was ready to push from the branch into main and make a pull request. The last command I needed to run was 
````
Git push origin "branch-name"
````

With that command, I had created a new branch off main, added my changes, committed them with a comment, and pushed that branch to the main branch. All I had to do from here is log into Github and check out the changes that I had made. When I was happy with the changes, that is when the magic started with the pipeline.

Like I had mentioned in my previous posts, my workflow would only trigger on pushes to main. Technically at this point, the changes I had made were only a pull request so it did not start the pipeline which was by design. When a pull request is merged from a branch into main, that is technically a push to main. So when I liked the changes, I would merge the request and it would kick off the pipeline.

The pipeline had a flow like this
````
Pipeline started -> takes the Dockerfile and builds a container -> the Dockerfile pulls the new script and runs it on boot -> Pipeline then would build the container -> push to my docker hub with the latest tag 
````
At that point, the Github portion was done and the container now sat on my Docker Hub repository that is set to public. Easy enough.

The next part of this workflow is taking that container by the latest tag and pointing my Portainer instance to bring up that container. When that was done, the Discord bot was ready and primed. 

Great! Now I had a way to push changes from my VS Code through a pipeline to create a container that was brought up by my container orchestrator. I was really happy with this workflow except there was one issue.

I had made the image a container pull on Portainer which meant on new container creation, I would need to re-create the container mainly so that it would pull that new image. Not overly annoying but, I wanted it to be automatic so there was one final piece to this puzzle.

Like I mentioned in my prior post, I was really happy to have the pipeline where it was. I was able to push code changes to production super fast. The only issue was having to re-create the container inside Portainer.

I racked my brain for a bit trying to think of a way to get this to auto-update on new image push and then I remembered something I had heard of before. Watchtower.

Watchtower is a lightweight container that sits and well watches your containers for updates. Not only was this just what I wanted, it was incredibly easy to setup. The commands to run were
````
docker run --detach \
    --name watchtower \
    --volume var/run/docker.sock:/var/run/docker.sock \
    containrrr/watchtower
````

This is great but, the only issue is that Watchtower by default looks for updates to images every 24 hours. I was making changes frequently so I need to adjust this a bit.

Another thing I knew about Watchtower was that it had a notification system built in. Again this did not setup by default so I knew there were some changes I had to make.

Per their documentation, Watchtower was able to send notification to several different methods, one of them being Discord. Bingo. All I had to do to add this capability was change an environment variable in the Docker run command
````
-e WATCHTOWER_NOTIFICATION_URL="discord://token@channel" \
-e WATCHTOWER_NOTIFICATION_TEMPLATE="{{range .}}{{.Time.Format \"2006-01-02 15:04:05\"}} ({{.Level}}): {{.Message}}{{println}}{{end}}" \
````

Now that answered the notification portion, there was still the fact that Watchtower wasn't updating right on new image creation. For this to work, I needed to change a setting to allow for API updates to Watchtower. To have that setting enabled I had to add
````
--http-api-update=1
````
as a command to the Docker run command and also add two environment variables
````
-e WATCHTOWER_HTTP_API_TOKEN='user-defined-token'
-p 8080:8080
````

With everything put together, I had a beast for a Docker run command 
````
docker run -d --name watchtower -v /var/run/docker.sock:/var/run/docker.sock 
-e WATCHTOWER_URL_NOTIFCATION="discord://token@channel" -e 
WATCHTOWER_NOTIFICATION_TEMPLATE="{{range .}}{{.Time.Format \"2006-01-02 15:04:05\"}} ({{.Level}}): {{.Message}}{{println}}{{end}}" -e WATCHTOWER_
HTTP_API_TOKEN='user-defined-token' -e WATCHTOWER_HTTP_API_UPDATE=1 -p 8080:8080 containrrr/watchtower --http-api-update=1 --include-restarting=1
````

Holy moly. Now I got that running and listening on port 8080, I needed a way to send an API call to that container to pull the latest image of the container with the script.

Back to the Github pipeline! I added 
````
curl -H "Authorization: Bearer user-defined-token" {{ secrets.RASPBERRY_PI_IP }}:8080/v1/update
````

I ran the pipeline again with some code changes and....
IT WORKED!

Watchtower pulled the latest image, restarted the container, and sent a notification to my #update text channel. I was elated. 

Now I could push code to production through my Github pipeline (and a few other pieces :P). 