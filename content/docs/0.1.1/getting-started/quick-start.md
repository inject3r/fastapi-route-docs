---
title: Quick Start
description: Build your first API with FastAPI Route in 4 steps
order: 3
---

# Quick Start

Let's build a working API in less than 5 minutes. FastAPI Route uses file-based routing, so you don't need to learn any decorators or special syntax.

## Step 1: Initialize a new project

Run the init command to create a new project with the standard folder structure:

```bash
fastapi-route init my-api
cd my-api
```

This creates:

- A `routes/` directory with a sample `index.py` file
- A `config.py` file with default settings
- A `public/` directory for static files
- A `.gitignore` file tailored for FastAPI Route projects

## Step 2: Create your first route

Open `routes/index.py` and replace the content. Every route file defines HTTP methods as functions named `GET`, `POST`, `PUT`, `PATCH`, or `DELETE`:

```python
from fastapi_route import Request

def GET(request: Request):
    """Handles GET requests to the root path"""
    return {"message": "Hello World!"}

def POST(request: Request):
    """Handles POST requests to the root path"""
    data = await request.json()
    return {"received": data}
```

The `request` object gives you access to headers, query parameters, and the request body.

## Step 3: Add a dynamic route

Create a new folder structure for a dynamic user endpoint. The `[user_id]` folder tells FastAPI Route to capture that URL segment as a parameter:

```bash
mkdir -p routes/users/[user_id]
```

Then create `routes/users/[user_id]/route.py`:

```python
from fastapi_route import Request

def GET(request: Request, user_id: int):
    """GET /users/123 -> user_id = 123"""
    return {"user_id": user_id, "name": f"User {user_id}"}

def DELETE(request: Request, user_id: int):
    """DELETE /users/123"""
    return {"deleted": user_id}
```

The parameter name from the folder (`user_id`) becomes a function parameter automatically. You can also specify the type hint (`int`) for automatic conversion.

## Step 4: Run the development server

Start the development server with hot reload enabled:

```bash
fastapi-route dev
```

You'll see output like:

```text
============================================================
FASTAPI ROUTE DEVELOPMENT SERVER
============================================================
Server: http://127.0.0.1:8000
Mode: development
Hot reload: enabled
============================================================
```

Now you can test your API:

```bash
# Test the root endpoint
curl http://localhost:8000/

# Test POST request
curl -X POST http://localhost:8000/ -H "Content-Type: application/json" -d '{"name":"Alice"}'

# Test dynamic route
curl http://localhost:8000/users/42

# Test DELETE
curl -X DELETE http://localhost:8000/users/42
```

Visit `http://localhost:8000/docs` to see auto-generated API documentation.

## What just happened?

You created a complete REST API without writing a single decorator. FastAPI Route automatically:

1. Scanned your `routes/` folder structure
2. Mapped folders to URL paths
3. Converted `[user_id]` folders to dynamic parameters
4. Registered each HTTP method function as a route
5. Started a development server with hot reload

Any changes you make to your route files will automatically reload the server.

## Next Steps

- [File-based Routing](/docs/core-concepts/file-based-routing) - Learn how routes map to URLs in detail
- [Dynamic Routes](/docs/core-concepts/dynamic-routes) - Master path parameters and validation
- [Route Groups](/docs/core-concepts/route-groups) - Organize routes without affecting URLs
- [Middleware](/docs/core-concepts/middleware) - Add authentication, logging, and rate limiting
