const { PrismaClient } = require( '@prisma/client');
const prisma = new PrismaClient();

 const checkUser = async (login, password) => {

 return  await prisma.user.findFirst({
        where : {
            username: login,
            password: password
        }
    });
};
const getUser = async (login) => {
    const user =  await prisma.user.findFirst({
        where : {
            username: login,
        }
    })
    return user
};

 const createUser = async (login, password) => {
  
   const user = await prisma.user.create(
    {
        data:
        {
            username:login,
            password:password
        }
    }
   )


};

const CheckById = async (id)=>
{
    const user = await prisma.user.findFirst(
        {
            where:
            { 
                id: id
            }
        }
    )
    return user;
}

module.exports={checkUser,getUser,createUser,CheckById}