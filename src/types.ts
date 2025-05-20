export interface Producto {
  id?: number;
  name: string;
  category: string;
  unitPrice: string;
  expirationDate: string;
  quantityInStock: string;
  creationDate: string | null;
  updateDate: string | null;
}

export interface SearchValues {
  name: string,
  category: string,
  availability: string
}
