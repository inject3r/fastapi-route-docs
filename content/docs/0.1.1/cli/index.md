---
title: CLI Commands
description: All FastAPI Route CLI commands
order: 19
---

# CLI Commands

FastAPI Route includes a complete command-line interface for project management, development, building, and production deployment. All commands are accessible through the `fastapi-route` executable after installation.

## init

Initialize a new FastAPI Route project with the standard folder structure and default configuration files.

```bash
fastapi-route init
fastapi-route init my-project
```

When you run this command, FastAPI Route creates:

- A `routes/` directory with a sample `index.py` route file
- A `config.py` file with comprehensive configuration options
- A `public/` directory for static assets
- A `.gitignore` file optimized for FastAPI Route projects

If you provide a project name, FastAPI Route creates a new directory with that name. Otherwise, it initializes the current directory.

## dev

Start the development server with hot reload enabled. This is what you'll use during active development.

```bash
fastapi-route dev
fastapi-route dev --port 3000
fastapi-route dev --host 0.0.0.0
fastapi-route dev --port 3000 --host 0.0.0.0
```

The development server:

- Automatically watches for changes in `routes/`, `config.py`, `middleware.py`, and custom handlers
- Rebuilds the application instantly when files change
- Provides beautiful error pages with syntax highlighting and line numbers
- Shows detailed build information and route statistics

The default host is `127.0.0.1` and the default port is `8000`.

## build

Compile your routes into an optimized production cache. This command must be run before deploying to production.

```bash
fastapi-route build
fastapi-route build --force
fastapi-route build --compression 9
```

The build process:

1. Loads your configuration from `config.py`
2. Scans all route files in the `routes/` directory
3. Validates route structure and detects conflicts
4. Compresses route metadata using zlib (configurable level 1-9)
5. Creates a `.cache/` directory with the compiled cache

**Options:**

- `--force` - Clear existing cache before building (use when you suspect cache corruption)
- `--compression` - Set compression level from 1 (fastest, largest) to 9 (slowest, smallest). Default is 6.

Compression level affects build time and cache size. Higher levels produce smaller caches but take longer to build.

## run

Start the production server using the previously built cache. This command requires that you've run `fastapi-route build` first.

```bash
fastapi-route run
fastapi-route run --port 8080
fastapi-route run --host 0.0.0.0 --port 443
```

The production server:

- Loads routes from the `.cache/` build cache (much faster than filesystem scanning)
- Minimizes logging output (only warnings and errors)
- Optimizes memory usage for production workloads
- Uses the worker count and settings from `config.py`

If no valid build cache exists, the command exits with an error and instructs you to run `fastapi-route build` first.

## clean

Remove the build cache directory entirely. Use this to force a full rebuild or free up disk space.

```bash
fastapi-route clean
```

This command deletes the entire `.cache/` directory. After cleaning, you'll need to run `fastapi-route build` again before using `fastapi-route run`.

## status

Display information about the current build cache, if one exists.

```bash
fastapi-route status
```

The status output includes:

- Whether a valid build cache exists
- When the cache was created
- Total number of routes in the cache
- Count of static vs dynamic routes
- Cache size and compression ratio
- Cache directory location

## Complete Command Reference

| Command  | Description                              | When to Use                               |
| -------- | ---------------------------------------- | ----------------------------------------- |
| `init`   | Create new project structure             | Starting a new project                    |
| `dev`    | Start development server with hot reload | During active development                 |
| `build`  | Compile routes into production cache     | Before deployment                         |
| `run`    | Start production server                  | After building, in production             |
| `clean`  | Remove build cache                       | When cache is corrupted or for cleanup    |
| `status` | Show build cache information             | To verify build success before deployment |

## Command Options Summary

| Command | Option          | Description                          | Default           |
| ------- | --------------- | ------------------------------------ | ----------------- |
| `init`  | `[name]`        | Project name (creates new directory) | Current directory |
| `dev`   | `--port`        | Port number to bind                  | 8000              |
| `dev`   | `--host`        | Host address to bind                 | 127.0.0.1         |
| `build` | `--force`       | Clear cache before building          | Disabled          |
| `build` | `--compression` | Compression level (1-9)              | 6                 |
| `run`   | `--port`        | Port number to bind                  | 8000              |
| `run`   | `--host`        | Host address to bind                 | 0.0.0.0           |

## Custom Commands

You can define your own CLI commands in `config.py` using the `commands` dictionary. These commands become available directly through the `fastapi-route` command line.

Example `config.py`:

```python
commands = {
    "deploy": "fastapi-route build && rsync -avz .cache/ deploy/",
    "test": "pytest tests/",
    "lint": "ruff check .",
    "format": "black ."
}
```

After defining these, you can run:

```bash
fastapi-route deploy
fastapi-route test
fastapi-route lint
fastapi-route format
```

This is a powerful way to create project-specific shortcuts without writing shell scripts.

## Exit Codes

- `0` - Command completed successfully
- `1` - Command failed (build error, invalid configuration, missing cache, etc.)

You can use these exit codes in CI/CD pipelines to detect failures.

## Next Steps

- [Getting Started](/docs/getting-started) - Learn the basics
- [Quick Start](/docs/getting-started/quick-start) - Build your first API in minutes
- [Build System](/docs/advanced/build-system) - Understand the production build process in depth
