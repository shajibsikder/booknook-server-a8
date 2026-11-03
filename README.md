# BookNook Server

Backend API server for BookNook - Online Library application, built with Express.js and MongoDB.

## Features and Endpoints

- GET /books - Get all books with optional category filter, sorting, and limit.
- GET /books/:id - Get details of a single book.
- POST /books - Add a new book (requires authentication).
- PATCH /books/:id - Update book details (requires authentication).
- DELETE /books/:id - Delete a book from catalog (requires authentication).
- POST /borrows - Borrow a book, decrements total copies and prevents double borrow.
- GET /borrows - Get all books borrowed by the logged-in user.
- DELETE /borrows/:id - Return a borrowed book and increments total copies.
- POST /jwt - Issue JWT token on user login.
- POST /logout - Clear authentication cookie.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JSON Web Token (JWT)
- Cookie Parser
- CORS
- Dotenv
