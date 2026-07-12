"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.24 2H21l-6.55 7.49L22.2 22h-6.24l-4.88-6.39L5.42 22H2.64l7.02-8.03L2 2h6.4l4.42 5.84L18.24 2Zm-1.1 18.2h1.72L7 3.7H5.16l11.98 16.5Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

/* Reusable animated link with a sliding underline — used by all footer nav lists */
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group relative inline-block text-gray-400 transition-colors hover:text-white">
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-amber-400 transition-all duration-300 ease-out group-hover:w-full" />
    </Link>
  );
}

const columnVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const socialLinks = [
  { href: "https://www.facebook.com/md.azizul.islam.176759", label: "Facebook", Icon: FacebookIcon },
  { href: "https://x.com/md_azizul63253", label: "X (Twitter)", Icon: TwitterIcon },
  { href: "https://www.linkedin.com/in/azizul-islam-dev/", label: "LinkedIn", Icon: LinkedInIcon },
];

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/gadgets", label: "Explore Gadgets" },
  { href: "/items/add", label: "Sell an Item" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const categoryLinks = [
  { href: "/gadgets?category=phone", label: "Phones" },
  { href: "/gadgets?category=laptop", label: "Laptops" },
  { href: "/gadgets?category=camera", label: "Cameras" },
  { href: "/gadgets?category=audio", label: "Audio" },
  { href: "/gadgets?category=gaming", label: "Gaming" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0A0A0B] text-gray-300">
      {/* Signature hairline: soft amber glow along the top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-amber-400/[0.06] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
        >
          {/* Brand */}
          <motion.div variants={columnVariants} transition={{ duration: 0.5, ease: "easeOut" }}>
            <h3 className="text-xl font-bold tracking-tight text-white">
              Gadget<span className="text-amber-400">Bazar</span>
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Bangladesh&apos;s trusted marketplace for buying and selling second-hand
              gadgets — phones, laptops, cameras, and more.
            </p>

            <div className="mt-5 flex gap-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-gray-300 transition-colors hover:border-amber-400/40 hover:text-amber-400 hover:shadow-[0_0_16px_rgba(251,191,36,0.25)]"
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={columnVariants} transition={{ duration: 0.5, ease: "easeOut" }}>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/90">
              Quick Links
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div variants={columnVariants} transition={{ duration: 0.5, ease: "easeOut" }}>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/90">
              Categories
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={columnVariants} transition={{ duration: 0.5, ease: "easeOut" }}>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/90">
              Contact Us
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-amber-400" />
                <span className="text-gray-400">Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-amber-400" />
                <span className="text-gray-400">+880 1234-567890</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="shrink-0 text-amber-400" />
                <span className="text-gray-400">support@gadgetbazar.com</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-gray-500 sm:flex-row"
        >
          <p>&copy; {new Date().getFullYear()} GadgetBazar. All rights reserved.</p>
          <div className="flex gap-5">
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}