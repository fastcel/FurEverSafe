import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout";

export default function AdoptionForm() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [userLoading, setUserLoading] = useState(true);

  // --- UI STATES ---
  const [step, setStep] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listingData, setListingData] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // --- FORM DATA (Mapped to Backend Service Keys) ---
  const [formData, setFormData] = useState({
    full_name: "",
    contact_number: "",
    email: "",
    preferred_contact_method: "email",
    house_type: "Apartment",
    has_children: "No",
    other_pets: "None",
    pet_alone_hours: "2-3 hours",
    monthly_income_range: "Under 20,000",
    monthly_budget_range: "1000 - 2500",
    motivation: "",
  });

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!formData.full_name.trim()) {
        newErrors.full_name = "Full name is required";
      }

      if (!formData.contact_number.trim()) {
        newErrors.contact_number = "Contact number is required";
      }

      if (!formData.email.includes("@")) {
        newErrors.email = "Enter a valid email";
      }
    }

    if (stepNumber === 3) {
      if (!formData.motivation.trim()) {
        newErrors.motivation = "Please explain your motivation";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUserLoading(true);

        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = res.data;
        console.log(user);
        setFormData((prev) => ({
          ...prev,
          full_name: user.name || prev.full_name,
          email: user.email || prev.email,
          contact_number: user.contact_number || prev.contact_number,
        }));
      } catch (err) {
        console.error("Failed to load user:", err);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/adoption/listings/${listingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(res.data);
        setListingData(res.data);
      } catch (err) {
        console.error("Error fetching listing:", err);
      }
    };

    fetchListingDetails();
  }, [listingId]);

  const handleInput = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // clear error for that field immediately
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const mapFormToDB = (formData) => ({
    ...formData,

    has_children: formData.has_children === "Yes",

    house_type:
      formData.house_type === "Apartment"
        ? "apartment"
        : formData.house_type === "House with Garden"
          ? "house_with_garden"
          : formData.house_type === "House without Garden"
            ? "house_without_garden"
            : "other",

    pet_alone_hours:
      formData.pet_alone_hours === "2-3 hours"
        ? "2_3"
        : formData.pet_alone_hours === "3-4 hours"
          ? "3_4"
          : "4_plus",

    monthly_income_range:
      formData.monthly_income_range === "Under 20,000"
        ? "under_20000"
        : formData.monthly_income_range === "20,000 - 40,000"
          ? "20000_40000"
          : formData.monthly_income_range === "40,000 - 60,000"
            ? "40000_60000"
            : formData.monthly_income_range === "60,000 - 80,000"
              ? "60000_80000"
              : formData.monthly_income_range === "80,000 - 100,000"
                ? "80000_100000"
                : "100000_plus",

    monthly_budget_range:
      formData.monthly_budget_range === "1000 - 2500"
        ? "1000_2500"
        : formData.monthly_budget_range === "2500 - 4000"
          ? "2500_4000"
          : "4000_plus",

    other_pets: formData.other_pets === "None" ? [] : [formData.other_pets],
  });

  // 2. Final Submission to Backend
  const handleSubmit = async () => {
    setSubmitError("");

    if (!listingId) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = mapFormToDB(formData);
      const response = await axios.post(
        "http://localhost:5000/api/adoption/apply",
        {
          listing_id: Number(listingId),
          ...payload,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 201) {
        setIsSubmitted(true);
      }
    } catch (err) {
      setSubmitError(
        err.response?.data?.error ||
          "Submission failed. Please try again later.",
      );
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };
  const prevStep = () => {
    setErrors({}); // clear step errors when going back
    setStep((prev) => prev - 1);
  };

  if (isSubmitted) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full py-20">
          <div className="bg-[#DED9C4] p-16 rounded-sm border-2 border-black text-center max-w-lg">
            <div className="text-7xl mb-6 text-green-600">✔</div>
            <h2 className="text-3xl font-bold text-[#6A1B9A] mb-4 uppercase">
              Success!
            </h2>
            <p className="text-[#C2185B] mb-10 font-bold">
              Your application for {listingData?.name} is pending review.
            </p>
            <button
              onClick={() => navigate("/adoptions")}
              className="bg-[#C2185B] text-white px-8 py-3 border-2 border-black font-bold"
            >
              Track Status
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (userLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-2xl font-black text-[#C2185B] mb-2">
              Loading your profile...
            </div>
            <div className="animate-pulse text-gray-600">
              Preparing your application form
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[#EDEFD7] p-8 rounded-sm border-2 border-black text-center max-w-sm">
            <h3 className="text-xl font-bold text-[#C2185B] mb-4">
              Submit Application?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-red-400 px-6 py-2 border-2 border-black font-bold"
              >
                No
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-300 px-6 py-2 border-2 border-black font-bold"
              >
                {loading ? "Submitting..." : "Yes, Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
      {submitError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white p-6 border-2 border-black max-w-sm text-center">
            <h3 className="text-red-600 font-black text-lg mb-3">
              Submission Failed
            </h3>
            <p className="mb-4 font-bold">{submitError}</p>

            <button
              onClick={() => setSubmitError("")}
              className="bg-black text-white px-6 py-2 font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-[#3A1D44] mb-8">
          Adoption Form
        </h1>

        {/* Pet Summary */}
        <div className="flex justify-between items-center bg-white px-6 py-2 border-2 border-black mb-8 rounded-sm">
          <div>
            <h2 className="text-2xl font-bold text-[#C2185B]">
              Adopting {listingData?.name}
            </h2>
            <p className="text-gray-600">
              {listingData?.breed} • {listingData?.city}
            </p>
          </div>
          {listingData?.images && (
            <img
              src={listingData.images[0]}
              className="w-32 h-32 border-2 border-black object-cover"
              alt="pet"
            />
          )}
        </div>

        {/* Multi-Step Form */}
        <div className="bg-[#DED9C4] p-8 border-2 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {[1, 2, 3].map((n) => (
              <React.Fragment key={n}>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-black font-black text-xl ${step >= n ? "bg-[#C2185B] text-white" : "bg-white"}`}
                >
                  {n}
                </div>
                {n < 3 && <div className="w-16 h-1 bg-black/20"></div>}
              </React.Fragment>
            ))}
          </div>

          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h3 className="font-bold text-[#6A1B9A] uppercase text-sm border-b-2 border-black pb-1">
                  Personal Details
                </h3>
                <InputField
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInput}
                  error={errors.full_name}
                />
                <InputField
                  label="Contact Number"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleInput}
                  error={errors.contact_number}
                />
                <InputField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInput}
                  error={errors.email}
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-[#6A1B9A] uppercase text-sm border-b-2 border-black pb-1">
                  Contact Preference
                </h3>
                <select
                  name="preferred_contact_method"
                  value={formData.preferred_contact_method}
                  onChange={handleInput}
                  className="w-full border-2 border-black p-3 bg-white font-bold outline-none"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone Call</option>
                  <option value="whatsapp">Whatsapp</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Lifestyle Info */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SelectField
                label="House Type"
                name="house_type"
                value={formData.house_type}
                onChange={handleInput}
                options={[
                  "Apartment",
                  "House with Garden",
                  "House without Garden",
                  "Other",
                ]}
              />
              <SelectField
                label="Children at home?"
                name="has_children"
                value={formData.has_children}
                onChange={handleInput}
                options={["Yes", "No"]}
              />
              <SelectField
                label="Other Pets?"
                name="other_pets"
                value={formData.other_pets}
                onChange={handleInput}
                options={["None", "Dog", "Cat", "Other"]}
              />
              <SelectField
                label="Pet Alone Hours"
                name="pet_alone_hours"
                value={formData.pet_alone_hours}
                onChange={handleInput}
                options={["2-3 hours", "3-4 hours", "4+ hours"]}
              />
              <SelectField
                label="Monthly Income"
                name="monthly_income_range"
                value={formData.monthly_income_range}
                onChange={handleInput}
                options={[
                  "Under 20,000",
                  "20,000 - 40,000",
                  "40,000 - 60,000",
                  "60,000 - 80,000",
                  "80,000 - 100,000",
                  "Over 100,000",
                ]}
              />
              <SelectField
                label="Care Budget"
                name="monthly_budget_range"
                value={formData.monthly_budget_range}
                onChange={handleInput}
                options={["1000 - 2500", "2500 - 4000", "4000+"]}
              />
            </div>
          )}

          {/* STEP 3: Motivation */}
          {step === 3 && (
            <div className="space-y-4">
              <label className="block font-black text-[#6A1B9A] uppercase text-sm">
                Why do you want to adopt {listingData?.name}? *
              </label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleInput}
                className={`w-full h-48 border-2 p-4 bg-white outline-none font-medium text-lg shadow-inner ${
                  errors.motivation ? "border-red-600" : "border-black"
                }`}
                placeholder="Please describe your experience with pets and why you chose this specific animal..."
              />
              {errors.motivation && (
                <p className="text-red-600 text-xs font-bold mt-1">
                  {errors.motivation}
                </p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12 border-t-2 border-black pt-8">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`px-8 py-2 border-2 border-black font-black uppercase text-sm transition-all ${step === 1 ? "opacity-0" : "bg-white hover:bg-gray-100"}`}
            >
              ← Back
            </button>
            <button
              onClick={() => {
                if (step === 3) {
                  const isValid = validateStep(3);
                  if (isValid) {
                    setShowConfirm(true);
                  }
                } else {
                  nextStep();
                }
              }}
              className="bg-[#C2185B] text-white px-10 py-2 border-2 border-black font-black uppercase text-sm hover:-translate-y-1 active:translate-y-0 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {step === 3 ? "Finish" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Reusable Helper Components
const InputField = ({ label, name, error, ...props }) => (
  <div>
    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
      {label} *
    </label>

    <input
      {...props}
      name={name}
      className={`w-full border-2 p-3 bg-white outline-none font-bold ${
        error ? "border-red-600" : "border-black"
      }`}
    />

    {error && <p className="text-red-600 text-xs font-bold mt-1">{error}</p>}
  </div>
);

const SelectField = ({ label, options, ...props }) => (
  <div>
    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
      {label} *
    </label>
    <select
      {...props}
      className="w-full border-2 border-black p-3 bg-white font-black outline-none cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
