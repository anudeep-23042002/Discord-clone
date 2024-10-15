import Chatheader from "@/components/chats/chatheader";
import ChatInput from "@/components/chats/chatInput";
import ChatMessages from "@/components/chats/chatmessages";
import { ChannelType } from "@prisma/client"
import Currentprofile from "@/lib/currentprofilemodel";
import { db } from "@/lib/db";
import { redirect, useParams } from "next/navigation";
import MediaRoom from "@/components/media";

interface ChannelIDPageprops{
    params:{
        serverId:string;
        channelId:string;
    }
}
const ChannelIDPage = async({params}:ChannelIDPageprops) => {
    const profile=await Currentprofile();
    if(!profile){
        redirect("/");
    }
    const channel= await db.channel.findUnique({
        where:{
            id:params.channelId
        }
    })

    const member=await db.member.findFirst({
        where:{
            serverId:params.serverId,
            profileId:profile.id
        }
    })
    if(!channel || !member){
        redirect("/");
    }
    return (  
        <div className="flex flex-col h-full md:pl-[150px] w-full bg-white dark:bg-[#313338]">
            {/* TODO */}
            
            <Chatheader type="channel" serverId={params.serverId} name={channel?.name}/>
            {channel.type===ChannelType.TEXT && (
                <div className="flex-1 flex flex-col-reverse overflow-y-auto">
                    <ChatMessages 
                        name={channel.name}
                        member={member}
                        chatId={channel.id}
                        type="channel"
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages/"
                        socketQuery={{
                            channelId:channel.id,
                            serverId:channel.serverId
                        }}
                        paramKey="channelId"
                        paramValue={channel.id}
                        />
                </div>
            )}
            {channel.type===ChannelType.AUDIO && (
                <div className="flex-1 overflow-y-auto">
                    <MediaRoom
                        ChatId={channel.id}
                        Audio={true}
                        Video={false}
                    />
                </div>
            )}
            
            {channel.type===ChannelType.VIDEO && (
                <div className="flex-1 overflow-y-auto">
                    <MediaRoom
                        ChatId={channel.id}
                        Audio={true}
                        Video={true}
                    />
                </div>
            )}
            {channel.type===ChannelType.TEXT &&(<ChatInput  
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
                channelId:channel.id,
                serverId:channel.serverId
            }}
            fileUrl=""
            />)}
        </div>
    );
}
 
export default ChannelIDPage;