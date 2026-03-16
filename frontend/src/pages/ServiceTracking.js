import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ServiceTracking() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const fetchBookings = async () => {
      try {
        const res = await API.get(`/bookings/user/${parsedUser._id}`);
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch user bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  if (loading) return <div className="min-vh-100 bg-dark text-white d-flex justify-content-center align-items-center">Loading...</div>;

  return (
    <div className="d-flex flex-column min-vh-100 bg-secondary-subtle">
      <Navbar />
      
      <div className="container mt-5 flex-grow-1">
        <div className="row mb-5 text-center">
          <div className="col">
            <h1 className="fw-bold text-dark display-5">
              <span className="text-warning">Service</span> Tracking
            </h1>
            <p className="text-muted lead">Track the real-time status of your vehicle's service below.</p>
          </div>
        </div>

        {!user ? (
          <div className="alert alert-warning text-center rounded-4 shadow-sm" role="alert">
            <h4 className="alert-heading fw-bold mb-3">Authentication Required</h4>
            <p>Please sign in or register to view and track your service appointments.</p>
            <hr />
            <div className="d-flex justify-content-center gap-3 mt-3">
               <button onClick={() => navigate("/login")} className="btn btn-dark px-4 fw-medium">Sign In</button>
               <button onClick={() => navigate("/register")} className="btn btn-outline-dark px-4 fw-medium">Register</button>
            </div>
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              {bookings.length === 0 ? (
                <div className="card shadow-sm border-0 rounded-4 text-center p-5">
                  <h5 className="text-muted mb-3">No Services Found</h5>
                  <p className="mb-4">You haven't booked any services yet.</p>
                  <button onClick={() => navigate("/booking")} className="btn btn-warning fw-bold px-4">Book a Service Now</button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-4">
                  {bookings.map((booking, _id) => {
                     // Determine progress bar percentage
                     let progress = 0;
                     if (booking.trackingStatus === "Car Received") progress = 14;
                     else if (booking.trackingStatus === "Inspection Completed") progress = 28;
                     else if (booking.trackingStatus === "Service Started") progress = 42;
                     else if (booking.trackingStatus === "Work in Progress") progress = 57;
                     else if (booking.trackingStatus === "Quality Check") progress = 71;
                     else if (booking.trackingStatus === "Service Completed") progress = 85;
                     else if (booking.trackingStatus === "Ready for Delivery") progress = 100;

                     return (
                        <div key={booking._id || _id} className="card shadow-sm border-0 rounded-4 overflow-hidden">
                           <div className="card-header bg-dark text-white py-3 border-0 d-flex justify-content-between align-items-center">
                              <h5 className="mb-0 fw-bold">{booking.vehicle || 'Unknown Vehicle'}</h5>
                              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill shadow-sm">
                                {new Date(booking.date).toLocaleDateString()}
                              </span>
                           </div>
                           <div className="card-body p-4 bg-white">
                              <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted fw-medium">Service Package: <strong className="text-dark">{booking.serviceName || booking.serviceId}</strong></span>
                                <span className="fw-bold fs-5" style={{color: progress === 100 ? '#198754' : '#0d6efd'}}>{booking.trackingStatus || 'Pending'}</span>
                              </div>
                              
                              <div className="progress mt-4 rounded-pill" style={{ height: "20px" }}>
                                <div 
                                  className={`progress-bar progress-bar-striped progress-bar-animated ${progress === 100 ? 'bg-success' : 'bg-primary'}`}
                                  role="progressbar" 
                                  style={{ width: `${progress}%` }} 
                                  aria-valuenow={progress} 
                                  aria-valuemin="0" 
                                  aria-valuemax="100"
                                >
                                  {progress}%
                                </div>
                              </div>
                              <div className="d-flex justify-content-between text-muted mt-2 px-1" style={{ fontSize: '0.65rem' }}>
                                <span>Received</span>
                                <span>Inspection</span>
                                <span>Started</span>
                                <span>Progress</span>
                                <span>QA</span>
                                <span>Done</span>
                                <span>Delivery</span>
                              </div>
                           </div>
                        </div>
                     );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default ServiceTracking;
