const { AbilityBuilder, Ability } = require("@casl/ability");
const { Admin, User } = require("./roles");
const access = require("./defines").access;
const entity = require("./defines").entity;
const admin = require("./defines").admin;

exports.GetAbilityFor = (req) => {
  // получаем права доступа для пользователя
  const { rules, can, cannot } = new AbilityBuilder(Ability); // создаем объект прав доступа
  switch (req.payload.role) {
    case Admin:
      can(admin.manage, admin.all);
      cannot(access.create, admin.all);
      break;
    case User:
      can([access.create, access.update], [entity.repos, entity.commits], {
        authorId: parseInt(req.payload.id),
      });
      can(access.read, [entity.repos, entity.commits]);
      can(access.read, entity.users, { id: parseInt(req.payload.id) });
      break;
    default:
      can(access.read, [entity.repos, entity.commits]);
      break;
  }
  req.rules = rules; // сохраняем правила в req
  return new Ability(rules);
};
