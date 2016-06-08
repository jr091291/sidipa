var express = require('express');
var router = express.Router();

/*Importamos Controlador*/
var sessionController = require('../controllers/sessionController');
var usuariosController = require('../controllers/users/usuariosController');
var simuladorController = require('../controllers/simuladorController');

/*
 * GET home page.
 */
router.get('/', sessionController.loginRequired,
    function(req,res) {
            res.redirect('/simulacion/run/'+ req.session.user.simulacion);
    }
);


/*
* RUTAS SIMULACION
*/
/*Services */
router.get('/simulacion/:usuario',  simuladorController.getSimulacionUser);
router.get('/simulacion/show/:id',  simuladorController.getSimulacion);

/*Controlers*/
router.get('/simulacion/run/:id', sessionController.loginRequired, simuladorController.runSimulacion);

/*
* Routes Session
*/
router.get('/login',  sessionController.getLogin);
router.post('/login', sessionController.login);
router.get('/logout', sessionController.loginRequired,sessionController.logout);


/*
* Routes de usuario
*/
router.get('/usuarios/registro',          usuariosController.getRegistrar);
router.get('/usuarios/editar',            sessionController.loginRequired,usuariosController.getEditar);
router.post('/usuarios/eliminar'        ,  sessionController.loginRequired,usuariosController.eliminarUser);



router.post('/usuarios/registro',          usuariosController.registrar);
router.put('/usuarios/editar/:role/:id',   sessionController.loginRequired,usuariosController.editar);
//router.delete('/usuarios/eliminar/:role/:id',sessionController.loginRequired,usuariosController.eliminar)


module.exports = router;