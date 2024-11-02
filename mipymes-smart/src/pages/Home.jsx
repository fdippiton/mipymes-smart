import { useEffect, useState } from "react";
import unphuMiPymes from "../assets/unphuMiPymes.jpg";
import miPymes from "../assets/miPymes.jpg";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const response = await fetch("http://localhost:4000/post");
  //         const responseToJson = await response.json();
  //         setPosts(responseToJson);
  //         console.log(responseToJson);
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       }
  //     };

  //     fetchData();
  //   }, []);

  return (
    <>
      <section
        className="flex justify-start items-center p-20"
        style={{
          position: "relative",
          backgroundImage: `url(${miPymes})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "80vh",
          color: "#fff",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)", // Ajusta la opacidad a tu preferencia
            zIndex: 1,
          }}
        ></div>
        <div className="text-left" style={{ maxWidth: "800px", zIndex: 2 }}>
          <h1 className=" font-bold text-5xl">
            Bienvenido al Centro MiPymes Unphu
          </h1>
          <p className=" mt-3 mb-8 font-medium text-xl">
            Apoyamos el crecimiento de emprendedores y pequeñas empresas con
            asesorías, recursos y herramientas para su éxito.
          </p>
          <Link
            to="/signup"
            className=" px-10 py-5 mt-8 cursor-pointer  bg-green-500 rounded-lg p-3"
          >
            Registrate
          </Link>
        </div>
      </section>
    </>
  );
}
