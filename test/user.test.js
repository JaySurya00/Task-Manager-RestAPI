const request= require('supertest');
const app= require('../src/app.js');
const User= require('../src/db/models/users.js');
const mongoose= require('mongoose');
const jwt= require('jsonwebtoken');

const userOneId= new mongoose.Types.ObjectId();

const userOne= {
    _id: userOneId,
    name: "Saurabh Raj",
    email: "saurabhraj239@gmail.com",
    password: "SaurabhRaj239",
    tokens: [{token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)}],
}

beforeEach(async ()=>{
    await User.deleteMany({});
    await new User(userOne).save();
})

test("user signup",async ()=>{
    const response= await request(app).post('/users').send({
        name: "Jay Surya",
        email: "jaysurya.dnd@gamil.com",
        password: "JaySurya00"
    }).expect(200);

    const user= await User.findById(response.body.newUser._id);
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
        newUser:{
            name: "Jay Surya"
        }
    })

});

test('Not login',async ()=>{
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: "WrongPassword",
    }).expect(401)
});

test("GET profile",async ()=>{

    await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
});

test("NOT GET profile",async ()=>{

    await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}+5`)
            .send()
            .expect(401)
});

test("Delete profile",async ()=>{

    await request(app)
            .delete('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
});

test("Not Delete profile",async ()=>{

    await request(app)
            .delete('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}9`)
            .send()
            .expect(401)
});

