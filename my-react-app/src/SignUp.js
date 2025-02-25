import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    if (name === "password" | name === "confirmPassword") {
        setPasswordMatch(formData.password === (name === 'password' ? value : formData.confirmPassword));
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 6) return { text: "Weak", color: "red" };
    if (password.length < 10) return { text: "Medium", color: "orange" };
    return { text: "Strong", color: "green" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.username.trim() === "") {
        alert("Username can't be empty! Please enter a username :}")
        return;
    }
    if (!passwordMatch) {
        alert("Your passwords do not match! Please check again :)");
        return;
      }


    if (passwordStrength.text === "Weak") {
        alert("Your password is too weak! Try making it stronger.");
        return;
    }

    setIsSigningUp(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Signup Data:', formData);
      alert("Signup successful!");
      navigate("/");
    } catch (error) {
      alert("Signup failed! Please try again.");
    } finally {
      setIsSigningUp(false); // Reset loading state
    }
  };

  

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input
        type="username"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
      />
      <br />
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      <br />
      <p style={{ color: passwordStrength.color }}>
        Password Strength: {passwordStrength.text}
      </p>
      <input
        type={showPassword ? "text" : "password"}
        name="confirmPassword"
        placeholder="Retype your password"
        value={formData.confirmPassword}
        onChange={handleChange}
      />
      <br />
      {formData.confirmPassword && (
        <p style={{ color: passwordMatch ? "green" : "red" }}>
          {passwordMatch ? "Passwords match ✅" : "Passwords do not match ❌"}
        </p>
      )}
      <label>
        <input
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        />
        Show Password
      </label>
      <br />
      <button type="submit" disabled={isSigningUp}>
        {isSigningUp ? "Signing in..." : "Signup"}
        </button>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
};

export default Signup;
