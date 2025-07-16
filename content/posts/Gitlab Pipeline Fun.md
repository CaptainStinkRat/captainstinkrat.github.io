---
title: "Git Pipeline Fun"
date: 2025-07-16T10:45:03+00:00
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
description: "Git Pipelines"
canonicalURL: "https://cyberwizardlabs.com/posts/gitpipelinefun"
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

It's been a while since my last post and there are several things to blame for that but, to keep it short, life has a way of ebbing and flowing with business.

I'm back though, and for my first post back, I wanted to talk a bit about what I have been tinkering with.

The first project I wanted to talk about was *Gitlab Pipelines*. I don't normally use Gitlab for much but, there are uses for it and I wanted to take a foray into some pipelines in Gitlab.

The first of these pipeline projects I tried tinkering with is *report generation*. Not overly fun but, necessary. 

For a bit of background, I have to have reports made for work and one of those is for vulnerability management. Doing this manually takes a bit of time so I wanted to create something to automate it for me.

*In steps Gitlab pipelines*. To start my report building process I needed to make an API call to the vulnerability manager we use.

I started with a Python script to do just that. I won't post the whole code but, essentially I could do an API call and parse that out to make a report for me.

```
response = requests.get(url, headers=headers)

jsonData = response.json()
critCount = 0
highCount = 0
....

for x in range (0,len(jsonData['vulnerabilities'])):
	if jsonData['vulnerabilities'][x]['severity'] == 4:
	critCount += 1
....
```

This could take a response JSON from the API call and parse out with the *for loop* to get the counts of vulnerabilities.

Next in the script, I crafted a data dictionary to those totals to a CSV file

```
data = [
	['Criticals','Highs','Mediums','Lows'],
	[f'{critCount}',f'{highCount}',f'{mediumCount}',f'{lowCount}']
]

with open ('results.csv','w',newline='') as file:
	writer = csv.writer(file)
	writer.writerows(data)
```

Nice, so after this was done, I would have a *results.csv* file with the totals that I wanted.

I knew that I could have my Gitlab pipeline run this script on the runner but, I needed it to push the file to the repository for me.

So the next part was to start the pipeline. I started with a default tag to pull the correct runner as well as set the image to be the correct image I wanted the runner to use.

```
default:
	tags:
	 - tag
	image: python:3.13-slim
```

Next was to setup the jobs to run. I wanted the pipeline to run one script that would pull initial information and another script to run if that file existed that would pull the deltas for the numbers.

For this, I wrote another Python script that would pull in the CSV for the known/old vulnerabilities and do a new API call. Then it would subtract the old and new to get the Deltas.

Next in the pipeline, I made an execution-job that ran only if the old file was present

```
execution-job:
	rules:
		- exists:
			- results.csv
```

This would only run the job if the results.csv file was present. Next I did a before_script job that would pull the requirements.txt, apt update, and apt install git on the runner

```
before_script:
	- pip install -r requirements.txt
	- apt update
	- apt install git -y
```

After this I ran the actual script. This would run the Python Delta Script, add the git config of my account, authenticate using an access token I created on Gitlab, and commit/push the created Delta Results file.

```
script:
	- python3 TenableDelta.py
	- git config user.email
	- git config user.name
	- git remote add $CI_JOB_ID $URL
	- git add .
	- git commit --allow-empty -m 'Results'
	- git push $CI_JOB_ID HEAD:main -o ci.skip
```

Great that worked and i was happy with that. In the case that I deleted the old numbers, I made a separate job that ran only if the file didn't exist that was the same job but, the initial API call script.

I set that to a Cronjob to run once a week and then I was set. 
