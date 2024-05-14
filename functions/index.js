const {onRequest} = require("firebase-functions/v2/https");
const {generateQuestion, evaluateAnswer} = require("./your-server-file-name");

exports.generateQuestionFunction = onRequest(async (req, res) => {
  const {topic} = req.body;

  try {
    const generatedQuestion = await generateQuestion(topic);
    res.send({question: generatedQuestion});
  } catch (error) {
    console.error("An error occurred while generating the question:", error);
    res.status(500).send("Internal Server Error");
  }
});

exports.evaluateAnswerFunction = onRequest(async (req, res) => {
  const {question, answer} = req.body;

  try {
    const isCorrect = await evaluateAnswer(question, answer);
    res.send({isCorrect});
  } catch (error) {
    console.error("An error occurred while evaluating the answer:", error);
    res.status(500).send("Internal Server Error");
  }
});
