const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 3000;

// Create a connection to the MariaDB database
const db = mysql.createConnection({
  host: 'localhost',       // Change to the MariaDB server IP if remote
  user: 'root',            // Your MariaDB username
  password: 'your_password', // Your MariaDB password
  database: 'employee_directory' // The database name
});

// Test the connection to MariaDB
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MariaDB:', err.stack);
    return;
  }
  console.log('Connected to MariaDB as id ' + db.threadId);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// POST endpoint to submit employee data
app.post('/submitEmployeeData', (req, res) => {
  const { name, designation, telExt, section } = req.body;

  // Check if all required fields are provided
  if (!name || !designation || !telExt || !section) {
    return res.status(400).send('All fields are required.');
  }

  // Insert employee data into the database
  const query = 'INSERT INTO employees (name, designation, telExt, section) VALUES (?, ?, ?, ?)';
  db.query(query, [name, designation, telExt, section], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Error saving data to the database.');
    }
    console.log('Employee added:', { name, designation, telExt, section });
    res.status(201).json({ message: 'Employee data saved successfully!', employee: { name, designation, telExt, section } });
  });
});

// GET endpoint to fetch all employees
app.get('/getEmployees', (req, res) => {
  const query = 'SELECT * FROM employees';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Error fetching employee data.');
    }
    res.json(results);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
