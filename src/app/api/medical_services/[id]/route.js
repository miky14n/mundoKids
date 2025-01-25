import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";

export async function PATCH(request, { params }) {
  try {
    if (!params?.id) {
      return NextResponse.json(
        { error: `ID del servicio inválido.` },
        { status: 400 }
      );
    }

    const medical_srv_id = params.id;
    console.log("ID de servicio recibido:", medical_srv_id);

    const body = await request.json();
    const {
      services_id,
      patient_id,
      responsible,
      status,
      temperature,
      weight,
      height,
      date,
    } = body;

    // Actualizar los campos especificados
    const result = await neon_sql`
      UPDATE medical_services
      SET
        patient_id = COALESCE(${patient_id}, patient_id),
        services_id = COALESCE(${services_id}, services_id),
        status = COALESCE(${status}, status),
        date = COALESCE(${date}, date),
        height = COALESCE(${height}, height),
        weight = COALESCE(${weight}, weight),
        temperature = COALESCE(${temperature}, temperature),
        responsible = COALESCE(${responsible}, responsible)
      WHERE medical_srv_id = ${medical_srv_id}
      RETURNING *;
    `;

    // Verificar si la cita fue encontrada y actualizada
    if (result.length === 0) {
      return NextResponse.json(
        {
          error: `No se encontró el servicio medico aplicar: ${medical_srv_id}`,
        },
        { status: 404 }
      );
    }

    // Respuesta con la cita médica actualizada
    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error("Error al actualizar el servicio medico:", error);
    return NextResponse.json(
      { error: "Error al actualizar el servicio medico. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const patient_id = searchParams.get("id");
    const medical_srv_id = params.id;

    console.log("ID de la cita médica recibido:", medical_srv_id);
    console.log("ID patient recibido:", patient_id);

    if (!medical_srv_id) {
      return NextResponse.json(
        { error: "ID del paciente inválido en la validación" },
        { status: 400 }
      );
    }

    let query = `SELECT * FROM medical_services`;
    if (patient_id) {
      console.log("ID patient recibido:", patient_id);
      query += ` WHERE patient_id = ${parseInt(patient_id, 10)}`;
    } else if (medical_srv_id) {
      console.log("UUID recibido:", medical_srv_id);
      query += ` WHERE medical_srv_id = '${medical_srv_id}'`;
    }

    const patients = await neon_sql(query);
    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    return NextResponse.json(
      { error: "Error al obtener los datos" },
      { status: 500 }
    );
  }
}
