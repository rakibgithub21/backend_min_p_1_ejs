const express = require('express');
const app = express()

const userModel = require('./models/user.model');
const postModel = require('./models/post.model');

const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.set('view engine', "ejs") // for view engine
app.use(express.urlencoded({ extended: true })) // for get form data

app.use(express.json())  //JSON ডেটা পার্স করার জন্য Middleware
app.use(cookieParser()) //for read cookies

//for register page ejs
app.get('/register', (req, res) => {
    res.render('register')
})
//for login page ejs
app.get('/login', (req, res) => {
    res.render('login')
})


//for register
app.post('/register', async (req, res) => {
    // console.log(req.body);
    const { username, name, age, email, password } = req.body;
    const user = await userModel.findOne({ email })
    // console.log(user);

    if (user) {
        return res.status(300).status({
            message: 'User Already Registered'
        })
    }
    console.log(password);

    bcrypt.genSalt(10, function (err, salt) {
        // console.log(salt);
        bcrypt.hash(password, salt, async function (err, hash) {
            // Store hash in your password DB.
            const user = await userModel.create({
                username,
                name,
                age,
                email,
                password: hash
            })

            const token = await jwt.sign({ user }, 'hello1234')
            console.log(token);
            res.cookie('token',token)

            res.send(user)
        });
    });

})

// for login 
app.post('/login', async (req, res) => {
    // console.log(req.body);
    const { username, name, age, email, password } = req.body;
    const user = await userModel.findOne({ email })
    // console.log(user);

    if (user) {
        return res.status(300).status({
            message: 'User Already Registered'
        })
    }
    console.log(password);

    bcrypt.genSalt(10, function (err, salt) {
        // console.log(salt);
        bcrypt.hash(password, salt, async function (err, hash) {
            // Store hash in your password DB.
            const user = await userModel.create({
                username,
                name,
                age,
                email,
                password: hash
            })

            const token = await jwt.sign({ user }, 'hello1234')
            console.log(token);
            res.cookie('token', token)

            res.send(user)
        });
    });

})


app.post('/create', (req, res) => {
    res.send('Hello World')
})


app.listen(3000, () => {
    console.log('server is running on port 3000');
})