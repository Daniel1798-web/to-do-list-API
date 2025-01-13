import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser: IUser = new User({
            name,
            email,
            salt,
            password: hashedPassword,
        });


        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log('Hash almacenado en la base de datos:', user.password);

        const hashedPassword = await bcrypt.hash(password, user.salt);

        console.log(hashedPassword)
        console.log(user.password)

        const isPasswordValid = hashedPassword === user.password;


        console.log(isPasswordValid)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
            expiresIn: "1h",
        });

        res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
