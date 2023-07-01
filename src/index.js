const express=require("express");

require('./db/mongoose.js');
const User=require('./db/models/users.js');
const Task= require('./db/models/tasks.js');
const UserRouter=require('./routers/userRoutes.js');
const TaskRouter= require('./routers/taskRoutes.js');


const app=express();
const port= process.env.PORT;

app.use(express.json());


app.listen(port,()=>{
    console.log("Server is up on port "+ port);
});

app.use(UserRouter, TaskRouter);






