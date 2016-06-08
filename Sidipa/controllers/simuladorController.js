/**
 * Created by Ricardo on 16/04/2016.
 */
var models = require('../models/models.js');

/**
 * Description
 * @method getSimulacionUser
 * @param {} req
 * @param {} res
 * @return 
 */
exports.getSimulacionUser= function(req, res){
    var user = req.params.usuario;
    models.Simulacion.findAll({
        where: {
            id_docente: user
        }
    }).then(function(response){
        res.send(response);
    });
}

/**
 * Description
 * @method getSimulacion
 * @param {} req
 * @param {} res
 * @return 
 */
exports.getSimulacion= function(req, res){
    var id = req.params.id;
    models.Simulacion.findByPrimary(id).then(function (response){
        if (response) {
            if (response.estado) {
                res.send({error:false, simulacion:[response]});
            }
            else if (!response.estado) {
                res.send({ error: false, simulacion: [] });
            }
        }
        else {
            res.send({ error: true, simulacion: [] });
        }
       
        
    });
}

/**
 * Description
 * @method runSimulacion
 * @param {} req
 * @param {} res
 * @return 
 */
exports.runSimulacion= function(req, res){
    var id = req.params.id;
    models.Simulacion.findByPrimary(id).then(function (simulacion) {
        if (simulacion){
            simulacion=simulacion.dataValues;
            models.Docentes.findByPrimary(simulacion.id_docente).then(function(docente){
                res.render('index', {
                    title:'SIDIPA | Onda Senoidal',
                    simulacion: new Simulacion(simulacion.id_simulacion,simulacion.nombre,docente.dataValues.nombre,simulacion.simulacion,simulacion.chat,simulacion.createdAt,simulacion.updatedAt, req.session.user.username, req.session.user.id).getStringJSON()
                });
            });
        }
        else{
            res.render('error', {message:'Simulacion No Reguistrada En Nuestra Base De Datos',error:{status:'404',stack:simulacion}});
        }
    })
}

/**
 * Description
 * @method findSimulacion
 * @param {} id
 * @param {} callback
 * @return 
 */
exports.findSimulacion= function(id, callback){
    models.Simulacion.findByPrimary(id).then(function(response){
        if (response) {
            //Sole Entorno Local
            //response.dataValues.chat = JSON.parse(response.dataValues.chat);
            //response.dataValues.simulacion = JSON.parse(response.dataValues.simulacion);
            //callback(response.dataValues);
            
            //solo Postgress SQL
            callback(response.dataValues); //solo postgressSql
        }
        else {
            callback([]);
        }
    });
}

/**
 * Description
 * @method saveChatSimulacion
 * @param {} id
 * @param {} chat
 * @param {} callback
 * @return 
 */
exports.updateSimulacion = function (id, data, callback) {
    var updateData = {};
    (data.nombre) ? updateData.nombre = data.nombre : null;
    (typeof data.estado === "boolean" ) ? updateData.estado = data.estado : null;
    (data.chat instanceof Array) ? updateData.chat = data.chat : null;
    (data.simulacion instanceof Object) ? updateData.simulacion = data.simulacion : null;
    
    models.Simulacion.update(
        updateData,
        {where: { id_simulacion : id }}
    ).then(function(response){
        (typeof callback =="function" ) ? callback(JSON.stringify(response)) : null;
    })
}



/**
 * Description
 * @method Simulacion
 * @param {} id
 * @param {} nombre
 * @param {} docente
 * @param {} datos
 * @param {} chat
 * @param {} creado
 * @param {} actualizado
 * @param {} user
 * @return 
 */
var Simulacion = function(id,nombre,docente,datos,chat,creado,actualizado,user, userId){
    this.id = id;
    this.nombre = nombre;
    this.docente =docente;
    //this.datos = JSON.parse(datos); //SOLO SQLlite DESARROLLO LOCAL
    //this.chat = JSON.parse(chat);
    this.datos = datos;// Solo pra PostgreSQL
    this.chat = chat;// Solo pra PostgreSQL
    this.created = creado;
    this.update = actualizado;
    this.user = user;
    this.userId = userId;
}

/**
 * Description
 * @method getStringJSON
 * @return CallExpression
 */
Simulacion.prototype.getStringJSON = function(){
    return JSON.stringify(this);
}

