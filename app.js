const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const path = require('path')
const db = require('./db/connection')
const bodyParser = require('body-parser')
const Job = require('./models/Job')

const PORTA = 3000

app.listen(PORTA, '0.0.0.0', function() {
    console.log(`O express está rodando na porta ${PORTA}`)
})

//body parser
app.use(bodyParser.urlencoded({extended: false}))

//handle bars
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', exphbs.engine({defaultLayout: 'main', extname:'hbs'}))
app.set('view engine', 'hbs')
app.set('views', './views')

//static folder
app.use(express.static(path.join(__dirname, 'public')))

//conexão do banco

db
    .authenticate()
    .then(() => {
        console.log('Conectou ao banco com sucesso!')
    })
    .catch(err => {
        console.log('Ocorreu um erro ao conectar', err)
    })

//rotas
app.get('/', (req, res) => {
    
    Job.findAll({order: [
        ['createdAt', 'DESC']
    ]})
    .then(jobs => {

        res.render('index', {
            jobs
        })
    })
})

//rotas do job
app.use('/jobs', require('./routes/jobs'))