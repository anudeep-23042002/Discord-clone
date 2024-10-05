import Currentprofile from "@/lib/currentprofilemodel";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    req:Request,
    {params}:{params:{serverId:String}}
) {
    try{
        const profile=await Currentprofile();
        if(!profile){
            return new NextResponse("Unauthorized",{status:400});
        }
        if(!params.serverId){
            return new NextResponse("ServerId is Missing",{status:401});
        }
        const server=await db.server.update({
            where:{
                id:params.serverId,
                members:{
                    some:{
                        profileId:profile.id,
                    }
                },
            },
            data:{
                members:{
                        deleteMany:{
                            profileId:profile.id,
                       }
                   }
            }
        });
        return NextResponse.json(server);
    }catch(error){
        console.log("LEAVE_DELETE",error);
    }
}