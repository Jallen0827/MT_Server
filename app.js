require('dotenv').config()

let express = require('express')
let app = express()
let User = require('./controllers/userController')
let File = require('./controllers/filesController')
let Person = require('./controllers/personController')
let Comments = require('./controllers/commentsController')
let sequelize= require('./db')

sequelize.sync()
app.use(express.json())

app.get('/*', (req, res) => {
    let url = path.join(__dirname, '../client/build', 'index.html');
    if (!url.startsWith('/app/')) // we're on local windows
      url = url.substring(1);
    res.sendFile(url);
  });

app.use(require('./middleware/headers'))
app.use('/user', User)

// app.use(require('./middleware/validate-session'))
app.use('/file', File)
app.use('/person', Person)
app.use('/comments', Comments)

app.listen(process.env.PORT, ()=>{
    console.log(`App is listening on ${process.env.PORT}... Hopefully`)
})