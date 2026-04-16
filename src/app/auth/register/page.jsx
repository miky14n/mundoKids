"use client";
import { useState } from "react";
import Alert from "@/components/Alert";
import BasicForm from "@/components/BasicForm";
import SimpleDropdown from "@/components/SimpleDropdown";

export default function Register() {
  const [role, setRole] = useState(null);
  const [success, setSuccess] = useState(null);

  const items = [
    { key: "nurse", label: "Enfermería" },
    { key: "doctor", label: "Doctor" },
    { key: "admin", label: "Administración" },
    { key: "receptionist", label: "Recepcionista" },
    { key: "partner", label: "Socio" },
  ];

  return (
    <div className="page-container">
      <div className="mx-auto max-w-3xl space-y-4">
        {success === true && (
          <Alert
            message="Registro exitoso. El usuario recibirá sus credenciales por correo."
            color="success"
            setStatus={setSuccess}
          />
        )}
        {success === false && (
          <Alert
            message="Ocurrió un error al registrar el usuario."
            color="danger"
            setStatus={setSuccess}
          />
        )}

        <div className="page-header">
          <div>
            <h2 className="page-title">Registro de cuentas</h2>
            <p className="page-subtitle">
              Crea una cuenta para un miembro del personal de la clínica.
            </p>
          </div>
        </div>

        <BasicForm
          layout="horizontal"
          fields={[
            { name: "user_name", type: "text", label: "Nombre del personal" },
            { name: "email", type: "email", label: "Correo electrónico" },
          ]}
          apiUrl={`/api/auth/register`}
          typeRequestApi="POST"
          formTitle="Datos del usuario"
          onSuccessMessage="Registro completado correctamente."
          onErrorMessage="No se pudo registrar el usuario."
          buttonLabel="Crear cuenta"
          extraComponent={
            <div className="w-full">
              <p className="mb-1.5 text-xs font-medium text-ink-muted">
                Rol / Cargo
              </p>
              <SimpleDropdown
                buttonLabel="Selecciona el cargo correspondiente"
                menuItems={items}
                setItem={setRole}
              />
            </div>
          }
          valueExtraComponent={role}
          colorButton="primary"
        />
      </div>
    </div>
  );
}
