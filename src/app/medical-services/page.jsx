"use client";
import { useState, useEffect, useRef } from "react";
import SimpleInput from "@/components/Input";
import PersonalButton from "@/components/Button";
import Alert from "@/components/Alert";
import ApiDropdown from "@/components/ApiDropdown";
import Seeker from "@/components/Seeker";
import ToggleSwitch from "@/components/ToggleSwitch";

export default function Services() {
  const [showSeekerCi, setShowSeekerCi] = useState(false);
  const [patient, setPatient] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [ci, setCI] = useState("");
  const [services, setServices] = useState(null);
  const [servicesCost, setServicesCost] = useState("");
  const [success, setSuccess] = useState(null);
  const [patientLastName, setPatientLastName] = useState("");
  const [responsible, setResponsible] = useState(
    localStorage.getItem("userName")
  );
  const patient_id = useRef(null);
  useEffect(() => {
    if (ci && ci !== "") {
      const fetchPatient = async () => {
        try {
          const response = await fetch(`/api/patients/${ci}`);
          if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status}`);
          }
          const data = await response.json();
          setPatientName(data[0].name);
          setPatientLastName(data[0].last_name);
          patient_id.current = data[0].patient_id;
        } catch (error) {
          setPatientName("No existe el paciente");
          setPatientLastName("");
        }
      };
      fetchPatient();
    }
  }, [ci]);
  useEffect(() => {
    if (services && services !== "") {
      const fetchOneServices = async () => {
        try {
          const response = await fetch(`/api/services/${services}`);
          if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status}`);
          }
          const data = await response.json();
          setServicesCost(data[0].price);
        } catch (error) {
          console.error("Error al buscar al paciente:", error);
          setPatientName("No existe el paciente");
          setPatientLastName("");
        }
      };
      fetchOneServices();
    }
  }, [services]);
  const today = new Date();
  const date = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
  const handleRegister = async () => {
    console.log(patient);
    const data = {
      patient_id: patient.patient_id || patient_id.current,
      services_id: services,
      date: date,
      responsible,
    };
    console.log("Los datos a mandar:" + JSON.stringify(data));
    try {
      const response = await fetch("/api/medical_services", {
        method: "POST",
        body: JSON.stringify(data),

        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log(response);
        setSuccess(true);
        resetForm();
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error al registrar el paciente:", error);
      setSuccess(false);
    }
  };

  const resetForm = () => {
    setPatientName("");
    setCI("");
    setServices(null);
    setServicesCost("");
    setPatientLastName("");
    setResponsible("");
    patient_id.current = "";
  };
  return (
    <>
      {success === true && (
        <Alert
          message="Registro exitoso!"
          color="success"
          link=""
          setStatus={setSuccess}
        />
      )}
      {success === false && (
        <Alert
          message="Error al registrar"
          color="danger"
          link=""
          setStatus={setSuccess}
        />
      )}
      <div className="flex flex-col items-center justify-center mt-16 bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-5xl w-full mt-40 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Servicios Medicos
          </h2>

          {/* Fila para Encargada y CI del Paciente */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <SimpleInput
                type="text"
                label="Encargado"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                readonly={true}
              />
            </div>
            <Seeker
              className="w-full"
              title="Buscar paciente"
              description="Ingrese nombre del paciente"
              resultSeek="Resultado de la busqueda"
              voidMessage="No se encontro el paciente"
              apiUrl="/api/patients?search"
              getValue={setPatient}
            ></Seeker>
          </div>
          {/* Fila para datos complementarios */}
          <div className="grid grid-cols-1 gap-6 mt-4">
            <ToggleSwitch status={setShowSeekerCi} title="Buscar por CI" />
            {showSeekerCi && (
              <div className="grid grid-cols-3 gap-6 mt-4">
                <div>
                  <SimpleInput
                    type="text"
                    label="Ingrese el CI del paciente"
                    value={ci}
                    onChange={(e) => setCI(e.target.value)}
                  />
                </div>
                <div>
                  <SimpleInput
                    type="text"
                    label="Nombre"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    readOnly
                  />
                </div>
                <div>
                  <SimpleInput
                    type="text"
                    label="Apellido"
                    value={patientLastName}
                    onChange={(e) => setPatientLastName(e.target.value)}
                    readOnly
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-6 mt-4">
            <div>
              <ApiDropdown
                buttonLabel={services}
                defaultText="Seleccione un Servicio"
                urlApi="/api/services"
                onActionId={(selectedSpecialty) =>
                  setServices(selectedSpecialty)
                }
                idOfGet="services_id"
                nameOfGet="name"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <SimpleInput
                type="text"
                label="Costo del servicio medico"
                value={servicesCost}
                readOnly
              />
            </div>
          </div>

          {/* Botón de Guardar */}
          <div className="flex justify-around mt-6">
            <PersonalButton
              content="Borrar"
              color="danger"
              action={resetForm}
            />
            <PersonalButton
              content="Agendar"
              color="secondary"
              variant="ghost"
              action={handleRegister}
            />
          </div>
        </div>
      </div>
    </>
  );
}
