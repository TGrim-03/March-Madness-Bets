import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {CircleDollarSign as Money} from 'lucide-react';
import { AuthContext } from './Context/AuthContext';
import './Signup.css';

const Signup = () => {

  //Stores the user form data
  const [formData, setFormData] = useState({ 
    name: '',
    username: '', 
    password: '', 
    confirmPassword: '',
    amount: 1000 // Default starting amount
  });

  //Track password strength to provide the user with feedback on security
  const [passwordStrength, setPasswordStrength] = useState('');

  //Ensures that the password and confirmation match
  const [passwordMatch, setPasswordMatch] = useState(true);

  //Toggle visibility of password
  const [showPassword, setShowPassword] = useState(false);

  //Track if signup is in progress
  const [isSigningUp, setIsSigningUp] = useState(false);

  //Allows redirection after successful signup
  const navigate = useNavigate();

  //Handles changes to the form data by updating appropriate states defined above
  const handleChange = (e) => {
    const { name, value } = e.target;

    //Ensures that the password and confirmation match as user types in the confirmation
    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData, [name]: value };

      // Only check password match when typing in confirmPassword field
      if (name === "confirmPassword") {
        setPasswordMatch(updatedFormData.password === updatedFormData.confirmPassword);
      }

      return updatedFormData;
    });

    //Checks password strength when user types in the password field
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  //Determines password strength and assigns keywords and colors accordingly
  const checkPasswordStrength = (password) => {
    // Default strength is set to "Weak" with red color
    let strength = {
      text: "Weak",
      color: "red"
    };
  
    // Password should be at least 8 characters long
    const lengthCriteria = password.length >= 8;

    // Password should have at least one uppercase letter
    const uppercaseCriteria = /[A-Z]/.test(password);

    // Password should contain at least one lowercase letter
    const lowercaseCriteria = /[a-z]/.test(password);

    // Password should contain at least one numeric digit
    const numberCriteria = /[0-9]/.test(password);

    // Password should contain at least one special character
    const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    // Count the number of criteria that the password passes
    const passedCriteria = [lengthCriteria, uppercaseCriteria, lowercaseCriteria, numberCriteria, specialCharCriteria].filter(Boolean).length;
  
    // Determine password strength based on the number of criteria met
    if (passedCriteria >= 4) {
      strength = { text: "Strong", color: "green" };
    } else if (passedCriteria >= 3) {
      strength = { text: "Medium", color: "orange" };
    }
  
    // Return the password strength
    return strength;
  };

  const { login } = useContext(AuthContext);

  //Handles validation checks when the user submits the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Validate form data
    if (formData.name.trim() === "") {
      alert("Name can't be empty! Please enter your name.");
      return;
    }

    if (formData.username.trim() === "") {
      alert("Username can't be empty! Please enter a username.");
      return;
    }

    //Prevents submission if the passwords do not match
    if (!passwordMatch) {
      alert("Your passwords do not match! Please check again.");
      return;
    }

    //Prevents submission if the password strength is too weak
    if (passwordStrength.text === "Weak") {
      alert("Your password is too weak! Try making it stronger.");
      return;
    }

    //Sets the state as true to allow successful submission and disabling of the signup button to prevent further submissions
    setIsSigningUp(true);

    try {
      // Send request to create user endpoint
      const response = await fetch("http://localhost:8080/demo/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          password: formData.password,
          amount: formData.amount
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Auto-login the user after successful registration
        login({
          username: formData.username,
          name: formData.name,
          amount: formData.amount
        });

        alert("Account created successfully!");
        
        // Store username in local storage for auto-fill on login page
        localStorage.setItem("signupUsername", formData.username);
        
        navigate("/");
      } else {
        alert(data.message || "Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Signup failed! Please try again.");
    } finally {
      setIsSigningUp(false);
    }
  };

  // Return UI
  return (
    <div className= "signup-background">
      {/* Signup card */}
      <div className = "signup-card">
        {/* Styling for the Container */}
        <div className="signup-header">
          {/* Website title */}
          <div style={{ margin: '0', padding: '0', display: 'flex', justifyContent: 'center', marginTop: '-5px' }}>
            <p className = "signup-title">
              Nets and Bets
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <p className = 'signup-subtitle'>
              Sign up to join the madness!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            {/* Name field - NEW */}
            <div className="signup-form-group">
              <label htmlFor="name" className='signup-label'>
                Full Name
              </label>
              <input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className='signup-input'
              />
            </div>

            <div className='signup-form-group'>
              <label htmlFor="username" className='signup-label'>
                Username
              </label>
              <input
                id="username"
                name="username"
                placeholder="Enter your username.."
                value={formData.username}
                onChange={handleChange}
                required
                className='signup-input'
              />
            </div>

            <div className='signup-form-group'>
              <label htmlFor="password" className='signup-label'>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password.."
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className='signup-input'
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className='password-toggle-btn'
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {passwordStrength && (
                <p className="password-strength" style={{ 
                  color: passwordStrength.color === 'green' ? '#10B981' : 
                         passwordStrength.color === 'orange' ? '#F59E0B' : '#EF4444'
                }}>
                  Password strength: {passwordStrength.text}
                </p>
              )}
            </div>

            <div className='signup-form-group'>
              <label htmlFor="confirmPassword" className='signup-label'>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className='signup-input'
                />
              </div>
              {formData.confirmPassword && !passwordMatch && (
                <p className="password-mismatch">
                  Passwords do not match</p>
              )}
            </div>

            {/* Initial amount */}
            <div className='signup-form-group'>
              <label htmlFor="amount" className='signup-label'>
                Initial Balance ($)
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                placeholder="Starting balance"
                value={formData.amount}
                onChange={handleChange}
                required
                className='signup-input'
              />
            </div>

            <button 
              type="submit" 
              className='signup-submit-btn'
              disabled={isSigningUp}
            >
              {isSigningUp ? 'Signing Up!!' : 'Sign Up'}
            </button>
          </form>

          <div className='signup-footer'>
            <p className='signup-footer-text'>
              <span className='money-icons'>
                <Money className='icon'/>
                <Money className='icon'/>
                <Money className='icon'/>
                <Money className='icon'/>
              </span>
              Already have an account?{" "}
              <Link to="/login" className= "signup-footer-link">
                Log in
              </Link>
            </p>
            <p className='signup-footer-text'>
               Go back?{" "}
              <Link to="/" className='signup-footer-link'>
                Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;