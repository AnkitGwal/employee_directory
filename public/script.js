// Function to fetch and display employees from the database on page load
async function loadEmployees() {
    try {
        const response = await fetch('http://127.0.0.1:3000/getEmployees');
        const employees = await response.json();

        const tableBody = document.getElementById('employee-table').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';

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

// Event listener to filter employees by section
async function loadEmployeesBySection(section) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/getEmployeesBySection?section=${section}`);
        const employees = await response.json();

        const tableBody = document.getElementById('employee-table').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';

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
        console.error('Error fetching employees by section:', err);
    }
}

// Call loadEmployees on page load to display all employee data
window.onload = loadEmployees;

// Handle form submission to add a new employee
document.getElementById('employee-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const name = document.getElementById('name').value;
    const designation = document.getElementById('designation').value;
    const telExt = document.getElementById('tel-ext').value;
    const section = document.getElementById('section').value;

    if (!name || !designation || !telExt || !section) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:3000/submitEmployeeData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, designation, telExt, section }),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Employee added successfully!');
            
            // Add new employee to the table without reloading data
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
        console.error('Error submitting employee data:', err);
        alert('Error submitting data. Please try again.');
    }
});

// Event listener for the filter section dropdown to fetch employees based on selected section
document.getElementById('filter-section').addEventListener('change', (e) => {
    const selectedSection = e.target.value;
    if (selectedSection) {
        loadEmployeesBySection(selectedSection);
    } else {
        loadEmployees(); // Load all employees if no section is selected
    }
});
