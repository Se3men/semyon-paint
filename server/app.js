require('dotenv').config();
const express = require('express');
const app = express();
const WSserver = require('express-ws')(app);
const aWss = WSserver.getWss();
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const { PORT = 5000 } = process.env;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: ['https://semyon-paint.herokuapp.com/', 'wss://semyon-paint.herokuapp.com/'],
}));

app.ws('/', (ws, req) => {
  ws.on('message', (messageJson) => {
    const message = JSON.parse(messageJson);

    setTimeout(() => ws.send(''), 30000)
    
    switch (message.method) {
      case "connection":
        connectionHandler(ws, message)
        break
      case "draw":
        connectionHandler(ws, message)
        break
    }
  })
})

app.post('/image', async (req, res) => {
  try {
    const data = req.body.img.replace(`data:image/png;base64,`, '');
    await fs.writeFile(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64');
    return res.status(200).json({message: 'download successfully'})
  } catch (error) {
    console.log(error);
    return res.status(500).json('error');
  } 
});

app.get('/image', async (req, res) => {
  try {
    const file = fs.readFile(path.resolve(__dirname, 'files', `${req.query.id}.jpg`));
    const data = `data:image/png;base64, ` + (await file).toString('base64');
    res.json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json('error');
  }
})

app.get('/*', (req, res) => {
  return res.render('index');
});

app.listen(PORT, () => {
  console.log(`server started on PORT: ${PORT}`);
})

const connectionHandler = (ws, msg) => {
  ws.id = msg.id;
  broadcastConnection(ws, msg);
}

function broadcastConnection (ws, msg) {
  aWss.clients.forEach(client => {
    if (client.id === msg.id) {
      client.send(JSON.stringify(msg));
    }
  })
}




