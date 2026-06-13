---
title: Configuration
description: Advanced configuration options for FastAPI Route
order: 13
---

# Configuration

FastAPI Route is designed to work with zero configuration, but when you need to customize behavior, create a `config.py` file in your project root. This file gives you complete control over server settings, logging, build options, and even custom CLI commands.

## Basic Configuration

At minimum, you can configure the most common settings:

```python
# config.py
app_name = "My API"
debug = False
cors_enabled = True
cors_origins = ["*"]
```

These settings control the application name shown in documentation, debug mode for detailed error pages, and CORS (Cross-Origin Resource Sharing) for browser-based clients.

## Server Settings

The `server` dictionary controls how the Uvicorn ASGI server behaves. These settings directly map to Uvicorn's configuration options:

```python
# config.py
server = {
    "host": "0.0.0.0",              # Bind to all network interfaces
    "port": 8000,                   # Port to listen on
    "workers": 4,                   # Number of worker processes
    "timeout_keep_alive": 5,        # Keep-alive timeout in seconds
    "limit_concurrency": 1000,      # Maximum concurrent connections
    "limit_max_requests": 10000,    # Max requests before worker restart
    "backlog": 2048,                # TCP listen backlog
    "lifespan": "auto",             # Lifespan protocol handling
    "loop": "auto",                 # Event loop implementation (asyncio/uvloop)
    "http": "auto",                 # HTTP protocol implementation (h11/httptools)
}
```

Each worker is a separate process, so increasing `workers` improves throughput but also increases memory usage. The default of 1 worker is fine for development. For production, set `workers` to the number of CPU cores available.

## Logging Settings

The `logging` dictionary controls log output format and verbosity in different environments:

```python
# config.py
logging = {
    "level": "INFO",                # Development log level (DEBUG, INFO, WARNING, ERROR)
    "format": "[%Y-%m-%d %H:%M:%S]", # Timestamp format (strftime format)
    "color": True,                  # Enable colored terminal output
    "production_level": "WARNING"   # Production log level (less verbose)
}
```

The `level` setting applies to development mode (`fastapi-route dev`). In production (`fastapi-route run`), the `production_level` is used instead, filtering out debug and info messages to reduce noise.

Timestamp formats follow Python's `strftime` syntax:

- `[%Y-%m-%d %H:%M:%S]` → `[2026-01-15 14:30:22]`
- `[%Y-%m-%dT%H:%M:%S%z]` → `[2026-01-15T14:30:22+0000]`
- `[%H:%M:%S]` → `[14:30:22]`

## Build Settings

The `build` dictionary controls how the build system compresses and stores route metadata:

```python
# config.py
build = {
    "cache_dir": ".cache",          # Directory name for build cache
    "compression_level": 6,         # Zlib compression (1-9, higher = smaller)
    "exclude_patterns": ["test_*", "temp_*"],  # Files to exclude from build
    "include_patterns": []          # Files to include (overrides exclude)
}
```

The `compression_level` affects build time vs cache size. Level 1 is fastest with least compression, level 9 is slowest with maximum compression. The default of 6 is balanced.

`exclude_patterns` is a list of glob patterns for files you want to exclude from the build process. This is useful for excluding test files, temporary files, or backup files.

## Custom CLI Commands

One of the most powerful features is the ability to define custom CLI commands that run directly from `fastapi-route`:

```python
# config.py
commands = {
    "deploy": "fastapi-route build && rsync -avz .cache/ deploy/",
    "dev": "fastapi-route dev --port 3000",
    "prod": "fastapi-route run --host 0.0.0.0 --port 8080 --workers 4",
    "test": "pytest tests/ -v",
    "lint": "ruff check .",
    "format": "black .",
    "clean-all": "fastapi-route clean && rm -rf __pycache__"
}
```

After defining these, you can run:

```bash
fastapi-route deploy
fastapi-route test
fastapi-route lint
fastapi-route format
fastapi-route clean-all
```

Command strings support variable substitution. You can use `{server.host}` and `{server.port}` to reference values from your server configuration:

```python
commands = {
    "run": "fastapi-route run --host {server.host} --port {server.port}",
}
```

## CORS Configuration

For more detailed CORS control beyond simply enabling it:

```python
# config.py
cors_enabled = True
cors_origins = ["https://example.com", "https://api.example.com"]
cors_allow_credentials = True
cors_allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
cors_allow_headers = ["Authorization", "Content-Type", "X-Request-ID"]
```

## Directory Configuration

Specify custom directory locations if your project structure differs from the default:

```python
# config.py
route_dir = "api_routes"           # Default: "routes"
static_dir = "assets"              # Default: "public"
static_directory_listing = False   # Enable directory browsing (security risk)
```

## FastAPI-Specific Settings

You can also configure FastAPI's built-in OpenAPI documentation settings:

```python
# config.py
docs_enabled = True                # Enable/disable /docs endpoint
redoc_enabled = False              # Enable/disable ReDoc endpoint
openapi_url = "/api/openapi.json" # Custom OpenAPI JSON path
openapi_prefix = ""                # OpenAPI URL prefix
title = "My Custom API Title"      # Override OpenAPI title
description = "API Description"    # Override OpenAPI description
version = "2.0.0"                  # API version
```

## Contact and License Information

Add contact and license information to your OpenAPI documentation:

```python
# config.py
contact = {
    "name": "API Support",
    "url": "https://example.com/support",
    "email": "support@example.com"
}

license_info = {
    "name": "MIT",
    "url": "https://opensource.org/licenses/MIT"
}
```

## Complete Example

Here's a comprehensive configuration file showing all available options:

```python
# config.py
# ============================================================
# Application Settings
# ============================================================
app_name = "My Production API"
debug = False
version = "2.0.0"
description = "Production API for my application"

# ============================================================
# CORS Settings
# ============================================================
cors_enabled = True
cors_origins = ["https://example.com", "https://api.example.com"]
cors_allow_credentials = True
cors_allow_methods = ["GET", "POST", "PUT", "DELETE"]
cors_allow_headers = ["Authorization", "Content-Type"]

# ============================================================
# Directory Settings
# ============================================================
route_dir = "routes"
static_dir = "public"
static_directory_listing = False

# ============================================================
# Documentation Settings
# ============================================================
docs_enabled = True
openapi_url = "/openapi.json"
contact = {
    "name": "API Support",
    "email": "support@example.com"
}

# ============================================================
# Server Settings
# ============================================================
server = {
    "host": "0.0.0.0",
    "port": 8080,
    "workers": 4,
    "timeout_keep_alive": 10,
    "limit_concurrency": 1000,
}

# ============================================================
# Logging Settings
# ============================================================
logging = {
    "level": "INFO",
    "format": "[%Y-%m-%dT%H:%M:%S%z]",
    "color": True,
    "production_level": "WARNING"
}

# ============================================================
# Build Settings
# ============================================================
build = {
    "cache_dir": ".cache",
    "compression_level": 6,
    "exclude_patterns": ["test_*", "*.pyc", "__pycache__"]
}

# ============================================================
# Custom Commands
# ============================================================
commands = {
    "deploy": "fastapi-route build && fastapi-route run",
    "dev": "fastapi-route dev --port 3000",
    "prod": "fastapi-route run --port 8080 --workers 4",
    "test": "pytest tests/ -v --cov=myapp",
    "clean": "fastapi-route clean && rm -rf __pycache__ .pytest_cache"
}
```

## Configuration Precedence

FastAPI Route follows this order when determining configuration values (later sources override earlier ones):

1. **Default values** - Built into the framework
2. **config.py file** - User-defined configuration
3. **Command-line arguments** - CLI flags like `--port` and `--host`

This means you can set defaults in `config.py` and override them temporarily with CLI arguments when needed.

## Next Steps

- [Custom Handlers](/docs/0.1.1/advanced/custom-handlers) - Create custom documentation and 404 pages
- [Error Handling](/docs/0.1.1/advanced/error-handling) - Handle HTTP errors gracefully
- [Build System](/docs/0.1.1/advanced/build-system) - Optimize your production deployment
