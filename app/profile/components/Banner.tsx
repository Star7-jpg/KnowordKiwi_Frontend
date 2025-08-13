"use client";

import { Avatar } from "@/components/ui/userProfile/Avatar";
import { useState } from "react";
import Posts from "./Posts";
import Communities from "./Communities";
import Followers from "./Followers";
import { useAuthStore } from "@/store/authStore";

type ActiveTab = "posts" | "communities" | "followers";

export function Banner() {
  const user = useAuthStore((state) => state.user);
  const { bio, real_name, username, avatar_url } = user || {};
  const [activeTab, setActiveTab] = useState<ActiveTab>("posts");
  const getButtonClasses = (tab: ActiveTab) => {
    const baseClasses = "px-4 py-2 transition-colors duration-300 outline-none";
    if (activeTab === tab) {
      return `${baseClasses} border-b-2 border-primary text-white font-semibold`;
    }
    return `${baseClasses} text-gray-400 hover:text-gray-200`;
  };
  return (
    <div className="w-full flex flex-col">
      <section className="w-full max-w-5xl mx-auto bg-[#1f1e28] text-white mt-4 px-8 py-12 rounded-md shadow-md flex flex-col gap-y-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-around gap-8">
          {/* Avatar + seguidores */}
          <div className="flex flex-col items-center gap-4">
            <Avatar src={avatar_url} size="lg" />

            <div className="flex gap-8 text-center">
              <div>
                <p className="text-xl font-semibold">1</p>
                <span className="text-sm text-gray-400">Seguidores</span>
              </div>
              <div>
                <p className="text-xl font-semibold">1</p>
                <span className="text-sm text-gray-400">Siguiendo</span>
              </div>
            </div>
          </div>

          {/* Información del usuario */}
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-bold leading-snug">
                {username}
              </h1>
              <p className="text-base text-gray-300">{real_name}</p>
            </div>

            <div className="text-sm text-gray-400 leading-relaxed space-y-2">
              <p>{bio}</p>
            </div>
          </div>
        </div>
      </section>
      <div className="flex w-full max-w-5xl mx-auto justify-evenly border-b border-gray-800 mt-8 ">
        <button
          className={getButtonClasses("posts")}
          onClick={() => setActiveTab("posts")}
        >
          Publicaciones
        </button>
        <button
          className={getButtonClasses("communities")}
          onClick={() => setActiveTab("communities")}
        >
          Comunidades
        </button>
        <button
          className={getButtonClasses("followers")}
          onClick={() => setActiveTab("followers")}
        >
          Seguidores
        </button>
      </div>
      {/**Area de contenido dinámico */}
      <div className="w-full max-w-5xl mx-auto mt-8">
        {activeTab === "posts" && <Posts />}
        {activeTab === "communities" && <Communities />}
        {activeTab === "followers" && <Followers />}
      </div>
    </div>
  );
}
