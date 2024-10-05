import Currentprofile from "@/lib/currentprofilemodel";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req:Request,
    {params}:{params:{serverId:string}}) {
    try{
        const profile=await Currentprofile();
        if(!profile){
            return new NextResponse("unauthorized",{status:401});
        }
        if(!params.serverId){
            return new NextResponse("ServerID missing",{status:400});
        }
        const {name,imageUrl}=await req.json();
        
        const editserver=await db.server.update({
            where:{
                id:params.serverId,
            },
            data:{
                name:name,
                imageUrl:imageUrl,
            }
        });
        return NextResponse.json(editserver);
    }catch(error){
        console.log("[SERVERID]",error);
        return new NextResponse("Internal Error",{status:500});
    }
}