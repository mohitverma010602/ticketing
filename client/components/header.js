import Link from "next/link";
import "bootstrap/dist/css/bootstrap.css";

const NavLink = ({ href, label }) => (
  <li className="nav-item">
    <Link href={href} className="nav-link text-dark">
      {label}
    </Link>
  </li>
);

export default function Header({ currentUser }) {
  const links = [
    !currentUser && { label: "Sign in", href: "/auth/signin" },
    !currentUser && { label: "Sign up", href: "/auth/signup" },
    currentUser && { label: "Sell Ticket", href: "/tickets/new" },
    currentUser && { label: "My Orders", href: "/orders" },
    currentUser && { label: "Sign out", href: "/auth/signout" },
  ]
    .filter(Boolean)
    .map(({ label, href }) => <NavLink key={href} href={href} label={label} />);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand text-dark">
          GitTix
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">{links}</ul>
        </div>
      </div>
    </nav>
  );
}
