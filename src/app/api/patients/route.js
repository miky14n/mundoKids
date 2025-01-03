import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const patient_id = searchParams.get("patient_id");

    console.log("ID del paciente recibido:", patient_id);
    let query = `SELECT * FROM patient`;
    if (patient_id) {
      console.log(patient_id);
      query += ` WHERE patient_id = '${patient_id}'`;
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
    const {
      ci,
      name,
      last_name,
      gender,
      date_of_birth,
      age,
      guardian_name,
      contact_number,
      guardian_ci,
      relationship_to_patient,
    } = body;
    const result = await neon_sql`
      INSERT INTO patient (
        ci, name, last_name, gender, date_of_birth, age, guardian_name, contact_number, guardian_ci, relationship_to_patient
      ) VALUES (
        ${ci}, ${name}, ${last_name}, ${gender}, ${date_of_birth}, ${age}, ${guardian_name}, ${contact_number}, ${guardian_ci}, ${relationship_to_patient}
      )
      RETURNING *;
    `;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error al insertar el paciente:", error);
    return NextResponse.json(
      { error: "Error al crear el paciente. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}

export function PUT() {
  return;
}
