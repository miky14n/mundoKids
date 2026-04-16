"use client";
import { useState } from "react";
import SimpleInput from "@/components/Input";
import PersonalButton from "@/components/Button";
import Alert from "@/components/Alert";
import ApiDropdown from "@/components/ApiDropdown";

export default function Contributions() {
  const [doctor, setDoctor] = useState(null);
  const [amountContributed, setAmountContributed] = useState("");
  const [gloss, setGloss] = useState("");
  const [success, setSuccess] = useState(null);
  const [paymentType, setPaymentType] = useState("");
  const [responsible, setResponsible] = useState(
    typeof window !== "undefined" ? localStorage.getItem("userName") : ""
  );

  const today = new Date();
  const date = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

  const handleRegister = async () => {
    const data = {
      doctor_id: doctor,
      date,
      gloss,
      amount_contributed: amountContributed,
      responsible,
      payment_type: paymentType,
    };
    try {
      const response = await fetch("/api/contributions", {
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
    setGloss("");
    setDoctor(null);
    setAmountContributed("");
    setPaymentType("");
  };

  return (
    <div className="page-container">
      <div className="mx-auto max-w-4xl space-y-4">
        {success === true && (
          <Alert message="Aporte registrado correctamente." color="success" setStatus={setSuccess} />
        )}
        {success === false && (
          <Alert message="Error al registrar el aporte." color="danger" setStatus={setSuccess} />
        )}

        <div className="page-header">
          <div>
            <h2 className="page-title">Registro de aportes</h2>
            <p className="page-subtitle">Registra un aporte médico con todos sus detalles.</p>
          </div>
        </div>

        <div className="surface-card p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <SimpleInput
                type="text"
                label="Encargado"
                value={responsible || ""}
                onChange={(e) => setResponsible(e.target.value)}
                readonly
              />
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-ink-muted">Doctor</p>
              <ApiDropdown
                buttonLabel={doctor}
                defaultText="Selecciona al doctor"
                urlApi="/api/doctor?full_name=true"
                onActionId={(v) => setDoctor(v)}
                idOfGet="doctor_id"
                nameOfGet="full_name"
                aditonalStyle="max-h-64 overflow-auto"
              />
            </div>
            <div className="sm:col-span-2">
              <SimpleInput
                type="text"
                label="Detalle / glosa del aporte"
                value={gloss}
                onChange={(e) => setGloss(e.target.value)}
              />
            </div>
            <div>
              <SimpleInput
                type="text"
                label="Monto del aporte"
                value={amountContributed}
                onChange={(e) => setAmountContributed(e.target.value)}
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
          </div>
          <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <PersonalButton content="Borrar" color="danger" variant="flat" action={resetForm} />
            <PersonalButton content="Registrar aporte" color="primary" action={handleRegister} />
          </div>
        </div>
      </div>
    </div>
  );
}
