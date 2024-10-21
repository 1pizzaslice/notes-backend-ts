
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import User from "../models/user"; 
import { setUser } from "../service/auth";

interface IUserSignupRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
    isAdmin?: boolean;
  };
}

interface IUserLoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export async function handleUserSignup(req: IUserSignupRequest, res: Response): Promise<void> {
  const { name, email, password, isAdmin } = req.body;
  await User.create({
    name,
    email,
    password,
    isAdmin,
  });
  res.status(201).json({ message: "User created successfully" });
}

export async function handleUserLogin(req: IUserLoginRequest, res: Response): Promise<void> {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (!user) {
    res.render("login", {
      error: "Invalid Username or Password",
    });
    return;
  }

  const sessionId = uuidv4();
  setUser(sessionId, user as any);
  res.cookie("uid", sessionId);
  res.status(200).json({ message: "User logged in successfully" });
}
