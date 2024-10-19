import Image from "next/image";
import Card from "../components/Cardard";
export default function Home() {
  const propsRegister = {
    img: "/kids.png",
    title: "Registrar Niño",
    description:
      "Registrar nuevo paciente en caso de ser primera vez en la clinica",
    path: "/register",
    titleButton: "Registrar",
  };
  const propsConsult = {
    img: "/consulta.png",
    title: "Agendar Consulta",
    description:
      "Agendar consulta para paciente que ya posea un registro dentro de la clinica",
    path: "/medicalAppointment",
    titleButton: "Consulta",
  };
  const propsServices = {
    img: "/Services.png",
    title: "Registar Servicio",
    description: "Registrar servicio externo a consultas ",
    path: "/services",
    titleButton: "Servicios",
  };
  return (
    <div className="flex justify-center space-x-8 mt-40 mb-10">
      <Card {...propsRegister}></Card>
      <Card {...propsConsult}></Card>
      <Card {...propsServices}></Card>
    </div>
  );
}
