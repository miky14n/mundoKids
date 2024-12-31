"use client";
import ApiDropdown from "@/components/ApiDropdown";
import BasicForm from "@/components/BasicForm";
import { useState } from "react";
export default function Settings() {
  /***/
  const [specialty, setSpecialty] = useState("");
  const [ciDoctor, setciDoctor] = useState("");
  return (
    <div className="mt-16">
      <hr className="border-t-2 border-gray-300 my-6" />
      <div>
        <BasicForm
          layout="horizontal"
          fields={[
            { name: "name", type: "text", label: "Nombre" },
            { name: "last_name", type: "text", label: "Apellido" },
            { name: "ci", type: "text", label: "Ci" },
            {
              name: "contact_number",
              type: "text",
              label: "Numero de contacto",
            },
            { name: "email", type: "text", label: "Correo" },
          ]}
          apiUrl="/api/doctor"
          formTitle="Registra Nuevo Doctor"
          onSuccessMessage="Doctor creado exitosamente"
          onErrorMessage="Error al registrar doctor"
          buttonLabel="Registrar Dr."
          extraComponent={
            <div>
              <ApiDropdown
                buttonLabel={specialty}
                defaultText="Elija una Especialidad"
                urlApi="/api/specialty"
                onActionId={(selectedSpecialty) =>
                  setSpecialty(selectedSpecialty)
                }
                idOfGet="specialty_id"
                nameOfGet="name"
              />
            </div>
          }
          valueExtraComponent={specialty}
          colorButton={"secondary"}
        />
      </div>
      <hr className="border-t-2 border-gray-300 my-6" />
      <div>
        <BasicForm
          layout="horizontal"
          fields={[
            {
              name: "name",
              type: "text",
              label: "Nombre de la especialidad",
            },
            { name: "description", type: "text", label: "Descripcion" },
            {
              name: "price",
              type: "text",
              label: "Costo de la especialidad",
            },
          ]}
          apiUrl="/api/specialty"
          formTitle="Añadir Especialidad"
          onSuccessMessage="Especialidad creada exitosamente"
          onErrorMessage="Error al registrar la especialidad"
          buttonLabel="Registrar."
          colorButton={"secondary"}
        />
      </div>
      <hr className="border-t-2 border-gray-300 my-6" />
      <div>
        <BasicForm
          layout="horizontal"
          fields={[
            {
              name: "name",
              type: "text",
              label: "Nombre del Servicio",
            },
            { name: "description", type: "text", label: "Descripcion" },
            {
              name: "price",
              type: "text",
              label: "Costo del Servicio",
            },
          ]}
          apiUrl="/api/services"
          formTitle="Añadir Servicio"
          onSuccessMessage="Servicio registrado"
          onErrorMessage="Error al registrar la Servicio"
          buttonLabel="Registrar."
          colorButton={"secondary"}
        />
      </div>
      <hr className="border-t-2 border-gray-300 my-6" />
    </div>
  );
}
