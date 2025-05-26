"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock } from "lucide-react";
import { VisitorRegistrationLoader } from "@/components/visitor/registration-loader";
import { EmployeeNotified } from "@/components/visitor/employee-notified";
import { WhatsAppConfirmation } from "@/components/visitor/whatsapp-confirmation";

export default function VisitorRegistrationForm({
  step,
  loading,
  employees,
  formData,
  setFormData,
  onRegister,
  onNotifyEmployee,
  onNotifyWhatsApp,
  onFinish,
}) {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);

  // camera setup
  useEffect(() => {
    if (!showCamera) return;
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((s) => {
        streamRef.current = s;
        videoRef.current.srcObject = s;
      })
      .catch(() => setShowCamera(false));
    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, [showCamera]);

  const updateField = (name, value) =>
    setFormData((p) => ({ ...p, [name]: value }));
  const handleChange = (e) => updateField(e.target.name, e.target.value);
  const handleDateChange = (e) =>
    updateField(e.target.name, e.target.valueAsDate || null);

  // file → base64
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateField("photoPreview", reader.result);
    reader.readAsDataURL(file);
  };

  const openCamera = () => {
    if (navigator.mediaDevices?.getUserMedia) setShowCamera(true);
    else fileInputRef.current.click();
  };
  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    updateField("photoPreview", canvas.toDataURL("image/png"));
    setShowCamera(false);
  };

  // steps UI
  if (step === 1 && loading) return <VisitorRegistrationLoader />;
  if (step === 2)
    return (
      <EmployeeNotified
        onSend={() => {
          console.log(
            ">> onNotifyEmployee called with:",
            formData.latestVisitorId,
            formData.employeeToMeet
          );
          onNotifyEmployee(formData.latestVisitorId, formData.employeeToMeet);
        }}
        loading={loading}
      />
    );
  if (step === 3) return <WhatsAppConfirmation onFinish={onFinish} />;
  if (step === 4) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-12">
      <h1 className="text-4xl font-extrabold mb-8">Visitor Registration</h1>
      <Card className="w-full max-w-3xl shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-white p-6">
          <CardTitle className="text-2xl font-semibold">
            Register New Visitor
          </CardTitle>
          <CardDescription className="text-gray-600">
            Fill in the details to register and notify.
          </CardDescription>
        </CardHeader>

        <CardContent className="bg-white p-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              // enforce 10-digit mobile
              if (!/^\d{10}$/.test(formData.mobileNumber)) {
                alert("Mobile number must be exactly 10 digits.");
                return;
              }
              const visitorId = await onRegister();
              updateField("latestVisitorId", visitorId);
              await onNotifyEmployee(visitorId, formData.employeeToMeet);
              await onNotifyWhatsApp(visitorId);
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "name",
                "mobileNumber",
                "whatsappNumber",
                "identificationProof",
                "organization",
                "purpose",
              ].map((f) => (
                <div key={f} className="space-y-2">
                  <Label htmlFor={f}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Label>
                  <Input
                    id={f}
                    name={f}
                    value={formData[f]}
                    onChange={handleChange}
                    required
                    maxLength={f === "identificationProof" ? 12 : undefined}
                    {...(f === "mobileNumber"
                      ? {
                          type: "tel",
                          pattern: "\\d{10}",
                          title: "Enter exactly 10 digits",
                        }
                      : {})}
                  />
                </div>
              ))}

              {/* Whom to Meet */}
              <div className="space-y-2">
                <Label>Whom to Meet</Label>
                <Select
                  onValueChange={(v) => updateField("employeeToMeet", v)}
                  value={formData.employeeToMeet}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp._id} value={emp._id}>
                        {emp.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date fields */}
              {[
                { name: "visitingDate", label: "Visiting Date" },
                { name: "fromDate", label: "From Date" },
                { name: "toDate", label: "To Date" },
              ].map(({ name, label }) => (
                <div key={name} className="space-y-2">
                  <Label htmlFor={name}>{label}</Label>
                  <Input
                    id={name}
                    name={name}
                    type="date"
                    value={
                      formData[name]
                        ? formData[name].toISOString().slice(0, 10)
                        : ""
                    }
                    onChange={handleDateChange}
                    required
                  />
                </div>
              ))}

              {/* Time picker */}
              <div className="space-y-2">
                <Label htmlFor="visitingTime">Visiting Time</Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  <Input
                    id="visitingTime"
                    name="visitingTime"
                    type="time"
                    value={formData.visitingTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Photo */}
              <div className="md:col-span-2 space-y-2">
                <Label>Visitor Photo</Label>
                <div className="flex gap-4 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFile}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Choose Photo
                  </Button>
                  <Button type="button" variant="outline" onClick={openCamera}>
                    Capture Photo
                  </Button>
                </div>
                {formData.photoPreview && (
                  <img
                    src={formData.photoPreview}
                    alt="Visitor"
                    className="mt-2 w-32 h-32 object-cover rounded-lg border"
                  />
                )}
              </div>
            </div>

            <CardFooter className="pt-4">
              <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg py-3"
                disabled={loading}
              >
                {loading ? "Processing..." : "Register Visitor"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay className="w-80 h-60 object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex justify-between p-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCamera(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={takePhoto}>
                Take Photo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
