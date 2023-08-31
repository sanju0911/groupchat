const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));


app.get('/login', (req, res) => {
    res.send('<form action="/login" method="POST"><input type="text" name="title"><button type="submit">login</button></form>');
});

app.post('/login', (req, res) => {
  
    const username = req.body.title;

   
    res.redirect(`/chat?username=${encodeURIComponent(username)}`);
});


app.get('/chat', (req, res) => {
    const username = req.query.username;

   
    res.send(`
        <form action="/" method="POST">
            <h2>Welcome ${username}!</h2>
            <input type="hidden" id="username" name="username" value="${username}">
            <input type="text" id="message" name="message" placeholder="Enter your message">
            <button type="submit">Send</button>
        </form>
        <h2>Messages:</h2>
        <div id="messages"></div>
        <script src="/client.js"></script>
    `);
});

app.post('/', (req, res) => {
    const username = req.body.username;
    const message = req.body.message;

   
    fs.appendFileSync('messages.txt', `${username}: ${message}\n`);

    
    res.redirect(`/chat?username=${encodeURIComponent(username)}`);
});

app.listen(8005, () => {
    console.log('Server is listening on port 8005');
});
