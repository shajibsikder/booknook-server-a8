# 📚 BookNook Server (Express.js & MongoDB)

Backend API server for **BookNook – A Small Online Library**, built with Express.js, MongoDB Native Driver, and JWT Authorization.

Variant: `B14-A8-Cat_Ron`

## 🚀 Features & Endpoints

- **GET /books** - Retrieve all books (supports category filter, newest sorting, and limit query)
- **GET /books/:id** - Get details for a specific book
- **POST /books** - Add a new book (Protected with JWT)
- **PATCH /books/:id** - Update book details (Protected with JWT)
- **DELETE /books/:id** - Delete a book (Protected with JWT)
- **POST /borrows** - Borrow a book (Protected: Decrements copies via `$inc`, Prevents double borrow)
- **GET /borrows** - Get list of borrowed books for the logged-in user
- **DELETE /borrows/:id** - Return a borrowed book (Increments copies via `$inc`)
- **POST /jwt** - Issue JWT token on login
- **POST /logout** - Clear auth cookie

## 🛠️ Environment Variables

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=booknook_db
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
```

## 📦 Run Locally

```bash
npm install
npm run dev
```

To seed initial books into your database:
```bash
npm run seed
```
