"use client";
import { Input, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bell, Search, User, Trophy, MessageSquare, Users } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Link from "next/link";

export function Navbar() {
  const [activeTab, setActiveTab] = useState("notifications"); // 'notifications', 'messages', 'community'

  const notifications = [
    {
      id: 1,
      type: "achievement",
      icon: "/path/to/achievement-icon.png",
      title: "El primer brote desbloqueado.",
      points: "+5 ptos",
      date: "21.05.2025",
      actionText: "RECLAMA LA MEDALLA",
    },
    {
      id: 2,
      type: "rank",
      icon: "/path/to/rank-icon.png",
      title: "Conseguiste nuevo rango Aspirante",
      date: "21.05.2025",
    },
    {
      id: 3,
      type: "achievement-knoword",
      icon: "/path/to/brainly-icon.png",
      title: "Espacio Brainly desbloqueado.",
      points: "+5 ptos",
      date: "12.05.2025",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "Ana G.",
      message: "¡Hola! ¿Podrías ayudarme con un problema de física?",
      time: "Hace 5 min",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: 2,
      sender: "Pedro L.",
      message: "Revisa mi última respuesta, creo que te servirá.",
      time: "Ayer",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
  ];

  const communityUpdates = [
    {
      id: 1,
      title: "Nuevo evento: Maratón de Matemáticas",
      date: "20.06.2025",
      description: "¡Inscríbete ya y demuestra tus habilidades!",
    },
    {
      id: 2,
      title: "Reglas actualizadas del foro",
      date: "15.06.2025",
      description: "Por favor, revisa los cambios para una mejor convivencia.",
    },
  ];

  return (
    <nav className="bg-black text-white p-4 flex items-center justify-between z-50 relative">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold mr-8">KnoWord</h1>
      </div>

      {/* Search Bar */}
      <div className="flex-grow flex justify-center">
        <div className="relative w-full max-w-xl">
          <Input
            type="text"
            placeholder="Busca cualquier tema en KnoWord"
            className="w-full pl-12 pr-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search />
          </div>
        </div>
      </div>

      {/* Right Section: Icons and Dropdowns */}
      <div className="flex items-center space-x-4 ml-8 mr-4">
        {" "}
        {/* Adjusted space-x for better spacing */}
        {/* Headless UI Menu for Notifications */}
        <Menu as="div" className="relative">
          <MenuButton className="focus:outline-none p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
            <Bell className="w-6 h-6 text-white" />
          </MenuButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-900 z-50">
              {" "}
              {/* Three Icons Section (Tab Navigation) */}
              <div className="flex justify-around items-center py-3 border-b border-gray-200">
                {/* Logros (Achievements) Tab */}
                <div
                  className={`flex flex-col items-center cursor-pointer p-2 rounded-md ${
                    activeTab === "notifications"
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("notifications")}
                >
                  <Trophy className="w-6 h-6" />
                </div>
                {/* Mensajes (Messages) Tab */}
                <div
                  className={`flex flex-col items-center cursor-pointer p-2 rounded-md ${
                    activeTab === "messages"
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("messages")}
                >
                  <MessageSquare className="w-6 h-6" />
                </div>
                {/* Comunidad (Community) Tab */}
                <div
                  className={`flex flex-col items-center cursor-pointer p-2 rounded-md ${
                    activeTab === "community"
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("community")}
                >
                  <Users className="w-6 h-6" />
                </div>
              </div>
              {/* Dynamic Content Based on activeTab */}
              <div>
                {activeTab === "notifications" && (
                  <>
                    <div className="px-4 py-4 font-bold text-lg border-b border-gray-200">
                      Notificaciones
                    </div>
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <MenuItem key={notification.id} as="div">
                          {({ active }) => (
                            <div
                              className={`flex items-start p-4 border-b border-gray-100 last:border-b-0 ${
                                active ? "bg-gray-100" : ""
                              }`}
                            >
                              {/* Notification Icon/Image */}
                              {notification.type === "achievement" && (
                                <div className="flex-shrink-0 mr-3">
                                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Trophy className="w-6 h-6 text-blue-500" />
                                  </div>
                                </div>
                              )}
                              {notification.type === "rank" && (
                                <div className="flex-shrink-0 mr-3">
                                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-6 h-6 text-pink-500"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12.75L11.25 15 15 9.75M21 12c0 1.096-.134 2.164-.386 3.197M19.121 21.021A7.5 7.5 0 0012 24a7.5 7.5 0 00-7.121-2.979M2.879 21.021A7.5 7.5 0 0112 0c1.096 0 2.164.134 3.197.386M21.021 2.879A7.5 7.5 0 010 12c0-1.096.134-2.164.386-3.197M2.879 2.879A7.5 7.5 0 0012 0c1.096 0 2.164.134 3.197.386M21.021 21.021A7.5 7.5 0 0012 24a7.5 7.5 0 00-7.121-2.979M21.021 2.879A7.5 7.5 0 0112 0c-1.096 0-2.164.134-3.197.386"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              )}
                              {notification.type === "achievement-knoword" && (
                                <div className="flex-shrink-0 mr-3">
                                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-purple-500" />
                                  </div>
                                </div>
                              )}

                              <div className="flex-grow">
                                <p className="text-sm font-medium">
                                  {notification.title}
                                </p>
                                {notification.points && (
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    <span className="font-bold text-green-600">
                                      {notification.points}
                                    </span>{" "}
                                    añadidos a tu cuenta.
                                  </p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                  {notification.date}
                                </p>
                                {notification.actionText && (
                                  <button className="mt-2 px-4 py-1.5 bg-black text-white text-xs font-semibold rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600">
                                    {notification.actionText}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </MenuItem>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-center text-gray-500">
                        No tienes notificaciones de logros.
                      </div>
                    )}
                  </>
                )}

                {activeTab === "messages" && (
                  <>
                    <div className="px-4 py-4 font-bold text-lg border-b border-gray-200">
                      Mensajes
                    </div>
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <MenuItem key={message.id} as="div">
                          {({ active }) => (
                            <div
                              className={`flex items-start p-4 border-b border-gray-100 last:border-b-0 ${
                                active ? "bg-gray-100" : ""
                              }`}
                            >
                              <div className="flex-shrink-0 mr-3">
                                <img
                                  src={message.avatar}
                                  alt={`${message.sender}'s avatar`}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              </div>
                              <div className="flex-grow">
                                <p className="text-sm font-medium">
                                  {message.sender}
                                </p>
                                <p className="text-sm text-gray-700 mt-0.5">
                                  {message.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {message.time}
                                </p>
                              </div>
                            </div>
                          )}
                        </MenuItem>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-center text-gray-500">
                        No tienes mensajes.
                      </div>
                    )}
                  </>
                )}

                {activeTab === "community" && (
                  <>
                    <div className="px-4 py-4 font-bold text-lg border-b border-gray-200">
                      Tus Comunidades
                    </div>
                    {communityUpdates.length > 0 ? (
                      communityUpdates.map((update) => (
                        <MenuItem key={update.id} as="div">
                          {({ active }) => (
                            <div
                              className={`flex items-start p-4 border-b border-gray-100 last:border-b-0 ${
                                active ? "bg-gray-100" : ""
                              }`}
                            >
                              <div className="flex-shrink-0 mr-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                  <Users className="w-6 h-6 text-green-500" />
                                </div>
                              </div>
                              <div className="flex-grow">
                                <p className="text-sm font-medium">
                                  {update.title}
                                </p>
                                <p className="text-xs text-gray-700 mt-0.5">
                                  {update.description}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {update.date}
                                </p>
                              </div>
                            </div>
                          )}
                        </MenuItem>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-center text-gray-500">
                        No hay actualizaciones de la comunidad.
                      </div>
                    )}
                  </>
                )}
              </div>
            </MenuItems>
          </Transition>
        </Menu>
        {/* Headless UI Menu for User Profile */}
        <Menu as="div" className="relative">
          <MenuButton className="focus:outline-none p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
            <User className="w-6 h-6 text-white" />
          </MenuButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-900 z-50">
              {" "}
              <MenuItem>
                {({ active }) => (
                  <Link
                    href="/profile" // Replace with your actual profile page route
                    className={`block px-4 py-4 text-sm ${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    }`}
                  >
                    Ver perfil
                  </Link>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <a
                    href="/edit-profile" // Replace with your actual edit profile route
                    className={`block px-4 py-4 text-sm ${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    }`}
                  >
                    Editar perfil
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={() => console.log("Cerrar sesión")} // Implement actual logout logic here
                    className={`block w-full text-left px-4 py-4 text-sm ${
                      active ? "bg-red-100 text-red-700" : "text-gray-700"
                    }`}
                  >
                    Cerrar Sesión
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </nav>
  );
}
