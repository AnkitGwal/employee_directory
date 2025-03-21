const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: '127.0.0.1',  // Ensure this is correct
  user: 'root',
  password: 'Ankit@1207#', // Ensure this is correct
  database: 'employee_directory'
});

// Test the connection to MariaDB
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MariaDB:', err.stack);
    process.exit(1); // Exit the process if database connection fails
  }
  console.log('Connected to MariaDB as id ' + db.threadId);
});

// Middleware
app.use(cors()); // Allow CORS requests
app.use(bodyParser.json()); // Parse JSON bodies

// POST endpoint to submit employee data
app.post('/submitEmployeeData', (req, res) => {
  const { name, designation, telExt, section } = req.body;

  if (!name || !designation || !telExt || !section) {
    return res.status(400).send('All fields are required.');
  }

  const query = 'INSERT INTO employees (name, designation, telExt, section) VALUES (?, ?, ?, ?)';
  
  db.query(query, [name, designation, telExt, section], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Error saving data to the database.');
    }

    res.status(201).json({ message: 'Employee data saved successfully!' });
  });
});


// GET endpoint to retrieve all employees from the database
app.get('/getEmployees', (req, res) => {
  const query = 'SELECT * FROM employees';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving employees:', err);
      return res.status(500).send('Error fetching employees.');
    }

    res.json(results); // Send the employee data to the client
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
