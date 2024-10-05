import Currentprofile from "@/lib/currentprofilemodel";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
    req:Request,
    {params}:{params:{serverId:String}}
) {
    try{
        const profile=await Currentprofile();
        if(!profile){
            return new NextResponse("Unautorized",{status:404});
        }
        if(!params.serverId){
            return new NextResponse("ServerId is missing",{status:401});
        }
        const server=await db.server.deleteMany({
            where:{
                id:params.serverId,
                members:{
                    some:{
                        profileId:profile.id,
                        role:MemberRole.ADMIN
                    }
                }
            }
        });
        return NextResponse.json(server);
    }catch(error){
        console.log("DELETE_SERVER_ERROR",error);
    }
}