const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/minProject')

const userSchema = mongoose.Schema({

})


const user = mongoose.model('user', userSchema);
module.exports = user;