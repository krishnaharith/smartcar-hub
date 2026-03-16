import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: "", text: "" });
    try {
      const payload = { 
        name, 
        email, 
        phone,
        password, 
        role: isAdmin ? "admin" : "user",
        adminCode: isAdmin ? adminCode : undefined
      };
      
      const res = await API.post("/users/register", payload);
      setStatusMsg({ type: "success", text: res.data.message || "Registration successful!" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setStatusMsg({ type: "danger", text: err.response?.data?.message || err.response?.data?.error || "Registration failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-secondary-subtle">
      <Navbar />
      <div className="container mt-5 flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden bg-dark text-white">
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #4FA8D1, #fdf5e6)' }}></div>
            
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center mb-4 pb-2 text-blue fw-bold border-bottom border-secondary">
                {isAdmin ? "Admin Registration" : "Create Account"}
              </h2>
              
              {statusMsg.text && (
                <div className={`alert alert-${statusMsg.type} rounded-3 py-2 text-center`}>
                  {statusMsg.text}
                </div>
              )}

              <form onSubmit={register}>
                <div className="mb-4">
                  <label className="form-label text-light fw-medium">Full Name</label>
                  <input
                    type="text"
                    className="form-control bg-secondary text-white border-dark py-2"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-light fw-medium">Email Address</label>
                  <input
                    type="email"
                    className="form-control bg-secondary text-white border-dark py-2"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-light fw-medium">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control bg-secondary text-white border-dark py-2"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-light fw-medium">Password</label>
                  <input
                    type="password"
                    className="form-control bg-secondary text-white border-dark py-2"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-check form-switch mb-4">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="adminToggle" 
                    checked={isAdmin} 
                    onChange={(e) => setIsAdmin(e.target.checked)} 
                  />
                  <label className="form-check-label text-light-50 ms-2" htmlFor="adminToggle">
                    Register as Administrator
                  </label>
                </div>

                {isAdmin && (
                  <div className="mb-4 p-3 border border-warning rounded-3 bg-dark">
                    <label className="form-label text-warning fw-bold">Admin Secret Code</label>
                    <input
                      type="password"
                      className="form-control bg-secondary text-white border-warning py-2 text-center letter-spacing-2"
                      placeholder="******"
                      maxLength="6"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      required={isAdmin}
                    />
                    <small className="text-muted mt-2 d-block">Required to authorize admin privileges.</small>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-warning w-100 py-3 mt-2 rounded-pill fw-bold text-uppercase shadow-sm"
                  disabled={loading}
                >
                  {loading ? "Processing..." : (isAdmin ? "Register Admin" : "Sign Up")}
                </button>
              </form>
              
              <div className="mt-4 pt-3 text-center border-top border-secondary">
                <p className="text-light-50 mb-0">Already have an account?</p>
                <Link to="/login" className="text-blue text-decoration-none fw-bold">Login here</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Register;