"use client";
import { useState, useEffect, useRef } from "react";
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
  //const [summary, setSummary] = useState("");
  const [success, setSuccess] = useState(null);
  const [patientLastName, setPatientLastName] = useState("");
  const [responsible, setResponsible] = useState(
    localStorage.getItem("userName")
  );
  const patient_id = useRef(null);
  const consultTypeItems = [
    { key: "1", label: "Consulta" },
    { key: "2", label: "Re consulta" },
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
          patient_id.current = data[0].patient_id;
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
  const handleRegister = async () => {
    const typeAppoiment = consultType ? consultType.label : null;
    const today = new Date();
    const date = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    const data = {
      patient_id: patient_id.current,
      ci,
      type_of_appointment: typeAppoiment,
      specialty_id: specialty,
      doctor_id: doctor,
      date: date,
      responsible,
    };
    try {
      const response = await fetch("/api/appointment", {
        method: "POST",
        body: JSON.stringify(data),

        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
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
    setDoctor(null);
    setSpecialty(null);
    setConsultType(null);
    setSpecialtyCost("");
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
            Agendar Consulta
          </h2>

          {/* Fila para Encargada y CI del Paciente */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <SimpleInput
                type="text"
                label="Encargado"
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
                buttonLabel={specialty}
                defaultText="Seleccione una Especialidad"
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
                buttonLabel={doctor}
                defaultText="Seleccione un Doctor"
                urlApi="/api/doctor"
                onActionId={(selectedDoctor) => setDoctor(selectedDoctor)}
                idOfGet="doctor_id"
                nameOfGet="name"
                filterLabel={"specialty_id"}
                filterValue={specialty}
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
