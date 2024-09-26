const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8080;
const host = '0.0.0.0';
const path = require('path');
const fs = require('fs');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, '../dist/games-league')));


app.get('/api/players', async (req, res) => {
    
    try {
        const playersData = fs.readFileSync(path.join(__dirname, 'data', 'players.json'), 'utf8');
        const players = JSON.parse(playersData);
        res.json(players);
    } catch (error) {
        console.error('Error reading players data:', error);
        res.status(500).json({ error: 'Error fetching players' });
    }
});

app.get('/api/games', async (req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');
        const gamesData = fs.readFileSync(path.join(__dirname, 'data', 'games.json'), 'utf8');
        const games = JSON.parse(gamesData);
        res.json(games);
    } catch (error) {
        console.error('Error reading games data:', error);
        res.status(500).json({ error: 'Error fetching games' });
    }
});

app.get('/api/rounds', async (req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');
        const roundsData = fs.readFileSync(path.join(__dirname, 'data', 'rounds.json'), 'utf8');
        const rounds = JSON.parse(roundsData);
        res.json(rounds);   
    } catch (error) {
        console.error('Error reading rounds data:', error);
        res.status(500).json({ error: 'Error fetching rounds' });
    }
});

app.post('/api/rounds', async (req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');
        const roundsFilePath = path.join(__dirname, 'data', 'rounds.json');

        // Read existing rounds
        const roundsData = fs.readFileSync(roundsFilePath, 'utf8');
        const rounds = JSON.parse(roundsData);

        // Generate a new ID
        const newId = rounds.length > 0 ? Math.max(...rounds.map(r => r.id)) + 1 : 1;

        // Create new round object
        const newRound = {
            id: newId,
            ...req.body
        };

        // Add new round to the array
        rounds.push(newRound);

        // Write updated rounds back to file
        fs.writeFileSync(roundsFilePath, JSON.stringify(rounds, null, 4));

        res.status(201).json(newRound);
    } catch (error) {
        console.error('Error adding new round:', error);
        res.status(500).json({ error: 'Error adding new round' });
    }
});

// For any other routes, send the index.html file from Angular
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/games-league/index.html'));
});


app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});