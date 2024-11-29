import React from "react";
import type { Request, Response } from "express";
import prisma from "../db/db";

export const SendRequests = async (req: Request, res: Response) => {
  const senderId = req.user.userId;
  console.log("Sender Id", senderId);
  const { receiverId } = req.body;
  console.log("receiver", receiverId);

  // Check if receiverId is provided
  if (!receiverId) {
    res.status(400).json({ error: "Receiver ID is missing" });
    return;
  }

  try {
    // Check if the friend request already exists
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        senderId,
        receiverId,
      },
    });

    if (existingRequest) {
      res.status(400).json({ error: "Friend request already sent" });
      return;
    }

    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      select: { username: true }, 
    });

    if (!sender) {
      res.status(400).json({ error: "Sender not found" });
      return;
    }

    // Create the friend request
    const sendRequest = await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
        status: "PENDING",
      },
    });

    const notification = await prisma.notification.create({
      data: {
        userId: receiverId,      // The receiver of the notification
        type: "friend_request",  // Notification type
        message: `You have a new friend request from ${sender.username}`, // Include sender's name
        senderId,                // Sender of the notification (the user who sent the friend request)
        read: false,             // By default, the notification is unread
      },
    });

    res
      .status(201)
      .json({ message: "Friend request sent successfully", sendRequest,notification });
    return;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while sending the friend request" });
    return;
  }
};

export const RespondToFriendRequest = async (req: Request, res: Response) => {
  const { requestId, action }: { requestId: number; action: "accept" | "reject" } = req.body;
  const userId = req.user.userId;

  // Validate the input
  if (!requestId || !action) {
    res.status(400).json({ error: "Request ID and action are required" });
    return;
  }

  try {
    // Find the friend request
    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!friendRequest) {
      res.status(404).json({ error: "Friend request not found" });
      return;
    }

    // Ensure the logged-in user is the receiver
    if (friendRequest.receiverId !== userId) {
      res
        .status(403)
        .json({ error: "You are not authorized to respond to this request" });
      return;
    }

    // Fetch both sender and receiver details
    const [sender, receiver] = await Promise.all([
      prisma.user.findUnique({
        where: { id: friendRequest.senderId },
        select: { username: true },
      }),
      prisma.user.findUnique({
        where: { id: userId }, // The receiver is the logged-in user
        select: { username: true },
      }),
    ]);

    if (!sender || !receiver) {
      res.status(400).json({ error: "Sender or receiver not found" });
      return;
    }

    // Update the friend request status
    const updatedRequest = await prisma.friendRequest.update({
      where: { id: requestId },
      data: {
        status: action === "accept" ? "ACCEPTED" : "REJECTED",
      },
    });

    // If accepted, create a friendship
    if (action === "accept") {
      const existingFriendship = await prisma.friendship.findFirst({
        where: {
          OR: [
            { userId: friendRequest.senderId, friendId: friendRequest.receiverId },
            { userId: friendRequest.receiverId, friendId: friendRequest.senderId },
          ],
        },
      });

      if (!existingFriendship) {
        await prisma.friendship.create({
          data: {
            userId: friendRequest.senderId,
            friendId: friendRequest.receiverId,
          },
        });
      }
    }

    // Create a notification for the sender
    const notificationMessage =
      action === "accept"
        ? `${receiver.username} has accepted your friend request`
        : `${receiver.username} has rejected your friend request`;

    try {
      const notification = await prisma.notification.create({
        data: {
          userId: friendRequest.senderId, // The sender receives the notification
          type: "friend_request_response",
          message: notificationMessage,
          senderId: userId, // The receiver is performing the action
          read: false,
        },
      });

      res.status(200).json({
        message: `Friend request ${action}ed successfully`,
        updatedRequest,
        notification,
      });
    } catch (notificationError) {
      console.error("Notification creation failed", notificationError);
      res.status(200).json({
        message: `Friend request ${action}ed successfully, but notification failed.`,
        updatedRequest,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while responding to the friend request",
    });
  }
};

export const showFriends = async (req: Request, res: Response) => {
  const userId = req.user.userId; // Get the logged-in user's ID from the middleware (SecureRoutes)

  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ userId: userId }, { friendId: userId }],
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullname: true,
            userProfilePic: true,
          },
        },
        friend: {
          select: {
            id: true,
            username: true,
            fullname: true,
            userProfilePic: true,
          },
        },
      },
    });

    const friends = friendships.map((friendship) => {
      if (friendship.userId === userId) {
        return friendship.friend;
      }
      return friendship.user;
    });

    if (friends.length === 0) {
      return res.status(404).json({ message: "You have no friends yet." });
    }

    return res.status(200).json({
      message: "Friends retrieved successfully",
      friends: friends,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching friends" });
  }
};