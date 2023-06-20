const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const methodOverride = require('method-override')

const app = express()
const clientsRoutes = require('./routes/clients.js')
const apartmentsRoutes = require('./routes/apartments.js')
const billDetailsRoutes = require('./routes/bill_details.js')
const rentsRoutes = require('./routes/rents.js')

app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))
//app.use(express())
app.use(bodyParser.urlencoded({
    extended: false
 }));
 
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' })
})

app.use('/', clientsRoutes);
app.use('/', apartmentsRoutes);
app.use('/', billDetailsRoutes);
app.use('/', rentsRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
})