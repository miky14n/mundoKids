import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { neon_sql } from "@/app/lib/neon";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "mundokids" },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      async authorize(credentials, req) {
        try {
          const queryCheck = `SELECT * FROM users WHERE email = $1`;
          const userFound = await neon_sql(queryCheck, [credentials.email]);

          if (!userFound || userFound.length === 0) {
            console.error("Usuario no encontrado:", credentials.email);
            throw new Error("No se encontró un usuario con este correo.");
          }

          const user = userFound[0];
          const matchPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!matchPassword) {
            console.error("Contraseña incorrecta para el usuario:", user.email);
            throw new Error("La contraseña es incorrecta.");
          }

          return {
            id: user.id,
            name: user.user_name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Error en authorize:", error);
          throw new Error("Credenciales inválidas.");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log("Inicio de sesión exitoso:", user);
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
