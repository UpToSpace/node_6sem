const { PrismaClient } = require("@prisma/client");
const prismaClient = new PrismaClient();

const { repos } = require("./repos");
const { subject } = require("@casl/ability");
const access = require("../security/defines").access;
const admin = require("../security/defines").admin;
const entity = require("../security/defines").entity;

exports.commits = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        if (req.ability.can(access.read, entity.commits)) {
          prismaClient.commits
            .findMany({
              where: {
                repoId: parseInt(req.params.id),
              },
            })
            .then((result) => {
              res.status(200).json(result);
            });
        } else {
          return res.status(403).send("forbidden");
        }
      } catch (err) {
        return res.status(500).send(`${err.message}`);
      }
      break;
    case "POST":
      try {
        const repoId = Number(req.params.id);
        const repo = await prismaClient.repos.findFirst({
          where: {
            id: repoId,
          },
        });
        if (!repo) {
          return res.status(404).send("not found");
        }
        if (
          !req.ability.can(
            access.create,
            subject(entity.commits, { authorId: repo.authorId })
          )
        ) {
          return res.status(403).send("forbidden");
        }
        const createdCommit = await prismaClient.commits.create({
          data: {
            message: req.body.message,
            repos: {
              connect: {
                id: repo.id,
              },
            },
          },
        });
        res.status(200).json(createdCommit);
      } catch (err) {
        return res.status(500).send(`${err.message}`);
      }
      break;
    default:
      return res.status(405).send("method not allowed");
  }
};

exports.commitsById = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        if (req.ability.can(access.read, entity.commits)) {
          prismaClient.commits
            .findUnique({
              where: {
                id: Number.parseInt(req.params.commitId),
              },
            })
            .then((result) => {
              res.status(200).json(result);
            });
        } else {
          return res.status(403).send("forbidden");
        }
      } catch (err) {
        return res.status(500).send(`${err.message}`);
      }
      break;
    case "PUT":
      try {
        if (req.ability.can(access.read, entity.repos)) {
          let repos = await prismaClient.repos.findUnique({
            where: {
              id: parseInt(req.params.id),
            },
          });
          const commit = await prismaClient.commits.findFirst({
            where: {
              AND: [
                {
                  id: parseInt(req.params.commitId),
                },
                {
                  repos: {
                    id: parseInt(req.params.id),
                  },
                },
              ],
            },
          });
          if (!commit) {
            return res.status(404).send("not found");
          }
          if (
            !req.ability.can(
              access.update,
              subject(entity.commits, {
                authorId: repos.authorId,
              })
            )
          ) {
            return res.status(403).send("forbidden");
          }
          let commitUpdate = await prismaClient.commits.update({
            where: {
              id: parseInt(req.params.commitId),
            },
            data: {
              message: req.body.message,
            },
          });
          res.status(200).json(commitUpdate);
        } else {
          return res.status(403).send("forbidden");
        }
      } catch (err) {
        console.log(err);
        return res.status(500).send(`${err.message}`);
      }
      break;
    case "DELETE":
      try {
        if (req.ability.can(access.read, entity.repos)) {
          let repos = await prismaClient.repos.findFirst({
            where: {
              id: parseInt(req.params.id),
            },
          });
          const commit = await prismaClient.commits.findFirst({
            where: {
              AND: [
                {
                  id: parseInt(req.params.commitId),
                },
                {
                  repos: {
                    id: parseInt(req.params.id),
                  },
                },
              ],
            },
          });
          if (!commit) {
            return res.status(404).send("not found");
          }
          if (
            !req.ability.can(
              access.delete,
              subject(entity.commits, {
                authorId: repos.authorId,
              })
            )
          ) {
            return res.status(403).send("forbidden");
          }
          let commitDelete = await prismaClient.commits.delete({
            where: {
              id: parseInt(req.params.commitId),
            },
          });
          res.status(200).json(commitDelete);
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
