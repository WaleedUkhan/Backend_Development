const fs = require('fs');
const path = require('path');

const uploadController = {
  showUploadForm: (req, res) => {
    res.render('pages/upload', {
      title: 'Upload Files',
      currentYear: new Date().getFullYear()
    });
  },

  handleUpload: (req, res) => {
    try {
      const uploadedFiles = [];
      
      // Handle single file
      if (req.files.singleFile) {
        uploadedFiles.push(...req.files.singleFile);
      }
      
      // Handle multiple files
      if (req.files.multipleFiles) {
        uploadedFiles.push(...req.files.multipleFiles);
      }
      
      if (uploadedFiles.length === 0) {
        return res.render('pages/upload-result', {
          title: 'Upload Failed',
          success: false,
          message: 'No files were uploaded.',
          files: [],
          description: req.body.description,
          currentYear: new Date().getFullYear()
        });
      }
      
      const fileDetails = uploadedFiles.map(file => ({
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        path: file.path,
        sizeFormatted: (file.size / 1024).toFixed(2)
      }));
      
      res.render('pages/upload-result', {
        title: 'Upload Successful',
        success: true,
        message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
        files: fileDetails,
        description: req.body.description || 'No description provided',
        currentYear: new Date().getFullYear()
      });
      
    } catch (error) {
      res.render('pages/upload-result', {
        title: 'Upload Error',
        success: false,
        message: 'Error uploading files: ' + error.message,
        files: [],
        description: req.body.description,
        currentYear: new Date().getFullYear()
      });
    }
  },

  listFiles: (req, res) => {
    fs.readdir('uploads', (err, files) => {
      if (err) {
        return res.render('pages/files', {
          title: 'File Manager',
          files: [],
          error: 'Unable to read uploads directory',
          currentYear: new Date().getFullYear()
        });
      }
      
      const fileDetails = files.map(file => {
        const stats = fs.statSync(path.join('uploads', file));
        const ext = path.extname(file).toLowerCase();
        
        // Determine file type for icon
        let fileType = 'file';
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
          fileType = 'image';
        } else if (['.pdf'].includes(ext)) {
          fileType = 'pdf';
        } else if (['.doc', '.docx'].includes(ext)) {
          fileType = 'document';
        } else if (['.mp4', '.avi', '.mov'].includes(ext)) {
          fileType = 'video';
        } else if (['.mp3', '.wav', '.m4a'].includes(ext)) {
          fileType = 'audio';
        } else if (['.zip', '.rar', '.7z'].includes(ext)) {
          fileType = 'archive';
        }
        
        return {
          filename: file,
          size: stats.size,
          sizeFormatted: (stats.size / 1024).toFixed(2),
          modified: stats.mtime.toLocaleString(),
          fileType: fileType,
          extension: ext
        };
      });
      
      // Sort by modification date (newest first)
      fileDetails.sort((a, b) => new Date(b.modified) - new Date(a.modified));
      
      res.render('pages/files', {
        title: 'File Manager',
        files: fileDetails,
        error: null,
        currentYear: new Date().getFullYear()
      });
    });
  },

  deleteFile: (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join('uploads', filename);
    
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error deleting file' });
      }
      res.json({ success: true, message: 'File deleted successfully' });
    });
  }
};

module.exports = uploadController;