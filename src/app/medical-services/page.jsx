"use client";
import { useState, useEffect, useRef } from "react";
import SimpleInput from "@/components/Input";
import PersonalButton from "@/components/Button";
import Alert from "@/components/Alert";
import ApiDropdown from "@/components/ApiDropdown";
import Seeker from "@/components/Seeker";
import ToggleSwitch from "@/components/ToggleSwitch";

function Section({ title, description, children }) {
  return (
    <section className="surface-card p-6 sm:p-8">
      <header className="mb-5">
        <h3 className="section-title">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-ink-soft">{description}</p>}
        <div className="mt-3 h-px w-full bg-gradient-to-r from-brand-100 via-slate-100 to-transparent" />
      </header>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </section>
  );
}

export default function Services() {
  const [showSeekerCi, setShowSeekerCi] = useState(false);
  const [patient, setPatient] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [ci, setCI] = useState("");
  const [services, setServices] = useState(null);
  const [servicesCost, setServicesCost] = useState("");
  const [success, setSuccess] = useState(null);
  const [patientLastName, setPatientLastName] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [responsible, setResponsible] = useState(
    typeof window !== "undefined" ? localStorage.getItem("userName") : ""
  );
  const patient_id = useRef(null);

  useEffect(() => {
    if (ci && ci !== "") {
      const fetchPatient = async () => {
        try {
          const response = await fetch(`/api/patients/${ci}`);
          if (!response.ok) throw new Error();
          const data = await response.json();
          setPatientName(data[0].name);
          setPatientLastName(data[0].last_name);
          patient_id.current = data[0].patient_id;
        } catch (err) {
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
          if (!response.ok) throw new Error();
          const data = await response.json();
          setServicesCost(data[0].price);
        } catch (err) {
          /* no-op */
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
    const data = {
      patient_id: patient.patient_id || patient_id.current,
      services_id: services,
      date,
      responsible,
      service_cost: servicesCost,
      payment_type: paymentType,
    };
    try {
      const response = await fetch("/api/medical_services", {
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
    } catch (err) {
      setSuccess(false);
    }
  };

  const resetForm = () => {
    setPatientName("");
    setCI("");
    setServices(null);
    setServicesCost("");
    setPatientLastName("");
    patient_id.current = "";
    setPaymentType("");
  };

  return (
    <div className="page-container">
      <div className="mx-auto max-w-6xl space-y-4">
        {success === true && (
          <Alert message="Servicio registrado correctamente." color="success" setStatus={setSuccess} />
        )}
        {success === false && (
          <Alert message="Ocurrió un error al registrar el servicio." color="danger" setStatus={setSuccess} />
        )}

        <div className="page-header">
          <div>
            <h2 className="page-title">Registrar servicio médico</h2>
            <p className="page-subtitle">Servicios externos a consultas (exámenes, aplicaciones, etc).</p>
          </div>
        </div>

        <div className="space-y-5">
          <Section title="Paciente y responsable">
            <div>
              <SimpleInput
                type="text"
                label="Encargado"
                value={responsible || ""}
                onChange={(e) => setResponsible(e.target.value)}
                readonly
              />
            </div>
            <div className="sm:col-span-2">
              <Seeker
                title="Buscar paciente"
                description="Escribe el nombre del paciente"
                resultSeek="Resultados"
                voidMessage="No se encontró el paciente"
                apiUrl="/api/patients?search"
                getValue={setPatient}
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <ToggleSwitch status={setShowSeekerCi} title="Buscar por CI en su lugar" />
            </div>
            {showSeekerCi && (
              <>
                <div>
                  <SimpleInput type="text" label="CI del paciente" value={ci} onChange={(e) => setCI(e.target.value)} />
                </div>
                <div>
                  <SimpleInput type="text" label="Nombre" value={patientName} onChange={() => {}} readOnly />
                </div>
                <div>
                  <SimpleInput type="text" label="Apellido" value={patientLastName} onChange={() => {}} readOnly />
                </div>
              </>
            )}
          </Section>

          <Section title="Detalle del servicio">
            <div>
              <p className="mb-1.5 text-xs font-medium text-ink-muted">Servicio</p>
              <ApiDropdown
                buttonLabel={services}
                defaultText="Selecciona un servicio"
                urlApi="/api/services"
                onActionId={(v) => setServices(v)}
                idOfGet="services_id"
                nameOfGet="name"
                aditonalStyle="max-h-64 overflow-auto"
              />
            </div>
            <div>
              <SimpleInput
                type="text"
                label="Costo del servicio"
                value={servicesCost}
                onChange={(e) => setServicesCost(e.target.value || 0)}
              />
            </div>
            <div>
              <SimpleInput
                type="text"
                label="Tipo de pago"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
              />
            </div>
          </Section>

          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <PersonalButton content="Borrar" color="danger" variant="flat" action={resetForm} />
            <PersonalButton content="Registrar servicio" color="primary" action={handleRegister} />
          </div>
        </div>
      </div>
    </div>
  );
}
