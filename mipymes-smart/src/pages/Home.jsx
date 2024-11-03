import { useEffect, useState } from "react";
import unphuMiPymes from "../assets/unphuMiPymes.jpg";
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
          <p className=" mt-3 mb-8 font-normal text-lg tracking-normal">
            Apoyamos el crecimiento de emprendedores y pequeñas empresas con
            asesorías, recursos y herramientas para su éxito.
          </p>
          <Link
            to="/signup"
            className="tracking-normal px-14 py-3 mt-8 hover:bg-indigo-500 cursor-pointer text-sm bg-emerald-500 rounded-lg p-3 drop-shadow-2xl"
          >
            Registrate
          </Link>
        </div>
      </section>
      <div>
        <h3 className="text-emerald-500 text-center font-bold text-2xl py-10 italic drop-shadow-lg">
          Nuestros servicios
        </h3>

        <div className="px-32">
          <div className="flex flex-wrap justify-between items-center ">
            <div className="">
              <h1 className="font-medium flex flex-col items-center">
                <IoBusiness
                  className=""
                  style={{ width: "70px", height: "70px" }}
                />{" "}
                <span>Asesoría Empresarial</span>
              </h1>
            </div>
            <div className="flex flex-wrap justify-between items-center">
              <h1 className="font-medium flex flex-col items-center">
                <FaMoneyCheckAlt style={{ width: "70px", height: "70px" }} />
                Asesoría Financiera
              </h1>
            </div>
            <div className="flex flex-wrap justify-between items-center">
              <h1 className="font-medium flex flex-col items-center">
                <FaComputer style={{ width: "70px", height: "70px" }} />
                Asesoría Tecnologica
              </h1>
            </div>
            <div className="flex flex-wrap justify-between items-center">
              <h1 className="font-medium flex flex-col items-center">
                <MdOutlineSupportAgent
                  style={{ width: "70px", height: "70px" }}
                />
                Apoyo con una asociación y/o cooperativa{" "}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
