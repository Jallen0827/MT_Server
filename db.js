const Sequelize = require('sequelize')
const sequelize = new Sequelize('blueBadge', 'postgres', 'Soccer07!',
    {
        host:'localhost',
        dialect: 'postgres'
    })

sequelize.authenticate().then(
    function (){
        console.log('Connected to blueBadge postgress database')
    },
    function(err){
        console.log(err)
    }
)

module.exports = sequelize