const bcrypt = require("bcrypt");
const adminData = require("../model/admin");
const testData = require("../model/testMng");
const quesData = require("../model/question");
const { signedToken } = require("../config/auth");
const { parseCSV } = require("../config/multer");
const mongoose = require("mongoose");

class controller {
  register = async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = await adminData.findOne({ email: email });
      if (admin)
        return res.send({ status: false, message: "Email Aldready Exists.." });

      const encPass = await bcrypt.hash(password, 10);
      await adminData
        .create({ email, password: encPass })
        .then((resp) =>
          res.send({ status: true, message: "Registration Successfull", resp })
        )
        .catch((error) =>
          res.send({ status: false, message: "Registration Failed", error })
        );
    } catch (error) {
      console.log("error---", error);
      res.send({ status: false, message: "Internal Error.." });
    }
  };

  login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = await adminData.findOne({ email: email });
      const decPass = await bcrypt.compare(password, admin.password);

      if (!decPass)
        return res.send({ status: false, message: "Invalid Password..." });

      await signedToken({ id: admin._id })
        .then((resp) =>
          res.send({
            status: true,
            message: "Login Successfull",
            token: resp,
          })
        )
        .catch((error) => {
          console.log("error--", error);
          res.send({ status: false, message: "Login Failed", error });
        });
    } catch (error) {
      console.log("error---", error);
      res.send({ status: false, message: "Internal Error.." });
    }
  };

  createTest = async (req, res) => {
    const data = req.body;
    try {
      const addTest = new testData({ ...data });
      await addTest
        .save()
        .then((resp) =>
          res.send({ status: true, message: "New Test Created", data: resp })
        )
        .catch((error) =>
          res.send({ status: false, message: "Failed to Create Test", error })
        );
    } catch (error) {
      console.log("error---", error);
      res.send({ status: false, message: "Internal Error.." });
    }
  };

  addQuestion = async (req, res) => {
    const id = req.params.id;
    const { question, option1, option2, option3, option4, answer } = req.body;
    let results;
    try {
      const test = await testData.findById({ _id: id });
      if (!test) return res.send({ status: false, message: "Test not Found" });

      let value = await quesData.findOne({ testID: id });

      const data = {
        question,
        options: [option1, option2, option3, option4],
        answer,
      };

      if (!value) {
        const newData = new quesData({
          testID: id,
          quesAns: [data],
        });
        results = await newData.save();
      } else {
        results = await quesData.findOneAndUpdate(
          { testID: id },
          { $push: { quesAns: [data] } },
          { new: true }
        );
      }

      res.send({ status: true, message: "Question Added", data: results });
    } catch (error) {
      console.log("error---", error);
      res.send({ status: false, message: "Internal Error.." });
    }
  };

  listData = async (req, res) => {
    try {
      await testData
        .aggregate([
          {
            $lookup: {
              from: "q&as",
              localField: "_id",
              foreignField: "testID",
              as: "questions",
            },
          },
        ])
        .then((resp) =>
          res.send({ status: true, message: "List of Data", data: resp })
        )
        .catch((error) =>
          res.send({
            status: false,
            message: "Cannot Get the Data",
            error,
          })
        );
    } catch (error) {
      console.log("error---", error);
      res.send({ status: false, message: "Internal Error.." });
    }
  };

  getAnswerData = async (req, res) => {
    const id = req.params.id;
    try {
      const objectId = new mongoose.Types.ObjectId(id);

      const result = await testData.aggregate([
        { $match: { _id: objectId } },
        {
          $lookup: {
            from: "q&as",
            localField: "_id",
            foreignField: "testID",
            as: "questions",
          },
        },
      ]);

      if (!result || result.length === 0) {
        return res.send({ status: false, message: "No data found" });
      }

      res.send({ status: true, message: "List of Data", data: result });
    } catch (error) {
      console.log("error---", error);
      res.send({ status: false, message: "Internal Error.." });
    }
  };

  deleteData = async (req, res) => {
    const id = req.params.id;
    try {
      await testData.findByIdAndDelete({ _id: id });
      await quesData.findOneAndDelete({ testID: id });
      res.send({ status: true, message: "Data Deleted" });
    } catch (error) {
      console.log("error---", error);
      res.send({ status: false, message: "Internal Error.." });
    }
  };

  uploadCSV = async (req, res) => {
    const file = req.file.path;
    try {
      if (!file) {
        return res.send({ status: false, message: "No file uploaded" });
      }

      const data = await parseCSV(file);

      for (let row of data) {
        let test = await testData.findOne({
          title: row.title,
          description: row.description,
        });

        if (!test) {
          test = new testData({
            title: row.title,
            description: row.description,
          });
          await test.save();
        }

        let quesDoc = await quesData.findOne({ testID: test._id });

        const newQuestion = {
          question: row.question,
          options: [row.option1, row.option2, row.option3, row.option4],
          answer: row.answer,
        };

        if (!quesDoc) {
          quesDoc = new quesData({
            testID: test._id,
            quesAns: [newQuestion],
          });
        } else {
          quesDoc.quesAns.push(newQuestion);
        }

        await quesDoc.save();
      }

      res.send({
        status: true,
        message: "CSV File uploaded & saved successfully",
      });
    } catch (error) {
      console.log("error---", error);
      res.send({ status: false, message: "Internal Error.." });
    }
  };
}

module.exports = new controller();
