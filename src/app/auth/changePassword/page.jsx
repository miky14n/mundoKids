"use client";
import Alert from "@/components/Alert";
import PersonalButton from "@/components/Button";
import PasswordInput from "@/components/PasswordInput";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { signOut } from "next-auth/react";
export default function ChangePassword() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const handleRestartSesion = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };
  const resetForm = () => {
    setNewPassword("");
    setPassword("");
    setVerifyPassword("");
    setError(null);
  };

  const handleSubmit = async () => {
    // Validaciones en el cliente
    console.log("lo que se enviara", password, newPassword, verifyPassword);
    if (!password || !newPassword || !verifyPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (newPassword !== verifyPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch(`/api/auth/users/change-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          newPassword,
        }),
      });

      const data = await response.json();
      console.log("la rspuesta del bako", data);
      if (!response.ok) {
        setError(data.error);
        return;
      }
      alert(
        "Contraseña cambiada exitosamente. Vuelva a iniciar sesion porfavor"
      );
      resetForm();
      handleRestartSesion();
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      setError("Error inesperado. Intenta nuevamente.");
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-2xl w-1/5">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Cambio de contraseña
        </h2>
        {error && (
          <Alert
            message={error}
            color="danger"
            link=""
            setStatus={() => setError(null)}
          />
        )}
        <div className="grid grid-cols-1 gap-6">
          <PasswordInput
            personalPlaceHolder="Ingrese la contraseña actual"
            personaLabel="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordInput
            personalPlaceHolder="Ingrese la nueva Contraseña"
            personaLabel="Nueva Contraseña"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <PasswordInput
            personalPlaceHolder="Repita la nueva Contraseña"
            personaLabel="Repetir Nueva Contraseña"
            onChange={(e) => setVerifyPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-center mt-6">
          <PersonalButton
            content="Cambiar contraseña"
            color="secondary"
            variant="ghost"
            action={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
