const express = require('express')
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser')
const controller = require(__dirname + '/controller');
const router = express.Router();
const app = express()
const multer = require('multer')
const port = 3000
const upload = multer();
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.json({
    message:'Hello World!!'
  })
})


app.post('/upload',allowCors, upload.single('file'), callName);

async function callName(req, res) { 
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  let imageBuffer = req.file.buffer;
    if (imageBuffer){
      var spawn = require("child_process").spawn;

      var obj_val = {"selectedValue": +obj_obj["selectedValue"], "redSlider": +obj_obj["redSlider"], "blueSlider": +obj_obj["blueSlider"], "greenSlider": +obj_obj["greenSlider"]};
      var obj_str = JSON.stringify(obj_val)
      var process = spawn('python',["./Script/img_final.py", req.newFName, obj_str], {stdin: 'pipe'});
      process.stdin.write(imageBuffer);
      process.stdin.end();
      let dataChunks = []
      
      process.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      process.stdout.on('data', function(data) { 
        dataChunks.push(data)
      })
      process.on('close', (code) => { //python script exit
        console.log(`child process exited with code ${code}`);
        if(code !== 0) {
          if(!res.headersSent) {
            res.status(500).send({error: 'Internal Server Error: Script Failed to execute'})
            console.error('index.js: main.py Script faliure')
          }
        } else {
          if(dataChunks.length > 0) {
            let data = Buffer.concat(dataChunks);
            res.writeHead(200, {
              'Content-Type': 'image/jpeg',
              'Content-Length': data.length
            });
            res.end(data);
          } else {
            if(!res.headersSent) {
              res.status(500).send({error: 'Internal Server Error: No data to send'})
            }
          }
        }
    });
    }
} 


app.post('/login', (req, res) => {
  const user = req.body.user;
  const pass = req.body.pass;
  const users = {};
  const names = {};
  fs.readFile('users.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send({ login: 0, message: 'Internal server error' });
    } else {
      const lines = data.split('\n');
      lines.forEach(line => {
        const parts = line.split(':');
        users[parts[1]] = parts[2];
        names[parts[1]] = parts[0];
      });
      if (users[user] === pass) {
        res.send({ login: 1, name: names[user], message: 'Login successful' });
      } else {
        res.send({ login: 0, name: '', message: 'Invalid username or password' });
      }
    }
  });
});

app.post('/setParmVal', (req, res) => {
  const email = req.body.email;
  const sliderDat = req.body.sliderDat;
  const data = `${email}:${JSON.stringify(sliderDat)}\n`;
  fs.appendFile('userDat.txt', data, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Internal server error' });
    } else {
      res.send({ message: 'User Data saved successfully' });
    }
  });
})




app.post('/getParmVal', (req, res) => {
  const user = req.body.user;
  const params = {};
  fs.readFile('userDat.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send({ login: 0, message: 'Internal server error' });
    } else {
      const lines = data.split('\n');
      lines.forEach(line => {
        const parts = line.split(':');
        params[parts[0]] = parts[1];
      });
        res.send({ params: params[user], message: 'Params Retreived Successfully' });
    }
  });
});

app.post('/register', (req, res) => {
  const name = req.body.name;
  const user = req.body.user;
  const pass = req.body.pass;
  const data = `${name}:${user}:${pass}\n`;
  fs.appendFile('users.txt', data, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Internal server error' });
    } else {
      res.send({ message: 'User registered successfully' });
    }
  });
});
function allowCors(req, res, next) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
  }
  
  next();
}

app.listen(port)

