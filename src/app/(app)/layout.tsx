import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 w-full ">
        <Topbar />
        <main className="pt-3">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
