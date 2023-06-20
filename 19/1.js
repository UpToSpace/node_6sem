const { PrismaClient } = require('@prisma/client')
var http = require('http');
var url = require('url');
var fs = require('fs');
const prisma = new PrismaClient()

let notFound = (res) => {
    res.writeHead(404);
    res.end();
}

let handler = (req, res) => {
    let parameter = url.parse(req.url).pathname.split('/')[3];
    if (req.method == 'GET') {
        switch (url.parse(req.url).pathname) {
            case '/': {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(fs.readFileSync('index.html'));
                break;
            }
            case '/api/pulpits/count':
                (async () => {
                    let count = await prisma.pULPIT.count();
                    res.end(count.toString());
                })()
                break;
            case '/api/faculties': {
                prisma.fACULTY.findMany().then(faculties => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(faculties));
                });
                break;
            }
            case '/api/pulpits': {
                let queryParameters = url.parse(req.url, true).query;
                if (queryParameters.page == undefined) {
                    prisma.pULPIT.findMany().then(pulpits => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(pulpits));
                    });
                } else {
                    (async () => {
                        let perPage = 10;
                        let count = await prisma.pULPIT.count();
                        const pulpits = await prisma.pULPIT.findMany({
                            skip: perPage * (queryParameters.page - 1),
                            take: Math.min(perPage, count - perPage * (queryParameters.page - 1)),
                            include: {
                                _count: {
                                    select: {
                                        TEACHER_TEACHER_PULPITToPULPIT: true
                                    }
                                }
                            }
                        })
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(pulpits));
                    })()
                }
                break;
            }
            case '/api/teachers': {
                prisma.tEACHER.findMany().then(teachers => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(teachers));
                });
                break;
            }
            case '/api/subjects': {
                prisma.sUBJECT.findMany().then(subjects => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(subjects));
                });
                break;
            }
            case '/api/auditoriumstypes': {
                prisma.aUDITORIUM_TYPE.findMany().then(auditorium_types => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(auditorium_types));
                });
                break;
            }
            case '/api/auditoriums': {
                prisma.aUDITORIUM.findMany().then(auditoriums => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(auditoriums));
                });
                break;
            }
            case `/api/faculties/${parameter}/subjects`: {
                parameter = decodeURI(parameter);
                prisma.fACULTY.findMany({
                    where: {
                        FACULTY: parameter
                    },
                    select: {
                        FACULTY: true,
                        PULPIT_PULPIT_FACULTYToFACULTY: {
                            select: {
                                PULPIT: true,
                                SUBJECT_SUBJECT_PULPITToPULPIT: {
                                    select: {
                                        SUBJECT_NAME: true
                                    }
                                }
                            }
                        }
                    }
                }).then(auditoriums => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(auditoriums));
                });
                break;
            }
            case `/api/auditoriumtypes/${parameter}/auditoriums`: {
                parameter = decodeURI(parameter);
                prisma.aUDITORIUM_TYPE.findMany({
                    where: {
                        AUDITORIUM_TYPE: parameter
                    },
                    select: {
                        AUDITORIUM_TYPE: true,
                        AUDITORIUM_AUDITORIUM_AUDITORIUM_TYPEToAUDITORIUM_TYPE: {
                            select: {
                                AUDITORIUM: true
                            }
                        }
                    }
                }).then(auditoriums => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(auditoriums));
                });
                break;
            }
            case `/api/auditoriumsWithComp1`: {
                prisma.aUDITORIUM.findMany({
                    where: {
                        AUDITORIUM_TYPE: 'ЛБ-К',
                        AUDITORIUM_NAME: {
                            contains: '-1'
                        }
                    }
                }).then(auditoriums => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(auditoriums));
                });
                break;
            }
            case `/api/puplitsWithoutTeachers`: {
                prisma.pULPIT.findMany({
                    where: {
                        TEACHER_TEACHER_PULPITToPULPIT: {
                            none: {}
                        }
                    }
                }).then(auditoriums => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(auditoriums));
                });
                break;
            }
            case `/api/pulpitsWithVladimir`: {
                prisma.pULPIT.findMany({
                    where: {
                        TEACHER_TEACHER_PULPITToPULPIT: {
                            some: {
                                TEACHER_NAME: {
                                    contains: 'Владимир'
                                }
                            }
                        }
                    }
                }).then(auditoriums => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(auditoriums));
                });
                break;
            }
            case `/api/auditoriumsSameCount`: {
                prisma.aUDITORIUM.groupBy({
                    by: ['AUDITORIUM_TYPE', 'AUDITORIUM_CAPACITY'],
                    _count: true

                }).then(auditoriums => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(auditoriums));
                });
                break;
            }
            default:
                notFound(res);
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

                    prisma.fACULTY.create({
                        data: {
                            FACULTY: o.faculty,
                            FACULTY_NAME: o.faculty_name,
                            PULPIT_PULPIT_FACULTYToFACULTY: {
                                create: o.pulpits
                            }
                        },
                        include: {
                            PULPIT_PULPIT_FACULTYToFACULTY: true,
                        },
                    }).then(
                        (task) => {
                            console.log(task);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"prisma.fACULTY":"${o.faculty}","prisma.fACULTY_name":"${o.faculty_name}"}`);
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
                    prisma.pULPIT.create({
                        data: {
                            PULPIT: o.pulpit,
                            PULPIT_NAME: o.pulpit_name,
                            FACULTY_PULPIT_FACULTYToFACULTY: {
                                connectOrCreate: {
                                    where: { FACULTY: o.faculty },
                                    create: {
                                        FACULTY: o.faculty,
                                        FACULTY_NAME: o.faculty_name,
                                    },
                                },
                            },
                        },
                    }).then(task => {
                        console.log(task);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(`{"prisma.pULPIT":"${o.pulpit}","prisma.pULPIT_name":"${o.pulpit_name}","prisma.fACULTY":"${o.faculty}"}`);
                    })
                        .catch(err => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в кафедру"}`);
                            console.log(err);
                        })
                })
                break;
            }
            case '/api/teachers': {
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    prisma.tEACHER.create({
                        data: {
                            TEACHER: o.teacher, TEACHER_NAME: o.teacher_name, PULPIT: o.pulpit
                        }
                    }).then
                        (task => {
                            console.log(task);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"prisma.tEACHER":"${o.teacher}","prisma.tEACHER_name":"${o.teacher_name}","prisma.pULPIT":"${o.pulpit}"}`);
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
                    prisma.sUBJECT.create({
                        data: {
                            SUBJECT: o.subject, SUBJECT_NAME: o.subject_name, PULPIT: o.pulpit
                        }
                    }).then
                        (task => {
                            console.log(task);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"prisma.sUBJECT":"${o.subject}","prisma.sUBJECT_name":"${o.subject_name}","prisma.pULPIT":"${o.pulpit}"}`);
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
                    prisma.aUDITORIUM_TYPE.create({ data: { AUDITORIUM_TYPE: o.auditorium_type, AUDITORIUM_TYPENAME: o.auditorium_typename } })
                        .then(task => {
                            console.log(task);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"Audtiorium_type":"${o.auditorium_type}","prisma.aUDITORIUM_TYPEname":"${o.auditorium_typename}"}`);
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
                    prisma.aUDITORIUM.create({
                        data: {
                            AUDITORIUM: o.auditorium, AUDITORIUM_NAME: o.auditorium_name,
                            AUDITORIUM_CAPACITY: o.auditorium_capacity, AUDITORIUM_TYPE: o.auditorium_type
                        }
                    }).then(task => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(`{"Auditorium":"${o.auditorium}","Auditorium_name":"${o.auditorium_name}","Auditorium_capacity":${o.auditorium_capacity}, "prisma.aUDITORIUM_TYPE":${o.auditorium_type}}`);
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
                    prisma.fACULTY.upsert(
                        {
                            where: {
                                FACULTY: o.faculty
                            },
                            update: {
                                FACULTY_NAME: o.faculty_name
                            },
                            create: {
                                FACULTY: o.faculty,
                                FACULTY_NAME: o.faculty_name
                            }
                        }
                    ).then(task => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(`{"prisma.fACULTY":"${o.faculty}","prisma.fACULTY_name":"${o.faculty_name}"}`);
                    })
                        .catch(err => {
                            console.log(err);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(err));
                        });
                })
                break;
            }
            case '/api/pulpits':
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', async () => {
                    const data = JSON.parse(body);
                    try {
                        const pulpit = await prisma.pULPIT.upsert({
                            where: { PULPIT: data.pulpit },
                            update: { PULPIT_NAME: data.pulpit_name },
                            create: {
                                PULPIT: data.pulpit,
                                PULPIT_NAME: data.pulpit_name,
                                FACULTY: data.faculty,
                            },
                        });
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(pulpit));
                    } catch (error) {
                        console.error(error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Server error' }));
                    }
                });
                break;
            case '/api/subjects':
                try {
                    let body = ''
                    req.on('data', chunk => {
                        body += chunk.toString()
                    })
                    req.on('end', async () => {
                        const data = JSON.parse(body)
                        const subject = await prisma.subject.upsert({
                            where: { SUBJECT: data.subject },
                            update: { SUBJECT_NAME: data.subject_name },
                            create: {
                                SUBJECT: data.subject,
                                SUBJECT_NAME: data.subject_name,
                                PULPIT: data.pulpit
                            }
                        })
                        res.status(200).json(subject)
                    })
                } catch (error) {
                    console.error(error)
                    res.status(500).json({ error: 'Internal Server Error' })
                }
                break;
            case '/api/teachers': {
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    prisma.teacher.upsert(
                        {
                            where: {
                                TEACHER: o.teacher
                            },
                            update: {
                                TEACHER_NAME: o.teacher_name,
                                PULPIT: o.pulpit
                            },
                            create: {
                                TEACHER: o.teacher,
                                TEACHER_NAME: o.teacher_name,
                                PULPIT: o.pulpit
                            }
                        }
                    ).then(task => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(`{"prisma.teacher":"${o.teacher}","prisma.teacher_name":"${o.teacher_name}","prisma.pulpit":"${o.pulpit}"}`);
                    })
                        .catch(err => {
                            console.log(err);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(err));
                        });
                });
            }
                break;
            case '/api/auditoriumstypes': {
                let body = '';
                req.on('data', (chunk) => {
                    body += chunk.toString();
                });
                req.on('end', async () => {
                    const { AUDITORIUM_TYPE, AUDITORIUM_TYPENAME } = JSON.parse(body);
                    try {
                        const createdAuditoriumType = await prisma.aUDITORIUM_TYPE.create({
                            data: {
                                AUDITORIUM_TYPE,
                                AUDITORIUM_TYPENAME,
                            },
                        });
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(createdAuditoriumType));
                    } catch (error) {
                        console.error(error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(error));
                    }
                });
            }
                break;
            case '/api/auditoriums': {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', async () => {
                    try {
                        const data = JSON.parse(body);
                        const result = await prisma.aUDITORIUM.upsert({
                            where: {
                                AUDITORIUM: data.auditorium
                            },
                            update: {
                                AUDITORIUM_NAME: data.auditorium_name,
                                AUDITORIUM_CAPACITY: data.auditorium_capacity,
                                AUDITORIUM_TYPE: data.auditorium_type
                            },
                            create: {
                                AUDITORIUM: data.auditorium,
                                AUDITORIUM_NAME: data.auditorium_name,
                                AUDITORIUM_CAPACITY: data.auditorium_capacity,
                                AUDITORIUM_TYPE: data.auditorium_type
                            }
                        });
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                    } catch (err) {
                        console.log(err);
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(err));
                    }
                });
            }
                break;
            default:
                notFound(res);
                break;
        }
    }
    if (req.method == 'DELETE') {
        console.log(url.parse(req.url).pathname);
        let key = url.parse(req.url).pathname;
        let parameter = key.split('/')[3];
        let body;
        switch (key) {
            case `/api/faculties/${parameter}`:
                parameter = decodeURI(parameter);
                body = '';
                prisma.fACULTY.findMany({
                    where: {
                        FACULTY: parameter
                    }
                })
                    .then(task => {
                        if (task.length > 0) {
                            prisma.fACULTY.delete({ where: { FACULTY: parameter } })
                                .then(task => {
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(`{"prisma.fACULTY":"${task.FACULTY}","prisma.fACULTY_name":"${task.FACULTY_NAME}"}"}`);
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify(err));
                                });
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"error":2,"message":"Такого кода факультета для обновления не существует"}`);
                        }
                    })
                break;
            case `/api/pulpits/${parameter}`:
                parameter = decodeURI(parameter);
                body = '';
                prisma.pULPIT.findMany({
                    where: {
                        PULPIT: parameter
                    }
                })
                    .then(task => {
                        if (task.length > 0) {
                            prisma.pULPIT.delete({ where: { PULPIT: parameter } })
                                .then(task => {
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(`{"prisma.pULPIT":"${task.PULPIT}","prisma.pULPIT_name":"${task.PULPIT_NAME}"}"}`);
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify(err));
                                });
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"error":2,"message":"Такого кода кафедры для обновления не существует"}`);
                        }
                    })
                break;
            case `/api/subjects/${parameter}`:
                parameter = decodeURI(parameter);
                body = '';
                prisma.sUBJECT.findMany({
                    where: {
                        SUBJECT: parameter
                    }
                })
                    .then(task => {
                        if (task.length > 0) {
                            prisma.sUBJECT.delete({ where: { SUBJECT: parameter } })
                                .then(task => {
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(`{"prisma.sUBJECT":"${task.SUBJECT}","prisma.sUBJECT_name":"${task.SUBJECT_NAME}"}"}`);
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify(err));
                                });
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"error":2,"message":"Такого кода предмета для обновления не существует"}`);
                        }
                    })
                break;
            case `/api/teachers/${parameter}`:
                parameter = decodeURI(parameter);
                body = '';
                prisma.tEACHER.findMany({
                    where: {
                        TEACHER: parameter
                    }
                })
                    .then(task => {
                        if (task.length > 0) {
                            prisma.tEACHER.delete({ where: { TEACHER: parameter } })
                                .then(task => {
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(`{"prisma.tEACHER":"${task.TEACHER}","prisma.tEACHER_name":"${task.TEACHER_NAME}"}"}`);
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify(err));
                                });
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"error":2,"message":"Такого кода преподавателя для обновления не существует"}`);
                        }
                    })
                break;
            case `/api/auditoriumstypes/${parameter}`:
                parameter = decodeURI(parameter);
                body = '';
                prisma.AUDITORIUM_TYPE.findMany({
                    where: {
                        AUDITORIUM_TYPE: parameter
                    }
                })
                    .then(task => {
                        if (task.length > 0) {
                            prisma.AUDITORIUM_TYPE.delete({ where: { AUDITORIUM_TYPE: parameter } })
                                .then(task => {
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(`{"prisma.AUDITORIUM_TYPE":"${task.AUDITORIUM_TYPE}","prisma.AUDITORIUM_TYPENAME":"${task.AUDITORIUM_TYPENAME}"}`);
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify(err));
                                });
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"error":2,"message":"Такого типа аудитории не существует"}`);
                        }
                    })
                break;
            case `/api/auditoriums/${parameter}`:
                parameter = decodeURI(parameter);
                body = '';
                prisma.AUDITORIUM.findMany({
                    where: {
                        AUDITORIUM: parameter
                    }
                })
                    .then(task => {
                        if (task.length > 0) {
                            prisma.AUDITORIUM.delete({ where: { AUDITORIUM: parameter } })
                                .then(task => {
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(`{"prisma.AUDITORIUM":"${task.AUDITORIUM}","prisma.AUDITORIUM_NAME":"${task.AUDITORIUM_NAME}"}`);
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify(err));
                                });
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"error":2,"message":"Такой аудитории не существует"}`);
                        }
                    })
                break;

            default:
                notFound(res);
                break;
        }
    }
}

http.createServer((req, res) => {
    handler(req, res);
}).listen(3000, () => {
    console.log('Server is running on port 3000');
});

