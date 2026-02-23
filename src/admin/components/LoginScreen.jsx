import { useState } from "react";
import "./LoginScreen.css";

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Brief delay for UX
    await new Promise((r) => setTimeout(r, 300));

    const success = onLogin(password);
    if (!success) {
      setError("รหัสผ่านไม่ถูกต้อง");
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-logo">EasySpace</h1>
        <p className="login-subtitle">ระบบจัดการเมนู</p>

        <div className="login-field">
          <label htmlFor="password">รหัสผ่าน</label>
          <input
            id="password"
            type="password"
            placeholder="กรอกรหัสผ่าน"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            autoFocus
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </div>
  );
}

export default LoginScreen;
