export interface Product {
  id: string
  name: string
  status: string
  createdAt: string
  updatedAt: string
}

const products: Product[] = [
  {
    id: 'prod1',
    name: 'Producto 1',
    status: 'active',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-02').toISOString(),
  },
  {
    id: 'prod2',
    name: 'Producto 2',
    status: 'inactive',
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-03').toISOString(),
  },
  {
    id: 'prod3',
    name: 'Producto 3',
    status: 'active',
    createdAt: new Date('2024-03-01').toISOString(),
    updatedAt: new Date('2024-03-05').toISOString(),
  },
]

export function listProducts() {
  return products
}
