'use strict'
import User from './user.model.js'
import {encrypt, checkPassword} from '../utils/validator.js'
import {generateJwt} from '../utils/jwt.js'

export const register = async (req, res) => {
    try {
        let data = req.body;
        data.password = await encrypt(data.password);
        let user = new User(data)
        await user.save()
        return res.send({message: 'User is saved successfully', user})
    } catch (error) {
        return res.status(400).send({message: error.message})
    }
}

export const login = async (req, res) =>{
    try {
        let {email, password, username} = req.body
        let user = await User.findOne({$or: [{username}, {email}]})
        if (user && (await checkPassword(password, user.password))) {
            let loggedUser ={
                uid: user._id,
                username: user.username,
                email: user.email
            }
            let token = await generateJwt(loggedUser)
            return res.status(200).send({message: `Welcome ${user.name}`,loggedUser, token})
        }
        return res.status(401).send({message: 'Invalid credentials'})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message: 'Error logging in user', error})
    }
}

export const updateUser = async (req, res) => {
    try {
        let { passwordOld, passwordNew, ...userData } = req.body
        let userId = req.user._id.toString()
        if (passwordOld && passwordNew) {
            let user = await User.findById(userId)
            if (!user) {
                return res.status(404).send({ message: 'User not found.' })
            }
            if (!(await checkPassword(passwordOld, user.password))) {
                return res.status(401).send({ message: 'Incorrect old password.' })
            }
            userData.password = await encrypt(passwordNew)
        }
        let user = await User.findByIdAndUpdate(userId, userData, { new: true })
        if (!user) return res.status(404).send({ message: 'User not found.' })
        let loggedUser = await generateJwt({
            uid: user._id,
            username: user.username,
            email: user.email
        })
        return res.status(200).send({ message: 'User updated successfully', loggedUser })
    } catch (error) {
        console.error('Error updating user:', error)
        return res.status(500).send({ message: 'Error updating user', error })
    }
}

export const deleteUser = async (req, res) => {
    try {
        let userId = req.user._id.toString()
        let user = await User.findByIdAndDelete(userId)
        if (!user) return res.status(404).send({ message: 'User not found.'})
        return res.status(200).send({ message: 'User deleted successfully'})
    } catch (error) {
        console.error('Error deleting user:', error)
        return res.status(500).send({ message: 'Error deleting user', error })
    }
}