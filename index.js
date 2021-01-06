const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;
const mongoose = require('mongoose');
const config = require('./config.json')
mongoose.connect(config.db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
    console.log('connected to db');
})
    .catch((e) => {
        console.log('error', e);
    });

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});
const User = mongoose.model('User', userSchema);

const todosSchema = new mongoose.Schema({
    userId: mongoose.Schema.ObjectId,
    todos: [
        {
            checked: Boolean,
            text: String,
            id: String,
        },
    ],
});
const Todos = mongoose.model("Todos", todosSchema);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send('Hello world');
})

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({username});
    if (user) {
        res.status(500);
        res.json({
            message: "User already exist",
        })
        return;
    }
    await User.create({username, password});
    res.json({
        message: "success",
    });
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({username});
    if (!user || user.password !== password) {
        res.status(401);
        res.json({
            message: "Invalid login",
        })
        return;
    }

    res.json({
        message: "success",
    });
});

app.post("/todos", async (req, res) => {
    const { authorization } = req.headers;
    const [,token] = authorization.split(' ');
    const [username, password] = token.split(':');
    const todosItems = req.body;

    const user = await User.findOne({username});
    if (!user || user.password !== password) {
        res.status(403);
        res.json({
            message: "invalid access",
        })
        return;
    }

    const todos = await Todos.findOne({ userId: user._id }).exec();
    if (!todos) {
        await Todos.create({
            userId: user._id,
            todos: todosItems,
        });
    } else {
        todos.todos = todosItems;
        await todos.save();
    }
    res.json(todosItems);
})


app.get("/todos", async (req, res) => {
    const { authorization } = req.headers;
    const [,token] = authorization.split(' ');
    const [username, password] = token.split(':');

    const user = await User.findOne({username});
    if (!user || user.password !== password) {
        res.status(403);
        res.json({
            message: "invalid access",
        })
        return;
    }
    const todos = await Todos.findOne({ userId: user._id }).exec();
    res.json(todos);
})


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    })
});

