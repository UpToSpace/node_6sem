const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

app.get('/:id', async (req, res) => {
    await prisma.User.create({
        data: {
            email: 'lera',
            name: '123'
        }
    })
    await prisma.User.create({
        data: {
            email: 'vova',
            name: '123'
        }
    })
    const user = await prisma.user.findUnique({
        where: {
            id: +req.params.id
        },
        select: {
            id: true,
            email: true
        }
    })
    res.send(user)
})

app.listen()