import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Header from "../components/Header";

const Layout = () => {
  return (
    <>
      <Header />
      <main className="flex-grow ">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
