
/**
 * Description
 * @method exports
 * @param {} sequelize
 * @param {} DataTypes
 * @return CallExpression
 */
module.exports = function(sequelize, DataTypes){
    return sequelize.define(
        'simulacion', {
            id_simulacion: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            nombre: {
                type: DataTypes.STRING(70),
                allowNull: false
            },
            chat: {
                type: DataTypes.JSON,
                allowNull:false
            },
            simulacion: {
                type: DataTypes.JSON,
                allowNull: false
            },
            estado: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
    });
};


