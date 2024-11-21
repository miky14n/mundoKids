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
  const [guardianCI, setGuardianCI] = useState("");
  const [relationship, setRelationship] = useState("");
  const [success, setSuccess] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const items = [
    { key: "M", label: "Masculino" },
    { key: "F", label: "Femenino" },
  ];

  const handleRegister = async () => {
    const gender = selectedItem ? selectedItem.key : null;
    console.log("MAndadndo datoas" + dateBorn);
    if (
      !patientName ||
      !ci ||
      !gender ||
      !dateBorn ||
      !guardianName ||
      !contactNumber
    ) {
      setSuccess(false);
      return;
    }
    const data = {
      ci: +ci,
      name: patientName,
      last_name: "",
      gender: gender,
      date_of_birth: new Date(dateBorn),
      age: +age,
      weight: weight,
      height: height,
      guardian_name: guardianName,
      contact_number: +contactNumber,
      guardian_ci: +guardianCI,
      relationship_to_patient: relationship,
    };
    console.log("Los datos a mandar:" + JSON.stringify(data));
    try {
      const response = await fetch("/api/patients", {
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
    setDateBorn("");
    setAge("");
    setWeight("");
    setHeight("");
    setGuardianName("");
    setContactNumber("");
    setGuardianCI("");
    setRelationship("");
    setSelectedItem(null);
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
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
                label="CI Tutor"
                value={guardianCI}
                onChange={(e) => setGuardianCI(e.target.value)}
              />
            </div>
            <div>
              <SimpleInput
                type="text"
                label="Parentesco"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <PersonalButton
              content="Borrar"
              color="default"
              onClick={resetForm}
            />
            <PersonalButton
              content="Registrar"
              color="secondary"
              variant="ghost"
              onClick={handleRegister}
              action={handleRegister}
            />
          </div>
        </div>
      </div>
    </>
  );
}
