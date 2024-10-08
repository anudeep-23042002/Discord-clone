
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./avatar";

interface UserAvatorProps{
    src?:string;
    className?:string;
}
const UserAvator = ({src,className}:UserAvatorProps) => {
    return ( 
        <Avatar className={cn(
            "h-7 w-7 md:h-10 md:w-10",
            className
        )}>
            <AvatarImage src={src}/>
        </Avatar>
     );
}
 
export default UserAvator;