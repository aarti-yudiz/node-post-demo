const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.createUser = async (req,res,next) => {
    console.log(req.file);
    bcrypt.hash(req.body.password,10, function(err,hash){
        if(err)
        {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        }else{
            const user = User.create(req.body);
                console.log(user);
                res.status(201).json({
                    userDetail: {
                        _id: user._id,
                        email: user.email,
                        password: hash,
                        image:user.image
                    },
                    message: 'User created Successfully'
                });
        }
    })
    
}

exports.getAllUser = (req,res,next) => {
    User.find()
    .exec()
    .then(result => {
        res.status(200).json({
            user: {
                _id: result._id,
                email: result.email,
                password: result.password
            },
            message: 'Get all user successfully'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.deleteUser = (req,res,next) => {
    const id = req.params.userId;
    User.findByIdAndDelete(id)
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted sucessfully'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.login = (req,res,next) => {
    console.log("hello");
    const email = req.body.email;
    User.find(email)
    .exec()
    .then(user => {
        console.log(user);
        if(user.length < 1)
        {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err,result) => {
            if(err)
            {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            if(result)
            {
                return res.status(200).json({
                    message: 'Auth Successful'
                });
            }

            return res.status(401).json({
                message: 'Auth failed'
            });
        });
    })
    // .catch(err => {
    //     console.log(err);
    //     res.status(500).json({
    //         error: err
    //     });
    // });   
}