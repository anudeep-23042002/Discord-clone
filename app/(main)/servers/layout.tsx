import NavigationSideBar from "@/components/Navigation/navigationsidebar";

export default function ServersLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-full flex">
      <div className="invisible md:visible md:flex h-full w-[70px] z-30 flex-col fixed inset-y-0 bg-white dark:bg-[#313338]">
        <NavigationSideBar />
      </div>
      <main className="flex-1 md:visible md:pl-[100px] h-full">
        {children}
      </main>
    </div>
  );
}
