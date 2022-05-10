const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const path = require('path');
const morgan = require('morgan')


const productosRouter = require ('./routes/productos.routes.js')
const {getAllMessage,createMessage,nomalizarData} = require('./controllers/mensajes')

// const util = require('util')
// function print(objeto) {
//     console.log(util.inspect(objeto,false,12,true))
// }

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//-------------------------------------
//-------------------------------------
//productos routes

app.use('/api/productos-test', productosRouter);

//----------------------------------------
//----------------------------------------
//socket.io

io.on("connection", async (socket) => {
    console.log("Se ha conectado un cliente");
    socket.on("new_message", async data => {
        await createMessage(data);
        // getAllMessage().then(async (data) => io.sockets.emit("messages_received", {mensaje:"aca van los mensajes"})) 
        getAllMessage().then(async (data) => io.sockets.emit("messages_received", await nomalizarData(data))) 
    })   
    getAllMessage().then(async (data) => io.sockets.emit("messages_received", await nomalizarData(data))) 
    // getAllMessage().then((data) => print(nomalizarData(data)))
})

app.io = io;

//--------------------------------------
//--------------------------------------

app.use((req, res) => {
    res.json({
    error: {
        error: -2,
        descripcion: `Ruta ${req.originalUrl} y metodo ${req.method} no implementados`
}})});


//-------------------------------------
//-------------------------------------

const server = httpServer.listen(8080,() => {
    console.log(`puerto ${server.address().port}`);
})