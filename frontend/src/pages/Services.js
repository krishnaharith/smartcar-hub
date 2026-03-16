import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import { Link, useLocation } from "react-router-dom";

function Services() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const highlightTerm = queryParams.get("highlight") || "";

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cardRefs = useRef({});

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    // Scroll to the highlighted card once services are mapped
    if (services.length > 0 && highlightTerm) {
      setTimeout(() => {
        const matchingDbService = services.find(s => s.name.toLowerCase() === highlightTerm.toLowerCase());
        if (matchingDbService && cardRefs.current[matchingDbService._id]) {
          cardRefs.current[matchingDbService._id].scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    }
  }, [services, highlightTerm]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await API.get("/services");
      setServices(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch services. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-secondary-subtle">
      <Navbar />
      <div className="container mt-5 flex-grow-1">
        <h2 className="text-center mb-5 text-uppercase fw-bold text-dark">
          Our Premium Services
        </h2>
        {loading ? (
          <div className="text-center">Loading services...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : services.length === 0 ? (
           <div className="text-center text-muted col-12 my-5 py-5 border rounded bg-light border-light-subtle shadow-sm">
             <h4 className="fw-light">No services currently available.</h4>
             <p>Please check back later or contact us directly.</p>
           </div>
        ) : (
          <div className="row g-4">
            {services.map((s) => (
              <div className="col-md-4" key={s._id} ref={el => cardRefs.current[s._id] = el}>
                <div className={`card h-100 bg-dark text-white service-hover position-relative overflow-hidden ${highlightTerm && s.name.toLowerCase() === highlightTerm.toLowerCase() ? 'border border-3 border-info shadow-lg' : 'border-0 shadow-sm'}`}>
                   {/* Decorative top border */}
                   <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #4FA8D1, #fdf5e6)' }}></div>
                  <div className="card-body p-4 d-flex flex-column">
                    <h5 className="card-title text-blue border-bottom border-secondary pb-2 mb-3">{s.name}</h5>
                    <div className="mb-3">
                         <span className="badge bg-secondary me-2">{s.category || "General"}</span>
                    </div>
                    <p className="card-text flex-grow-1 text-light-50">{s.description || "Premium automotive care and enhancement."}</p>
                    <div className="mt-4 pt-3 border-top border-secondary d-flex justify-content-end align-items-center">
                        <Link to={`/booking?serviceId=${s._id}`} className="btn btn-info btn-sm px-3 rounded-pill text-dark fw-bold shadow-sm">Book Now</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Services;
