const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const initialBooks = [
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    category: 'Fiction',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    totalCopies: 5,
    userName: 'Curator John',
    userEmail: 'john@booknook.com',
    createdAt: new Date('2026-10-15T10:00:00Z'),
  },
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    category: 'Science',
    image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=800&q=80',
    description: 'A landmark volume in science writing by one of the great minds of our time, exploring the universe from the Big Bang to black holes.',
    totalCopies: 4,
    userName: 'Curator John',
    userEmail: 'john@booknook.com',
    createdAt: new Date('2026-10-18T10:00:00Z'),
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    category: 'History',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    description: 'How an insignificant ape became the ruler of planet Earth, capable of splitting the atom and manipulating the code of life.',
    totalCopies: 6,
    userName: 'Curator John',
    userEmail: 'john@booknook.com',
    createdAt: new Date('2026-10-20T10:00:00Z'),
  },
  {
    title: 'The Little Prince',
    author: 'Antoine de Saint-Exupéry',
    category: 'Kids',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    description: 'A poetic tale of a young prince who visits various planets in space, addressing themes of loneliness, friendship, love, and loss.',
    totalCopies: 3,
    userName: 'Curator John',
    userEmail: 'john@booknook.com',
    createdAt: new Date('2026-10-22T10:00:00Z'),
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Others',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
    description: 'An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results.',
    totalCopies: 8,
    userName: 'Curator John',
    userEmail: 'john@booknook.com',
    createdAt: new Date('2026-10-25T10:00:00Z'),
  },
  {
    title: 'Cosmos',
    author: 'Carl Sagan',
    category: 'Science',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    description: 'The story of fifteen billion years of cosmic evolution transforming matter and life into consciousness.',
    totalCopies: 4,
    userName: 'Curator John',
    userEmail: 'john@booknook.com',
    createdAt: new Date('2026-10-28T10:00:00Z'),
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Fiction',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80',
    description: 'A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.',
    totalCopies: 5,
    userName: 'Curator John',
    userEmail: 'john@booknook.com',
    createdAt: new Date('2026-10-29T10:00:00Z'),
  },
  {
    title: 'Guns, Germs, and Steel',
    author: 'Jared Diamond',
    category: 'History',
    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
    description: 'A fascinating trans-disciplinary synthesis of environmental and geographical factors that shaped the modern world.',
    totalCopies: 3,
    userName: 'Curator John',
    userEmail: 'john@booknook.com',
    createdAt: new Date('2026-10-30T10:00:00Z'),
  },
];

async function seed() {
  if (!uri || uri.includes('<username>')) {
    console.error('❌ MONGODB_URI is not set properly in .env file!');
    process.exit(1);
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME || 'booknook_db');
    const booksCollection = db.collection('books');

    const count = await booksCollection.countDocuments();
    if (count > 0) {
      console.log(`ℹ️ Books collection already has ${count} books. Skipping seed.`);
    } else {
      const result = await booksCollection.insertMany(initialBooks);
      console.log(`✅ Successfully seeded ${result.insertedCount} books!`);
    }
  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    await client.close();
  }
}

seed();
