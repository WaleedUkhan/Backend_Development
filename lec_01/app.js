const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const engine = require('ejs-mate');

const app = express();
const port = 3000;

app.use(session({
  secret: "MySession", 
  resave: false, 
  saveUninitialized: true, 
  cookie: {
    secure: false
  }
}))


app.get('/login', (req, res)=>{
  req.session.userId= '123', 
  req.session.userName= 'Waleed Khan', 
  res.send("user Logged In Correctly")

}); 

app.get('/profile', (req, res)=>{
  if(req.session.userId){
     res.send(`Welcome back, ${req.session.userName}!`);
  }
  else{
    res.send('Please log in');
  }
})


app.get('/logout', (req, res)=>{
  req.session.destroy(); 
  res.send("Logged Out completly");
})




// Import controllers
const homeController = require('./controllers/homeController');
const uploadController = require('./controllers/uploadController');

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|mp4|mp3|zip|rar/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('File type not allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});

// Set view engine and views directory
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// Make upload middleware available to controllers
app.locals.upload = upload;

// Routes
app.get('/', homeController.index);
app.get('/upload', uploadController.showUploadForm);
app.post('/upload', upload.fields([
  { name: 'singleFile', maxCount: 1 },
  { name: 'multipleFiles', maxCount: 10 }
]), uploadController.handleUpload);
app.get('/files', uploadController.listFiles);
app.delete('/files/:filename', uploadController.deleteFile);

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).render('pages/error', {
        title: 'Upload Error',
        message: 'File too large! Maximum size is 10MB.',
        error: error,
        currentYear: new Date().getFullYear()
      });
    }
  }
  res.status(500).render('pages/error', {
    title: 'Server Error',
    message: error.message,
    error: error,
    currentYear: new Date().getFullYear()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('pages/error', {
    title: '404 - Page Not Found',
    message: 'The page you are looking for does not exist.',
    error: { status: 404 },
    currentYear: new Date().getFullYear()
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📁 Upload form: http://localhost:${port}/upload`);
  console.log(`📂 File manager: http://localhost:${port}/files`);
});