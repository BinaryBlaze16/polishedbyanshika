import usePublicSettings from '../hooks/usePublicSettings';

const PolicyLayout = ({ title, subtitle, icon: Icon, updatedDate, children }) => {
  const { whatsappUrl, emailUrl, settings } = usePublicSettings();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FDF8F4] pt-20">
        {/* Hero Banner */}
        <section className="relative bg-gradient-to-br from-[#3D2B1F] via-[#5C3D2E] to-[#3D2B1F] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-400 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-white/50 mb-8 font-medium">
              <Link to="/" className="hover:text-white/80 transition-colors">Home</Link>
              <ChevronRight size={14} />
              <span className="text-white/80">{title}</span>
            </nav>
            <div className="flex items-start gap-5">
              {Icon && (
                <div className="w-14 h-14 bg-rose-500/20 rounded-2xl flex items-center justify-center border border-rose-400/30 shrink-0 mt-1">
                  <Icon size={28} className="text-rose-300" />
                </div>
              )}
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-white/60 mt-3 text-base md:text-lg max-w-2xl leading-relaxed">
                    {subtitle}
                  </p>
                )}
                {updatedDate && (
                  <p className="mt-4 text-xs text-white/40 font-mono">
                    Last updated: {updatedDate}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="prose-policy">
            {children}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-200/60 rounded-3xl p-8 text-center">
            <h3 className="text-xl font-display font-bold text-[#3D2B1F] mb-2">Still have questions?</h3>
            <p className="text-[#6B5347] text-sm mb-6">
              Our team is happy to help. Reach out via WhatsApp or email and we'll get back to you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm gap-2"
              >
                💬 Chat on WhatsApp ({settings.businessWhatsapp})
              </a>
              <a
                href={emailUrl}
                className="btn-secondary text-sm gap-2"
              >
                ✉️ Email {settings.businessEmail}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PolicyLayout;
