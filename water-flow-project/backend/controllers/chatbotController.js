const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getModel({ model: "gemini-pro"});

exports.getChatbotResponse = async (req, res) => {
  try {
    const userMessage = req.body.message;

    const prompt = `You are a chatbot that provides water conservation tips. Answer the following question: ${userMessage}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ response: text });
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    res.status(500).json({ message: 'Error getting chatbot response' });
  }
};