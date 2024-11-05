import { useEffect, useState } from "react";
// import unphuMiPymes from "../assets/unphuMiPymes.jpg";
import miPymes from "../assets/miPymes.jpg";
import { Link, useNavigate } from "react-router-dom";
import { IoBusiness } from "react-icons/io5";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { FaComputer } from "react-icons/fa6";
import { MdOutlineSupportAgent } from "react-icons/md";

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
          <h1 className=" font-bold text-5xl  drop-shadow-lg tracking-normal text italic">
            Bienvenido a{" "}
            <span className="text-emerald-500">MiPymes Unphu Smart</span>
          </h1>
          <p className=" mt-3 mb-8 font-normal text-xl tracking-normal">
            Apoyamos el crecimiento de emprendedores y pequeñas empresas con
            asesorías, recursos y herramientas para su éxito.
          </p>
          <Link
            to="/signup"
            className="tracking-normal px-14 py-3 mt-8 hover:bg-emerald-500 cursor-pointer text-sm bg-verdementa rounded-lg p-3 drop-shadow-2xl"
          >
            Registrate
          </Link>
        </div>
      </section>
      <div className="bg-white pb-20 pt-14 px-4">
        <h3 className="text-emerald-600 text-center font-extrabold text-3xl mb-10 tracking-wide">
          Nuestros Servicios
        </h3>

        <div className="flex flex-wrap justify-center gap-10 px-8">
          <div className="flex flex-col items-center bg-emerald-100 rounded-lg p-8 w-60 hover:shadow-2xl transition duration-300">
            <IoBusiness className="text-emerald-700 mb-3" size={50} />
            <h4 className="text-lg font-bold text-gray-800">
              Asesoría Empresarial
            </h4>
          </div>

          <div className="flex flex-col items-center bg-emerald-100 rounded-lg p-8 w-60 hover:shadow-2xl transition duration-300">
            <FaMoneyCheckAlt className="text-emerald-700 mb-3" size={50} />
            <h4 className="text-lg font-bold text-gray-800">
              Asesoría Financiera
            </h4>
          </div>

          <div className="flex flex-col items-center bg-emerald-100 rounded-lg p-8 w-60 hover:shadow-2xl transition duration-300">
            <FaComputer className="text-emerald-700 mb-3" size={50} />
            <h4 className="text-lg font-bold text-gray-800">
              Asesoría Tecnológica
            </h4>
          </div>

          <div className="flex flex-col items-center bg-emerald-100 rounded-lg p-8 w-60 hover:shadow-2xl transition duration-300">
            <MdOutlineSupportAgent
              className="text-emerald-700 mb-3"
              size={50}
            />
            <h4 className="text-lg font-bold text-gray-800">
              Apoyo Asociaciones y Cooperativas
            </h4>
          </div>
        </div>
      </div>
    </>
  );
}
