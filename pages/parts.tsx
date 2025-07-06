// pages/parts.tsx
import { GetServerSideProps } from 'next'
import { sanityClient } from '../lib/sanity.client'
import { sparePartsQuery } from '../lib/queries'

type SparePart = {
  _id: string
  title: string
  description: string
  price: number
  inStock: boolean
  brand: string
  model: string
  category: string
  images: string[]
}

type Props = {
  parts: SparePart[]
}

export default function PartsPage({ parts }: Props) {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Available Spare Parts</h1>
      {parts.length === 0 && <p>No parts found.</p>}
      {parts.map((part) => (
        <div key={part._id} className="border p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">{part.title}</h2>
          <p className="text-gray-600">{part.description}</p>
          <p>💰 KES {part.price}</p>
          <p>Brand: {part.brand}</p>
          <p>Model: {part.model}</p>
          <p>Category: {part.category}</p>
          <p>In Stock: {part.inStock ? 'Yes' : 'No'}</p>
          {part.images?.[0] && (
            <img
              src={part.images[0]}
              alt={part.title}
              className="w-64 h-auto mt-4 rounded"
            />
          )}
        </div>
      ))}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const parts = await sanityClient.fetch(sparePartsQuery)
  return {
    props: {
      parts,
    },
  }
}
