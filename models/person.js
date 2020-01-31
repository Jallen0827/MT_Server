module.exports = (sequelize, DataTypes)=>{
    const Person = sequelize.define('person', {
        Name: {
            type: DataTypes.STRING,
        }
    })
    return Person;
}