"use client"

import { Smile } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import data from "@emoji-mart/data";
import  Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";

interface EmojiPickerProps{
    onChange:(value:string)=>void
}
const EmojiPicker = ({onChange}:EmojiPickerProps) => {
    const {resolvedTheme}=useTheme();
    return ( 
        <div>
            <Popover>
                <PopoverTrigger>
                    <Smile/>
                </PopoverTrigger>
                <PopoverContent
                side="right">
                    <Picker
                    theme={resolvedTheme}
                    data={data}
                    onEmojiSelect={(emoji:any)=>onChange(emoji.native)}/>
                </PopoverContent>
            </Popover>
        </div>
     );
}
 
export default EmojiPicker;