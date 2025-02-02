"use client";
import Alert from "@/components/Alert";
import BasicTable from "@/components/Tables/BasicTable";
import { useEffect, useState } from "react";
export default function ListOfServices(params) {
  const [services, setServices] = useState([]);
  const [specialty, setSpecialty] = useState([]);
  const [showSpecialty, setShowSpecialty] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchOneServices();
    fetchSpecialty();
  }, []);

  const fetchOneServices = async () => {
    try {
      const response = await fetch(`/api/services`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError(err.message);
    }
  };
  const fetchSpecialty = async () => {
    try {
      const response = await fetch(`/api/specialty`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();
      setSpecialty(data);
    } catch (err) {
      setError(err.message);
    }
  };
  const handleNavigation = (isSpecialty) => {
    setShowSpecialty(isSpecialty);
  };
  let columsShow = ["name", "description", "price"];

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
          <label className=" font-bold flex items-center mr-6">
            <input
              type="radio"
              name="selection"
              value="specialty"
              checked={showSpecialty}
              onChange={() => handleNavigation(true)}
              className="mr-2"
            />
            Lista de especialidades
          </label>
          <label className="font-bold flex items-center">
            <input
              type="radio"
              name="selection"
              value="services"
              checked={!showSpecialty}
              onChange={() => handleNavigation(false)}
              className="mr-2"
            />
            Lista de servicios medicos
          </label>
        </div>
      </div>
      {showSpecialty ? (
        <BasicTable
          data={specialty}
          personalColums={columsShow}
          rowsPerPage={10}
        />
      ) : (
        <BasicTable
          data={services}
          personalColums={columsShow}
          rowsPerPage={10}
        />
      )}
    </>
  );
}
