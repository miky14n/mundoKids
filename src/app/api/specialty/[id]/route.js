import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";

export async function GET(request, { params }) {
  console.log(
    params,
    `SELECT * FROM specialty WHERE specialty_id=${params.id}`
  );
  try {
    if (!params?.id) {
      return NextResponse.json(
        { error: `ID de la especialidad inválido ` },
        { status: 400 }
      );
    }
    const id = params.id;
    console.log("ID del especialidad recibido:", id);
    const specialty =
      await neon_sql`SELECT * FROM specialty WHERE specialty_id=${id}`;
    return NextResponse.json(specialty);
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    return NextResponse.json(
      { error: "Error al obtener los datos" },
      { status: 500 }
    );
  }
}
