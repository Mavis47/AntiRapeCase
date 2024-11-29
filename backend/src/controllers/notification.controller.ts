import type { Request,Response } from 'express';
import React from 'react'
import prisma from '../db/db';

export const FetchNotification = async(req: Request, res: Response) => {
    const userId = req.user.userId;

    try {
        const response = await prisma.notification.findMany({
            where: {userId},
            include: {
                sender: true, 
              },
            orderBy: { createdAt: 'desc' },
        })
        res.status(201).send(response);
    } catch (error) {
        console.error("Error getting notification",error)
        return res.status(500).send(error);
    }   
}
