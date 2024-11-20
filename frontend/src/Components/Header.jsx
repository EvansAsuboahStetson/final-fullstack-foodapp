import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './userContext';
import '../Styles/header.css';
import HeroSection from './Herosection';
import LoginPopup from './LoginPopUp';

const Header = () => {
  const [isSignInPopupOpen, setSignInPopupOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('User');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [err, setErr] = useState('');

  const toggleSignInPopup = () => {
    setSignInPopupOpen(!isSignInPopupOpen);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    const endpoint = selectedRole === 'Merchant' ? 'merchant/login' : 'user/login';

    try {
      const response = await fetch(`http://localhost:4000/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token);
        
        // Navigate based on role
        if (selectedRole === 'Merchant') {
          toggleSignInPopup();
          navigate('/merchanthome');
        } else {
          toggleSignInPopup();
          navigate('/home-page');
        }
      } else {
        console.error("Sign In Failed");
        setErr('Login failed. Please try again.');
      }
    } catch (error) {
      console.log("Error during sign-in:", error);
      setErr('Login failed. Please try again.');
    }


  };
  return (
    <>
      <header className="header">
        <div className="logo">
          <h1>HomeDasher</h1>
        </div>
        <nav>
          <ul className="nav-links">
            <li>
              <a href="#signIn" className="sign-in-btn" onClick={toggleSignInPopup}>
                Sign In
              </a>
            </li>
            <li>
              <a href="#createAccount" className="sign-up-btn" onClick={() => {}}>
                Create Account
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <HeroSection toggleSignInPopup={toggleSignInPopup} />

      <LoginPopup
        isVisible={isSignInPopupOpen}
        onClose={toggleSignInPopup}
        onSubmit={handleSignInSubmit}
        selectedRole={selectedRole}
        handleRoleChange={handleRoleChange}
        toggleForgotPasswordPopup={() => {}}
        toggleSignUpPopup={() => {}}
        errorMessage={err}
      />
    </>
  );
};

export default Header;
