const http = require('http');
const fs = require('fs');
const path = require('path');
const pug = require('pug');
const url = require('url');

const port = 3000;

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  const reqPath = reqUrl.pathname;

  // Serve static files
  if (reqPath.startsWith('/public/')) {
    const filePath = path.join(__dirname, reqPath);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
      } else {
        const contentType = getContentType(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
    return;
  }

  if (reqPath === '/') {
    const created = reqUrl.query.created === 'true';
    const events = getAll("events");
    renderTemplate(res, 'index', { created, events });
  } else if (reqPath === '/list') {
    const created = reqUrl.query.created === 'true';
    const events = getAll("events");
    renderTemplate(res, 'list', { created, events });
  } else if (reqPath === '/create') {
    renderTemplate(res, 'create');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page not found');
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

function getAll() {
  try {
    const data = fs.readFileSync(`./data/event.json`, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
}

// Function to render a Pug template
function renderTemplate(res, templateName, data = {}) {
  const templatePath = path.join(__dirname, 'views', `${templateName}.pug`);
  fs.readFile(templatePath, 'utf8', (err, templateContent) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    } else {
      const renderedTemplate = pug.render(templateContent, data);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(renderedTemplate);
    }
  });
}

// Function to get content type based on file extension
function getContentType(filePath) {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.css':
      return 'text/css';
    default:
      return 'text/plain';
  }
}
