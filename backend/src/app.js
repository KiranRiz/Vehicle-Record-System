const fs = require('fs');
const express = require('express');
const path = require('path');
const recordsRouter = require('./routes/records');
const usersRouter = require('./routes/users');
const agreementsRouter = require('./routes/agreements');
const fareTypesRouter = require('./routes/fareTypes');


const app = express();

// JSON body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/records', recordsRouter);
app.use('/api/users', usersRouter);
app.use('/api/agreements', agreementsRouter);
app.use('/api/fareTypes', fareTypesRouter);

const jsPath = path.join(__dirname, '../..', 'js');
const frontendPath = path.join(__dirname, '../..', 'frontend');
const hasStaticAssets = fs.existsSync(jsPath) && fs.existsSync(frontendPath);

if (hasStaticAssets) {
  app.use('/js', express.static(jsPath));
  app.use(express.static(frontendPath));

  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
}

module.exports = app;
