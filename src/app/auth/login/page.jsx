"use client";
import Alert from "@/components/Alert";
import PersonalButton from "@/components/Button";
import SimpleInput from "@/components/Input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError(null);
  };

  const handleSubmit = async (e) => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res.error) {
      setError(res.error);
    } else {
      try {
        const response = await fetch(
          `/api/auth/users/${email}?isactivate=true`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          console.error("Error al obtener la información del usuario.");
          return;
        }
        if (!data[0].verified_account) {
          try {
            const patchResponse = await fetch(`/api/auth/users/${email}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
            });

            if (!patchResponse.ok) {
              throw new Error("Error al actualizar la cuenta.");
            }
          } catch (patchError) {
            console.error("No se activó la cuenta correctamente:", patchError);
          }

          alert("Cuenta recién creada. Se requiere cambio de contraseña.");
          setTimeout(() => {
            router.push("/auth/changePassword");
          }, 1000);
        }
        router.push("/");
        router.refresh();
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-2xl w-1/5">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        {error && (
          <Alert
            message={error}
            color="danger"
            link=""
            setStatus={() => setError(null)}
          />
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <SimpleInput
              type="email"
              label="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <SimpleInput
              type="password"
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-center mt-6">
            <PersonalButton
              content="Iniciar Sesión"
              color="secondary"
              variant="ghost"
              action={handleSubmit}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
