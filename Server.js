
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();


// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Placeholder function to simulate interaction with the Generative AI model
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
    return null; // Return null if an error occurs
  }
}

// Placeholder function to simulate interaction with the Generative AI model for answer evaluation
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
      return null; // Return null if an error occurs
    }
  
}

module.exports = {
  generateQuestion,
  evaluateAnswer
};

// Express.js setup 

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

// Endpoint to handle request for generating a question
app.post("/generate-question", async(req, res) => {
  const { topic } = req.body;

  // Generate question based on the selected topic
  const generatedQuestion = await generateQuestion(topic);
  // console.log(generateQuestion)

  // Send the generated question back to the frontend
  res.send({ question: generatedQuestion });
});

// Endpoint to handle request for evaluating an answer
app.post("/evaluate-answer", async(req, res) => {
  const { question, answer } = req.body;

  // Evaluate the provided answer
  const isCorrect = await evaluateAnswer(question, answer);

  // Send the evaluation result back to the frontend
  res.send({ isCorrect });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
