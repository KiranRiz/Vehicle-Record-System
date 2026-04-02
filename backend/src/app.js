const express = require('express');
const path = require('path');
const recordsRouter = require('./routes/records');
const usersRouter = require('./routes/users');
const agreementsRouter = require('./routes/agreements');

const app = express();

// JSON body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/records', recordsRouter);
app.use('/api/users', usersRouter);
app.use('/api/agreements', agreementsRouter);

// Serve client assets
const jsPath = path.join(__dirname, '../..', 'js');
app.use('/js', express.static(jsPath));

// Serve the frontend files
const frontendPath = path.join(__dirname, '../..', 'frontend');
app.use(express.static(frontendPath));

// Fallback to index.html for SPA routes
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

module.exports = app;
