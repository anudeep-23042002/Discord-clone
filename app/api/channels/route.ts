import Currentprofile from "@/lib/currentprofilemodel";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
export async function POST(req:Request){
    try{
        const profile = await Currentprofile();
        const {searchParams}=new URL(req.url);
        const {name, type}=await req.json();
        const serverId=searchParams.get("serverId");
        console.log("TYPE",type);
        if(!profile){
            return new NextResponse("Unautorized",{status:400});
        }
        if(!serverId){
            return new NextResponse("ServerId missing",{status:400});   
        }
        const server=await db.server.update({
            where:{
                id:serverId,
                members:{
                    some:{
                        profileId:profile.id,
                        role:{
                            in:[MemberRole.ADMIN,MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data:{
                channels:{
                    create:[{
                        name:name,
                        type:type,
                        profileId:profile.id         
                    }]
                }
            }
        });
        return NextResponse.json(server);
    }catch(error){
        console.log("CHANNELS POST ERROR",error);
    }
}