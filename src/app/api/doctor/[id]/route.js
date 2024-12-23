import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";

export async function GET(request, { params }) {
  try {
    if (!params.id) {
      return NextResponse.json(
        { error: `ID del dr inválido ` },
        { status: 400 }
      );
    }
    const id = params.id;

    console.log("ID del paciente recibido:", id);
    let query = `SELECT * FROM doctor WHERE doctor_id='${id}'`;

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
