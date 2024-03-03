import {Schema, model} from "mongoose";

const courseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String, 
    required: true
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }]
},{
  versionKey: false,
});

export default model("Course", courseSchema);