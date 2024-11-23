import { NextResponse } from "next/server";
import { neon_sql } from "@/app/libs/neon";
export async function GET() {
  try {
    const patients = await neon_sql`SELECT * FROM doctor`;
    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    return NextResponse.json(
      { error: "Error al obtener los datos" },
      { status: 500 }
    );
  }
}
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, last_name, ci, contact_number, email, hire_date } = body;
    if (!name || !last_name || !ci) {
      return NextResponse.json(
        { error: "Los campos 'name', 'last_name' y 'ci' son obligatorios." },
        { status: 400 }
      );
    }
    const result = await neon_sql`
      INSERT INTO doctor (name, last_name, ci, contact_number, email, hire_date)
      VALUES (
        ${name},
        ${last_name},
        ${ci},
        ${contact_number || "N/A"},
        ${email || "N/A"},
        ${hire_date || new Date()}
      )
      RETURNING *;
    `;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error al insertar el doctor:", error);
    return NextResponse.json(
      { error: "Error al crear el doctor. Inténtalo de nuevo.", error },
      { status: 500 }
    );
  }
}
