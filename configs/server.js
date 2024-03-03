import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from 'dotenv'
import courseRoutes from '../src/course/course.routes.js'
import userRoutes from '../src/user/user.routes.js'
import User from '../src/user/user.model.js'
import {encrypt} from '../src/utils/validator.js'

const server = express()
config()
const port = process.env.PORT || 3200

// Creación automática de un profesor al inicio
const createInitialTeacher = async () => {
    try {
        // Verificar si ya hay un profesor creado
        const existingTeacher = await User.findOne()
        if (!existingTeacher) {
            // Si no hay ningún profesor, crea uno nuevo
            const newTeacher = new User({
                name: 'Josué Noj',
                username: 'jnoj',
                email: 'jnoj@gmail.com',
                password: 'admin',
                role: 'TEACHER'
            })
            newTeacher.password = await encrypt(newTeacher.password)
            await newTeacher.save()
            console.log('New teacher created:', newTeacher)
        }
    } catch (error) {
        console.error('Error creating initial teacher:', error)
    }
}

// Configurar el servidor de express
server.use(express.urlencoded({ extended: false }))
server.use(express.json())
server.use(cors())
server.use(helmet())
server.use(morgan('dev'))

server.use('/user', userRoutes)
server.use('/course', courseRoutes)

// Levantar el servidor
export const initServer = async() => {
    // Crea el profesor inicial antes de iniciar el servidor
    await createInitialTeacher()

    server.listen(port)
    console.log(`Server HTTP runing in port ${port}`)
}