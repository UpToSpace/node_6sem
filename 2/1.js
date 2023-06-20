const Sequelize = require('sequelize');
var http = require('http');
var url = require('url');
var fs = require('fs');

let options = {
    host: 'localhost',
    port: '1433',
    dialect: 'mssql',
    pool: { max: 10, min: 0, acquire: 3000, idle: 1000 }
}

let sequelize = new Sequelize(
    'BSTU',
    'lera',
    'Vv1542139',
    options
);

let { Faculty, Pulpit, Teacher, Subject, Auditorium_type, Auditorium } = require('./models.js')(sequelize);

let notFound = (res) => {
    res.writeHead(404);
    res.end();
}

let handler = (req, res) => {
    if (req.method == 'GET') {
        switch (url.parse(req.url).pathname) {
            case '/': {
                let html = fs.readFileSync('./index.html');
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(html);
                break;
            }
            case '/api/faculties': {
                Faculty.findAll().then(faculties => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(faculties));
                });
                break;
            }
            case '/api/pulpits': {
                Pulpit.findAll().then(pulpits => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(pulpits));
                });
                break;
            }
            case '/api/teachers': {
                Teacher.findAll().then(teachers => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(teachers));
                });
                break;
            }
            case '/api/subjects': {
                Subject.findAll().then(subjects => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(subjects));
                });
                break;
            }
            case '/api/auditoriumstypes': {
                Auditorium_type.findAll().then(auditorium_types => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(auditorium_types));
                });
                break;
            }
            case '/api/auditoriums': {
                Auditorium.findAll().then(auditoriums => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(auditoriums));
                });
                break;
            }
            default:
                if (url.parse(req.url).pathname.search('\/api\/faculties\/[%-я]+\/subjects') != (-1)) {
                    Faculty.findAll({
                        where: { faculty: decodeURI(url.parse(req.url).pathname.split('/')[3]) },
                        include: [
                            {
                                model: Pulpit,
                                required: true,
                                include: [
                                    {
                                        model: Subject,
                                        required: true,
                                    },
                                ],
                            },
                        ],
                    })
                        .then(subjects => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(subjects));
                        });
                } else if (url.parse(req.url).pathname.search('\/api\/auditoriumtypes\/[%-я]+\/auditoriums') != (-1)) {
                    Auditorium.findAll({
                        where: { auditorium_type: decodeURI(url.parse(req.url).pathname.split('/')[3]) },
                        include: [
                            {
                                model: Auditorium_type,
                                required: true
                            },
                        ],
                    }).then(auditoriums => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(auditoriums));
                    });
                } else{
                    notFound(res);
                }
                break;
        }
    }
    if (req.method == 'POST') {
        switch (url.parse(req.url).pathname) {
            case '/api/faculties': {
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    let o = JSON.parse(body);

                    Faculty.create({ faculty: o.faculty, faculty_name: o.faculty_name }).then(
                        (task) => {
                            console.log(task);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"Faculty":"${o.faculty}","Faculty_name":"${o.faculty_name}"}`);
                        }
                    ).catch(err => {
                        console.log(err);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в факультет"}`);
                    });
                });
                break;
            }
            case '/api/pulpits': {
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    Pulpit.create({ pulpit: o.pulpit, pulpit_name: o.pulpit_name, faculty: o.faculty }).then
                        (task => {
                            console.log(task);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"Pulpit":"${o.pulpit}","Pulpit_name":"${o.pulpit_name}","Faculty":"${o.faculty}"}`);
                        })
                        .catch(err => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в кафедру"}`);
                            console.log(err);
                        })
                });
                break;
            }
            case '/api/teachers': {
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    Teacher.create({ teacher: o.teacher, teacher_name: o.teacher_name, pulpit: o.pulpit }).then
                        (task => {
                            console.log(task);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"Teacher":"${o.teacher}","Teacher_name":"${o.teacher_name}","Pulpit":"${o.pulpit}"}`);
                        })
                        .catch(err => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в преподавателей"}`);
                            console.log(err);
                        })
                });
                break;
            }
            case '/api/subjects': {
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', async () => {
                    let o = JSON.parse(body);
                    Subject.create({ subject: o.subject, subject_name: o.subject_name, pulpit: o.pulpit }).then
                        (task => {
                            console.log(task);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"Subject":"${o.subject}","Subject_name":"${o.subject_name}","Pulpit":"${o.pulpit}"}`);
                        })
                        .catch(err => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в предмет"}`);
                            console.log(err);
                        })
                });
                break;
            }
            case '/api/auditoriumstypes': {
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    Auditorium_type.create({ auditorium_type: o.auditorium_type, auditorium_typename: o.auditorium_typename })
                        .then(task => {
                            console.log(task);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"Audtiorium_type":"${o.auditorium_type}","Auditorium_typename":"${o.auditorium_typename}"}`);
                        })
                        .catch(err => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в тип аудитории"}`);
                            console.log(err);
                        })
                });
                break;
            }
            case '/api/auditoriums': {
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    Auditorium.create({
                        auditorium: o.auditorium, auditorium_name: o.auditorium_name,
                        auditorium_capacity: o.auditorium_capacity, auditorium_type: o.auditorium_type
                    }).then(task => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(`{"Auditorium":"${o.auditorium}","Auditorium_name":"${o.auditorium_name}","Auditorium_capacity":${o.auditorium_capacity}, "Auditorium_type":${o.auditorium_type}}`);
                        console.log(task);
                    }).catch(err => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в аудиторию"}`);
                        console.log(err);
                    })

                });
                break;
            }
            default:
                notFound(res);
                break;
        }
    }
    if (req.method == 'PUT') {
        switch (url.parse(req.url).pathname) {
            case '/api/faculties': {
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    Faculty.update(
                        { faculty_name: o.faculty_name },
                        { where: { faculty: o.faculty } }
                    ).then(task => {
                        console.log(task);
                        if (task > 0) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"Faculty":"${o.faculty}","Faculty_name":"${o.faculty_name}"}`);
                        }
                        else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"error":2,"message":"Такого кода факультета для обновления не существует"}`);
                        }
                    })
                        .catch(err => {
                            console.log(err);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(err));
                        });
                });
                break;
            }
            case '/api/pulpits': {
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    Pulpit.update(
                        {
                            pulpit_name: o.pulpit_name,
                            faculty: o.faculty
                        },
                        { where: { pulpit: o.pulpit } }
                    ).then(task => {
                        console.log(task);
                        if (task > 0) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"Pulpit":"${o.pulpit}","Pulpit_name":"${o.pulpit_name}","Faculty":"${o.faculty}"}`);
                        }
                        else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"error":2,"message":"Такого кода кафедры для обновления не существует"}`);
                        }
                    })
                        .catch(err => {
                            console.log(err);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(err));
                        })
                });
                break;
            }
            case '/api/teachers': {
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    Teacher.update(
                        {
                            teacher_name: o.teacher_name,
                            pulpit: o.pulpit
                        },
                        { where: { teacher: o.teacher } }
                    ).then(task => {
                        console.log(task);
                        if (task > 0) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"Teacher":"${o.teacher}","Teacher_name":"${o.teacher_name}","Pulpit":"${o.pulpit}"}`);
                        }
                        else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"error":2,"message":"Такого кода преподавателя для обновления не существует"}`);
                        }
                    })
                        .catch(err => {
                            console.log(err);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(err));
                        })
                });
                break;
            }
            case '/api/subjects': {
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    Subject.update(
                        {
                            subject_name: o.subject_name,
                            pulpit: o.pulpit
                        },
                        { where: { subject: o.subject } }
                    )
                        .then(task => {
                            console.log(task);
                            if (task > 0) {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"Subject":"${o.subject}","Subject_name":"${o.subject_name}","Pulpit":"${o.pulpit}"}`);
                            }
                            else {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"error":2,"message":"Такого предмета для обновления не существует"}`);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(err));
                        });
                });
                break;
            }
            case '/api/auditoriumstypes': {
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    Auditorium_type.update(
                        { auditorium_typename: o.auditorium_typename },
                        { where: { auditorium_type: o.auditorium_type } }
                    )
                        .then(task => {
                            console.log(task);
                            if (task > 0) {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"Audtiorium_type":"${o.auditorium_type}","Auditorium_typename":"${o.auditorium_typename}"}`);
                            }
                            else {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"error":2,"message":"Такого типа аудитории для обновления не существует"}`);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(err));
                        });
                });
                break;
            }
            case '/api/auditoriums': {
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    Auditorium.update(
                        {
                            auditorium_name: o.auditorium_name,
                            auditorium_capacity: o.auditorium_capacity,
                            auditorium_type: o.auditorium_type
                        },
                        { where: { auditorium: o.auditorium } }
                    )
                        .then(task => {
                            console.log(task);
                            if (task > 0) {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"Auditorium":"${o.auditorium}","Auditorium_name":"${o.auditorium_name}","Auditorium_capacity":${o.auditorium_capacity}, "Auditorium_type":${o.auditorium_type}}`);
                            }
                            else {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"error":2,"message":"Такой аудитории для обновления не существует"}`);
                            }
                        })
                        .catch(err => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(err));
                            console.log(err);
                        });
                });
                break;
            }
            default:
                notFound(res);
                break;
        }
    }
    if (req.method == 'DELETE') {
        console.log(url.parse(req.url).pathname);
        if (url.parse(req.url).pathname.search('\/api\/faculties\/[%-я]+') != (-1)) {
            let p = url.parse(req.url, true);
            let r = decodeURI(p.pathname).split('/');
            let o = r[3];
            sequelize.query("SELECT FACULTY,FACULTY_NAME FROM FACULTY where FACULTY='" + o + "'")
                .then(result => {
                    Faculty.destroy({ where: { faculty: o } }).then(task => {
                        console.log(task);
                        if (task > 0) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"Faculty":"${result[0][0].FACULTY}","Faculty_name":"${result[0][0].FACULTY_NAME}"}`);
                        }
                        else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"error":"1","messsage":"Такого факультета для удаления не существует"}`);
                        }
                    })
                        .catch(err => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(err));
                        });
                });
        }
        else if (url.parse(req.url).pathname.search('\/api\/pulpits\/[%-я]+') != (-1)) {
            let p = url.parse(req.url, true);
            let r = decodeURI(p.pathname).split('/');
            let o = r[3];
            sequelize.query("SELECT PULPIT,PULPIT_NAME,FACULTY FROM PULPIT where PULPIT='" + o + "'")
                .then(result => {
                    Pulpit.destroy({ where: { pulpit: o } })
                        .then(task => {
                            console.log(task);
                            if (task > 0) {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"Pulpit":"${result[0][0].PULPIT}","Pulpit_name":"${result[0][0].PULPIT_NAME}","Faculty":"${result[0][0].FACULTY}"}`);
                            }
                            else {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"error":"1","messsage":"Такого кода кафедры для удаления не существует"}`);
                            }
                        })
                        .catch(err => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(err));
                        });
                });
        }
        else if (url.parse(req.url).pathname.search('\/api\/teachers\/[%-я]+') != (-1)) {
            let p = url.parse(req.url, true);
            let r = decodeURI(p.pathname).split('/');
            let o = r[3];
            sequelize.query("SELECT TEACHER,TEACHER_NAME,PULPIT FROM TEACHER where TEACHER='" + o + "'")
                .then(result => {
                    Teacher.destroy({ where: { teacher: o } })
                        .then(task => {
                            console.log(task);
                            if (task > 0) {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"Teacher":"${result[0][0].TEACHER}","Teacher_name":"${result[0][0].TEACHER_NAME}","Pulpit":"${result[0][0].PULPIT}"}`);
                            }
                            else {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"error":"1","messsage":"Такого кода преподавателя для удаления не существует"}`);
                            }
                        })
                        .catch(err => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(err));
                        });
                });
        }
        else if (url.parse(req.url).pathname.search('\/api\/subjects\/[%-я]+') != (-1)) {
            let p = url.parse(req.url, true);
            let r = decodeURI(p.pathname).split('/');
            let o = r[3];
            sequelize.query("SELECT SUBJECT,SUBJECT_NAME,PULPIT FROM SUBJECT where SUBJECT='" + o + "'")
                .then(result => {
                    Subject.destroy({ where: { subject: o } })
                        .then(task => {
                            if (task > 0) {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"Subject":"${result[0][0].SUBJECT}","Subject_name":"${result[0][0].SUBJECT_NAME}","Pulpit":"${result[0][0].PULPIT}"}`);
                            }
                            else {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"error":"1","messsage":"Такого предмета для удаления не существует"}`);
                            }
                        })
                        .catch(err => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(err));
                        });
                });
        }
        else if (url.parse(req.url).pathname.search('\/api\/auditoriumstypes\/[%-я]+') != (-1)) {
            let p = url.parse(req.url, true);
            let r = decodeURI(p.pathname).split('/');
            let o = r[3];
            sequelize.query("SELECT AUDITORIUM_TYPE,AUDITORIUM_TYPENAME FROM AUDITORIUM_TYPE where AUDITORIUM_TYPE='" + o + "'")
                .then(result => {
                    Auditorium_type.destroy({ where: { auditorium_type: o } })
                        .then(task => {
                            if (task > 0) {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"Audtiorium_type":"${result[0][0].AUDITORIUM_TYPE}","Auditorium_typename":"${result[0][0].AUDITORIUM_TYPENAME}"}`);
                            }
                            else {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"error":1,"message":"Такого типа аудитории для удаления не существует"}`);
                            }
                        })
                        .catch(err => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(err));
                        });
                });
        }
        else if (url.parse(req.url).pathname.search('\/api\/auditoriums\/[%-я]+') != (-1)) {
            let p = url.parse(req.url, true);
            let r = decodeURI(p.pathname).split('/');
            let o = r[3];
            sequelize.query("SELECT AUDITORIUM,AUDITORIUM_NAME,AUDITORIUM_CAPACITY,AUDITORIUM_TYPE FROM AUDITORIUM where AUDITORIUM='" + o + "'")
                .then(result => {
                    Auditorium.destroy({ where: { auditorium: o } })
                        .then(task => {
                            console.log(task);
                            if (task > 0) {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"Auditorium":"${result[0][0].AUDITORIUM}","Auditorium_name":"${result[0][0].AUDITORIUM_NAME}","Auditorium_capacity":${result[0][0].AUDITORIUM_CAPACITY}, "Auditorium_type":${result[0][0].AUDITORIUM_TYPE}}`);
                            }
                            else {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"error":1,"message":"Такой аудитории для удаления не существует"}`);
                            }
                        })
                        .catch(err => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(err));
                        });
                });
        }
        else {
            notFound(res);
        }
    }
}

http.createServer((req, res) => {
    sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');
        handler(req, res);
    }).catch(err => {
        console.error('Unable to connect to the database:', err);
    });
}).listen(3000, () => {
    console.log('Server is running on port 3000');
});

