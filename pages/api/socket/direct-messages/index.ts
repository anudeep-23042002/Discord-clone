import {Server as NetServer} from "http";
import {Server as ServerIO} from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { NextApiResponseServerIO } from "@/types";
import CurrentprofilePages from "@/lib/currentprofilepages";
import { db } from "@/lib/db";
export default async function handler(req:NextApiRequest,res:NextApiResponseServerIO){
    if(req.method!='POST'){
        return res.status(405).json({error:"Method not allowed"});
    }
    try{
        const profile=await CurrentprofilePages(req);
        const {content , FileUrl}=req.body;
        const {conversationId}=req.query;
        if(!profile){
            return res.status(401).json({error:"Not Authenticated"});
        }
        if(!conversationId){
            return res.status(400).json({error:"Not Authenticated"});
        }
        if(!content){
            return res.status(400).json({error:"Not Authenticated"});
        }
        const conversation=await db.conversation.findFirst({
            where:{
                id:conversationId as string,
            OR:[
                {
                    memberOne:{
                        profileId:profile.id
                    }
                },
                {
                    memberTwo:{
                        profileId:profile.id
                    }
                }
            ]
        },
            include:{
                memberOne:{
                    include:{
                        profile:true,
                    }
                },
                memberTwo:{
                    include:{
                        profile:true,
                    }
                }
            }
        });
        if(!conversation){
            return res.status(400).json({error:"Conversation Not found"});
        }
        const member=conversation.memberOne.profileId==profile.id?conversation.memberOne : conversation.memberTwo;
        if(!member){
            return res.status(400).json({error:"Member Not found"});
        }
        const message = await db.directMessage.create({
            data:{
                content,
                fileUrl:FileUrl,
                conversationId:conversationId as string,
                memberId:member.id
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        });
        const channelKey=`chat:${conversationId}:messages`;
        res?.socket?.server?.io?.emit(channelKey,message);
        return res.json(message);
    }catch(error){
        console.log("DIRECT_MESSAGES",error);
        return res.status(500).json({error:"Internal Error"})
    }
}