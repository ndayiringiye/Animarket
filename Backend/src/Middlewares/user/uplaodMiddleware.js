import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "video/mp4",
    "video/mov",
    "video/avi"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

// ✅ CREATE INSTANCE
const upload = multer({ storage, fileFilter });

// ✅ EXPORT NAMED (fixes your issue 100%)
export default upload ;