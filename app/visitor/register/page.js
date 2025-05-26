"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import VisitorRegistrationForm from "@/components/VisitorRegistrationForm";

export default function RegisterMeetingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    whatsappNumber: "",
    employeeToMeet: "", // holds the selected employee _id
    identificationProof: "",
    visitingDate: null,
    visitingTime: "",
    fromDate: null,
    toDate: null,
    organization: "",
    purpose: "",
    photoPreview: null, // base64 data-URL
  });

  // Fetch employee roster once
  useEffect(() => {
    axios
      .get("https://vms-backend-liart.vercel.app/employee/all-employees")
      .then((resp) => {
        if (resp.data.success) setEmployees(resp.data.employees);
        else console.error("Failed to load employees:", resp.data);
      })
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  // 1) Register meeting
  const handleRegister = async () => {
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        mobileNumber: formData.mobileNumber,
        whatsappNumber: formData.whatsappNumber,
        whomeToMeet: formData.employeeToMeet,
        identificationProof: formData.identificationProof,
        visitingDate: formData.visitingDate.toISOString().slice(0, 10),
        visitingTiming: formData.visitingTime,
        fromDate: formData.fromDate.toISOString().slice(0, 10),
        toDate: formData.toDate.toISOString().slice(0, 10),
        organization: formData.organization,
        purposeOfMeeting: formData.purpose,
        photoOfVisitor: formData.photoPreview,
      };

      const resp = await axios.post(
        "https://vms-backend-liart.vercel.app/visitor/register-meeting",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("register-meeting response:", resp.data);

      if (!resp.data.success) throw new Error("Registration failed");
      setStep(2);
      return resp.data.visitor._id;
    } finally {
      setLoading(false);
    }
  };

  // 2) Notify employee (now takes both IDs)
  const handleNotifyEmployee = async (visitorId, employeeId) => {
    console.log("visitorId,employeeId", visitorId, employeeId);
    setLoading(true);
    try {
      const resp = await axios.post(
        `https://vms-backend-liart.vercel.app/visitor/${visitorId}/notify-employee/${employeeId}`
      );
      console.log("notify-employee response:", resp.data);
      if (!resp.data.success) throw new Error("Employee notify failed");
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  // 3) Notify via WhatsApp
  const handleNotifyWhatsApp = async (visitorId) => {
    console.log("visitorId", visitorId);
    setLoading(true);
    try {
      const resp = await axios.post(
        `https://vms-backend-liart.vercel.app/visitor/${visitorId}/notify-whatsapp`
      );
      console.log("notify-whatsapp response:", resp.data);
      if (!resp.data.success) throw new Error("WhatsApp notify failed");
    } finally {
      setLoading(false);
    }
  };

  // 4) Finish: reload
    const handleFinish = () => window.location.reload();

  return (
    <VisitorRegistrationForm
      step={step}
      loading={loading}
      employees={employees}
      formData={formData}
      setFormData={setFormData}
      onRegister={handleRegister}
      onNotifyEmployee={handleNotifyEmployee}
      onNotifyWhatsApp={handleNotifyWhatsApp}
      onFinish={handleFinish}
    />
  );
}
