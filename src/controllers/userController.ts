import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getUserProfile = async (req: Request,res:Response)=>{
    try{
        const userId = (req as any).user?.userId;
        const user = await prisma.user.findUnique({
            where: {id: userId},
            select:{id:true,name:true,email:true,phone:true,photo:true,isVolunteer:true,qrCode:true}
        });

        if(!user){
            res.status(404).json({message:"User not found"});
        }
        res.status(200).json(user);
    }
    catch(error){
        res.status(500).json({message: "Something went wrong",error});
    }
};

export const updateUserProfile = async (req:Request, res: Response) =>{
    try{
        const userId = (req as any).user?.userId;
        const {name,email,photo} = req.body;

        const updateUser = await prisma.user.update({
            where: {id:userId},
            data: {name,email,photo},
            select:{id:true, name:true, email:true, phone: true, photo:true}
        });
        res.status(200).json({message:'Profile updated',user:updateUser})
    }
    catch(error){
        res.status(500).json({message:"something went wrong",error});
    }
};

export const applyForVolunteer = async (req:Request, res: Response) =>{
    try{
        const userId = (req as any).user?.userId;

        await prisma.user.update({
            where:{id:userId},
            data: {isVolunteer:true}
        });
        res.status(200).json({message: "Volunteer application submitted"});
    }
    catch(error){
        res.status(500).json({message: "Something went wrong",error});
    }
};
