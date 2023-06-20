const Sequelize = require('sequelize');

let options = {
    host: 'localhost',
    port: '1433',
    dialect: 'mssql',
    pool: { max: 10, min: 0, acquire: 3000, idle: 1000 },
    define: {
        hooks: {
            beforeBulkDestroy: () => {
                console.log('beforeBulkDestroy hook work');
            }
        }
    }
}

let sequelize = new Sequelize(
    'BSTU',
    'lera',
    'Vv1542139',
    options
);

let { Faculty, Pulpit, Teacher, Subject, Auditorium_type, Auditorium } = require('./models.js')(sequelize);

sequelize.authenticate()
    .then(async () => {
        console.log('Connection has been established successfully.');
        let auditoriums = await Auditorium.scope('auditoriumScope').findAll();
        console.log(auditoriums.length); 
        auditoriums.forEach(auditorium => {
            console.log(auditorium.auditorium_name);
        });

        await sequelize.addHook('beforeDestroy', () => {
            console.log('beforeDestroy hook work');
        })

        await Faculty.create({ faculty: 'fac', faculty_name: 'facname' });
        await Faculty.destroy({ where: { faculty: 'fac' } })
    })
    .then(() => {
        return sequelize.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED})
            .then(t => {
                Auditorium.update({ auditorium_capacity: 0}, { where: {}, transaction: t })
                .then(() => {
                    console.log('Transaction. Auditorums 0 now');
                    setTimeout(async () => {
                        await t.rollback();
                        console.log('Transaction has been rolled back');
                    }, 10 * 1000);
                })
                .catch(async err => {
                    await t.rollback();
                    console.log('Transaction has been rolled back because of error' + err);
                })
            })
    })
