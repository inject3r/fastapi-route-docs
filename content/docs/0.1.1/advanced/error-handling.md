---
title: Error Handling
description: Handle errors and create custom error pages
order: 15
---

# Error Handling

FastAPI Route provides comprehensive error handling with beautiful development error pages and production-ready JSON error responses. You can raise HTTP exceptions from your route handlers, and FastAPI Route automatically converts them to proper responses.

## HTTP Exceptions

The most common way to handle errors is to raise `HTTPException` with an appropriate status code:

```python
from fastapi_route import HTTPException

def GET(request: Request, user_id: int):
    if user_id < 1:
        raise HTTPException(400, "User ID must be positive")

    user = find_user(user_id)
    if not user:
        raise HTTPException(404, f"User {user_id} not found")

    if not user.is_active:
        raise HTTPException(403, "User account is disabled")

    return {"user": user}
```

## Built-in Exception Classes

FastAPI Route includes ready-to-use exception classes for common HTTP status codes:

```python
from fastapi_route import (
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
    NotFoundException,
    MethodNotAllowedException,
    ConflictException
)

def GET(request: Request, user_id: int):
    user = find_user(user_id)
    if not user:
        raise NotFoundException(f"User {user_id} not found")

def POST(request: Request):
    if not request.headers.get("Authorization"):
        raise UnauthorizedException("Authentication required")

    if not has_permission(request):
        raise ForbiddenException("Insufficient permissions")

    data = await request.json()
    if not data.get("name"):
        raise BadRequestException("Name field is required")

    if user_exists(data["email"]):
        raise ConflictException("User with this email already exists")

    return {"created": True}
```

## Available HTTP Exceptions

| Exception                 | Status Code | Default Message      | Use Case                               |
| ------------------------- | ----------- | -------------------- | -------------------------------------- |
| BadRequestException       | 400         | "Bad Request"        | Invalid input, missing required fields |
| UnauthorizedException     | 401         | "Unauthorized"       | Missing or invalid authentication      |
| ForbiddenException        | 403         | "Forbidden"          | Authenticated but not authorized       |
| NotFoundException         | 404         | "Not Found"          | Resource doesn't exist                 |
| MethodNotAllowedException | 405         | "Method Not Allowed" | HTTP method not supported              |
| ConflictException         | 409         | "Conflict"           | Resource state conflict                |
| HTTPException             | any         | custom               | Generic HTTP error                     |

## Custom Exception with Headers

You can add custom headers to HTTP exceptions:

```python
from fastapi_route import HTTPException

def GET(request: Request, user_id: int):
    if rate_limited(request):
        raise HTTPException(
            status_code=429,
            detail="Too many requests",
            headers={"Retry-After": "60"}
        )
```

## Built-in Error Pages

FastAPI Route automatically handles common errors with beautiful pages:

- **404 Not Found** - Route not found (customizable via `not-found.py`)
- **405 Method Not Allowed** - HTTP method not supported
- **422 Unprocessable Entity** - Request validation error
- **500 Internal Server Error** - Unhandled server error

### Custom 404 Page

Create a `not-found.py` file in your project root to customize the 404 page:

```python
# not-found.py
from fastapi_route import Request, HTMLResponse

def handler(request: Request, context):
    """Custom 404 page with helpful suggestions"""
    routes = context.get_routes()

    # Find similar routes to suggest
    path_parts = request.path.strip('/').split('/')
    suggestions = []

    for route in routes:
        route_parts = route['path'].strip('/').split('/')
        # Simple similarity check - if any part matches
        if any(part in path_parts for part in route_parts):
            suggestions.append(route)

    suggestions_html = ""
    if suggestions:
        suggestions_html = "<h3>Did you mean?</h3><ul>"
        for route in suggestions[:5]:
            suggestions_html += f'<li><a href="{route["path"]}">{route["method"]} {route["path"]}</a></li>'
        suggestions_html += "</ul>"

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>404 - Page Not Found</title>
        <style>
            body {{
                font-family: monospace;
                background: #000;
                color: #e0e0e0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                padding: 2rem;
            }}
            .container {{
                text-align: center;
                max-width: 600px;
            }}
            .code {{
                font-size: 6rem;
                font-weight: bold;
                color: #ff4444;
                margin-bottom: 1rem;
            }}
            .path {{
                background: #0a0a0a;
                padding: 0.5rem 1rem;
                border: 1px solid #1a1a1a;
                display: inline-block;
                margin: 1rem 0;
                font-family: monospace;
                color: #ff8888;
            }}
            .suggestions {{
                text-align: left;
                margin-top: 2rem;
                padding: 1rem;
                background: #0a0a0a;
                border-left: 3px solid #ffb86b;
            }}
            .suggestions ul {{
                margin-left: 1.5rem;
                margin-top: 0.5rem;
            }}
            a {{
                color: #6bcbff;
                text-decoration: none;
            }}
            a:hover {{
                text-decoration: underline;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="code">404</div>
            <h1>Page Not Found</h1>
            <div class="path">{request.path}</div>
            {suggestions_html}
            <div style="margin-top: 2rem;">
                <a href="/">← Back to Home</a>
                <span style="margin: 0 0.5rem;">|</span>
                <a href="/docs">View Documentation</a>
            </div>
        </div>
    </body>
    </html>
    """

    return HTMLResponse(content=html, status_code=404)
```

## Development Error Pages

When `debug = True` in your configuration (or when running `fastapi-route dev`), FastAPI Route shows detailed error pages with:

- The exact file and line number where the error occurred
- The problematic code with syntax highlighting
- The full traceback filtered to show only user code
- Helpful suggestions for fixing the issue

These detailed error pages are automatically disabled in production for security.

## Validation Errors

FastAPI Route automatically validates route structure during build:

```python
# This will cause a build error - duplicate method in same file
# routes/users/route.py

def GET(request: Request):
    return {"users": []}

def GET(request: Request):  # ERROR: Duplicate GET method
    return {"users": []}
```

Build errors are displayed with:

- The error type (DUPLICATE_METHOD, DUPLICATE_ROUTE, INVALID_HANDLER)
- The file path and line numbers
- A clear explanation of what's wrong
- Suggestions for fixing the issue

## Error Response Format

When an HTTP exception is raised in production, FastAPI Route returns a JSON response:

```json
{
  "detail": "User 999 not found"
}
```

For validation or business errors, you can return custom error structures:

```python
def GET(request: Request, user_id: int):
    if user_id < 1:
        return {
            "error": {
                "code": "INVALID_ID",
                "message": "User ID must be a positive integer",
                "received": user_id
            }
        }, 400
```

## Handling Errors in Middleware

You can also catch and handle errors in custom middleware:

```python
# middleware.py
from fastapi_route import Request
from fastapi_route.response import JSONResponse

async def middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except ValueError as e:
        return JSONResponse(
            content={"error": "Invalid input", "detail": str(e)},
            status_code=400
        )
    except Exception as e:
        # Log the error for debugging
        print(f"Unexpected error: {e}")
        return JSONResponse(
            content={"error": "Internal server error"},
            status_code=500
        )
```

## Best Practices

1. **Use specific exceptions** - `NotFoundException` is clearer than `HTTPException(404)`
2. **Provide meaningful error messages** - Help clients understand what went wrong
3. **Don't expose internals** - In production, avoid leaking stack traces or database details
4. **Use custom error codes** - Add `code` field to help clients handle errors programmatically
5. **Log errors** - Use `logger.error()` to record server errors for debugging

## Next Steps

- [Custom Handlers](/docs/0.1.1/advanced/custom-handlers) - Create custom documentation and 404 pages
- [Configuration](/docs/0.1.1/advanced/configuration) - Configure debug mode and logging settings
- [Build System](/docs/0.1.1/advanced/build-system) - Build your project for production deployment
