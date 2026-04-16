"use client";
import { useState, useEffect, useRef } from "react";
import SimpleInput from "@/components/Input";
import PersonalButton from "@/components/Button";
import Alert from "@/components/Alert";
import SimpleDropdown from "@/components/SimpleDropdown";
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

function FieldLabel({ children }) {
  return <p className="mb-1.5 text-xs font-medium text-ink-muted">{children}</p>;
}

export default function MedicalAppointment() {
  const [patientName, setPatientName] = useState("");
  const [ci, setCI] = useState("");
  const [specialty, setSpecialty] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [consultType, setConsultType] = useState(null);
  const [specialtyCost, setSpecialtyCost] = useState("");
  const [appoimentCost, setAppoimentCost] = useState("");
  const [patient, setPatient] = useState([]);
  const [success, setSuccess] = useState(null);
  const [patientLastName, setPatientLastName] = useState("");
  const [showSeekerCi, setShowSeekerCi] = useState(false);
  const [isPartner, setIsPartner] = useState(false);
  const [percentDiscount, setPercentDiscount] = useState(0);
  const [discountDescribe, setDiscountDescribe] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [responsible, setResponsible] = useState(
    typeof window !== "undefined" ? localStorage.getItem("userName") : ""
  );
  const patient_id = useRef(null);

  const consultTypeItems = [
    { key: "1", label: "Consulta" },
    { key: "2", label: "Re consulta" },
  ];

  useEffect(() => {
    if (ci && ci !== "") {
      const fetchOne = async () => {
        try {
          const response = await fetch(`/api/patients/${ci}`);
          if (!response.ok) throw new Error(`Error ${response.status}`);
          const data = await response.json();
          setPatientName(data[0].name);
          setPatientLastName(data[0].last_name);
          patient_id.current = data[0].patient_id;
        } catch (err) {
          setPatientName("No existe el paciente");
          setPatientLastName("");
        }
      };
      fetchOne();
    }
  }, [ci]);

  useEffect(() => {
    if (specialty && specialty !== "") {
      const fetchSpec = async () => {
        try {
          const response = await fetch(`/api/specialty/${specialty}`);
          if (!response.ok) throw new Error();
          const data = await response.json();
          setSpecialtyCost(data[0].price);
        } catch (err) {
          /* no-op */
        }
      };
      fetchSpec();
    }
  }, [specialty]);

  const handleRegister = async () => {
    const typeAppoiment = consultType ? consultType.label : "Consulta";
    const today = new Date();
    const date = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    const data = {
      patient_id: patient_id.current || patient.patient_id,
      ci: ci || patient.ci,
      type_of_appointment: typeAppoiment,
      specialty_id: specialty,
      doctor_id: doctor,
      date,
      responsible,
      appointment_price: appoimentCost ? appoimentCost : specialtyCost,
      discountDescribe,
      percentDiscount,
      payment_type: paymentType,
    };
    try {
      const response = await fetch("/api/appointment", {
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
    setDoctor(null);
    setSpecialty(null);
    setConsultType(null);
    setSpecialtyCost("");
    setPatientLastName("");
    patient_id.current = "";
    setPatient([]);
    setIsPartner(false);
    setPercentDiscount(0);
    setPaymentType("");
  };

  useEffect(() => {
    if (!isPartner) setPercentDiscount(0);
  }, [isPartner]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (percentDiscount !== 0) {
        const newCost = specialtyCost * (1 - percentDiscount / 100);
        setAppoimentCost(newCost.toFixed(2));
      } else {
        setAppoimentCost(null);
      }
    }, 500);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentDiscount]);

  return (
    <div className="page-container">
      <div className="mx-auto max-w-6xl space-y-4">
        {success === true && (
          <Alert message="Consulta agendada correctamente." color="success" setStatus={setSuccess} />
        )}
        {success === false && (
          <Alert message="Ocurrió un error al agendar la consulta." color="danger" setStatus={setSuccess} />
        )}

        <div className="page-header">
          <div>
            <h2 className="page-title">Agendar consulta</h2>
            <p className="page-subtitle">Busca al paciente y define la especialidad.</p>
          </div>
        </div>

        <div className="space-y-5">
          <Section title="Paciente y responsable" description="Identifica al paciente y a quien recibe la consulta.">
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
                  <SimpleInput
                    type="text"
                    label="CI del paciente"
                    value={ci}
                    onChange={(e) => setCI(e.target.value)}
                  />
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

          <Section title="Especialidad y doctor" description="Selecciona la especialidad y el profesional a cargo.">
            <div>
              <FieldLabel>Especialidad</FieldLabel>
              <ApiDropdown
                buttonLabel={specialty}
                defaultText="Selecciona una especialidad"
                urlApi="/api/specialty"
                onActionId={(v) => setSpecialty(v)}
                idOfGet="specialty_id"
                nameOfGet="name"
              />
            </div>
            <div>
              <FieldLabel>Doctor</FieldLabel>
              <ApiDropdown
                buttonLabel={doctor}
                defaultText="Selecciona un doctor"
                urlApi="/api/doctor?full_name=true"
                onActionId={(v) => setDoctor(v)}
                idOfGet="doctor_id"
                nameOfGet="full_name"
                filterLabel="specialty_id"
                filterValue={specialty}
              />
            </div>
            <div>
              <FieldLabel>Tipo de consulta</FieldLabel>
              <SimpleDropdown
                buttonLabel="Consulta"
                menuItems={consultTypeItems}
                ariaLabel="Tipo de consulta"
                setItem={setConsultType}
              />
            </div>
          </Section>

          <Section title="Costos y convenios" description="Aplica descuentos y define el tipo de pago.">
            <div>
              <SimpleInput
                type="text"
                label="Costo de la especialidad"
                value={appoimentCost ? appoimentCost : specialtyCost}
                onChange={(e) => setSpecialtyCost(Number(e.target.value) || 0)}
              />
            </div>
            <div className="flex items-end pb-1">
              <ToggleSwitch status={setIsPartner} title="Convenio / descuento" />
            </div>
            <div />
            {isPartner && (
              <>
                <div>
                  <SimpleInput
                    type="text"
                    label="% de descuento"
                    value={percentDiscount}
                    onChange={(e) => setPercentDiscount(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <SimpleInput
                    type="text"
                    label="Descripción del convenio"
                    value={discountDescribe}
                    onChange={(e) => setDiscountDescribe(e.target.value)}
                  />
                </div>
              </>
            )}
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
            <PersonalButton content="Agendar consulta" color="primary" action={handleRegister} />
          </div>
        </div>
      </div>
    </div>
  );
}
