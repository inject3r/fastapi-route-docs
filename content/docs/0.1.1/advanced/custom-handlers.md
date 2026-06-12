---
title: Custom Handlers
description: Create custom request and response handlers
order: 14
---

# Custom Handlers

FastAPI Route provides two special files that let you completely customize the user experience: `docs.py` for API documentation and `not-found.py` for 404 error pages. When these files exist in your project root, FastAPI Route automatically uses them instead of the built-in defaults.

## Custom Documentation (docs.py)

The built-in documentation at `/docs` is useful, but sometimes you need a custom look and feel, or you want to add your company branding, or you need to display additional information that the auto-generated docs don't provide.

Create a `docs.py` file in your project root to take full control of the documentation page:

```python
# docs.py
from fastapi_route import Request, HTMLResponse

def handler(request: Request, context):
    """Generate custom HTML documentation"""
    routes = context.get_routes()
    stats = context.get_statistics()

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>API Documentation</title>
        <style>
            body {{
                font-family: monospace;
                background: #0a0a0a;
                color: #e0e0e0;
                padding: 2rem;
            }}
            h1 {{ color: #44ff44; }}
            .route {{
                background: #1a1a1a;
                margin: 0.5rem 0;
                padding: 0.5rem;
            }}
            .method {{ color: #ffb86b; }}
            .path {{ color: #4ec9b0; }}
        </style>
    </head>
    <body>
        <h1>My Custom API Documentation</h1>
        <p>Total Routes: {stats['total_routes']}</p>
        <p>Dynamic Routes: {stats['dynamic_routes']}</p>
        <h2>Endpoints</h2>
    """

    for route in routes:
        html += f"""
        <div class="route">
            <span class="method">{route['method']}</span>
            <span class="path">{route['path']}</span>
        </div>
        """

    html += "</body></html>"

    return HTMLResponse(content=html)
```

The `handler` function receives two arguments:

- `request` - The Request object (contains info about the current request)
- `context` - A context object with methods to access application data

### Context Object Methods

The `context` object gives you access to your application's data:

| Method                               | Returns    | Description                                  |
| ------------------------------------ | ---------- | -------------------------------------------- |
| context.get_routes()                 | List[Dict] | All registered routes with paths and methods |
| context.get_routes_by_method(method) | List[Dict] | Routes filtered by HTTP method               |
| context.get_statistics()             | Dict       | Route counts and method distribution         |
| context.get_project_info()           | Dict       | Project name and version                     |
| context.config                       | Dict       | Application configuration values             |

### Dynamic Documentation Example

Here's a more advanced example that uses all the context features:

```python
# docs.py
from fastapi_route import Request, HTMLResponse

def handler(request: Request, context):
    routes = context.get_routes()
    stats = context.get_statistics()
    info = context.get_project_info()
    config = context.config

    # Group routes by first path segment
    groups = {}
    for route in routes:
        prefix = route['path'].split('/')[1] if len(route['path'].split('/')) > 1 else 'root'
        if prefix not in groups:
            groups[prefix] = []
        groups[prefix].append(route)

    # Build HTML
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>{info['name']} - API Docs</title>
        <style>
            * {{ margin: 0; padding: 0; box-sizing: border-box; }}
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;
                background: #000;
                color: #e0e0e0;
                padding: 2rem;
            }}
            .container {{ max-width: 1200px; margin: 0 auto; }}
            h1 {{ color: #44ff44; border-bottom: 1px solid #44ff44; padding-bottom: 0.5rem; }}
            .stats {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin: 2rem 0;
            }}
            .stat-card {{
                background: #0a0a0a;
                border: 1px solid #1a1a1a;
                padding: 1rem;
                text-align: center;
            }}
            .stat-value {{ font-size: 2rem; font-weight: bold; color: #44ff44; }}
            .stat-label {{ color: #888; font-size: 0.8rem; text-transform: uppercase; }}
            .group {{
                margin: 2rem 0;
                border-left: 3px solid #ffb86b;
                padding-left: 1rem;
            }}
            .group h2 {{ color: #ffb86b; margin-bottom: 1rem; }}
            .route {{
                background: #0a0a0a;
                border: 1px solid #1a1a1a;
                margin: 0.5rem 0;
                padding: 0.75rem;
                display: flex;
                gap: 1rem;
                align-items: center;
            }}
            .method {{
                font-weight: bold;
                min-width: 60px;
            }}
            .method-GET {{ color: #4ec9b0; }}
            .method-POST {{ color: #fca130; }}
            .method-PUT {{ color: #61affe; }}
            .method-DELETE {{ color: #f93e3e; }}
            .path {{ font-family: monospace; color: #ffb86b; }}
            .badge {{
                background: #1a1a1a;
                padding: 0.2rem 0.5rem;
                font-size: 0.7rem;
                border-radius: 4px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>{info['name']} v{info['version']}</h1>

            <div class="stats">
                <div class="stat-card">
                    <div class="stat-value">{stats['total_routes']}</div>
                    <div class="stat-label">Total Routes</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">{stats['dynamic_routes']}</div>
                    <div class="stat-label">Dynamic</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">{stats['static_routes']}</div>
                    <div class="stat-label">Static</div>
                </div>
            </div>
    """

    # Add grouped routes
    for group_name, group_routes in sorted(groups.items()):
        html += f'<div class="group"><h2>/{group_name}</h2>'
        for route in group_routes:
            method_class = f"method-{route['method']}"
            dynamic_badge = '<span class="badge">dynamic</span>' if route['is_dynamic'] else ''
            html += f"""
            <div class="route">
                <span class="method {method_class}">{route['method']}</span>
                <span class="path">{route['path']}</span>
                {dynamic_badge}
            </div>
            """
        html += "</div>"

    html += """
            <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #1a1a1a; text-align: center; color: #555;">
                Powered by FastAPI Route
            </div>
        </div>
    </body>
    </html>
    """

    return HTMLResponse(content=html)
```

## Custom 404 Page (not-found.py)

When a user requests a URL that doesn't match any of your routes, FastAPI Route returns a 404 error. You can customize this page by creating a `not-found.py` file:

```python
# not-found.py
from fastapi_route import Request, HTMLResponse

def handler(request: Request, context):
    """Generate custom 404 page"""
    routes = context.get_routes()

    # Find similar routes to suggest
    path_parts = request.path.strip('/').split('/')
    suggestions = []

    for route in routes:
        route_parts = route['path'].strip('/').split('/')
        # Simple similarity check
        if any(part in path_parts for part in route_parts):
            suggestions.append(route)

    suggestions_html = ""
    if suggestions:
        suggestions_html = "<h3>Did you mean?</h3><ul>"
        for route in suggestions[:5]:
            suggestions_html += f"<li><a href=\"{route['path']}\">{route['method']} {route['path']}</a></li>"
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

## Handler Function Requirements

For both `docs.py` and `not-found.py`, your handler function must:

1. Accept two parameters: `request` and `context`
2. Return a valid response (string, dict, or Response object)
3. Can be sync or async (both work)

```python
# Async handler example
async def handler(request: Request, context):
    data = await some_async_operation()
    return HTMLResponse(content=data)

# Sync handler example
def handler(request: Request, context):
    return {"message": "Hello"}
```

## Response Types

Your handler can return:

- **String** - Treated as HTML content
- **Dictionary** - Converted to JSON response
- **HTMLResponse** - Full control over status code and headers
- **JSONResponse** - Full control over JSON output

## When Custom Handlers Execute

- **docs.py** - Executes when a user visits `/docs`
- **not-found.py** - Executes when no route matches the requested URL

If these files don't exist, FastAPI Route uses its built-in defaults.

## Next Steps

- [Error Handling](/docs/advanced/error-handling) - Learn about HTTP exceptions and error responses
- [Configuration](/docs/advanced/configuration) - Configure server, logging, and build settings
- [Build System](/docs/advanced/build-system) - Optimize your production deployment
