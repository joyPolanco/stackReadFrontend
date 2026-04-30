import React, { useState } from "react";
import logo from "../assets/logo.png";
import { useAppStore } from "../store/useAppStore";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  Book,
  List,
  Folder,
  BookOpen,
  X,
  Quote,
  SettingsIcon,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

import { LogOut } from "lucide-react";

const opciones = [
  { name: "home", text: "Inicio", icon: <HomeIcon size={20} />, path: "/" },
  { name: "books", text: "Libros", icon: <Book size={20} />, path: "/books" },
  { name: "lists", text: "Listas", icon: <List size={20} />, path: "/lists" },
  {
    name: "collections",
    text: "Colecciones",
    icon: <Folder size={20} />,
    path: "/collections",
  },
  {
    name: "entries",
    text: "Lecturas",
    icon: <BookOpen size={20} />,
    path: "/entries",
  },
];

const MenuBar = ({ mobile }) => {
  const { isMenuOpen, setMenuOpen , setEditProfileModalOpen} = useAppStore();

  const navigate = useNavigate();
  const location = useLocation();

  const [locked, setLocked] = useState(false);

  // detectar activo por ruta
  const isActive = (path) => location.pathname === path;
  const { authUser, logout } = useAuthStore();
  // ================= MOBILE =================
  if (mobile) {
    return (
      <div className="bg-white border-t border-gray-200 flex justify-around py-2 shadow-lg">
        {opciones.map((op) => (
          <button
            key={op.name}
            onClick={() => navigate(op.path)}
            className={`
              flex flex-col items-center justify-center gap-1
              px-3 py-2 rounded-lg transition
              ${isActive(op.path) ? "text-emerald-600" : "text-gray-400"}
            `}
          >
            {op.icon}
            <span className="text-[10px]">{op.text}</span>
          </button>
        ))}
      </div>
    );
  }

  // ================= DESKTOP =================
  const handleMouseEnter = () => {
    if (!locked) setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setLocked(false);
  };

  const openAndLock = () => {
    setMenuOpen(true);
    setLocked(true);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      className={`
        h-screen bg-[#fbfbf9] border-r border-gray-200
        flex flex-col justify-between p-5
        transition-all duration-300
        ${isMenuOpen ? "w-72 lg:w-80" : "w-20"}
      `}
    >
      {/* HEADER */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div
            onClick={openAndLock}
            className={`flex items-center w-full cursor-pointer ${isMenuOpen ? "gap-3" : "justify-center"}`}
          >
            <img src={logo} className="w-9 h-9" />
            <h1
              className={`${isMenuOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
            >
              StackBook
            </h1>
          </div>

          {isMenuOpen && (
            <button onClick={closeMenu}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* OPTIONS */}
        <div className="flex flex-col gap-1">
          {opciones.map((opcion) => {
            const active = isActive(opcion.path);

            return (
              <div key={opcion.name} className="relative">
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-emerald-500 rounded-r" />
                )}

                <button
                  onClick={() => navigate(opcion.path)}
                  className={`
                    group flex items-center px-3 py-5 rounded-xl w-full
                    transition-all duration-200 text-sm font-medium

                    ${isMenuOpen ? "gap-3 justify-start" : "justify-center"}

                    ${
                      active
                        ? "bg-[#f4f5f1] text-emerald-700"
                        : "text-gray-500 hover:bg-[#eeefea] hover:text-emerald-700"
                    }
                  `}
                >
                  <div className="transition-transform group-hover:scale-110">
                    {opcion.icon}
                  </div>

                  <span
                    className={`
                      whitespace-nowrap
                      transition-all duration-200
                      ${isMenuOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}
                    `}
                  >
                    {opcion.text}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* FRASE */}
      {isMenuOpen && (
        <div className="mt-6 px-4 py-5 rounded-xl bg-[#f6f5f3] border border-[#f6f5f3]">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Quote size={14} className="text-emerald-700" />
            </div>

            <div className="text-sm">
              <p className="italic text-gray-800">
                “Piensa antes de hablar. Lee antes de pensar.”
              </p>

              <p className="text-xs text-emerald-700 mt-2">— Fran Lebowitz</p>
            </div>
          </div>
        </div>
      )}

      {/* USER */}
      <div className="mt-4 p-3 rounded-xl bg-[#f6f5f3] border border-gray-100 flex items-center justify-between">
        {/* LEFT: AVATAR + INFO */}
        <div className="flex items-center gap-3">
          {authUser?.picture ? (
            <img
              src={authUser.picture}
              className="w-9 h-9 rounded-full object-cover"
              alt="user avatar"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 text-white flex items-center justify-center text-sm font-semibold">
              {authUser?.name?.charAt(0)?.toUpperCase()}
            </div>
          )}

          {isMenuOpen && (
            <div className="leading-tight">
              <p className="text-sm font-semibold text-gray-800">
                {authUser?.name}
              </p>
              <p className="text-xs text-gray-500 truncate max-w-[120px]">
                {authUser?.email}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT: ACTIONS */}
        {isMenuOpen && (
          <div className="flex items-center gap-1">
            {/* SETTINGS */}
            <button
              className="
          p-2 rounded-lg
          text-gray-400 hover:text-emerald-600
          hover:bg-emerald-50
          transition-all duration-200
        " onClick={()=>setEditProfileModalOpen(true)}
            >
              <SettingsIcon size={18} />
            </button>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="
          p-2 rounded-lg
          text-gray-400 hover:text-red-600
          hover:bg-red-50
          transition-all duration-200
        "
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default MenuBar;
