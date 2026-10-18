import { Gem, Search, ShoppingCart } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function Header({ search, onSearchChange }: HeaderProps) {
  return (
    <header className="topbar">
      <Link to="/" className="brand"><Gem size={16} strokeWidth={2.5} /> crystal.</Link>
      <nav className="main-nav" aria-label="Main navigation">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Shop</NavLink>
        <a className="nav-link" href="#collections">Collections</a>
        <a className="nav-link" href="#contact">Contact</a>
        <a className="nav-link" href="#about">About</a>
      </nav>
      <label className="search-box">
        <span className="sr-only">Search products</span>
        <input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search products..." />
        <Search size={18} />
      </label>
      <button className="cart-button" type="button" onClick={() => alert("Your cart is ready for your favorites.")}>
        <ShoppingCart size={15} /> <span>View cart</span>
      </button>
    </header>
  );
}