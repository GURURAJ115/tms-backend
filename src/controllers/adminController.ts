import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { generateCSV } from "../utils/csvUtils";

const prisma = new PrismaClient;

export const createEvent = async(req: Request, res:Response) =>{
    try{
        const {title, description, date, location, image} = req.body;
        const adminId = (req as any).admin?.adminId;

        if(!adminId){
            res.status(403).json({message: "Admin authentication required"});
            return;
        }

        const event = await prisma.event.create({
            data:{
                title,
                description,
                date : new Date(date),
                adminId,
                location,
                image
            }
        });
        res.status(201).json({
            message: "Event created successfully",
            event
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message: "Failed to create event",
        })
    }
}
export const updateEvent = async(req: Request, res:Response) =>{
    try{
        const eventId = parseInt(req.params.id);
        const {title, description, date, location, image} = req.body;
        const adminId = (req as any).admin?.adminId;

        const existingEvent = await prisma.event.findFirst({
            where: {id:eventId, adminId}
        });

        if(!existingEvent){
            res.status(404).json({message: "Event not found or unauthorized"});
            return;
        }

        const updatedEvent = await prisma.event.update({
            where: {id: eventId},
            data:{
                title,
                description,
                date: date? new Date(date) :undefined,
                location,
                image
            }
        });
        
        res.status(200).json({
            message: "Event Updated Successfully",
            event: updatedEvent
        })
    }
    catch(error){
        res.status(500).json({
            message: "Failed to update the event",
            error
        })
    }
};

export const deleteEvent = async(req: Request, res:Response) =>{
    try{
        const eventId = parseInt(req.params.id);
        const adminId = (req as any).admin?.adminId;

        const existingEvent = await prisma.event.findFirst({
            where:{id:eventId, adminId}
        })

        if(!existingEvent){
            res.status(404).json({
                message: "Event not found or not authorized"
            });
            return;
        }

        await prisma.event.delete({
            where: {id: eventId}
        })

        res.status(200).json({
            message: "Event deleted successfully"
        })
    }
    catch(error){
        res.status(500).json({
            message: "Failed to delete event",
            error
        })
    }
};

export const markAttendance = async(req: Request, res:Response) =>{
    try{
        // right now from body, but have to get it from the qrScanner.
        const userId = req.body;
        const eventId = parseInt(req.params.id);
        const adminId = (req as any).admin?.adminId;

        const event = await prisma.event.findFirst({
            where : {id:eventId, adminId}
        });

        if(!event){
            res.status(404).json({
                message: "Event not found or not authorized"
            });
            return;
        }



        const registration = await prisma.event.findFirst({
            where: {id:eventId, attendees: {some: {id:userId}}}
        });

        if(!registration){
            res.status(400).json({message: "User not registererd for this event"});
        }

        const attendance = await prisma.eventAttendance.upsert({
            where:{
                eventId_userId:{
                    eventId,
                    userId
                }
            },
            create: {
                eventId,
                userId,
                attended: true,
                attendedAt: new Date()
            },
            update:{
                attended: true,
                attendedAt: new Date()
            }
        });

        res.status(200).json({
            message: "Attendance confirmed",
            eventId,
            userId
        });
    }
    catch(error){
        res.status(500).json({
            message: "Failed to mark the attendance",
            error
        });
    }
};





export const generateAttendanceReport= async(req: Request, res:Response) =>{
    //csv things......
    try{
        const {startDate, endDate, eventId} = req.query;
        const adminId = (req as any).admin?.adminId;

        const events = await prisma.event.findMany({
            where: {
                adminId,
                id: eventId ? parseInt(eventId as string) : undefined,
                date: {
                    gte: startDate? new Date(startDate as string) : undefined,
                    lte: endDate? new Date(endDate as string): undefined
                }
            },
            include: {
                attendees: {
                    select: {
                        id: true,
                        name: true,
                        phone: true
                    }
                },
                attendances: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                phone: true
                            }
                        }
                    }
                }
            }
        });

        const reportData = events.flatMap(event=>
            event.attendances.map(record=>({
                eventId: event.id,
                eventTitle: event.title,
                eventDate: event.date.toISOString(),
                userId: record.userId,
                userName: record.user.name,
                userPhone: record.user.phone,
                attendanceTime: record.attendedAt?.toString(),
                status: record.attended? "Present": "Absent"
            }))
        );
        
        const csv = generateCSV(reportData);
        res.setHeader('Content-Type','text/csv');
        res.setHeader('Content-Disposition','attachment; filename=attendance-report.csv');
        res.status(200).send(csv);
    }
    catch(error){
        res.status(500).json({
            message: "Failed to generate report",
            error: error instanceof Error ? error.message: error
        });
    }
};
