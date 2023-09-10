require("./database.js");
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const jwt = require('jsonwebtoken');
const util = require('util');
const bodyParser = require('body-parser');
const path = require("path");
const multer = require('multer');
const upload = multer({ dest: 'pictures' });
// require("dotenv").config({ path: ".envDev" });
require("dotenv").config({ path: ".env" });
const messageRoute = require("./controllers/message.controller.js");
const userRoute = require("./controllers/user.controller.js");
const UserModel = require('./models/user.model.js');
const MessageModel = require('./models/message.model.js');
// const uploader = new socketFileUpload();
const app = express();
const server = http.createServer(app);

 
const io = socketIO(server, {
    // path: `${process.env.BASE_URL}`,
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
        credentials: true,
    },
    transports: ['websocket',
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling',
        'polling'],
    allowEIO3: true,
    serveClient: true,
});

const corsOptions = {
    Origin: '*',
    origin: '*',
    credentials: true,
    allowedHeaders: ["*", "Content-type"],
    exposeHeaders: ["set-cookie"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'pictures')));

io.use((socket, next) => {
    const authHeader = socket.handshake.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        // Décodez le jeton JWT en utilisant votre secret JWT
        jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`, (err, decodedToken) => {
            if (err) {
                return next(new Error('Invalid JWT token'));
            }
            socket.userData = {
                jwtToken: decodedToken,
            };
           
            return next();
        });
    } else {
        return next(new Error('Socket connection requires authorization.'));
    }
});


io.on('connection', (socket) => {

    socket.on('upload', async ({ fileData ,user,type }, callback) => {
    
        // const detectedFileType = fileTypeModule(fileData);
        if (!fileData) { callback('failure');
            return;
        }
        const fileName = `./pictures/user/${user}.${type}`; 
        const name = fileName.split('/')[3]// 
        console.log(name);
        fs.writeFile(fileName, fileData, (err) => {
            if (err) {
                console.error('Erreur lors de l\'enregistrement du fichier :', err);
                callback('failure'); // En cas d'erreur lors de l'enregistrement
            } else {
                userRoute.registerPicture({user, fileName,name},(res)=>{
                    if (res.success) {
                        console.log('Fichier enregistré avec succès :', fileName);
                        callback('success'); 
                    } else {
                    
                    
                    
                    }
                })
              // Enregistrement réussi
            };
        }); // O});u 'failure' en cas d'erreur
    });
    
    
    const userId = socket.id; // Vous pouvez utiliser l'ID de socket comme identifiant d'utilisateur
    socket.broadcast.emit('user-online', { userId });


    socket.on('chat-message-send', async (fileData, callback) => {
        console.log(socket.userData);
    
        if (!fileData) {
            callback('failure');
            return;
        }
        const fileName = `./pictures/message/${fileData.pictureName}`;
        fs.writeFile(fileName, fileData.pictureMessage, (err) => {
            if (err) {
                console.error('Erreur lors de l\'enregistrement du fichier :', err);
                callback('failure'); // En cas d'erreur lors de l'enregistrement
            } else {
                messageRoute.registerMessage(fileData, (res) => {
                    if (res.success) {
                    // console.log(res);
                    console.log(res);
                        // console.log(`Message reçu : ${data.text} de ${data.pseudo}`);        
                        io.emit('chat-message-resend', res.message);
                    } else {
                        io.emit('chat-message-resend', res);
                    }
                });
            
            }
        })
    
    }); 

    socket.on('get-all-messages', async (data, callback) => {
        messageRoute.getAllMessages(data, (res) => {
            if (res.success) {
                io.emit('chat-message-resend-all', res);
            }
        });
    });

    socket.on('get-all-user', async (data, callback) => {
        userRoute.getAllUser(data, (res) => {
            if (res.success) {
                io.emit('All-user', res);
            }
        })
    });
    
    
    socket.on('get-user', async (data, callback) => {
        userRoute.getUser(data, (res) => {
            if (res.success) {
                io.emit('user', res);
            }
        });
    });

    socket.on('register-user', async (data, callback) => {
        userRoute.registerUser(data, (res) => {
            if (res.success === true) {
                // console.log(`enregistrement de ${data.pseudo}`);
                const dataUser = {
                    pseudo: data.pseudo,
                    email: data.email,
                }
                io.emit('registration-response', res, dataUser); // Vous devrez peut-être corriger ici
            }
            if (res.success === false) {
                io.emit('registration-response', res);
            }
        });
    });


    socket.on('login-user', async (data, callback) => {
        userRoute.loginUser(data, (res) => {
            if (res.success === true) {
                const dataUser = {
                    id: data.id,
                    pseudo: data.pseudo,
                    email: data.email,
                }
                io.emit('login-response', res, dataUser); // Vous devrez peut-être corriger ici
            }
            if (res.success === false) {
                io.emit('login-response', res);
            }
        });
    })

    socket.on('logout-user', async (data, callback) => {
        console.log(data);
        userRoute.logoutUser(data, (res) => {
            if (res.success === true) {
                console.log(`login de ${data.pseudo}`);
                const dataUser = {
                    id: data.id,
                    pseudo: data.pseudo,
                }
                io.emit('logout-response', res, dataUser); // Vous devrez peut-être corriger ici
            }
            if (res.success === false) {
                io.emit('logout-response', res);
            }
        });
    })

    


    socket.on('disconnect', () => {
        socket.broadcast.emit('user-offline', { userId });
    });


});

;

// server.listen(() => {
//     const address = server.address();
//     const host = address.address;
//     const port = address.port;
//     console.log(`Serveur en cours d'écoute sur http://${host}:${port}`);
// });


server.listen(`${process.env.PORT}`, () => {
    console.log(`connected ${process.env.PORT}`);
});

const log_file = fs.createWriteStream(__dirname + '/debug.log', { flags: 'w' });
const log_stdout = process.stdout;

console.log = (d, e, f, g) => {
    log_file.write(util.format('LOG: ', d ? d : '', e ? e : '', f ? f : '', g ? g : '') + '\n');
    log_stdout.write(util.format('LOG: ', d ? d : '', e ? e : '', f ? f : '', g ? g : '') + '\n');
}

console.error = (d, e, f, g) => {
    log_file.write(util.format('ERROR: ', d ? d : '', e ? e : '', f ? f : '', g ? g : '') + '\n');
    log_stdout.write(util.format('ERROR: ', d ? d : '', e ? e : '', f ? f : '', g ? g : '') + '\n');
}



// app.get(`${process.env.BASE_URL}/gettest`, (req, res) => {
//     const user =  UserModel.find({})
//       res.status(200).json({message: "ok"},user)


// });

// app.post(`${process.env.BASE_URL}/upload`, upload.single('file'), async (req, res) => {
//     console.error(req.body);
//     try {
//         const userId = req.body.userId;

//         const user = await UserModel.findByIdAndUpdate(userId, {
//             pictureUser: req.file != null
//                 ? `${req.protocol}://${req.get("host")}/${req.file.filename}`
//                 : `${req.protocol}://${req.get("host")}/default/default-user.jpg`,
//         });
//         await MessageModel.updateMany({ userId }, {
//             pictureUser: req.file != null ? `${req.protocol}://${req.get("host")}/${req.file.filename}`
//                 : `${req.protocol}://${req.get("host")}/default/default-user.jpg`,
//         }
//         )
//             res.status(200).json(user);


//     } catch (error) {
//         console.error('Erreur lors du téléchargement du fichier :', error);
//         res.status(500).send('Erreur lors du téléchargement du fichier');
//     }
// });