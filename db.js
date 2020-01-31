const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL,
    {
        dialect: 'postgres'
    })

sequelize.authenticate().then(
    function (){
        console.log(`Connected to ${process.env.NAME} postgress database`)
    },
    function(err){
        console.log(err)
    }
)

Person = sequelize.import('./models/person')
Videos = sequelize.import('./models/videos')
Comments = sequelize.import('./models/comments')

Videos.belongsTo(Person)
Person.hasMany(Videos)

Comments.belongsTo(Person)
Person.hasMany(Comments)

module.exports = sequelize