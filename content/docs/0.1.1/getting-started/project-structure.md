---
title: Project Structure
description: Understand the FastAPI Route project folder layout
order: 4
---

# Project Structure

When you initialize a FastAPI Route project, you get a specific folder structure. Understanding this layout helps you organize your code effectively.

## Complete Project Layout

A typical FastAPI Route project looks like this:

```plaintext
my-project/
├── routes/
│   ├── index.py
│   ├── users/
│   │   ├── route.py
│   │   └── [user_id]/
│   │       └── route.py
│   └── (auth)/
│       ├── login/
│       │   └── route.py
│       └── register/
│           └── route.py
├── config.py
├── middleware.py
├── docs.py
├── not-found.py
├── public/
│   ├── css/
│   ├── js/
│   └── images/
└── .cache/
```

## routes/

This is the heart of your application. Every file and folder inside `routes/` directly maps to a URL endpoint. The structure you create here becomes your API structure.

- `index.py` becomes the root endpoint (`/`)
- Folders become path segments
- Each `route.py` file defines HTTP methods for that path

## config.py

This file controls every aspect of your application. You can configure:

- Server host, port, and worker count
- Logging level and format
- Build cache compression and location
- CORS settings and allowed origins
- Custom CLI commands

If this file doesn't exist, FastAPI Route uses sensible defaults.

## middleware.py

An optional file that lets you intercept every request before it reaches your route handlers. Common uses include:

- Logging all incoming requests
- Checking authentication tokens
- Rate limiting by IP address
- Adding custom response headers
- Request validation and sanitization

## docs.py

Optional custom documentation handler. When this file exists, FastAPI Route uses your custom page instead of the built-in documentation at `/docs`. You can access route data and statistics through the provided context object.

## not-found.py

Optional custom 404 page handler. When a route doesn't exist, FastAPI Route calls your custom handler instead of showing the default 404 page. This is useful for branded error pages or providing helpful suggestions.

## public/

Static files directory. Everything inside `public/` is served at the root URL path:

- `public/style.css` → `/style.css`
- `public/js/app.js` → `/js/app.js`
- `public/images/logo.png` → `/images/logo.png`

## .cache/

This directory is created when you run `fastapi-route build`. It contains the compiled, compressed build cache. In production mode, FastAPI Route loads routes from this cache instead of scanning the filesystem, resulting in much faster startup times.

This directory should be added to `.gitignore` since it's generated during build.

## Next Steps

- [File-based Routing](/docs/core-concepts/file-based-routing) - Learn how routes map to URLs
- [Dynamic Routes](/docs/core-concepts/dynamic-routes) - Create routes with parameters
- [Route Groups](/docs/core-concepts/route-groups) - Organize routes without affecting URLs
