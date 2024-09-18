const API_URL = 'https://studentmanagementapi-zosu.onrender.com';

async function fetchStudents() {
    try {
        const response = await fetch(`${API_URL}/readAllStudents`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const students = await response.json();
        displayStudents(students);
    } catch (error) {
        console.error('Error fetching students:', error);
    }
}

function displayStudents(students) {
    const studentList = document.getElementById('student-list');
    studentList.innerHTML = '';

    students.forEach(student => {
        const studentItem = document.createElement('div');
        studentItem.classList.add('student-item');
        studentItem.innerHTML = `
            <span>
                <strong>ID:</strong> ${student._id} | 
                <strong>First Name:</strong> ${student.firstName} | 
                <strong>Last Name:</strong> ${student.lastName} | 
                <strong>Date of Birth:</strong> ${student.dateOfBirth} | 
                <strong>Email:</strong> ${student.email} | 
                <strong>Courses:</strong> ${student.courses.join(", ")}
            </span>
        `;
        studentList.appendChild(studentItem);

        studentItem.addEventListener('click', () => {
            populateUpdateForm(student);
        });
    });
}

function populateUpdateForm(student) {
    document.getElementById('update-id').value = student._id;
    document.getElementById('update-firstName').value = student.firstName;
    document.getElementById('update-lastName').value = student.lastName;
    document.getElementById('update-dateOfBirth').value = student.dateOfBirth;
    document.getElementById('update-email').value = student.email;
    document.getElementById('update-courses').value = student.courses.join(', ');
}

document.getElementById('studentForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const email = document.getElementById('email').value;
    const courses = document.getElementById('courses').value.split(',').map(course => course.trim());

    const student = {
        firstName,
        lastName,
        dateOfBirth,
        email,
        courses
    };

    try {
        await fetch(`${API_URL}/addStudent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student)
        });
        await fetchStudents();
        const successMessage = document.getElementById('success-message');
        successMessage.style.display = 'block';


        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);

        document.getElementById('studentForm').reset();
    } catch (error) {
        console.error('Error adding student:', error);
    }
});
document.getElementById('update-button').addEventListener('click', async function (e) {
    e.preventDefault();

    const id = document.getElementById('update-id').value;
    const firstName = document.getElementById('update-firstName').value;
    const lastName = document.getElementById('update-lastName').value;
    const dateOfBirth = document.getElementById('update-dateOfBirth').value;
    const email = document.getElementById('update-email').value;
    const courses = document.getElementById('update-courses').value.split(',').map(course => course.trim());

    if (!id) {
        alert('Please provide the Student Data.');
        return;
    }

    const updatedStudent = {
        id,
        firstName,
        lastName,
        dateOfBirth,
        email,
        courses
    };

    try {
        await fetch(`${API_URL}/updateStudent?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedStudent)
        });
        await fetchStudents();
        const successMessage = document.getElementById('success-message');
        successMessage.textContent = 'Student updated successfully!';
        successMessage.style.display = 'block';



        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);

        document.getElementById('update-student-form').reset();
    } catch (error) {
        console.error('Error updating student:', error);
    }
});

document.getElementById('delete-button').addEventListener('click', async function () {
    const id = document.getElementById('update-id').value;

    if (!id) {
        alert('Please provide the Student ID to delete.');
        return;
    }

    try {
        const confirmDelete = confirm('Are you sure you want to delete this student?');
        if (!confirmDelete) return;

        await fetch(`${API_URL}/removeStudent?id=${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        await fetchStudents();

        const successMessage = document.getElementById('success-message');
        successMessage.textContent = 'Student deleted successfully!';
        successMessage.style.display = 'block';



        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);

        document.getElementById('update-student-form').reset();
    } catch (error) {
        console.error('Error deleting student:', error);
    }
});


fetchStudents();
