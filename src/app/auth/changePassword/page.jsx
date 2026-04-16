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
    await signOut({ callbackUrl: "/auth/login" });
  };

  const resetForm = () => {
    setNewPassword("");
    setPassword("");
    setVerifyPassword("");
    setError(null);
  };

  const handleSubmit = async () => {
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
        body: JSON.stringify({ password, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
        return;
      }
      alert("Contraseña cambiada exitosamente. Vuelve a iniciar sesión.");
      resetForm();
      handleRestartSesion();
    } catch (err) {
      console.error("Error al cambiar la contraseña:", err);
      setError("Error inesperado. Intenta nuevamente.");
    }
  };

  return (
    <div className="page-container">
      <div className="mx-auto max-w-lg">
        <div className="surface-card p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-ink">Cambio de contraseña</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Por tu seguridad, elige una contraseña nueva difícil de adivinar.
            </p>
          </div>

          {error && (
            <div className="mb-4">
              <Alert
                message={error}
                color="danger"
                link=""
                setStatus={() => setError(null)}
              />
            </div>
          )}

          <div className="space-y-5">
            <PasswordInput
              personalPlaceHolder="Contraseña actual"
              personaLabel="Contraseña actual"
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordInput
              personalPlaceHolder="Nueva contraseña"
              personaLabel="Nueva contraseña"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <PasswordInput
              personalPlaceHolder="Repite la nueva contraseña"
              personaLabel="Confirmar contraseña"
              onChange={(e) => setVerifyPassword(e.target.value)}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <PersonalButton
              content="Cambiar contraseña"
              color="primary"
              action={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
