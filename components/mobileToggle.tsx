import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Serversidebar from "./Server/serversidebar";
import NavigationSideBar from "./Navigation/navigationsidebar";
  
const MobileToggle = ({serverId}:{serverId:string}) => {
    //TODO SHOW TOGGLE BUTTON ONLY IN MOBILE VIEW   
    return ( 
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="block md:!hidden">
                    <Menu/>
                </Button>
            </SheetTrigger>
            
            <SheetContent side="left" className="flex gap-0">
                <div className="w-[72px]">
                    <NavigationSideBar/>
                </div>
                <Serversidebar serverId={serverId}/>
            </SheetContent>
            </Sheet>

     );
}
 
export default MobileToggle;