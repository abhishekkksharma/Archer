### What changed

Your old structure:

```text
Node
├── id
├── type
├── label
├── description
├── technology
├── category
└── position
```

is now:

```text
Node
├── id
├── type
├── position
├── width
├── height
├── parentId
└── data
    ├── label
    ├── description
    ├── category
    ├── technology
    ├── technologies[]
    ├── icon
    ├── color
    └── properties{}
```

This is much easier to extend.

For example, a MongoDB node can be:

```json
{
  "id": "mongodb-1",
  "type": "database",
  "position": {
    "x": 800,
    "y": 400
  },
  "data": {
    "label": "Primary Database",
    "description": "Stores application data",
    "category": "database",
    "technology": "MongoDB",
    "technologies": [
      "MongoDB",
      "MongoDB Atlas"
    ],
    "icon": "mongodb"
  }
}
```

And an HTTP connection can contain actual flow information:

```json
{
  "id": "frontend-api",
  "source": "frontend",
  "target": "api",
  "sourceHandle": "right",
  "targetHandle": "left",
  "label": "POST /api/login",
  "type": "http",
  "animated": true,
  "data": {
    "protocol": "HTTPS",
    "method": "POST",
    "dataType": "JSON",
    "direction": "request"
  }
}
```

So visually you could show:

```text
┌──────────────┐
│   Frontend   │
│   Next.js    │
└──────┬───────┘
       │
       │ POST /api/login
       │ HTTPS • JSON
       ▼
┌──────────────┐
│ API Server   │
│ Express      │
└──────┬───────┘
       │
       │ MongoDB Query
       ▼
┌──────────────┐
│   MongoDB    │
└──────────────┘
```

And importantly, I've added:

```ts
viewport
```

so you can save:

```json
{
  "x": -150,
  "y": 80,
  "zoom": 1.2
}
```

When the user leaves the architecture page and comes back, their canvas can open exactly where they left it.

I also kept `properties: Record<string, unknown>` so you don't have to modify the MongoDB schema every time you introduce something new. For example, a load balancer could eventually have:

```json
"properties": {
  "algorithm": "round-robin",
  "healthChecks": true
}
```

while a database could have:

```json
"properties": {
  "replication": "3-node",
  "backup": "daily"
}
```

That gives you a good foundation for the **React Flow + Next.js architecture editor** and, later, the **AI → architecture JSON → editable canvas** pipeline.