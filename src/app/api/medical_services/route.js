import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";
export async function POST(request) {
  try {
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
    const user_id = services_id;
    if (!services_id || !patient_id || !responsible || !user_id) {
      return NextResponse.json(
        {
          error:
            "Los campos 'services_id', 'id_patient', 'responsible' y 'user_id' son obligatorios.",
        },
        { status: 400 }
      );
    }
    console.log("Los datos a guardar son:", body);
    const result = await neon_sql`
      INSERT INTO medical_services (
        services_id, 
        patient_id, 
        responsible, 
        status, 
        temperature, 
        weight, 
        height, 
        user_id,
        date
      )
      VALUES (
        ${services_id}, 
        ${patient_id}, 
        ${responsible}, 
        ${status || false}, 
        ${temperature || null}, 
        ${weight || null}, 
        ${height || null}, 
        ${user_id},
        ${date}
      )
      RETURNING *;
    `;

    // Responder con el registro insertado
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error al insertar el servicio médico:", error);
    return NextResponse.json(
      { error: "Error al registrar el servicio médico. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
