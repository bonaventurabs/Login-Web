const bcrypt = require("bcrypt");
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const db = require('./db')

const app = express();

let intialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(intialPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(intialPath, "index.html"));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(intialPath, "login.html"));
})

app.post('/login-user', (req, res) => {
    const { username, password } = req.body;

    db.select('username','password')
    .from('users')
    .where({
        username: username
        // password: password
    })
    .then(data => {
        if(data.length){
            bcrypt.compare(password, data[0].password, function (err, isValid) {
                if (isValid) {
                    res.json(data[0]);
                } else {
                    res.json('username or password is incorrect');
                }
            })
        } else{
            res.json('username or password is incorrect');
        }
    })
})

app.listen(3000, (req, res) => {
    console.log('listening on port 3000.....')
})