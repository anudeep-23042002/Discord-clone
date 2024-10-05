import Chatheader from "@/components/chats/chatheader";
import ChatInput from "@/components/chats/chatInput";
import ChatMessages from "@/components/chats/chatmessages";
import MediaRoom from "@/components/media";
import { getOrCreateConversation } from "@/lib/conversation";
import Currentprofile from "@/lib/currentprofilemodel";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface MemberIDPageprops{
    params:{
        serverId:string,
        memberId:string
    },
    searchParams:{
        video:boolean,
    }
}
const MemberIDPage = async({params,searchParams}:MemberIDPageprops) => {
    const profile=await Currentprofile();
    if(!profile){
        return redirect("/");
    }
    const currentMember=await db.member.findFirst({
        where:{
            serverId:params.serverId,
            profileId:profile.id
        },
        include:{
            profile:true
        }
    });
    if(!currentMember){
        return redirect("/");
    }
    const conversation=await getOrCreateConversation(currentMember.id,params.memberId);
    if(!conversation){
        return redirect(`/servers/${params.serverId}`);
    }

    const {memberOne,memberTwo}= conversation;
    const otherMember=memberOne.profile.id==profile.id?memberTwo:memberOne;
    return ( 
        <div className="flex flex-col h-full pl-[150px] w-full bg-white dark:bg-[#313338]">
            <Chatheader type="member" serverId={params.serverId} name={otherMember.profile.name}/>
            <div>
                {searchParams?.video && (
                    <MediaRoom 
                    ChatId={conversation.id}
                    Audio={true}
                    Video={false}>

                    </MediaRoom>
                )}
                {!searchParams?.video && (
                    <div>
                        <ChatMessages
                            name={otherMember.profile.name}
                            member={currentMember}
                            chatId={conversation.id}
                            type="conversation"
                            apiUrl="/api/direct-messages/"
                            paramValue={conversation.id}
                            paramKey="conversationId"
                            socketUrl="/api/socket/direct-messages/"
                            socketQuery={{
                                conversationId:conversation.id
                            }}
                            />
                            <ChatInput
                            apiUrl="/api/socket/direct-messages/"
                            name={otherMember.profile.name}
                            type="conversation"
                            query={{
                                conversationId:conversation.id
                            }}
                            />
                    </div>
                )}
            </div>
        </div>
     );
}
 
export default MemberIDPage;