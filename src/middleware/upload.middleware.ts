import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

const uploadPath = path.join(process.cwd(), "uploads/toilets");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const unique = crypto.randomBytes(32).toString("hex");
    cb(null, unique + path.extname(file.originalname));
  },
});

export const uploadToiletImages = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});