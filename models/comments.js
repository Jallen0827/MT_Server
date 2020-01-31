module.exports = (sequelize, DataTypes)=>{
    const Comments = sequelize.define('comment', {
        comment: {
            type: DataTypes.TEXT,
        }
    })
    return Comments;
}