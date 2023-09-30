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
  // else console.log(res)

  const idea = req.body.idea || '';
  if (idea.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid date idea",
      }
    });
    // return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(idea),
      temperature: 0.6,
      max_tokens: 500,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
    console.log("The submitted idea is: " + idea)
    console.log("The returned text is: " + completion.data.choices[0].text)

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
      // console.log(data)
      // return result;
    }
  }
}

function generatePrompt(idea) {
  const capitalizedDateIdea =
    // idea[0].toUpperCase() + idea.slice(1).toLowerCase();
  idea[0].toUpperCase();
  return `I want you to act as a date idea generator API for acticities in Syracuse, NY.  I will pass in three parameters:  energyLevel, distanceToTravel, and moneyCost.  

energyLevel refers to the amount of energy the activities chosen for the date will take.  Listening to a orchestra would be a low level activity, rock climbing at a gym would be a high level activity.  

distanceToTravel is the maximum length of distance (in miles) that the participant wishes to travel for the activities.

moneyCost is whether this will be a low cost activity (such as coffee and a walk at a park) or a higher cost (such as going to a Syracuse University basketball game and then going out to a nice dinner).

firstLat is the latitude for the address for the firstAddress.
firstLong is the longitude for the firstAddress.

secondLat and secondLong are also both latitude and longitude for the secondAddress.  thirdLat and thirdLong are also latitude and longitude for the second address.  Use the Google Geocode address API to get the latitude and longitude for the addresses.  I would also like the resulting ideas returned in JSON format.

Here is a sample:

user: {energyLevel = "high", distanceToTravel = 5, moneyCost="medium"}
ideas: {"firstStop" = "CentralRock indoor climbing", "firstAddress"="600 N Franklin St, Syracuse, NY 13204", "firstLong"=-76.1586422026446, "firstLat"=43.05757533079649, "secondStop"="Freedom of Espresso Coffee", "secondAddress"= "115 Solar St Suite 101, Syracuse, NY 13204", "secondLong"=-76.15847630343886, "secondLat"=43.05666567606996, "thirdStop"="Franklin Square Park", "thirdAddress"="Solar & Plum Streets, Syracuse, NY", "thirdLong"=-76.15753200343886, "thirdLat"=43.05676327578289}

user {energyLevel = "medium", distanceToTravel = 3, moneyCost="high"}
ideas: {"firstStop" = "Biking at Onondaga Lake Park", "firstAddress"="106 Lake Dr, Liverpool, NY 13088", "firstLong"=-76.20498735396188, "firstLat"=43.09938333961237, "secondStop"="Ice Cream at Heid's", "secondAddress"= "305 Oswego St, Liverpool, NY 13088", "secondLong"=-76.20188567471097, "secondLat"=43.10124934885059, "thirdStop"="Stop at Tantrum City Rage Room", "thirdAddress"="109 E Taft Rd, North Syracuse, NY 13212", "thirdLong"=-76.14054918465398, "thirdLat"=43.12387021698499}

  idea: ${capitalizedDateIdea}
  Response:`;
}
