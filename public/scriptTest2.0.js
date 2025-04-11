let editingEmpId = null;

// Load all employees on page load
window.onload = loadEmployees;

// Function to fetch and display all employees
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
                <td>${employee.email}</td>
                <td>${employee.roomLocation}</td>
                <td>
                    <div class="action-buttons">
                        <button onclick="editEmployee(${employee.emp_id})">Edit</button>
                        <button onclick="deleteEmployee(${employee.emp_id})">Delete</button>
                    </div>
                </td>
            `;
        });
    } catch (err) {
        console.error('Error fetching employees:', err);
    }
}

// Fetch and display employees by section
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
                <td>${employee.email}</td>
                <td>${employee.roomLocation}</td>
            `;
        });
    } catch (err) {
        console.error('Error fetching employees by section:', err);
    }
}

// Delete an employee
async function deleteEmployee(emp_id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        try {
            const response = await fetch(`http://127.0.0.1:3000/deleteEmployee/${emp_id}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            if (response.ok) {
                alert('Employee deleted successfully');
                loadEmployees();
            } else {
                alert(result.message || 'Error deleting employee');
            }
        } catch (err) {
            console.error('Error deleting employee:', err);
            alert('Error deleting employee. Please try again.');
        }
    }
}

// Edit an employee
async function editEmployee(emp_id) {
    try {
        const response = await fetch('http://127.0.0.1:3000/getEmployees');
        const employees = await response.json();
        const employee = employees.find(e => e.emp_id === emp_id);
        if (!employee) return alert('Employee not found.');

        document.getElementById('name').value = employee.name;
        document.getElementById('designation').value = employee.designation;
        document.getElementById('tel-ext').value = employee.telExt;
        document.getElementById('section').value = employee.section;
        document.getElementById('email').value = employee.email;
        document.getElementById('room-location').value = employee.roomLocation;

        editingEmpId = emp_id;
    } catch (err) {
        console.error('Error fetching employee:', err);
    }
}

// Form submission (Create or Update)
document.getElementById('employee-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const designation = document.getElementById('designation').value;
    const telExt = document.getElementById('tel-ext').value;
    const section = document.getElementById('section').value;
    const email = document.getElementById('email').value;
    const roomLocation = document.getElementById('room-location').value;

    const nestedDesignation = document.getElementById('nested-designation').value;
    const nestedSA = document.getElementById('nested-SA').value;
    const nestedTechnician = document.getElementById('nested-Technician').value;
    const nestedSection = document.getElementById('nested-section').value;
    const nestedAdmin = document.getElementById('nested-administration').value;

    let finalSection = section;
    if (section === "IT" && nestedSection) {
        finalSection = nestedSection;
    } else if (section === "Administration" && nestedAdmin) {
        finalSection = nestedAdmin;
    }

    let finalDesignation = designation;
    if (designation === "TO/SO" && nestedDesignation) {
        finalDesignation = nestedDesignation;
    } else if (designation === "SA" && nestedSA) {
        finalDesignation = nestedSA;
    } else if (designation === "Technician" && nestedTechnician) {
        finalDesignation = nestedTechnician;
    }

    if (!name || !finalDesignation || !telExt || !finalSection || !email || !roomLocation) {
        alert('Please fill in all fields.');
        return;
    }

    const payload = {
        name,
        designation: finalDesignation,
        telExt,
        section: finalSection,
        email,
        roomLocation
    };

    try {
        let response;
        if (editingEmpId) {
            response = await fetch(`http://127.0.0.1:3000/updateEmployee/${editingEmpId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            response = await fetch('http://127.0.0.1:3000/submitEmployeeData', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        const result = await response.json();
        if (response.ok) {
            alert(editingEmpId ? 'Employee updated successfully!' : 'Employee added successfully!');
            editingEmpId = null;
            e.target.reset();
            loadEmployees();
        } else {
            alert(result.message || 'Error saving employee');
        }
    } catch (err) {
        console.error('Error submitting data:', err);
        alert('Error submitting data. Please try again.');
    }
});

// Handle section dropdown change to show/hide nested sections
document.getElementById('section').addEventListener('change', function () {
    const section = this.value;
    const nestedSectionContainer = document.getElementById('nested-section-container');
    const nestedAdminContainer = document.getElementById('nested-administration-container');

    if (section === "IT") {
        nestedSectionContainer.style.display = 'block';
        nestedAdminContainer.style.display = 'none';
    } else if (section === "Administration") {
        nestedAdminContainer.style.display = 'block';
        nestedSectionContainer.style.display = 'none';
    } else {
        nestedSectionContainer.style.display = 'none';
        nestedAdminContainer.style.display = 'none';
    }
});

// Handle designation dropdown change to show nested designation options
document.getElementById('designation').addEventListener('change', function () {
    const designation = this.value;
    const nestedDesignationContainer = document.getElementById('nested-designation-container');
    const nestedSAContainer = document.getElementById('nested-SA-container');
    const nestedTechnicianContainer = document.getElementById('nested-Technician-container');

    if (designation === "TO/SO") {
        nestedDesignationContainer.style.display = 'block';
        nestedSAContainer.style.display = 'none';
        nestedTechnicianContainer.style.display = 'none';
    } else if (designation === "SA") {
        nestedDesignationContainer.style.display = 'none';
        nestedSAContainer.style.display = 'block';
        nestedTechnicianContainer.style.display = 'none';
    } else if (designation === "Technician") {
        nestedDesignationContainer.style.display = 'none';
        nestedSAContainer.style.display = 'none';
        nestedTechnicianContainer.style.display = 'block';
    } else {
        nestedDesignationContainer.style.display = 'none';
        nestedSAContainer.style.display = 'none';
        nestedTechnicianContainer.style.display = 'none';
    }
});

// Handle section filter change for listing
document.getElementById('filter-section').addEventListener('change', (e) => {
    const selectedSection = e.target.value;
    if (selectedSection) {
        loadEmployeesBySection(selectedSection);
    } else {
        loadEmployees();
    }
});
