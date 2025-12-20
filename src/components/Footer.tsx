const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-8 mt-auto">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Fırat Kesen</p>
          <p className="tracking-wide">Industrial Designer</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
