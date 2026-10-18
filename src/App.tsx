import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import { getProduct, getProducts } from "./lib/api";
import type { Product } from "./lib/api";

const PAGE_SIZE = 8;

function ProductListing() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState("All Products");

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ["products", { search, page, category }],
    queryFn: () => getProducts({
      limit: PAGE_SIZE,
      skip: page * PAGE_SIZE,
      search: category === "All Products" ? search : (search || category)
    }),
    placeholderData: (previousData) => previousData
  });

  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(0);
    setCategory("All Products");
  };
  const chooseCategory = (value: string) => {
    setCategory(value);
    setSearch("");
    setPage(0);
  };
  const products = data?.products ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));
  const categories = ["All Products", "Beauty", "Fragrances", "Skin Care", "Furniture"];

  return (
    <div className="site-shell">
      <Header search={search} onSearchChange={changeSearch} />
      <main>
        <section className="hero-panel">
          <div className="hero-decoration deco-one">✳</div>
          <div className="hero-decoration deco-two">✦</div>
          <div className="hero-decoration deco-three">✧</div>
          <div className="hero-heading">
            <span className="eyebrow"><Sparkles size={13} /> THE BEAUTY EDIT</span>
            <h1>Explore Our Shop</h1>
          </div>
          <p className="hero-copy">From skincare to everyday essentials, discover thoughtfully selected products made to bring a little more beauty to your routine. Find your next favorite and enjoy a shopping experience that feels special.</p>
        </section>

        <section className="catalog-panel" id="collections">
          <div className="catalog-topline">
            <div className="category-tabs" role="group" aria-label="Product categories">
              {categories.map((item) => (
                <button key={item} type="button" className={category === item ? "category-tab selected" : "category-tab"}
                  onClick={() => chooseCategory(item)}>{item}</button>
              ))}
            </div>
            <span className="results-count">{data ? `${data.total} products` : "Discover something lovely"}</span>
          </div>

          {isPending ? (
            <div className="status-panel"><span className="loader" /><h2>Finding your favorites</h2><p>Loading the latest products…</p></div>
          ) : isError ? (
            <div className="status-panel error-panel"><h2>We couldn’t load the products</h2><p>{error instanceof Error ? error.message : "Something went wrong."}</p><button className="outline-button" onClick={() => window.location.reload()}>Try again</button></div>
          ) : products.length === 0 ? (
            <div className="status-panel"><h2>No products found</h2><p>Try a different keyword or explore another category.</p><button className="outline-button" onClick={() => { changeSearch(""); chooseCategory("All Products"); }}>Clear search</button></div>
          ) : (
            <>
              {isFetching && <div className="fetching-note">Updating products…</div>}
              <div className="products-grid">
                {products.map((product: Product) => <ProductCard key={product.id} product={product} />)}
              </div>
              <div className="pagination">
                <p>Showing <strong>{page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, data?.total ?? 0)}</strong> of <strong>{data?.total ?? 0}</strong></p>
                <div className="pagination-actions">
                  <button className="page-button" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}><ArrowLeft size={15} /> Previous</button>
                  <span className="page-indicator">{page + 1} / {totalPages}</span>
                  <button className="page-button" disabled={(page + 1) * PAGE_SIZE >= (data?.total ?? 0)} onClick={() => setPage((p) => p + 1)}>Next <ArrowRight size={15} /></button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
      <footer id="contact"><span className="footer-brand"><Sparkles size={14} /> crystal.</span><span id="about">A little beauty in every detail.</span><span>Made for your everyday ritual.</span></footer>
    </div>
  );
}

function ProductDetails() {
  const { id = "" } = useParams();
  const { data: product, isPending, isError, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    enabled: Boolean(id)
  });

  if (isPending) return <div className="details-shell"><div className="status-panel"><span className="loader" /><h2>Loading product…</h2></div></div>;
  if (isError || !product) return <div className="details-shell"><div className="status-panel"><h2>Product unavailable</h2><p>{error instanceof Error ? error.message : "We couldn’t find that product."}</p><Link className="outline-button inline-button" to="/">Back to shop</Link></div></div>;

  return (
    <div className="site-shell details-shell">
      <div className="details-header"><Link to="/" className="brand"><span>✧</span> crystal.</Link><Link to="/" className="back-link"><ArrowLeft size={16} /> Back to shop</Link></div>
      <section className="details-panel">
        <div className="details-image"><img src={product.images?.[0] || product.thumbnail} alt={product.title} onError={(e) => { e.currentTarget.src = product.thumbnail; }} /></div>
        <div className="details-copy">
          <span className="eyebrow"><Sparkles size={13} /> {product.category}</span>
          <p className="product-category">{product.brand || "CRYSTAL SELECTS"}</p>
          <h1>{product.title}</h1>
          <div className="detail-rating">★ {product.rating.toFixed(1)} <span>·</span> {product.stock > 0 ? `${product.stock} in stock` : "Currently unavailable"}</div>
          <p className="details-description">{product.description}</p>
          <div className="detail-price">${product.price.toFixed(2)} <span>{product.discountPercentage.toFixed(0)}% off</span></div>
          <button className="cart-button detail-cart" onClick={() => alert(`${product.title} added to your shopping list.`)}>Add to cart</button>
          <p className="detail-note">A thoughtful pick, chosen just for you.</p>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return <Routes><Route path="/" element={<ProductListing />} /><Route path="/products/:id" element={<ProductDetails />} /><Route path="*" element={<div className="not-found"><h1>Page not found</h1><Link to="/">Return to shop</Link></div>} /></Routes>;
}