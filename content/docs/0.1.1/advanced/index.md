---
title: Advanced Features
description: Advanced features including build system, configuration, custom handlers, and error handling
order: 11
---

# Advanced Features

FastAPI Route includes several advanced features designed for production-ready applications. These features give you fine-grained control over performance, security, and user experience.

## Build System & Cache

The build system pre-compiles your routes into an optimized cache. This eliminates filesystem scanning at startup and significantly reduces memory usage.

**Key benefits:**

- Compressed route metadata (up to 70% reduction)
- 5-10x faster production startup times
- Optional cache encryption for security
- Build-time route validation catches errors before deployment

```bash
# Build the production cache
fastapi-route build

# Run using the cached routes
fastapi-route run

# Check build status
fastapi-route status

# Clean the cache
fastapi-route clean
```

## Advanced Configuration

The `config.py` file gives you complete control over every aspect of your application:

**Server settings** - Host, port, workers, timeouts, concurrency limits
**Logging settings** - Log levels, timestamp format, colored output
**Build settings** - Compression level, cache location, exclude patterns
**CORS settings** - Origins, methods, headers, credentials
**Custom CLI commands** - Project-specific shortcuts

## Custom Handlers

Replace built-in functionality with your own implementations:

**Custom documentation** - Create `docs.py` to design your own API documentation page with access to route data and statistics.

**Custom 404 page** - Create `not-found.py` to provide branded error pages with helpful suggestions for users.

Both custom handlers receive a `context` object that gives you access to all registered routes, statistics, and configuration.

## Error Handling

FastAPI Route provides comprehensive error handling:

**HTTP Exceptions** - Raise `HTTPException` or use built-in classes like `NotFoundException`, `UnauthorizedException`, and `BadRequestException`.

**Development error pages** - Beautiful error pages with syntax highlighting, line numbers, and helpful suggestions when `debug = True`.

**Custom error pages** - Create `not-found.py` for custom 404 pages.

**Exception handling middleware** - Catch and handle errors globally in `middleware.py`.

## Comparison Summary

| Feature         | Development                    | Production            |
| --------------- | ------------------------------ | --------------------- |
| Route Discovery | Filesystem scan                | Build cache           |
| Startup Time    | Slower (scans all files)       | Fast (loads cache)    |
| Error Pages     | Detailed (syntax highlighting) | Minimal (security)    |
| Logging         | Verbose (INFO level)           | Quiet (WARNING level) |
| Hot Reload      | Enabled                        | Disabled              |

## Next Steps

- [Build System](/docs/0.1.1/advanced/build-system) - Learn about the production build process in depth
- [Configuration](/docs/0.1.1/advanced/configuration) - Explore all configuration options
- [Custom Handlers](/docs/0.1.1/advanced/custom-handlers) - Create custom documentation and 404 pages
- [Error Handling](/docs/0.1.1/advanced/error-handling) - Handle errors gracefully with HTTP exceptions
