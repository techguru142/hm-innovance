// const express = require('express');
// const path = require('path');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const {GridFsStorage} = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');
// const methodOverride = require('method-override');

// const app = express();  

// // Middleware
// app.use(express.json());
// app.use(methodOverride('_method'));
// app.set('view engine', 'ejs');
// mongoose.connect(
//     `mongodb+srv://guru:Guru7563@cluster0.xk6yjsm.mongodb.net/?retryWrites=true&w=majority`, 
//     {
//       useNewUrlParser: true,
//     }
//   );
//   let gfs;
//   const db = mongoose.connection;
// //creating bucket
// let bucket;
// db.on("connected", () => {
//   var client = mongoose.connections[0].client;
//   var db = mongoose.connections[0].db;
//   bucket = new mongoose.mongo.GridFSBucket(db, {
//     bucketName: "newBucket"
//   });
//  // console.log(bucket);
// });


// db.once("open", function () {
// //     gfs = Grid(db, mongoose.mongo);  
// //   gfs.collection('uploads');
//   console.log("Connected successfully");
// });

// // Create storage engine
// const storage = new GridFsStorage({
//     url:`mongodb+srv://guru:Guru7563@cluster0.xk6yjsm.mongodb.net/?retryWrites=true&w=majority`,
//     file: (req, file) => {
//       return new Promise((resolve, reject) => {
//           const filename = file.originalname;
//           const fileInfo = {
//             filename: filename,
//             bucketName: 'newBucket'
//           };
//           resolve(fileInfo);
//       });
//     }
//   });

//   const upload = multer({ storage})

//   app.post('/upload', upload.single('file'), (req, res) => {

//     res.status(200).send("File uploaded successfully");
//   });

//   app.get("/fileinfo/:filename",  (req, res) => {
//     const file =  bucket
//       .find({
//         "_id": req.params.filename
//       })
//       .toArray((err, files) => {
//         if (!files || files.length === 0) {
//           return res.status(404)
//             .json({
//               err: "no files exist"
//             });
//         }
//         console.log(files)
//         bucket.openDownloadStreamByName(req.params.filename)
//           .pipe(res);
//       });
//       res.send(file)
//   });
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, ()=>console.log('server is running on', PORT))

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const {
    GridFsStorage
} = require("multer-gridfs-storage");

// require("dotenv")
//   .config();

const mongouri = 'mongodb+srv://guru:Guru7563@cluster0.xk6yjsm.mongodb.net/?retryWrites=true&w=majority';
try {
    mongoose.connect(mongouri, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
} catch (error) {
    handleError(error);
}
process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message);
});

//creating bucket
let bucket;
mongoose.connection.on("connected", () => {
    var client = mongoose.connections[0].client;
    var db = mongoose.connections[0].db;
    bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "newBucket"
    });
    //console.log(bucket);
});

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

const storage = new GridFsStorage({
    url: mongouri,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = file.originalname;
            const fileInfo = {
                filename: filename,
                bucketName: "newBucket"
            };
            resolve(fileInfo);
        });
    }
});

const upload = multer({
    storage
});

app.get("/fileinfo/:filename", async (req, res) => {
    const file = await bucket
        .find({
            filename: req.params.filename
        })

    bucket.openDownloadStreamByName(req.params.filename)
        .pipe(res);
});


app.post("/upload", upload.single("file"), (req, res) => {
    res.status(200)
        .send("File uploaded successfully");
});

app.get("/getAllFiles", (req, res, next) => {
    let file = bucket.find().toArray((err, files) => {
        if (!files || files.length == 0) {
            return res.status(404).send({ status: false, message: "Files not found" })
        }
        files.map(file => {
            console.log(file)
            if (file.contentType == 'image/png' || file.contentType == 'video/mp4') {
                file.isImage = true
            } else {
                file.isImage = false
            }
        })
        res.status(200).send({ status: true, message: "file fetched", files })
    })
    console.log(file)

})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Application live on localhost:${PORT}`);
});