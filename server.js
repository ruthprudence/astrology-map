const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// Create an Express app
const app = express();
const port = 3001; // Use any port number you prefer

// Create a SQLite database connection
const db = new sqlite3.Database(':memory:');

// Create a table for storing user data
db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, birthday TEXT)'
  );
});

// Define an API endpoint to save user data
app.post('/users', (req, res) => {
  const { name, birthday } = req.body;

  // Insert user data into the database
  db.run('INSERT INTO users (name, birthday) VALUES (?, ?)', [name, birthday], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save user data' });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

// Define an API endpoint to retrieve user data
app.get('/users', (req, res) => {
  // Retrieve user data from the database
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve user data' });
    } else {
      res.json(rows);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});