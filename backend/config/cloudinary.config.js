import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import path from "path"
import fs from "fs"
import dotenv from "dotenv";


dotenv.config()
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadPath = path.join(process.cwd(), "upload");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

export const multerMiddleWare = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
}).single("media");


export const uploadFileToCloudinary = async (file) => {
  if (!file) throw new Error("No file provided");

  try {


    // Upload from disk
    const result = await cloudinary.uploader.upload(file.path);

    // Delete local file after successful upload
    fs.unlinkSync(file.path);

    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Delete temp file if exists
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return null;
  }
};

export { cloudinary };

