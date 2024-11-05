const express = require('express');
const cors = require('cors'); // Import the cors package
const app = express();
const PORT = process.env.PORT || 8000;
const { getCurrentStatus } = require('./cardanoCommands'); // Import the CLI commands
const nameRoutes = require('./routes/name'); 
const balanceRouter = require('./routes/balanceRouter'); 
const transaction = require('./routes/transaction');

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS with specific origin (frontend URL)
app.use(cors({
    origin: 'http://localhost:3000',  // Only allow requests from React frontend (localhost:3000)
    methods: ['GET', 'POST'],         // Allow only specific HTTP methods (GET and POST)
    credentials: true,                // Allow credentials (cookies, authorization headers)
}));

// Use the name routes
app.use('/api/name', nameRoutes);

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Example route to get the current tip of the blockchain
app.get('/cardano/tip', async (req, res) => {
    try {
        const result = await getCurrentStatus(); // Call the function from cardanoCommands.js
        res.json({ tip: result });
    } catch (error) {
        res.status(500).json({ error: error.message }); // Send a more specific error message
    }
});

// Use the balance router
app.use('/api', balanceRouter);

// Use the transqaction router
app.use('/api', transaction);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
