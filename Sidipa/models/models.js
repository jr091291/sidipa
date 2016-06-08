var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var DATABASE_URL = process.env.DATABASE_URL || "sqlite://:@:/";
var url = DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);

var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE || "sidipa.sqlite";

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
	{ dialect:  protocol,
		protocol: protocol,
		port:     port,
		host:     host,
		storage:  storage,  // solo SQLite (.env)
		omitNull: true      // solo Postgres
	}
);


// Importar definicion de la tabla Usuarios
var pathEst = path.join(__dirname,'estudiantes');
var Estudiantes = sequelize.import(pathEst);


var pathDoc = path.join(__dirname,'docentes');
var Docentes = sequelize.import(pathDoc);


var pathSim = path.join(__dirname,'simulacion');
var Simulacion = sequelize.import(pathSim);

/*Relaciones*/

// 1 estudiante Participa en Muchas Simulaciones, 1 Simulacion Participan Muchos Estudiantes
Estudiantes.belongsToMany(Simulacion, {  through: 'estudiantes_simulacion', foreignKey: 'id_estudiante' });
Simulacion.belongsToMany(Estudiantes, {  through: 'estudiantes_simulacion', foreignKey: 'id_simulacion' });

//1 docente crea muchas simulaciones, 1 simulacion es creada por un docente
Docentes.hasMany(Simulacion,{foreignKey: 'id_docente' });

/*Export Tablas*/

exports.Estudiantes = Estudiantes;
exports.Docentes = Docentes;
exports.Simulacion = Simulacion;
exports.db = sequelize;

sequelize.sync().then(function() {
	// then(..) ejecuta el manejador una vez creada la tabla
    Docentes.count().then(function (count){
		if(!count) {   // la tabla se inicializa solo si está vacía
			Docentes.create({
				id: '1014229261',
				nombre : 'Jose Ricardo Pedraza',
				pass : '123456',
				nivel_estudio:'Bachiller',
				institucion:'Upc',
				programa:'Ing Sistemas'
			}).then(function(usuario) {
				Simulacion.create({
					nombre:'Default',
					chat: [{mensaje:'Hola Bienvenido a SIDIPA, El simulador Distribuido de Ondas Senoidales',user:'SIDIPA'}],
					simulacion: {"onda":{"amplitud":100,"frecuencia":1,"fase":180},"param":{"velocidad":2000,"num_periodos":1,"grosor_linea":2,"color_linea":"red"}},
					id_docente: usuario.id
				}).then(function(simulacion){
					if(simulacion){
                        console.log('DataBase Inicializada ');
                    }
				});
			});
		};
	});
});

/*Metodos Y Funciones*/



