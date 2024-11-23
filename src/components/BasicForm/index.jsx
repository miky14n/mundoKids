"use client";
import { useState } from "react";
import SimpleInput from "@/components/Input";
import NextButton from "@/components/Button";
import Alert from "@/components/Alert";

export default function BasicForm({
  layout = "vertical",
  fields = [],
  apiUrl,
  typeRequestApi = "POST",
  onSuccessMessage = "Successfully submitted",
  onErrorMessage = "Error during submission",
  formTitle = "Form",
  buttonLabel = "Submit",
  extraComponent = null,
  valueExtraComponent = null,
  dateOption = null,
  titleDate = "",
  actionOnSuccess = null,
}) {
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const now = new Date();

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [field.name]: value,
        valueExtraComponent,
      };

      if (field.type === "checkbox") {
        const isChecked = value;
        if (isChecked) {
          fields.forEach((f) => {
            if (f.name !== field.name && f.type === "checkbox") {
              newFormData[f.name] = false;
            }
          });
        }
      }

      return newFormData;
    });
  };

  const handleSubmit = async () => {
    try {
      console.log(
        formData,
        "Que se le envia",
        "El extra component",
        valueExtraComponent
      );
      const response = await fetch(apiUrl, {
        method: typeRequestApi,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData, valueExtraComponent),
      });
      if (response.ok) {
        setFormData({});
        setSuccess(true);
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSuccess(false);
    }
  };

  const handleDateChange = (date) => {
    const dateObj = formatDateForSQL(new Date(date));
    setSelectedDate(date);
    console.log("Fecha seleccionada:", date);
    setFormData((prev) => ({
      ...prev,
      datelimitloan: dateObj,
    }));
  };

  return (
    <>
      {success === true && (
        <div>
          <Alert
            message={onSuccessMessage}
            color="success"
            link=""
            setStatus={setSuccess}
          />
          <div>{actionOnSuccess || <></>}</div>
        </div>
      )}
      {success === false && (
        <Alert
          message={onErrorMessage}
          color="error"
          link=""
          setStatus={setSuccess}
        />
      )}

      <div className="flex items-center justify-center">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-6xl">
          <h2 className="text-2xl font-bold mb-4 text-center">{formTitle}</h2>
          <div
            className={`flex ${
              layout === "horizontal"
                ? "flex-row space-x-2"
                : "flex-col space-y-4 items-center justify-center"
            }`}
          >
            {fields.map((field, index) => (
              <div key={index} className="flex-1">
                {field.type === "checkbox" ? (
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData[field.name] || false}
                      onChange={(e) => handleChange(field, e.target.checked)}
                    />
                    <span>{field.label}</span>
                  </label>
                ) : (
                  <SimpleInput
                    type={field.type}
                    label={field.label}
                    variant="bordered"
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                )}
              </div>
            ))}
            <div>{extraComponent || <></>}</div>
            <div>
              {dateOption ||
                (formData.support && (
                  <input
                    type="text"
                    value={selectedDate}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) =>
                      (e.target.type = selectedDate ? "date" : "text")
                    }
                    onChange={(e) => handleDateChange(e.target.value)}
                    placeholder={titleDate}
                    className="mt-1 border rounded px-2 py-1 w-full"
                  />
                ))}
            </div>
            <div>
              <NextButton content={buttonLabel} action={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
