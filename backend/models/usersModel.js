const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Por favor teclea un nombre de usuario."]
    },
    email: {
        type: String,
        required: [true, "Por favor teclea un email."],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Por favor teclea una contraseña."]
    }
},{
    timestamps:true
})

module.exports = mongoose.model('User', userSchema)