// Function to fetch and display employees from the database on page load
async function loadEmployees() {
  try {
    // Fetch all employee data from the backend
    const response = await fetch('http://127.0.0.1:3000/getEmployees');
    const employees = await response.json();

    // Get the table body element
    const tableBody = document.getElementById('employee-table').getElementsByTagName('tbody')[0];

    // Clear the current table rows
    tableBody.innerHTML = '';

    // Loop through the fetched employees and add them to the table
    employees.forEach((employee) => {
      const newRow = tableBody.insertRow();
      newRow.innerHTML = `
        <td>${employee.name}</td>
        <td>${employee.designation}</td>
        <td>${employee.telExt}</td>
        <td>${employee.section}</td>
      `;
    });
  } catch (err) {
    console.error('Error fetching employees:', err);
  }
}

// Call loadEmployees on page load to display data from the database
window.onload = loadEmployees;

// Handle form submission to add a new employee
document.getElementById('employee-form').addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent form from refreshing the page

  // Get form values
  const name = document.getElementById('name').value;
  const designation = document.getElementById('designation').value;
  const telExt = document.getElementById('tel-ext').value;
  const section = document.getElementById('section').value;

  // Ensure all fields are filled
  if (!name || !designation || !telExt || !section) {
    alert('Please fill in all fields.');
    return;
  }

  try {
    // Send POST request to backend to save the employee data
    const response = await fetch('http://127.0.0.1:3000/submitEmployeeData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        designation,
        telExt,
        section,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Employee added successfully!');
      
      // Append the new employee to the table without reloading the data
      const tableBody = document.getElementById('employee-table').getElementsByTagName('tbody')[0];
      const newRow = tableBody.insertRow();
      newRow.innerHTML = `
        <td>${name}</td>
        <td>${designation}</td>
        <td>${telExt}</td>
        <td>${section}</td>
      `;
    } else {
      alert(result.message || 'Error adding employee');
    }
  } catch (err) {
    console.error('Error submitting employee data:', err); // Log any frontend errors
    alert('Error submitting data. Please try again.');
  }
});
