const express = require('express')
const uploadImage = require('../helper/imagehandler') // Image handle Area
const Authcontroller = require('../controller/AuthController')
const { Auth } = require('../middleware/auth')
const router = express.Router()

router.post('/register', uploadImage.single('image'), Authcontroller.register) // Register
router.post('/verifyotp', Authcontroller.verifyOtp) // For verify OTP
router.post('/login', Authcontroller.login) // Login
router.get('/dashboard', Auth, Authcontroller.dashboard) // Dashboard Data
router.put('/editprofile/:userId', Auth,uploadImage.single('image'), Authcontroller.updateUser) // Edit Profile
router.post('/deleteaccount', Auth, Authcontroller.deleteUser); // Delete User

module.exports = router 