---
title: File-based Routing
description: How FastAPI Route maps files and folders to API routes
order: 6
---

# File-based Routing

FastAPI Route uses your file system as the router. The folders you create become URL path segments, and the files you create become endpoints. You never need to write a decorator or register a route manually.

## How It Works

Every Python file inside your `routes/` directory becomes an API endpoint. The path to the file determines the URL. Subfolders create nested URL segments.

## Basic URL Mapping

Here's how different file paths translate to URLs:

| File Path                     | URL Path       |
| ----------------------------- | -------------- |
| routes/index.py               | /              |
| routes/about/route.py         | /about         |
| routes/users/route.py         | /users         |
| routes/users/profile/route.py | /users/profile |
| routes/api/v1/health/route.py | /api/v1/health |

## The route.py Convention

For routes with multiple segments, you create folders and put a `route.py` file inside the final folder. This keeps your project organized and makes the URL structure visible in your file tree:

```plaintext
routes/
├── index.py                      # Root endpoint
├── about/
│   └── route.py                  # /about
├── users/
│   ├── route.py                  # /users
│   └── profile/
│       └── route.py              # /users/profile
└── api/
    └── v1/
        └── users/
            └── route.py          # /api/v1/users
```

## Route File Content

Inside each route file, you define functions named after HTTP methods. FastAPI Route automatically routes requests to the correct function:

```python
# routes/users/route.py
from fastapi_route import Request

def GET(request: Request):
    """Handles GET /users"""
    return {"users": ["Alice", "Bob"]}

def POST(request: Request):
    """Handles POST /users"""
    data = await request.json()
    return {"created": data}

def PUT(request: Request):
    """Handles PUT /users"""
    return {"updated": True}
```

No decorators. No registration. Just functions with HTTP method names.

## The index.py Special File

The `index.py` file serves as the entry point for a directory. It handles the path that ends at that folder:

```python
# routes/index.py - handles the root path
from fastapi_route import Request

def GET(request: Request):
    return {"message": "Welcome to the API"}
```

You can also use `index.py` inside subfolders:

```plaintext
routes/
└── api/
    └── index.py        # Handles /api
```

## Nested Routes for Organization

Create deeply nested routes by adding more folders. Each folder adds a segment to the URL path:

```plaintext
routes/
├── api/
│   └── v1/
│       └── users/
│           └── route.py      # /api/v1/users
├── admin/
│   └── dashboard/
│       └── stats/
│           └── route.py      # /admin/dashboard/stats
└── blog/
    ├── posts/
    │   └── route.py          # /blog/posts
    └── authors/
        └── route.py          # /blog/authors
```

## Rules Summary

1. **`route.py` files** - Contain HTTP method handlers for a specific path
2. **`index.py` files** - Handle the root path or a directory path
3. **Folders without route files** - Continue to nested routes
4. **HTTP method functions** - `GET`, `POST`, `PUT`, `PATCH`, `DELETE` inside route files
5. **Path segments** - Each folder name becomes a URL segment

## What Happens at Startup

When you start your application, FastAPI Route:

1. Walks through every folder inside `routes/`
2. Finds all `route.py` and `index.py` files
3. Extracts the URL path from the folder structure
4. Imports each file and looks for HTTP method functions
5. Registers each function as a route with FastAPI

The entire process is automatic and requires no configuration.

## Production Build

For production, you can pre-compile all routes into a build cache:

```bash
fastapi-route build
```

This creates a `.cache/` directory with compressed route metadata. When you run in production mode, FastAPI Route loads from this cache instead of scanning the filesystem, resulting in faster startup times.

## Next Steps

- [Dynamic Routes](/docs/core-concepts/dynamic-routes) - Create routes with URL parameters using `[param]` folders
- [Route Groups](/docs/core-concepts/route-groups) - Organize routes without affecting the URL using `(group)` folders
- [HTTP Methods](/docs/core-concepts/http-methods) - Learn about all supported HTTP methods and their usage
