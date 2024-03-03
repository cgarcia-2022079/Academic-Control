'use strict'
import jwt from 'jsonwebtoken'

const secretKey = '@LlaveCentroEducativo@'

export const generateJwt = async (payload) => {
    try {
        return jwt.sign(payload, secretKey, {
            expiresIn: '3h',
            algorithm: 'HS256'
        })      
    } catch (error) {
        console.log(error)
        return error
    }
}