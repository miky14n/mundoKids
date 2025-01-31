import PersonalTextarea from "../Teaxtarea";

export default function CardPatient(params) {
  const { data } = params;
  const patient = data[0];
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Datos del Paciente
      </h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold text-gray-600">Paciente #</p>
          <p className="text-gray-800">{`${patient.patient_id}`}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-600">CI</p>
          <p className="text-gray-800">{patient.ci || 0}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-600">Nombre</p>
          <p className="text-gray-800">{patient.name}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-600">Apellido</p>
          <p className="text-gray-800">{patient.last_name}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-600">Género</p>
          <p className="text-gray-800">
            {patient.gender === "M" ? "Masculino" : "Femenino"}
          </p>
        </div>
        <div>
          <p className="font-semibold text-gray-600">Fecha de Nacimiento</p>
          <p className="text-gray-800">
            {new Date(patient.date_of_birth).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="font-semibold text-gray-600">Edad</p>
          <p className="text-gray-800">{patient.age} años</p>
        </div>
        <div>
          <p className="font-semibold text-gray-600">Nombre del Tutor</p>
          <p className="text-gray-800">{patient.guardian_name}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-600">CI del Tutor</p>
          <p className="text-gray-800">{patient.guardian_ci}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-600">
            Relación con el Paciente
          </p>
          <p className="text-gray-800">{patient.relationship_to_patient}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-600">Número de Contacto</p>
          <p className="text-gray-800">{patient.contact_number}</p>
        </div>
        <div>
          <PersonalTextarea
            label={"Registro de alergias"}
            isReadOnly={true}
            description="Alergias que tiene el paciente"
            value={patient.alergys}
          />
        </div>
      </div>
    </div>
  );
}
