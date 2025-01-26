"use client";
import { useState } from "react";
import SimpleInput from "@/components/Input";
import NextButton from "@/components/Button";
import Alert from "@/components/Alert";
import Link from "next/link";
import { useSession } from "next-auth/react";

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
  personalSubmint = null,
  navigationTo = null,
  colorButton = null,
  onSuccess = () => {},
}) {
  const { data: session } = useSession();
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
  console.log(session);
  const handleSubmit = async () => {
    try {
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
        onSuccess();
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

      <div className="flex items-center justify-center ">
        <div className="bg-white shadow-md rounded-lg px-10 py-8 w-full max-w-7xl">
          <h2 className="text-3xl font-bold mb-8 text-center">{formTitle}</h2>
          <div
            className={`flex ${
              layout === "horizontal"
                ? "flex-row space-x-2"
                : "flex-col space-y-4 items-center justify-center"
            }`}
          >
            {extraComponent && (
              <div className="w-full">
                <div className="mb-4">{extraComponent}</div>
              </div>
            )}
            {fields.map((field, index) => (
              <div key={index} className="w-full">
                {field.type === "checkbox" ? (
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData[field.name] || false}
                      onChange={(e) => handleChange(field, e.target.checked)}
                    />
                    <span className="text-gray-700">{field.label}</span>
                  </label>
                ) : field.type === "text-only" ? (
                  <div className="text-center">
                    {field.title && (
                      <p className="font-bold text-gray-800">{field.title}</p>
                    )}
                    <p className="text-gray-700">{field.label}</p>
                  </div>
                ) : (
                  <SimpleInput
                    type={field.type}
                    label={field.label}
                    variant="bordered"
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="mb-4"
                  />
                )}
              </div>
            ))}
            {dateOption ||
              (formData.support && (
                <div className="w-full">
                  <input
                    type="text"
                    value={selectedDate}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) =>
                      (e.target.type = selectedDate ? "date" : "text")
                    }
                    onChange={(e) => handleDateChange(e.target.value)}
                    placeholder={titleDate}
                    className="mt-1 border rounded px-4 py-2 w-full"
                  />
                </div>
              ))}
            <div className="w-full flex justify-center">
              {navigationTo ? (
                <Link href={navigationTo}>
                  <NextButton content={buttonLabel} />
                </Link>
              ) : (
                <NextButton
                  content={buttonLabel}
                  action={personalSubmint || handleSubmit}
                  color={colorButton}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
