const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Ankit@1207#',
  database: 'emp_directory'
});

// Test the connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MariaDB:', err.stack);
    process.exit(1);
  }
  console.log('Connected to MariaDB as id ' + db.threadId);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST: Add new employee
app.post('/submitEmployeeData', (req, res) => {
  const { name, designation, telExt, section, email, roomLocation } = req.body;

  if (!name || !designation || !telExt || !section || !email || !roomLocation) {
    return res.status(400).send('All fields are required.');
  }

  const query = `
    INSERT INTO employees (name, designation, telExt, section, email, roomLocation)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [name, designation, telExt, section, email, roomLocation], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Error saving data to the database.');
    }

    res.status(201).json({ message: 'Employee data saved successfully!' });
  });
});

// GET: All employees
app.get('/getEmployees', (req, res) => {
  const query = 'SELECT * FROM employees';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving employees:', err);
      return res.status(500).send('Error fetching employees.');
    }

    res.json(results);
  });
});

// GET: Employees by section
app.get('/getEmployeesBySection', (req, res) => {
  const { section } = req.query;
  const query = 'SELECT * FROM employees WHERE section = ?';

  db.query(query, [section], (err, results) => {
    if (err) {
      console.error('Error retrieving employees by section:', err);
      return res.status(500).send('Error fetching employees.');
    }

    res.json(results);
  });
});

// DELETE: Remove employee
app.delete('/deleteEmployee/:emp_id', (req, res) => {
  const emp_id = req.params.emp_id;
  const query = 'DELETE FROM employees WHERE emp_id = ?';

  db.query(query, [emp_id], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      return res.status(500).send('Error deleting employee.');
    }

    res.status(200).send({ message: 'Employee deleted successfully' });
  });
});

// PUT: Update employee
app.put('/updateEmployee/:emp_id', (req, res) => {
  const emp_id = req.params.emp_id;
  const { name, designation, telExt, section, email, roomLocation } = req.body;

  if (!name || !designation || !telExt || !section || !email || !roomLocation) {
    return res.status(400).send('All fields are required.');
  }

  const query = `
    UPDATE employees
    SET name = ?, designation = ?, telExt = ?, section = ?, email = ?, roomLocation = ?
    WHERE emp_id = ?
  `;

  db.query(query, [name, designation, telExt, section, email, roomLocation, emp_id], (err, result) => {
    if (err) {
      console.error('Error updating employee:', err);
      return res.status(500).send('Error updating employee.');
    }

    res.status(200).json({ message: 'Employee updated successfully' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
