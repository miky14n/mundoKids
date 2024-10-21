"use client";
import { useState } from "react";
import SimpleInput from "@/components/Input";
import PersonalButton from "@/components/Button";
import Alert from "@/components/Alert";
import SimpleDropdown from "@/components/SimpleDropdown";
import InputDate from "@/components/InputDate";
export default function Register() {
  const [patientName, setPatientName] = useState("");
  const [ci, setCI] = useState("");
  const [dateBorn, setDateBorn] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [success, setSuccess] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const items = [
    { key: "masculino", label: "Masculino" },
    { key: "femenino", label: "Femenino" },
  ];
  console.log("soy fec nac" + dateBorn);
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 ">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-5xl w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Registro de Paciente
          </h2>

          {/* Fila para Nombre del Paciente, CI, Género */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <SimpleInput
                type="text"
                label="Nombre del paciente"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>
            <div>
              <SimpleInput
                type="text"
                label="Ingrese el CI"
                value={ci}
                onChange={(e) => setCI(e.target.value)}
              />
            </div>
            <div>
              <SimpleDropdown
                buttonLabel="Seleccione el género"
                menuItems={items}
                ariaLabel="Actions"
                setItem={setSelectedItem}
              />
            </div>
          </div>

          {/* Fila para Fecha de Nacimiento y Edad */}
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <InputDate setDateBorn={setDateBorn} />
            </div>
            <div>
              <SimpleInput
                type="text"
                label="Edad"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>

          {/* Fila para Peso y Tamaño */}
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <SimpleInput
                type="text"
                label="Peso"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div>
              <SimpleInput
                type="text"
                label="Tamaño"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>

          <h3 className="text-xl font-bold mt-6 mb-4">Datos Complementarios</h3>

          {/* Fila para Nombre del Tutor y Número de Contacto */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <SimpleInput
                type="text"
                label="Nombre del Tutor"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
              />
            </div>
            <div>
              <SimpleInput
                type="text"
                label="Número de contacto"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <SimpleInput
                type="text"
                label="Ci Tutor"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div>
              <SimpleInput
                type="text"
                label="Parentezco"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-between mt-6">
            <PersonalButton content="Borrar" color="default" />
            <PersonalButton
              content="Registrar"
              color="secondary"
              variant="ghost"
            />
          </div>
        </div>
      </div>
    </>
  );
}
