const express = require('express');
const app = express()
const userModel = require('./models/user.model');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

app.set('view engine', "ejs") // for view engine
app.use(express.urlencoded({ extended: true })) // for get form data

app.use(express.json())  //JSON ডেটা পার্স করার জন্য Middleware
app.use(cookieParser()) //for read cookies

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    console.log(req.body);
    const { username, name, age, email, password } = req.body;
    const user = await userModel.findOne({ email })
    console.log(user);

    if (user) {
        return res.status(300).status({
            message: 'User Already Registered'
        })
    }
    console.log(password);

    bcrypt.genSalt(10, function (err, salt) {
        console.log(salt);
        bcrypt.hash(password, salt, async function (err, hash) {
            // Store hash in your password DB.
            const user = await userModel.create({
                username,
                name,
                age,
                email,
                password: hash
            })
            
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