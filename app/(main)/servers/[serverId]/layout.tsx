
import Serversidebar from "@/components/Server/serversidebar";

export default function PageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params:{serverId:string};
}>) {
  return (
    <div className="flex flex-row h-full items-start">
      <div className="md:flex h-full w-[180px] z-30 flex-col fixed inset-y-0 left-[70px] bg-slate-200 dark:bg-slate-800">
        <Serversidebar  serverId={params.serverId}/>
      </div>
      <main className="flex h-full w-full fixed inset-y-0">
        {children}
      </main>
    </div>
  );
}
