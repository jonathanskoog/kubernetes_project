import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import multer from "multer";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

const storageFilePath = path.join("/app/audio-files");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storageFilePath);
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}.mp3`); // Custom filename
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    function fileIsNotCorrect() {
      const allowedExtenstions = [".mp3"];
      const allowedType = ["audio/mpeg", "application/octet-stream"];
      return !allowedType.includes(file.mimetype);
    }
    if (fileIsNotCorrect()) {
      cb(new Error("Incorrect file type, only MP3 files are allowed."));
      return;
    }
    cb(null, true);
  },
});

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Simple route
app.post(
  "/audio-files",
  upload.single("file"),
  async (req: Request, res: Response) => {
    const { query } = req.body;

    if (!req.file) {
      res.status(400).send({ success: false, message: "No file uploaded." });
      return;
    }

    const { id } = await prisma.audioEntry.create({
      data: {
        query: query,
        path: req.file.filename,
      },
      select: {
        id: true,
      },
    });
    res.send({ success: true, id });
  }
);

app.get("/audio-files/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const entry = await prisma.audioEntry.findUnique({
    where: {
      id: id,
    },
  });

  if (!entry) {
    res.status(400).send({ message: "No file found with provided id." });
    return;
  }

  res.set({
    "Content-Disposition": `attachment; filename="audiofile-${id}.mp3"`,
  });
  res.sendFile(path.join(storageFilePath, entry.path), (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Error sending file.");
    }
  });
});

app.get("/metadata", async (req: Request, res: Response) => {
  const metadata = await prisma.audioEntry.findMany({
    select: {
      id: true,
      query: true,
      createdAt: true,
    },
  });
  res.send({ files: metadata });
});

app.get("/metadata/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const entry = await prisma.audioEntry.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      query: true,
      createdAt: true,
    },
  });

  const metadata = entry ? [entry] : [];
  res.send({ files: metadata });
});

app.get("/", (req: Request, res: Response) => {
  res.send("BACKEND SERVICE IS HERE! :)");
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`BACKEND SERVICE Server is running on http://localhost:${PORT}`);
});

const shutdown = async (signal: string) => {
  await prisma.$disconnect();
  // Close the server
  server.close(() => {
    console.log("Closed all remaining connections");
    process.exit(0); // Exit the process with success
  });

  // If we don't gracefully close within a certain time, forcefully shut down
  setTimeout(() => {
    console.error("Forcing shutdown...");
    process.exit(1);
  }, 10000); // 10 seconds timeout
};

// Listen for specific termination signals
process.on("SIGINT", async () => await shutdown("SIGINT")); // Handle Ctrl+C (SIGINT)
process.on("SIGTERM", async () => await shutdown("SIGTERM")); // Handle kill signal (SIGTERM)
