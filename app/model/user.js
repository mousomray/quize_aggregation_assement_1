const mongoose = require('mongoose')
const Schema = mongoose.Schema


const UserSchema = new Schema({
    name: {
        type: String,
        required: "Name is Required",
        minlength: [3, 'Name must be at least 3 characters long']
    },
    email: {
        type: String,
        required: "Email is Required",
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email address should follow the format: abc@gmail.com']
    },
    password: {
        type: String,
        required: "Password is Required",
        minlength: [8, 'Password must be at least 8 characters long']
    },
    image: {
        type: String,
        required: "Image is required"
    },
    is_verified: { type: Boolean, default: false },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },


})

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;