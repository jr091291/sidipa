/**
 * Created by Ricardo on 16/04/2016.
 */
var models= require('../models/models');
var simulacionController = require('./simuladorController.js');
var app = require('../app');
/**
 * Verifica si el usuario se enbcuentra loguado
 * @method loginRequired
 * @param {} req
 * @param {} res
 * @param {} next
 * @return 
 */
exports.loginRequired = function(req, res, next){
    if(req.session.user){
        next();
    }
    else{
        res.redirect('/login');
    }
}

/**
 * Rederiza La Vista De Login
 * @method getLogin
 * @param {} req
 * @param {} res
 * @return 
 */
exports.getLogin = function(req, res){
    if(! req.session.user){
        res.render('users/login', {title:'Inicio | Ingresar'});
    }
    else{
        res.redirect("/simulacion/run");
    }
}

/**
 * crea una seccion para un usuario
 * @method login
 * @param {} req
 * @param {} res
 * @return 
 */
exports.login = function(req, res) {
    var id = req.body.id;
    var pass = req.body.pass;
    var role = req.body.role;
    var simulacion  = req.body.simulacion;
   
    autenticar(role,id,pass,function(error,user){
        if(error){
            res.render('users/login', {
                title:'Ingreso Incorrecto',
                error:{
                    title:'Operacion Incompleta: ',
                    msg:error
                },
                data:req.body
            });
        }
        else {
            simulacionController.findSimulacion(simulacion, function (res) {
                if (res.id_docente === id && role === "docente") {
                    simulacionController.updateSimulacion(simulacion, { estado: true }, function (r) { console.log(JSON.stringify(r))});
                }
            });
            req.session.user = {id: id, username: user.nombre, role:role, simulacion:simulacion};
            res.redirect('simulacion/run/'+simulacion);
        }
    });
}

/**
 * Destruye la session del usuario
 * @method logout
 * @param {} req
 * @param {} res
 * @return 
 */
exports.logout = function (req, res){
    var id_simulacion = req.session.user.simulacion;

    if (req.session.user.role === "docente") {
        var data = {
            chat: app.chat.chats[id_simulacion],
            simulacion: app.chat.simulacions[id_simulacion].simulacion,
            estado:false
        }
        simulacionController.updateSimulacion(id_simulacion, data, function (r) { console.log(r) });
    }
    delete req.session.user;
    res.redirect(req.session.redir.toString());
}

/**
 * Funciones Y Metodos
 * @method autenticar
 * @param {} role
 * @param {} id
 * @param {} pass
 * @param {} callback
 * @return 
 */
var autenticar= function (role,id,pass,callback){
    switch (role){
        case 'estudiante':
            role = models.Estudiantes;
            break;
        case 'docente':
            role = models.Docentes;
            break;
        default:
            callback('Role De Usuario, No Existe',null);
    }

   role.findByPrimary(id).then(function(usuario){
            if(usuario){
                if(usuario.pass === pass){
                    callback(null,usuario);
                }
                else{
                    callback('Passwore Incorrecto',null);
                }
            }
            else{
                callback('Usuario No Registrado',null);
            }
        }
    );
};