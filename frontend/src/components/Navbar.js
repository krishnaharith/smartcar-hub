import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar(){
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
       setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

return(

<nav className="navbar navbar-expand-lg navbar-dark bg-dark">

<div className="container">

<Link className="navbar-brand d-flex align-items-center" to="/">
  {/* The uploaded photo should be saved as logo.png in the public folder */}
  <img 
    src="/logo.png" 
    alt="Labhante Customs" 
    style={{ height: "45px", objectFit: "contain" }}
    onError={(e) => {
      // Fallback styling that looks similar to the image if the file isn't found
      e.target.style.display = 'none';
      e.target.nextSibling.style.display = 'flex';
    }}
  />
  <div className="flex-column align-items-center" style={{ display: 'none' }}>
    <span className="text-white fw-bolder fs-3" style={{ fontFamily: 'Impact, Arial Black, sans-serif', letterSpacing: '1px' }}>LABHANTE</span>
    <span className="bg-white text-dark fw-bold px-2 rounded-1" style={{ fontSize: '0.6rem', letterSpacing: '4px', marginTop: '-4px' }}>CUSTOMS</span>
  </div>
</Link>

<button
className="navbar-toggler"
type="button"
data-bs-toggle="collapse"
data-bs-target="#menu"
>

<span className="navbar-toggler-icon"></span>

</button>

<div className="collapse navbar-collapse" id="menu">

<ul className="navbar-nav ms-auto align-items-center">

<li className="nav-item">
<Link className="nav-link fw-bold" to="/">Home</Link>
</li>

<li className="nav-item">
<Link className="nav-link fw-bold" to="/services">Our Services</Link>
</li>

<li className="nav-item">
<Link className="nav-link fw-bold" to="/about">About Us</Link>
</li>

<li className="nav-item">
<Link className="nav-link fw-bold" to="/booking">Book Appointment</Link>
</li>

<li className="nav-item me-lg-3">
<Link className="nav-link fw-bold" to="/contact">Contact Us</Link>
</li>

{user ? (
  <>
    {user.role === "admin" ? (
      <li className="nav-item">
        <Link className="nav-link text-warning fw-bold" to="/admin">Admin Dashboard</Link>
      </li>
    ) : (
      <li className="nav-item">
        <Link className="nav-link" to="/dashboard">My Portal</Link>
      </li>
    )}
    <li className="nav-item">
      <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
    </li>
  </>
) : (
  <>
    <li className="nav-item">
      <Link className="nav-link" to="/login">Login</Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link text-warning" to="/login?admin=true">Admin Portal</Link>
    </li>
    <li className="nav-item ms-lg-2">
      <Link className="nav-link btn text-white px-3 fw-bold shadow-sm" style={{ background: 'linear-gradient(45deg, #4FA8D1, #3E8CB3)' }} to="/register">Register</Link>
    </li>
  </>
)}

</ul>

</div>

</div>

</nav>

);

}

export default Navbar;