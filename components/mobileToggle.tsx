import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Serversidebar from "./Server/serversidebar";
import NavigationSideBar from "./Navigation/navigationsidebar";

const MobileToggle = ({ serverId }: { serverId: string }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="block md:!hidden">
                    <Menu />
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="p-0"> 
                <div className="flex h-full">
                    <div className="w-[72px] h-full">
                        <NavigationSideBar />
                    </div>
                    <div className="flex-1 h-full bg-slate-200 dark:bg-slate-800">
                        <Serversidebar serverId={serverId} />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default MobileToggle;
