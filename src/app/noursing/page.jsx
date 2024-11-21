"use client";
import SimpleInput from "@/components/Input";
import PersonalButton from "@/components/Button";
import Alert from "@/components/Alert";
import { useState } from "react";
export default function Noursing(params) {
  const [patientName, setPatientName] = useState("");
  const [ci, setCI] = useState("");
  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-16 bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-5xl w-full mt-40 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Datos Complementarios de consulta
          </h2>

          {/* Fila para Encargada y CI del Paciente */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <SimpleInput
                type="text"
                label="Peso"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>
            <div>
              <SimpleInput
                type="text"
                label="Tamaño"
                value={ci}
                onChange={(e) => setCI(e.target.value)}
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
    </div>
  );
}
