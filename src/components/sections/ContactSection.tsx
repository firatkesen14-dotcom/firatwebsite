import { Mail, ExternalLink } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 md:py-32 border-t border-border/50">
      <div className="container-narrow">
        <div className="max-w-xl mx-auto text-center">
          {/* Section Header */}
          <header className="mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight mb-4">
              Contact
            </h2>
            <p className="text-muted-foreground">
              Open for collaborations and opportunities
            </p>
          </header>

          {/* Email */}
          <div className="mb-12">
            <a
              href="mailto:firatkesen14@gmail.com"
              className="group inline-flex items-center gap-3 text-xl md:text-2xl text-foreground hover:text-muted-foreground transition-colors duration-300"
            >
              <Mail size={24} className="text-muted-foreground" />
              <span className="tracking-wide">firatkesen14@gmail.com</span>
            </a>
          </div>

          {/* Divider */}
          <div className="section-divider max-w-xs mx-auto mb-12" />

          {/* Social Links */}
          <div className="flex items-center justify-center gap-8">
            <a
              href="https://www.fiverr.com/firatkesen/buying?source=avatar_menu_profile"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              <span className="tracking-wide">Fiverr</span>
              <ExternalLink
                size={14}
                className="opacity-50 group-hover:opacity-100 transition-opacity duration-300"
              />
            </a>

            <span className="text-border">|</span>

            <a
              href="https://www.upwork.com/freelancers/~012282e88904824f59"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              <span className="tracking-wide">Upwork</span>
              <ExternalLink
                size={14}
                className="opacity-50 group-hover:opacity-100 transition-opacity duration-300"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
