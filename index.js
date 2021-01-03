const express = require('express')
const app = express()
const port = 3000
const multer = require('multer')
const fs = require('fs')
const util = require('util')
var serveIndex = require('serve-index')
var path = require('path')
var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
console.log('India time: '+ (new Date(indiaTime)).toISOString())
var uploadDir = "uploads";
app.use('/uploads', express.static(uploadDir), serveIndex(uploadDir, {'icons': true}))
var myStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
      cb(null, Date.now()+'-'+file.originalname);
  }
});

var upload = multer({storage: myStorage}).array('uploadFile',4);

app.get('/', (req, res) => {
  res.sendFile(__dirname+'/home.html');
});
app.get('/home', (req,res)=>{
  res.sendFile(__dirname+'/home.html')
});
app.get('/upload', (req,res)=>{
  res.sendFile(__dirname+'/upload.html')
});

app.post('/uploadFile', (req,res)=> {
  upload(req, res, (err) => {
    if(err) return res.end("Error Uploading file. "+err)
    console.log(req.files.length)
    res.end(req.files.length+" Files Uploaded")
  })
})

app.get('/download', (req,res)=>{  
  res.sendFile(__dirname+'/download.html');
})

app.get('/getDownloadFilesList', (req, res)=>{
  var allFilesInfo = [];
  var files = fs.readdirSync(uploadDir);
  files.forEach((file,index) => {
    let fileStat = fs.statSync(uploadDir+"/"+file);
    allFilesInfo.push({"Count":index, "fileName":"<a href=\'uploads/"+file+"\'>"+file+"</a>","fileSize":fileStat.size});
  })
  console.log(allFilesInfo);
  res.send(allFilesInfo);
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
