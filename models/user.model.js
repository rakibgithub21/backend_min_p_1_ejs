const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/minProject')

const userSchema = mongoose.Schema({
    username: String,
    name: String,
    age: Number,
    email: String,
    password: String,
    post: [
        {
            type: mongoose.Schema.Types.ObjectId,
        }
    ]
})


const user = mongoose.model('user', userSchema);
module.exports = user;