---
title: Installation
description: Install FastAPI Route with pip, poetry, or from source
order: 2
---

# Installation

Installing FastAPI Route is straightforward. Choose the method that works best for your workflow.

## Using pip

The recommended way to install FastAPI Route is with pip. This will install the core package along with FastAPI and Uvicorn as dependencies.

```bash
pip install fastapi-route
```

## With development dependencies

If you're planning to contribute or need testing tools, install the development dependencies:

```bash
pip install fastapi-route[dev]
```

This includes pytest, pytest-cov, black, mypy, isort, and ruff for code quality.

## Using poetry

For projects using Poetry for dependency management:

```bash
poetry add fastapi-route
```

## Verify installation

To confirm everything is working correctly, run this Python code:

```python
import fastapi_route
print(fastapi_route.__version__)
```

You should see the version number printed without any errors.

## Requirements

- **Python**: 3.8 or higher
- **FastAPI**: 0.68.0 or higher (automatically installed)
- **Uvicorn**: For running the server (automatically installed)

FastAPI Route works on Linux, macOS, and Windows.

## Next Steps

- [Quick Start](/docs/0.1.1/getting-started/quick-start) - Build your first API in minutes
- [Project Structure](/docs/0.1.1/getting-started/project-structure) - Learn the folder layout and conventions
