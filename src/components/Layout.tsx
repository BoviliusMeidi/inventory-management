import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
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

export default Layout;
