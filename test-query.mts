import 'dotenv/config'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: false,
})

const query = `
  *[_type == "sparePart"]{
    _id,
    title,
    description,
    price,
    inStock,
    "brand": brand->name,
    "model": model->name,
    "category": category->name,
    "images": images[].asset->url
  }
`

client.fetch(query)
  .then(data => console.log('🧩 Parts found:', data))
  .catch(err => console.error('❌ Query failed:', err.message))
