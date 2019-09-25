module.exports = (sequelize, DataTypes)=>{
    const Task = sequelize.define('task', {
        task: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        owner:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    return Task;
}