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
        const {serverId,channelId}=req.query;
        if(!profile){
            return res.status(401).json({error:"Not Authenticated"});
        }
        if(!serverId){
            return res.status(400).json({error:"Not Authenticated"});
        }
        if(!channelId){
            return res.status(400).json({error:"Not Authenticated"});
        }
        if(!content){
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
        const message = await db.message.create({
            data:{
                content,
                fileUrl:FileUrl,
                channelId:channelId as string,
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
        const channelKey=`chat:${channelId}:messages`;
        res?.socket?.server?.io?.emit(channelKey,message);
        return res.json(message);
    }catch(error){
        console.log(error);
        return res.status(500).json({error:"Internal Error"})
    }
}