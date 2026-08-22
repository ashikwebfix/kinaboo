const fs = require('fs');
const path = require('path');

const uploadMedia = (req, res) => {
  if (req.file) {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(201).json({ url: fileUrl, filename: req.file.filename });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
};

const getMedia = (req, res) => {
  const directoryPath = path.join(__dirname, '../uploads');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.json([]);
      }
      return res.status(500).json({ message: 'Unable to scan files' });
    }
    const fileUrls = files.filter(f => !f.startsWith('.')).map(file => ({
      filename: file,
      url: `${req.protocol}://${req.get('host')}/uploads/${file}`
    }));
    res.json(fileUrls);
  });
};

const deleteMedia = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ message: 'File not found' });
      }
      return res.status(500).json({ message: 'Error deleting file' });
    }
    res.json({ message: 'File deleted successfully' });
  });
};

module.exports = {
  uploadMedia,
  getMedia,
  deleteMedia
};
