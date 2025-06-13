

//    import multer from 'multer'; 
// import { createWriteStream } from 'fs';
// import { mkdir, rename, stat } from 'fs/promises';
// import { rm } from 'fs/promises';
// import { readdir } from 'fs/promises';
// import path, { dirname } from 'path';
// import { fileURLToPath } from 'url';
// import cors from "cors";
// import fs from 'fs'
// import dotenv from "dotenv";
// import express from 'express';
// import { createRequire } from 'module';
// import https from 'https'
// const require = createRequire(import.meta.url);
// const expressVersion = require('express/package.json').version;

// console.log('✅ Express version:', expressVersion);

// dotenv.config();

// const PORT = process.env.PORT || 4001;
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// app.use(express.json())
// app.use(cors())

// app.get('/file/*', (req, res, next) => {
   
//    const __filename = fileURLToPath(import.meta.url);
//    const __dirname = path.dirname(__filename);
// console.log(req.params)   
//    const {0:array } = req.params
  
//    const fileName=array

//    if (req.query.action === 'download') { res.set("Content-Disposition", "attachment") }
//    if (fileName.endsWith('.mp4\\') && req.query.action === 'open') {
//       res.set({
//          'Content-Type': 'video/mp4',
//          'Accept-Ranges': 'bytes',
//          'Content-Disposition': 'inline'
//       });   
//    }   
//    console.log(`${import.meta.dirname}/storage/${fileName}`)
//    res.sendFile(`${import.meta.dirname}/storage/${fileName}`, (err) => {
//       if (err) {
//          console.error("Error sending file:", err);
//          res.status(404);
//       }   
//    });   


// })   
// app.get("/directory/?*", async (req, res, next) => {
//    const {0:directoryArr}=req.params 
//    // const fullpath=directoryArr;  

//    // console.log(fullpath)
//   const fullpath=directoryArr 
  
//    const fullPath=`./storage/${fullpath}`
   
//    const fileList = await readdir(fullPath)
//    const resData=[]
// for(const item of fileList)
// {const status= await stat(`${fullPath}/${item}`)   
//    resData.push({name:item,isDirectory: status.isDirectory()})
// }   
// console.log(resData)
//    res.json(resData);
   

// });   

// app.post('/directory/?*',async (req,res,next)=>{
   
// const {0:dirname}=req.params
//  await mkdir(`./storage/${dirname}`)
//  res.json({message:"directory created"})
// })
// app.delete("/file/*", async (req, res) => {
// console.log(req.params)   
//    const { 0:fileName } = req.params
// console.log(fileName)
   
//    const filePath = `./storage/${fileName}`
//    try {
//       await rm(filePath,{ recursive: true, force: true })
//       res.json({ message: "file delete succesfully" })
//    }   
//    catch (err) {
//       res.status(404).json({ message: "file not found" })
//    }   

// })   



// const storage = multer.memoryStorage(); // store in memory first
// const upload = multer({ storage });

// app.post("/file/:fileName", upload.single('file'), (req, res) => {
//   const fileName = req.params.fileName;
//   const uploadPath = req.body.path || ''; // 👈 from formData


//   const fullDir = path.join('./storage', uploadPath);
//   const fullPath = path.join(fullDir, fileName);

//   // Make sure the folder exists
//   fs.mkdirSync(fullDir, { recursive: true });

//   // Save file to disk
//   fs.writeFileSync(fullPath, req.file.buffer);

//   res.json({ message: "uploaded" });
// });

// app.patch("/file/*", async (req, res) => {
//    const {0: filePath } = req.params
  
//    const { newName, } = req.body
//    try {
//       await rename(`./storage/${filePath}`, `./storage/${newName}`)
//       res.json({ message: "file Renamed succesfully" })
//    }
//    catch (err) {
//       res.status(404).json({ message: "file not found" })
//    }

// })

// // Start server
// app.listen(PORT||4001, () => console.log(`Server running on port ${PORT||4001}`));

// ✅ Cleaned backend.js with same routes, logic, and added try/catch wrappers

import multer from 'multer';
import { createWriteStream } from 'fs';
import { mkdir, rename, stat, rm, readdir } from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';
import { createRequire } from 'module';
import https from 'https';

const require = createRequire(import.meta.url);
const expressVersion = require('express/package.json').version;
console.log('✅ Express version:', expressVersion);

dotenv.config();

const PORT = process.env.PORT || 4001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// 🟩 Serve files with support for download or inline open
app.get('/file/*', (req, res) => {
  try {
    const { 0: fileName } = req.params;
    const fullPath = path.join(__dirname, 'storage', fileName);

    if (req.query.action === 'download') {
      res.set('Content-Disposition', 'attachment');
    } else if (fileName.endsWith('.mp4') && req.query.action === 'open') {
      res.set({
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
        'Content-Disposition': 'inline'
      });
    }

    res.sendFile(fullPath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(404).end();
      }
    });
  } catch (err) {
    console.error('GET /file/* failed:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 🟩 Get directory contents
app.get('/directory/*', async (req, res) => {
  try {
    const { 0: directoryArr } = req.params;
    const fullPath = path.join('./storage', directoryArr);
    const fileList = await readdir(fullPath);
    const resData = [];

    for (const item of fileList) {
      const status = await stat(path.join(fullPath, item));
      resData.push({ name: item, isDirectory: status.isDirectory() });
    }

    res.json(resData);
  } catch (err) {
    console.error('GET /directory/* failed:', err);
    res.status(500).json({ message: 'Could not read directory' });
  }
});

// 🟩 Create directory
app.post('/directory/*', async (req, res) => {
  try {
    const { 0: dirname } = req.params;
    await mkdir(`./storage/${dirname}`, { recursive: true });
    res.json({ message: 'Directory created' });
  } catch (err) {
    console.error('POST /directory/* failed:', err);
    res.status(500).json({ message: 'Could not create directory' });
  }
});

// 🟩 Delete file or folder
app.delete('/file/*', async (req, res) => {
  try {
    const { 0: fileName } = req.params;
    const filePath = `./storage/${fileName}`;
    await rm(filePath, { recursive: true, force: true });
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('DELETE /file/* failed:', err);
    res.status(404).json({ message: 'File not found' });
  }
});

// 🟩 Upload file with multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/file/:fileName', upload.single('file'), (req, res) => {
  try {
    const fileName = req.params.fileName;
    const uploadPath = req.body.path || '';
    const fullDir = path.join('./storage', uploadPath);
    const fullPath = path.join(fullDir, fileName);

    fs.mkdirSync(fullDir, { recursive: true });
    fs.writeFileSync(fullPath, req.file.buffer);

    res.json({ message: 'uploaded' });
  } catch (err) {
    console.error('POST /file/:fileName failed:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// 🟩 Rename file/folder
app.patch('/file/*', async (req, res) => {
  try {
    const { 0: filePath } = req.params;
    const { newName } = req.body;
    await rename(`./storage/${filePath}`, `./storage/${newName}`);
    res.json({ message: 'File renamed successfully' });
  } catch (err) {
    console.error('PATCH /file/* failed:', err);
    res.status(404).json({ message: 'File not found' });
  }
});

// 🟩 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
