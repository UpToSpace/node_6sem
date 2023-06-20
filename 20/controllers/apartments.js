const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {
    getAll: async (req, res) => {
        const apartments = await prisma.apartments.findMany()
        res.render('apartments.ejs', { title: 'Apartments', data: apartments, message: req.query.message })
    },
    getApartment: async (req, res) => {
        try {
            const { apartment_id } = req.params
            const apartment = await prisma.apartments.findUnique({
                where: {
                    apartment_id: parseInt(apartment_id)
                }
            })
            res.render('apartment.ejs', { title: 'Apartment', data: apartment })
        } catch (error) {
            console.log(error)
        }
    },
    addApartment: async (req, res) => {
        try {
            const { city, street, house_number, room_number, day_cost } = req.body
            const apartment = await prisma.apartments.create({
                data: {
                    city,
                    street,
                    house_number: parseInt(house_number),
                    room_number: parseInt(room_number),
                    day_cost: parseInt(day_cost)
                }
            })
            res.redirect('/apartments/')
        } catch (error) {
            res.redirect('/apartments?message=Apartment already exists')
        }
    },
    updateApartment: async (req, res) => {
        try {
            const { apartment_id, city, street, house_number, room_number, day_cost } = req.body
            const apartment = await prisma.apartments.update({
                where: {
                    apartment_id: parseInt(apartment_id)
                },
                data: {
                    city,
                    street,
                    house_number: parseInt(house_number),
                    room_number: parseInt(room_number),
                    day_cost: parseInt(day_cost)
                }
            })
            res.redirect('/apartments')
        } catch (error) {
            res.redirect('/apartments?message=Apartment does not exist')
        }
    },
    deleteApartment: async (req, res) => {
        try {
            const { apartment_id } = req.body
            const apartment = await prisma.apartments.delete({
                where: {
                    apartment_id: parseInt(apartment_id)
                }
            })
            res.redirect('/apartments')
        } catch (error) {
            res.redirect('/apartments?message=Apartment does not exist')
        }
    }
}
