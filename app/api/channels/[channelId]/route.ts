import Currentprofile from "@/lib/currentprofilemodel";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req:Request,
    {params}:{params:{channelId:string}}
){
    try{
        const profile=await Currentprofile();
        const {name,type}=await req.json();
        const {searchParams}=new URL(req.url);
        const serverId=searchParams.get("serverId")
        if(!profile){
            return new NextResponse("unauthorized",{status:401});
        }
        if(!params.channelId){
            return new NextResponse("channelID missing",{status:400});
        }
        if(!serverId){
            return new NextResponse("ServerID missing",{status:400});
        }
        const server=await db.server.update({
            where:{
                id:serverId 
            },
            data:{
                channels:{
                    update:{
                        where:{
                            id:params.channelId
                        },
                        data:{
                            name:name,
                            type:type
                        }
                    },
                }
            },
            include:{
                members:{
                    include:{
                        profile:true
                    },
                    orderBy:{
                        role:"asc"
                    }
                }
            }
    });
        return NextResponse.json(server);
    }catch(error){
        console.log("CHANNELS_PATCH",error);
    }
}
export async function DELETE(req:Request,
    {params}:{params:{channelId:string}}) {
        try{
            const profile=await Currentprofile();
            const {searchParams}=new URL(req.url);
            const serverId=searchParams.get("serverId")
            if(!profile){
                return new NextResponse("unauthorized",{status:401});
            }
            if(!params.channelId){
                return new NextResponse("ServerID missing",{status:400});
            }
            const server=await db.server.update({
                where:{
                    id:serverId 
                },
                data:{
                    channels:{
                        deleteMany:{
                            id:params.channelId
                        },
                    }
                },
                include:{
                    members:{
                        include:{
                            profile:true
                        },
                        orderBy:{
                            role:"asc"
                        }
                    }
                }
        });
            return NextResponse.json(server);
        }catch(error){
            console.log("CHANNELS_PATCH",error);
        }
}