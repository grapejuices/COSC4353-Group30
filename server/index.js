const express = require('express');
const app = express();
const port = 3000;

const volunteerParticipation = [
    { name: 'John Doe', hours: 10 },
    { name: 'Jane Smith', hours: 15 },
    { name: 'Alice Johnson', hours: 8 },
];

app.get('/api/volunteer-participation', (req, res) => {
    res.json(volunteerParticipation);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
