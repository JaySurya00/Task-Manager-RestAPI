const jwt= require('jsonwebtoken');
const User= require('../db/models/users.js')

const authorization=  async function(req, res, next){

try {   const token= req.headers.authorization.replace("Bearer","").trim();
        const decode= jwt.verify(token, process.env.JWT_SECRET);
        
        const user= await User.findOne({_id: decode._id});

        if(!user)
        {
            res.status(401).send("Authorization failed");
        }
        else{
            req.user=user;
            req.token=token;
            next();
        }
    }
catch(error){
    res.status(401).send(error);
}
}

module.exports=authorization;