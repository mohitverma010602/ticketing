import { Router, Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { BadRequestError } from "../errors/bad-request-error";
import { validateRequest } from "../middlewares/validateRequest";
import { Password } from "../services/password";

const router = Router();

// Define a validation schema using zod
const signinValidationSchema = z.object({
  email: z.string().trim().email("Email must be valid"),
  password: z
    .string()
    .trim()
    .min(6, "Password should be atleast 6 character")
    .max(32, "Password should be atmost of 32 character"),
});

router
  .route("/signin")
  .post(
    validateRequest(signinValidationSchema),
    async (req: Request, res: Response) => {
      const { email, password } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        throw new BadRequestError("Invalid Credentials");
      }

      // Check password
      const isPasswordValid = await Password.compare(
        existingUser.password,
        password
      );
      if (!isPasswordValid) {
        throw new BadRequestError("Invalid Credentials");
      }

      //Generate jwt key
      const userJwt = jwt.sign(
        {
          id: existingUser._id,
          email: existingUser.email,
        },
        process.env.JWT_KEY!
      );

      //Add to session
      req.session = {
        jwt: userJwt,
      };

      //Send response
      res.status(200).send({
        message: "User Signed in successfully",
        existingUser,
      });
    }
  );

export { router as signinRouter };
