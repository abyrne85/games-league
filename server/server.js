require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const host = '0.0.0.0';
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, '../dist/games-league')));

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/games-league";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Simple shared password - in production, use environment variable
const SHARED_PASSWORD = "bit_of_fun";

let database;

// Connect to MongoDB once when server starts
async function connectToDatabase() {
    console.log('URI', uri);
    try {
        console.log("Attempting to connect to MongoDB...");
        console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Set" : "Not set");
        await client.connect();
        database = client.db("gamesboys");
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        console.log("Server will continue running without database connection");
        // Don't exit - let the server run and retry connection later
    }
}

app.get('/api/players', async (req, res) => {
    try {
        if (!database) {
            return res.status(503).json({ error: 'Database not connected' });
        }
        const players = await database.collection("players").find({}).toArray();
        res.json(players);
    } catch (error) {
        console.error('Error reading players data:', error);
        res.status(500).json({ error: 'Error fetching players' });
    }
});

app.post('/api/games', async (req, res) => {
    try {
        if (!database) {
            return res.status(503).json({ error: 'Database not connected' });
        }
        const result = await database.collection("games").insertOne(req.body);
        const game = await database.collection("games").findOne({ _id: result.insertedId });
        console.log('Game added:', game);
        res.json(game);
    } catch (error) {
        console.error('Error adding new game:', error);
        res.status(500).json({ error: 'Error adding new game' });
    }
});

app.get('/api/games', async (req, res) => {
    try {
        if (!database) {
            return res.status(503).json({ error: 'Database not connected' });
        }
        const games = await database.collection("games").find({}).toArray();
        res.json(games);
    } catch (error) {
        console.error('Error reading games data:', error);
        res.status(500).json({ error: 'Error fetching games' });
    }
});

app.get('/api/rounds', async (req, res) => {
    try {
        if (!database) {
            return res.status(503).json({ error: 'Database not connected' });
        }
        const rounds = await database.collection("rounds").find({}).toArray();
        res.json(rounds);
    } catch (error) {
        console.error('Error reading rounds data:', error);
        res.status(500).json({ error: 'Error fetching rounds' });
    }
});

app.post('/api/rounds', async (req, res) => {
    try {
        if (!database) {
            return res.status(503).json({ error: 'Database not connected' });
        }
        const result = await database.collection("rounds").insertOne(req.body);
        const round = await database.collection("rounds").findOne({ _id: result.insertedId });
        res.json(round);
    } catch (error) {
        console.error('Error adding new round:', error);
        res.status(500).json({ error: 'Error adding new round' });
    }
});

// Simple login endpoint
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    
    if (password === SHARED_PASSWORD) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

// For any other routes, send the index.html file from Angular
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/games-league/index.html'));
});


// Start the server
async function startServer() {
    await connectToDatabase();
    app.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`);
    });
}

startServer().catch(console.error);

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await client.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Shutting down gracefully...');
    await client.close();
    process.exit(0);
});