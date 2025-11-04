import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to store user credentials
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(USERS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read users from JSON file
async function readUsers() {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []; // File doesn't exist, return empty array
    }
    throw error;
  }
}

// Write users to JSON file
async function writeUsers(users) {
  await ensureDataDirectory();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Read existing users
    const users = await readUsers();

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In a real app, this should be hashed
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString()
    };

    // Add user to array and save
    users.push(newUser);
    await writeUsers(users);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ 
      message: 'User created successfully',
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Read users
    const users = await readUsers();
    
    // Find user by email first
    const userByEmail = users.find(u => u.email === email);
    if (!userByEmail) {
      return res.status(404).json({ error: 'No account found for this email. Please sign up first.' });
    }

    // Check password match
    if (userByEmail.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = userByEmail;
    res.json({ 
      message: 'Login successful',
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user endpoint (for checking authentication)
router.get('/me', async (req, res) => {
  try {
    // In a real app, you'd verify a JWT token here
    // For now, we'll just return a simple response
    res.json({ message: 'Authentication endpoint ready' });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;