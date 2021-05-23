import express from "express";
import path from "path";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
	destination(_, __, cb) {
		cb(null, "uploads/");
	},
	filename(_, file, cb) {
		cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
	},
});

function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
	const filetypes = /jpg|jpeg|png/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = filetypes.test(file.mimetype);

	if (extname && mimetype) {
		return cb(null, true);
	} else {
		cb(new Error("Images only!"));
	}
}

const upload = multer({
	storage,
	fileFilter: function (_, file, cb) {
		checkFileType(file, cb);
	},
});

router.post("/", upload.single("image"), (req, res) => {
	res.send(`/${req.file.path}`);
});

export default router;
