import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";

export async function PATCH(request, { params }) {
  try {
    if (!params?.id) {
      return NextResponse.json(
        { error: `ID de la cita médica inválido.` },
        { status: 400 }
      );
    }

    const appoiment_id = params.id;
    console.log("ID de la cita médica recibido:", appoiment_id);

    const body = await request.json();
    const {
      patient_id,
      ci,
      type_of_appointment,
      specialty_id,
      doctor_id,
      date,
      height,
      weight,
      temperature,
      responsible,
    } = body;

    // Actualizar los campos especificados
    const result = await neon_sql`
      UPDATE medical_appointment
      SET
        patient_id = COALESCE(${patient_id}, patient_id),
        ci = COALESCE(${ci}, ci),
        type_of_appointment = COALESCE(${type_of_appointment}, type_of_appointment),
        specialty_id = COALESCE(${specialty_id}, specialty_id),
        doctor_id = COALESCE(${doctor_id}, doctor_id),
        date = COALESCE(${date}, date),
        height = COALESCE(${height}, height),
        weight = COALESCE(${weight}, weight),
        temperature = COALESCE(${temperature}, temperature),
        responsible = COALESCE(${responsible}, responsible)
      WHERE appoiment_id = ${appoiment_id}
      RETURNING *;
    `;

    // Verificar si la cita fue encontrada y actualizada
    if (result.length === 0) {
      return NextResponse.json(
        { error: `No se encontró la cita médica con ID: ${appoiment_id}` },
        { status: 404 }
      );
    }

    // Respuesta con la cita médica actualizada
    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error("Error al actualizar la cita médica:", error);
    return NextResponse.json(
      { error: "Error al actualizar la cita médica. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
