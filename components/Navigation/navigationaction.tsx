"use client"
import { useModel } from "@/hooks/use-modal-store";
import { Plus } from "lucide-react";

const NavigationAction = () => {
    const {onOpen}=useModel();
    return ( 
        <div className="group flex">
            <button 
                className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px]
                transition-all overflow-hidden items-center justify-center dark:bg-gray-800 bg-slate-300
                group-hover:bg-emerald-500" 
                onClick={() => { onOpen("createServer") }}
            >
                
                
                <Plus className="w-11 h-11 text-green-500 group-hover:text-white transition-colors duration-300" />
            </button>
        </div>
     );
}
 
export default NavigationAction;