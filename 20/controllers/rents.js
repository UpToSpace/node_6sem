const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {
  getAll: async (req, res) => {
    try {
      const rents = await prisma.rents.findMany({
        include: {
          apartments: true,
          clients: true,
          bill_details: true
        }
      })
      res.render('rents.ejs', { title: 'Rents', data: rents, message: req.query.message })
    } catch (error) {
      console.log(error)
    }
  },
  getRent: async (req, res) => {
    try {
      const { rent_id } = req.params
      const rent = await prisma.rents.findUnique({
        where: {
          rent_id: parseInt(rent_id)
        },
        include: {
          apartments: true,
          clients: true,
          bill_details: true
        }
      })
      res.render('rent.ejs', { title: 'Rent', data: rent })
    } catch (error) {
      console.log(error)
    }
  },
  addRent: async (req, res) => {
    try {
      const { apartment_id, status, date_begin, date_end, client_passport_number, type } = req.body
      const rent = await prisma.rents.create({
        data: {
          apartment_id: parseInt(apartment_id),
          status,
          date_begin: new Date(date_begin),
          date_end: new Date(date_end),
          client_passport_number,
          type
        },
        include: {
          apartments: true,
          clients: true,
          bill_details: true
        }
      })
      res.redirect('/rents/')
    } catch (error) {
      res.redirect('/rents?message=check your input data')
    }
  },
  updateRent: async (req, res) => {
    try {
      const { rent_id, apartment_id, status, date_begin, date_end, client_passport_number, type } = req.body
      const rent = await prisma.rents.update({
        where: {
          rent_id: parseInt(rent_id)
        },
        data: {
          apartment_id: parseInt(apartment_id),
          status,
          date_begin: new Date(date_begin),
          date_end: new Date(date_end),
          client_passport_number,
          type
        },
        include: {
          apartments: true,
          clients: true,
          bill_details: true
        }
      })
      res.redirect('/rents')
    } catch (error) {
      res.redirect('/rents?message=check your input data')
    }
  },
  deleteRent: async (req, res) => {
    try {
      const { rent_id } = req.body
      const rent = await prisma.rents.delete({
        where: {
          rent_id: parseInt(rent_id)
        }
      })
      res.redirect('/rents')
    } catch (error) {
      res.redirect('/rents?message=rent not found')
    }
  }
}
