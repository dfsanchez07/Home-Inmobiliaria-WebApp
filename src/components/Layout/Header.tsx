import React from 'react';
import { Building2, Facebook, Instagram, Twitter, Linkedin, Youtube, Mail } from 'lucide-react';
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
      className="shadow-sm border-b border-gray-100"
      style={{ backgroundColor: config.headerBgColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            {config.logo ? (
              <img 
                src={config.logo} 
                alt={config.title}
                className="h-10 w-10 object-contain"
              />
            ) : (
              <div className="p-2 bg-blue-600 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">{config.title}</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-8">
              <a 
                href="#inicio" 
                className="font-medium transition-colors hover:scale-105 transform duration-200"
                style={{ 
                  color: config.menuItemColor,
                  '--hover-color': config.menuItemHoverColor 
                } as React.CSSProperties}
                onMouseEnter={(e) => e.currentTarget.style.color = config.menuItemHoverColor}
                onMouseLeave={(e) => e.currentTarget.style.color = config.menuItemColor}
              >
                Inicio
              </a>
              <a 
                href="#chat" 
                className="font-medium transition-colors hover:scale-105 transform duration-200"
                style={{ 
                  color: config.menuItemColor,
                  '--hover-color': config.menuItemHoverColor 
                } as React.CSSProperties}
                onMouseEnter={(e) => e.currentTarget.style.color = config.menuItemHoverColor}
                onMouseLeave={(e) => e.currentTarget.style.color = config.menuItemColor}
              >
                Asistente
              </a>
              <a 
                href="#propiedades" 
                className="font-medium transition-colors hover:scale-105 transform duration-200"
                style={{ 
                  color: config.menuItemColor,
                  '--hover-color': config.menuItemHoverColor 
                } as React.CSSProperties}
                onMouseEnter={(e) => e.currentTarget.style.color = config.menuItemHoverColor}
                onMouseLeave={(e) => e.currentTarget.style.color = config.menuItemColor}
              >
                Propiedades
              </a>
              <a 
                href="#contacto" 
                className="font-medium transition-colors hover:scale-105 transform duration-200"
                style={{ 
                  color: config.menuItemColor,
                  '--hover-color': config.menuItemHoverColor 
                } as React.CSSProperties}
                onMouseEnter={(e) => e.currentTarget.style.color = config.menuItemHoverColor}
                onMouseLeave={(e) => e.currentTarget.style.color = config.menuItemColor}
              >
                Contacto
              </a>
            </nav>

            {config.socialLinks && config.socialLinks.length > 0 && (
              <div className="hidden md:flex items-center space-x-4">
                {config.socialLinks.map((link) => (
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
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
