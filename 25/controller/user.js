const path = __dirname.split("\\");

const access = require("../security/defines").access;
const admin = require("../security/defines").admin;
path.pop(); // remove "controller" from path (path to "controller" folder)
const { PrismaClient } = require("@prisma/client");
const { User } = require("../security/roles");
const { entity } = require("../security/defines");
const { subject } = require("@casl/ability");
const prismaClient = new PrismaClient();

exports.listUsers = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        if (req.ability.can(admin.manage, admin.all)) {
          let users = await prismaClient.users.findMany({
            select: {
              id: true,
              username: true,
              email: true,
              role: true,
            },
          });
          res.status(200).json(users);
        } else return res.status(403).send("forbidden");
      } catch (err) {
        return res.status(500).send(`${err.message}`);
      }
      break;
    default:
      res.status(405).send("method not allowed");
  }
};

exports.infoByUserId = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        if (
          req.ability.can(
            access.read,
            subject(entity.users, { id: parseInt(req.params.id) }) // субъект с ид
          )
        ) {
          let user = await prismaClient.users.findUnique({
            where: {
              id: parseInt(req.params.id),
            },
            select: {
              id: true,
              username: true,
              email: true,
              role: true,
            },
          });
          res.status(200).json(user);
        } else {
          return res.status(403).send("forbidden");
        }
      } catch (err) {
        return res.status(500).send(`${err.message}`);
      }
      break;
    default:
      return res.status(405).send("method not allowed");
  }
};
