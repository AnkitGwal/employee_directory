// Form submission event listener
document.getElementById("employee-form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Collect form data
    const employeeData = {
        name: document.getElementById("name").value,
        designation: document.getElementById("designation").value,
        telExt: document.getElementById("tel-ext").value,
        section: document.getElementById("section").value,
    };

    // Send data to the backend using fetch
    fetch('/submitEmployeeData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
    })
    .then(response => response.json())
    .then(data => {
        alert('Employee data submitted successfully!');
        loadEmployees();  // Reload employee list after submission
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting the data. Please try again.');
    });
});

// Load employee data from the backend
function loadEmployees() {
    fetch('/getEmployees')
        .then(response => response.json())
        .then(data => {
            const employeeList = document.getElementById('employee-list');
            employeeList.innerHTML = '';  // Clear existing list

            // Create a card for each employee
            data.forEach(employee => {
                const employeeCard = document.createElement('div');
                employeeCard.className = 'employee-card';
                employeeCard.innerHTML = `
                    <h3>${employee.name}</h3>
                    <p><strong>Designation:</strong> ${employee.designation}</p>
                    <p><strong>Tel Ext:</strong> ${employee.telExt}</p>
                    <p><strong>Section/Division:</strong> ${employee.section}</p>
                `;
                employeeList.appendChild(employeeCard);
            });
        })
        .catch(error => {
            console.error('Error fetching employee data:', error);
        });
}

// Load employee data when the page loads
window.onload = loadEmployees;
