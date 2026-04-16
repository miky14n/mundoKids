function Field({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-ink">{value || "—"}</p>
    </div>
  );
}

export default function CardPatient({ data }) {
  const patient = data[0];
  const genderLabel =
    patient.gender === "M"
      ? "Masculino"
      : patient.gender === "F"
        ? "Femenino"
        : "—";

  const initials = `${(patient.name || "").charAt(0)}${(patient.last_name || "").charAt(0)}`.toUpperCase() || "?";

  return (
    <section className="surface-card overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-br from-brand-50 via-white to-accent-50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-xl font-bold text-brand-700 shadow-soft ring-1 ring-brand-100">
            {initials}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              Paciente #{patient.patient_id}
            </p>
            <h2 className="text-xl font-bold text-ink sm:text-2xl">
              {patient.name} {patient.last_name}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="pill bg-white text-ink-muted ring-1 ring-slate-200">
                {genderLabel}
              </span>
              <span className="pill bg-white text-ink-muted ring-1 ring-slate-200">
                {patient.age ? `${patient.age} años` : "Edad no registrada"}
              </span>
              <span className="pill bg-white text-ink-muted ring-1 ring-slate-200">
                CI: {patient.ci || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Fecha de nacimiento" value={patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString("es-ES") : "—"} />
        <Field label="Edad" value={patient.age ? `${patient.age} años` : "—"} />
        <Field label="Género" value={genderLabel} />
        <Field label="Nombre del tutor" value={patient.guardian_name} />
        <Field label="CI del tutor" value={patient.guardian_ci} />
        <Field label="Parentesco" value={patient.relationship_to_patient} />
        <Field label="Número de contacto" value={patient.contact_number} />
      </div>

      <div className="border-t border-slate-100 bg-amber-50/60 px-6 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
          Alergias registradas
        </p>
        <p className="mt-1 text-sm leading-relaxed text-amber-900">
          {patient.alergys || "Sin alergias registradas."}
        </p>
      </div>
    </section>
  );
}
