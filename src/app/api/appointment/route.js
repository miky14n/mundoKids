import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    let query = `SELECT * FROM medical_appointment`;
    if (date) {
      console.log(date);
      query += ` WHERE date = '${date}'`;
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
export async function POST(request) {
  try {
    const body = await request.json();
    console.log(body);
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
    if (
      !patient_id ||
      !ci ||
      !type_of_appointment ||
      !specialty_id ||
      !doctor_id ||
      !date
    ) {
      return NextResponse.json(
        {
          error:
            "Los campos 'patient_id', 'ci', 'type_of_appointment', 'specialty_id', 'doctor_id' y 'date' son obligatorios.",
        },
        { status: 400 }
      );
    }

    // Inserción en la base de datos
    const result = await neon_sql`
      INSERT INTO medical_appointment (
        patient_id,
        ci,
        type_of_appointment,
        specialty_id,
        doctor_id,
        date,
        height,
        weight,
        temperature,
        responsible
      ) VALUES (
        ${patient_id},
        ${ci},
        ${type_of_appointment},
        ${specialty_id},
        ${doctor_id},
        ${date},
        ${height || null},
        ${weight || null},
        ${temperature || null},
        ${responsible || null}
      )
      RETURNING *;
    `;

    // Respuesta con el registro creado
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error al insertar la cita médica:", error);
    return NextResponse.json(
      { error: "Error al crear la cita médica. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
