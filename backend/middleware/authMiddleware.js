const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../controllers/usersControllers')

const protect = asyncHandler ( async (req, res, next) => {
    let token 
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            //obtenemos el token
            token = req.headers.authorization.split(' ')[1]

            //Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            //Obtener los datos del ususario del token
            req.user = await User.findByID(decoded.id).select('-password')

            next()

        } catch (error){
            console.log(error)
            res.status(404)
            throw new Error('Acceso no autorizado')
        }
    } 
    if(!token){
        res.status(401)
        throw new Error ('Acceso no autorizado')
    }

})

module.exports = { protect }