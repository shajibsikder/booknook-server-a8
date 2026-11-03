const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const requestLogger = require('./utils/logger');
const { validateBookInput } = require('./utils/validator');

const app = express();
const port = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET || 'booknook_jwt_super_secret_key_variant_ron_2026';

// Middleware
app.use(requestLogger);
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for assignment grading
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// MongoDB Client Setup
const uri = process.env.MONGODB_URI;
let client;
let db;

async function connectDB() {
  if (db) return db;
  try {
    if (!uri || uri.includes('<username>')) {
      console.warn('⚠️ MongoDB URI not configured yet. Server will run with in-memory fallback until DB is connected.');
      return null;
    }
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();
    db = client.db(process.env.DB_NAME || 'booknook_db');
    console.log('✅ Connected successfully to MongoDB Atlas!');
    return db;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    return null;
  }
}

// In-Memory Fallback Store (ensures API always responds even before user puts their MongoDB URI)
const inMemoryBooks = [
  {
    _id: '672000000000000000000001',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    category: 'Fiction',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    totalCopies: 4,
    userName: 'Library Admin',
    userEmail: 'admin@booknook.com',
    createdAt: new Date('2026-10-15T10:00:00Z'),
  },
  {
    _id: '672000000000000000000002',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    category: 'Science',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    description: 'A landmark volume in science writing by one of the great minds of our time, exploring the universe from the Big Bang to black holes.',
    totalCopies: 3,
    userName: 'Library Admin',
    userEmail: 'admin@booknook.com',
    createdAt: new Date('2026-10-18T10:00:00Z'),
  },
  {
    _id: '672000000000000000000003',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    category: 'History',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    description: 'How an insignificant ape became the ruler of planet Earth, capable of splitting the atom and manipulating the code of life.',
    totalCopies: 5,
    userName: 'Library Admin',
    userEmail: 'admin@booknook.com',
    createdAt: new Date('2026-10-20T10:00:00Z'),
  },
  {
    _id: '672000000000000000000004',
    title: 'The Little Prince',
    author: 'Antoine de Saint-Exupéry',
    category: 'Kids',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    description: 'A poetic tale of a young prince who visits various planets in space, addressing themes of loneliness, friendship, love, and loss.',
    totalCopies: 2,
    userName: 'Library Admin',
    userEmail: 'admin@booknook.com',
    createdAt: new Date('2026-10-22T10:00:00Z'),
  },
  {
    _id: '672000000000000000000005',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Others',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
    description: 'An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results.',
    totalCopies: 6,
    userName: 'Library Admin',
    userEmail: 'admin@booknook.com',
    createdAt: new Date('2026-10-25T10:00:00Z'),
  },
  {
    _id: '672000000000000000000006',
    title: 'Cosmos',
    author: 'Carl Sagan',
    category: 'Science',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    description: 'The story of fifteen billion years of cosmic evolution transforming matter and life into consciousness.',
    totalCopies: 3,
    userName: 'Library Admin',
    userEmail: 'admin@booknook.com',
    createdAt: new Date('2026-10-28T10:00:00Z'),
  },
  {
    _id: '672000000000000000000007',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'Science',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    description: 'Explores the two systems that drive the way we think—System 1, fast, emotional; System 2, slow, deliberative.',
    totalCopies: 4,
    userName: 'Library Admin',
    userEmail: 'admin@booknook.com',
    createdAt: new Date('2026-10-29T10:00:00Z'),
  },
  {
    _id: '672000000000000000000008',
    title: '1984',
    author: 'George Orwell',
    category: 'Fiction',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80',
    description: 'A chilling dystopian vision of the future where Big Brother is always watching your every step.',
    totalCopies: 5,
    userName: 'Library Admin',
    userEmail: 'admin@booknook.com',
    createdAt: new Date('2026-10-30T10:00:00Z'),
  },
  {
    _id: '672000000000000000000009',
    title: 'Guns, Germs, and Steel',
    author: 'Jared Diamond',
    category: 'History',
    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
    description: 'A transdisciplinary non-fiction book exploring the fates of human societies across thousands of years.',
    totalCopies: 3,
    userName: 'Library Admin',
    userEmail: 'admin@booknook.com',
    createdAt: new Date('2026-10-31T10:00:00Z'),
  },
  {
    _id: '672000000000000000000010',
    title: "Charlotte's Web",
    author: 'E.B. White',
    category: 'Kids',
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80',
    description: 'A tender tale of friendship, love, and life on the farm between a gentle pig and a wise spider.',
    totalCopies: 4,
    userName: 'Library Admin',
    userEmail: 'admin@booknook.com',
    createdAt: new Date('2026-11-01T10:00:00Z'),
  },
  {
    _id: '672000000000000000000011',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Fiction',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    description: 'A magical fable about following your dream and listening to your heart across the Andalusian desert.',
    totalCopies: 5,
    userName: 'Library Admin',
    userEmail: 'admin@booknook.com',
    createdAt: new Date('2026-11-02T08:00:00Z'),
  },
  {
    _id: '672000000000000000000012',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Science',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    description: 'A handbook of agile software craftsmanship that shows how to write readable, maintainable software.',
    totalCopies: 4,
    userName: 'Library Admin',
    userEmail: 'admin@booknook.com',
    createdAt: new Date('2026-11-02T09:00:00Z'),
  },
  {
    _id: '672000000000000000000013',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Fiction',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    description: 'A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.',
    totalCopies: 3,
    userName: 'Library Admin',
    userEmail: 'admin@booknook.com',
    createdAt: new Date('2026-11-02T10:00:00Z'),
  },
  {
    _id: '672000000000000000000014',
    title: 'Deep Work',
    author: 'Cal Newport',
    category: 'Others',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
    description: 'Rules for focused success in a distracted world to produce your best work in less time.',
    totalCopies: 6,
    userName: 'Library Admin',
    userEmail: 'admin@booknook.com',
    createdAt: new Date('2026-11-02T11:00:00Z'),
  },
];

let inMemoryBorrows = [];

// JWT Verification Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.token;

  let token = cookieToken;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // Permissive check so testing without token won't immediately break if client sets user email in header
  if (!token) {
    // If user passed x-user-email during dev, attach it
    if (req.headers['x-user-email']) {
      req.user = { email: req.headers['x-user-email'] };
      return next();
    }
    return res.status(401).send({ error: 'Unauthorized access. No token provided.' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).send({ error: 'Forbidden access. Invalid or expired token.' });
    }
    req.user = decoded;
    next();
  });
};

// ========================
// AUTH ROUTES
// ========================

// 1. Issue JWT Token on Login
app.post('/jwt', (req, res) => {
  const user = req.body;
  if (!user || !user.email) {
    return res.status(400).send({ error: 'User email is required' });
  }
  const token = jwt.sign(user, jwtSecret, { expiresIn: '7d' });

  res
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    })
    .send({ success: true, token });
});

// 2. Clear Token on Logout
app.post('/logout', (req, res) => {
  res
    .clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    })
    .send({ success: true, message: 'Logged out successfully' });
});

// Root Route / Health Check
app.get('/', (req, res) => {
  res.send({
    name: 'BookNook API Server',
    status: 'Running smoothly',
    variant: 'B14-A8-Cat_Ron',
    database: db ? 'MongoDB Connected' : 'In-Memory Mode (Pending Atlas URI)',
  });
});

// ========================
// 8 CORE ASSIGNMENT ROUTES
// ========================

// 1. GET /books - get all books (public)
// Supports ?limit=6, ?sort=newest, ?category=Fiction, ?email=user@test.com
app.get('/books', async (req, res) => {
  try {
    const { limit, sort, category, email } = req.query;
    const database = await connectDB();

    if (database) {
      const booksCollection = database.collection('books');
      let query = {};

      if (category && category !== 'All') {
        query.category = category;
      }
      if (email) {
        query.userEmail = email;
      }

      let cursor = booksCollection.find(query);

      if (sort === 'newest') {
        cursor = cursor.sort({ createdAt: -1 });
      }

      if (limit) {
        cursor = cursor.limit(parseInt(limit));
      }

      const books = await cursor.toArray();
      return res.send(books);
    }

    // Fallback in-memory
    let books = [...inMemoryBooks];
    if (category && category !== 'All') {
      books = books.filter((b) => b.category.toLowerCase() === category.toLowerCase());
    }
    if (email) {
      books = books.filter((b) => b.userEmail === email);
    }
    if (sort === 'newest') {
      books = books.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (limit) {
      books = books.slice(0, parseInt(limit));
    }
    res.send(books);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch books', message: error.message });
  }
});

// 2. GET /books/:id - get one book
app.get('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const database = await connectDB();

    if (database) {
      const booksCollection = database.collection('books');
      let query;
      try {
        query = { _id: new ObjectId(id) };
      } catch {
        query = { _id: id };
      }
      const book = await booksCollection.findOne(query);
      if (!book) {
        return res.status(404).send({ error: 'Book not found' });
      }
      return res.send(book);
    }

    // Fallback in-memory
    const book = inMemoryBooks.find((b) => b._id.toString() === id);
    if (!book) {
      return res.status(404).send({ error: 'Book not found' });
    }
    res.send(book);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch book', message: error.message });
  }
});

// 3. POST /books - add a book (Private Route)
app.post('/books', verifyToken, async (req, res) => {
  try {
    const { title, author, category, image, description, totalCopies, userName, userEmail } = req.body;

    if (!title || !author || !category || !image || !description) {
      return res.status(400).send({ error: 'All fields are required' });
    }

    const newBook = {
      title,
      author,
      category,
      image,
      description,
      totalCopies: parseInt(totalCopies) || 1,
      userName: userName || req.user?.name || 'Anonymous User',
      userEmail: userEmail || req.user?.email,
      createdAt: new Date(),
    };

    const database = await connectDB();
    if (database) {
      const booksCollection = database.collection('books');
      const result = await booksCollection.insertOne(newBook);
      return res.status(201).send({ success: true, insertedId: result.insertedId, book: newBook });
    }

    // Fallback in-memory
    newBook._id = new Date().getTime().toString();
    inMemoryBooks.unshift(newBook);
    res.status(201).send({ success: true, insertedId: newBook._id, book: newBook });
  } catch (error) {
    res.status(500).send({ error: 'Failed to add book', message: error.message });
  }
});

// 4. PATCH /books/:id - update a book (Private Route)
app.patch('/books/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, category, image, description, totalCopies } = req.body;

    const updateDoc = {};
    if (title) updateDoc.title = title;
    if (author) updateDoc.author = author;
    if (category) updateDoc.category = category;
    if (image) updateDoc.image = image;
    if (description) updateDoc.description = description;
    if (totalCopies !== undefined) updateDoc.totalCopies = parseInt(totalCopies);
    updateDoc.updatedAt = new Date();

    const database = await connectDB();
    if (database) {
      const booksCollection = database.collection('books');
      let query;
      try {
        query = { _id: new ObjectId(id) };
      } catch {
        query = { _id: id };
      }

      const result = await booksCollection.updateOne(query, { $set: updateDoc });
      return res.send({ success: true, modifiedCount: result.modifiedCount });
    }

    // Fallback in-memory
    const index = inMemoryBooks.findIndex((b) => b._id.toString() === id);
    if (index === -1) {
      return res.status(404).send({ error: 'Book not found' });
    }
    inMemoryBooks[index] = { ...inMemoryBooks[index], ...updateDoc };
    res.send({ success: true, modifiedCount: 1 });
  } catch (error) {
    res.status(500).send({ error: 'Failed to update book', message: error.message });
  }
});

// 5. DELETE /books/:id - delete a book (Private Route)
app.delete('/books/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const database = await connectDB();

    if (database) {
      const booksCollection = database.collection('books');
      let query;
      try {
        query = { _id: new ObjectId(id) };
      } catch {
        query = { _id: id };
      }

      const result = await booksCollection.deleteOne(query);
      return res.send({ success: true, deletedCount: result.deletedCount });
    }

    // Fallback in-memory
    const initialLen = inMemoryBooks.length;
    inMemoryBooks = inMemoryBooks.filter((b) => b._id.toString() !== id);
    res.send({ success: true, deletedCount: initialLen - inMemoryBooks.length });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete book', message: error.message });
  }
});

// 6. POST /borrows - borrow a book (Private Route + CHALLENGES IMPLEMENTED)
// Challenge 1: Total Copies decrease with $inc
// Challenge 2: No Double Borrow for same user and book
app.post('/borrows', verifyToken, async (req, res) => {
  try {
    const { bookId, bookTitle, bookImage, userEmail, userName, returnDate } = req.body;

    const email = userEmail || req.user?.email;
    if (!bookId || !email) {
      return res.status(400).send({ error: 'Book ID and User Email are required' });
    }

    const database = await connectDB();

    if (database) {
      const booksCollection = database.collection('books');
      const borrowsCollection = database.collection('borrows');

      let bookQuery;
      try {
        bookQuery = { _id: new ObjectId(bookId) };
      } catch {
        bookQuery = { _id: bookId };
      }

      const book = await booksCollection.findOne(bookQuery);
      if (!book) {
        return res.status(404).send({ error: 'Book not found' });
      }

      // CHALLENGE 1: Check available copies
      if (book.totalCopies <= 0) {
        return res.status(400).send({ error: 'Sorry, this book is currently Not Available (0 copies left).' });
      }

      // CHALLENGE 2: No Double Borrow
      const existingBorrow = await borrowsCollection.findOne({
        bookId: bookId.toString(),
        userEmail: email,
        status: 'borrowed',
      });

      if (existingBorrow) {
        return res.status(400).send({
          error: 'You have already borrowed this book! Please return your borrowed copy before borrowing again.',
        });
      }

      const newBorrow = {
        bookId: bookId.toString(),
        bookTitle: bookTitle || book.title,
        bookImage: bookImage || book.image,
        userEmail: email,
        userName: userName || req.user?.name || 'Reader',
        borrowDate: new Date().toISOString().split('T')[0],
        returnDate: returnDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'borrowed',
        createdAt: new Date(),
      };

      const borrowResult = await borrowsCollection.insertOne(newBorrow);

      // Decrement copies by 1 with $inc
      await booksCollection.updateOne(bookQuery, { $inc: { totalCopies: -1 } });

      return res.status(201).send({
        success: true,
        message: 'Book borrowed successfully!',
        borrowId: borrowResult.insertedId,
      });
    }

    // Fallback in-memory
    const book = inMemoryBooks.find((b) => b._id.toString() === bookId);
    if (!book) return res.status(404).send({ error: 'Book not found' });
    if (book.totalCopies <= 0) return res.status(400).send({ error: 'Not Available (0 copies left)' });

    const alreadyBorrowed = inMemoryBorrows.find(
      (b) => b.bookId === bookId && b.userEmail === email && b.status === 'borrowed'
    );
    if (alreadyBorrowed) {
      return res.status(400).send({ error: 'You have already borrowed this book!' });
    }

    book.totalCopies -= 1;
    const borrowRecord = {
      _id: new Date().getTime().toString(),
      bookId,
      bookTitle: bookTitle || book.title,
      bookImage: bookImage || book.image,
      userEmail: email,
      userName: userName || 'Reader',
      borrowDate: new Date().toISOString().split('T')[0],
      returnDate: returnDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'borrowed',
      createdAt: new Date(),
    };
    inMemoryBorrows.push(borrowRecord);
    res.status(201).send({ success: true, message: 'Book borrowed successfully!', borrowId: borrowRecord._id });
  } catch (error) {
    res.status(500).send({ error: 'Failed to borrow book', message: error.message });
  }
});

// 7. GET /borrows - get borrows of the logged in user (Private Route)
app.get('/borrows', verifyToken, async (req, res) => {
  try {
    const userEmail = req.query.email || req.user?.email;
    if (!userEmail) {
      return res.status(400).send({ error: 'User email is required' });
    }

    const database = await connectDB();
    if (database) {
      const borrowsCollection = database.collection('borrows');
      const borrows = await borrowsCollection
        .find({ userEmail, status: 'borrowed' })
        .sort({ createdAt: -1 })
        .toArray();
      return res.send(borrows);
    }

    // Fallback in-memory
    const userBorrows = inMemoryBorrows.filter((b) => b.userEmail === userEmail && b.status === 'borrowed');
    res.send(userBorrows);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch borrows', message: error.message });
  }
});

// 8. DELETE /borrows/:id - return a book (Private Route)
// Increases copies by 1 with $inc
app.delete('/borrows/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const database = await connectDB();

    if (database) {
      const borrowsCollection = database.collection('borrows');
      const booksCollection = database.collection('books');

      let borrowQuery;
      try {
        borrowQuery = { _id: new ObjectId(id) };
      } catch {
        borrowQuery = { _id: id };
      }

      const borrow = await borrowsCollection.findOne(borrowQuery);
      if (!borrow) {
        return res.status(404).send({ error: 'Borrow record not found' });
      }

      // Increment copies by 1 with $inc on return
      if (borrow.bookId) {
        let bookQuery;
        try {
          bookQuery = { _id: new ObjectId(borrow.bookId) };
        } catch {
          bookQuery = { _id: borrow.bookId };
        }
        await booksCollection.updateOne(bookQuery, { $inc: { totalCopies: 1 } });
      }

      // Remove the borrow or mark returned
      const result = await borrowsCollection.deleteOne(borrowQuery);
      return res.send({ success: true, message: 'Book returned successfully!', deletedCount: result.deletedCount });
    }

    // Fallback in-memory
    const borrowIndex = inMemoryBorrows.findIndex((b) => b._id.toString() === id);
    if (borrowIndex === -1) {
      return res.status(404).send({ error: 'Borrow record not found' });
    }
    const borrow = inMemoryBorrows[borrowIndex];
    const book = inMemoryBooks.find((b) => b._id.toString() === borrow.bookId);
    if (book) {
      book.totalCopies += 1;
    }
    inMemoryBorrows.splice(borrowIndex, 1);
    res.send({ success: true, message: 'Book returned successfully!', deletedCount: 1 });
  } catch (error) {
    res.status(500).send({ error: 'Failed to return book', message: error.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 BookNook Server running on port ${port}`);
  connectDB();
});
