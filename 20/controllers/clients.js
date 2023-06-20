const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {
    getAll: async (req, res) => {
        try {
            const clients = await prisma.clients.findMany()
            res.render('clients.ejs', { title: 'Clients', data: clients, message: req.query.message })
        } catch (error) {
            console.log(error)
        }
    },
    getClient: async (req, res) => {
        try {
            const { passport_number } = req.params
            const client = await prisma.clients.findUnique({
                where: {
                    passport_number
                }
            })
            res.render('client.ejs', { title: 'Client', data: client })
        } catch (error) {
            console.log(error)       
        }
    },
    addClient: async (req, res) => {
        try {
            const { passport_number, surname, name } = req.body
            const client = await prisma.clients.create({
                data: {
                    passport_number,
                    surname,
                    name
                }
            })
            res.redirect('/clients/')
        } catch (error) {
            res.redirect('/clients?message=Client already exists')
        }
    },
    updateClient: async (req, res) => {
        try {
            const { passport_number, surname, name } = req.body
            const client = await prisma.clients.update({
                where: {
                    passport_number
                },
                data: {
                    surname,
                    name
                }
            })
            res.redirect('/clients')
        } catch (error) {
            res.redirect('/clients?message=Client does not exist')
        }
    },
    deleteClient: async (req, res) => {
        try {
            const { passport_number } = req.body
            const client = await prisma.clients.delete({
                where: {
                    passport_number
                }
            })
            res.redirect('/clients')
        } catch (error) {
            res.redirect('/clients?message=Client does not exist')
        }
    }
}