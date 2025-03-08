async function fetchVolunteerParticipation() {
    try {
        const response = await fetch('http://localhost:3000/api/volunteer-participation');
        const data = await response.json();
        console.log('Volunteer Participation:', data);
        const table = document.getElementById('volunteerTable');
        data.forEach(volunteer => {
            const row = table.insertRow();
            const nameCell = row.insertCell(0);
            const hoursCell = row.insertCell(1);
            nameCell.textContent = volunteer.name;
            hoursCell.textContent = volunteer.hours;
        });
    } catch (error) {
        console.error('Error fetching volunteer participation:', error);
    }
}

fetchVolunteerParticipation();