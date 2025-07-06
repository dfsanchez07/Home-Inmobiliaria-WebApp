import React from 'react';
import {
  Building2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Header: React.FC = () => {
  const { config } = useAppStore();

  const socialIcons: Record<string, React.ReactNode> = {
    facebook: <Facebook className="h-5 w-5" />,
    instagram: <Instagram className="h-5 w-5" />,
    twitter: <Twitter className="h-5 w-5" />,
    linkedin: <Linkedin className="h-5 w-5" />,
    youtube: <Youtube className="h-5 w-5" />,
    email: <Mail className="h-5 w-5" />,
  };

  return (
    <header
      className="relative border-b-4 border-red-600"
      style={{ backgroundColor: config.headerBgColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center h-28">
          {/* Columna 1: Logo (ahora posicionado absolutamente) */}
          <div className="flex items-center">
            <div
              className="absolute left-4 sm:left-6 lg:left-8 top-full -translate-y-1/2 z-20 
                         bg-white p-2 rounded-full shadow-lg"
            >
              {config.logo ? (
                <img
                  src={config.logo}
                  alt={config.title}
                  className="h-[120px] w-[120px] object-contain rounded-full"
                />
              ) : (
                <div className="p-2 bg-blue-600 rounded-full">
                  <Building2 className="h-16 w-16 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Menú centrado */}
          <nav className="hidden md:flex justify-center items-center space-x-8">
            {['Inicio', 'Asistente', 'Propiedades', 'Contacto'].map((item) => {
              const href = `#${item.toLowerCase()}`;
              return (
                <a
                  key={item}
                  href={href}
                  className="font-medium transition-colors hover:scale-105 transform duration-200"
                  style={
                    {
                      color: config.menuItemColor,
                      '--hover-color': config.menuItemHoverColor,
                    } as React.CSSProperties
                  }
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = config.menuItemHoverColor)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = config.menuItemColor)
                  }
                >
                  {item}
                </a>
              );
            })}
          </nav>

          {/* Íconos sociales a la derecha */}
          <div className="hidden md:flex justify-end items-center space-x-4">
            {config.socialLinks?.length > 0 &&
              config.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  title={link.name}
                  style={{ color: config.menuItemColor }}
                >
                  {socialIcons[link.icon] || <span>{link.name}</span>}
                </a>
              ))}
          </div>
        </div>
      </div>
    </header>
  );
};
