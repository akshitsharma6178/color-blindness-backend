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
// app.use(bodyParser.urlencoded({extended: true}))
app.get('/', (req, res) => {
  res.json({
    message:'Hello World!!'
  })
})

app.get('/file', (req, res) => {
  // const filePath = req.body.path;
  const filePath = __dirname + '/uploads/ai-technology-brain-background-digital-transformation-concept-updated.jpg';
  // fs.readFile('.' + filePath, (err, data) => {
  //   if (err) {
  //     res.status(500).send({ error: 'Unable to read file' });
  //   } else {
  //     res.send(data);
  //   }
  // });
  res.sendFile(filePath);
});


app.post('/upload',upload.single('file'), callName);

async function callName(req, res) { 
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  let imageBuffer = req.file.buffer;
    // msg = await controller.upload(req, res);
    if (imageBuffer){
      var spawn = require("child_process").spawn;
      // obj_obj = JSON.parse(req.body.obj)

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

    // console.log(req.body)
    // res.send(JSON.stringify(req));
    // // Use child_process.spawn method from  
    // // child_process module and assign it 
    // // to variable spawn 
    // var spawn = require("child_process").spawn; 
    // var process = spawn('python',["./Script/video.py", 
    //                         req.body] ); 
    // // with arguments and send this data to res object 
    // process.stdout.on('data', function(data) { 
    //     res.send(data); 
    // } ) 
} 

// app.post('/login', (req, res)=>{
//   let user = req.body.user;
//   let pass = req.body.pass;
//   if(user == 'akshit' && pass == 'akshit')
//     data = {'login' : 1}
//   else 
//     data = {'login' : 0}
//   res.send(data);
// })

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

app.listen(port)

