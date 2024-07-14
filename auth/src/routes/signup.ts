import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model";
import { validateRequest, BadRequestError } from "@mv-tik/common";

const router = Router();

// Define the validation schema using Zod
const signupValidationSchema = z.object({
  email: z.string().trim().email("Email must be valid"),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters long")
    .max(32, "Password must be at most 32 characters long"),
});

// Route to handle signup
router.post(
  "/signup",
  validateRequest(signupValidationSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email already exists");
    }

    const user = User.build({ email, password });
    await user.save();

    //Generate jwt and store it in cookie-session
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Add to session
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send({
      message: "User created successfully",
      user,
    });
  }
);

export { router as signupRouter };
