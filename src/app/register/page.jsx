"use client";
import { useState, useRef, useEffect } from "react";
import SimpleInput from "@/components/Input";
import PersonalButton from "@/components/Button";
import Alert from "@/components/Alert";
import SimpleDropdown from "@/components/SimpleDropdown";
import InputDate from "@/components/InputDate";
import PersonalTextarea from "@/components/Teaxtarea";
import { calculateAge } from "./functions";

function Section({ title, description, children }) {
  return (
    <section className="surface-card p-6 sm:p-8">
      <header className="mb-5">
        <h3 className="section-title">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-ink-soft">{description}</p>
        )}
        <div className="mt-3 h-px w-full bg-gradient-to-r from-brand-100 via-slate-100 to-transparent" />
      </header>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </section>
  );
}

function FieldLabel({ children }) {
  return (
    <p className="mb-1.5 text-xs font-medium text-ink-muted">{children}</p>
  );
}

export default function Register() {
  const [patientName, setPatientName] = useState("");
  const [ci, setCI] = useState("");
  const [dateBorn, setDateBorn] = useState("");
  const [age, setAge] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [alergys, setAlergys] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [guardianCI, setGuardianCI] = useState("");
  const [relationship, setRelationship] = useState("");
  const [success, setSuccess] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const lastNameRef = useRef();

  const items = [
    { key: "M", label: "Masculino" },
    { key: "F", label: "Femenino" },
  ];

  const handleRegister = async () => {
    const gender = selectedItem ? selectedItem.key : null;
    const data = {
      ci: +ci,
      name: patientName,
      last_name: lastNameRef.current?.value,
      gender,
      date_of_birth: new Date(dateBorn),
      age: +age,
      guardian_name: guardianName,
      contact_number: +contactNumber,
      guardian_ci: +guardianCI,
      relationship_to_patient: relationship,
      alergys,
    };
    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
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
    setAlergys("");
    setCI("");
    setDateBorn("");
    setAge("");
    setGuardianName("");
    setContactNumber("");
    setGuardianCI("");
    setRelationship("");
    setSelectedItem(null);
    if (lastNameRef.current) lastNameRef.current.value = "";
  };

  useEffect(() => {
    if (dateBorn) setAge(calculateAge(dateBorn));
  }, [dateBorn]);

  return (
    <div className="page-container">
      <div className="mx-auto max-w-6xl space-y-4">
        {success === true && (
          <Alert
            message="Paciente registrado correctamente."
            color="success"
            setStatus={setSuccess}
          />
        )}
        {success === false && (
          <Alert
            message="Ocurrió un error al registrar el paciente."
            color="danger"
            setStatus={setSuccess}
          />
        )}

        <div className="page-header">
          <div>
            <h2 className="page-title">Registro de paciente</h2>
            <p className="page-subtitle">
              Completa la información clínica y del tutor responsable.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <Section
            title="Datos del paciente"
            description="Información personal y médica básica del menor."
          >
            <div>
              <SimpleInput
                type="text"
                label="Nombre"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>
            <div>
              <SimpleInput
                type="text"
                label="Apellido"
                onChange={() => {}}
                typeInput="ref"
                inputRef={lastNameRef}
              />
            </div>
            <div>
              <SimpleInput
                type="text"
                label="CI"
                value={ci}
                onChange={(e) => setCI(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Género</FieldLabel>
              <SimpleDropdown
                buttonLabel="Selecciona el género"
                menuItems={items}
                ariaLabel="Género"
                setItem={setSelectedItem}
              />
            </div>
            <div>
              <InputDate setDateBorn={setDateBorn} label="Fecha de nacimiento" />
            </div>
            <div>
              <SimpleInput type="text" label="Edad (calculada)" value={age} readOnly />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <PersonalTextarea
                label="Registro de alergias"
                description="Detalla cualquier alergia conocida del paciente."
                placeholder="Ej. polen, penicilina, nueces..."
                value={alergys}
                onChange={(e) => setAlergys(e.target.value)}
              />
            </div>
          </Section>

          <Section
            title="Datos del tutor"
            description="Responsable legal y contacto del paciente."
          >
            <div>
              <SimpleInput
                type="text"
                label="Nombre del tutor"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
              />
            </div>
            <div>
              <SimpleInput
                type="text"
                label="CI del tutor"
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
            <div>
              <SimpleInput
                type="text"
                label="Número de contacto"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>
          </Section>

          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <PersonalButton
              content="Borrar formulario"
              color="danger"
              variant="flat"
              action={resetForm}
            />
            <PersonalButton
              content="Registrar paciente"
              color="primary"
              action={handleRegister}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
