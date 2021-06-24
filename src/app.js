const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Set static files folder

// app.get('/', (req, res) => {
//     fs.readFile('./tracks/track.gpx', (err, data) => {
//         if (!err) {
//             res.setHeader('content-type', 'text/plain');
//             res.send(data);
//         } else {
//             res.status(404).send({ message: 'The file does not exists' });
//         }
//     });
// });

app.post('/upload', (req, res) => {

    const trackFile = req.files.track;

    trackFile.mv(path.join(__dirname, 'public/tracks/track.gpx'), err => {
        
        if(err) return res.status(500).json({ message: err });

        return res.json({ message: 'File uploaded successfully!!'});
    });
});

// Start Server
app.listen(app.get('port'), () => {
    console.log(`App listening at http://localhost:${app.get('port')}`);
});

/**
 * DETENER UN PROCESO DE NODEJS. VER:
 * https://stackoverflow.com/questions/4075287/node-express-eaddrinuse-address-already-in-use-kill-server#43527235
 * 
 * CREAR E IR A LA CARPETA CREADA EN LINUX. VER:
 * https://unix.stackexchange.com/questions/125385/combined-mkdir-and-cd#125459
 */