const express = require('express');
const app = express();
const port = 3000;
const session = require('express-session');
const Sequilize = require('sequelize');
const sequelize = new Sequilize('drive', 'lera', 'Vv1542139', {
    dialect: 'mssql',
    host: 'localhost',
    port: '33678'
})

const Drivers = sequelize.define('drivers', {
    id: {
        type: Sequilize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequilize.STRING,
        allowNull: false
    },
    drivingExp: {
        type: Sequilize.INTEGER,
        allowNull: false
    }
})

const Cars = sequelize.define('cars', {
    id: {
        type: Sequilize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    model: {
        type: Sequilize.STRING,
        allowNull: false
    },
    driverId: {
        type: Sequilize.INTEGER,
        allowNull: false
    }
})

Drivers.hasMany(Cars, { foreignKey: 'driverId' });
Cars.belongsTo(Drivers, { foreignKey: 'driverId' });

// sequelize.sync({ force: true }).then(() => {
//     Drivers.create({
//         name: 'Lera',
//         drivingExp: 5
//     }).then(driver => {
//         Cars.create({
//             model: 'BMW',
//             driverId: driver.id
//         })
//     })
//     Drivers.create({
//         name: 'Vova',
//         drivingExp: 3
//     }).then(driver => {
//         Cars.create({
//             model: 'Audi',
//             driverId: driver.id
//         })
//     }
//     )
//     Drivers.create({
//         name: 'Vasya',
//         drivingExp: 1
//     }).then(driver => {
//         Cars.create({
//             model: 'Mercedes',
//             driverId: driver.id
//         })
//     }
//     )
//     Drivers.create({
//         name: 'Petya',
//         drivingExp: 2
//     }).then(driver => {
//         Cars.create({
//             model: 'Opel',
//             driverId: driver.id
//         })
//     }
//     )
// })


app.get('/:drivingExp', (req, res) => {
    if(!isNaN(req.params.drivingExp)) { 
        Cars.findAll({
            include: [{
                model: Drivers,
                where: {
                    drivingExp: {
                        [Sequilize.Op.lt]: +req.params.drivingExp
                    }
                }
            }]
        }).then(cars => {
            res.send(cars)
        })
    } else {
        res.send('Error')
    }
}
)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
