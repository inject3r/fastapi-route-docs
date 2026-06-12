---
title: Middleware
description: Add custom middleware for authentication, logging, and request processing
order: 10
---

# Middleware

Middleware lets you intercept every request before it reaches your route handlers and modify responses before they're sent back to the client. Create a `middleware.py` file in your project root to add custom behavior globally.

## Basic Middleware Structure

The simplest middleware logs every request and adds a custom header to every response:

```python
# middleware.py
from fastapi_route import Request

async def middleware(request: Request, call_next):
    # This code runs BEFORE your route handler
    print(f"[{request.method}] {request.url.path}")

    # Pass control to the route handler (or next middleware)
    response = await call_next(request)

    # This code runs AFTER your route handler
    response.headers["X-Powered-By"] = "FastAPI Route"

    return response
```

The `call_next` function passes the request to the next middleware or to your route handler. You must await it and return its response, unless you're short-circuiting the request.

## Authentication Middleware

Protect your API by checking for valid authentication tokens before allowing access to routes:

```python
# middleware.py
from fastapi_route import Request
from fastapi_route.response import JSONResponse

def verify_token(token: str):
    # Your token verification logic here
    return {"user_id": 1, "username": "alice"}

async def middleware(request: Request, call_next):
    # Public routes that don't require authentication
    public_paths = ["/login", "/register", "/docs", "/health"]
    if request.url.path in public_paths:
        return await call_next(request)

    # Check for Authorization header
    auth = request.headers.get("authorization")
    if not auth or not auth.startswith("Bearer "):
        return JSONResponse(
            content={"error": "Unauthorized", "message": "Valid Bearer token required"},
            status_code=401
        )

    # Extract and verify the token
    token = auth.replace("Bearer ", "")
    user = verify_token(token)

    if not user:
        return JSONResponse(
            content={"error": "Unauthorized", "message": "Invalid or expired token"},
            status_code=401
        )

    # Attach user info to the request for route handlers
    request.state.user = user

    return await call_next(request)
```

Now your route handlers can access the authenticated user:

```python
# routes/profile/route.py
from fastapi_route import Request

def GET(request: Request):
    user = request.state.user
    return {"user_id": user["user_id"], "username": user["username"]}
```

## Logging Middleware with Timing

Track request duration for performance monitoring:

```python
# middleware.py
import time
from fastapi_route import Request

async def middleware(request: Request, call_next):
    start_time = time.time()

    response = await call_next(request)

    duration = (time.time() - start_time) * 1000  # milliseconds
    print(f"{request.method} {request.url.path} - {duration:.2f}ms")

    # Add timing header
    response.headers["X-Response-Time"] = f"{duration:.2f}ms"

    return response
```

## Rate Limiting Middleware

Prevent abuse by limiting requests per client IP address:

```python
# middleware.py
from collections import defaultdict
import time
from fastapi_route import Request
from fastapi_route.response import JSONResponse

# Store request timestamps per IP
rate_limits = defaultdict(list)

async def middleware(request: Request, call_next):
    # Get client IP (works behind reverse proxies)
    client_ip = request.headers.get("x-forwarded-for", request.client.host)
    now = time.time()
    window_start = now - 60  # Last 60 seconds

    # Clean up old entries
    rate_limits[client_ip] = [ts for ts in rate_limits[client_ip] if ts > window_start]

    # Check limit: 60 requests per minute
    if len(rate_limits[client_ip]) >= 60:
        return JSONResponse(
            content={
                "error": "Rate limit exceeded",
                "message": "Maximum 60 requests per minute",
                "retry_after": 60
            },
            status_code=429,
            headers={"Retry-After": "60"}
        )

    # Record this request
    rate_limits[client_ip].append(now)

    return await call_next(request)
```

## Request Body Logging (for debugging)

Log request bodies for debugging (use only in development):

```python
# middleware.py
from fastapi_route import Request

async def middleware(request: Request, call_next):
    # Log request body for POST/PUT/PATCH (development only)
    if request.method in ["POST", "PUT", "PATCH"]:
        body = await request.body()
        print(f"Request body: {body.decode()}")

        # Recreate body since it was consumed
        async def new_body():
            return body

        request.body = new_body

    return await call_next(request)
```

## Request State for Passing Data

Use `request.state` to pass data from middleware to route handlers. This is a namespace that survives the entire request lifecycle:

```python
# middleware.py
import time
from fastapi_route import Request

async def middleware(request: Request, call_next):
    # Add data to request state
    request.state.request_id = str(uuid.uuid4())
    request.state.start_time = time.time()

    response = await call_next(request)

    # Calculate duration
    duration = time.time() - request.state.start_time
    response.headers["X-Duration"] = f"{duration:.3f}s"
    response.headers["X-Request-ID"] = request.state.request_id

    return response
```

Access the data in your route handlers:

```python
# routes/users/route.py
from fastapi_route import Request

def GET(request: Request):
    request_id = request.state.request_id
    return {"request_id": request_id, "users": []}
```

## Short-circuiting Requests

You can return a response directly from middleware without calling the route handler. This is useful for:

- Blocking unauthorized requests
- Returning cached responses
- Handling pre-flight OPTIONS requests

```python
# middleware.py
from fastapi_route import Request
from fastapi_route.response import JSONResponse, HTMLResponse

async def maintenance_middleware(request: Request, call_next):
    # Block all requests during maintenance
    if is_maintenance_mode():
        return HTMLResponse(
            content="<h1>Maintenance in progress</h1><p>Please check back later.</p>",
            status_code=503
        )

    return await call_next(request)

async def cache_middleware(request: Request, call_next):
    # Return cached response if available
    cache_key = f"{request.method}:{request.url.path}"
    cached = get_from_cache(cache_key)

    if cached:
        return JSONResponse(content=cached, headers={"X-Cache": "HIT"})

    response = await call_next(request)
    save_to_cache(cache_key, response.body)
    response.headers["X-Cache"] = "MISS"

    return response
```

## Multiple Middleware Functions

You can only define one middleware function per `middleware.py` file. If you need multiple behaviors, combine them into a single function:

```python
# middleware.py
import time
from fastapi_route import Request
from fastapi_route.response import JSONResponse

async def middleware(request: Request, call_next):
    # 1. Logging
    start_time = time.time()
    print(f"[{request.method}] {request.url.path}")

    # 2. Authentication
    public_paths = ["/login", "/register", "/docs", "/health"]
    if request.url.path not in public_paths:
        auth = request.headers.get("authorization")
        if not auth or not auth.startswith("Bearer "):
            return JSONResponse(
                content={"error": "Unauthorized"},
                status_code=401
            )
        request.state.user = {"id": 1}  # Simplified for example

    # 3. Rate limiting
    client_ip = request.headers.get("x-forwarded-for", request.client.host)
    # ... rate limiting logic ...

    # 4. Process the request
    response = await call_next(request)

    # 5. Add response headers
    duration = (time.time() - start_time) * 1000
    response.headers["X-Response-Time"] = f"{duration:.2f}ms"
    response.headers["X-Powered-By"] = "FastAPI Route"

    return response
```

## Important Notes

1. **Order matters** - Middleware runs in the order you write it (top to bottom)
2. **Must be async** - Middleware functions must be defined with `async def`
3. **Must call call_next** - Unless you're short-circuiting, you must `await call_next(request)`
4. **Don't consume the body twice** - Reading `request.body()` consumes it; cache it if needed
5. **Development vs Production** - Add conditional logic to avoid verbose logging in production

## Next Steps

- [Build System](/docs/advanced/build-system) - Compile routes for production
- [Configuration](/docs/advanced/configuration) - Customize server and logging settings
- [Error Handling](/docs/advanced/error-handling) - Raise HTTP exceptions and handle errors gracefully
