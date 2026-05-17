export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: ProductReview[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: ProductMeta;
  thumbnail: string;
  images: string[];
};

export type ProductDimensions = {
  width: number;
  height: number;
  depth: number;
};

export type ProductMeta = {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
};

export type ProductReview = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

export type ProductsPage = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type ProductCategory = {
  slug: string;
  name: string;
  url: string;
};

export type SortKey = 'priceAsc' | 'priceDesc' | 'ratingDesc';

export type FeedScope =
  | { type: 'all'; sort?: SortKey }
  | { type: 'category'; category: string; sort?: SortKey }
  | { type: 'search'; query: string; sort?: SortKey };

export type FeedPageArg = {
  scope: FeedScope;
  page: number;
  pageSize: number;
};