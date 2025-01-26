"use client";
import { useState, useRef } from "react";
import SimpleInput from "@/components/Input";
import PersonalButton from "@/components/Button";
import Alert from "@/components/Alert";
import BasicForm from "@/components/BasicForm";
import SimpleDropdown from "@/components/SimpleDropdown";
import { Input } from "@nextui-org/react";

export default function Register() {
  const [role, setRole] = useState(null); // Dropdown para rol
  const [success, setSuccess] = useState(null);

  const items = [
    { key: "nurse", label: "Efermeria" },
    { key: "doctor", label: "Doctor" },
    { key: "admin", label: "Administracion" },
    { key: "receptionist", label: "Recepcionista" },
  ];
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
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <BasicForm
          fields={[
            {
              name: "user_name",
              type: "text",
              label: "Nombre del personal",
            },
            {
              name: "email",
              type: "email",
              label: "Correo electronico",
            },
          ]}
          apiUrl={`/api/auth/register`}
          typeRequestApi="POST"
          formTitle={`Registro de cuentas`}
          onSuccessMessage="Registro completado"
          onErrorMessage="Error al registrar nuevo personal"
          buttonLabel="Crear nuevo personal."
          extraComponent={
            <div>
              <SimpleDropdown
                buttonLabel={"Selectione el cargo que corresponda"}
                menuItems={items}
                setItem={setRole}
              />
            </div>
          }
          valueExtraComponent={role}
          colorButton={"secondary"}
        />
      </div>
    </>
  );
}
