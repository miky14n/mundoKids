"use client";
import { useState, useEffect } from "react";
import SimpleInput from "@/components/Input";
import PersonalButton from "@/components/Button";
import Alert from "@/components/Alert";
import SimpleDropdown from "@/components/SimpleDropdown";
import ApiDropdown from "@/components/ApiDropdown";

export default function MedicalAppointment() {
  const [patientName, setPatientName] = useState("");
  const [ci, setCI] = useState("");
  const [specialty, setSpecialty] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [consultType, setConsultType] = useState(null);
  const [specialtyCost, setSpecialtyCost] = useState("");
  const [summary, setSummary] = useState("");
  const [success, setSuccess] = useState(null);
  const [patientLastName, setPatientLastName] = useState("");
  const [responsible, setResponsible] = useState("");
  const consultTypeItems = [
    { key: "1", label: "Consulta" },
    { key: "2", label: "Emergencia" },
  ];
  useEffect(() => {
    if (ci && ci !== "") {
      const fetchDoctor = async () => {
        try {
          const response = await fetch(`/api/patients/${ci}`);
          if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status}`);
          }
          const data = await response.json();
          console.log("Datos del paciente:", data);
          setPatientName(data[0].name);
          setPatientLastName(data[0].last_name);
        } catch (error) {
          console.error("Error al buscar al paciente:", error);
          setPatientName("No existe el paciente");
          setPatientLastName("");
        }
      };
      fetchDoctor();
    }
  }, [ci]);
  useEffect(() => {
    if (specialty && specialty !== "") {
      const fetchDoctor = async () => {
        try {
          const response = await fetch(`/api/specialty/${specialty}`);
          if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status}`);
          }
          const data = await response.json();
          console.log("Datos del paciente:", data);
          setSpecialtyCost(data[0].price);
        } catch (error) {
          console.error("Error al buscar al paciente:", error);
          setPatientName("No existe el paciente");
          setPatientLastName("");
        }
      };
      fetchDoctor();
    }
  }, [specialty]);

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
            Registro de Paciente
          </h2>

          {/* Fila para Encargada y CI del Paciente */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <SimpleInput
                type="text"
                label="Encargada"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
              />
            </div>
            <div>
              <SimpleInput
                type="text"
                label="Ingrese el CI del paciente"
                value={ci}
                onChange={(e) => setCI(e.target.value)}
              />
            </div>
          </div>
          {/* Fila para datos complementarios */}
          <div className="grid grid-cols-3 gap-6 mt-4">
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

          {/* Fila para Especialidades, Tipo de Consulta y Doctor */}
          <div className="grid grid-cols-3 gap-6 mt-4">
            <div>
              <ApiDropdown
                buttonLabel="Especialidades"
                urlApi="/api/specialty"
                onActionId={(selectedSpecialty) =>
                  setSpecialty(selectedSpecialty)
                }
                idOfGet="specialty_id"
                nameOfGet="name"
              />
            </div>

            <div>
              <ApiDropdown
                buttonLabel="Doctor"
                urlApi="/api/doctor"
                onActionId={(selectedDoctor) => setDoctor(selectedDoctor)}
                idOfGet="doctor_id"
                nameOfGet="name"
              />
            </div>
            <div>
              <SimpleDropdown
                buttonLabel="Consulta"
                menuItems={consultTypeItems}
                ariaLabel="Consult Type"
                setItem={setConsultType}
              />
            </div>
          </div>

          {/* Fila para Costo de Especialidad y Resumen */}
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <SimpleInput
                type="text"
                label="Costo de Especialidad"
                value={specialtyCost}
                readOnly
              />
            </div>
          </div>

          {/* Botón de Guardar */}
          <div className="flex justify-center mt-6">
            <PersonalButton
              content="Guardar"
              color="secondary"
              variant="ghost"
              onClick={() => setSuccess(true)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
