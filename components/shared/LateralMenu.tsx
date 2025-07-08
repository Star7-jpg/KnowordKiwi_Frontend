"use client";
import { Home, Compass, Users, Bookmark, Settings } from "lucide-react";
import { Menu, MenuItem } from "@headlessui/react";
import Link from "next/link";
import clsx from "clsx";

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
      <Menu as="nav" className="text-white">
        <ul className="flex flex-col gap-2">
          {navigation.map((item) => (
            <MenuItem key={item.name}>
              {({ active }) => (
                <li>
                  <Link
                    href={item.href}
                    className={clsx(
                      "inline-flex items-center gap-2 rounded-md py-2 px-4 transition-colors duration-200",
                      active
                        ? "bg-blue-600 text-white"
                        : "text-white hover:bg-blue-500",
                    )}
                  >
                    <item.icon size={20} />
                    {item.name}
                  </Link>
                </li>
              )}
            </MenuItem>
          ))}
        </ul>
      </Menu>
    </div>
  );
}
