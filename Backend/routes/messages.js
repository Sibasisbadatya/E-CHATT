const { addMessage, getMessages } = require("../controllers/messageController");
const router = require("express").Router();
// const multer = require('multer');
let path = require('path');
// router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
const Messages = require("../models/messageModel");
const { v4: uuidv4 } = require('uuid');

require("dotenv").config()

const AWS = require('aws-sdk');
const multer = require('multer')
const multerS3 = require('multer-s3');
AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.ACCESS_SECRET,
    region: process.env.REGION,
});
const s3 = new AWS.S3();
const upload = multer();


// router.post('/addmsg', upload.single('photo'), async function (req, res, next) {
//     try {
//         console.log("file details", req.file.location);
// const { from, to, message } = req.body;
// console.log(req.file.filename);
// const from = req.body.from;
// const to = req.body.to;
// const message = req.body.message;
// let photo;
// // console.log(message);
// if (!message) {
//     photo = req.file.filename;
// }
// else
//     photo = "";
// const data = await Messages.create({
//     message: { text: message },
//     users: [from, to],
//     sender: from,
//     photo
// });
// const pic = await Messages.find({ sender: from });
// if (pic) {
//     // console.log(pic[pic.length - 1].photo);
//     return res.json({ pic: pic[pic.length - 1].photo })
// }
// if (data) return res.json({ msg: "Message added successfully." });
// else return res.json({ msg: "Failed to add message to the database" });
//     } catch (ex) {
//         console.log(ex);
//     }
// });


router.post('/addmsg', upload.single('photo'), async function (req, res, next) {
    try {
        // console.log(req);
        const from = req.body.from;
        const to = req.body.to;
        const message = req.body.message;
        let photo;
        let data;
        async function savingData() {
            const eventPromise = new Promise(async (resolve) => {
                setTimeout(async () => {
                    if (!message) {
                        const file = req.file;
                        let type = req.file.mimetype;
                        let Oname = req.file.originalname;
                        // console.log(file);
                        const params = {
                            Bucket: process.env.BUCKET,
                            Key: `${Date.now()}_${file.originalname}`,
                            Body: file.buffer,
                        };
                        let fileLoc;
                        s3.upload(params, async (err, data) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ error: 'Failed to upload file' });
                            }
                            data = await Messages.create({
                                message: { text: message },
                                users: [from, to],
                                sender: from,
                                photo: data.Location,
                                type,
                                Oname: params.Key
                            });
                            await data.save();
                            console.log("data", data);
                        });
                    }
                    else {
                        photo = "";
                        console.log("yes");
                        data = await Messages.create({
                            message: { text: message },
                            users: [from, to],
                            sender: from,
                            photo,
                            type: "text",
                            Oname: ""
                        });
                        await data.save();
                    }
                    resolve(); // Resolve the promise after the event occurs
                }, 4000); // Simulating a 2-second delay before the event occurs
            });
            await eventPromise;
        }
        async function findingData() {
            setTimeout(async () => {
                const pic = await Messages.find({ sender: from }).then((data) => {
                    console.log(data.length);
                    return res.json({ pic: data[data.length - 1].photo, type: data[data.length - 1].type, Oname: data[data.length - 1].Oname })
                })
            }, 2000)
        }

        async function runCode() {
            await savingData();
            return findingData();
        }
        runCode();

    } catch (e) {
        console.log(e);
    }
});

router.get("/download/:filename", async (req, res) => {
    const filename = req.params.filename;
    console.log(filename);
    let x = await s3.getObject({ Bucket: process.env.BUCKET, Key: filename }).promise();
    console.log(x);
    res.send(x.Body);
    // const params = {
    //     Bucket: process.env.BUCKET,
    //     Key: filename
    // };

    // s3.getObject(params, (error, data) => {
    //     if (error) {
    //         console.error('Error downloading file:', error);
    //         return;
    //     }
    //     console.log('File content:', data.Body.toString());
    // });

})


module.exports = router;
