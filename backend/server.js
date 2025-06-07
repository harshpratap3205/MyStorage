// import express from 'express'
// import path  from 'path'
// const app=express()
// app.use((req,res,next)=>{
//     res.set("Access-Control-Allow-Origin","*")
//     console.log("this is midle")
//     next()
// })
// // app.use(express.static('storage', {
// //   setHeaders: (res, filePath) => {

// //       res.set({
// //         'Content-Type': 'video/mp4',
// //         'Accept-Ranges': 'bytes',
// //           'Content-Disposition': 'inline',
// //   });

// //   }
// // }))
//     // res.set({
//     //     'Content-Type': 'video/mp4',
//     //     'Accept-Ranges': 'bytes',  // Required for streaming/seeking
//     //     'Content-Disposition': 'inline', // Try to display in browser
//     //   });
// app.use('', express.static('storage', {
//   setHeaders: (res, filePath) => {
//     if (path.extname(filePath) === '.mp4') {
//       res.set({
//         'Content-Type': 'video/mp4',
//         'Accept-Ranges': 'bytes'
//       });
//     }
//   }
// }));
// // console.log("his")

// app.get('/',(req,res)=>{
//     console.log("get on / ")
//     res.json({"age":"31"})
//     // res.end("hiii")
// })
// app.listen(4001,()=>{
//     console.log("server started...")
// })
// import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// CORS middleware
// app.use((req, res, next) => {
//     res.set("Access-Control-Allow-Origin", "*");
//     console.log("Middleware executed");
//     next();
// });

// // File type configuration
// const fileTypeConfig = {
//     '.mp4': {
//         contentType: 'video/mp4',
//         disposition: 'inline',
//         extraHeaders: {
//             'Accept-Ranges': 'bytes'
//         }
//     },
//     '.docx': {
//         contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//         disposition: 'attachment' // 'inline' if using Office Online Viewer
//     },
//     '.pdf': {
//         contentType: 'application/pdf',
//         disposition: 'inline'
//     },
//     '.jpg': {
//         contentType: 'image/jpeg',
//         disposition: 'inline'
//     },
//     '.jpeg': {
//         contentType: 'image/jpeg',
//         disposition: 'inline'
//     },
//     '.png': {
//         contentType: 'image/png',
//         disposition: 'inline'
//     },
//     '.txt': {
//         contentType: 'text/plain',
//         disposition: 'inline'
//     }
// };

// // Static files with custom headers
// app.use('/storage', express.static(path.join(__dirname, 'storage'), {
//     setHeaders: (res, filePath) => {
//         const ext = path.extname(filePath).toLowerCase();
//         const config = fileTypeConfig[ext];

//         if (config) {
//             res.set({
//                 'Content-Type': config.contentType,
//                 'Content-Disposition': `${config.disposition}; filename="${path.basename(filePath)}"`,
//                 ...config.extraHeaders
//             });

//         }
//     }
// }));

// // Basic route
// app.get('/', (req, res) => {
//     console.log("GET request on /");
//     res.json({"message": "Server is running"});
// });

// // Start server
// app.listen(4001, () => {
   //     console.log("Server started on http://localhost:4001");
   //     console.log("Access files at http://localhost:4001/storage/[filename]");
   // });
   
   // CORS middleware
   // app.use((req, res, next) => {
   //    res.set("Access-Control-Allow-Origin", "*");
   //    res.set("Access-Control-Allow-Methods", "*");
   //    res.set("Access-Control-Allow-Headers", "*");
   //    next();
   // });

import express from 'express';
import { createWriteStream } from 'fs';
import { rename, stat } from 'fs/promises';
import { rm } from 'fs/promises';
import { readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json())
app.use(cors())

app.get('/file/:fileName', (req, res, next) => {
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);

   const { fileName } = req.params
   console.log(fileName)
   if (req.query.action === 'download') { res.set("Content-Disposition", "attachment") }
   if (fileName.endsWith('.mp4') && req.query.action === 'open') {
      res.set({
         'Content-Type': 'video/mp4',
         'Accept-Ranges': 'bytes',
         'Content-Disposition': 'inline'
      });
   }
   res.sendFile(`${import.meta.dirname}/storage/${fileName}`, (err) => {
      if (err) {
         console.error("Error sending file:", err);
         res.status(404);
      }
   });


})
app.get("/directory{/:dirname}", async (req, res, next) => {
   const {0:path}=req.params
   const fullPath=`./storage/${path?path:""}`
   const fileList = await readdir(fullPath)
   const resData=[]
for(const item of fileList)
{const status= await stat(`${fullPath}/${item}`)
   resData.push({name:item,isDirectory: status.isDirectory()})
}
   res.json(resData);
   next()
});
app.delete("/file/:fileName", async (req, res) => {
   const { fileName } = req.params
   const filePath = `./storage/${fileName}`
   try {
      await rm(filePath)
      res.json({ message: "file delete succesfully" })
   }
   catch (err) {
      res.status(404).json({ message: "file not found" })
   }

})

app.post("/file/:fileName", (req, res) => {
   const fileName = req.params.fileName
   const writeStream = createWriteStream(`./storage/${fileName}`)


   req.pipe(writeStream)


   res.json({ message: "uploaded" })

})
app.patch("/file/:fileName", async (req, res) => {
   const { fileName } = req.params
   const { newName } = req.body
   try {
      await rename(`./storage/${fileName}`, `./storage/${newName}`)
      res.json({ message: "file Renamed succesfully" })
   }
   catch (err) {
      res.status(404).json({ message: "file not found" })
   }

})

// Start server
app.listen(4001, () => {
   console.log("Server started on http://localhost:4001");
   console.log("Access files directly at http://localhost:4001/filename");
});