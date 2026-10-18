import { ArrowUpRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../lib/api";
import { Card, CardContent } from "./ui/card";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="product-card">
      <Link to={`/products/${product.id}`} className="product-image-wrap" aria-label={`View ${product.title}`}>
        <img className="product-image" src={product.thumbnail} alt={product.title} loading="lazy"
          onError={(e) => { e.currentTarget.src = "https://placehold.co/400x400/f6f6f6/777?text=Product"; }} />
        <span className="image-action"><ArrowUpRight size={17} /></span>
      </Link>
      <CardContent className="product-info">
        <p className="product-category">{product.brand || product.category}</p>
        <Link to={`/products/${product.id}`} className="product-title">{product.title}</Link>
        <div className="product-meta">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <span className="rating"><Star size={13} fill="currentColor" /> {product.rating.toFixed(1)}</span>
        </div>
      </CardContent>
    </Card>
  );
}