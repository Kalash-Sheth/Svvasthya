const multer = require('multer');
const path = require('path');
const fs = require("fs");

// Create uploads directory if it doesn't exist
const createUploadDirectories = () => {
  const directories = [
    "profilePhotos", 
    "documents", 
    "certificates",
    "bankingDocuments"
  ];
  directories.forEach((dir) => {
    const dirPath = `uploads/${dir}`;
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
};

createUploadDirectories();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Choose directory based on file type and purpose
    let uploadDir = "uploads/documents";
    if (file.fieldname === "profilePhoto") {
      uploadDir = "uploads/profilePhotos";
    } else if (file.fieldname.startsWith("certificate")) {
      uploadDir = "uploads/certificates";
    } else if (file.fieldname === "cancelledCheque") {
      uploadDir = "uploads/bankingDocuments";
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const fileExt =
      path.extname(file.originalname) ||
      (file.mimetype === "application/pdf" ? ".pdf" : ".jpg");
    const fileName = file.fieldname.replace(/Photo$/, "").replace(/\[\d+\]/, "");
    cb(null, `${fileName}-${uniqueSuffix}${fileExt}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images and PDFs
  const allowedFileTypes = {
    "image/jpeg": true,
    "image/png": true,
    "application/pdf": true,
    "image/jpg": true,
  };

  if (file.fieldname === "profilePhoto") {
    // Profile photos can only be images
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Profile photo must be an image file!"), false);
    }
  } else if (!allowedFileTypes[file.mimetype]) {
    return cb(new Error(`File type ${file.mimetype} is not allowed!`), false);
  }

  // Log accepted file for debugging
  console.log("Accepting file:", {
    fieldname: file.fieldname,
    mimetype: file.mimetype,
    originalname: file.originalname,
  });

  cb(null, true);
};

// Create a multer instance with the configuration
const multerInstance = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: fileFilter,
});

// Export methods we need
module.exports = {
  single: multerInstance.single.bind(multerInstance),
  fields: multerInstance.fields.bind(multerInstance),
  array: multerInstance.array.bind(multerInstance),
  cleanupFiles: (files) => {
    if (!files) return;
    const fileArray = Array.isArray(files) ? files : [files];
    fileArray.forEach((file) => {
      if (file.path) {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
    });
  },
};