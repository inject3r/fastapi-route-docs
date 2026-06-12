---
title: Route Groups
description: Organize routes with parentheses without affecting URL paths
order: 8
---

# Route Groups

When you're building a large API, you need ways to organize your code without changing your public URL structure. Route groups let you create organizational folders that are completely ignored when generating URL paths.

## Basic Syntax

Any folder name wrapped in parentheses `(group)` is treated as a route group. These folders help you organize your code but never appear in the final URL:

```plaintext
routes/
└── (auth)/
    ├── login/
    │   └── route.py        # Handles /login
    └── register/
        └── route.py        # Handles /register
```

Even though `(auth)` is a folder in your project, it does not appear in the URL path. Both endpoints are accessible at the root level: `/login` and `/register`.

## Why Use Route Groups?

Route groups solve a common problem: you want to organize related routes together in your file system, but you don't want those organization folders to become part of your API URL.

**Without route groups:**
```plaintext
routes/
├── auth/
│   ├── login/route.py      # /auth/login (undesired)
│   └── register/route.py   # /auth/register (undesired)
```

**With route groups:**
```plaintext
routes/
└── (auth)/
    ├── login/route.py      # /login (clean)
    └── register/route.py   # /register (clean)
```

## API Versioning

Organize multiple API versions without cluttering your URLs:

```plaintext
routes/
└── (api)/
    ├── v1/
    │   └── users/
    │       └── route.py    # /v1/users
    └── v2/
        └── users/
            └── route.py    # /v2/users
```

The `(api)` folder is ignored. Only `v1` and `v2` appear in the URL path.

## Feature-based Organization

Group routes by feature or team responsibility:

```plaintext
routes/
├── (auth)/
│   ├── login/route.py
│   ├── register/route.py
│   ├── logout/route.py
│   └── password-reset/route.py
├── (dashboard)/
│   ├── analytics/route.py
│   ├── reports/route.py
│   └── settings/route.py
├── (public)/
│   ├── about/route.py
│   ├── contact/route.py
│   └── pricing/route.py
└── (admin)/
    ├── users/route.py
    ├── logs/route.py
    └── metrics/route.py
```

URLs remain clean and intuitive:
- `/login`, `/register`, `/logout`, `/password-reset`
- `/analytics`, `/reports`, `/settings`
- `/about`, `/contact`, `/pricing`
- `/users`, `/logs`, `/metrics`

## Nested Route Groups

You can nest groups inside other groups. Each group folder is ignored, regardless of nesting depth:

```plaintext
routes/
└── (api)/
    └── (v1)/
        └── (internal)/
            └── health/
                └── route.py    # /health
```

Despite three levels of grouping folders, the URL is simply `/health`.

## Combining Groups with Dynamic Routes

Route groups work seamlessly with dynamic routes:

```plaintext
routes/
└── (api)/
    └── v1/
        └── users/
            └── [user_id]/
                └── orders/
                    └── [order_id]/
                        └── route.py
```

URL: `/v1/users/{user_id}/orders/{order_id}`

The `(api)` group is ignored, but the dynamic parameters work normally.

## Real-world Example

Here's a complete project structure showing how route groups can organize a real application:

```plaintext
my-api/
├── routes/
│   ├── (public)/
│   │   ├── index.py                    # GET /
│   │   ├── about/route.py              # GET /about
│   │   └── contact/route.py            # GET /contact
│   ├── (auth)/
│   │   ├── login/route.py              # POST /login
│   │   ├── register/route.py           # POST /register
│   │   └── verify/route.py             # GET /verify
│   ├── (dashboard)/
│   │   ├── profile/route.py            # GET, PUT /profile
│   │   ├── settings/route.py           # GET, PUT /settings
│   │   └── notifications/route.py      # GET /notifications
│   ├── (api)/
│   │   └── v1/
│   │       ├── users/
│   │       │   ├── route.py            # GET, POST /v1/users
│   │       │   └── [user_id]/
│   │       │       └── route.py        # GET, PUT, DELETE /v1/users/{user_id}
│   │       └── products/
│   │           ├── route.py            # GET, POST /v1/products
│   │           └── [product_id]/
│   │               └── route.py        # GET, PUT, DELETE /v1/products/{product_id}
│   └── (admin)/
│       ├── users/route.py              # GET, DELETE /admin/users
│       ├── logs/route.py               # GET /admin/logs
│       └── metrics/route.py            # GET /admin/metrics
├── middleware.py
└── config.py
```

This structure keeps related code together while maintaining a clean, logical URL hierarchy.

## Best Practices

1. **Use meaningful group names** - `(auth)`, `(api)`, `(dashboard)` clearly indicate purpose
2. **Don't overuse** - Groups are for organization, not every folder needs to be a group
3. **Keep groups shallow** - Too many nested groups can make the structure hard to navigate
4. **Combine with dynamic routes** - Groups work perfectly with `[param]` syntax
5. **Use for feature flags** - Group experimental features for easy removal later

## Common Patterns

**Separating public and authenticated routes:**
```plaintext
routes/
├── (public)/      # No auth required
└── (private)/     # Auth middleware applies
```

**Organizing by domain:**
```plaintext
routes/
├── (billing)/
├── (user-management)/
└── (analytics)/
```

**Version isolation:**
```plaintext
routes/
├── (stable)/
│   └── v1/
└── (experimental)/
    └── v2/
```

## Next Steps

- [HTTP Methods](/docs/core-concepts/http-methods) - Handle different request types in your routes
- [Middleware](/docs/core-concepts/middleware) - Add authentication to protected route groups
- [Dynamic Routes](/docs/core-concepts/dynamic-routes) - Combine groups with dynamic parameters