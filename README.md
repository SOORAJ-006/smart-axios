# SmartAxios

A lightweight wrapper around **Axios** that adds automatic retries, logging, and helpful utilities — all with zero configuration required.

This package improves the stability of your HTTP requests by adding:
- Retry handling for network & 5xx errors
- Delay between retries
- Clean colored logs using `chalk`
- Typed helper methods (`get`, `post`, `put`, `delete`)

---

## 🚀 Installation

```bash
npm install smart-axios-request
```

or

```bash
yarn add smart-axios-request
```

---

## 📘 Basic Usage

```ts
import { SmartAxios } from "smart-axios-request";

const api = new SmartAxios({
  baseURL: "https://api.example.com",
  maxRetries: 3,
  retryDelay: 500,
});

api.get("/users").then((res) => console.log(res.data));
```

---

## 🛠️ SmartAxios Options

### SmartAxiosConfig (extends AxiosRequestConfig)

| Option       | Type      | Default | Description |
|--------------|-----------|---------|-------------|
| `maxRetries` | `number`  | `3`     | Number of retry attempts before failing |
| `retryDelay` | `number`  | `500`ms | Time between retries (ms) |
| All Axios options | — | — | Can pass any valid Axios config |

Example:

```ts
const api = new SmartAxios({
  baseURL: "https://example.com",
  maxRetries: 5,
  retryDelay: 1000,
});
```

---

## 📡 Request Example

```ts
const response = await api.request({
  url: "/posts",
  method: "GET",
  maxRetries: 4, // overrides class-level settings
});
```

---

## 🔁 Retry Rules

SmartAxios retries the request ONLY when:
- Network errors occur
- Server responds with a **5xx error** (`500–599`)

It **does NOT retry** on:
- 4xx client errors (e.g., 400, 401, 404)

Example log output:
```
[HTTP Attempt 1] → GET /users
[Retry #2] /users after 500ms
[Retry #3] /users after 500ms
[Failed after 3 retries] /users
```

---

## 📦 Helper Methods

SmartAxios includes standard HTTP shortcuts.

### GET
```ts
api.get("/users");
```

### POST
```ts
api.post("/users", { name: "John" });
```

### PUT
```ts
api.put("/users/1", { name: "Updated" });
```

### DELETE
```ts
api.delete("/users/1");
```

---

## 🎯 Full Example

```ts
import { SmartAxios } from "smart-axios-request";

const client = new SmartAxios({
  baseURL: "https://jsonplaceholder.typicode.com",
  maxRetries: 3,
  retryDelay: 700,
});

async function demo() {
  try {
    const res = await client.get("/posts/1");
    console.log(res.data);
  } catch (error) {
    console.error("Request failed:", error.message);
  }
}

demo();
```

---

## 🧩 How It Works

### 1. Logs request attempt
```ts
[HTTP Attempt 1] → GET /url
```

### 2. On failure, checks if retryable
Retryable: network or 5xx status.

### 3. Retries with delay
```ts
[Retry #2] /url after 500ms
```

### 4. Throws final error after max retries

---

## 📚 TypeScript Support
The library is fully written in TypeScript and provides:
- Strong typing for all methods
- Generic support for responses

```ts
interface User {
  id: number;
  name: string;
}

const res = await api.get<User>("/user/1");
console.log(res.data.id);
```

---

## 📝 Changelog

### v1.0.0
- Initial release
- Retry handling
- Logging
- Basic helper methods

---

## 🤝 Contributing
Pull requests are welcome! Feel free to open an issue for improvements.

---

## 📄 License
MIT License © 2025
