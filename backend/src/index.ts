import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import multer from "multer";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

const storageFilePath = path.join(__dirname, "../audio-files");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storageFilePath);
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname); // Get original file extension
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`); // Custom filename
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log(file.mimetype);
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

    await prisma.audioEntry.create({
      data: {
        query: query,
        path: req.file.filename,
      },
    });
    res.send({ success: true, message: "File uploaded." });
  }
);

app.get("/audio-files/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send({ message: "No id provided." });
    return;
  }

  const entry = await prisma.audioEntry.findUnique({
    where: {
      id: id,
    },
  });

  if (!entry) {
    res.status(400).send({ message: "No file found with provided id." });
    return;
  }

  res.set("Content-Disposition", `attachment; filename="audiofile-${id}.mp3"`);
  res.sendFile(path.join(storageFilePath, entry.path), (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Error sending file.");
    }
  });
});

app.get("/metadata/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const metadata = [];
  if (!id) {
    metadata.push(
      ...(await prisma.audioEntry.findMany({
        select: {
          id: true,
          query: true,
          createdAt: true,
        },
      }))
    );
  } else {
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
    entry && metadata.push(entry);
  }
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
