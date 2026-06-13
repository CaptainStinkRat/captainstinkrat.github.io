---
title: "Go REST API"
description: "Building a RESTful API in Go with proper project structure"
date: 2025-05-01
repo: "https://github.com/CaptainStinkrat/go-rest-api"
language: "Go"
status: "active"
featured: true
weight: 4
tags: ["Go", "REST", "API"]
---

A clean, production-style REST API built in Go, demonstrating proper project structure, middleware patterns, and database integration.

## Project Structure

```
├── main.go
├── handlers/
│   ├── health.go
│   └── items.go
├── models/
│   └── item.go
├── middleware/
│   ├── logging.go
│   └── auth.go
├── store/
│   └── postgres.go
└── go.mod
```

## Handler Pattern

```go
package handlers

import (
    "encoding/json"
    "net/http"
    "github.com/gorilla/mux"
)

type ItemHandler struct {
    store ItemStore
}

func (h *ItemHandler) Create(w http.ResponseWriter, r *http.Request) {
    var item Item
    if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    
    created, err := h.store.Create(r.Context(), &item)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(created)
}
```

## Git History

```git
commit a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6
Author: CaptainStinkRat
Date:   Thu May 1 2025

    feat: Add middleware chain with logging and auth
    
    Implements a composable middleware pattern:
    requestID → logging → rateLimit → auth → handler

commit b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7
Author: CaptainStinkRat
Date:   Sat Apr 19 2025

    feat: Initial project setup with CRUD endpoints
    
    Sets up gorilla/mux router, PostgreSQL store,
    and basic CRUD operations for the items resource.
```
