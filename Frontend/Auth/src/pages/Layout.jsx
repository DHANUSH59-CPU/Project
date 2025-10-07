import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
