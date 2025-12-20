import { Mail, ExternalLink } from "lucide-react";
import Layout from "@/components/Layout";

const Contact = () => {
  return (
    <Layout>
      <title>Contact — Fırat Kesen</title>
      <meta name="description" content="Get in touch with Fırat Kesen for industrial design collaborations and project inquiries." />

      <section className="min-h-[calc(100vh-10rem)] flex items-center py-16 md:py-24">
        <div className="container-narrow">
          <div className="max-w-xl mx-auto text-center">
            {/* Page Header */}
            <header className="mb-16 opacity-0 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-light text-foreground tracking-tight mb-4">
                Contact
              </h1>
              <p className="text-muted-foreground">
                Open for collaborations and opportunities
              </p>
            </header>

            {/* Email */}
            <div className="mb-12 opacity-0 animate-fade-in-up stagger-1">
              <a
                href="mailto:firatkesen14@gmail.com"
                className="group inline-flex items-center gap-3 text-xl md:text-2xl text-foreground hover:text-muted-foreground transition-colors duration-300"
              >
                <Mail size={24} className="text-muted-foreground" />
                <span className="tracking-wide">firatkesen14@gmail.com</span>
              </a>
            </div>

            {/* Divider */}
            <div className="section-divider max-w-xs mx-auto mb-12 opacity-0 animate-fade-in stagger-2" />

            {/* Social Links */}
            <div className="flex items-center justify-center gap-8 opacity-0 animate-fade-in-up stagger-3">
              <a
                href="#"
                className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <span className="tracking-wide">Fiverr</span>
                <ExternalLink size={14} className="opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              </a>

              <span className="text-border">|</span>

              <a
                href="#"
                className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <span className="tracking-wide">Upwork</span>
                <ExternalLink size={14} className="opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
