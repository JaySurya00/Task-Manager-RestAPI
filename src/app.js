const express=require("express");

require('./db/mongoose.js');
const User=require('./db/models/users.js');
const Task= require('./db/models/tasks.js');
const UserRouter=require('./routers/userRoutes.js');
const TaskRouter= require('./routers/taskRoutes.js');

const app=express();

app.use(express.json());
app.use(UserRouter, TaskRouter);

module.exports= app;