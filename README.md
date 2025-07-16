# 🧠 Moodboard Backend

This is a simple backend for a **moodboard** (inspiration board) application. It allows storing and retrieving items like images, text, or links. Built with **Node.js** and **Express**, this backend uses in-memory storage (non-persistent).

🌐 **Live API base URL on Render:**  
[https://moodboard-backend-4kze.onrender.com/api/items](https://moodboard-backend-4kze.onrender.com/api/items)

---

## 🚀 Technologies Used

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [CORS](https://www.npmjs.com/package/cors)

---

## 📦 Local development

1. Install
   ```bash
   npm install
   node server.js
   ```
2. PostgreSQL connection
   ```bash
   npm install pg
   npm install pg dotenv
   ```

---

## ⚠️ Notes

This project uses in-memory storage, so all data is lost when the server restarts.

CORS is enabled to allow frontend apps (e.g. Angular on localhost:4200) to interact with the API.

---

## 🛠️ Contributing
Feel free to fork this project, use it as a template or build upon it. Pull Requests are welcome!

## 📄 License
This project is licensed under the MIT License.
© 2025 [rarubinat](https://github.com/rarubinat)