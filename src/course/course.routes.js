'use strict'

import {Router} from 'express'
import { addCourse, deleteCourse, updateCourse, getAllCoursesTeacher, enrollInCourse, getAllCoursesStudent} from './course.controller.js'
import {validateJwt, isTeacher} from '../middlewares/validate-jwt.js'

const api = Router()
//Rutas de Student
api.get('/get', [validateJwt], getAllCoursesStudent)
api.post('/assignedCourse/:id', [validateJwt], enrollInCourse)
// Rutas de Teacher
api.delete('/delete/:id',[validateJwt, isTeacher], deleteCourse)
api.put('/update/:id', [validateJwt, isTeacher], updateCourse)
api.post('/save',[validateJwt, isTeacher], addCourse)
api.get('/myCourses', [validateJwt, isTeacher], getAllCoursesTeacher)
export default api