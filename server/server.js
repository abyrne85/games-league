const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = process.env.PORT || 3000;

// SQLite database setup
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});


// Define the Game model
const Game = sequelize.define('Game', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nickName: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


// Define the Player model
const Player = sequelize.define('Player', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


// Define the Round model
const Round = sequelize.define('Round', {
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

// Define associations
Round.belongsTo(Game);
Round.belongsToMany(Player, { through: 'RoundPlayers' });
Round.belongsTo(Player, { as: 'winner' });
Round.belongsTo(Player, { as: 'runnerUp' });


// Sync the model with the database
sequelize.sync();

app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/rounds', async (req, res) => {
    try {
        const rounds = await Round.findAll();
        res.json(rounds);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching rounds' });
    }
});

app.get('/players', async (req, res) => {
    try {
        const players = await Player.findAll();
        res.json(players);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching players' });
    }
});

app.get('/games', async (req, res) => {
    try {
        const games = await Game.findAll();
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching games' });
    }
});

app.post('/rounds', async (req, res) => {
    try {
        const { players, winner, runnerUp, game, date } = req.body;
        await Round.create({ players, winner, runnerUp, game, date });
        res.json('Round saved successfully');
    } catch (error) {
        res.status(500).json({ error: 'Error saving round' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});