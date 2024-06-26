// controller/user.controller.js
import bcrypt from "bcrypt";
import { CompanyPostCollection, CompanyGetCollection , User } from "../db/database.js";

export const getRequirement = async (req, res) => {
  const {
    company_name,
    company_website,
    email,
    ph_no,
    available_expert,
    from,
    to,
    desc_requirement,
    address,
    documents,
  } = req.body;

  try {
    const newReq = new CompanyGetCollection({
      company_name,
      company_website,
      email,
      ph_no,
      available_expert,
      from,
      to,
      desc_requirement,
      address,
      documents,
    });

    await newReq.save();
    res.status(201).json({ message: "Get Post created successfully" });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ message: "Failed to create post. Please try again later." });
  }
};

export const postRequirement = async (req, res) => {
  const {
    company_name,
    company_website,
    email,
    ph_no,
    available_expert,
    from,
    to,
    desc_requirement,
    address,
    documents,
  } = req.body;

  try {
    const newPost = new CompanyPostCollection({
      company_name,
      company_website,
      email,
      ph_no,
      available_expert,
      from,
      to,
      desc_requirement,
      address,
      documents,
    });

    await newPost.save();

    res.status(201).json({ message: "Post created successfully" });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ message: "Failed to create post. Please try again later." });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    const token = await user.generateToken();
    console.log("token from login",token)

    // Set JWT token in a cookie
    res.cookie("jwttoken", token, {
      httpOnly: true,
    });

    // Send response with login details and token
    return res.status(200).json({
      success: true,
      message: "Login successful",
      id: user._id,
      user: { name: user.name, email: user.email },
      token: token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ message: "Login failed. Please try again later." });
  }
};

export const Register = async (req, res) => {
  const { name, email, password, cpassword } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      cpassword: hashedPassword,
    });
    await newUser.save();

    const token = await newUser.generateToken();
    console.log("token from register",token)

    // Set JWT token in a cookie
    res.cookie("jwttoken", token, {
      httpOnly: true,
    });

    res.status(201).json({
      message: "User registered successfully",
      token: token,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res
      .status(500)
      .json({ message: "Registration failed. Please try again later." });
  }
};

export const Logout = async (req, res) => {
  try {
    res.clearCookie("jwttoken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Logout failed. Please try again later." });
  }
};

export const greeting = (req, res) => {
  res.json({ msg: "hello world" });
};
