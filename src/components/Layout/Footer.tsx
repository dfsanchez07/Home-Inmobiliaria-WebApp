import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { config } = useAppStore();

  const socialIcons: Record<string, React.ReactNode> = {
    facebook: <Facebook className="h-6 w-6" />,
    instagram: <Instagram className="h-6 w-6" />,
    twitter: <Twitter className="h-6 w-6" />,
    linkedin: <Linkedin className="h-6 w-6" />,
    youtube: <Youtube className="h-6 w-6" />,
    email: <Mail className="h-6 w-6" />,
  };

  return (
    <footer 
      id="contacto"
      className="shadow-inner"
      style={{ backgroundColor: config.footerBgColor, color: config.footerTextColor }}
    >
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            {config.logo ? (
                <img 
                  src={config.logo} 
                  alt={config.title}
                  className="h-12"
                />
              ) : (
                <div className="p-2 bg-blue-600 rounded-lg inline-block">
                  <h1 className="text-xl font-bold text-white">{config.title}</h1>
                </div>
              )}
            <p className="text-base" style={{ color: config.footerTextColor }}>
              {config.footerText || 'Tu socio de confianza en bienes raíces.'}
            </p>
            <div className="flex space-x-6">
              {config.socialLinks && config.socialLinks.map((link) => (
                <a 
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-75 transition-opacity"
                  style={{ color: config.footerTextColor }}
                  title={link.name}
                >
                  <span className="sr-only">{link.name}</span>
                  {socialIcons[link.icon] || <span>{link.name}</span>}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase" style={{ color: config.footerTextColor }}>Soluciones</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#propiedades" className="text-base hover:underline" style={{ color: config.footerTextColor }}>Propiedades</a></li>
                  <li><a href="#chat" className="text-base hover:underline" style={{ color: config.footerTextColor }}>Asistente IA</a></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold tracking-wider uppercase" style={{ color: config.footerTextColor }}>Soporte</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base hover:underline" style={{ color: config.footerTextColor }}>Preguntas Frecuentes</a></li>
                  <li><a href="#" className="text-base hover:underline" style={{ color: config.footerTextColor }}>Contacto</a></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase" style={{ color: config.footerTextColor }}>Compañía</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base hover:underline" style={{ color: config.footerTextColor }}>Sobre Nosotros</a></li>
                  <li><a href="#" className="text-base hover:underline" style={{ color: config.footerTextColor }}>Blog</a></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold tracking-wider uppercase" style={{ color: config.footerTextColor }}>Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base hover:underline" style={{ color: config.footerTextColor }}>Privacidad</a></li>
                  <li><a href="#" className="text-base hover:underline" style={{ color: config.footerTextColor }}>Términos</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <p className="text-base text-center" style={{ color: config.footerTextColor }}>&copy; {new Date().getFullYear()} {config.title}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
