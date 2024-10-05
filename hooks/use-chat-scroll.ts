import { useEffect, useState } from "react";

type ChatScrollProps={
    chatRef:React.RefObject<HTMLDivElement>;
    bottomRef:React.RefObject<HTMLDivElement>;
    shouldLoadMore:boolean;
    loadMore:()=>void;
    count:number
};
export const useChatScroll=({chatRef,bottomRef,shouldLoadMore,loadMore,count}:ChatScrollProps)=>{
    const [hasInitialized,sethasInitialized]=useState(false);
    useEffect(()=>{
        const topDiv=chatRef?.current;
        const handleScroll=()=>{
            const ScrollTop=topDiv?.scrollTop;

            if(ScrollTop==0 && shouldLoadMore){
                loadMore();
            }
        };
        topDiv?.addEventListener("scroll",handleScroll);

        return ()=>{
            topDiv?.removeEventListener("scroll",handleScroll);
        }
    },[shouldLoadMore,loadMore,chatRef]);

    useEffect(()=>{
        const bottomDiv=bottomRef?.current;
        const topDiv=chatRef?.current;

        const ShouldAutoScroll=()=>{
            if(!hasInitialized && bottomDiv){
                sethasInitialized(true);
                return true;
            }
            if(!topDiv){
                return false;
            }

            const distanceFromBotton=topDiv.scrollHeight-topDiv.scrollTop-topDiv.clientHeight;
            return distanceFromBotton<=100;
        };
        if(!ShouldAutoScroll){
            setTimeout(()=>{
                bottomRef.current?.scrollIntoView({
                    behavior:"smooth"
                })
            },100);
        }
    },[bottomRef,chatRef,hasInitialized,count]);
}