import express from "express";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

const VIDEOS_DIR = path.join(__dirname, "videos");
const FRAMES_DIR = path.join(__dirname, "frames");

// Ensure required folders exist
if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR);
}

if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR);
}

app.get("/", (req, res) => {
  res.send("AI Video Generator Backend Running");
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt required" });
    }

    const videoId = Date.now();
    const frameFolder = path.join(FRAMES_DIR, String(videoId));

    fs.mkdirSync(frameFolder);

    console.log("Generating video...");

    // Generate 5 cinematic frames
    for (let i = 0; i < 5; i++) {
      const image = await openai.images.generate({
        model: "gpt-image-1",
        prompt: `${prompt}, cinematic wide shot, ultra detailed, dramatic lighting, frame ${i}`,
        size: "1024x1024",
      });

      const image_base64 = image.data[0].b64_json;
      const imageBuffer = Buffer.from(image_base64, "base64");

      fs.writeFileSync(
        path.join(frameFolder, `frame_${i}.png`),
        imageBuffer
      );
    }

    console.log("Processing video...");

    const outputPath = path.join(VIDEOS_DIR, `${videoId}.mp4`);

    const ffmpegCommand = `ffmpeg -y -framerate 1 -i ${frameFolder}/frame_%d.png -vf "zoompan=z='min(zoom+0.0015,1.2)':d=125,scale=1280:720,format=yuv420p" -r 24 -c:v libx264 -pix_fmt yuv420p "${outputPath}"`;

    exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
        console.error("FFmpeg error:", error.message);
        return res.status(500).json({ error: "Video generation failed" });
      }

      console.log("Video created successfully");

      // Dynamic base URL (works locally + deployed)
      const baseUrl = `${req.protocol}://${req.get("host")}`;

      res.json({
        id: videoId,
        status: "completed",
        videoUrl: `${baseUrl}/videos/${videoId}.mp4`,
      });
    });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Generation failed" });
  }
});

app.use("/videos", express.static(VIDEOS_DIR));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});