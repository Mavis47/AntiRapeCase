import type { Request, Response } from 'express';
import prisma from '../db/db';
import bcryptjs from 'bcrypt';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie';
import { uploadProfileImage } from '../Cloudinary/cloudinary_function';
import  jwt  from 'jsonwebtoken';

export const Signup = async (req: Request, res: Response)=> {
    const { username, fullname, email, password, age, userProfilePic } = req.body;
    console.log(username, fullname, email, password, age, userProfilePic);

    if (!email || !fullname || !username || !password || !age) {
        res.status(400).json({ error: "Please fill in all fields" });
        return;
    }

    let Profile_Image: string | undefined = "";
    if(req.file){
      const result = await uploadProfileImage(req.file.path)
      Profile_Image = result?.secure_url;
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (user) {
        res.status(400).json({ error: "Username already exists" });
        return;
    }


    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    

    const newUser = await prisma.user.create({
        data: {
            username,
            fullname,
            email,
            password: hashedPassword,
            age,
            userProfilePic: Profile_Image || null, 
        },
    });

    generateTokenAndSetCookie(res,newUser.id);

    if (newUser) {
        res.status(201).json({ message: "User created successfully", user: newUser });
        return
    }

     res.status(500).json({ error: "User creation failed" });
};

export const Login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
        res.status(400).json({ error: "Invalid Credentials" });
        return;
      }
      const isPasswordCorrect = await bcryptjs.compare(password, user.password);
  
      if (!isPasswordCorrect) {
        res.status(400).json({ error: "Invalid Credentials" });
        return;
      }

      const token = generateTokenAndSetCookie(res,user.id);
      
      res.status(200).json({
        message: "Logged-In Successfully",
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        username: user.username,
        profilePic: user.userProfilePic,
        token,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

export const Logout = (req: Request,res: Response) => {
    res.clearCookie("token");
    res.status(200).json({success: true,message: "Logged Out Successfully"});
}

export const getMe = async(req: Request, res: Response) => {
    const cookie = req.cookies.token;

    if (!cookie) {
       res.status(401).json({ error: 'Unauthorized, no token provided' });
       return
    }
    const data = req.user.userId;

    const user_data = await prisma.user.findUnique({where: {id: data}});

    res.status(200).json({ user: user_data });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    await prisma.$transaction([
      // Delete messages where the user is the sender
      prisma.messages.deleteMany({
        where: { senderId: Number(userId) },
      }),
      // Delete media related to the user
      prisma.media.deleteMany({
        where: { userId: Number(userId) },
      }),
      // Delete notifications related to the user
      prisma.notification.deleteMany({
        where: { userId: Number(userId) },
      }),
      // Finally, delete the user
      prisma.user.delete({
        where: { id: Number(userId) },
      }),
    ]);

    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const checkAuth = (req: Request, res: Response) => {
  const token = req.cookies.token;
  
  if (!token) {
      return res.status(401).json({ isAuthenticated: false });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      return res.status(200).json({ isAuthenticated: true,token });
  } catch (error) {
      return res.status(401).json({ isAuthenticated: false });
  }
};