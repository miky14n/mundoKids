"use client";
import { useState, useEffect, useRef } from "react";
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
    localStorage.getItem("userName")
  );

  const today = new Date();
  const date = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
  const handleRegister = async () => {
    console.log(doctor);
    const data = {
      doctor_id: doctor,
      date: date,
      gloss,
      amount_contributed: amountContributed,
      responsible,
      payment_type: paymentType,
    };
    console.log("Los datos a mandar:" + JSON.stringify(data));
    try {
      const response = await fetch("/api/contributions", {
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
    setGloss("");
    setDoctor("");
    setAmountContributed("");
    setPaymentType("");
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
            Registro de aportes
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
            <div>
              <ApiDropdown
                buttonLabel={doctor}
                defaultText="Seleccione al doctor"
                urlApi="/api/doctor?full_name=true"
                onActionId={(selectedDoctor) => setDoctor(selectedDoctor)}
                idOfGet="doctor_id"
                nameOfGet="full_name"
                aditonalStyle="max-h-64 overflow-auto"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <SimpleInput
                type="text"
                label="Ingrese el detalle del aporte"
                value={gloss}
                onChange={(e) => setGloss(e.target.value)}
              />
            </div>
            <div>
              <SimpleInput
                type="text"
                label="Ingre el monto del aporte"
                value={amountContributed}
                onChange={(e) => setAmountContributed(e.target.value)}
              />
            </div>
          </div>
          {/*tipo de pago*/}
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <SimpleInput
                type="text"
                label="Ingre el tipo de pago"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
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
              content="Registrar"
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
