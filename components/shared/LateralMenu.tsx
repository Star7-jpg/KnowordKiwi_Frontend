"use client";
import { Home, Compass, Users, Bookmark, Settings } from "lucide-react";
import { Menu, MenuItem } from "@headlessui/react";
import Link from "next/link"; // O tu componente de enlace de router preferido
import clsx from "clsx"; // Para combinar clases condicionalmente

const navigation = [
  { name: "Inicio", href: "#", icon: Home },
  { name: "Explorar", href: "#", icon: Compass },
  { name: "Comunidades", href: "#", icon: Users },
  { name: "Cursos", href: "#", icon: Bookmark },
  { name: "Configuración", href: "#", icon: Settings },
];

export default function Page() {
  return (
    <div className="p-4">
      {" "}
      {/* Agregamos un poco de padding para visualizarlo mejor */}
      <Menu as="nav" className="text-white">
        <div className="space-y-4">
          {navigation.map((item) => (
            <MenuItem key={item.name}>
              {({ active }) => (
                <Link href={item.href} legacyBehavior>
                  <a
                    className={clsx(
                      "flex items-center gap-2 rounded-md p-2",
                      active
                        ? "bg-blue-600 text-white"
                        : "text-white hover:bg-blue-500",
                    )}
                  >
                    <item.icon size={20} />
                    {item.name}
                  </a>
                </Link>
              )}
            </MenuItem>
          ))}
        </div>
      </Menu>
    </div>
  );
}
