/**
 * Created by Ricardo on 18/04/2016.
 * @method exports
 * @param {} sequelize
 * @param {} DataTypes
 * @return CallExpression
 */
module.exports = function(sequelize, DataTypes){
    return sequelize.define('estudiantes', {
            id: {
                type: DataTypes.STRING(10),
                primaryKey: true,
                allowNull: false
            },
            nombre : {
                type:DataTypes.STRING(70),
                allowNull:false,
            },
            pass : {
                type:DataTypes.STRING(60),
                allowNull:false,
            },
            nivel_estudio:{
                type:DataTypes.STRING(70),
                allowNull:false,
            },
            institucion:{
                type:DataTypes.STRING(70),
                allowNull:false,
            },
            programa:{
                type:DataTypes.STRING(70),
                allowNull:false,
            }
        }
    );
};
