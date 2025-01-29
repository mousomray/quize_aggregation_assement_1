const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QuestionSchema = new Schema({
    questionText: {
        type: String,
        required: "Question text is required"
    },
    correctanswer: {
        type: String,
        required: "Correct answer is required"
    },
    options: {
        type: Array, 
        required: true
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: "Category is Required"
    }],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: "Posted by is Required"
    }
}, { timestamps: true })

const QuestionModel = mongoose.model('question', QuestionSchema);

module.exports = QuestionModel;