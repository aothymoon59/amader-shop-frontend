import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../shared/Header";
import Footer from "../shared/Footer";

const PublicLayout = () => {
  const location = useLocation();
  const isChatPage = location.pathname === "/account/chat";

  return (
    <div className={isChatPage ? "flex h-screen flex-col overflow-hidden" : "min-h-screen flex flex-col"}>
      <Header />
      <main className={isChatPage ? "min-h-0 flex-1 overflow-hidden" : "flex-1"}>
        <Outlet />
      </main>
      {isChatPage ? null : <Footer />}
    </div>
  );
};

export default PublicLayout;
