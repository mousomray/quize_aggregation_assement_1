const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AnswerSchema = new Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: "UserId is Required"
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question',
        required: "Question Id is Required" 
    },
    selectedOption: {
        type: String,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const AnswerModel = mongoose.model('answer', AnswerSchema);

module.exports = AnswerModel;