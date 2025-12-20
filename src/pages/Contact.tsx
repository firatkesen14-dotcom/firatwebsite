import { Mail, ExternalLink } from "lucide-react";

const Contact = () => {
  return (
    <section className="min-h-[100vh] flex items-center py-16 md:py-24 bg-gray-900 text-white">
      <div className="container mx-auto text-center">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-light mb-4">Contact</h1>
          <p className="text-gray-400">Open for collaborations and opportunities</p>
        </header>

        {/* Email */}
        <div className="mb-12 flex flex-col items-center gap-4">
          <a
            href="mailto:firatkesen14@gmail.com"
            className="group inline-flex items-center gap-3 text-xl md:text-2xl text-white hover:text-gray-300 transition-colors duration-300"
          >
            <Mail size={24} className="text-red-500 group-hover:text-blue-500 transition-colors duration-300" />
            <span>firatkesen14@gmail.com</span>
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 max-w-xs mx-auto mb-12" />

        {/* Social Links */}
        <div className="flex items-center justify-center gap-8">
          <a
            href="https://www.fiverr.com/sellers/firatkesen/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-300"
          >
            <span>Fiverr</span>
            <ExternalLink size={14} className="opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
          </a>

          <span className="text-gray-600">|</span>

          <a
            href="https://www.upwork.com/freelancers/~012282e88904824f59?viewMode=1"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-300"
          >
            <span>Upwork</span>
            <ExternalLink size={14} className="opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
