---
title: "Restful API and Go Learning"
date: 2025-07-18T10:45:03+00:00
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
description: "Restful API and Go Learning"
canonicalURL: "https://cyberwizardlabs.com/posts/restfulAPI"
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

So I wanted to learn a new language to add to my tool-belt and after long consideration, I decided on Golang. 

There were a few reasons for this but, the base reason is because I wanted to get into API developing and I thought Go would be good to learn. Go and Python have several similarities so it took a bit but, I followed guides and the training provided by Go and wanted to show a small project that I was able to do.

A lot of what I will go over is found is here [https://go.dev/doc/tutorial/web-service-gin] and I used this as a jump point for my code. 

For the first part, you will need to create the database structure you want to record the API keys. To do that, get MySQL installed (I used a docker compose inside a WSL instance for testing) and run the following MySQL query.

```
CREATE DATABASE apikey;
```

Next within MySQL, you will want to switch to that database you created.

```
use apikey;
```

Then, you want to create the table

```
CREATE TABLE apikey (
id INT AUTO_INCREMENT NULL,
apikey VARCHAR(255) NOT NULL,
secret VARCHAR(255) NOT NULL,
user VARCHAR(255) NOT NULL,
PRIMARY KEY (`id`)
);
```

To start the code for your Go program, I included all the imports I would need and made the package the main package:

```
package main

import (
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"fmt"
	"net/http"
	"os"
	"github.com/gin-gonic/gin"
	"github.com/go-sql-driver/mysql"                 
)
```

From there, I would need to set a global variable for the MySQL database pointer

```
var db *sql.DB
```

At this point, I knew I wanted to make an API key and save it to a database so I started with the code for the function of creating/generating the API key.

```
func generateAPIKey (length int) (string, error) {
	b := make([]byte, length)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b),nil
}
```

In the above snippet, we are generating an API key based off the length that is passed to the function. That is then returned out of the function.  From there, I wanted to create a function that would handle the API calls to create an API key. 

```
func apiGenHandler(c *gin.Context) {
	var err error
	name := c.Param("name")
	key, err := generateAPIKey(32)
	secret, err := generateAPIKey(64)
	if err != nil {
		fmt.Println("Error generating API Key: ", err)
		return
	}
	fmt.Println("Generated API Key: ",key)
	fmt.Println("Generated API Secret Key: ",secret)
	cfg := mysql.NewConfig()
	cfg.User = os.Getenv("DBUSER")
	cfg.Passwd = os.Getenv("DBPASS")
	cfg.Net = "tcp"
	cfg.Addr = "127.0.0.1:8083"
	cfg.DBName = "apikey"
	db, err = sql.Open("mysql",cfg.FormatDSN())
	fmt.Println("Connected")
	result, err := db.Exec("INSERT INTO apikey (apikey, secret,user) VALUES (?,?,?)", key, secret, name)
	c.JSON(http.StatusOK, map[string]string{
		"name":       name,
		"api_key":    key,
		"api_secret": secret 
	})
}
```

With the functions listed above, we are doing a few things. First we get the API's call parameter for the "name" attribute. We then set the variables *key* and *secret* to the return of the function for the API key generation. Next, we make a config for connecting to the MySQL database object we created earlier. In the config, we toss in the environment variables for DBUSER and DBPASS. From there, we take the key and secret we created previously and put it in the database.

Next I wanted to leverage the created API read from a database and "sign in" with it. The function for this is

```
func signin(c *gin.Context) {
	apiKey := c.GetHeader("X-API-Key")
	if apiKey == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "API Key not provided"})
		c.Abort()
		return
		}
	var nameString string
	err := db.QueryRow("SELECT user FROM apikey WHERE apikey = ?", apiKey).Scan(&storedAPIKey)
	if err != nil {
		if err == sql.ErrNoRows { // API key not found in the database
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid API Key"})
		} else { // Other database error
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		}
		c.Abort()
		return
	}
	c.Set("user", nameString)
	c.Next()

}
```

To get more into the code, we are pulling in the API key from the header of the API call. If no key is provided, it returns an error to the user. Next, we declare a variable to hold the stored user of the API call and set the type to string. We query the database with the provided API key. If no errors occur, it will be passed off to the next API folder that is protected. We also set the name of the user to the variable we declared earlier.

Now that we had those two functions declared, we could work in the main function of the call.

```
func main() {
	router := gin.Default()
	router.GET("/apiGen/:name, apiGenHandler)
	apiGroup := router.Group("/api")
	apiGroup.Use(signin)
	{
		apiGroup.GET("/data", func(c *gin.Context) {
			name, exists := c.Get("user)
			strName := name.(string)
			type ResponseDate struct {
				Message string `json:"message"`
				Status string `json:"status"`
			}
			data := ReponseData{
				Message: "Hello " +strName+ "!",
				Status: "Success",
			}
			if exists {
				c.JSON(http.StatusOK, data)
			})
		}
		router.Run("localhost:8085")
	}
}
```

With this main function, we are starting the Gin localhost http server. This includes the API generation call so that is declared with a GET request. We then set an API group to include the "secret" data. We do a GET request for the "secret" data and return back a message about auth success.

Once it's ran, you can curl *localhost:8085/apiGen/(name)* to generate a key. From there, you can take the key and curl *localhost:8085/api/data* with the key in the header under X-API-Key to access the "secret" data. 

And that is that. You should have a working restful API with database capabilities. Happy Going! :)
