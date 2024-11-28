import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import * as dotenv from 'dotenv'; // Import dotenv to load .env variables

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());



// const apiKey = process.env.AUDIO_API_KEY;
const apiKey = "sk_daa1c1d244f44fbef9559b564bed9753f55bd50933386671"
console.log("api \n\n\n", apiKey);
const apiUrl = 'https://api.elevenlabs.io/v1/text-to-speech';
const voiceId = 'pqHfZKP75CvOlQylNhV4'; // Get this from ElevenLabs voice library


// Function to generate TTS
async function generateTTS(text: string, voiceId: string) {
  try {
      const response = await axios.post(
          `${apiUrl}/${voiceId}`,
          {
              text: text,
              voice_settings: {
                  stability: 0.5,
                  similarity_boost: 0.75
              }
          },
          {
              headers: {
                  'Content-Type': 'application/json',
                  'xi-api-key': apiKey
              },
              responseType: 'arraybuffer' // To receive audio as binary data
          }
      );

      const audioData = response.data as ArrayBuffer;

      // Save the audio file to the local system
      // fs.writeFileSync('output.mp3', Buffer.from(audioData)); // No encoding necessary for binary data
      console.log('Audio file saved as output.mp3');
      return audioData;
  } catch (error) {
      console.error('Error generating TTS:', error);
  }
}



// Simple route
app.get('/', (req: Request, res: Response) => {
  res.send('AUDIO SERVICE IS NOT HERE! :)');
});

app.get('/backend', async (req: Request, res: Response) => {
  console.log(process.env.BACKEND_URL);
  res.send({data: (await axios.get(process.env.BACKEND_URL + '/data')).data})
});






app.post('/send_data', async (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query) {
    res.status(400).json({ error: 'Text is required' });
  }

  try {
    // Process the text data as needed
    //console.log('Received text:', query);

    // Optionally, send the text to the backend service
    //const response = await axios.post(`${process.env.BACKEND_URL}/process-text`, { text });
    const audio = await generateTTS(query, voiceId);

    if (audio) {
      // Set appropriate headers for audio/mpeg and send the binary data
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audio.byteLength,
      });


    res.send(Buffer.from(audio)); // Send binary data
    
    } else {
      res.status(500).json({ error: 'Failed to generate audio' });
    }
  } catch (error) {
    console.error('Error processing text:', error);
    res.status(500).json({ error: 'Error processing text' });
  }
  

  //   return res.json({ data: query.toUpperCase(), audiofile: audio });
  // } 
  // catch (error) {
  //   console.error('Error processing text:', error);
  //   res.status(500).json({ error: 'Error processing text' });
  // }
});

// Start the server
app.listen(PORT, () => {
  console.log(`AUDIO SERVICE Server is running on http://localhost:${PORT}`);
});