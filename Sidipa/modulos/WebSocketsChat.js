/**
 * Created by Ricardo on 01/05/2016.
 */
simulacionController = require('../controllers/simuladorController');

var ServerChat = function(io){
    var chat = {};
    var _users = {};
    var _simulaciones = {};

    io.on('connection', function(socket){

        socket.on('conectar', function (data) {
            if (data.user && data.room) {
                var _mensaje = { mensaje: 'Se Ha Unio Al Chat', user: data.user }

                if (_simulaciones[data.room]) {
                    init(socket, data, _mensaje);
                    (_users[data.room].length == 1) ?  socket.emit('reciveSimulacion', _simulaciones[socket.room].simulacion): null;
                    socket.emit('recive', { mensaje: 'Bienvenido Al Chat', user: data.user, chat: chat[data.room] });
                }
                else {
                    simulacionController.findSimulacion(parseInt(data.room), function (_simulacion) {
                        if (_simulacion) {
                            (!chat[data.room]) ? chat[data.room] = _simulacion.chat :  null;
                            (!_users[data.room]) ? _users[data.room] = [] : null;
                            _simulaciones[data.room] = {};
                            _simulaciones[data.room]["propietario"] = socket.id;
                            _simulaciones[data.room]["simulacion"] = _simulacion.simulacion;

                            init(socket, data, _mensaje);
                            socket.emit('reciveSimulacion', _simulaciones[data.room]["simulacion"]);
                            socket.emit('recive', { mensaje: 'Bienvenido Al Chat', user: data.user, chat: chat[data.room] });
                        }

                    });
                }
            }
        });

        socket.on('disconnect', function (){

            var _mensaje = { mensaje: 'Ha Dejado El Chat', user: socket.user };
            var users = _users[socket.room];

            io.sockets.in(socket.room).emit('recive', _mensaje);

            _emitnextUser(socket);

            (chat[socket.room] instanceof Array) ? chat[socket.room].push(_mensaje): null;
            (users) ? users.splice(users.indexOf(socket.id), 1) : null;

            socket.leave(socket.room);
        });

        socket.on('send',function(mensaje){
            var _mensaje = {mensaje:mensaje,user:socket.user};

            io.sockets.in(socket.room).emit('recive', _mensaje);

            (chat[socket.room] instanceof Array) ? chat[socket.room].push(_mensaje): null;
        });


        socket.on('finish', function (context){
            if (typeof context === "object") {
                _simulaciones[socket.room]["simulacion"] = context;
            }
            _emitnextUser(socket);
        });
    });

    function init(socket, data, _mensaje) {
        io.sockets.in(data.room).emit('recive', _mensaje);

        chat[data.room].push(_mensaje)
        _users[data.room].push(socket.id);

        socket.join(data.room);

        socket.user = data.user;
        socket.room = data.room;
    }

    var _emitnextUser = function (socket) {
        var socketId = _getNextID(socket.room, socket.id);
        io.sockets.in(socket.room).emit('noSimulation');
        (socketId) ?  io.to(socketId).emit('reciveSimulacion', _simulaciones[socket.room].simulacion): null;
    }

    var _getNextID = function(room,socketId){
        var users = _users[room];

        if (users instanceof Array) {
           var next = socketId;
           var index = users.indexOf(socketId);
           (index+1 >= users.length ) ? next= _users[room][0] : next= _users[room][index+1];
           return next;
       }
        return null;
    }

    return {
        chats : chat,
        simulacions: _simulaciones,
        users: _users
    };
}

module.exports = ServerChat;

