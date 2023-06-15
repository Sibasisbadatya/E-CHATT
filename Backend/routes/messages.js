const { addMessage, getMessages } = require("../controllers/messageController");
const router = require("express").Router();
const multer = require('multer');
let path = require('path');
// router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
const Messages = require("../models/messageModel");
const { v4: uuidv4 } = require('uuid');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter });

router.route('/addmsg').post(upload.single('photo'), async (req, res) => {
    try {
        // const { from, to, message } = req.body;
        // console.log(req.file.filename);
        const from = req.body.from;
        const to = req.body.to;
        const message = req.body.message;
        let photo;
        // console.log(message);
        if (!message) {
            photo = req.file.filename;
        }
        else
            photo = "";
        const data = await Messages.create({
            message: { text: message },
            users: [from, to],
            sender: from,
            photo
        });
        const pic = await Messages.find({ sender: from });
        if (pic) {
            // console.log(pic[pic.length - 1].photo);
            return res.json({ pic: pic[pic.length - 1].photo })
        }
        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });
    } catch (ex) {
        console.log(ex);
    }
});
module.exports = router;
