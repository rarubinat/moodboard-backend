# 🧠 Moodboard Backend

This is a simple backend for a **moodboard** (inspiration board) application. It allows storing and retrieving items like images, text, or links. Built with **Node.js** and **Express**, this backend uses in-memory storage (non-persistent).

🌐 **Live API base URL on Render:**  
[https://moodboard-backend-4kze.onrender.com/api/items](https://moodboard-backend-4kze.onrender.com/api/items)

---

## 🚀 Technologies Used

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [CORS](https://www.npmjs.com/package/cors)
- [Supabase (PostgreSQL)](https://supabase.com/)
- [pg](https://www.npmjs.com/package/pg) – PostgreSQL client
- [dotenv](https://www.npmjs.com/package/dotenv)
- [Render](https://render.com/) – for deployment

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
3. Update github
    ```bash
    git add .
    git commit -m
    git pull origin master --rebase
   ```

---

## 📁 Database
This backend uses Supabase as a hosted PostgreSQL database to persist moodboard items (Replace with your actual Supabase credentials) and use **.env** file to save.
   ```bash
   PORT=3000
   DATABASE_URL=postgresql://<your-username>:<your-password>@<your-host>.supabase.co:5432/postgres
   ```

The following SQL command was used to create the **moodboard_items** table:
   ```bash
   CREATE TABLE moodboard_items (
   id SERIAL PRIMARY KEY,
   type TEXT NOT NULL,
   content TEXT NOT NULL
   );
   ```

## 🔌 Integration

- The backend connects to Supabase using the pg library.
- The database connection string is stored in **.env** as **DATABASE_URL**.
- All moodboard items are read from and written to the PostgreSQL database.

## ☁️ Deployment on Render

The backend is deployed to Render via GitHub integration. Every time you push changes to the GitHub repository, Render automatically redeploys the updated backend.

Steps to deploy on Render:

- Create a new Web Service in Render.
- Connect your GitHub repo.
- Set the build command (if any) and start command **node server.js**
- Add the DATABASE_URL environment variable under Environment > Environment Variables.
- Deploy!

---

## ⚠️ Notes
This project uses in-memory storage, so all data is lost when the server restarts.
CORS is enabled to allow frontend apps (e.g. Angular on localhost:4200) to interact with the API.

## 🧪 Development Tips
- Use tools like Postman or curl to test endpoints with **GET /api/items** and **POST /api/items** using json.

      ´´´bash
      {
      "type": "image",
      "content": "https://example.com/image.jpg"
      }
      ´´´

- Log database errors to debug connectivity issues.

- Use Supabase’s Table Editor, pgAdmin, or DBeaver to explore your data.

- Log errors in the backend to catch database or network issues.

- If you want to view or edit the database, you can use Supabase’s Table Editor or connect with a PostgreSQL client like pgAdmin or DBeaver.

---

## 🛠️ Contributing
Feel free to fork this project, use it as a template or build upon it. Pull Requests are welcome!

## 📄 License
This project is licensed under the MIT License.
© 2025 [rarubinat](https://github.com/rarubinat)