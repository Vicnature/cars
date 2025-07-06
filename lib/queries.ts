export const sparePartsQuery = `
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
