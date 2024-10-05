import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-white dark:bg-[#313338] flex items-center justify-center z-50">
            <Loader2 className="animate-spin w-12 h-12 text-gray-600" />
        </div>
    );
}
