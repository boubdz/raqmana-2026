"use client"; // ✅ أضف هذا السطر في الأعلى

import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

const socialLinks = [
  {
    name: 'Facebook',
    icon: Facebook,
    url: 'https://www.facebook.com/رقمنة',
    color: 'hover:text-[#1877F2]',
  },
  {
    name: 'X (Twitter)',
    icon: Twitter,
    url: 'https://x.com/رقمنة',
    color: 'hover:text-[#1DA1F2]',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://www.linkedin.com/company/رقمنة',
    color: 'hover:text-[#0A66C2]',
  },
];

export function SocialLinks() {
  return (
    <div className="flex items-center gap-4">
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 transition-colors duration-200 dark:text-gray-300 hover:opacity-80" // ✅ تغيير اللون الأساسي
          aria-label={social.name}
        >
          <social.icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}