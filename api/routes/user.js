const express = require('express');
const route = express.Router();
const multer = require('multer');
const User = require('../models/user');
const UserController = require('../controllers/user');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename: function(req,file,cb){
        cb(null, file.originalname);
    }
});

const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg')
    {
        cb(null,true);
    }else{
        cb(null,false);
    }
};

const upload = multer({
    storage: storage, 
    limits : {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

route.post('/',upload.single('image'),UserController.createUser);

route.get('/',UserController.getAllUser);

route.delete('/:userId',UserController.deleteUser);

route.post('/login',UserController.login);

module.exports = route;