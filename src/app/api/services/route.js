import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";

export async function GET() {
  try {
    const services = await neon_sql`SELECT * FROM services ORDER BY name ASC`;
    return NextResponse.json(services);
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
    const { name, description, price, home_price } = body;
    if (!name || !price) {
      return NextResponse.json(
        { error: "Los campos 'name' y 'price' son obligatorios." },
        { status: 400 }
      );
    }
    const result = await neon_sql`
        INSERT INTO services (name, description, price,home_price)
        VALUES (${name}, ${description || null}, ${price},${home_price || null})
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
