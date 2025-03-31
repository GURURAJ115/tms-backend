import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getEvents = async (req:Request,res:Response) =>{
    try{
        const events = await prisma.event.findMany({
            include: {createdBy: {select: {name:true}}}
        });

        res.status(200).json(events);
    }
    catch(error){
        res.status(500).json({message: "Failed to fetch events", error});
    }
}

export const getEventDetails = async (req:Request,res:Response) =>{
    try{
        const eventId = parseInt( req.params.id);
        const event = await prisma.event.findUnique({
            where: {id: eventId},
            include: {
                createdBy: {select :{name: true}},
                attendees: {select : {id: true, name: true}}
            }
        });
        res.status(200).json(event);
    }
    catch(error){
        res.status(500).json({message: "Failed to fetch event", error});
    }
}