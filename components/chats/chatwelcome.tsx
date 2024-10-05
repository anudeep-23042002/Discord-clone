"use client"
import { Hash } from "lucide-react";

interface ChatWelcomeProps{
    name:string;
    type:"channel" | "conversation"
}
const ChatWelcome = ({name,type}:ChatWelcomeProps) => {
    return ( 
            <div className="flex flex-col mb-auto">
                <Hash className="w-10 h-10"/>
                <p className="font-bold md:text-xl text-3xl">Welcome to #{name}</p>
                {type==="channel" && (
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">This is the start of #{name} channel</p>
                )}
            </div> 
     );
}
 
export default ChatWelcome;