import express from 'express';

const server = express();
const PORT = process.env.port || 3000;

server.use(express.json());

server.get('/', (req, res) => {
    res.send('Node.js Microservice in TypeScript');
});
server.get('/api/data', (req, res) => {
    console.log("in the backend route")
    res.json({test: 'Testing'});
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});