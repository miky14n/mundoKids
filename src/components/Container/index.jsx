"use client";
import { useState, useEffect } from "react";
import Alert from "@/components/Alert";
import NextButton from "@/components/Button";

export default function Container({
  layout = "vertical",
  apiUrl,
  typeRequestApi = "POST",
  onSuccessMessage = "Successfully submitted",
  onErrorMessage = "Error during submission",
  formTitle = "Form",
  buttonLabel = "Submit",
  onSubmitSuccess = null,
  children,
  doctor_id,
  specialty_id,
  setDoctorCi,
  setSpecialty,
}) {
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState(null);
  useEffect(() => {
    const data = { doctor_id, specialty_id };
    setFormData(data);
  }, [doctor_id, specialty_id]);
  const handleSubmit = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: typeRequestApi,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({});
        setSuccess(true);
        if (onSubmitSuccess) onSubmitSuccess();
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSuccess(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
        {success === true && (
          <Alert
            message={onSuccessMessage}
            color="success"
            link=""
            setStatus={setSuccess}
          />
        )}
        {success === false && (
          <Alert
            message={onErrorMessage}
            color="error"
            link=""
            setStatus={setSuccess}
          />
        )}
        <h2 className="text-2xl font-bold mb-4 text-center">{formTitle}</h2>

        <div
          className={`flex ${
            layout === "horizontal"
              ? "flex-row space-x-2"
              : "flex-col space-y-2"
          }`}
        >
          {children}
          <div>
            <NextButton content={buttonLabel} action={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}
