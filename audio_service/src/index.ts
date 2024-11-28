import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// const apiKey = process.env.AUDIO_API_KEY;
const apiKey = "sk_daa1c1d244f44fbef9559b564bed9753f55bd50933386671";
const apiUrl = "https://api.elevenlabs.io/v1/text-to-speech";
const voiceId = "pqHfZKP75CvOlQylNhV4"; // Get this from ElevenLabs voice library

// Function to generate TTS
async function generateTTS(text: string, voiceId: string) {
  try {
    const response = await axios.post(
      `${apiUrl}/${voiceId}`,
      {
        text: text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        responseType: "arraybuffer", // To receive audio as binary data
      }
    );

    const audioData = response.data as ArrayBuffer;

    // Save the audio file to the local system
    // fs.writeFileSync('output.mp3', Buffer.from(audioData)); // No encoding necessary for binary data
    console.log("Audio file saved as output.mp3");
    return audioData;
  } catch (error) {
    console.error("Error generating TTS:", error);
  }
}

// Simple route
app.get("/", (req: Request, res: Response) => {
  res.send("AUDIO SERVICE IS NOT HERE! :)");
});

app.post("/send-data", async (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query) {
    res.status(400).json({ error: "Text is required" });
  }

  try {
    const audio = await generateTTS(query, voiceId);

    if (!audio) {
      res.status(500).json({ error: "Failed to generate audio" });
      return;
    }
    // Set appropriate headers for audio/mpeg and send the binary data

    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(audio)]));
    form.append("query", query);
    let newId = "";
    try {
      const { id } = (
        await axios.post(process.env.BACKEND_URL + "/audio-files", form)
      ).data as { success: boolean; id: string };
      newId = id;
    } catch (error) {
      newId = `temp_${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    }

    res.set({
      "Content-Type": "application/json",
      "Content-Length": audio.byteLength,
      "Access-Control-Expose-Headers": "X-File-ID",
      "X-File-ID": newId,
    });

    res.send(Buffer.from(audio)); // Send binary data
  } catch (error) {
    console.error("Error processing text:", error);
    res.status(500).json({ error: "Error processing text" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`AUDIO SERVICE Server is running on http://localhost:${PORT}`);
});
