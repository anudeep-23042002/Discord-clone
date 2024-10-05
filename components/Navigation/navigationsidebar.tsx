import { db } from "../../lib/db";
import NavigationAction from "./navigationaction";
import Currentprofile from "@/lib/currentprofilemodel";
import NavigationItem from "./navigationitem";
import { ModeToggle } from "../ui/modetoggle";
import { UserButton } from "@clerk/nextjs";

const NavigationSideBar = async() => {
    const profile=await Currentprofile();
    const servers=await db.server.findMany({
        where:{
            members:{
                some:{
                    profileId:profile?.id
                }
            }
        }
    });
    return ( 
        <div className="flex flex-col space-y-2 h-full">
            <NavigationAction/>
            <div className="flex flex-col space-y-2 flex-grow">  
                {servers.map((element)=>(
                    <div key={element.id}>
                        <NavigationItem server={element}/>
                    </div>
                ))}
             </div>
             <div className="flex flex-col items-center mt-auto p-4 space-y-2">
                <div>
                    <ModeToggle/>
                </div>
                
                <div>
                    <UserButton/>
                </div>
                
            </div>
        </div>
     );
}
 
export default NavigationSideBar;