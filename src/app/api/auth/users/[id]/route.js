import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";

export async function GET(request, { params }) {
  try {
    console.log("LO que hay en get one", params.id);
    const { searchParams } = new URL(request.url);
    const isActivate = searchParams.get("isactivate");
    const email = params.id;
    let query;
    if (isActivate) {
      query = `SELECT verified_account FROM users WHERE email=$1`;
    } else {
      query = `SELECT * FROM users WHERE email=$1`;
    }
    const userFound = await neon_sql(query, [email]);
    return NextResponse.json(userFound);
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    return NextResponse.json(
      { error: "Error al obtener los datos" },
      { status: 500 }
    );
  }
}
