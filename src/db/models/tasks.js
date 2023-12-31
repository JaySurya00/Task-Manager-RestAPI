const validator= require("validator");


const mongoose=require('mongoose');

const { Schema , model}=mongoose;



const taskSchema= new Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    owner:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    }
},{
    timestamps: true
})

const Task=model("Tasks", taskSchema);

module.exports= Task;