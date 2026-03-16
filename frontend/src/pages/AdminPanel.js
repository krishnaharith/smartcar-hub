import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function AdminPanel() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "admin") {
       navigate("/dashboard"); // Kick unauthorized users
       return;
    }
    
    setUser(parsedUser);

    // Fetch Admin Data
    const fetchData = async () => {
      try {
        const bookingsRes = await API.get("/bookings");
        setBookings(bookingsRes.data);

        const customersRes = await API.get("/users");
        setCustomers(customersRes.data);

        const reviewsRes = await API.get("/reviews");
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await API.put(`/bookings/${bookingId}/status`, { trackingStatus: newStatus });
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, trackingStatus: newStatus } : b));
      alert("Status updated successfully!");
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <div className="min-vh-100 bg-dark">Loading...</div>;

  return (
    <div className="d-flex min-vh-100 bg-secondary-subtle">
      {/* Sidebar */}
      <div className="bg-dark text-white p-4 d-flex flex-column" style={{ width: "280px", position: "fixed", height: "100vh", overflowY: "auto" }}>
        <h3 className="fw-bold mb-4 text-warning">Admin Panel</h3>
        
        <ul className="nav nav-pills flex-column mb-auto gap-2">
          <li className="nav-item">
            <button onClick={() => setActiveTab("dashboard")} className={`nav-link text-white fw-bold text-start w-100 border-0 ${activeTab === "dashboard" ? "bg-primary shadow" : "opacity-75 hover-opacity-100"}`} style={{ backgroundColor: activeTab === "dashboard" ? "#4FA8D1" : "transparent" }}>Dashboard</button>
          </li>
          <li className="nav-item">
             <button onClick={() => setActiveTab("customers")} className={`nav-link text-white fw-bold text-start w-100 border-0 ${activeTab === "customers" ? "bg-primary shadow" : "opacity-75 hover-opacity-100"}`} style={{ backgroundColor: activeTab === "customers" ? "#4FA8D1" : "transparent" }}>Customers</button>
          </li>
          <li className="nav-item">
             <button onClick={() => setActiveTab("vehicles")} className={`nav-link text-white fw-bold text-start w-100 border-0 ${activeTab === "vehicles" ? "bg-primary shadow" : "opacity-75 hover-opacity-100"}`} style={{ backgroundColor: activeTab === "vehicles" ? "#4FA8D1" : "transparent" }}>Vehicles & Fleet</button>
          </li>
          <li className="nav-item">
             <button onClick={() => setActiveTab("bookings")} className={`nav-link text-white fw-bold text-start w-100 border-0 ${activeTab === "bookings" ? "bg-primary shadow" : "opacity-75 hover-opacity-100"}`} style={{ backgroundColor: activeTab === "bookings" ? "#4FA8D1" : "transparent" }}>Active Bookings</button>
          </li>

          <li className="nav-item">
             <button onClick={() => setActiveTab("reviews")} className={`nav-link text-white fw-bold text-start w-100 border-0 ${activeTab === "reviews" ? "bg-primary shadow" : "opacity-75 hover-opacity-100"}`} style={{ backgroundColor: activeTab === "reviews" ? "#4FA8D1" : "transparent" }}>User Reviews</button>
          </li>
        </ul>
        
        <hr className="bg-secondary" />
        <button onClick={handleLogout} className="btn btn-outline-danger text-start w-100 fw-bold border-0">
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-grow-1 p-5" style={{ marginLeft: "280px" }}>
        
        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <>
            <div className="row mb-4">
              <div className="col">
                <h1 className="fw-bold text-dark">
                  <span className="text-warning">Admin</span> Dashboard
                </h1>
                <p className="text-muted">Welcome back, {user.name}. Here is an overview of the platform.</p>
              </div>
            </div>

            <div className="row g-4 mt-2">
              <div className="col-md-4">
                <div className="card shadow-sm border-0 border-start border-4 border-warning h-100 p-4 rounded-4 bg-white">
                  <h5 className="text-muted fw-bold text-uppercase">Total Customers</h5>
                  <h2 className="display-4 fw-bolder mb-0 text-dark">{customers.length}</h2>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-sm border-0 border-start border-4 border-info h-100 p-4 rounded-4 bg-white">
                  <h5 className="text-muted fw-bold text-uppercase">Active Bookings</h5>
                  <h2 className="display-4 fw-bolder mb-0 text-dark">{bookings.length}</h2>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-sm border-0 border-start border-4 border-success h-100 p-4 rounded-4 bg-white">
                  <h5 className="text-muted fw-bold text-uppercase">Total Reviews</h5>
                  <h2 className="display-4 fw-bolder mb-0 text-dark">{reviews.length}</h2>
                </div>
              </div>
            </div>
          </>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === "customers" && (
          <div className="card shadow-sm border-0 bg-white rounded-4 p-4">
            <h4 className="fw-bold mb-4 border-bottom pb-2">Registered Customers</h4>
            {customers.length === 0 ? (
              <p className="text-muted fst-italic">No customers found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Email Address</th>
                      <th>Phone Number</th>
                      <th>Registered On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(c => (
                       <tr key={c._id}>
                         <td className="fw-bold">{c.name}</td>
                         <td>{c.email}</td>
                         <td>{c.phone}</td>
                         <td>{new Date(c.createdAt || Date.now()).toLocaleDateString()}</td>
                       </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="card shadow-sm border-0 bg-white rounded-4 p-4">
            <h4 className="fw-bold mb-4 border-bottom pb-2">User Feedback & Reviews</h4>
            {reviews.length === 0 ? (
              <p className="text-muted fst-italic">No reviews submitted yet.</p>
            ) : (
              <div className="row g-4">
                {reviews.map(r => (
                  <div className="col-md-6" key={r._id}>
                    <div className="card border-0 bg-light p-3 rounded-4">
                       <div className="d-flex justify-content-between align-items-center mb-2">
                         <h6 className="fw-bold text-primary mb-0">{r.userName}</h6>
                         <span className="text-warning">{"⭐".repeat(r.rating)}</span>
                       </div>
                       <p className="text-muted small mb-2">{r.userEmail} | {new Date(r.date).toLocaleDateString()}</p>
                       <p className="mb-0 fst-italic">"{r.comment}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div className="card shadow-sm border-0 bg-white rounded-4 p-4">
            <h4 className="fw-bold mb-4 border-bottom pb-2">Active Bookings & Service Tracking</h4>
            {bookings.length === 0 ? (
              <p className="text-muted fst-italic">No bookings found in the system.</p>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Vehicle</th>
                      <th>Type of Service</th>
                      <th>User Name</th>
                      <th>Date</th>
                      <th>Current Stage</th>
                      <th>Update Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id}>
                        <td className="fw-medium">{b.vehicle}</td>
                        <td>{b.serviceName || b.serviceId}</td>
                        <td className="small">
                          <div className="fw-medium">{b.userName}</div>
                          <div className="text-muted" style={{fontSize: "0.80rem"}}>{b.userEmail}</div>
                        </td>
                        <td>{new Date(b.date).toLocaleDateString()}</td>
                        <td>
                          <span className="badge bg-secondary">{b.trackingStatus || 'Pending'}</span>
                        </td>
                        <td>
                          <select 
                            className="form-select form-select-sm"
                            value={b.trackingStatus || 'Car Received'}
                            onChange={(e) => handleStatusChange(b._id, e.target.value)}
                            style={{ width: "200px" }}
                          >
                            <option value="Car Received">Car Received</option>
                            <option value="Inspection Completed">Inspection Completed</option>
                            <option value="Service Started">Service Started</option>
                            <option value="Work in Progress">Work in Progress</option>
                            <option value="Quality Check">Quality Check</option>
                            <option value="Service Completed">Service Completed</option>
                            <option value="Ready for Delivery">Ready for Delivery</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* VEHICLES TAB (Stub) */}
        {activeTab === "vehicles" && (
          <div className="card shadow-sm border-0 bg-white rounded-4 p-5 text-center">
            <i className="bi bi-car-front-fill text-muted mb-3" style={{ fontSize: "3rem" }}></i>
            <h4 className="fw-bold">Vehicle Fleet Management</h4>
            <p className="text-muted">Database for all customer vehicles will appear here.</p>
          </div>
        )}



      </div>
    </div>
  );
}

export default AdminPanel;
