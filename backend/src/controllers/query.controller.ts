import type { Request, Response } from "express";
import prisma from "../db/db";

export const AddQueries = async (req: Request, res: Response) => {
  try {
    const { query, postId } = req.body;

    const Post_exists = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!Post_exists) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.userId;

    const newQuery = await prisma.queries.create({
      data: {
        comment_content: query,
        id: postId,
        userId: userId,
      },
    });
    return res.status(201).json({
        message: "Query added successfully",
        query: newQuery,
        user: {
          id: userId, 
        },
      });
  } catch (error) {
    console.error("Error in Adding Query",error);
  }
};

export const getQueries = async (req: Request, res: Response) => {
  console.log("POstid",req.query);
  const { postId } = req.query;

  if (!postId) {
    return res.status(400).json({ error: "Post ID is required" });
  }

  try {
    const queries = await prisma.queries.findMany({
      where: {
        postId: Number(postId),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (queries.length === 0) {
      return res
        .status(404)
        .json({ message: "No queries found for this post" });
    }

    return res.status(200).json({
      message: "Queries retrieved successfully",
      queries: queries,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching queries" });
  }
};

export const deleteQuery = async (req: Request, res: Response) => {
  const { queryId } = req.body;  
  const userId = req.user.userId; 
  
  if (!queryId) {
    return res.status(400).json({ error: "Query ID is required" });
  }

  try {
    const query = await prisma.queries.findUnique({
      where: { id: queryId },
      include: {
        post: true,  
      },
    });

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    
    const postOwnerId = query.post.userId;

    if (postOwnerId !== userId) {
      return res.status(403).json({ error: "You are not authorized to delete this query" });
    }

    
    await prisma.queries.delete({
      where: { id: queryId },
    });

    return res.status(200).json({ message: "Query deleted successfully" });
  } catch (error) {
    console.error("Error deleting query:", error);
    return res.status(500).json({ error: "An error occurred while deleting the query" });
  }
};