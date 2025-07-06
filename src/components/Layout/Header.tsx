import React, { useState } from 'react';
import {
  Building2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Menu,
  X,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Header: React.FC = () => {
  const { config } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const socialIcons: Record<string, React.ReactNode> = {
    facebook: <Facebook size={config.socialIconSize || 20} />,
    instagram: <Instagram size={config.socialIconSize || 20} />,
    twitter: <Twitter size={config.socialIconSize || 20} />,
    linkedin: <Linkedin size={config.socialIconSize || 20} />,
    youtube: <Youtube size={config.socialIconSize || 20} />,
    email: <Mail size={config.socialIconSize || 20} />,
  };

  const menuItems = ['Inicio', 'Asistente', 'Propiedades', 'Contacto'];

  return (
    <>
      <header
        className="relative border-b-4 border-red-600"
        style={{ backgroundColor: config.headerBgColor }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-28">
            {/* Columna 1: Logo */}
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

            {/* Columna 2: Menú Desktop / Hamburguesa Mobile */}
            <div className="flex justify-center">
              {/* Menú desktop */}
              <nav className="hidden md:flex justify-center items-center space-x-8">
                {menuItems.map((item) => {
                  const href = `#${item.toLowerCase()}`;
                  return (
                    <a
                      key={item}
                      href={href}
                      className="font-medium transition-colors hover:scale-105 transform duration-200"
                      style={
                        {
                          color: config.menuItemColor,
                          fontSize: `${config.menuItemFontSize || 16}px`,
                          '--hover-color': config.menuItemHoverColor,
                        } as React.CSSProperties
                      }
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color =
                          config.menuItemHoverColor)
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
              {/* Botón Hamburguesa Mobile */}
              <div className="md:hidden">
                {config.showMobileMenu && (
                  <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 rounded-md"
                    style={{ color: config.menuItemColor }}
                    aria-label="Abrir menú"
                  >
                    <Menu className="h-8 w-8" />
                  </button>
                )}
              </div>
            </div>

            {/* Columna 3: Íconos sociales */}
            <div className="flex justify-end items-center space-x-4">
              {config.socialLinks?.length > 0 &&
                config.socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-75 transition-opacity"
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

      {/* Menú Overlay Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-8 right-8 p-2 text-gray-700"
            aria-label="Cerrar menú"
          >
            <X className="h-8 w-8" />
          </button>
          <nav className="flex flex-col items-center space-y-8">
            {menuItems.map((item) => {
              const href = `#${item.toLowerCase()}`;
              return (
                <a
                  key={item}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                  className="text-3xl font-semibold transition-colors"
                  style={
                    {
                      color: config.menuItemColor,
                      '--hover-color': config.menuItemHoverColor,
                    } as React.CSSProperties
                  }
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color =
                      config.menuItemHoverColor)
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
        </div>
      )}
    </>
  );
};
