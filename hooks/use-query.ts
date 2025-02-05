"use client"
import { useSocket } from "@/components/providers/socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";
interface ChatQueryProps{
    queryKey:string;
    apiUrl:string;
    paramKey:"channelId" | "conversationId";
    paramValue:string;
}

export const useChatQuery=({queryKey,apiUrl,paramKey,paramValue}:ChatQueryProps)=>{
    const {isConnected}=useSocket();
    const fetchMessages=async({pageParam=undefined})=>{
        console.log("pageparam",pageParam);
        const url=qs.stringifyUrl({
            url:apiUrl,
            query:{
                cursor:pageParam,
                [paramKey]:paramValue
            }
        },{skipNull:true});
        const res=await fetch(url);
        return res.json();
    };
    //@ts-ignore
    const {data,fetchNextPage,hasNextPage,isFetchingNextPage,status}=useInfiniteQuery({
        queryKey: [queryKey],
        queryFn:fetchMessages,
        getNextPageParam:(lastPage)=>lastPage?.nextCursor,
        refetchInterval:isConnected?false:1000
    });
    console.log("usechatquery");
    console.log(data);
    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    };
}