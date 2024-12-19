"use client";

import Alert from "@/components/Alert";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const [error, setError] = useState(null);
  const [showAppointments, setShowAppointments] = useState(true);
  const router = useRouter();

  const handleNavigation = (isAppointments) => {
    setShowAppointments(isAppointments);
    router.push(isAppointments ? "/noursing" : "/noursing/services");
  };

  return (
    <>
      {error && (
        <Alert
          message={`Error: ${error}`}
          type="error"
          setStatus={() => setError(null)}
        />
      )}
      <div className="mt-8 p-4 rounded-md">
        <div className="flex items-center mb-4">
          <label className="mr-4 font-bold">Por atender:</label>
          <label className="flex items-center mr-6">
            <input
              type="radio"
              name="selection"
              value="appointments"
              checked={showAppointments}
              onChange={() => handleNavigation(true)}
              className="mr-2"
            />
            Consultas
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="selection"
              value="services"
              checked={!showAppointments}
              onChange={() => handleNavigation(false)}
              className="mr-2"
            />
            Servicios
          </label>
        </div>
      </div>
      {children}
    </>
  );
}
