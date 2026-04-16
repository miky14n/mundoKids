"use client";
import { useState } from "react";
import SimpleInput from "@/components/Input";
import NextButton from "@/components/Button";
import Alert from "@/components/Alert";
import Link from "next/link";
import { useSession } from "next-auth/react";
import PersonalTextarea from "../Teaxtarea";

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
    const dateObj = new Date(date);
    setSelectedDate(date);
    setFormData((prev) => ({
      ...prev,
      datelimitloan: dateObj,
    }));
  };

  return (
    <div className="w-full space-y-4">
      {success === true && (
        <>
          <Alert
            message={onSuccessMessage}
            color="success"
            link=""
            setStatus={setSuccess}
          />
          {actionOnSuccess && <div>{actionOnSuccess}</div>}
        </>
      )}
      {success === false && (
        <Alert
          message={onErrorMessage}
          color="danger"
          link=""
          setStatus={setSuccess}
        />
      )}

      <div className="surface-card p-6 sm:p-8">
        {formTitle && (
          <div className="mb-6">
            <h2 className="section-title">{formTitle}</h2>
            <div className="mt-3 h-px w-full bg-gradient-to-r from-brand-100 via-slate-100 to-transparent" />
          </div>
        )}
        <div
          className={`${
            layout === "horizontal"
              ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end"
              : "flex flex-col gap-4"
          }`}
        >
          {extraComponent && (
            <div className="w-full">{extraComponent}</div>
          )}
          {fields.map((field, index) => (
            <div key={index} className="w-full">
              {field.type === "checkbox" ? (
                <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={formData[field.name] || false}
                    onChange={(e) => handleChange(field, e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm font-medium text-ink">
                    {field.label}
                  </span>
                </label>
              ) : field.type === "text-only" ? (
                <div>
                  {field.title && (
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                      {field.title}
                    </p>
                  )}
                  <p className="mt-1 text-sm font-medium text-ink">
                    {field.label || "—"}
                  </p>
                </div>
              ) : field.type === "textarea" ? (
                <PersonalTextarea
                  label={field.title}
                  isReadOnly={true}
                  description="Alergias registradas del paciente"
                  value={field.label}
                />
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
                />
              </div>
            ))}
        </div>
        <div className="mt-6 flex justify-end">
          {navigationTo ? (
            <Link href={navigationTo}>
              <NextButton content={buttonLabel} color={colorButton || "primary"} />
            </Link>
          ) : (
            <NextButton
              content={buttonLabel}
              action={personalSubmint || handleSubmit}
              color={colorButton || "primary"}
            />
          )}
        </div>
      </div>
    </div>
  );
}
