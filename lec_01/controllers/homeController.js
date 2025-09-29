const fs = require('fs');
const path = require('path');

const homeController = {
  index: (req, res) => {
    
    let fileCount = 0;
    let totalSize = 0;
    
    try {
      const files = fs.readdirSync('uploads');
      fileCount = files.length;
      
      files.forEach(file => {
        const stats = fs.statSync(path.join('uploads', file));
        totalSize += stats.size;
      });
    } catch (error) {
      console.log('Error reading uploads directory:', error.message);
    }
    
    const stats = {
      fileCount,
      totalSize: (totalSize / (1024 * 1024)).toFixed(2) 
    };
    
    res.render('pages/home', {
      title: 'File Upload Dashboard',
      stats,
      currentYear: new Date().getFullYear()
    });
  }
};

module.exports = homeController;