const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    // _id : mongoose.Schema.Types.ObjectId,
    title : {type : String, required : true},
    description : {type: String, required: true},
    image : {type: String}
});

module.exports = mongoose.model('Post',postSchema);