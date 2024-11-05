import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <>
      <main className="m-0">
        <Header />
        <Outlet />
        <Footer />
      </main>
    </>
  );
}
