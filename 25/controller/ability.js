exports.ability = (req, res) => {
  res.status(200).send(req.rules); // req.rules - это объект, который содержит права доступа пользователя
};
