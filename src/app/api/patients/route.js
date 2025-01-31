import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    console.log("Parámetro de búsqueda recibido:", search);
    let query = `SELECT * FROM patient`;

    if (search) {
      query += ` WHERE name ILIKE '%${search}%' OR last_name ILIKE '%${search}%'`;
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
      alergys,
    } = body;
    console.log(alergys);
    const result = await neon_sql`
      INSERT INTO patient (
        ci, name, last_name, gender, alergys, date_of_birth, age, guardian_name, contact_number, guardian_ci, relationship_to_patient
      ) VALUES (
        ${ci || 0} , ${name}, ${last_name}, ${gender}, ${
      alergys || "N/A"
    }, ${date_of_birth}, ${age}, ${guardian_name}, ${contact_number}, ${guardian_ci}, ${relationship_to_patient}
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
