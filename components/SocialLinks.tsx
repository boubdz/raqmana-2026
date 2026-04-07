"use client";

import { Facebook, Twitter, Linkedin } from 'lucide-react';

const socialLinks = [
  {
    name: 'Facebook',
    icon: Facebook,
    url: 'https://www.facebook.com/raqmana0/', // ✅ الرابط الصحيح لصفحتك
    color: 'hover:text-[#1877F2]',
  },
  // الروابط التالية معلقة لحين إنشاء الحسابات على تويتر (X) ولينكد إن
  // يمكنك إلغاء التعليق عند جاهزية الروابط
  // {
  //   name: 'X (Twitter)',
  //   icon: Twitter,
  //   url: 'https://x.com/raqmana', // استبدل باسم المستخدم
  //   color: 'hover:text-[#1DA1F2]',
  // },
  // {
  //   name: 'LinkedIn',
  //   icon: Linkedin,
  //   url: 'https://www.linkedin.com/company/raqmana', // استبدل بالرابط الصحيح
  //   color: 'hover:text-[#0A66C2]',
  // },
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
          className="text-muted-foreground transition-colors duration-200 hover:text-primary"
          aria-label={social.name}
        >
          <social.icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}