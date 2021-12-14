require('dotenv').config()
const express = require('express')
const multer = require('multer')
const Paths = require('./models/paths')

const upload = multer({ dest: 'uploads/' })
const { uploadFile, getFileStream } = require('./S3bucket')
const app = express()

const mongoose = require('mongoose')
app.use(express.json())

mongoose.connect(process.env.DATABASE_URL), { useNewUrlParser: true }
const db = mongoose.connection
db.on('error', (error) => {
    console.error(error);
})
db.once('open', () => {
    console.log("Connected to database");
})

app.get("/getFilePath/:PathID", async(req, res) => {
    try {
        const pathID = req.params.PathID
        const result = await Paths.find({ ID: pathID })
        const { FilePath } = result[0]
        const readStream = getFileStream(FilePath)
        readStream.pipe(res)
    } catch (e) {
        console.log(e)
    }
})

app.post('/images', upload.single('image'), async(req, res) => {
    const file = req.file
    const description = req.body.description
    const result = await uploadFile(file)
    const path = new Paths({
        ID: req.body.id,
        FilePath: result.key
    })
    try {
        const newPath = await path.save()
        res.send({
            "Message": "Path Saved",
            "ID": req.body.id,
            "FilePath": result.key
        })
    } catch (e) {
        res.status(200).send({
            "Message": "error"
        })
    }
})

app.listen(3000, () => {
    console.log("Server started at port 3000");
})