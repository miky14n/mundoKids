import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ToggleAvatar from "./ToggleAvatar";

export default async function NavBarNxtUI() {
  const session = await getServerSession(authOptions);
  const listRol = ["doctor"];
  return (
    <>
      {session && (
        <Navbar className="bg-customPink text-customPurple" isBordered>
          <NavbarBrand justify="start" className="ml-[-20px]">
            <Link justify="start" className="pl-4" href="/">
              <Image src="/Logo.png" alt="Logo" width="200" height="200" />
              <p className="font-bold text-inherit"> </p>
            </Link>
          </NavbarBrand>
          {}
          <NavbarContent className="hidden sm:flex gap-4 " justify="center">
            {/**<NavbarItem isActive>
              <Link aria-current="page" color="secondary" href="/">
                Inicio
              </Link>
            </NavbarItem> */}
            {!listRol.includes(session.user.role) && (
              <NavbarItem>
                <Link color="foreground" href="/noursing">
                  Enfermería
                </Link>
              </NavbarItem>
            )}
            <NavbarItem>
              <Link color="foreground" href="/medical-services/listOfServices">
                Servicios Médicos
              </Link>
            </NavbarItem>
            {session.user.role != "nurse" && (
              <NavbarItem>
                <Link color="foreground" href="/medical-history">
                  Historial Clinico
                </Link>
              </NavbarItem>
            )}
            <>
              {!listRol.includes(session.user.role) && (
                <NavbarItem>
                  <Link color="foreground" href="/administration">
                    Administración
                  </Link>
                </NavbarItem>
              )}
            </>
          </NavbarContent>

          <NavbarContent as="div" justify="end">
            <ToggleAvatar name={session.user.name} role={session.user.role} />
          </NavbarContent>
        </Navbar>
      )}
    </>
  );
}
