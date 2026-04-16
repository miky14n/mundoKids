"use client";
import ApiDropdown from "@/components/ApiDropdown";
import BasicForm from "@/components/BasicForm";
import { useState } from "react";

export default function ManageClinic() {
  const [specialty, setSpecialty] = useState("");

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Gestión clínica</h2>
          <p className="page-subtitle">
            Administra las especialidades, doctores y servicios de la clínica.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <BasicForm
          layout="horizontal"
          fields={[
            { name: "name", type: "text", label: "Nombre de la especialidad" },
            { name: "description", type: "text", label: "Descripción" },
            { name: "price", type: "text", label: "Costo de la especialidad" },
          ]}
          apiUrl="/api/specialty"
          formTitle="Añadir especialidad"
          onSuccessMessage="Especialidad creada exitosamente"
          onErrorMessage="Error al registrar la especialidad"
          buttonLabel="Registrar especialidad"
          colorButton="primary"
        />

        <BasicForm
          layout="horizontal"
          fields={[
            { name: "name", type: "text", label: "Nombre" },
            { name: "last_name", type: "text", label: "Apellido" },
            { name: "ci", type: "text", label: "CI" },
            { name: "contact_number", type: "text", label: "Número de contacto" },
            { name: "email", type: "text", label: "Correo" },
          ]}
          apiUrl="/api/doctor"
          formTitle="Registrar nuevo doctor"
          onSuccessMessage="Doctor creado exitosamente"
          onErrorMessage="Error al registrar doctor"
          buttonLabel="Registrar doctor"
          extraComponent={
            <ApiDropdown
              buttonLabel={specialty}
              defaultText="Elija una especialidad"
              urlApi="/api/specialty"
              onActionId={(selected) => setSpecialty(selected)}
              idOfGet="specialty_id"
              nameOfGet="name"
            />
          }
          valueExtraComponent={specialty}
          colorButton="primary"
        />

        <BasicForm
          layout="horizontal"
          fields={[
            { name: "name", type: "text", label: "Nombre del servicio" },
            { name: "description", type: "text", label: "Descripción" },
            { name: "price", type: "text", label: "Costo del servicio" },
            {
              name: "home_price",
              type: "text",
              label: "Costo del servicio a domicilio",
            },
          ]}
          apiUrl="/api/services"
          formTitle="Añadir servicio médico"
          onSuccessMessage="Servicio registrado exitosamente"
          onErrorMessage="Error al registrar el servicio"
          buttonLabel="Registrar servicio"
          colorButton="primary"
        />
      </div>
    </div>
  );
}
