module.exports = (sequelize, DataTypes) => {
    const awsFile = sequelize.define('awsFile', {
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title:{
            type: DataTypes.STRING,
            allowNull: false
        },
        owner_id: {
            type: DataTypes.INTEGER
        }
    })

    return awsFile;
}