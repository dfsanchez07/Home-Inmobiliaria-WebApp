import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
} from 'lucide-react';

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
      className="py-12 border-t-4 border-red-600"
      style={{
        backgroundColor: config.footerBgColor,
        color: config.footerTextColor,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 md:items-start">
          {/* Columna 1: Logo + descripción + redes */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              {config.logo ? (
                <img
                  src={config.logo}
                  alt={config.footerCompanyName}
                  className="h-10 w-10 object-contain"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-600 rounded-lg"></div>
              )}
              <h3 className="text-2xl font-bold">{config.footerCompanyName}</h3>
            </div>
            <p className="opacity-80 mb-6">{config.footerDescription}</p>
            {config.showFooterSocialIcons && (
              <div className="flex space-x-4 mt-4">
                {config.socialLinks?.map((link) => (
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
            )}
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          {config.showFooterQuickLinks && (
            <div className="md:pl-8">
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <div className="space-y-2">
                {config.footerLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="block opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Columna 3: Contacto */}
          {config.showFooterContactInfo && (
            <div className="md:pl-8">
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 opacity-80">
                {config.footerEmail && <p>📧 {config.footerEmail}</p>}
                {config.footerPhone && <p>📱 {config.footerPhone}</p>}
                {config.footerAddress && <p>📍 {config.footerAddress}</p>}
              </div>
            </div>
          )}
        </div>

        {config.showFooterCopyright && (
          <div className="border-t border-opacity-20 mt-8 pt-8 text-center opacity-60">
            <p>
              &copy; {new Date().getFullYear()} {config.footerCompanyName}. Todos los
              derechos reservados.
            </p>
          </div>
        )}
      </div>
    </footer>
  );
};
