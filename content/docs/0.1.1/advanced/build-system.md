---
title: Build System
description: Production build system with compression and cache
order: 12
---

# Build System

FastAPI Route includes a sophisticated build system that pre-compiles your routes into an optimized cache. In production, the application loads from this cache instead of scanning the filesystem, resulting in dramatically faster startup times and reduced memory usage.

## Why a Build System?

When you run `fastapi-route dev`, FastAPI Route scans your entire `routes/` directory on every request to enable hot reload. This is convenient during development but inefficient for production.

The build system solves this by:

1. **Pre-scanning** - All routes are discovered once during build
2. **Compressing** - Route metadata is compressed with zlib
3. **Caching** - The compressed data is stored in a cache directory
4. **Fast loading** - Production server loads the cache instead of scanning

The result: production startup can be 5-10 times faster, especially for projects with hundreds of routes.

## Build Commands

### Build the Cache

```bash
fastapi-route build
```

This command scans your routes, validates them, compresses the metadata, and saves everything to the `.cache/` directory.

### Force Rebuild

```bash
fastapi-route build --force
```

Use this when you suspect the cache is corrupted or you want to ensure a completely fresh build. It deletes the existing cache before building.

### Custom Compression Level

```bash
fastapi-route build --compression 9
```

Adjust the zlib compression level to balance build time vs cache size.

### Run Production Server

```bash
fastapi-route run
```

The production server loads routes from the cached data. If no valid cache exists, it exits with an error.

### Check Build Status

```bash
fastapi-route status
```

Displays information about the existing build cache, including creation time, route counts, and compression statistics.

### Clean the Cache

```bash
fastapi-route clean
```

Deletes the entire `.cache/` directory. You'll need to rebuild before running the production server again.

## How the Build Process Works

When you run `fastapi-route build`, the following steps happen:

### 1. Load Configuration

FastAPI Route reads your `config.py` file to understand your project settings, including the routes directory location and compression preferences.

### 2. Scan Routes

The system walks through every file in your `routes/` directory, identifying route files and extracting:

- URL paths from folder structure
- HTTP methods from function names
- Parameter names from dynamic `[param]` folders
- File locations for each handler

### 3. Validate Routes

Before building, FastAPI Route checks for:

- Duplicate HTTP methods in the same file (two `GET` functions)
- Duplicate routes across different files (same method and path)
- Invalid handler signatures (missing `request` parameter)
- Circular references in route groups

If any validation errors are found, the build fails and the errors are displayed with file paths and line numbers.

### 4. Compress Metadata

All route metadata is serialized and compressed using zlib. The compression level determines the trade-off between build time and final cache size.

### 5. Save to Cache

The compressed data is written to the `.cache/` directory along with a manifest file containing build metadata.

## Compression Levels

Zlib compression levels range from 1 to 9, offering different trade-offs:

| Level | Speed    | Compression Ratio             | Best For                       |
| ----- | -------- | ----------------------------- | ------------------------------ |
| 1     | Fastest  | Lowest (minimal compression)  | Development builds             |
| 3     | Fast     | Low                           | Quick production builds        |
| 6     | Balanced | Good (default)                | Most production deployments    |
| 7     | Slow     | Very good                     | Large projects (1000+ routes)  |
| 9     | Slowest  | Highest (maximum compression) | Space-constrained environments |

The default level of 6 provides a good balance for most projects. Higher levels give diminishing returns while significantly increasing build time.

## Cache Directory Structure

The `.cache/` directory contains:

```plaintext
.cache/
├── routes.dat          # Compressed route metadata (pickle + zlib)
├── manifest.json       # Build information and statistics
└── .gitignore          # Prevents the cache from being committed
```

The `manifest.json` file includes:

- Build timestamp
- FastAPI Route version
- Total number of routes
- Counts of static vs dynamic routes
- Compression level and ratio
- Cache directory location

## Production Startup Flow

When you run `fastapi-route run`, the production server:

1. Checks if `.cache/` exists and contains valid data
2. Reads the manifest to verify version compatibility
3. Decompresses and deserializes the route metadata
4. Dynamically imports handler functions from the original source files
5. Registers all routes with FastAPI
6. Starts the server

Because the route discovery and validation steps are skipped, startup is significantly faster.

## Build Status Command

The `status` command gives you a quick overview of your build cache:

```bash
fastapi-route status
```

Sample output:

```
============================================================
BUILD STATUS
============================================================
  Status:        Built
  Created:       2026-01-15T14:30:22.123456
  Total routes:  42
  Static routes: 35
  Dynamic routes:7
  Cache size:    18.34 KB
  Cache path:    /home/user/my-api/.cache
============================================================
```

## When to Rebuild

You need to rebuild the cache whenever:

- You add, remove, or rename any route files
- You change the structure of dynamic parameters
- You modify the routes directory path in configuration
- After running `fastapi-route clean`

You do NOT need to rebuild when:

- You change the content of handler functions (the function bodies)
- You modify middleware or custom handlers
- You change static files in the `public/` directory

## CI/CD Integration

In your deployment pipeline, run:

```bash
# Install dependencies
pip install fastapi-route

# Build the cache
fastapi-route build

# Verify the build succeeded
fastapi-route status

# Start the production server
fastapi-route run --host 0.0.0.0 --port 8080
```

If the build fails, the pipeline should stop and report the validation errors so you can fix them before deployment.

## Troubleshooting

### "No valid build found" error

This means you're trying to run `fastapi-route run` without a valid cache. Run `fastapi-route build` first.

### Build fails with validation errors

FastAPI Route found structural problems in your routes. Check the error messages for file paths and line numbers, fix the issues, and rebuild.

### Cache is corrupted

Run `fastapi-route clean` followed by `fastapi-route build --force` to create a fresh cache.

### Build is slow

Lower the compression level with `--compression 3` for faster builds at the cost of larger cache size.

## Next Steps

- [Configuration](/docs/0.1.1/advanced/configuration) - Customize build settings in config.py
- [Custom Handlers](/docs/0.1.1/advanced/custom-handlers) - Add custom documentation and 404 pages
- [Error Handling](/docs/0.1.1/advanced/error-handling) - Learn about HTTP exceptions and error responses
