import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { homeStatic } from '@/endpoints/seed/home-static'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return await generateMeta({
    doc: homeStatic as any,
  })
}

export default async function DemoPage() {
  return (
    <article className="pb-24 pt-16">
      {/* @ts-expect-error */}
      <RenderHero {...homeStatic.hero} />
      {/* @ts-expect-error */}
      <RenderBlocks blocks={homeStatic.layout} />
    </article>
  )
}
