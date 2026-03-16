import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function Login() {
  const [searchParams] = useSearchParams();
  const initialIsAdmin = searchParams.get("admin") === "true";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(initialIsAdmin);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: "", text: "" });
    try {
      const res = await API.post("/users/login", { email, password });
      
      const user = res.data.user;
      
      // Verify if they matched their intended login route
      if (isAdminLogin && user.role !== "admin") {
         setStatusMsg({ type: "danger", text: "Target user is lacking Administrator privileges." });
         setLoading(false);
         return;
      }
      
      // Save session
      localStorage.setItem("user", JSON.stringify(user));
      
      setStatusMsg({ type: "success", text: res.data.message || "Login successful!" });
      
      setTimeout(() => {
         if (user.role === "admin") {
           navigate("/admin"); // Redirect admins to their specific panel
         } else {
           navigate("/dashboard");
         }
      }, 1000);
      
    } catch (err) {
      setStatusMsg({ type: "danger", text: err.response?.data?.message || err.response?.data?.error || "Login failed." });
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
                {isAdminLogin ? "Admin Login" : "Customer Login"}
              </h2>
              
              {statusMsg.text && (
                <div className={`alert alert-${statusMsg.type} rounded-3 py-2 text-center`}>
                  {statusMsg.text}
                </div>
              )}

              <form onSubmit={login}>
                <div className="mb-4">
                  <label className="form-label text-light fw-medium">Email Address</label>
                  <input
                    type="email"
                    className="form-control bg-secondary text-white border-dark py-2"
                    placeholder={isAdminLogin ? "admin@labhante.com" : "Enter your email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-light fw-medium">Password</label>
                  <input
                    type="password"
                    className="form-control bg-secondary text-white border-dark py-2"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <button 
                        type="button" 
                        onClick={() => setIsAdminLogin(!isAdminLogin)} 
                        className="btn btn-link text-warning p-0 text-decoration-none small opacity-75"
                    >
                        {isAdminLogin ? "Switch to Customer Login" : "Switch to Admin Login"}
                    </button>
                    <Link to="/forgot-password" className="text-info small text-decoration-none opacity-75">Forgot Password?</Link>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-warning w-100 py-3 mt-2 rounded-pill fw-bold text-uppercase shadow-sm"
                  disabled={loading}
                >
                  {loading ? "Authenticating..." : (isAdminLogin ? "Secure Login" : "Login")}
                </button>
              </form>
              
              <div className="mt-4 pt-3 text-center border-top border-secondary">
                <p className="text-light-50 mb-0">Don't have an account?</p>
                <Link to="/register" className="text-blue text-decoration-none fw-bold">Create an account</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;