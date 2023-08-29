import 'server-only'
import type { Locale } from '@/app/../../i18n.config'

const dictionaries = {
  en: () => import('@/app/../dictionaries/en.json').then(module => module.default),
  nl: () => import('@/app/../dictionaries/nl.json').then(module => module.default)
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()