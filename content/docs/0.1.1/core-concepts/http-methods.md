---
title: HTTP Methods
description: Define GET, POST, PUT, PATCH, and DELETE handlers in route files
order: 9
---

# HTTP Methods

FastAPI Route uses function names to determine which HTTP method a handler responds to. Instead of writing decorators, you simply name your functions `GET`, `POST`, `PUT`, `PATCH`, or `DELETE`.

## Supported Methods

| Method | Function Name          | Typical Use Case                   |
| ------ | ---------------------- | ---------------------------------- |
| GET    | `def GET(request):`    | Retrieve data without side effects |
| POST   | `def POST(request):`   | Create new resources               |
| PUT    | `def PUT(request):`    | Replace an entire resource         |
| PATCH  | `def PATCH(request):`  | Partially update a resource        |
| DELETE | `def DELETE(request):` | Remove a resource                  |

You can define any combination of these methods in a single route file. FastAPI Route automatically routes the correct HTTP method to the matching function.

## Basic Example with All Methods

```python
# routes/users/route.py
from fastapi_route import Request

def GET(request: Request):
    """List all users"""
    return {"users": ["Alice", "Bob"]}

def POST(request: Request):
    """Create a new user"""
    data = await request.json()
    return {"created": data, "id": 1}

def PUT(request: Request):
    """Replace all users (bulk update)"""
    data = await request.json()
    return {"updated": data}

def PATCH(request: Request):
    """Partially update users"""
    data = await request.json()
    return {"patched": data}

def DELETE(request: Request):
    """Delete all users"""
    return {"deleted": True}
```

When a client sends a `POST` request to `/users`, FastAPI Route calls the `POST` function. When a client sends a `GET` request, it calls the `GET` function. No extra configuration needed.

## Complete CRUD Example with Dynamic Routes

Here's a full REST API for a user resource using a dynamic `[user_id]` parameter:

```python
# routes/users/[user_id]/route.py
from fastapi_route import Request

# In-memory database
users_db = {1: {"name": "Alice", "email": "alice@example.com"},
           2: {"name": "Bob", "email": "bob@example.com"}}

def GET(request: Request, user_id: int):
    """Retrieve a single user by ID"""
    user = users_db.get(user_id)
    if not user:
        return {"error": "User not found"}, 404
    return {"user": user}

def PUT(request: Request, user_id: int):
    """Completely replace a user"""
    data = await request.json()
    users_db[user_id] = data
    return {"updated": user_id, "user": data}

def PATCH(request: Request, user_id: int):
    """Partially update a user"""
    data = await request.json()
    if user_id in users_db:
        users_db[user_id].update(data)
    return {"patched": user_id, "user": users_db.get(user_id)}

def DELETE(request: Request, user_id: int):
    """Delete a user"""
    if user_id in users_db:
        del users_db[user_id]
    return {"deleted": user_id}
```

This single file handles all four operations on a specific user resource using the URL parameter to identify which user.

## The Request Object

Every handler receives a `Request` object that gives you access to everything about the incoming HTTP request:

| Property/Method        | Description                    | Example                                |
| ---------------------- | ------------------------------ | -------------------------------------- |
| `request.method`       | HTTP method as string          | `"GET"`, `"POST"`                      |
| `request.path`         | URL path                       | `"/users/123"`                         |
| `request.headers`      | Dictionary of request headers  | `{"content-type": "application/json"}` |
| `request.query_params` | Dictionary of query parameters | `{"page": "2", "limit": "10"}`         |
| `await request.json()` | Parse JSON request body        | Returns parsed dict/list               |
| `await request.form()` | Parse URL-encoded form data    | Returns dict of form fields            |
| `await request.body()` | Raw request body as bytes      | For custom processing                  |

## Response Formats

You can return data in several ways, and FastAPI Route will convert it to a proper HTTP response:

### JSON Response (Default)

Return a dictionary or list. FastAPI Route automatically sets `Content-Type: application/json`:

```python
def GET(request: Request):
    return {"message": "Success", "data": [1, 2, 3]}
```

### Custom Status Codes

Return a tuple of `(data, status_code)` to override the default 200 status:

```python
def POST(request: Request):
    return {"error": "Invalid input"}, 400

def GET(request: Request, user_id: int):
    user = find_user(user_id)
    if not user:
        return {"error": "Not found"}, 404
    return {"user": user}
```

### Empty Responses

Return `None` for responses with no body (like a `204 No Content`):

```python
def DELETE(request: Request, user_id: int):
    delete_user(user_id)
    return None  # FastAPI Route returns 204 No Content
```

## Async Support

FastAPI Route fully supports async handlers. Use `async def` when you need to await database calls, external API requests, or file operations:

```python
async def GET(request: Request):
    data = await fetch_from_database()
    return {"data": data}

async def POST(request: Request):
    body = await request.json()
    result = await save_to_database(body)
    return {"created": result}
```

You can mix sync and async handlers in the same file. FastAPI Route handles both correctly.

## HEAD and OPTIONS

FastAPI Route automatically handles `HEAD` requests (returns same headers as `GET` without the body) and `OPTIONS` requests (returns CORS headers) when CORS is enabled. You don't need to define these explicitly.

## Best Practices

1. **Keep handlers focused** - Each function should do one thing
2. **Use type hints** - Specify parameter types for automatic conversion
3. **Validate input** - Check request data before processing
4. **Return consistent response formats** - Same structure for success and error responses
5. **Use async for I/O operations** - Database calls, HTTP requests, file operations

## Next Steps

- [Middleware](/docs/0.1.1/core-concepts/middleware) - Add authentication and logging to all routes
- [Build System](/docs/0.1.1/advanced/build-system) - Compile routes for production
- [Error Handling](/docs/0.1.1/advanced/error-handling) - Raise HTTP exceptions and handle errors gracefully
