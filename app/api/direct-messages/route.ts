import Currentprofile from "@/lib/currentprofilemodel";
import { db } from "@/lib/db";
import { DirectMessage, Message } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH=10;
export async function GET(req:Request) {
    try{
        const profile=await Currentprofile();
        const {searchParams}=new URL(req.url);
        const cursor=searchParams.get("cursor");
        const conversationId=searchParams.get("conversationId");
        if(!profile){
            return new NextResponse("UnAuthorized",{status:401});
        }
        if(!conversationId){
            return new NextResponse("ConversationId is missing",{status:400});
        }
        let messages: DirectMessage[]=[];
        if(cursor){
            messages=await db.directMessage.findMany({
                take:MESSAGES_BATCH,
                skip:1,
                cursor:{
                    id: cursor
                },
                where: {
                    conversationId
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                },
                orderBy:{
                    createdAt:"asc",
                }
            });
        }else{
            messages=await db.directMessage.findMany({
                take:MESSAGES_BATCH,
                where: {
                    conversationId
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                },
                orderBy:{
                    createdAt:"asc",
                }
            });
        }
        let nextCursor=null;
        if(messages.length==MESSAGES_BATCH){
            nextCursor=messages[MESSAGES_BATCH-1]?.id;
        }
        return NextResponse.json({items:messages,nextCursor});
        
    }catch(error){
        console.log("[DIRECT-MESSAGES]",error);
        return new NextResponse("Internal Error",{status:500});
    }
}