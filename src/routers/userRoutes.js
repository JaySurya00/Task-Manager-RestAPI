const express=require('express');
const router= new express.Router();
const User= require('../db/models/users.js');
const authorization= require('../middleware/authorization.js');
const Task= require('../db/models/tasks.js');
const avatar= require('../middleware/avatar.js');
const sharp= require('sharp');
const { sendWelcomeMail, sendGoodbyeMail }= require('../emails/accounts.js');



router.post('/users', async (req, res)=>{
    const user= new User(req.body);

    try
    {
        const newUser=await user.save();
        const token= await user.genAuthToken();
        sendWelcomeMail(newUser.name, newUser.email);
        res.status(200).send({newUser, token});
    }
    catch(error)
    {
        res.status(400).send(error);
    }

    // user.save().then(()=>{res.send(user)}).catch((err)=>{
    //     res.status(400);
    //     res.send(err)});

});

router.get('/users/me', authorization, async (req,res)=>{
    res.status(200).send(req.user);
    // User.find({}).then((user)=>{res.send(user)}).catch((err)=>{res.status(400).send(err)});
});


router.patch('/users/me', authorization, async (req, res)=>{

    const update=Object.keys(req.body);
    const allowedUpdate=['name','age', 'email', 'password'];
    const errorField=[];
    update.forEach((field)=>{
        if(!allowedUpdate.includes(field))
        {
            errorField.push(field);
        }
    });

    if(errorField.length!==0)
    {
        return res.status(404).send(`Invalid Field: ${errorField}`);
    };

    try{
        // const _id=req.params.id;
        const user= await User.findByIdAndUpdate(req.user._id);
        update.forEach((field)=>{
            user[field]=req.body[field];
        });
        const updateResult= await user.save();
        // const updateResult= await User.findByIdAndUpdate(_id, req.body,{new: true, runValidators: true});
        res.status(200).send(updateResult);
    }
    catch(error){
       res.status(400).send(error);
    }
});

router.delete('/users/me', authorization, async (req, res)=>{
    try{
        const deleteProfile= await User.findByIdAndDelete(req.user._id);
        await Task.deleteMany({owner: req.user._id});
        sendGoodbyeMail(req.user.name, req.user.email);
        res.status(200).send(deleteProfile);

    }
    catch(error){
        res.status(404).send(error);
    }
});


router.post('/users/login', async(req, res)=>{
    try{
        const user= await User.findByCredential(req.body.email,req.body.password);
        const token= await user.genAuthToken();
        res.status(200).send({user, token});
    }
    catch(error){
        res.status(401).send(error);
    }
    
});

router.post('/users/logout', authorization, async (req,res)=>{

    try{
        req.user.tokens= req.user.tokens.filter((token)=>{console.log (token.token!==req.token)});
        await req.user.save();
        res.status(200).send();
    } catch(error){
        res.status(500).send(error);
    }
});

router.post('/users/me/avatar',authorization,avatar.single('avatar'), async (req, res)=>{
    const buffer= await sharp(req.file.buffer).resize({ width:250, height:250 }).png().toBuffer()
    req.user.avatar= buffer;
    await req.user.save();
    res.send('file Uploaded');
},(error, req, res, next)=>{
    res.status(400).send(error.message);
});

router.delete('/users/me/avatar',authorization, async (req, res)=>{
    
    req.user.avatar= undefined;
    await req.user.save();
    res.status(200).send('Avatar deleted');
});

router.get('/users/:id/avatar', async (req,res)=>{
    try{
        const user= await User.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error();
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    }
    catch(error){
        res.status(404).send();
    }
    
})

module.exports= router;