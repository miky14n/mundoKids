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
  return (
    <>
      {session && (
        <Navbar className="bg-customPink text-customPurple">
          <NavbarBrand>
            <Link href="/">
              <Image src="/Logo.png" alt="Logo" width="200" height="200" />
            </Link>
          </NavbarBrand>

          <NavbarContent className="hidden sm:flex gap-5" justify="center">
            <NavbarItem isActive>
              <Link aria-current="page" color="secondary" href="/">
                Inicio
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="/noursing">
                Enfermería
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="/services/listOfServices">
                Servicios Médicos
              </Link>
            </NavbarItem>
            <>
              {session.user.role != "nourse" && (
                <NavbarItem>
                  <Link color="foreground" href="/administration">
                    Administración
                  </Link>
                </NavbarItem>
              )}
            </>
          </NavbarContent>

          <NavbarContent as="div" justify="end">
            <ToggleAvatar name={session.user.name} />
          </NavbarContent>
        </Navbar>
      )}
    </>
  );
}
