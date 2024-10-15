import Currentprofile from "@/lib/currentprofilemodel";
import { db } from "@/lib/db";
import { ChannelType,MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./serverheader";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./serversearch";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import ServerSection from "./serversection";
import ServerChannel from "./serverchannel";
import ServerMember from "./servermember";
import { Separator } from "../ui/separator";

interface serversidebarprops{
    serverId:string
};
const IconMap={
    [ChannelType.TEXT]:<Hash className="mr-2 h-4 w-4"/>,
    [ChannelType.AUDIO]:<Mic className="mr-2 h-4 w-4"/>,
    [ChannelType.VIDEO]:<Video className="mr-2 h-4 w-4"/>
}
const roleIconMap={
    [MemberRole.GUEST]:null,
    [MemberRole.MODERATOR]:<ShieldCheck className="mr-2 h-4 w-4"/>,
    [MemberRole.ADMIN]:<ShieldAlert className="mr-2 h-4 w-4"/>
}
const Serversidebar = async({serverId}:serversidebarprops) => {
    const profile=await Currentprofile();
    if(!profile){
        return redirect("/");
    }
    const server=await db.server.findUnique({
        where:{
            id:serverId,
        },
        include:{
            channels:{
                orderBy:{
                    createdAt:"asc"
                },
            },
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
    const members=server?.members.filter((member)=>member.profileId!==profile?.id);
    const textchannels=server?.channels.filter((channel)=>channel.type==ChannelType.TEXT);
    const audiochannels=server?.channels.filter((channel)=>channel.type==ChannelType.AUDIO);
    const videochannels=server?.channels.filter((channel)=>channel.type==ChannelType.VIDEO);

    if(!server){
        redirect('/');
    }
    const role=server?.members.find((member)=>member.profileId==profile?.id)?.role;
    return (
        <div>
            <ServerHeader role={role} server={server}/>
            <ScrollArea className="flex-1 bg-slate-200 dark:bg-slate-800">
                <div>
                    <ServerSearch data={[
                       {
                        label:"Text Channels",
                        type:"channel",
                        data:textchannels?.map((channel)=>({
                            id:channel.id,
                            name:channel.name,
                            Icon:IconMap[channel.type],
                        }))
                       },
                       {
                        label:"Voice Channels",
                        type:"channel",
                        data:audiochannels?.map((channel)=>({
                            id:channel.id,
                            name:channel.name,
                            Icon:IconMap[channel.type],
                        }))
                       },
                       {
                        label:"Video Channels",
                        type:"channel",
                        data:videochannels?.map((channel)=>({
                            id:channel.id,
                            name:channel.name,
                            Icon:IconMap[channel.type],
                        }))
                       },
                       {
                        label:"Members",
                        type:"member",
                        data:members?.map((member)=>({
                            id:member.id,
                            name:member.profile.name,
                            Icon:roleIconMap[member.role],
                        }))
                       }
                    ]}/>
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md"/>
            
            <div>
                {textchannels && textchannels.length > 0 && (
                        <div className="mb-2">
                            <ServerSection
                                channelType={ChannelType.TEXT}
                                label="TEXT"
                                role={role}
                                sectionType="channels"
                                server={server}
                            />
                            {textchannels.map((channel) => (
                                <ServerChannel channel={channel} key={channel.id} server={server}
                                name={channel.name} id={channel.id} />
                            ))}
                        </div>
                    )}
            </div>
            <div>
                {audiochannels && audiochannels.length > 0 && (
                        <div className="mb-2">
                            <ServerSection
                                channelType={ChannelType.TEXT}
                                label="AUDIO"
                                role={role}
                                sectionType="channels"
                                server={server}
                            />
                            {audiochannels.map((channel) => (
                                <ServerChannel channel={channel} key={channel.id} server={server}
                                name={channel.name} id={channel.id} />
                            ))}
                        </div>
                    )}
            </div>
            <div>
                {videochannels && videochannels.length > 0 && (
                        <div className="mb-2">
                            <ServerSection
                                channelType={ChannelType.TEXT}
                                label="VIDEO"
                                role={role}
                                sectionType="channels"
                                server={server}
                            />
                            {videochannels.map((channel) => (
                                <ServerChannel channel={channel} key={channel.id} server={server}
                                name={channel.name} id={channel.id} />
                            ))}
                        </div>
                    )}
            </div>
            <div>
                {members && members.length > 0 && (
                        <div className="mb-2">
                            <ServerSection
                                label="Members"
                                role={role}
                                sectionType="members"
                                server={server}
                            />
                            {members.map((member) => (
                                <ServerMember key={member.id} name={member.profile.email} id={member.id} 
                                role={member.role}/>
                            ))}
                        </div>
                    )}
            </div>
            </ScrollArea>
        </div>
    );
}
 
export default Serversidebar;