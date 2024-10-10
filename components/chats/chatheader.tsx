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
    return (
        <div className="text-md font-semibold px-1 flex items-center h-12 border-neutral-200 
        dark:border-neutral-800 border-b-2">
                <MobileToggle serverId={serverId}/>
                <Hash className="ml-2 mt-1 text-zinc-500 dark:text-zinc-400"/>
                <p className="ml-2 mt-1 font-semibold">{name}</p>
                <div className="flex ml-auto">
                    <Socketindicator />
                </div>
                {type==="member" &&(
                    <div className="ml-2 mt-2">
                        <VideoButton/>
                    </div>
                )}
        </div>
    )
}
 
export default Chatheader;