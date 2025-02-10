import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Modal, Input, Button } from "antd";
import {
  Logo,
  SchoolIcon,
  SchoolIconWhite,
  TeacherIcon,
  TeachersIconWhite,
} from "../../components/images";

function SelectPreference() {
  const [selectedPreference, setSelectedPreference] = useState(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handlePreferenceClick = (preference) => {
    setSelectedPreference(preference);
  };

  const handleContinueClick = () => {
    if (selectedPreference === "administrator") {
      setShowOTPModal(true);
    }
  };

  const handleOTPSubmit = () => {
    const expectedOTP = process.env.REACT_APP_ADMIN_OTP || "123456";
    if (otp === expectedOTP) {
      setShowOTPModal(false);
      navigate("/admin-registration"); // Navigate to admin registration page
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <main className="pref-container">
      <section className="pref-headings">
        <div className="pref-logo logo-sm">
          <Logo />
        </div>
        <h2>Choose Your Preference</h2>
        <p>It will help us, to give you a better experience on our platform.</p>
      </section>
      <section className="pref-select">
        <div
          onClick={() => handlePreferenceClick("administrator")}
          className={
            selectedPreference === "administrator"
              ? "select-active"
              : "select-deactive"
          }
        >
          <div>
            <div>
              <div
                className={
                  selectedPreference === "administrator"
                    ? "pref-icon-active"
                    : "pref-icon"
                }
              >
                {selectedPreference === "administrator" ? (
                  <SchoolIconWhite />
                ) : (
                  <SchoolIcon />
                )}
              </div>
              <h3>Administrator</h3>
            </div>
            <div
              className={
                selectedPreference === "administrator"
                  ? "circle-icon-active"
                  : "circle-icon"
              }
            ></div>
          </div>
        </div>
        <div
          onClick={() => handlePreferenceClick("teacher")}
          className={
            selectedPreference === "teacher"
              ? "select-active"
              : "select-deactive"
          }
        >
          <div>
            <div>
              <div
                className={
                  selectedPreference === "teacher"
                    ? "pref-icon-active"
                    : "pref-icon"
                }
              >
                {selectedPreference === "teacher" ? (
                  <TeachersIconWhite />
                ) : (
                  <TeacherIcon />
                )}
              </div>
              <h3>Teacher</h3>
            </div>
            <div
              className={
                selectedPreference === "teacher"
                  ? "circle-icon-active"
                  : "circle-icon"
              }
            ></div>
          </div>
        </div>
      </section>
      <div>
        <button
          onClick={handleContinueClick}
          className={selectedPreference ? "btn-blue-active" : "btn-gray"}
          disabled={!selectedPreference}
        >
          Continue
        </button>
      </div>

      <Modal
        title="Enter OTP"
        visible={showOTPModal}
        onCancel={() => setShowOTPModal(false)}
        footer={null}
      >
        <Input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="otp-input"
        />
        {error && <p className="error-message">{error}</p>}
        <Button onClick={handleOTPSubmit} type="primary">
          Verify
        </Button>
      </Modal>
    </main>
  );
}

export default SelectPreference;
