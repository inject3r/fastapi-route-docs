---
title: Getting Started
description: Learn how to use FastAPI Route to build APIs with file-based routing
order: 1
---

# Getting Started

FastAPI Route introduces file-based routing to FastAPI. Instead of writing decorators for every endpoint, you just create files and folders.

## Quick Overview

FastAPI Route converts your file structure into API routes automatically:

- `routes/index.py` → `GET /`, `POST /`
- `routes/users/route.py` → `GET /users`, `POST /users`
- `routes/users/[user_id]/route.py` → `GET /users/{user_id}`

## Key Features

- **File-based Routing** - Routes defined by folder structure, no decorators needed
- **Hot Reload** - Instant reload on any file change
- **Build Cache System** - Production build with compression for faster startup
- **Middleware Support** - Single file for authentication, logging, rate limiting
- **Auto Documentation** - Interactive docs at `/docs` with all routes
- **Beautiful Error Pages** - Syntax highlighting and line numbers for debugging

## Requirements

- Python 3.8 or higher
- FastAPI (auto-installed with FastAPI Route)

## Next Steps

- [Installation](/docs/0.1.1/getting-started/installation) - Install FastAPI Route
- [Quick Start](/docs/0.1.1/getting-started/quick-start) - Build your first API
- [Project Structure](/docs/0.1.1/getting-started/project-structure) - Understand the folder layout
