"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { login, clearError } from "../redux/slices/authSlice";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { token, loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    }
  }, [token, router]);

  // Clear Redux error when fields change
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [email, password, dispatch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      dispatch(login({ identifier: "", password: "" })); // won't fire, just for safety
      return;
    }

    dispatch(login({ identifier: email, password }));
  };

  return (
    <div className="login-page">
      {/* Background image + overlay */}
      <div
        className="login-bg"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80')`,
        }}
      >
        <div className="login-bg-overlay" />
      </div>

      {/* Dot matrix pattern */}
      <div className="dot-matrix" />

      {/* Floating orbs */}
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      <div className="login-container">
        <div className="glass-card">
          {/* Card shine */}
          <div className="card-shine" />

          {/* Brand */}
          <div className="brand-area">
            <div className="brand-icon">9</div>
            <h1 className="brand-name">9jaMart</h1>
          </div>

          <p className="login-heading">Sign in to the admin dashboard</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <Mail className="input-icon" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email address"
                className="input-field"
              />
            </div>

            <div className="input-group">
              <Lock className="input-icon" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="input-field"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="footer-text">
            &copy; {new Date().getFullYear()} 9jaMart. All rights reserved.
          </p>
        </div>
      </div>

      <style jsx>{`
        /* ==================== PAGE ==================== */
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a2742 0%, #142f52 50%, #1e4b7c 100%);
          position: relative;
          overflow: hidden;
          padding: 1rem;
        }

        /* ==================== BACKGROUND IMAGE ==================== */
        .login-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          filter: blur(12px) brightness(0.55);
          transform: scale(1.1);
          z-index: 0;
        }
        .login-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(10, 39, 66, 0.8) 0%,
            rgba(20, 47, 82, 0.6) 50%,
            rgba(41, 182, 216, 0.3) 100%
          );
        }

        /* ==================== DOT MATRIX ==================== */
        .dot-matrix {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 18px 18px;
          z-index: 0;
          pointer-events: none;
        }

        /* ==================== ORBS ==================== */
        .bg-orb {
          position: absolute;
          border-radius: 50%;
          z-index: 0;
          pointer-events: none;
        }
        .orb-1 {
          width: 350px; height: 350px;
          top: -80px; right: -80px;
          background: radial-gradient(circle, rgba(41,182,216,0.2) 0%, transparent 70%);
          animation: floatOrb 10s ease-in-out infinite;
        }
        .orb-2 {
          width: 250px; height: 250px;
          bottom: -60px; left: -60px;
          background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
          animation: floatOrb 12s ease-in-out infinite reverse;
        }
        .orb-3 {
          width: 200px; height: 200px;
          top: 50%; left: 50%;
          background: radial-gradient(circle, rgba(41,182,216,0.15) 0%, transparent 70%);
          animation: floatOrb 8s ease-in-out infinite;
        }
        @keyframes floatOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.05); }
        }

        .login-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 380px;
        }

        /* ==================== GLASS CARD ==================== */
        .glass-card {
          position: relative;
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 24px;
          padding: 2.2rem 1.8rem;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.4);
          text-align: center;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        /* ==================== CARD SHINE ==================== */
        .card-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.08),
            transparent
          );
          transform: skewX(-25deg);
          animation: shine 6s infinite;
          pointer-events: none;
        }
        @keyframes shine {
          0% { left: -100%; }
          20% { left: 150%; }
          100% { left: 150%; }
        }

        /* ==================== BRAND ==================== */
        .brand-area {
          margin-bottom: 1.2rem;
        }
        .brand-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #29b6d8, #3ec8e6);
          color: #fff;
          font-weight: 800;
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
        }
        .brand-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .login-heading {
          color: rgba(255,255,255,0.75);
          font-size: 0.85rem;
          margin-bottom: 1.2rem;
        }

        /* ==================== FORM ==================== */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .input-group {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 10px;
          padding: 0 12px;
          height: 44px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .input-group:focus-within {
          border-color: #29b6d8;
          box-shadow: 0 0 0 4px rgba(41,182,216,0.12);
        }
        .input-icon {
          color: rgba(255,255,255,0.5);
          flex-shrink: 0;
        }
        .input-field {
          flex: 1;
          background: transparent;
          border: none;
          padding: 0 8px;
          color: #fff;
          font-size: 0.9rem;
          outline: none;
          height: 100%;
        }
        .input-field::placeholder {
          color: rgba(255,255,255,0.4);
        }
        .toggle-password {
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          padding: 4px;
          transition: color 0.2s ease;
        }
        .toggle-password:hover {
          color: #29b6d8;
        }

        .error-text {
          color: #ff6b6b;
          font-size: 0.8rem;
          text-align: center;
          margin: 0;
        }

        /* ==================== BUTTON ==================== */
        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          height: 44px;
          border-radius: 10px;
          background: linear-gradient(135deg, #29b6d8, #3ec8e6);
          color: #fff;
          font-weight: 600;
          font-size: 0.95rem;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .submit-btn::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.4s;
        }
        .submit-btn:hover {
          background: #fff;
          color: #142f52;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(41,182,216,0.35);
        }
        .submit-btn:hover::after {
          left: 100%;
        }
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .submit-btn:disabled::after {
          display: none;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ==================== FOOTER ==================== */
        .footer-text {
          margin-top: 1.2rem;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.35);
        }
      `}</style>
    </div>
  );
}