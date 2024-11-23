import BasicForm from "@/components/BasicForm";
export default function Settings() {
  /***/
  return (
    <div className="mt-16">
      <hr className="border-t-2 border-gray-300 my-6" />
      <div>
        <BasicForm
          layout="horizontal"
          fields={[
            { name: "categoryName", type: "text", label: "Nombre" },
            { name: "description", type: "text", label: "Apellido" },
            { name: "description", type: "text", label: "Ci" },
            { name: "description", type: "text", label: "Numero de contacto" },
            { name: "description", type: "text", label: "Correo" },
          ]}
          apiUrl="https://uildbknzgh.execute-api.us-east-2.amazonaws.com/dev/category"
          formTitle="Registra Nuevo Doctor"
          onSuccessMessage="Doctor creado exitosamente"
          onErrorMessage="Error al registrar doctor"
          buttonLabel="Registrar Dr."
        />
      </div>
      <div className="mt-16">
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
          />
        </div>
      </div>
    </div>
  );
}
