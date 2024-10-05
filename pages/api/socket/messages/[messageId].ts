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
        const {messageId,serverId,channelId}=req.query;
        if(!profile){
            return res.status(401).json({error:"Not Authenticated"});
        }
        if(!serverId){
            return res.status(400).json({error:"Not Authenticated"});
        }
        if(!channelId){
            return res.status(400).json({error:"Not Authenticated"});
        }
        if(!messageId){
            return res.status(400).json({error:"Not Authenticated"});
        }
        const server=await db.server.findFirst({
            where:{
                id:serverId as string,
                members:{
                    some:{
                        profileId:profile.id
                    }
                }
            },
            include:{
                members:true,
            }
        })
        if(!server){
            return res.status(400).json({error:"Server Not found"});
        }
        const channel=await db.channel.findFirst({
            where:{
                id:channelId as string,
                serverId:serverId as string
            },
        })
        if(!channel){
            return res.status(400).json({error:"Channel Not found"});
        }
        const member=server.members.find((member)=>member.profileId===profile.id);
        if(!member){
            return res.status(400).json({error:"Member Not found"});
        }
        let message = await db.message.findFirst({
            where:{
                id:messageId as string,
                channelId:channel.id as string
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        });
        if(!message || message.delete){
            return res.status(400).json({error:"Message Not found"});
        }
        const isAdmin=message.member.role===MemberRole.ADMIN;
        const isModerator=message.member.role===MemberRole.MODERATOR;
        const isOwner=message.member.id===member.id;
        const canModify=isOwner || isAdmin || isModerator;
        if(!canModify){
            return res.status(400).json({error:"Unauthorized"});
        }
        if(req.method=='DELETE'){
            message=await db.message.update({
                where:{
                    id:messageId as string,   
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
            message=await db.message.update({
                where:{
                    id:messageId as string,   
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
        const channelKey=`chat:${channelId}:messages`;
        res?.socket?.server?.io?.emit(channelKey,message);
        return res.json(message);
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Internal Error"})
    }
}