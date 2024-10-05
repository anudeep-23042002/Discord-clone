"use client"
import { useUser } from "@clerk/nextjs";
import {LiveKitRoom,VideoConference} from "@livekit/components-react";
import "@livekit/components-styles";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface MediaRoomProps{
    ChatId:string;
    Video:boolean;
    Audio:boolean;
};
const MediaRoom = ({ChatId,Video,Audio}:MediaRoomProps) => {
    const {user}=useUser();
    const [token,settoken]=useState("");

    useEffect(()=>{
        let name="";
        if(!user?.firstName || !user?.lastName){
            name="user";
        }
        else{
            name=`${user.firstName} ${user.lastName}`;
        }
        (async ()=>{
            try{
                const resp=await fetch(`/api/livekit?room=${ChatId}&username=${name}`);
                const data=await resp.json();
                settoken(data.token);
            }catch(e){
                console.log("error",e);
            }
        })();
    },[user?.firstName,user?.lastName,ChatId]);
    if(token===""){
        return (
            <div>
                <Loader2 className="h-4 w-4 animate-spin"/>
            </div>
        )
    }
    return (  
        <div>
            <LiveKitRoom 
                data-lk-theme="default"
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                token={token}
                connect={true}
                video={Video}
                audio={Audio}
            >
                <VideoConference/>
            </LiveKitRoom>
        </div>
    );
}
 
export default MediaRoom;