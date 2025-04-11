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
                <td>${employee.email}</td>
                <td>${employee.roomLocation}</td>
            `;
        });
    } catch (err) {
        console.error('Error fetching employees by section:', err);
    }
}

// Event listener for the filter section dropdown to fetch employees based on selected section
document.getElementById('filter-section').addEventListener('change', (e) => {
    const selectedSection = e.target.value;
    if (selectedSection) {
        loadEmployeesBySection(selectedSection);
    } else {
        loadEmployees(); // Load all employees if no section is selected
    }
});

// Listen for changes in the Section dropdown
document.getElementById('section').addEventListener('change', function () {
    const section = this.value;
    
    // Get references to the nested section containers
    const nestedSectionContainer = document.getElementById('nested-section-container');
    const nestedAdminContainer = document.getElementById('nested-administration-container');

    // Check if the selected section is "IT"
    if (section === "IT") {
        nestedSectionContainer.style.display = 'block';  // Show the nested dropdown for IT
        nestedAdminContainer.style.display = 'none';    // Hide the nested dropdown for Administration
    } 
    // Check if the selected section is "Administration"
    else if (section === "Administration") {
        nestedAdminContainer.style.display = 'block';   // Show the nested dropdown for Administration
        nestedSectionContainer.style.display = 'none';  // Hide the nested dropdown for IT
    } 
    // Hide nested dropdowns if any other section is selected
    else {
        nestedAdminContainer.style.display = 'none';    // Hide nested dropdown for Administration
        nestedSectionContainer.style.display = 'none';  // Hide nested dropdown for IT
    }
});


// Listen for changes in the Designation dropdown
document.getElementById('designation').addEventListener('change', function() {
    const designation = this.value;
    const nestedDesignationContainer = document.getElementById('nested-designation-container');
    const nestedSAContainer = document.getElementById('nested-SA-container');
    const nestedTechnicianContainer = document.getElementById('nested-Technician-container');
    
    // Show nested dropdown for TO/SO, SA, or Technician
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

// Call loadEmployees on page load to display all employee data
window.onload = loadEmployees;

// Handle form submission to add a new employee
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

    
	let finalSection=section;
	if(section==="IT" && nestedSection){
		finalSection=nestedSection;
	}
    else if(section==="Administration" && nestedAdmin){
		finalSection=nestedAdmin;
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

    try {
        const response = await fetch('http://127.0.0.1:3000/submitEmployeeData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, designation: finalDesignation, telExt, section: finalSection, email, roomLocation }),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Your data saved successfully!...');
            
            // Add new employee to the table without reloading data
            const tableBody = document.getElementById('employee-table').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            newRow.innerHTML = `
                <td>${name}</td>
                <td>${finalDesignation}</td>
                <td>${telExt}</td>
                <td>${finalSection}</td>
                <td>${email}</td>
                <td>${roomLocation}</td>
            `;
        } else {
            alert(result.message || 'Error adding employee');
        }
    } catch (err) {
        console.error('Error submitting employee data:', err);
        alert('Error submitting data. Please try again.');
    }
});
