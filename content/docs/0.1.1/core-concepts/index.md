---
title: Core Concepts
description: Understand the core concepts of FastAPI Route
order: 5
---

# Core Concepts

FastAPI Route is built on a small set of powerful concepts. Once you understand these, you'll be able to build complete APIs without ever writing a router decorator or registering a route manually.

## File-based Routing

This is the foundation of FastAPI Route. Your file system becomes your router. Every folder and file you create automatically maps to a URL path.

- `routes/index.py` → `/`
- `routes/users/route.py` → `/users`
- `routes/users/profile/route.py` → `/users/profile`

You never need to write `@app.get()` or `app.include_router()`. Just create files and folders.

## Dynamic Routes

When you need to capture variable parts of a URL, use square bracket syntax `[param]` in your folder names. FastAPI Route automatically extracts the value and passes it to your handler.

- `routes/users/[user_id]/route.py` → `/users/{user_id}`

The captured value becomes a parameter in your function, complete with automatic type conversion based on type hints.

## Route Groups

Sometimes you want to organize your code without affecting the URL structure. Parentheses `(group)` let you create organizational folders that are ignored in the final URL.

- `routes/(auth)/login/route.py` → `/login`
- `routes/(api)/v1/users/route.py` → `/v1/users`

This is perfect for separating public routes from authenticated routes, or organizing by feature without changing your API design.

## HTTP Methods

Inside any route file, define functions named after HTTP methods. FastAPI Route routes the correct HTTP verb to the matching function automatically.

- `def GET(request):` - Handles GET requests
- `def POST(request):` - Handles POST requests
- `def PUT(request):` - Handles PUT requests
- `def PATCH(request):` - Handles PATCH requests
- `def DELETE(request):` - Handles DELETE requests

One file can handle multiple HTTP methods. All of them share the same URL path.

## Middleware

Create a `middleware.py` file in your project root to intercept every request before it reaches your route handlers. This is perfect for:

- Logging all incoming requests
- Checking authentication tokens
- Rate limiting by IP address
- Adding custom response headers
- Request validation

The middleware runs for every request, regardless of which route handles it.

## Build Cache

For production deployments, FastAPI Route can pre-compile all your routes into an optimized cache. This eliminates filesystem scanning at startup and significantly reduces memory usage.

```bash
fastapi-route build
```

The build process compresses your route metadata and stores it in the `.cache/` directory. When you run `fastapi-route run` in production, routes load from this cache instantly.

## Development Server

The development server (`fastapi-route dev`) gives you hot reload out of the box. Any change to your route files, configuration, or custom handlers triggers an automatic rebuild. You never need to restart the server manually during development.

## Error Pages

FastAPI Route generates beautiful error pages for development. When something breaks, you see:

- The exact file and line number where the error occurred
- The problematic code with syntax highlighting
- Helpful suggestions for fixing the issue
- Full traceback filtered to show only user code

In production, these detailed error pages are disabled for security.

## How Everything Works Together

Here's a complete example showing all concepts in one project:

```plaintext
my-api/
├── routes/
│   ├── index.py                    # GET /, POST /
│   ├── users/
│   │   ├── route.py                # GET /users, POST /users
│   │   └── [user_id]/
│   │       └── route.py            # GET /users/123, PUT /users/123, DELETE /users/123
│   └── (auth)/                     # Route group (doesn't affect URL)
│       └── profile/
│           └── route.py            # GET /profile
├── middleware.py                   # Runs on every request
└── config.py                       # Server and build configuration
```

When you run `fastapi-route dev`, FastAPI Route:

1. Loads your configuration from `config.py`
2. Scans the `routes/` folder and maps every file to a URL
3. Loads `middleware.py` to wrap every request
4. Starts the server with hot reload enabled
5. Serves documentation at `/docs` showing all discovered routes

## Next Steps

- [File-based Routing](/docs/0.1.1/core-concepts/file-based-routing) - Learn the mapping rules in detail
- [Dynamic Routes](/docs/0.1.1/core-concepts/dynamic-routes) - Master path parameters and catch-all routes
- [Route Groups](/docs/0.1.1/core-concepts/route-groups) - Organize code without changing URLs
- [HTTP Methods](/docs/0.1.1/core-concepts/http-methods) - Explore all supported methods and the Request object
- [Middleware](/docs/0.1.1/core-concepts/middleware) - Add authentication, logging, and rate limiting
