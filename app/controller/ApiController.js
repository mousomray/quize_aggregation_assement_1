const QuestionModel = require('../model/question')
const CategoryModel = require('../model/category')
const AnswerModel = require('../model/answer')

class ApiController {

    // Add Question
    async addQuestion(req, res) {
        try {
            if (req.user.role !== "admin") {
                return res.status(400).json({ message: "Only admin can add question" });
            }

            // Handle Array for option and category
            const option = Array.isArray(req.body.options) ? req.body.options : req.body.options.split(',').map(op => op.trim());
            const category = Array.isArray(req.body.categories) ? req.body.categories : req.body.categories.split(',').map(cat => cat.trim());

            const questiondata = new QuestionModel({ ...req.body, options: option, categories: category });
            const data = await questiondata.save();
            res.status(201).json({ message: "Question added successfully", data });
        } catch (error) {
            const statusCode = error.name === 'ValidationError' ? 400 : 500;
            const message = error.name === 'ValidationError'
                ? { message: "Validation error", errors: Object.values(error.errors).map(err => err.message) }
                : { message: "An unexpected error occurred" };

            console.error(error);
            res.status(statusCode).json(message);
        }
    }

    // Add Category
    async addCategory(req, res) {
        try {
            console.log("Myddd...", req.user)
            // Check if the user is an admin
            if (req.user.role !== "admin") {
                return res.status(400).json({ message: "Only admin can add category" });
            }
            const categorydata = new CategoryModel(req.body);
            const data = await categorydata.save();
            res.status(201).json({ message: "Category added successfully", data });
        } catch (error) {
            const statusCode = error.name === 'ValidationError' ? 400 : 500;
            const message = error.name === 'ValidationError'
                ? { message: "Validation error", errors: Object.values(error.errors).map(err => err.message) }
                : { message: "An unexpected error occurred" };

            console.error(error);
            res.status(statusCode).json(message);
        }
    }

    // List of questions for each category 
    async QuestionList(req, res) {
        try {
            const questiondata = await QuestionModel.aggregate([
                {
                    $lookup:
                    {
                        from: "categories",
                        localField: "categories",
                        foreignField: "_id",
                        as: "categorydetails"
                    }
                },
                {
                    $project:
                    {
                        "correctanswer": 0,
                        "categories": 0,
                        "__v": 0,
                        "categorydetails.__v": 0,
                        "postedBy": 0
                    }
                }
            ])
            res.status(200).json({ message: "Question list are fetched", questiondata })
        } catch (error) {
            console.log("Error fetching question data", error);
        }
    }

    // Post answer
    async postAnswer(req, res) {
        try {
            const { questionId, selectedOption, postedBy } = req.body;
            const question = await QuestionModel.findById(questionId);
            console.log("My question...", question)
            if (!question) {
                return res.status(404).json({ message: "Question not found" });
            }
            if (req.user.role !== "user") {
                return res.status(400).json({ message: "Only user can post answer" });
            }
            const isCorrect = question.correctanswer === selectedOption;
            const newAnswer = new AnswerModel({ selectedOption, questionId, postedBy, isCorrect });
            await newAnswer.save();
            const message = isCorrect ? "Your answer is correct!" : "This answer is not perfect, please try again.";
            res.status(201).json({ message, answer: newAnswer });
        } catch (error) {
            res.status(400).json({ message: "Error posting answer", error });
        }
    };

    // Search API for filtering question and answer
    async search(req, res) {
        const { questionText, name } = req.query;
        try {
            const answers = await AnswerModel.aggregate([
                {
                    $lookup: {
                        from: "questions",
                        localField: "questionId",
                        foreignField: "_id",
                        as: "questions",
                    }
                },
                { $unwind: "$questions" },
                {
                    $lookup: {
                        from: "users",
                        localField: "postedBy",
                        foreignField: "_id",
                        as: "answeredby",
                    }
                },
                { $unwind: "$answeredby" },
                {
                    $match: {
                        ...(questionText ? { "questions.questionText": { $regex: new RegExp(questionText, "i") } } : {}),
                        ...(name ? { "answeredby.name": { $regex: new RegExp(name, "i") } } : {})
                    }
                },
                {
                    $project: {
                        "selectedOption": 1,
                        "submittedAt": 1,
                        "questions.questionText": 1,
                        "answeredby.name": 1
                    }
                }
            ]);

            res.status(200).json({
                message: "Search answer retrieving successfully",
                total: answers.length,
                answers: answers
            });
        } catch (error) {
            console.error("Error retrieving search answers:", error);
            res.status(500).json({ message: "Error retrieving answers" });
        }
    }

    // Category wise question count 
    async CatCount(req, res) {
        try {
            const data = await QuestionModel.aggregate([
                {
                    $lookup: {
                        from: "categories",
                        localField: "categories",
                        foreignField: "_id",
                        as: "categoryDetails"
                    }
                },
                {
                    $unwind: "$categoryDetails"
                },
                {
                    $group: {
                        _id: "$categoryDetails.name",
                        totalQuestion: {
                            $sum: 1
                        }
                    }
                }

            ])
            res.status(200).json({ "message": "Categorywise data get", data })
        } catch (error) {
            console.log("Error fetching data...", error);

        }
    }


}
module.exports = new ApiController()


