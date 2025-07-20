import { Linkedin, Globe, Facebook, Phone, MessageCircle } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          {/* Contact Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="h-4 w-4" />
              <a href="tel:+2347067412852">+234 706 741 2852</a>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <MessageCircle className="h-4 w-4" />
              <a href="https://wa.me/2348024764090" target="_blank" rel="noopener noreferrer">
                +234 802 476 4090
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Connect</h3>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="h-4 w-4" />
              <a href="https://www.linkedin.com/in/toheebay12" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Globe className="h-4 w-4" />
              <a href="https://toyi.netlify.app/" target="_blank" rel="noopener noreferrer">
                Portfolio
              </a>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Facebook className="h-4 w-4" />
              <a href="https://www.facebook.com/kolawole.adebayo.1069" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </div>
          </div>

          {/* Powered By */}
          <div className="space-y-2 md:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-foreground">Powered By</h3>
            <p className="text-muted-foreground">
              Adebayo Toheeb@Plp C2025
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-6 pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 CryptoFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};