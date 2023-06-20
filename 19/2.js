const { PrismaClient } = require('@prisma/client')
var http = require('http');
var url = require('url');
var fs = require('fs');
const prisma = new PrismaClient()

let fluentAPI = async () => {
    let teacherISIT = await prisma.fACULTY.findFirst({
        where: {
            FACULTY: "ИДиП"
        }
    })
    .PULPIT_PULPIT_FACULTYToFACULTY()
    console.log(teacherISIT);
}

let transaction = async () => {
    try {
        await prisma.$transaction(async (prisma) => {
            await prisma.aUDITORIUM.updateMany({
                data: {
                    AUDITORIUM_CAPACITY: {
                        increment: 100
                    }
                }
            })
            let auditorium = await prisma.aUDITORIUM.findMany();
            console.log(auditorium[0]);
            throw new Error("Oops, rollback")
        })

    } catch (error) {
        console.log(error);
        let auditorium = await prisma.aUDITORIUM.findMany();
        console.log(auditorium[0])
    }
}

//fluentAPI();
transaction();