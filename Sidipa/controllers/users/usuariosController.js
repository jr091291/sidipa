var models = require('../../models/models.js');
/**
 * LLamada Views
 * @method getRegistrar
 * @param {} req
 * @param {} res
 * @return 
 */
exports.getRegistrar = function(req, res){
    if(req.session.user){
        res.redirect('/');
    }
    res.render('users/usuarios',{
        title:'Registro Usuario',
        action:'/usuarios/registro',
        operacion:'registrar',
        role: req.body.role
    });
}

/**
 * Description
 * @method getEditar
 * @param {} req
 * @param {} res
 * @return 
 */
exports.getEditar = function(req, res){
    _role =  req.session.user.role
    _id = req.session.user.id;
    var _model = getTable(_role);

    getUserById(_model, _id, function(error,user){
        if(error) {
            res.render('users/usuarios', {
                title: 'Procedimiento Incorrecto',
                error: {
                    title: 'Ha Ocurrido Un error',
                    msg: error
                },
                data: null
            });
        }

        res.render('users/usuarios',{
            title:'Editar Informacion',
            method:'put',
            action: '/usuarios/editar/'+_role+'/'+_id+'?_method=put',
            _method:'put',
            operacion:'actualizar',
            role: _role,
            user: _id,
            data: {
                nombre:user.nombre,
                institucion:user.institucion,
                programa:user.programa,
                profesion:user.nivel_estudio
            },
        });
    });
}

/**
 * Description
 * @method registrar
 * @param {} req
 * @param {} res
 * @return 
 */
exports.registrar = function(req, res){
    var model = getTable(req.body.role);
    verifiedUser(model, req.body.id, function (exits) {
        if (exits) {
            res.render('users/login', {
                title: "Usuario Registrado",
                data: {
                    id: req.body.id,
                    role: req.body.role
                },
                info: {
                    title: 'Por Favor Ingrese: ',
                    msg: 'El Numero Ingresado ya Se encuentra Registrado como ' + req.body.role
                }
            });
        } 
        else {
            model.create({
                id: req.body.id,
                nombre: req.body.nombre,
                pass: req.body.pass,
                nivel_estudio: req.body.profesion,
                institucion: req.body.institucion,
                programa: req.body.programa
            }).then(function (usuario) {
                if (usuario) {
                    models.Simulacion.create({
                        nombre: 'Default',
                        chat: [{ mensaje: 'Hola Bienvenido a SIDIPA, El simulador Distribuido de Ondas Senoidales', user: 'SIDIPA' }],
                        simulacion: { "onda": { "amplitud": 100, "frecuencia": 1, "fase": 180 }, "param": { "velocidad": 2000, "num_periodos": 1, "grosor_linea": 2, "color_linea": "red" } },
                        id_docente: usuario.id
                    }).then(function (simulacion) {
                        if (simulacion) {
                            console.log("Simulacion Autogenerada");
                            res.render('users/login', {
                                title: 'Bienvenido',
                                data: {
                                    id: usuario.id,
                                    role: req.body.role
                                },
                                success: {
                                    title: 'Operacion Registrada Con Exito',
                                    msg: 'Ya Pude Ingresar Con Sus Datos Personales',
                                },
                                info: {
                                    title: 'Operacion 100% Completada',
                                    msg: 'Se Creo Una Simulacion Automaticamente Por Defecto'
                                }
                            });
                        } else {
                            res.render('users/login', {
                                title: 'Bienvenido',
                                data: {
                                    id: usuario.id,
                                    role: req.body.role
                                },
                                error: {
                                    title: 'Operacion Registrada Con Problemas',
                                    msg: 'Ha Ocurrido Un Error Al Crear La Simulacion',
                                }
                            });
                        }
                    });
                }
                else {
                    res.render('users/usuarios', {
                        info: {
                            title: 'Ha Ocurrido Un Error: ',
                            msg: 'Por Favor Verifique Su Informacion E Intente de Nuevo'
                        }
                    });
                }
            })
        }
    });
       
}

/**
 * Description
 * @method editar
 * @param {} req
 * @param {} res
 * @return 
 */
exports.editar = function(req, res){
    var model = getTable(req.session.user.role);
    model.update(
        {   nombre: req.body.nombre,
            nivel_estudio: req.body.profesion,
            institucion: req.body.institucion,
            programa:req.body.programa
        },
        // Where clause / criteria
        {where: { id : req.session.user.id }}
    ).then(function() {
        res.render('index', {
            title: 'Bienvenido A SIDIPA',
            info:{
                title: 'Operacion terminada',
                msg: 'Se Ha Actualizado Su Perfil Correctamente'
            }
        });

    }).error(function(err) {
        res.render('index', {
            title: 'Bienvenido A SIDIPA',
            alert:{
                title: 'Operacion Inconclusa',
                msg: 'Ha Ocurrido Un Error, ' + err
            }
        });
    });
}


/**
 * Description
 * @method eliminar
 * @param {} req
 * @param {} res
 * @return 
 */
exports.eliminarUser = function(req, res){
    var model = getTable(req.session.user.role);
    var id = req.session.user.id;
    var pass = req.body.pass;

    getUserById(model,id,function(error,user){
        if(user.pass === pass){
            deleteUser(model,id,function(rowDeleted){
                if(rowDeleted >= 1){
                    delete req.session.user;
                    res.render("users/login",{
                        title:"Vuelve Pronto",
                        info:{
                            msg:"La Cuenta Ha Sido Eliminada",
                            title: "Operacion Realizada Correctamente: "
                        }});
                }
                else {
                    res.render("/",{
                        title:"Vuelve Pronto",
                        info:{
                            msg:"Verifique Los Datos Proporcionados Para Cancelar Su Cuenta",
                            title: "Operacion Incompleta : "
                        }});
                }
            }, function(err){
                res.send(err);
            });
        }
    });
}


/**
 * FUNCIONES Y PROCEDIMIENTOS PRIVADOS CONTROLADOR
 * /

 /*
 * @method getTable
 * @param {} role
 * @return table
 */
function getTable(role){
    table = null;
    switch (role){
        case 'estudiante':
            table = models.Estudiantes;
            break;
        case 'docente':
            table = models.Docentes;
            break;
    }
    return table;
}

/**
 * Description
 * @method getUserById
 * @param {} tabla
 * @param {} id
 * @param {} callback
 * @return 
 */
function getUserById(tabla, id,callback){
    if(tabla){
        tabla.findByPrimary(id).then(function(usuario){
            if(!usuario){
                callback('Usuario No Encontrado',null);
            }
            callback( null,usuario);
        });
    }
    else {
        callback('Modelo De Datos Nulo',null);
    }
};

function deleteUser(tabla,id, callback){
    if(tabla){
        tabla.destroy({
                where: {
                    id: id //this will be your id that you want to delete
                }
            }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
                if(rowDeleted === 1){
                    callback(1);
                }
                else {
                    callback(0);
                }
            }, function(err){
                console.log(err);
            });

    }
}

function verifiedUser(tabla, id, callback) {
    if (tabla) {
        tabla.findByPrimary(id).then(function (usuario) {
            if (!usuario) {
                callback(false);
            }
            callback(true);
        });
    }
    else {
        return null;
    }
};