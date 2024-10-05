import Currentprofile from "../../../lib/currentprofilemodel";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {v4 as uuidv4} from "uuid";
import { MemberRole } from "@prisma/client";

export async function POST(req:Request){
    try{
        
        const {name,imageUrl}=await req.json();
        const profile=await Currentprofile();
        if(!profile){
            return new NextResponse("Unauthorized",{status:401});
        }
        const server=await db.server.create({
            data:{
            name:name,
            imageUrl:imageUrl,
            profileId:profile.id,
            inviteCode:uuidv4(),

            channels:{
                create:[
                    {name: "general", profileId:profile.id}
                ]
            },
            members:{
                create:[
                    {profileId:profile.id,role:MemberRole.ADMIN}
                ]
            }
        }});
        return NextResponse.json(server);
    }catch(error){
        console.log("[SERVERS POST]",error);
        return NextResponse.json(error);
    }
}