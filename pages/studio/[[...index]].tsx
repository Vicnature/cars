// pages/studio/[[...index]].tsx
'use client '
import { NextStudio } from 'next-sanity/studio'
import config from '../../sanity.config'


export default function StudioPage() {
  return <NextStudio config={config} />
}
