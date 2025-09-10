````markdown
# 🚀 URL Shortener

A simple and fast **URL Shortener** built with **Node.js** and **Express.js**.  
It takes a long URL and generates a short one that redirects back to the original link.

---

## ✨ Features
- 🔗 Shorten any long URL into a compact one  
- 🚀 Built with **Node.js** and **Express.js**  
- 📦 Lightweight and easy to set up  
- ⚡ Fast redirection to original URLs  
- 🛠️ Easily extendable for custom domains or analytics  

---

## 🛠️ Tech Stack
- **Node.js** – JavaScript runtime for the backend  
- **Express.js** – Web framework for handling routes and middleware  

---

## 📂 Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/url-shortener.git
````

### 2. Navigate into the Project

```bash
cd url-shortener
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Server

```bash
npm --watch ./app.js
```

By default, the server will start on **[http://localhost:3000](http://localhost:3000)**

---



---

## 📌 Example Usage

### 1. Shorten a URL

**Request**

```http
POST http://localhost:3000/shorten
Content-Type: application/json

{
  "originalUrl": "https://www.example.com/very/long/url/path"
}
```

**Response**

```json
{
  "shortUrl": "http://localhost:3000/abc123",
  "originalUrl": "https://www.example.com/very/long/url/path"
}
```

---

### 2. Redirect to Original

**Request**

```http
GET http://localhost:3000/abc123
```

**Response**
Redirects to `https://www.example.com/very/long/url/path`

---
