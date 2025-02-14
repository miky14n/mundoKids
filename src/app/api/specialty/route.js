import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";

export async function GET() {
  try {
    const specialtys =
      await neon_sql`SELECT * FROM specialty ORDER BY name ASC`;
    return NextResponse.json(specialtys);
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
    const { name, description, price } = body;
    if (!name || !price) {
      return NextResponse.json(
        { error: "Los campos 'name' y 'price' son obligatorios." },
        { status: 400 }
      );
    }
    const result = await neon_sql`
        INSERT INTO specialty (name, description, price)
        VALUES (${name}, ${description || null}, ${price})
        RETURNING *;
      `;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error al insertar la especialidad:", error);
    return NextResponse.json(
      { error: "Error al crear la especialidad. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}

export function PUT() {
  return;
}
