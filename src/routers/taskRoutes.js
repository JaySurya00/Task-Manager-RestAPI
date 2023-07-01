const express=require('express');
const router=new  express.Router();
const Task= require('../db/models/tasks.js');
const authorization= require('../middleware/authorization.js');



router.post('/tasks', authorization, async (req, res)=>{

    try
    {
        const task= new Task({
            ...req.body,
            owner: req.user.id
        });
        await task.save();
        res.status(201).send(task);
    }
    catch(error)
    {
        res.status(500).send(error);
    }
    // const task =new Task(req.body);
    // task.save().then(()=>{res.send(task)}).catch((err)=>{res.status(400).send(err)});
    // console.log(task);
});


router.get('/tasks', authorization,async (req, res)=>{

    try{
        const match={};
        const sort={};
        if(req.query.completed){
            match.completed= req.query.completed === "true";
        }

        if(req.query.sortBy){
            const parts= req.query.sortBy.split(':');
            console.log(parts);
            sort[parts[0]]= parts[1] === 'asc'?1:-1;
        }
        console.log(sort);
        // const task= await Task.find({owner: req.user._id});
        await req.user.populate({
            path: "tasks",
            match: match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort:sort
            }
        });
        const task= req.user.tasks;
        if(!task)
        {
            res.status(404).send();
        }
        res.status(200).send(task);
    }
    catch(error)
    {
        res.status(404).send(error);
    }
    // Task.find({}).then((tasks)=>{
    //     res.status(200).send(tasks)}).catch((error)=>res.status(500).send(error));
});

router.get('/tasks/:id', authorization,async (req, res)=>{
    
    try{
        const _id=req.params.id;
        // const task= await Task.findById( _id );
        const task= await Task.findOne({_id, owner: req.user._id});
        console.log(task);
        if(!task){
            return res.status(404).send("No task found");
        }
        res.status(200).send(task);
    }
    catch(error){
        res.status(500).send(error);
    }
    // const _id=req.params.id;
    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         res.status(404).send();
    //         return;
    //     }
    //     res.status(200).send(task)
    // }).catch((error)=>{res.status(500).send(error)});
});


router.patch('/tasks/:id', authorization, async (req, res)=>{

    const update=Object.keys(req.body);
    const allowedUpdate=['description', 'completed'];
    const errorField=[];
    update.every((field)=>{
        if(!allowedUpdate.includes(field))
        {
            errorField.push(field);
        }
    });
    if(errorField.length!==0)
    {
        return res.status(400).send(`Invalid field: ${errorField}`);
    }



    try{
        const _id=req.params.id;
 
        const updatedTask= await Task.findOne({_id, owner: req.user._id});
            allowedUpdate.forEach((field)=>{
            updatedTask[field]=req.body[field];
        });
        await updatedTask.save();

        res.status(200).send(updatedTask);
    }
    catch(error){
        res.status(500).send(error);
    }
});

router.delete('/tasks/:id', authorization,async (req, res)=>{
    try{
        const _id=req.params.id;
        const deleteTask= await Task.findOneAndDelete({_id, owner: req.user._id});
        res.status(200).send(deleteTask);

    }
    catch(error){
        res.status(404).send(error);
    }
});

module.exports=router;