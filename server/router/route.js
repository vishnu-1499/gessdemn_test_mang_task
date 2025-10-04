const express = require("express");
const controller = require("../controller/testController");
const { verifyToken } = require("../config/auth");
const { upload } = require("../config/multer");
const router = express.Router()

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/create-test", verifyToken, controller.createTest);
router.post("/add-questions/:id", verifyToken, controller.addQuestion);
router.post("/csv-file-upload", verifyToken, upload.single("file"), controller.uploadCSV);
router.get("/total-list", verifyToken, controller.listData);
router.post("/get-answerData/:id", verifyToken, controller.getAnswerData);
router.post("/delete-questionlist/:id", verifyToken, controller.deleteData);

module.exports = router;