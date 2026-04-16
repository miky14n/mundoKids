"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Alert from "@/components/Alert";
import PersonalButton from "@/components/Button";
import SimpleInput from "@/components/Input";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

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
        setLoading(false);
        return;
      }
      if (!data[0]?.verified_account) {
        setLoading(false);
        alert("Cuenta recién creada. Se requiere cambio de contraseña.");
        setTimeout(() => {
          router.push("/auth/changePassword");
        }, 500);
        return;
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Error en la solicitud:", err);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-stretch bg-surface-muted">
      {/* Left side - brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-10 text-white lg:flex">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-24 h-80 w-80 rounded-full bg-accent-400/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
              <Image src="/Logo.png" alt="Mundo Kids" width={36} height={36} />
            </div>
            <div>
              <p className="text-sm font-semibold">Mundo Kids</p>
              <p className="text-[11px] uppercase tracking-wider text-white/70">
                Clínica pediátrica
              </p>
            </div>
          </div>
        </div>
        <div className="relative space-y-4">
          <h2 className="text-3xl font-bold leading-tight text-balance">
            Gestión clínica diseñada para el cuidado pediátrico.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-white/80">
            Administra pacientes, consultas, historial y servicios médicos
            desde un único lugar con un sistema hecho para la calidez humana.
          </p>
          <div className="flex gap-4">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold">+500</p>
              <p className="text-xs text-white/80">Pacientes atendidos</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-xs text-white/80">Soporte operativo</p>
            </div>
          </div>
        </div>
        <div className="relative text-xs text-white/60">
          © {new Date().getFullYear()} Mundo Kids. Todos los derechos reservados.
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex w-full flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 ring-1 ring-brand-100">
              <Image src="/Logo.png" alt="Mundo Kids" width={32} height={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-ink">Mundo Kids</p>
              <p className="text-[11px] uppercase tracking-wider text-ink-faint">
                Clínica pediátrica
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-ink">
              Iniciar sesión
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              Accede a tu panel del sistema clínico.
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <SimpleInput
              type="email"
              label="Correo electrónico"
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
            <PersonalButton
              content={loading ? "Ingresando..." : "Iniciar sesión"}
              color="primary"
              isLoading={loading}
              action={handleSubmit}
            />
          </form>

          <p className="mt-8 text-center text-xs text-ink-faint">
            ¿Problemas para ingresar? Contacta al administrador.
          </p>
        </div>
      </div>
    </div>
  );
}
