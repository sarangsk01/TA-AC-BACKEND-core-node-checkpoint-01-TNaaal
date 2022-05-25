// server
var http = require('http');
const fs = require('fs');
var server = http.createServer(handleRequest);
var qs = require('querystring');
var url = require('url');

var usersPath = __dirname + '/users/';

function handleRequest(req, res) {
  var parsedUrl = url.parse(req.url, true);
  var store = '';
  req.on('data', (chunk) => {
    store += chunk;
  });
  req.on('end', () => {
    if (req.method === 'POST' && req.url === '/users') {
      var username = JSON.parse(store).username;
      fs.open(usersPath + username + '.json', 'wx', (err, fd) => {
        if (err) return console.log(err);
        fs.writeFile(fd, store, (err) => {
          if (err) return console.log(err);
          fs.close(fd, () => {
            res.end(`${username} created successfully`);
          });
        });
      });
    } else if (req.method === 'GET' && parsedUrl.pathname === '/users') {
      console.log(parsedUrl);
      var username = parsedUrl.query.username;
      fs.readFile(usersPath + username + '.json', (err, content) => {
        if (err) return console.log(err);
        res.setHeader('Content-Type', 'application/json');
        return res.end(content);
      });
    } else if (parsedUrl.pathname === '/users' && req.method === 'PUT') {
      var username = parsedUrl.query.username;
      fs.open(usersPath + username + '.json', 'r+', (err, fd) => {
        if (err) return console.log(err);
        fs.ftruncate(fd, (err) => {
          if (err) return console.log(err);
          fs.writeFile(fd, store, (err) => {
            if (err) return console.log(err);
            fs.close(fd, () => {
              res.end(`${username} updated successfully`);
            });
          });
        });
      });
    } else if (parsedUrl.pathname === '/users' && req.method === 'DELETE') {
      var username = parsedUrl.query.username;
      fs.unlink(usersPath + username + '.json', (err) => {
        if (err) return console.log(err);
        res.end(`${username} is deleted successfully`);
      });
    } else {
      res.statusCode = 404;
      res.end('Page Not Found');
    }
  });
}

server.listen(5000, () => {
  console.log('server listening on port 5000');
});
