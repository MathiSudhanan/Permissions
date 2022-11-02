import { error } from "console";

const jwt = require("jsonwebtoken");

module.exports = (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    const userId = decodedToken.id;

    if (userId) {
      req.headers["userId"] = userId;
      let userIdAuth = req.headers["userId"];
    }
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      error: "Invalid request!",
    });
  }
};
