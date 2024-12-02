const express = require('express');
const app = express()

app.set('view engine', "ejs")
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {
    res.send('Hello World')
})


app.listen(3000, () => {
    console.log('server is running on port 3000');
})