import { useLanguage } from "@/contexts/LanguageContext";

interface FooterProps {
  variant?: 'default' | 'minimal';
}

export function Footer({ variant = 'default' }: FooterProps) {
  const { t } = useLanguage();

  const footerLinks = [
    { label: t('footer.about'), href: 'https://kindtoolai.replit.app/about' },
    { label: t('footer.disclaimer'), href: 'https://kindtoolai.replit.app/disclaimer' },
    { label: t('footer.privacy'), href: 'https://kindtoolai.replit.app/privacy-policy' },
    { label: t('footer.terms'), href: 'https://kindtoolai.replit.app/terms-of-service' },
    { label: t('footer.contact'), href: 'https://kindtoolai.replit.app/contact' }
  ];

  if (variant === 'minimal') {
    return (
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2025 KindTool.ai - All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4 mt-2 sm:mt-0">
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-primary to-accent rounded-md"></div>
              <span className="font-semibold text-lg">KindTool</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.quickLinks')}</h3>
            <div className="space-y-2">
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.contact')}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a
                href="https://kindtoolai.replit.app/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:text-foreground transition-colors"
              >
                {t('footer.contactUs')}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 KindTool.ai - All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}