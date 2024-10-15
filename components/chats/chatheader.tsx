import { db } from "@/lib/db";
import { Channel, Member } from "@prisma/client";
import { useEffect } from "react";
import Socketindicator from "../socket-indicator";
import VideoButton from "../videobutton";
import { Hash, Plus } from "lucide-react";
import MobileToggle from "../mobileToggle";

interface ChatheaderProps{
    type:"member" | "channel"
    serverId:string,
    name:string
}
const Chatheader = ({type,serverId,name}:ChatheaderProps) => {
    let displayname=name;
    if(type=="member"){
        displayname=name.split("@")[0];
    }
    return (
        <div className="text-md font-semibold px-1 flex items-center h-12 border-neutral-200 
        dark:border-neutral-800 border-b-2">
                <MobileToggle serverId={serverId}/>
                <Hash className="ml-2 mt-1 text-zinc-500 dark:text-zinc-400"/>
                <p className="flex-1 ml-2 mt-1 whitespace-nowrap overflow-hidden text-ellipsis font-semibold">{displayname}</p>
                {type==="member" &&(
                    <div className="ml-auto mt-2 pr-2">
                        <VideoButton/>
                    </div>
                )}
                <div className="ml-auto">
                    <Socketindicator />
                </div>
        </div>
    )
}
 
export default Chatheader;