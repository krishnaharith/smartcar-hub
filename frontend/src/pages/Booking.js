import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialServiceId = queryParams.get("serviceId") || "";

  const [formData, setFormData] = useState({
    serviceId: initialServiceId,
    date: "",
    vehicle: "",
    userId: ""
  });
  
  const [userAuth, setUserAuth] = useState(false);
  const [services, setServices] = useState([]);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch available services for the dropdown
    const fetchServices = async () => {
      try {
        const res = await API.get("/services");
        setServices(res.data);
      } catch (err) {
        console.error("Failed to load services for dropdown", err);
      }
    };
    fetchServices();

    // Set authenticated user ID if exists
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setFormData(prev => ({ ...prev, userId: parsedUser._id }));
      setUserAuth(true);
    } else {
      setUserAuth(false);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      const res = await API.post("/bookings", formData);
      setStatusMsg({ type: "success", text: res.data.message || "Booking successfully placed!" });
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setStatusMsg({ type: "danger", text: err.response?.data?.error || "Booking failed. Please check your connection." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-secondary-subtle">
      <Navbar />
      <div className="container mt-5 flex-grow-1">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            {!userAuth ? (
              <div className="alert alert-warning text-center rounded-4 shadow-sm" role="alert">
                 <h4 className="alert-heading fw-bold mb-3">Authentication Required</h4>
                 <p>Please log in or register to book an appointment.</p>
                 <hr />
                 <div className="d-flex justify-content-center gap-3 mt-3">
                    <button onClick={() => navigate("/login")} className="btn btn-dark px-4 fw-medium">Sign In</button>
                    <button onClick={() => navigate("/register")} className="btn btn-outline-dark px-4 fw-medium">Register</button>
                 </div>
              </div>
            ) : (
              <div className="card shadow-lg border-0 rounded-4 overflow-hidden bg-dark text-white">
                <div className="p-4 p-md-5">
                  <h2 className="text-center mb-4 text-blue fw-bold">Book an Appointment</h2>
                  
                  {statusMsg.text && (
                    <div className={`alert alert-${statusMsg.type} rounded-3 py-2 text-center`}>
                      {statusMsg.text}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label text-white fw-medium">Select Service</label>
                      <select 
                        className="form-select bg-secondary text-white border-dark py-2" 
                        name="serviceId" 
                        value={formData.serviceId} 
                        onChange={handleChange} 
                        required
                      >
                        <option value="" disabled>-- Choose a premium service --</option>
                        {services.map(s => (
                          <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                        {services.length === 0 && <option value="custom">Custom Service / Other</option>}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="form-label text-white fw-medium">Vehicle Make & Model</label>
                      <input 
                        type="text" 
                        className="form-control bg-secondary text-white border-dark py-2" 
                        name="vehicle" 
                        placeholder="e.g., 2023 Porsche 911 GT3"
                        value={formData.vehicle} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label text-white fw-medium">Preferred Date</label>
                      <input 
                        type="date" 
                        className="form-control bg-secondary text-white border-dark py-2" 
                        name="date" 
                        value={formData.date} 
                        onChange={handleChange} 
                        min={new Date().toISOString().split("T")[0]}
                        required 
                      />
                      <small className="text-secondary mt-1 d-block">We will contact you to confirm the exact time.</small>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-warning w-100 py-3 mt-3 rounded-pill fw-bold text-uppercase" 
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Confirm Booking"}
                    </button>
                  </form>
                  <div className="mt-4 text-center">
                      <button type="button" onClick={() => navigate(-1)} className="btn btn-link text-secondary text-decoration-none">
                         ← Back
                      </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Booking;
