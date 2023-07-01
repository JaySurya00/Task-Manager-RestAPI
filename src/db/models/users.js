const validator= require("validator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const mongoose=require('mongoose');
const Task= require('./tasks.js');



const { Schema , model}=mongoose;



const userSchema= new Schema ({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    age:
    {
        type: Number,
        validate: {
            validator: function(value)
            {
                return value>=18;
            },
            message: "Underage",
        }

    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(value)
            {
                if(!validator.isEmail(value))
                {
                    throw new Error("Please Input Correct Email");
                }
            },

        },
    },

    password: {
        type: String,
        minLength: [7, "Password must be more than 6 character"],
        validate: {
            validator: function(value)
            {
                if(value.toLowerCase().includes("password"))
                {
                    throw new Error("Passord should not be 'password' ");
                }
            }
        }
    },

    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],

    avatar: {
        type: Buffer,
    }
},{
    timestamps:true
});

userSchema.method("genAuthToken", async function(){
    const user=this;
    const token=jwt.sign({_id: user._id}, process.env.JWT_SECRET,{expiresIn: "1h"});
    user.tokens=user.tokens.concat({token: token}); ///concat return new array while push will return new length of the array///
    await user.save();
    return token;
});

userSchema.method('toJSON', function(){
    const user=this;
    const userObj= user.toObject();

    delete userObj.password;
    delete userObj.tokens;
    delete userObj.avatar;

    return userObj;
});

userSchema.virtual('tasks',{
    ref: "Tasks",
    localField: '_id',
    foreignField: "owner"
})



userSchema.static('findByCredential', async function(email, password){
    const user= await User.findOne({email: email});
    if(!user)
    {
       throw new Error("No username found");
    }

    const isMatch= await bcrypt.compare(password, user.password);
    
    if(!isMatch){
        throw new Error("Incorrect Password");
    }
    return user;

});

userSchema.pre('save', async function(next){
    const user=this;
    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password,8);
    }
    next();
});

// userSchema.pre('remove', async function(next){
//     const user= this;
//     await Task.deleteMany({owner: user._id});
//     next();
// })


const User=model("Users",userSchema);

module.exports= User;
