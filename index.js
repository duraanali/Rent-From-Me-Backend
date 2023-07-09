require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const sqlite3 = require('sqlite3').verbose();

// Add body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
const port = process.env.PORT || 9000;

// Connect to the SQLite database
const db = new sqlite3.Database('./database.sqlite');

// Create tables in the database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS owners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS renters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER,
    title TEXT,
    description TEXT,
    make TEXT,
    model TEXT,
    img_url TEXT,
    daily_cost REAL,
    available INTEGER,
    condition TEXT,
    FOREIGN KEY(owner_id) REFERENCES owners(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS rentals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_date TEXT,
    end_date TEXT,
    total_cost REAL,
    tool_id INTEGER,
    renter_id INTEGER,
    FOREIGN KEY(tool_id) REFERENCES items(id),
    FOREIGN KEY(renter_id) REFERENCES renters(id)
  )`);
});

// Helper function to run database queries
function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
      db.all(query, params, (error, rows) => {
        if (error) {
          reject(error);
        } else {
          const result = rows.map(row => ({ ...row }));
          resolve(result);
        }
      });
    });
  }
  
  function verifyToken(req, res, next) {
    // get token without the Bearer part
    const token = req.headers.authorization.split(' ')[1];
    console.log(token)
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded;
      console.log(req.user)
      next();
    } catch (error) {
      return res.status(403).json({ error: 'Invalid token' });
    }
  }

// Secret key for JWT
const secretKey = 'your-secret-key';

// Helper function to generate JWT token
function generateToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}


// Owner register
app.post('/api/owner/register', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    try {
      // Encrypt the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Register the owner in the database
      const result = await runQuery(
        'INSERT INTO owners (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
        [first_name, last_name, email, hashedPassword]
      );
      
      // Generate token
      const token = generateToken({ id: result.lastID });
  
      res.json({ message: 'Owner registered successfully', owner_id: result.lastID, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

    // Owner login
  app.post('/api/owner/login', (req, res) => {
    const { email, password } = req.body;
  
    // Find the user by email
    const query = 'SELECT * FROM owners WHERE email = ?';
    db.get(query, [email], async (error, row) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
      }
      if (!row) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      // Check if the password matches
      const passwordMatches = await bcrypt.compare(password, row.password);
      if (!passwordMatches) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      // Create and return JWT token
      const token = jwt.sign({ id: row.id }, secretKey, { expiresIn: '1d' });
  
      // get the user details
      const userQuery = 'SELECT * FROM owners WHERE id = ?';
      db.get(userQuery, [row.id], async (error, user) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'An error occurred' });
        }
        res.json({ user, token });
      });
    });
  });

  // Renter register
  app.post('/api/renter/register', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    try {
      // Encrypt the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Register the renter in the database
      const result = await runQuery(
        'INSERT INTO renters (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
        [first_name, last_name, email, hashedPassword]
      );
      
      // Generate token
      const token = generateToken({ id: result.lastID });
  
      res.json({ message: 'Renter registered successfully', renter_id: result.lastID, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  // Renter login
  app.post('/api/renter/login', (req, res) => {
    const { email, password } = req.body;
  
    // Find the user by email
    const query = 'SELECT * FROM renters WHERE email = ?';
    db.get(query, [email], async (error, row) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
      }
      if (!row) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      // Check if the password matches
      const passwordMatches = await bcrypt.compare(password, row.password);
      if (!passwordMatches) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      // Create and return JWT token
      const token = jwt.sign({ id: row.id }, secretKey, { expiresIn: '1d' });
  
      // get the user details
      const userQuery = 'SELECT * FROM renters WHERE id = ?';
      db.get(userQuery, [row.id], async (error, user) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'An error occurred' });
        }
        res.json({ user, token });
      });
    });
  }); 


    // Owner gets their profile
app.get('/api/owner/profile', verifyToken, (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
          }
        
          const userId = req.user.id;
          const query = 'SELECT id, first_name, last_name, email, password FROM owners WHERE id = ?';
          db.get(query, [userId], (error, row) => {
            if (error) {
              console.error(error);
              return res.status(500).json({ error: 'An error occurred' });
            }
            if (!row) {
              return res.status(404).json({ error: 'User not found' });
            }
            res.json(row);
          });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }

  });

  // Renter gets their profile
  app.get('/api/renter/profile', verifyToken, (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
          }
        
          const userId = req.user.id;
          const query = 'SELECT id, first_name, last_name, email, password FROM renters WHERE id = ?';
          db.get(query, [userId], (error, row) => {
            if (error) {
              console.error(error);
              return res.status(500).json({ error: 'An error occurred' });
            }
            if (!row) {
              return res.status(404).json({ error: 'User not found' });
            }
            res.json(row);
          });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }

  });

  // Owner Updates their own profile
  app.put('/api/owner/update_profile', verifyToken, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
  
    const { first_name, last_name, email, password } = req.body;
    try {
      const owner_id = req.user.id; // Get the owner ID from req.user
    
      db.get('SELECT * FROM owners WHERE id = ?', [owner_id], async (error, row) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'An error occurred' });
        }
  
        if (!row) {
          return res.status(404).json({ error: 'Owner not found' });
        }
  
        const updatedFirstName = first_name || row.first_name;
        const updatedLastName = last_name || row.last_name;
        const updatedEmail = email || row.email;
  
        let hashedPassword = row.password; // Default to the existing password
  
        if (password) {
          // Hash the new password
          hashedPassword = await bcrypt.hash(password, 10);
        }
  
        db.run(
          'UPDATE owners SET first_name = ?, last_name = ?, email = ?, password = ? WHERE id = ?',
          [updatedFirstName, updatedLastName, updatedEmail, hashedPassword, owner_id],
          function (error) {
            if (error) {
              console.error(error);
              return res.status(500).json({ error: 'An error occurred' });
            }
            if (this.changes > 0) {
              res.json({ message: 'Owner updated successfully' });
            } else {
              res.status(404).json({ error: 'Owner not found or unauthorized' });
            }
          }
        );
  
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  
// Renter updates their own profile
  app.put('/api/renter/update_profile', verifyToken, async (req, res) => {
    console.log(req.body)
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
   
    const { first_name, last_name, email, password } = req.body;
    try {
      const owner_id = req.user.id; // Get the owner ID from req.user
    
      db.get('SELECT * FROM renter WHERE id = ?', [owner_id], async (error, row) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'An error occurred' });
        }
  
        if (!row) {
          return res.status(404).json({ error: 'Owner not found' });
        }
  
        const updatedFirstName = first_name || row.first_name;
        const updatedLastName = last_name || row.last_name;
        const updatedEmail = email || row.email;
  
        let hashedPassword = row.password; // Default to the existing password
  
        if (password) {
          // Hash the new password
          hashedPassword = await bcrypt.hash(password, 10);
        }
  
        db.run(
          'UPDATE renter SET first_name = ?, last_name = ?, email = ?, password = ? WHERE id = ?',
          [updatedFirstName, updatedLastName, updatedEmail, hashedPassword, owner_id],
          function (error) {
            if (error) {
              console.error(error);
              return res.status(500).json({ error: 'An error occurred' });
            }
            if (this.changes > 0) {
              res.json({ message: 'Owner updated successfully' });
            } else {
              res.status(404).json({ error: 'Owner not found or unauthorized' });
            }
          }
        );
  
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  

// Owner deletes their own profile
app.delete('/api/renter/delete_profile', verifyToken, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
  
    const renter_id = req.user.id; // Get the renter ID from req.user
    try {
      const result = await runQuery('DELETE FROM renters WHERE id = ?', [renter_id]);
  
      if (result.changes > 0) {
        // Invalidate the token by setting an empty authorization header
        res.set('Authorization', '');
        res.json({ message: 'Renter deleted successfully' });
      } else {
        res.status(404).json({ error: 'Renter not found or unauthorized' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  // Owner deletes their own profile
  app.delete('/api/owner/delete_profile', verifyToken, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
  
    const owner_id = req.user.id; // Get the owner ID from req.user
    try {
  
      db.run('DELETE FROM owners WHERE id = ?', [owner_id], function (error) {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'An error occurred' });
        }
  
        if (this.changes > 0) {
          // Invalidate the token by setting an empty authorization header
          res.set('Authorization', '');
          res.json({ message: 'Owner deleted successfully' });
        } else {
          res.status(404).json({ error: 'Owner not found or unauthorized' });
        }
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  

  
// Get all items
app.get('/api/items', async (req, res) => {
    try {
        const query = 'SELECT * FROM items ORDER BY id DESC';
        const items = await runQuery(query);
        res.json(items);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
});

// Get a specific item by ID
app.get('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const item = await runQuery('SELECT * FROM items WHERE id = ?', [id]);
    if (item) {
        res.json(item);
        }
    else {
        res.status(404).json({ error: 'Item not found' });
        }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Get all items owned by a specific owner
app.get('/api/items/:owner_id', verifyToken, async (req, res) => {
  const { owner_id } = req.params;
  try {
    const items = await runQuery('SELECT * FROM items WHERE owner_id = ?', [owner_id]);
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Owner can create an item
app.post('/api/items/create', verifyToken, async (req, res) => {
    const {
      title,
      description,
      make,
      model,
      img_url,
      daily_cost,
      available,
      condition
    } = req.body;
    try {
      const { id: owner_id } = req.user; // Get the owner ID from req.user
  
      const result = await runQuery(
        'INSERT INTO items (owner_id, title, description, make, model, img_url, daily_cost, available, condition) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          owner_id,
          title,
          description,
          make,
          model,
          img_url,
          daily_cost,
          available,
          condition
        ]
      );
      res.json({ message: 'Item created successfully', item_id: result.lastID });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  // Owner can update an item
  app.put('/api/items/update/:id', verifyToken, (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
  
    const { id } = req.params;
    const { 
      title,
      description,
      make,
      model,
      img_url,
      daily_cost,
      available,
      condition
    } = req.body;
    const query =
      'UPDATE items SET owner_id = ?, title = ?, description = ?, make = ?, model = ?, img_url = ?, daily_cost = ?, available = ?, condition = ? WHERE id = ?';
    const owner_id = req.user.id;
    db.run(
      query,
      [
        owner_id,
        title,
        description,
        make,
        model,
        img_url,
        daily_cost,
        available,
        condition,
        id
      ],
      function (error) {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'An error occurred' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Item not found or unauthorized' });
        }
        res.json({
          message: 'Item updated successfully',
          item: {
            id,
            title,
            description,
            make,
            model,
            img_url,
            daily_cost,
            available,
            condition
          }
        });
      }
    );
  });
  
  // Owner deletes an item
  app.delete('/api/items/delete/:id', verifyToken, (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
  
    const { id } = req.params;
    const query = 'DELETE FROM items WHERE id = ? AND owner_id = ?';
    const owner_id = req.user.id;
  
    db.run(query, [id, owner_id], function (error) {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Item not found or unauthorized' });
      }
      res.json({ message: 'Item deleted successfully' });
    });
  });
  
  
  // all items rented by a renter
  app.get('/api/rented_items', verifyToken, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
  
    const renter_id = req.user.id;
    
    try {
      const rentals = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM rentals WHERE renter_id = ?', [renter_id], (error, rows) => {
          if (error) {
            reject(error);
          } else {
            resolve(rows);
          }
        });
      });
  
      res.json(rentals);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // all items renter by a renter with a specific id
  app.get('/api/rentals/:renter_id', verifyToken, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
  
    const { renter_id } = req.params;
  
    try {
  
      db.all(
        'SELECT * FROM rentals WHERE renter_id = ?',
        [renter_id],
        (error, rows) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred' });
          }
  
          res.json(rows);
        }
      );
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  

// RENTER RENTS ITEM with ID = item_id
app.post('/api/rentals/rent_item/:item_id', verifyToken, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
  
    const { item_id } = req.params;
    const { start_date, end_date, total_cost } = req.body;
    const renter_id = req.user.id; // Get the renter ID from req.user
  
    try {
  
      db.run(
        'INSERT INTO rentals (start_date, end_date, total_cost, tool_id, renter_id) VALUES (?, ?, ?, ?, ?)',
        [start_date, end_date, total_cost, item_id, renter_id],
        function (error) {
          if (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred' });
          }
  
          res.json({ message: 'Item rented successfully', rental_id: this.lastID });
        }
      );
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

 // RENTER REMOVES ITEM with ID = item_id from rentals
  app.delete('/api/rentals/remove_item/:item_id', verifyToken, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
  
    const { item_id } = req.params;
    const renter_id = req.user.id; // Get the renter ID from req.user
  
    try {
  
      db.run(
        'DELETE FROM rentals WHERE tool_id = ? AND renter_id = ?',
        [item_id, renter_id],
        function (error) {
          if (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred' });
          }
  
          if (this.changes > 0) {
            res.json({ message: 'Item removed from rentals successfully' });
          } else {
            res.status(404).json({ error: 'Item not found in rentals or unauthorized' });
          }
        }
      );
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
