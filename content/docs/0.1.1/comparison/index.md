---
title: Comparison
description: FastAPI vs FastAPI Route comparison
order: 16
---

# Comparison

FastAPI Route builds on top of FastAPI, adding file-based routing and production optimizations while preserving everything you love about FastAPI. Here's how they compare side by side.

## Feature Comparison

| Feature                 | Standard FastAPI                   | FastAPI Route                                       |
| ----------------------- | ---------------------------------- | --------------------------------------------------- |
| Routing Definition      | Decorators (`@app.get`)            | File-based                                          |
| Project Scaffolding     | Manual setup                       | One command: `init`                                 |
| Hot Reload              | Basic (`--reload`)                 | Intelligent file watching with rebuild              |
| Build Cache             | Not available                      | Compressed cache (up to 70% smaller)                |
| Production Startup      | Scans files on every start         | Loads from cache (5-10x faster)                     |
| Middleware Setup        | Decorators on app                  | Single file: `middleware.py`                        |
| Custom 404 Page         | Exception handlers                 | Simple file: `not-found.py`                         |
| Custom Documentation    | Swagger UI (limited customization) | Custom `docs.py` with full control                  |
| Development Error Pages | Raw tracebacks                     | Beautiful with syntax highlighting and line numbers |
| Learning Curve          | Medium                             | Low (intuitive file-based approach)                 |
| Configuration           | Environment variables or code      | Single `config.py` file                             |
| Custom CLI Commands     | Not available                      | Define in `config.py`                               |
| Route Organization      | Manual router includes             | File system reflects URL structure                  |
| Production Ready        | Yes                                | Yes, with additional optimizations                  |

## Code Comparison

### Same API, Two Approaches

**Standard FastAPI:**

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello"}

@app.get("/users")
def get_users():
    return [{"id": 1, "name": "Alice"}]

@app.post("/users")
def create_user(name: str):
    return {"created": name, "id": 2}

@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"id": user_id, "name": f"User {user_id}"}
```

**FastAPI Route:**

```python
# routes/index.py
def GET(request):
    return {"message": "Hello"}

# routes/users/route.py
def GET(request):
    return [{"id": 1, "name": "Alice"}]

def POST(request):
    data = await request.json()
    return {"created": data["name"], "id": 2}

# routes/users/[user_id]/route.py
def GET(request, user_id: int):
    return {"id": user_id, "name": f"User {user_id}"}
```

## Performance Comparison

| Metric                    | Standard FastAPI           | FastAPI Route            |
| ------------------------- | -------------------------- | ------------------------ |
| Development Startup       | ~200ms (scan files)        | ~200ms (scan files)      |
| Production Startup        | ~200ms (scan files)        | ~30ms (load from cache)  |
| Memory Usage (100 routes) | ~45MB                      | ~40MB (compressed cache) |
| Route Validation          | Runtime (on first request) | Build time (fail fast)   |

## Developer Experience

**Standard FastAPI:**

- Write decorators for every route
- Manually organize routers
- Configure middleware with decorators
- Handle 404 with exception handlers
- Raw tracebacks for errors

**FastAPI Route:**

- Create files and folders - routes are automatic
- File structure = URL structure
- Single `middleware.py` file
- Custom `not-found.py` for 404s
- Beautiful error pages with line numbers

## When to Use FastAPI Route

FastAPI Route is the better choice when:

**You prefer file-based routing** - You want your file system to reflect your API structure. Looking at your `routes/` folder tells you exactly what URLs your API supports.

**You want faster production startup** - Your project has many routes and startup time matters. The build cache can make production startup 5-10x faster.

**You want simple middleware** - You prefer a single `middleware.py` file over decorators and understanding FastAPI's middleware order.

**You want beautiful error pages by default** - You'd rather see helpful error messages with line numbers and syntax highlighting than raw tracebacks.

**You want custom documentation** - You need to brand your API docs or add custom content while still accessing route data.

**You're building a large API** - File-based routing scales better than decorator-based routing for hundreds of endpoints. Adding a new route is as simple as creating a new file.

## When to Use Standard FastAPI

Standard FastAPI is the better choice when:

**You need maximum flexibility** - You want complete control over route registration and organization, and you don't want any conventions imposed on you.

**You're already invested** - You have an existing FastAPI codebase and migrating to file-based routing would be too much work.

**You don't need file-based routing** - You prefer decorators and explicit route registration, and you don't see value in the file-based approach.

**You're building a tiny API** - For APIs with just a few endpoints (less than 10), the overhead of a routing system doesn't matter.

## The Bottom Line

FastAPI Route is not a replacement for FastAPI - it's a different way of organizing FastAPI applications. You get all the power of FastAPI (async support, dependency injection, OpenAPI docs, type hints) with a more intuitive, file-based routing system.

If you love FastAPI but wish routes were defined by files instead of decorators, FastAPI Route is for you.

If you're happy with decorators and explicit route registration, standard FastAPI works perfectly.

Both are valid choices. Choose the one that fits your mental model and project needs.

## Next Steps

- [Why Choose](/docs/comparison/why-choose) - More reasons to choose FastAPI Route
- [Getting Started](/docs/getting-started) - Start building with FastAPI Route
