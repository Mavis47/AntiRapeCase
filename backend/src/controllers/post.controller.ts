import { MediaType } from '@prisma/client';
import { uploadImage, uploadVideo } from '../Cloudinary/cloudinary_function';
import prisma from '../db/db';
import type { Request, Response } from 'express';

export const addPost = async (req: Request, res: Response) => {
    try {
      const userId = req.user.userId; 
  
      let mediaData = [];
  
      // Handle file upload if there is a file
      if (req.file) {
        const filePath = req.file.path;
        const mimeType = req.file.mimetype;
        console.log("MIME Type:", mimeType);
  
        let result;
  
        // Check the mime type and call the respective upload function
        if (mimeType.startsWith("image/")) {
          result = await uploadImage(filePath);
        } else if (mimeType.startsWith("video/")) {
          result = await uploadVideo(filePath);
        } else {
          return res.status(400).json({ error: "Unsupported file type. Only image and video are allowed." });
        }
  
        const postImage = result?.secure_url;
        const mediaType = mimeType.startsWith("image/") ? MediaType.IMAGE : MediaType.VIDEO;
  
        mediaData.push({
          url: postImage!,
          type: mediaType,
          userId,
        });

      // Create the post with or without media
      const media = await prisma.media.create({
        data: {
          url: postImage!,
          type: mediaType,
          userId,
        },
      });

      mediaData.push(media);
    }

      const followers = await prisma.friendship.findMany({
        where: { friendId: userId }, // Get users who are friends with the logged-in user
        select: { userId: true }, // Select only the userId of the followers
      });
  
      // Step 3: Create a notification for each follower
      const notificationPromises = followers.map(async (follower) => {
        return prisma.notification.create({
          data: {
            userId: follower.userId,     // The follower who will receive the notification
            type: "new_post",             // The type of notification (can be "new_post" or another type)
            message: `New post from ${req.user.name}`, // The notification message
            senderId: userId,            // The sender of the post (the user who created the post)
            read: false,                  // Set to false initially (unread)
          },
        });
      });
  
      // Execute all notification creation promises
      await Promise.all(notificationPromises);
  
      // Return success response with post data
      return res.status(201).json({
        message: "Post created successfully",
        media: mediaData,
      });
  
    } catch (error) {
      console.log("Error In Adding Post", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


  export const deletePost = async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const postId = parseInt(req.params.id);
  
    try {
      await prisma.media.deleteMany({
        where: { id: postId },
      });
  
      await prisma.post.delete({
        where: {
          id: postId,
        },
      });
      res.status(201).json("Post Deleted Successfully")
      
    } catch (error) {
      console.log("Error In delete post", error);
      res.status(500).json({
        message: error,
      });
    }
  };
  
  export const fetchPost = async (req: Request, res: Response) => {
    console.log(req.params.id)
    try {
      const postId =  parseInt(req.params.id);
      const postData = await prisma.media.findUnique({
        where: { id: postId },
      });
    
      if (postData) {
        return res.status(200).json({
          message: "Post Fetched",
          postData,
        });
      }
    } catch (error) {
      console.log(error);
      res.send(error).status(500)
    }
    
  };

  export const fetchAllPost = async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const postData = await prisma.media.findMany({
      where: { userId },
      include: { 
        user: true,
    }})
  
    if (postData) {
      return res.status(200).json({
        message: "Post Fetched",
        postData,
      });
    }
  };
