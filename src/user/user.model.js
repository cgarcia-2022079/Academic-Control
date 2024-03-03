'use strict'
import {Schema, model} from 'mongoose'

const userSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email:{
        type: String,
        required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      upperCase: true,
      enum: ["TEACHER", "STUDENT"],
      default: 'STUDENT', //Solo los datos que esten en el arreglo son validos
      required: true,
    },
    courseStudent: [{
        type: Schema.Types.ObjectId,
        ref: "Course",
      }],
    courseTeacher:{
      type: Schema.Types.ObjectId,
      ref: "Course",
    }
},{
    versionKey: false,
});

export default model('User', userSchema);
