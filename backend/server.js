const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello');
});

app.get('/health', (req, res) => {
    const isHealthy = true; // Replace with actual health check logic
    if (isHealthy) {
        res.status(200).send('Server is healthy');
    } else {
        res.status(500).send('Server is not healthy');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});