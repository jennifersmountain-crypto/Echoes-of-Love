'use client';

import Image from 'next/image';
import Link from 'next/link';

const navItems = [
  { href: '/chat', label: 'Community Chat', icon: '/assets/icon-chat.png' },
  { href: '/gallery', label: 'Memory Gallery', icon: '/assets/icon-gallery.png' },
  { href: '/voicemail', label: 'Voicemails', icon: '/assets/icon-voicemail.png' },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="bg-cloud-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/assets/logo.png"
                  alt="Echoes of Love Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-serif text-deep-slate hidden sm:block">Echoes of Love</span>
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-deep-slate hover:bg-sky-blue transition-colors"
                >
                  <div className="relative w-6 h-6">
                    <Image
                      src={item.icon}
                      alt={item.label}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center py-16 px-4">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/hero-bg.jpg"
            alt="Serene sky background"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ivory/50 to-ivory" />
        </div>
        
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <Image
              src="/assets/logo.png"
              alt="Echoes of Love"
              fill
              className="object-contain"
              priority
            />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-serif text-deep-slate mb-4 leading-tight">
            Echoes of Love
          </h1>
          
          <p className="text-lg sm:text-xl text-warm-grey mb-8 leading-relaxed">
            A place of love and remembrance. Everyone is welcome.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2 bg-soft-gold text-cloud-white px-8 py-3 rounded-full font-medium hover:bg-[#b8962e] transition-colors shadow-lg"
            >
              Join the Community
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center gap-2 bg-cloud-white text-deep-slate border-2 border-soft-gold px-8 py-3 rounded-full font-medium hover:bg-sky-blue transition-colors"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Message Section */}
      <section className="py-12 px-4 bg-sky-blue/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-serif text-deep-slate mb-4">
            Welcome, Friend
          </h2>
          <p className="text-warm-grey leading-relaxed mb-6">
            Whether you've lost a spouse, a parent, a child, a friend, or anyone dear to you — 
            you are not alone. This is a safe space to share your feelings, cherish memories, 
            and find comfort in others who understand.
          </p>
          <div className="bg-cloud-white rounded-2xl p-6 shadow-sm inline-block">
            <p className="text-soft-gold font-medium text-lg italic">
              "No judgment. No politics. This is a place of love."
            </p>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 px-4 bg-cloud-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif text-center text-deep-slate mb-12">
            How We Can Help
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Chat Card */}
            <Link href="/chat" className="group bg-ivory rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Image
                  src="/assets/icon-chat.png"
                  alt="Community Chat"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-serif text-deep-slate mb-2">Community Chat</h3>
              <p className="text-warm-grey text-sm">
                Connect with others who understand your journey. Share stories, offer support, and find comfort together.
              </p>
            </Link>

            {/* Gallery Card */}
            <Link href="/gallery" className="group bg-ivory rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Image
                  src="/assets/icon-gallery.png"
                  alt="Memory Gallery"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-serif text-deep-slate mb-2">Memory Gallery</h3>
              <p className="text-warm-grey text-sm">
                Share photos of your loved ones or images that bring you joy during this time.
              </p>
            </Link>

            {/* Voicemail Card */}
            <Link href="/voicemail" className="group bg-ivory rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Image
                  src="/assets/icon-voicemail.png"
                  alt="Voicemails"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-serif text-deep-slate mb-2">Voicemails</h3>
              <p className="text-warm-grey text-sm">
                Record a voicemail for someone you've lost. Share it publicly or keep it private.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deep-slate text-cloud-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <Image
              src="/assets/logo.png"
              alt="Echoes of Love"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-warm-grey mb-4">
            A safe haven for those grieving. No judgment. No politics. Only love.
          </p>
          <p className="text-sm text-warm-grey/70">
            © {new Date().getFullYear()} Echoes of Love. Everyone is welcome.
          </p>
        </div>
      </footer>
    </div>
  );
}