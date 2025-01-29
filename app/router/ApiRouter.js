const express = require('express')
const ApiController = require('../controller/ApiController')
const { Auth } = require('../middleware/auth')
const router = express.Router()

router.post('/addquestion', Auth, ApiController.addQuestion)
router.post('/addcategory', Auth, ApiController.addCategory)
router.get('/questionlist', Auth, ApiController.QuestionList)
router.post('/postanswer', Auth, ApiController.postAnswer)
router.get('/searchanswer', Auth, ApiController.search)
router.get('/categorycount', Auth, ApiController.CatCount)

module.exports = router 