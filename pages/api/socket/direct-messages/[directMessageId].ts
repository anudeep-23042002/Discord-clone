import {Server as NetServer} from "http";
import {Server as ServerIO} from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { NextApiResponseServerIO } from "@/types";
import CurrentprofilePages from "@/lib/currentprofilepages";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
export default async function handler(req:NextApiRequest,res:NextApiResponseServerIO){
    if(req.method!=='PATCH' && req.method!=='DELETE'){
        return res.status(405).json({error:"Method not allowed"});
    }
    try{
        const profile=await CurrentprofilePages(req);
        const {content}=req.body;
        const {directMessageId,conversationId}=req.query;
        if(!profile){
            return res.status(401).json({error:"Not Authenticated"});
        }
        if(!conversationId){
            return res.status(400).json({error:"Conversation Id missing"});
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
        
        let directMessage = await db.directMessage.findFirst({
            where:{
                id:directMessageId as string,
                conversationId:conversationId as string
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        });
        if(!directMessage || directMessage.delete){
            return res.status(400).json({error:"Message Not found"});
        }
        const isAdmin=member.role===MemberRole.ADMIN;
        const isModerator=member.role===MemberRole.MODERATOR;
        const isOwner=directMessage.memberId===member.id;
        const canModify=isOwner || isAdmin || isModerator;
        if(!canModify){
            return res.status(400).json({error:"Unauthorized"});
        }
        if(req.method=='DELETE'){
            directMessage=await db.directMessage.update({
                where:{
                    id:directMessageId as string,   
                },
                data:{
                    fileUrl:null,
                    content:"This message has been deleted",
                    delete:true,
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                }
            })
        }
        if(req.method=='PATCH'){
            if(!isOwner){
                return res.status(400).json({error:"Unauthorized"});
            }
            directMessage=await db.directMessage.update({
                where:{
                    id:directMessageId as string,   
                },
                data:{
                    content:content,
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                }
            })
        }
        const channelKey=`chat:${conversationId}:messages`;
        res?.socket?.server?.io?.emit(channelKey,directMessage);
        return res.json(directMessage);
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Internal Error"})
    }
}