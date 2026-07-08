const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static(__dirname));


const db = new sqlite3.Database(path.join(__dirname, 'Expense-Tracker.db'), (err) => {
    if (err) console.error("Database connection failed:", err.message);
    else console.log("Connected to SQLite Database.");
});


db.serialize(() => {

    db.run(`CREATE TABLE IF NOT EXISTS Users (
        User_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        Password TEXT NOT NULL
    )`);

    // 2. Expenses Table (Enhanced with Category and Timestamp)
    db.run(`CREATE TABLE IF NOT EXISTS Expenses (
        Expense_ID INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        User_ID INTEGER,
        FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
    )`);
});



app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Incorrect Username & Password ! " });

    const query = `INSERT INTO Users (username, Password) VALUES (?, ?)`;
    db.run(query, [username, password], function(err) {
        if (err) {
            if (err.message.includes("UNIQUE")) return res.status(400).json({ error: "Yeh username pehle se majood hai!" });
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "Account successfully created!" });
    });
});


app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM Users WHERE username = ? AND Password = ?`;
    
    db.get(query, [username, password], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(400).json({ error: "Incorrect Username & Password ! " });
        
        res.status(200).json({ message: "Login Successful!", userId: user.User_ID, username: user.username });
    });
});


app.get('/api/expenses/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = `SELECT * FROM Expenses WHERE User_ID = ? ORDER BY created_at DESC`;

    db.all(query, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(rows);
    });
});


app.post('/api/expenses', (req, res) => {
    const { description, amount, category, userId } = req.body;

    if (!description || description.trim() === "") return res.status(400).json({ error: "Dscription Must Be Written! " });
    if (!amount || amount <= 0) return res.status(400).json({ error: "Enter Correct Amount!" });
    if (!category) return res.status(400).json({ error: "Category Must Be Selected! " });
    if (!userId) return res.status(400).json({ error: "User identity missing!" });

    const query = `INSERT INTO Expenses (description, amount, category, User_ID) VALUES (?, ?, ?, ?)`;
    db.run(query, [description, amount, category, userId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Expense added to database!" });
    });
});


app.delete('/api/expenses/:expenseId', (req, res) => {
    const expenseId = req.params.expenseId;
    const query = `DELETE FROM Expenses WHERE Expense_ID = ?`;

    db.run(query, [expenseId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Expense deleted successfully!" });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));