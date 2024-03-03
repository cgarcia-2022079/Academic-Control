'use strict';
import Course from './course.model.js'
import User from '../user/user.model.js'
import {validateParamsEmpty} from '../utils/validator.js'

export const addCourse = async (req, res) => {
    try {
        const userId = req.user._id
        const data = req.body

        if (!validateParamsEmpty(data)) {
            return res.status(401).send({ message: 'You cannot leave empty fields, check the information you are providing.' })
        }

        const newCourse = await Course.create({ ...data, teacher: userId })

        if (!newCourse) {
            return res.status(401).send({ message: 'Error saving Course' })
        }

        // Actualiza el curso del profesor y el profesor del curso
        await Promise.all([
            User.findByIdAndUpdate(userId, { $push: { courseTeacher: newCourse._id } }),
            Course.findByIdAndUpdate(newCourse._id, { $set: { teacher: userId } })
        ])

        return res.status(201).send({ message: 'Course created successfully', newCourse })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Error in function addCourse', error })
    }
}

export const updateCourse = async (req, res) => {
    try {
        const idCourse = req.params.id
        const data = req.body
        const userId = req.user._id

        // Verificar si el usuario está asignado al curso que intenta actualizar
        const course = await Course.findOne({ _id: idCourse, teacher: userId })
        if (!course) {
            return res.status(403).send({ message: 'You are not assigned to this course or the course does not exist' })
        }

        // Actualizar el curso
        const courseUpdate = await Course.findByIdAndUpdate(idCourse, data, { new: true })
        if (!courseUpdate) {
            return res.status(401).send({ message: 'Course not found and not updated' })
        }
        
        return res.status(200).send({ message: 'Course updated successfully', courseUpdate })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Error in function updateCourse', error })
    }
}


export const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id
        const userId = req.user._id

        // Verificar si el curso existe y si el usuario que realiza la solicitud es el profesor asignado al curso
        const course = await Course.findOne({ _id: courseId, teacher: userId })
        if (!course) {
            return res.status(403).send({ message: 'You are not assigned to this course or the course does not exist' })
        }

        // Eliminar el curso y actualizar la relación con los estudiantes
        await course.deleteOne()
        await User.updateMany(
            { courseStudent: courseId },
            { $pull: { courseStudent: courseId } }
        )

        return res.status(200).send({ message: 'Course deleted successfully', course })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error deleting course', error })
    }
}

export const getAllCoursesTeacher = async (req, res) => {
    try {
        let idUser = req.user._id
        let courses = await Course.find({teacher: idUser}).select('title description students -_id').populate({ path: 'students',
            select: 'name -_id'})
        if (!courses) return res.status(404).send({message: 'Courses not found'})
        return res.status(200).send({message: 'Your courses:', courses})
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error retrieving courses', error });
    }
}

export const getAllCoursesStudent = async (req, res) => {
    try {
        let idUser = req.user._id
        let courses = await Course.find({students: idUser}).select('title description -_id').populate({path: 'teacher', 
            select: 'name -_id'})
        if (!courses) return res.status(404).send({message: 'Courses not found'})
        return res.status(200).send({message: 'Your courses:', courses})
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error retrieving courses', error });
    }
}

export const enrollInCourse = async (req, res) => {
    try {
        const studentId = req.user._id;
        const courseId = req.params.id;

        // Verificar si el estudiante ya está tomando el curso
        const student = await User.findById(studentId).populate('courseStudent');
        if (student.courseStudent.some(course => course._id.toString() === courseId)) {
            return res.status(400).send({ message: 'You are already enrolled in this course' });
        }

        // Verificar si el estudiante ha alcanzado el límite de 3 cursos
        if (student.courseStudent.length >= 3) {
            return res.status(400).send({ message: 'You have already enrolled in maximum number of courses' });
        }

        // Agregar al estudiante al curso
        await Course.findByIdAndUpdate(courseId, { $push: { students: studentId } });
        await User.findByIdAndUpdate(studentId, { $push: { courseStudent: courseId } });

        return res.status(200).send({ message: 'You have been successfully enrolled in the course' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error enrolling in course', error });
    }
};