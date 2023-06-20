const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {
  getAll: async (req, res) => {
    try {
      const billDetails = await prisma.bill_details.findMany()
      res.render('bill_details.ejs', { title: 'Bill Details', data: billDetails, message: req.query.message })
    } catch (error) {
      console.log(error)
    }
  },
  getBillDetail: async (req, res) => {
    try {
      const { bill_id } = req.params
      const billDetail = await prisma.bill_details.findUnique({
        where: {
          bill_id: parseInt(bill_id)
        },
        include: {
          rents: true
        }
      })
      res.render('bill_detail.ejs', { title: 'Bill Detail', data: billDetail })
    } catch (error) {
      console.log(error)
    }
  },
  addBillDetail: async (req, res) => {
    try {
      const { rent_id, bill_date, total } = req.body
      const billDetail = await prisma.bill_details.create({
        data: {
          rent_id: parseInt(rent_id),
          bill_date: new Date(bill_date),
          total: parseInt(total)
        }
      })
      res.redirect('/billDetails/')
    } catch (error) {
      res.redirect('/billDetails?message=check rent id')
    }
  },
  updateBillDetail: async (req, res) => {
    try {
      const { bill_id, rent_id, bill_date, total } = req.body
      const billDetail = await prisma.bill_details.update({
        where: {
          bill_id: parseInt(bill_id)
        },
        data: {
          rent_id: parseInt(rent_id),
          bill_date: new Date(bill_date),
          total: parseInt(total)
        }
      })
      res.redirect('/billDetails')
    } catch (error) {
      res.redirect('/billDetails?message=bill detail not found')
    }
  },
  deleteBillDetail: async (req, res) => {
    try {
      const { bill_id } = req.body
      const billDetail = await prisma.bill_details.delete({
        where: {
          bill_id: parseInt(bill_id)
        }
      })
      res.redirect('/billDetails')
    } catch (error) {
      res.redirect('/billDetails?message=bill detail not found')
    }
  }
}
