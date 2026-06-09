import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { homeStatic } from '@/endpoints/seed/home-static'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return await generateMeta({
    doc: homeStatic,
  })
}

export default async function DemoPage() {
  return (
    <article className="pb-24 pt-16">
      <RenderHero {...homeStatic.hero} />
      <RenderBlocks blocks={homeStatic.layout} />
    </article>
  )
}
