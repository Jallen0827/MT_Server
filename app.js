require('dotenv').config()

let express = require('express')
let app = express()
let File = require('./controllers/filesController')
let User = require('./controllers/userController')
let sequelize= require('./db')

sequelize.sync()
app.use(express.json())
app.use(require('./middleware/headers'))

app.use('/user', User)

app.use(require('./middleware/validate-session'))
app.use('/file', File)

app.listen(3000, function(){
    console.log('App is listening on 3000... Hopefully')
})