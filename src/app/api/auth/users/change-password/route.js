// src/app/api/auth/reset-password/route.js

import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";
import bcrypt from "bcrypt"; // Asegúrate de tener bcrypt instalado
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const email = session.user.email;
    const queryCheck = `SELECT * FROM users WHERE email = $1`;
    const userFound = await neon_sql(queryCheck, [email]);
    const { password, newPassword } = await request.json();
    console.log("los datos de la consulta", password, newPassword, email);
    if (userFound.length === 0) {
      return NextResponse.json(
        {
          error: "El email no existe.",
        },
        {
          status: 400,
        }
      );
    }

    const matchPassword = await bcrypt.compare(password, userFound[0].password);
    if (!matchPassword) {
      return NextResponse.json(
        {
          error:
            "La contraseña actual ingresada no coincide con la contraseña registrada en el sistema.",
        },
        {
          status: 400,
        }
      );
    }

    if (password === newPassword) {
      return NextResponse.json(
        { error: "Las contraseñas son iguales." },
        { status: 400 }
      );
    }
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "La nueva contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const change = await neon_sql(
      `
      UPDATE users
      SET password = $1
      WHERE email = $2
      RETURNING *;
    `,
      [hashedPassword, email]
    );

    if (change.length === 0) {
      return NextResponse.json(
        { error: `No se encontró al usuario: ${email}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Contraseña actualizada exitosamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    return NextResponse.json(
      { error: "Error al actualizar la contraseña. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
