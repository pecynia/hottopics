import { Locale } from '@/app/../../i18n.config'
import { getDictionary } from '@/lib/dictionary'

export default async function Banner({ lang }: { lang: Locale }) {

    const { banner } = await getDictionary(lang)

    return (
        <div>{banner.description}</div>
    )
}