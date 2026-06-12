---
title: Dynamic Routes
description: Create dynamic API endpoints with [param] syntax
order: 7
---

# Dynamic Routes

Dynamic routes allow you to capture variable parts of a URL. Instead of creating separate files for every user ID or post ID, you use square brackets `[param]` in your folder names.

## Basic Syntax

When you create a folder with square brackets, that segment of the URL becomes a parameter:

```plaintext
routes/
└── users/
    └── [user_id]/
        └── route.py
```

This single file handles every request to URLs like:

- `/users/1`
- `/users/42`
- `/users/alice`

URL pattern: `/users/{user_id}`

## Accessing Parameters

The parameter name from your folder becomes an argument in your handler function. FastAPI Route extracts the value from the URL and passes it to your function:

```python
# routes/users/[user_id]/route.py
from fastapi_route import Request

def GET(request: Request, user_id: int):
    """GET /users/123 -> user_id = 123"""
    return {"user_id": user_id}

def PUT(request: Request, user_id: int):
    """PUT /users/123"""
    data = await request.json()
    return {"updated": user_id, "data": data}

def DELETE(request: Request, user_id: int):
    """DELETE /users/123"""
    return {"deleted": user_id}
```

Notice how `user_id` appears as both a folder name (`[user_id]`) and a function parameter. This is the only connection you need to make.

## Multiple Dynamic Parameters

You can use multiple dynamic parameters in the same route. Each folder with square brackets creates a separate parameter:

```plaintext
routes/
└── users/
    └── [user_id]/
        └── posts/
            └── [post_id]/
                └── route.py
```

This handles URLs like `/users/123/posts/456`:

```python
def GET(request: Request, user_id: int, post_id: int):
    return {"user_id": user_id, "post_id": post_id}
```

The parameter names come from the folder names, and the order follows the URL structure.

## Type Conversion with Type Hints

FastAPI Route automatically converts URL parameters to the types you specify. Use Python type hints to control this conversion:

| Type Hint | URL Example  | Converted Value                     |
| --------- | ------------ | ----------------------------------- |
| int       | /users/123   | user_id = 123 (integer, not string) |
| str       | /users/alice | username = "alice"                  |
| float     | /price/99.99 | price = 99.99                       |

If the URL value cannot be converted to the specified type, FastAPI Route returns a clear error.

## Catch-all Routes (Catch-all)

Sometimes you need to capture everything after a certain point in the URL. Use `[...param]` to create a catch-all parameter:

```plaintext
routes/
└── docs/
    └── [...slug]/
        └── route.py
```

This handles URLs with any number of segments:

- `/docs/getting-started` → `slug = ["getting-started"]`
- `/docs/guide/installation/setup` → `slug = ["guide", "installation", "setup"]`

The catch-all parameter receives a list of path segments:

```python
# routes/docs/[...slug]/route.py
from fastapi_route import Request

def GET(request: Request, slug: list):
    """Capture all remaining path segments as a list"""
    full_path = "/".join(slug)
    return {
        "segments": slug,
        "full_path": full_path,
        "depth": len(slug)
    }
```

## Combining Static and Dynamic Segments

You can mix static and dynamic folders freely. The static parts are fixed, while dynamic parts capture variables:

```plaintext
routes/
├── api/
│   └── v1/                          # Static: /api/v1
│       └── users/
│           └── [user_id]/           # Dynamic: /api/v1/users/123
│               └── posts/
│                   └── [post_id]/   # Dynamic: /api/v1/users/123/posts/456
│                       └── route.py
```

This gives you precise control over your URL design while maintaining flexibility where you need it.

## Best Practices

1. **Use meaningful parameter names** - `[user_id]` is clear, `[x]` is not
2. **Add type hints** - Always specify the expected type for automatic conversion
3. **Validate parameters** - Check for valid ranges or formats in your handler
4. **Avoid deep nesting** - Too many dynamic segments can make URLs hard to read

## Common Patterns

**User profile with nested resources:**

```plaintext
routes/
├── users/
│   └── [user_id]/
│       ├── route.py           # GET, PUT, DELETE /users/{user_id}
│       └── posts/
│           └── route.py       # GET /users/{user_id}/posts
```

**API versioning:**

```plaintext
routes/
├── v1/
│   └── users/
│       └── [user_id]/
│           └── route.py       # /v1/users/{user_id}
└── v2/
    └── users/
        └── [user_id]/
            └── route.py       # /v2/users/{user_id}
```

**Product categories:**

```plaintext
routes/
└── products/
    └── [category]/
        └── [product_id]/
            └── route.py       # /products/electronics/12345
```

## Next Steps

- [Route Groups](/docs/core-concepts/route-groups) - Organize routes without affecting the URL
- [HTTP Methods](/docs/core-concepts/http-methods) - Handle different request types
- [Middleware](/docs/core-concepts/middleware) - Add authentication and logging to your routes
