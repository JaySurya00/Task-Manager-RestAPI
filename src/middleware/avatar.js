const multer= require('multer');

const avatar=multer({
    // dest: 'users_avatar', if we dont give this avatar middleware will pass data in req.file
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpeg|png|jpg)$/)){
            return cb(new Error('Unsupported file type'));
        };
        cb(undefined, true);
    }
});

module.exports= avatar;