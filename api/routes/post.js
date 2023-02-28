const express = require('express');
const route = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename: function(req,file,cb){
        cb(null, file.originalname);
    }
});

const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
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

const Post = require('../models/post');

route.get('/',(req,res,next) => {
    Post.find()
    .select('title description _id image')
    .exec()
    .then(result => {
        res.status(200).json({
            post : result,
            message: 'post list fetched successfully'
        });
    })
    .catch(err => {
        res.status(500).json({
            error : err
        });
    })
    
});

route.post('/', upload.single('image') ,async (req,res,next) => {
    console.log(req.file);
    const post = await Post.create(req.body);
    res.status(201).json({
        postDetail: {
          _id : post._id,
          title : post.title,
          description : post.description,
          image: post.image
        },
        message: "Post Created Successfully",
      });
});

route.get('/:postId',(req,res,next) =>{
    const id = req.params.postId;

    Post.findById(id)
    .select('title description _id image')
    .exec()
    .then(result => {
        if(!result){
            res.status(404).json({
                message: 'Post detail not found'
            });
        }
        res.status(200).json({
            post:result,
            message: 'Post detail fetched successfully'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

route.delete('/:postId',(req,res,next) => {
    const id = req.params.postId;
    Post.remove({_id : id})
    .exec()
    .then(result => {
        res.status(200).json({
            message : 'Post deleted successfully'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

route.patch('/:postId',(req,res,next) => {
    const id = req.params.postId;
    const updatePost = {};

    for(const data of req.body){
        updatePost[data.propName] = data.value;
    }

    Post.updateOne({_id : id}, {$set : updatePost})
    .exec()
    .then(result => {
        res.status(200).json({
            message : 'Post detail updated successfully'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = route;
