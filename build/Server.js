
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();



const genAI = new GoogleGenerativeAI(process.env.API_KEY);


async function generateQuestion(topic) {
  const prompt = `Write a question related to the topic: ${topic}.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    console.log(text);
    return text;
  } catch (error) {
    console.error("An error occurred while generating the question:", error);
    return null; 
  }
}


async function evaluateAnswer(question, answer) {
    const prompt = `Please evaluate the provided answer: "${answer}", in response to the question: "${question}". Provide a response indicating only the accuracy of the answer as a percentage.`;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
      const result = await model.generateContent(prompt);
      const response =  result.response;
      const text = response.text();
  
      console.log(text);
      return text;
    } catch (error) {
      console.error("An error occurred while generating the question:", error);
      return null;
    }
  
}


const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const path = require('path');
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));
 
app.use(cors({
  origin: '*'
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'user_interface.html'));
});

app.post("/generate-question", async(req, res) => {
  const { topic } = req.body;

  const generatedQuestion = await generateQuestion(topic);

  res.send({ question: generatedQuestion });
});

app.post("/evaluate-answer", async(req, res) => {
  const { question, answer } = req.body;

  const isCorrect = await evaluateAnswer(question, answer);

  res.send({ isCorrect });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
