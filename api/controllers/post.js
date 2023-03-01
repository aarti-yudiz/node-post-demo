const Post = require('../models/post');


exports.getAllPosts = (req,res,next) => {
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
    
}

exports.addPost = async (req,res,next) => {
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
}

exports.getPostDetail = (req,res,next) =>{
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
}

exports.deletePost = (req,res,next) => {
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
}

exports.updatePost = (req,res,next) => {
    const id = req.params.postId;
    const updatePost = {};

    for(const data of req.body){
        updatePost[data.propName] = data.value;
    }

    Post.updateOne({_id : id}, {$set : updatePost})
    .exec()
    .then(result => {
        res.status(200).json({
            updatedData: updatePost,
            message : 'Post detail updated successfully'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}