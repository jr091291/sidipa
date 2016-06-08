/**
 * Created by Ricardo on 01/05/2016.
 */

$(document).ready(function () {
    var socket = io.connect();
    
    //Nos Conectamos a la simulacion
    socket.emit('conectar', { room: _dataSimulacion.id, user: _dataSimulacion.user , userId: _dataSimulacion.userId});
    
    //recive un mensaje nuevo
    socket.on('recive', function (data) {
        renderChat(data)
    });
    
    //recive parametros de la simulacion
    socket.on('reciveSimulacion', function (data) {
        if (data) {
            (!simulacion) ? simulacion = createSimulacion() : null;

            simulacion.setContext(data);
            simulacion.onfinish(function (estado) {
                if (estado) {
                    simulacion.stop();
                    var context = simulacion.getContext();
                    socket.emit('finish', context);
                    console.log("Se Ha Finalizado La Simulacion: " + Date.now());
                }
            });
            simulacion.run();
            console.log("Se Ha Iniciado La Simulacion: " + Date.now());
        }
    });
    
    socket.on("noSimulation", function () {
        (!simulacion) ? simulacion = createSimulacion() : null;
        simulacion.stop();
        simulacion.clean();
        simulacion.reset();
    })

    $('#sendMensagge').on("click", function () { sendMensagge(socket) });
    
    $('#mensaje')[0].onkeypress = function (e) {
        if (e.code === "Enter") {
            sendMensagge(socket);
        }
    }
    
    /*
     * funciones ClientSocket
     */
    
    function sendMensagge(socket) {
        if (mensaje = $('#mensaje').val()) {
            socket.emit('send', mensaje);
            $('#mensaje').val('')
        }
        setTimeout(function () {
            var e = $('#mensajes')[0];
            e.scrollTop = e.scrollHeight;
        }, 200);
    }
    
    
    function renderChat(data) {
        var html = '';
        if (data.chat instanceof Array) {
            data.chat.forEach(function (mensaje) {
                html += '<div class="msg"><strong>' + mensaje.user + ': </strong>' + mensaje.mensaje + '</div>';
            });
        }
        else {
            html = '<div class="msg"><strong>' + data.user + ': </strong>' + data.mensaje + '</div>';
        }
        $('#mensajes')[0].innerHTML += html;
    }
});