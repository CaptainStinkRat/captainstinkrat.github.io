---
title: "Scraping the Web"
date: 2025-04-22T09:45:03+00:00
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
description: "Web Scraper Build"
canonicalURL: "https://cyberwizardlabs.com/posts/webscraper"
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

Hey everyone, 

So I was thinking of things to code, and recently I've been intreseted in Web Scraping. There is a lot that can be done with a web scraper but, I wanted to match something in my career.

That's why I made a CVE database web scraping, that way I could expedidate my Software Reviews.

Just like most projects, I started with a requirements.txt file in a directory. The libraries I used for this are 

```
requests
```

and a few other native libaries that we didn't need to add to the requirements.txt.

I decided early on I wanted to do a CLI tool so to start, I went ahead and added

```
import argparse
```

to my import list. Then I made a parser object using

````
parser = argparse.ArgumentParser()
````

Now I needed to add the arguments. I knew I was going to need the vendor name, product name, and the version number. I added those with

```
parser.add_argument("-v" ,"--vendor" , help='Insert the vendor of the product')
parser.add_argument("-p" ,"--product",help='The product to look up')
parser.add_argument("-vs" ,"--version", help='Version of the product')
```

and initialized it with

```
args = parse.parse_args
```

Alright, now I had the CLI portion done for the most part, now it was time to an Bearer Authorization method to our header for the request to the URL we were going to use later

```
def requestsBearer(url,token):
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(url,headers=headers)
    return response
```

Now, the arguments that are sent to the command line for the script are stored under the long name of the argument. That meant, I could pull the argument string that was entered by the user and set them to variables

```
vendor = args.vendor
product = args.product
version = args.version
```

Now for the URL, I was going to use CVEDetails API to leverage for this script so I created an API token on [cvedetails.com]('https://cvedetails.com') and took the URL and broke up the parts that would come from the arguments

```
url = f'https://www.cvedetails.com/api/v1/vulnerability/list-by-vpv?vendorName={vendor}&productType=application&productName={product}&versionString={version}&outputFormat=json&pageNumber=1&resultsPerPage=20'
api = ApiKey
```

it was time to get a response from the URL and save that response to a variable. I did that with

```
response = requestsBearer(url,api)
r = response.json()
```

I had the response now as a JSON so I could do key-value pair matching for the variables I was going to look for. I set the different findings critilality to a base 0 and made a for loop to add the key values as a print. Then I took another set of criteria to set the finding levels. That came out like this 

```
numberOfVulnerabilites = 0
lowFindings = 0
mediumFindings = 0
highFindings = 0
if r['results'] is not None:
    inputParameters = r['results']
    for inputParameters in inputParameters:
        progressBar()
        print(inputParameters['cveNumber']+': '+inputParameters['summary'])
        print('____________________________________________________________')
        numberOfVulnerabilites += 1
        if float(inputParameters['maxCvssBaseScore']) < 5.0:
            lowFindings += 1
        elif 7.5 > float(inputParameters['maxCvssBaseScore']) >= 5.0:
            mediumFindings += 1
        elif float(inputParameters['maxCvssBaseScore']) >= 7.5:
            highFindings += 1
```

With that, I just needed one last statement for printing out the last of vulnerability costs and i was set.

```
   print(f'Number of vulnerabilities: {numberOfVulnerabilites}')
    print('=================================================================')
    print(f'lows: {lowFindings}, medium: {mediumFindings}, high: {highFindings}')
```

Fantastic. To run the script, I just saved the script, opened a Powershell, changed to the directory with the script, and typed **python3 webScrapper.py -v adobe -p acrobat -vs {versionNumber}. It worked and I was able to pull vulnerability information for specific products and version numbers.