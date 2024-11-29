import prisma from "../db/db";
import type { Request,Response } from "express";

export const sendMessage = async(req: Request,res: Response) => {
    try {
        const {receiverId, message } = req.body;
        const senderId = req.user.userId
    
        // Validate request body
        if (!senderId || !receiverId || !message) {
          return res.status(400).json({ message: "All fields are required" });
        }

        const isFriend = await prisma.friendship.findFirst({
          where: {
            OR: [
              { userId: senderId, friendId: receiverId },
              { userId: receiverId, friendId: senderId },
            ],
          },
        });
    
        if (!isFriend) {
          return res.status(403).json({ message: "You can only send messages to friends" });
        }
    
        // Create the message
        const content = await prisma.messages.create({
          data: {
            senderId: senderId,
            receiverId: receiverId,
            message,
          },
        });
    
        const sender = await prisma.user.findUnique({
          where: { id: senderId },
          select: { username: true },
        });
    
        if (!sender) {
          return res.status(400).json({ message: "Sender not found" });
        }
    
        // Create the notification message
        const notificationMessage = `${sender.username} sent you a message`;
    
        // Step 3: Create a notification for the receiver
        const notification = await prisma.notification.create({
          data: {
            userId: receiverId,        // The receiver will receive the notification
            type: "message",           // Type of notification (can be "message" or any other type)
            message: notificationMessage,  // Notification message
            senderId: senderId,        // Sender's ID (the one who sent the message)
            read: false,               // By default, set the notification to unread
          },
        });

        return res.status(201).json({
          message: "Message sent successfully",
          data: content,
          notification,
        });
      } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
}

export const getMessage = async(req: Request,res: Response) => {
    const senderId = req.user.userId;
    try {
        const { receiverId } = req.params;

        const messages = await prisma.messages.findMany({
          where: {
            OR: [
              {
                senderId: Number(senderId),
                receiverId: parseInt(receiverId),
              },
              {
                senderId: parseInt(receiverId),
                receiverId: parseInt(senderId),
              },
            ],
          },
          orderBy: {
            createdAt: 'asc', 
          },
        });

        const sender = await prisma.user.findUnique({
          where: { id: senderId },
          select: { username: true },  
        });
    
        if (!sender) {
          return res.status(400).json({ message: 'Sender not found' });
        }
    
        // Step 3: Create the notification for the receiver
        const notificationMessage = `You have opened a conversation with ${sender.username}`;
    
        // Create a notification for the receiver about the conversation opening
        const notification = await prisma.notification.create({
          data: {
            userId: parseInt(receiverId),    // The receiver will receive the notification
            type: "message_conversation",     // Type of notification (can be "message_conversation")
            message: notificationMessage,     // The notification message
            senderId: senderId,              // The sender of the message
            read: false,                      // By default, the notification is unread
          },
        });
    
        return res.status(200).json({
          message: 'Messages retrieved successfully',
          data: messages,
          notification
        });
      } catch (error) {
        console.error('Error retrieving messages:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
}

export const deleteMessage = async(req: Request,res: Response) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.userId; 
        
        const message = await prisma.messages.findUnique({
          where: { id: parseInt(messageId) },
        });
        
        if (!message) {
          return res.status(404).json({ message: 'Message not found' });
        }
    
        if (message.senderId !== userId && message.receiverId !== userId) {
          return res.status(403).json({ message: 'You can only delete your own messages' });
        }
    
        
        const SoftdeletedMessage = await prisma.messages.update({
          where: { id: parseInt(messageId) },
          data: {
            deletedAt: new Date(),  // You would need to add a 'deletedAt' field to your schema
          },
        });
    
        
        const deletedMessage = await prisma.messages.delete({
          where: { id: parseInt(messageId) },
        });
    
        await prisma.notification.deleteMany({
          where: {
            messageId: parseInt(messageId),
          },
        });
    
        return res.status(200).json({
          message: 'Message deleted successfully',
          data: deletedMessage,
        });
      } catch (error) {
        console.error('Error deleting message:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
}