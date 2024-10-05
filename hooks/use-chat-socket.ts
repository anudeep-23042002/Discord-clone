import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { use, useEffect } from "react";

type SocketProps={
    addKey:string;
    updateKey:string;
    queryKey:string;
}
type MessagewithMemberwithProfile=Message & {
    member:Member & {
        profile:Profile;
    }
};
export const useChatSocket=({addKey,updateKey,queryKey}:SocketProps)=>{
    const {socket}=useSocket();
    const queryClient=useQueryClient();
    useEffect(()=>{
        if(!socket){
            return;
        }
        socket.on(updateKey,(message:MessagewithMemberwithProfile)=>{
            queryClient.setQueryData([queryKey],(oldData:any)=>{
                if(!oldData || !oldData.pages || oldData.length==0){
                    return oldData;
                }
                const newData=oldData.pages.map((item:MessagewithMemberwithProfile)=>{
                    if(item.id==message.id){
                        return message;
                    }
                    return item;
                });
                return {...oldData,pages:newData};
            })
        });
        socket.on(addKey,(newMessage:MessagewithMemberwithProfile)=>{
            queryClient.setQueryData([queryKey],(oldData:any)=>{
                if(!oldData || !oldData.pages || oldData.length==0){
                    return {
                        pages:[{items:[newMessage]}]
                    };
                }
                const newData=[...oldData.pages];
                newData[0]={
                    ...newData[0],
                    items:[
                        newMessage,
                        ...(newData[0].items),
                    ]
                };
                return {
                    ...oldData,pages:newData
                };
            })
        });
        return ()=>{
            socket.off(addKey);
            socket.off(updateKey);
        }
    },[queryClient,addKey,queryKey,socket,updateKey]);
}
