"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "@/components/admin/Header";
import { FilterButtons } from "@/components/admin/FilterButtons";
import { VisitorList } from "@/components/admin/VisitorList";
import { IssuePassDialog } from "@/components/admin/IssuePassDialog";

export default function AdminDashboard() {
  const [visitors, setVisitors] = useState([]);
  const [view, setView] = useState("pending");
  const [limit] = useState(10);
  const [loadingStates, setLoadingStates] = useState({});
  const [issuingPass, setIssuingPass] = useState(false);
  const [currentVisitor, setCurrentVisitor] = useState(null);

  // dialog fields
  const [visitingDate, setVisitingDate] = useState("");
  const [visitingTime, setVisitingTime] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // fetch + paginate
  const fetchAllVisitors = async (status) => {
    const token = localStorage.getItem("accessToken");
    let page = 1,
      all = [];
    while (true) {
      const {
        data: { data: items },
      } = await axios.get(
        `https://vms-backend-liart.vercel.app/admin/admin-approvals/${status}?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!items?.length) break;
      all.push(...items);
      if (items.length < limit) break;
      page++;
    }
    return all.map((item) => ({
      id: item._id,
      ticketNo: item.ticketNo,
      name: item.name,
      photoOfVisitor: item.photoOfVisitor,
      organization: item.organization,
      fromDate: item.fromDate.split("T")[0],
      toDate: item.toDate.split("T")[0],
      date: item.visitingDate.split("T")[0],
      time: item.visitingTiming,
      purpose: item.purposeOfMeeting,
      status,
      employeeApproved: true,
      employeePermission: item.employeePermission || {},
      passIssued: false,
      notified: false,
    }));
  };

  useEffect(() => {
    fetchAllVisitors(view).then(setVisitors);
  }, [view, limit]);

  // open IssuePass dialog
  const onIssuePassClick = (v) => {
    setCurrentVisitor(v);
    setVisitingDate(v.date);
    setVisitingTime(v.time);
    setFromDate(v.fromDate);
    setToDate(v.toDate);
    setExpiryDate(v.toDate);
    setIssuingPass(true);
  };

  // submit IssuePass → adminApproval + notify
  const handleIssuePass = async () => {
    const token = localStorage.getItem("accessToken");
    const id = currentVisitor.id;
    try {
      setLoadingStates((s) => ({ ...s, [id]: true }));
      // 1) adminApproval
      const { data: approval } = await axios.post(
        "https://vms-backend-liart.vercel.app/admin/adminApprovals",
        {
          _id: id,
          permission: "accepted",
          visitingDate,
          visitingTiming: visitingTime,
          fromDate,
          toDate,
          expiredDate: expiryDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2) notifyVisitorByAdmin
      await axios.get(
        `https://vms-backend-liart.vercel.app/admin/notifyVisitorByAdmin?visitorId=${approval.visitor._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // refresh + close dialog
      setIssuingPass(false);
      setVisitors(await fetchAllVisitors(view));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStates((s) => ({ ...s, [id]: false }));
    }
  };

  // reject visitor
  const handleReject = async (id) => {
    const token = localStorage.getItem("accessToken");
    try {
      setLoadingStates((s) => ({ ...s, [id]: true }));
      await axios.post(
        "https://vms-backend-liart.vercel.app/admin/adminApprovals",
        { _id: id, permission: "rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVisitors(await fetchAllVisitors(view));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStates((s) => ({ ...s, [id]: false }));
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 space-y-6">
      <Header />
      <FilterButtons view={view} setView={setView} />
      <VisitorList
        visitors={visitors}
        view={view}
        loadingStates={loadingStates}
        onIssuePassClick={onIssuePassClick}
        onReject={handleReject}
      />
      <IssuePassDialog
        issuingPass={issuingPass}
        setIssuingPass={setIssuingPass}
        currentVisitor={currentVisitor}
        visitingDate={visitingDate}
        setVisitingDate={setVisitingDate}
        visitingTime={visitingTime}
        setVisitingTime={setVisitingTime}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        expiryDate={expiryDate}
        setExpiryDate={setExpiryDate}
        handleIssuePass={handleIssuePass}
      />
    </div>
  );
}
