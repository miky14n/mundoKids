"use client";
import { useState } from "react";
import SimpleInput from "@/components/Input";
import PersonalButton from "@/components/Button";
import Alert from "@/components/Alert";
import SimpleDropdown from "@/components/SimpleDropdown";

export default function MedicalAppointment() {
  const [patientName, setPatientName] = useState("");
  const [ci, setCI] = useState("");
  const [specialty, setSpecialty] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [consultType, setConsultType] = useState(null);
  const [specialtyCost, setSpecialtyCost] = useState("");
  const [summary, setSummary] = useState("");
  const [success, setSuccess] = useState(null);

  const specialtyItems = [
    { key: "1", label: "Cardiología" },
    { key: "2", label: "Pediatría" },
    { key: "3", label: "Dermatología" },
  ];

  const doctorItems = [
    { key: "1", label: "Dr. López" },
    { key: "2", label: "Dra. García" },
    { key: "3", label: "Dr. Ramírez" },
  ];

  const consultTypeItems = [
    { key: "1", label: "Consulta" },
    { key: "2", label: "Emergencia" },
  ];

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
      <div className="flex flex-col items-center justify-center pt-10 bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-5xl w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Registro de Paciente
          </h2>

          {/* Fila para Encargada y CI del Paciente */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <SimpleInput
                type="text"
                label="Encargada"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
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

          {/* Fila para Especialidades, Tipo de Consulta y Doctor */}
          <div className="grid grid-cols-3 gap-6 mt-4">
            <div>
              <SimpleDropdown
                buttonLabel="Especialidades"
                menuItems={specialtyItems}
                ariaLabel="Specialty"
                setItem={setSpecialty}
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
            <div>
              <SimpleDropdown
                buttonLabel="Doctor"
                menuItems={doctorItems}
                ariaLabel="Doctor"
                setItem={setDoctor}
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
                onChange={(e) => setSpecialtyCost(e.target.value)}
              />
            </div>
            <div>
              <SimpleInput
                type="text"
                label="Resumen del monto a pagar"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
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
