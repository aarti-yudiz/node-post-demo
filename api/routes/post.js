const express = require('express');
const route = express.Router();
const multer = require('multer');
const Post = require('../models/post');
const PostController = require('../controllers/post');

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


route.get('/',PostController.getAllPosts);

route.post('/', upload.single('image') , PostController.addPost);

route.get('/:postId',PostController.getPostDetail);

route.delete('/:postId',PostController.deletePost);

route.patch('/:postId', PostController.updatePost);

module.exports = route;
