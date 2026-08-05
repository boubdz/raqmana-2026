"use client";

import { useLanguage } from "@/contexts/language-context";

interface CategoryTranslationProps {
  nameKey: string;
}

export function CategoryTranslation({ nameKey }: CategoryTranslationProps) {
  const { t } = useLanguage();
  return <>{t(nameKey)}</>;
}
