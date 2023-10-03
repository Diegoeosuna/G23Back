const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel')

const registerUser = asyncHandler( async (req,res) =>{

    //desestructuramos los datos que pasamos al body
    const { name, email, password } = req.body
    if(!name || !email || !password) {
        res.status(400)
        throw new Error('Faltan datos')
    }

    //Verificamos si ese usuario existe
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error ('Ese usuario ya fue registrado en la aplicación')
    }

    //Hash el password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    //Creamos el usuario
    const user = await User.create({
        name,
        email,
        password:hashedPassword
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(400)
        throw new Error('No se pudo registrar al ususario')
    }
})

const loginUser = asyncHandler( async (req,res) =>{
    
    //Desestructuramos los datos que nos manda el ususario en el body
    const {email, password} = req.body
    if( !email || !password) {
        res.status(400)
        throw new Error('Faltan datos')
    }

    //Buscmamos al ususario
    const user = await User.findOne({email})
    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            message:'Usuario loggeado'
        })
    } else {
        res.status(400)
        throw new Error('Credenciales incorrectas')
    }
})

const getUserData = asyncHandler( async (req,res) =>{
    res.json(req.user)
})

//Función para generar el JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '60m'
    })
}

module.exports = {
    registerUser,
    loginUser,
    getUserData
}