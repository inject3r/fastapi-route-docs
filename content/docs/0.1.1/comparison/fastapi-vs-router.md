---
title: FastAPI vs FastAPI Route
description: Detailed comparison between standard FastAPI and FastAPI Route
order: 17
---

# FastAPI vs FastAPI Route

Both frameworks build on FastAPI, but they take fundamentally different approaches to route definition. This comparison shows how the same API looks in each framework.

## Code Comparison

Here's how you would build the same API in both frameworks:

### Standard FastAPI

With standard FastAPI, you define routes using decorators. Each route requires explicit registration:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello"}

@app.get("/users")
def get_users():
    return {"users": ["Alice", "Bob"]}

@app.post("/users")
def create_user(name: str):
    return {"created": name}

@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"user_id": user_id}
```

### FastAPI Route

With FastAPI Route, you create files and folders. The file structure defines your routes automatically:

```python
# routes/index.py
def GET(request):
    return {"message": "Hello"}

# routes/users/route.py
def GET(request):
    return {"users": ["Alice", "Bob"]}

def POST(request):
    data = await request.json()
    return {"created": data["name"]}

# routes/users/[user_id]/route.py
def GET(request, user_id: int):
    return {"user_id": user_id}
```

## Project Structure Comparison

How the two frameworks organize code differs significantly:

### Standard FastAPI Project Structure

```plaintext
my-project/
├── main.py              # All routes in one file
├── routers/
│   ├── users.py         # Separated by domain
│   └── items.py
├── models.py
└── dependencies.py
```

### FastAPI Route Project Structure

```plaintext
my-project/
├── routes/              # URL structure = file structure
│   ├── index.py
│   ├── users/
│   │   └── route.py
│   ├── users/[user_id]/
│   │   └── route.py
│   └── (auth)/          # Route group (ignored in URL)
│       └── profile/
│           └── route.py
├── config.py            # Configuration file
└── middleware.py        # Optional custom middleware
```

## Startup Commands

How you run the application differs between the two approaches:

### Standard FastAPI

```bash
uvicorn main:app --reload
```

You need to remember the module name and app variable. The `--reload` flag enables development mode.

### FastAPI Route

```bash
fastapi-route dev
```

The CLI handles everything automatically. Development mode includes hot reload, file watching, and beautiful error pages.

## Production Deployment

Deploying to production requires different steps:

### Standard FastAPI

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

You manually specify host, port, and worker count each time.

### FastAPI Route

```bash
fastapi-route build    # Pre-compile routes
fastapi-route run      # Start production server
```

The build step creates an optimized cache for faster startup. Settings from `config.py` are automatically applied.

## Request Handling

How the frameworks handle request data differs:

### Standard FastAPI

Parameters are declared in the function signature:

```python
@app.get("/users/{user_id}")
def get_user(user_id: int, limit: int = 10):
    return {"user_id": user_id, "limit": limit}
```

FastAPI automatically extracts path parameters, query parameters, and request bodies based on type hints and defaults.

### FastAPI Route

You explicitly use the `request` object:

```python
def GET(request, user_id: int):
    limit = request.query_params.get("limit", 10)
    data = await request.json()
    return {"user_id": user_id, "limit": limit}
```

This gives you more explicit control but requires slightly more code.

## Error Handling

### Standard FastAPI

```python
from fastapi import HTTPException

@app.get("/users/{user_id}")
def get_user(user_id: int):
    if user_id < 1:
        raise HTTPException(status_code=400, detail="Invalid ID")
    return {"user_id": user_id}
```

### FastAPI Route

```python
from fastapi_route import HTTPException

def GET(request, user_id: int):
    if user_id < 1:
        raise HTTPException(400, "Invalid ID")
    return {"user_id": user_id}
```

Both frameworks support the same exception system.

## Middleware

### Standard FastAPI

```python
@app.middleware("http")
async def add_header(request, call_next):
    response = await call_next(request)
    response.headers["X-Custom"] = "value"
    return response
```

### FastAPI Route

Create a `middleware.py` file:

```python
# middleware.py
async def middleware(request, call_next):
    response = await call_next(request)
    response.headers["X-Custom"] = "value"
    return response
```

FastAPI Route automatically discovers and applies middleware from this file.

## Documentation

### Standard FastAPI

FastAPI automatically generates OpenAPI documentation at `/docs` (Swagger UI) and `/redoc` (ReDoc). This is built-in and requires no configuration.

### FastAPI Route

FastAPI Route also provides auto-generated documentation at `/docs`. Additionally, you can create a custom `docs.py` file to completely replace the documentation with your own design while still accessing route data through the context object.

## When to Use Each

### Choose Standard FastAPI when:

- You need maximum flexibility in route organization
- You prefer explicit decorator syntax
- You're building a small to medium API with simple structure
- You want to follow standard FastAPI conventions

### Choose FastAPI Route when:

- You prefer file-based routing
- You want route organization to mirror URL structure
- You're building a large API with many endpoints
- You value convention over configuration
- You want built-in development tools (hot reload, error pages)
- You need production build optimization

## Both Work Together

Remember that FastAPI Route is built on top of FastAPI. You can use both approaches in the same project if needed. FastAPI Route's routes coexist with standard FastAPI routes, giving you the best of both worlds.

## Next Steps

- [Why Choose](/docs/comparison/why-choose) - Learn more reasons to choose FastAPI Route
- [Getting Started](/docs/getting-started) - Start building with FastAPI Route
- [Quick Start](/docs/getting-started/quick-start) - Build your first API in minutes
