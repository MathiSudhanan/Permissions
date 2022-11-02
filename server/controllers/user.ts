import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
require("dotenv").config();

export const getUsers = async (req: any, res: any) => {
  try {
    const baseProfiles = await prisma.users.findMany();

    res.status(200).json(baseProfiles);
  } catch (error: any) {
    console.log(error);
    res.status(404).json({ mesage: error.message });
  }
};

export const createUser = async (req: any, res: any) => {
  let post = req.body;

  const salt = bcrypt.genSaltSync();
  post.password = bcrypt.hashSync(post.password, salt);
  let baseProfile;

  try {
    baseProfile = await prisma.users.create({ data: post });

    res.status(201).json(baseProfile);
  } catch (error: any) {
    res.status(409).json({ mesage: error.message });
  }
};

export const deleteUser = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const user = await prisma.users.delete({
      where: {
        id: id,
      },
    });
    res.status(200);
  } catch (error) {
    res.status(404).json({ mesage: error });
  }
};

export const signin = async (req: any, res: any) => {
  let tokenScrt = process.env.JWT_TOKEN_SECRET
    ? process.env.JWT_TOKEN_SECRET
    : "";
  const { email, password } = req.body;
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        time: Date.now(),
      },
      tokenScrt,
      { expiresIn: "8h" }
    );

    res.setHeader(
      "set-Cookie",
      cookie.serialize("PERMISSION_ACCESS_TOKEN", token, {
        httpOnly: true,
        maxAge: 8 * 60 * 60,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
    );
    const { email } = user;
    res.json({ email: email, token: token });
  } else {
    res.status(401);
    res.json({ error: "Email or password is incorrect" });
  }
};

export const getCurrentUser = async (req: any, res: any) => {
  const token = getTokenFromCookies(req);

  // const token = req.cookies.PERMISSION_ACCESS_TOKEN;
  let tokenScrt = process.env.JWT_TOKEN_SECRET
    ? process.env.JWT_TOKEN_SECRET
    : "";
  if (!token) {
    return res.sendStatus(403);
  }
  const data: any = jwt.verify(token, tokenScrt);

  try {
    let user = await prisma.users.findUnique({
      where: {
        email: data.email,
      },
    });
    res.status(200).send({ email: user?.email, token: token });
  } catch {
    return res.sendStatus(403);
  }
};

const getTokenFromCookies = (req: any) => {
  const cookieHeaders = req.headers?.authorization;

  let token = "";
  if (cookieHeaders) {
    cookieHeaders.split(";").forEach((cookie: any) => {
      let tokenHeader = cookie.split("=")[0];

      if (tokenHeader) {
        token = cookie.split(" ")[1];
      }
    });

    return token;
  }
};
