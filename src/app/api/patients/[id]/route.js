import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const patient_id = searchParams.get("patient_id");
    console.log(params.id, patient_id);
    if (!params?.id || isNaN(Number(params.id))) {
      return NextResponse.json(
        { error: `ID del paciente inválido ` },
        { status: 400 }
      );
    }
    const id = Number(params.id);

    console.log("ID del paciente recibido:", id);
    let query = `SELECT * FROM patient WHERE ci=${id}`;
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
