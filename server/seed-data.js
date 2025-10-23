const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://abyrne85:TheRange1!2@gamesboysandgirls.d32jj.mongodb.net/?retryWrites=true&w=majority&appName=GamesBoysAndGirls";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function seedData() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        
        const database = client.db("gamesboys");
        const gamesCollection = database.collection("games");
        const playersCollection = database.collection("players");
        const roundsCollection = database.collection("rounds");

        // Sample players data
        const players = [
            { name: "Andrew", wins: 0, losses: 0, draws: 0, points: 0 },
            { name: "Jenny", wins: 0, losses: 0, draws: 0, points: 0 },
            { name: "Martha", wins: 0, losses: 0, draws: 0, points: 0 },
            { name: "Sarah", wins: 0, losses: 0, draws: 0, points: 0 },
            { name: "Sean", wins: 0, losses: 0, draws: 0, points: 0 }
        ];

        // Sample games data
        const games = [
            {
                gameName: "Chess",
                player1: "Andrew",
                player2: "Jenny",
                winner: "Andrew",
                date: new Date("2024-01-15"),
                round: 1
            },
            {
                gameName: "Checkers",
                player1: "Martha",
                player2: "Sarah",
                winner: "Martha",
                date: new Date("2024-01-15"),
                round: 1
            },
            {
                gameName: "Monopoly",
                player1: "Sean",
                player2: "Andrew",
                winner: "Sean",
                date: new Date("2024-01-16"),
                round: 1
            },
            {
                gameName: "Scrabble",
                player1: "Jenny",
                player2: "Martha",
                winner: "Jenny",
                date: new Date("2024-01-16"),
                round: 1
            },
            {
                gameName: "Poker",
                player1: "Sarah",
                player2: "Sean",
                winner: "Sarah",
                date: new Date("2024-01-17"),
                round: 1
            }
        ];

        // Sample rounds data
        const rounds = [
            {
                roundNumber: 1,
                date: new Date("2024-01-15"),
                games: ["Chess", "Checkers", "Monopoly", "Scrabble", "Poker"],
                completed: true
            }
        ];

        // Clear existing data (optional - remove if you want to keep existing data)
        console.log("Clearing existing data...");
        await gamesCollection.deleteMany({});
        await playersCollection.deleteMany({});
        await roundsCollection.deleteMany({});

        // Insert sample data
        console.log("Inserting players...");
        await playersCollection.insertMany(players);
        
        console.log("Inserting games...");
        await gamesCollection.insertMany(games);
        
        console.log("Inserting rounds...");
        await roundsCollection.insertMany(rounds);

        console.log("✅ Sample data inserted successfully!");
        console.log(`- ${players.length} players added`);
        console.log(`- ${games.length} games added`);
        console.log(`- ${rounds.length} rounds added`);

    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        await client.close();
        console.log("Disconnected from MongoDB");
    }
}

// Run the seeding function
seedData();
