import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const idea = req.body.idea || '';
  if (idea.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid story idea",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(idea),
      temperature: 0.6,
      max_tokens: 500,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(idea) {
  const capitalizedStoryIdea =
    // idea[0].toUpperCase() + idea.slice(1).toLowerCase();
  idea[0].toUpperCase();
  return `Return three story ideas, to go along with their writing prompt.  Then read https://www.linkedin.com/in/laurajeanthorne/ and tie in how Laura's unique experience can help them with this project.  Also give them a unique call to action.

  idea: Book about Sailing
  Response: - Salty Seas, - The Fantastic Voyage, - The Dangerous Journey.  As an intrepid trevelor, Laura can bring your fantastic dreams to life!  Send her a carrier pigeon now!

  idea: A book about children and adventure
  Response: - The Wonder of the Now, - When we Were Young, - There and back.  As a creator at heart, Laura can see your story with fresh eyes of wonder!  Reach her over morse code now!

  idea: ${capitalizedStoryIdea}
  Response:`;
}
