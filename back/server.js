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
// const multer = require('multer');
// const upload = multer({ dest: 'pictures' });
// require("dotenv").config({ path: ".envDev" });
require("dotenv").config({ path: ".env" });
require("./database.js");
const messageRoute = require("./controllers/message.controller.js");
const userRoute = require("./controllers/user.controller.js");
const UserModel = require('./models/user.model.js');
const MessageModel = require('./models/message.model.js');
// const uploader = new socketFileUpload();
const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
    path: `${process.env.BASE_URL}`,
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
app.use(express.static(path.join(__dirname, './pictures')));
    
io.use((socket, next) => {
    const authHeader = socket.handshake.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`, (err, decodedToken) => {
            if (err) {
            socket.emit('login-false', { success: false, error: err });
                // return 
            }
            socket.userData = {
                jwtToken: decodedToken,
            };
            return next();
        }); 
    } else {
        socket.emit('login-false', { success: false, error: 'Identifiants incorrects, veuillez les vérifiés' });
        // return 
    }
});

const onlineUsers = {};
const userChunkStorage = {};

io.on('connection', (socket) => {

    const userConected = socket.id;
    onlineUsers[userConected] = true;
    console.log(onlineUsers);

    socket.on('upload', async ({ chunk, user, type, isLastChunk }, status) => {
        console.log(`Received chunk for user ${user}`);

        const userRequest = user;
        const userToken = socket.userData.jwtToken.userId;

        if (userToken === userRequest) {
            if (!chunk) {
                status('failure');
                return;
            }
            const fileName = `${process.env.BASE_SERVER_IMAGE_USER}/${user}.${type}`;
            if (!userChunkStorage[user]) {
                userChunkStorage[user] = [];
            }
            userChunkStorage[user].push(chunk);
            if (isLastChunk) {
                const fileData = Buffer.concat(userChunkStorage[user]);
                fs.writeFile(fileName, fileData, (err) => {
                    if (err) {
                        console.log('Erreur lors de l\'enregistrement du fichier :', err);
                        status('failure');
                    } else {
                        userRoute.registerPicture({ user, fileName }, (res) => {
                            if (res.success) {
                                console.log('Fichier enregistré avec succès :', fileName);
                                status('success');
                            } else {
                                console.log('Erreur lors de l\'enregistrement du fichier :', res.error);
                                status('failure');
                            }
                        });
                    }
                });
                delete userChunkStorage[user];
            } else {
                status('received');
            }
        } else {
            status('failure');
        }
    });
    
    const pendingChunks = {};

    socket.on('chat-message-send', async (fileData, status) => {
        const userRequest = fileData.userId;
        const userToken = socket.userData.jwtToken.userId;
        const fileName = fileData.pictureName;
        const uniqueFileName = `${Date.now()}_${fileName}`;
       console.log(fileData);
        if (userToken === userRequest ) {
        if (fileData.pictureMessage === '') {
            messageRoute.registerMessage(fileData, uniqueFileName, (res) => {
                console.log('savedok');
                if (res.success) {
                    io.emit('chat-message-resend', res.message);
                } else {
                    io.emit('chat-message-resend', res);
                }
            });     
        }
        
            if (!pendingChunks[fileName]) {
                pendingChunks[fileName] = [];
            }
            pendingChunks[fileName].push(fileData.pictureMessage);
            if (fileData.isLastChunk) {
                status('received_last-chunk');
                // Si nous avons reçu le dernier chunk, réassemblez-les en un fichier complet
                const fileDataBuffer = Buffer.concat(pendingChunks[fileName]);
                const filePath = `${process.env.BASE_SERVER_IMAGE_MESSAGE}/${uniqueFileName}`;
                fs.writeFile(filePath, fileDataBuffer, (err) => {
                    if (err) {
                        console.error('Erreur lors de l\'enregistrement du fichier :', err);
                        status('failure');
                    } else {
                        // Supprimez le tableau des chunks en cours de réception
                        delete pendingChunks[fileName];
                        status('j "enregistre');
// 
                        
                    
                        // Enregistrez le fichier avec un nom unique
                        messageRoute.registerMessage(fileData, uniqueFileName, (res) => {
                            console.log('savedok');
                            if (res.success) {
                                io.emit('chat-message-resend', res.message);
                            } else {
                                io.emit('chat-message-resend', res);
                            }
                        });

                        status('success');
                    }
                });
            } else {
                status('received_chunk');
            }
          

            
        } else {
        console.log('lalalaa');
            status('failure');
        }
        
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
   
    socket.on('isconnected', (id, callback) => {
        UserModel.findByIdAndUpdate(id, { login: userConected })
            .then((doc) => {
                if (!doc) {
                    // Aucun document trouvé avec cet ID
                    console.log('Aucun document trouvé avec cet ID.');
                } else {
                    // Mise à jour réussie
                    console.log('Mise à jour réussie.');
                }
            })
            .catch((err) => {
                // Gérer les erreurs ici
                console.error('Erreur lors de la mise à jour :', err);
            });

    })



    socket.on('login-user', async (data, callback) => {
        onlineUsers[userConected] = true;
        // console.log(onlineUsers);
        userRoute.loginUser(data, userConected, (res) => {
            if (res.success === true) {
                const dataUser = {
                    id: data.id,
                    pseudo: data.pseudo,
                    email: data.email,
                }

                // socket.broadcast.emit('user-online', { userId });
                io.emit('login-response', res, dataUser); // Vous devrez peut-être corriger ici
            }
            if (res.success === false) {
                io.emit('login-response', res);
            }
        });
    })

    socket.on('logout-user', async (data, callback) => {
        // delete onlineUsers[userConected];
        userRoute.logoutUser(data, (res) => {
            if (res.success === true) {
                console.log(`logout de ${data.pseudo}`);
                const dataUser = {
                    id: data.id,
                    pseudo: data.pseudo,
                }

                // socket.broadcast.emit('user-offline', { userId });
                io.emit('logout-response', res, dataUser); // Vous devrez peut-être corriger ici
            }
            if (res.success === false) {
                io.emit('logout-response', res);
            }
        });
    })



    socket.on('disconnect', async () => {
        await UserModel.findOneAndUpdate({ login: userConected }, { login: '' })
            .then((doc) => {
                if (!doc) {
                    // Aucun utilisateur trouvé avec ce login
                    console.log('Aucun utilisateur trouvé avec ce login.');
                } else {
                    delete onlineUsers[userConected];
                    console.log('Mise à jour réussie.');
                }
            })
            .catch((err) => {
                // Gérer les erreurs ici
                console.error('Erreur lors de la mise à jour :', err);
            });
    })

});

;

server.listen(() => {
    const address = server.address();
    const host = address.address;
    const port = address.port;
    console.log(`Serveur en cours d'écoute sur http://${host}:${port}`);
});


// server.listen(process.env.PORT, () => {
//     const address = server.address();
//         const host = address.address;
//         const port = address.port;
//     console.log(`Le serveur écoute sur http://${address.address}:${address.port}`);
//     console.log(`Le serveur écoute sur http://${host}:${port}`);
// });

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