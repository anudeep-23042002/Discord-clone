"use client"
import { Member, Message, Profile } from "@prisma/client";
import ChatWelcome from "./chatwelcome";
import { useChatQuery } from "@/hooks/use-query";
import { Loader2, ServerCrash } from "lucide-react";
import {format} from "date-fns";
import { ElementRef, Fragment, useRef } from "react";
import ChatItem from "./chatItem";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { group } from "console";

interface ChatMessagesProps{
    name:string;
    member:Member;
    chatId:string;
    apiUrl:string;
    socketUrl:string;
    socketQuery:Record<string,string>;
    paramKey:"channelId" | "conversationId";
    paramValue:string;
    type: "channel" | "conversation";
}
type MessageWithMemberWithProfile=Message & {
    member:Member &{
        profile:Profile
    }
}
const dateFormat="d MMM yyy, HH:mm"
const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type
}:ChatMessagesProps) => {
    const queryKey=`chat:${chatId}`;
    const addKey=`chat:${chatId}:messages`;
    const updateKey=`chat:${chatId}:update`;

    const chatRef=useRef<ElementRef<"div">>(null);
    const bottomRef=useRef<ElementRef<"div">>(null);

    const {data,fetchNextPage,hasNextPage,isFetchingNextPage,status}=useChatQuery({queryKey,apiUrl,paramKey,paramValue});
    useChatSocket({queryKey,addKey,updateKey});
    useChatScroll({
        chatRef,
        bottomRef,
        loadMore:fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count:data?.pages?.[0]?.items?.length ?? 0,
    })
    console.log("STATUS",status);
    if(status=== 'pending'){
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-800 bg-opacity-50">
                <div className="flex flex-col items-center">
                    <p className="mb-2 text-white">Fetching messages</p>
                    <Loader2 className="animate-spin h-6 w-6 text-white" />
                </div>
            </div>
        )
    }
    if(status=== "error"){
        return (
            <div>
                <ServerCrash/>
            </div>
        )
    }
    console.log("GROUP",data.pages[0].items);
    return ( 
        <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
            {!hasNextPage && (<div className="flex-1"/>)}
                {!hasNextPage && (
                    <ChatWelcome name={name} type={type}/>
                    )}
                {hasNextPage && (
                    <div className="flex justify-center">
                        {isFetchingNextPage ? (
                            <div>
                                <Loader2 className="h-4 w-4 text-zinc-500 animate-spin my-4"/>
                            </div>
                        ):(<button 
                            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 
                            dark:hover:text-zinc-300 text-xs my-4 transition"
                        onClick={()=>fetchNextPage()}>
                            Load previous messages
                        </button>)}
                    </div>
                )}
                <div className="flex flex-col-reverse mt-auto">
                    {data?.pages?.map((group,i)=>(
                        <Fragment key={i}>
                            {group && group?.items?.map((message:MessageWithMemberWithProfile)=>(
                                <div key={message.id}>
                                    <ChatItem
                                        key={message.id}
                                        id={message.id}
                                        currentMember={member}
                                        member={message.member}
                                        content={message.content}
                                        fileUrl={message.fileUrl}
                                        deleted={message.delete}
                                        timestamp={format(new Date(message.createdAt),dateFormat)}
                                         isUpdated={message.createdAt!==message.updtedAt}
                                        socketUrl={socketUrl}
                                        socketQuery={socketQuery}
                                    />
                                </div>
                            ))}
                        </Fragment>
                    ))}
                </div>
            <div ref={bottomRef}/>
        </div>
     );
}
 
export default ChatMessages;