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

//for logout
app.get('/logout', (req, res) => {
    res.cookie('token', '')
    res.redirect('/login')
})
//for profile page
app.get('/profile', isLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email })
    console.log(user);
    user.populate('post')
    res.render('profile', { user })
})

//for register
app.post('/register', async (req, res) => {
    const { username, name, age, email, password } = req.body;
    const user = await userModel.findOne({ email })

    if (user) {
        return res.status(300).status({
            message: 'User Already Registered'
        })
    }

    bcrypt.genSalt(10, function (err, salt) {
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
            res.cookie('token', token)

            res.redirect('/profile')
        });
    });

})

// for login 
app.post('/login', async (req, res) => {

    const { email, password } = req.body;
    const user = await userModel.findOne({ email })

    if (!user) {
        res.status(500).send('Email or Password is incorrect')
    }

    bcrypt.compare(password, user.password, async function (err, result) {
        if (result) {
            const token = await jwt.sign({ user }, 'hello1234')
            res.cookie('token', token)
            res.redirect('/profile')


        }

        else res.redirect('/login')
    });

})


//for post 

app.post('/post', isLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email })

    const { content } = req.body;

    let post = await postModel.create({
        user: user._id,
        content
    })

    user.post.push(post._id)
    await user.save()

    res.redirect('/profile')

})










//make middleware for protected route
function isLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (token === '') res.redirect('/login')
    else {
        const data = jwt.verify(token, 'hello1234')
        req.user = data.user
        next()
    }

}



app.listen(3000, () => {
    console.log('server is running on port 3000');
})