const http = require('http');
const querystring = require('querystring');
const { sanitize, getTemplate } = require('./utils');


const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const { method, url } = req;


  const sendResponse = (statusCode, html) => {
    const body = Buffer.from(html, 'utf-8');
    res.writeHead(statusCode, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': body.length,
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(body);
  }
if (method === 'GET') {
        if (url === '/') {
            sendResponse(200, getTemplate('Home', 'Welcome to the Home Page'));
        } else if (url === '/about') {
            sendResponse(200, getTemplate('About', 'Learn more about us'));
        } else if (url === '/contact') {
          const formHTML = `
            <h1>Contact Us</h1>
            <form action="/submit" method="POST">
              <input type="text" name="name" placeholder="Name" required><br>
              <input type="email" name="email" placeholder="Email" required><br>
              <button type="submit">Submit</button>
            </form>
          `;
            sendResponse(200, getTemplate('Contact', formHTML));
        } else {
            
            sendResponse(404, getTemplate('404 Not Found', 'Page Not Found'));
        }
    } 

   
    else if (method === 'POST' && url === '/submit') {
        let body = '';

     
        req.on('data', chunk => {
            body += chunk.toString();
            if (body.length > 1024 * 1024) {
                sendResponse(413, '<h1>413 Payload Too Large</h1>');
                req.destroy();
            }
        });

        req.on('end', () => {
            const data = querystring.parse(body);
           
            const name = sanitize(data.name);
            const email = sanitize(data.email);

            if (!name || !email) {
                return sendResponse(400, getTemplate('400 Bad Request', 'Invalid form data'));
            }

           
            const successHTML = `<h1>Form Submitted</h1><p>Name: ${name}</p><p>Email: ${email}</p>`;
            sendResponse(200, successHTML);
        });
    }

 
    else {
        sendResponse(404, getTemplate('Not Found', 'Route not supported'));
    }
});



server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 

