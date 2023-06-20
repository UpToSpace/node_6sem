const path = __dirname.split("\\");

const jwt = require("jsonwebtoken");
const { accessKey, refreshKey } = require("../security/jwtKeys");
const { PrismaClient } = require("@prisma/client");
const prismaClient = new PrismaClient();
path.pop(); // remove "controller" from path (path to "controller" folder)

exports.login = async (req, res) => {
  switch (req.method) {
    case "GET":
      res.sendFile(path.join("\\") + "\\views\\index.html");
      break;
    case "POST":
      if (req.body.username && req.body.password) {
        try {
          const user = await prismaClient.users.findFirst({
            where: {
              username: req.body.username,
              password: req.body.password,
            },
          });

          const accessToken = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            accessKey,
            { expiresIn: 3600 } // 1 hour
          );
          const refreshToken = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            refreshKey,
            { expiresIn: 24 * 3600 } // 24 hours
          );

          res.cookie("accessToken", accessToken, {
            httpOnly: true, // only server can access to this cookie
            sameSite: "strict", // cookie will be sent only if the request is being sent from the same domain
          });
          res.cookie("id", user.id, {
            httpOnly: true,
            sameSite: "strict",
          });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            path: "/refresh-token",
          });
          res.redirect("/resource");
        } catch (e) {
          res.send(e.message);
        }
      }
      break;
    default:
      res.statusCode = 405;
      res.messageerror = "Method not allowed";
      res.end();
  }
};

exports.register = async (req, res) => {
  switch (req.method) {
    case "GET":
      res.sendFile(path.join("\\") + "\\views\\register.html");
      break;
    case "POST":
      if (req.body.username && req.body.password) {
        try {
          const createdUser = await prismaClient.users.create({
            data: {
              username: req.body.username,
              password: req.body.password,
              email: req.body.email,
              role: "User",
            },
          });
          res.redirect("/login");
        } catch (error) {
          console.error(error);
          res.send("Error occurred during registration");
        }
      }
      break;
    default:
      res.statusCode = 405;
      res.messageerror = "Method not allowed";
      res.end();
  }
};

exports.logout = (req, res, next) => {
  switch (req.method) {
    case "GET":
      res.clearCookie("accessToken");
      res.clearCookie("id");
      res.clearCookie("refreshToken");
      res.redirect("/login");
      break;
    default:
      res.statusCode = 405;
      res.messageerror = "Method not allowed";
      res.end();
  }
};
