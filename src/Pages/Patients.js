import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiHome,
  FiSearch,
  FiUser,
  FiUserPlus,
  FiSliders,
  FiList,
  FiGrid,
  FiCalendar,
  FiX,
  FiChevronRight,
  FiPhone,
  FiTrash2,
  FiMapPin,
  FiMessageCircle,
  FiFileText,
  FiEye,
} from "react-icons/fi";

/* =========================================================
   API
========================================================= */

const API_BASE = "https://visiontrackdatabase.onrender.com";

/* =========================================================
   STORE CODE
   Replace this with your actual Storage implementation
   if your ReactJS admin already has one.
========================================================= */

const getStoreCode = () => {
  return (
    localStorage.getItem("storeCode") ||
    localStorage.getItem("store_code") ||
    ""
  );
};

/* =========================================================
   COMPONENT
========================================================= */

export default function Patients() {
  const navigate = useNavigate();

  /* =======================================================
     RESPONSIVE
  ======================================================= */

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = windowWidth < 900;

  /* =======================================================
     MODALS
  ======================================================= */

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  /* =======================================================
     PATIENT FORM
  ======================================================= */

  const [patientName, setPatientName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");

  /* =======================================================
     PATIENTS
  ======================================================= */

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  /* =======================================================
     FILTERS
  ======================================================= */

  const [timeFilter, setTimeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [createdDate, setCreatedDate] = useState("");

  /* =======================================================
     VIEW
  ======================================================= */

  const [viewMode, setViewMode] = useState("single");

  /* =======================================================
     DETAIL TABS
  ======================================================= */

  const [detailTab, setDetailTab] = useState("info");

  /* =======================================================
     HISTORY
  ======================================================= */

  const [orderHistory, setOrderHistory] = useState([]);
  const [eyeExamHistory, setEyeExamHistory] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedEyeExam, setSelectedEyeExam] = useState(null);

  const [historyLoading, setHistoryLoading] = useState(false);

  /* =======================================================
     LOAD PATIENTS
  ======================================================= */

/* =======================================================
   LOAD SUPER ADMIN PATIENTS
======================================================= */

useEffect(() => {
  loadPatients();
}, []);

const loadPatients = async (searchText = "") => {
  try {

    const response = await fetch(
      `${API_BASE}/patient/superadmin`
    );

    const data = await response.json();

    console.log(
      "SUPER ADMIN PATIENTS:",
      data
    );

    if (data.success) {

      let patientList = data.patients || [];

      // ==========================================
      // SEARCH
      // ==========================================

      if (searchText.trim()) {

        const searchValue =
          searchText.trim().toLowerCase();

        patientList = patientList.filter(
          (patient) => {

            const name =
              (patient.name || "")
                .toLowerCase();

            const mobile =
              (patient.mobile || "")
                .toLowerCase();

            const patientId =
              (patient.patient_id || "")
                .toLowerCase();

            return (
              name.includes(searchValue) ||
              mobile.includes(searchValue) ||
              patientId.includes(searchValue)
            );
          }
        );
      }

      setPatients(patientList);

    } else {

      setPatients([]);

      console.error(
        data.message ||
        "Failed to load Super Admin patients"
      );
    }

  } catch (error) {

    console.error(
      "LOAD SUPER ADMIN PATIENTS ERROR:",
      error
    );

    setPatients([]);
  }
};

  /* =======================================================
     CLEAR FORM
  ======================================================= */

  const clearPatientForm = () => {
    setPatientName("");
    setMobileNumber("");
    setAge("");
    setGender("");
    setAddress("");
  };

  /* =======================================================
     DATE FORMAT
  ======================================================= */

  const formatCreatedDate = (dateValue) => {
    if (!dateValue) return "N/A";

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =======================================================
     SAVE PATIENT
  ======================================================= */

const savePatient = async () => {
  try {
    const trimmedName = patientName.trim();
    const normalizedMobile = mobileNumber.replace(/\D/g, "");

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!trimmedName) {
      alert("Please enter patient name.");
      return;
    }

    if (!normalizedMobile) {
      alert("Please enter mobile number.");
      return;
    }

    if (normalizedMobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    // ==========================================
    // CHECK DUPLICATE
    // ==========================================

    const existingPatient = (patients || []).find((patient) => {
      const existingName =
        (patient.name || "").trim().toLowerCase();

      const existingMobile =
        (patient.mobile || "").replace(/\D/g, "");

      return (
        existingName === trimmedName.toLowerCase() &&
        existingMobile === normalizedMobile
      );
    });

    if (existingPatient) {
      alert(
        `Patient already exists!\n\n` +
        `Name: ${existingPatient.name}\n` +
        `Mobile: ${existingPatient.mobile}\n` +
        `Patient ID: ${
          existingPatient.patient_id || "N/A"
        }`
      );

      return;
    }

    // ==========================================
    // SUPER ADMIN
    // ROLE = SUPERADMIN
    // NO STORE CODE
    // ==========================================

    const requestBody = {
      role: "superadmin",
      name: trimmedName,
      mobile: normalizedMobile,
      age: age || null,
      gender: gender || null,
      address: address || null
    };

    console.log(
      "Creating Super Admin patient:",
      requestBody
    );

    // ==========================================
    // CREATE PATIENT
    // ==========================================

    const saveResponse = await fetch(
      `${API_BASE}/patient/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    );

    // ==========================================
    // READ RESPONSE
    // ==========================================

    const saveText = await saveResponse.text();

    console.log(
      "CREATE PATIENT RESPONSE:",
      saveResponse.status,
      saveText
    );

    let saveData;

    try {
      saveData = JSON.parse(saveText);
    } catch (e) {
      alert(
        `Server returned invalid response.\nStatus: ${saveResponse.status}`
      );
      return;
    }

    // ==========================================
    // SERVER ERROR
    // ==========================================

    if (!saveResponse.ok) {
      alert(
        saveData.message ||
        `Failed to create patient. Status: ${saveResponse.status}`
      );
      return;
    }

    // ==========================================
    // SUCCESS
    // ==========================================

    if (saveData.success) {

      alert(
        `Patient created successfully!\n\n` +
        `Patient ID: ${
          saveData.patient?.patient_id ||
          saveData.patient_id ||
          "Created"
        }`
      );

      setModalVisible(false);

      clearPatientForm();

      // Reload patients
      loadPatients();

    } else {

      alert(
        saveData.message ||
        "Failed to create patient."
      );
    }

  } catch (error) {

    console.error(
      "PATIENT SAVE ERROR:",
      error
    );

    alert(
      "Something went wrong while creating patient."
    );
  }
};
  /* =======================================================
     DELETE PATIENT
  ======================================================= */

  const deletePatient = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmed) return;

    try {
      const storeCode = getStoreCode();

      const response = await fetch(
        `${API_BASE}/patient/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            storeCode,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSelectedPatient(null);

        loadPatients();
      } else {
        alert(
          data.message ||
            "Failed to delete patient."
        );
      }
    } catch (error) {
      console.error(
        "DELETE PATIENT ERROR:",
        error
      );
    }
  };

  /* =======================================================
     HISTORY
  ======================================================= */

  const loadPatientHistory = async (patient) => {
    try {
      setHistoryLoading(true);

      const storeCode = getStoreCode();

      const patientId = patient.patient_id;

      /* ===================================================
         ORDERS
      =================================================== */

      const orderRes = await fetch(
        `${API_BASE}/opticalorders?storeCode=${encodeURIComponent(
          storeCode
        )}&patientId=${encodeURIComponent(
          patientId
        )}`
      );

      const orderData = await orderRes.json();

      if (
        orderData.success &&
        orderData.orders?.length > 0
      ) {
        setOrderHistory(orderData.orders);

        setSelectedOrder(orderData.orders[0]);
      } else {
        setOrderHistory([]);

        setSelectedOrder(null);
      }

      /* ===================================================
         EYE EXAMS
      =================================================== */

      const examRes = await fetch(
        `${API_BASE}/eyeexam/patient/${patientId}?storeCode=${encodeURIComponent(
          storeCode
        )}`
      );

      const examData = await examRes.json();

      if (
        examData.success &&
        examData.exams?.length > 0
      ) {
        setEyeExamHistory(examData.exams);

        setSelectedEyeExam(examData.exams[0]);
      } else {
        setEyeExamHistory([]);

        setSelectedEyeExam(null);
      }
    } catch (error) {
      console.error(
        "HISTORY ERROR:",
        error
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  /* =======================================================
     CALL
  ======================================================= */

  const handleCall = (phoneNumber) => {
    if (!phoneNumber) return;

    window.location.href = `tel:${phoneNumber}`;
  };

  /* =======================================================
     WHATSAPP
  ======================================================= */

  const handleWhatsApp = (phoneNumber) => {
    if (!phoneNumber) return;

    const number = phoneNumber.replace(
      /\D/g,
      ""
    );

    window.open(
      `https://wa.me/${number}`,
      "_blank"
    );
  };

  /* =======================================================
     OPEN PATIENT
  ======================================================= */

  const openPatient = (patient) => {
    setDetailTab("info");

    setSelectedPatient(patient);

    loadPatientHistory(patient);
  };

  /* =======================================================
     FILTER PATIENTS
  ======================================================= */

  const filteredPatients = patients.filter(
    (patient) => {
      /* ===============================================
         CREATED DATE
      =============================================== */

      if (createdDate) {
        const value =
          patient.created_at ||
          patient.createdAt;

        if (!value) return false;

        const patientDate =
          new Date(value);

        const selectedDate =
          new Date(
            `${createdDate}T00:00:00`
          );

        if (
          patientDate.getFullYear() !==
            selectedDate.getFullYear() ||
          patientDate.getMonth() !==
            selectedDate.getMonth() ||
          patientDate.getDate() !==
            selectedDate.getDate()
        ) {
          return false;
        }
      }

      /* ===============================================
         TIME FILTER
      =============================================== */

      if (timeFilter !== "all") {
        const value =
          patient.created_at ||
          patient.createdAt;

        if (!value) return false;

        const patientDate =
          new Date(value);

        const now = new Date();

        if (timeFilter === "today") {
          if (
            patientDate.toDateString() !==
            now.toDateString()
          ) {
            return false;
          }
        }

        if (timeFilter === "week") {
          const weekAgo =
            new Date();

          weekAgo.setDate(
            weekAgo.getDate() - 7
          );

          if (patientDate < weekAgo) {
            return false;
          }
        }

        if (timeFilter === "month") {
          const monthAgo =
            new Date();

          monthAgo.setMonth(
            monthAgo.getMonth() - 1
          );

          if (patientDate < monthAgo) {
            return false;
          }
        }
      }

      return true;
    }
  );

  
  return (
    <>
      <div className="patients-container">

        {/* =================================================
            DECORATIVE BACKGROUND
        ================================================= */}

        <div className="circle-decoration-top" />
        <div className="circle-decoration-bottom" />
        <div className="circle-decoration-center" />

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className={`patients-header ${
            isMobile
              ? "patients-header-mobile"
              : ""
          }`}
        >
          <div className="patients-title-row">

          

            {/* TITLE */}

            <div className="header-title-container">
              <div className="patients-title">
                Patients Management
              </div>

              <div className="patients-subtitle">
                View and register clinic patients
              </div>
            </div>
          </div>

        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="patients-content">

          {/* =================================================
              SEARCH / ACTION BAR
          ================================================= */}

          <div
            className={`search-action-bar ${
              isMobile
                ? "search-action-mobile"
                : ""
            }`}
          >

            {/* SEARCH */}

            <div className="gradient-input-wrapper search-wrapper">
              <div className="gradient-input-inner">

                <FiSearch
                  size={20}
                  color="#94A3B8"
                />

                <input
                  type="text"
                  placeholder="Search patient..."
                  value={search}
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    setSearch(value);

                    loadPatients(value);
                  }}
                />

                <FiUser
                  size={18}
                  color="#94A3B8"
                />
              </div>
            </div>

            {/* DATE */}

            <div className="date-wrapper">

              <div className="created-date-box">
                <FiCalendar
                  size={19}
                  color="#2563EB"
                />

                <input
                  type="date"
                  value={createdDate}
                  max={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={(e) =>
                    setCreatedDate(
                      e.target.value
                    )
                  }
                />

                {createdDate && (
                  <button
                    className="date-clear-button"
                    onClick={() =>
                      setCreatedDate("")
                    }
                  >
                    <FiX size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* ACTIONS */}

            <div className="search-action-symbol-group">

              {/* ADD */}

              <button
                className="gradient-symbol-button"
                onClick={() =>
                  setModalVisible(true)
                }
                title="Add Patient"
              >
                <FiUserPlus size={18} />
              </button>

              {/* FILTER */}

              <button
                className={`gradient-symbol-button ${
                  showFilters
                    ? "filter-active"
                    : ""
                }`}
                onClick={() =>
                  setShowFilters(
                    !showFilters
                  )
                }
                title="Filters"
              >
                <FiSliders size={19} />
              </button>
            </div>
          </div>

          {/* =================================================
              FILTERS
          ================================================= */}

          {showFilters && (
            <div className="horizontal-filter-container">
              {[
                {
                  label: "All Time",
                  value: "all",
                },
                {
                  label: "Today",
                  value: "today",
                },
                {
                  label: "This Week",
                  value: "week",
                },
                {
                  label: "This Month",
                  value: "month",
                },
              ].map((item) => {
                const active =
                  timeFilter ===
                  item.value;

                return (
                  <button
                    key={item.value}
                    className={
                      active
                        ? "filter-chip active"
                        : "filter-chip"
                    }
                    onClick={() =>
                      setTimeFilter(
                        item.value
                      )
                    }
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* =================================================
              DIRECTORY HEADER
          ================================================= */}

          <div className="directory-header">
            <div>
              <h2>
                Patient Directory
              </h2>

              <p>
                {filteredPatients.length} active
                records found
              </p>
            </div>
          </div>

          {/* =================================================
              PATIENT CARDS
          ================================================= */}

          <div
            className={
              viewMode === "multi"
                ? "patients-grid multi"
                : "patients-grid single"
            }
          >
            {filteredPatients.map(
              (p, i) => {

                const isFemale =
                  String(
                    p.gender || ""
                  ).toLowerCase() ===
                  "female";

                return (
                  <button
                    key={
                      p.patient_id || i
                    }
                    className={`patient-card ${
                      viewMode === "multi"
                        ? "patient-card-multi"
                        : ""
                    }`}
                    onClick={() =>
                      openPatient(p)
                    }
                  >

                    {viewMode ===
                    "multi" ? (

                      <>
                        <div className="multi-card-top-row">

                          <div className="card-avatar">
                            {p.name
                              ? p.name
                                  .charAt(0)
                                  .toUpperCase()
                              : "P"}
                          </div>

                          <span
                            className={`gender-badge ${
                              isFemale
                                ? "female"
                                : "male"
                            }`}
                          >
                            {p.gender ||
                              "N/A"}
                          </span>
                        </div>

                        <div className="patient-card-name multi-name">
                          {p.name}
                        </div>

                        <div className="patient-card-meta">
                          ID:{" "}
                          {p.patient_id ||
                            "N/A"}{" "}
                          {p.mobile
                            ? `• ${p.mobile}`
                            : ""}
                        </div>

                        <div className="patient-card-meta created-meta">
                          Date Created:{" "}
                          {formatCreatedDate(
                            p.created_at ||
                              p.createdAt
                          )}
                        </div>
                      </>

                    ) : (

                      <>
                        <div className="patient-card-left">

                          <div className="card-avatar">
                            {p.name
                              ? p.name
                                  .charAt(0)
                                  .toUpperCase()
                              : "P"}
                          </div>

                          <div className="patient-card-details">

                            <div className="patient-card-name">
                              {p.name}
                            </div>

                            <div className="patient-card-meta">
                              ID:{" "}
                              {p.patient_id ||
                                "N/A"}{" "}
                              {p.mobile
                                ? `• ${p.mobile}`
                                : ""}
                            </div>

                            <div className="patient-card-meta created-meta">
                              Date Created:{" "}
                              {formatCreatedDate(
                                p.created_at ||
                                  p.createdAt
                              )}
                            </div>

                          </div>
                        </div>

                        <div className="patient-card-right">

                          <span
                            className={`gender-badge ${
                              isFemale
                                ? "female"
                                : "male"
                            }`}
                          >
                            {p.gender ||
                              "N/A"}
                          </span>

                          <FiChevronRight
                            size={20}
                            color="#CBD5E1"
                          />
                        </div>
                      </>
                    )}
                  </button>
                );
              }
            )}

            {/* EMPTY */}

            {filteredPatients.length ===
              0 && (
              <div className="empty-patients">
                <FiUser
                  size={40}
                  color="#94A3B8"
                />

                <h3>
                  No patients found
                </h3>

                <p>
                  Try changing your search
                  or filters.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            NEW PATIENT MODAL
        ================================================= */}

        {modalVisible && (
          <div className="modal-overlay">

            <div className="compact-modal">

              {/* HEADER */}

              <div className="modal-header">

                <div>
                  <h3>
                    New Patient
                  </h3>

                  <p>
                    Enter patient credentials
                  </p>
                </div>

                <button
                  className="modal-close"
                  onClick={() => {
                    setModalVisible(false);
                    clearPatientForm();
                  }}
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* FORM */}

              <div className="modal-form">

                {/* NAME */}

                <label>
                  Full Name *
                </label>

                <div className="gradient-input-wrapper">
                  <div className="gradient-input-inner">
                    <input
                      type="text"
                      placeholder="Patient full name"
                      value={patientName}
                      onChange={(e) =>
                        setPatientName(
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                {/* MOBILE */}

                <label>
                  Mobile Number *
                </label>

                <div className="gradient-input-wrapper">
                  <div className="gradient-input-inner">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={mobileNumber}
                      onChange={(e) =>
                        setMobileNumber(
                          e.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                    />
                  </div>
                </div>

                {/* AGE + GENDER */}

                <div className="form-row">

                  <div className="form-column">

                    <label>
                      Age
                    </label>

                    <div className="gradient-input-wrapper">
                      <div className="gradient-input-inner">
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Age"
                          value={age}
                          onChange={(e) =>
                            setAge(
                              e.target.value.replace(
                                /\D/g,
                                ""
                              )
                            )
                          }
                        />
                      </div>
                    </div>

                  </div>

                  <div className="form-column">

                    <label>
                      Gender
                    </label>

                    <div className="gradient-input-wrapper">
                      <div className="gradient-input-inner">
                        <input
                          type="text"
                          placeholder="Male/Female"
                          value={gender}
                          onChange={(e) =>
                            setGender(
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* ADDRESS */}

                <label>
                  Address
                </label>

                <div className="gradient-input-wrapper">
                  <div className="gradient-input-inner textarea-inner">
                    <textarea
                      placeholder="Street, City, Area"
                      value={address}
                      onChange={(e) =>
                        setAddress(
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* FOOTER */}

              <div className="modal-footer">

                <button
                  className="secondary-button"
                  onClick={() => {
                    setModalVisible(false);
                    clearPatientForm();
                  }}
                >
                  Cancel
                </button>

                <button
                  className="save-button"
                  onClick={savePatient}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            PATIENT DETAIL MODAL
        ================================================= */}

        {selectedPatient && (
          <div className="modal-overlay">

            <div className="detail-modal">

              {/* HEADER */}

              <div className="detail-header">

                <div className="detail-patient-left">

                  <div className="card-avatar">
                    {selectedPatient.name
                      ? selectedPatient.name
                          .charAt(0)
                          .toUpperCase()
                      : "P"}
                  </div>

                  <div>
                    <div className="detail-patient-name">
                      {selectedPatient.name}
                    </div>

                    <div className="detail-patient-id">
                      ID :{" "}
                      {selectedPatient.patient_id ||
                        "N/A"}
                    </div>
                  </div>
                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setSelectedPatient(
                      null
                    )
                  }
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* TABS */}

              <div className="detail-tabs">

                <button
                  className={
                    detailTab ===
                    "info"
                      ? "detail-tab active"
                      : "detail-tab"
                  }
                  onClick={() =>
                    setDetailTab(
                      "info"
                    )
                  }
                >
                  Profile
                </button>

                <button
                  className={
                    detailTab ===
                    "orders"
                      ? "detail-tab active"
                      : "detail-tab"
                  }
                  onClick={() =>
                    setDetailTab(
                      "orders"
                    )
                  }
                >
                  Orders History
                </button>

                <button
                  className={
                    detailTab ===
                    "exams"
                      ? "detail-tab active"
                      : "detail-tab"
                  }
                  onClick={() =>
                    setDetailTab(
                      "exams"
                    )
                  }
                >
                  Eye Exam
                </button>
              </div>

              {/* LOADING */}

              {historyLoading && (
                <div className="history-loading">
                  Loading patient history...
                </div>
              )}

              {/* =================================================
                  PROFILE
              ================================================= */}

              {!historyLoading &&
                detailTab ===
                  "info" && (
                  <div>

                    <div className="info-card">

                      {/* MOBILE */}

                      <div className="info-row">

                        <div className="info-icon">
                          <FiPhone
                            size={18}
                          />
                        </div>

                        <div>
                          <div className="info-label">
                            Mobile Number
                          </div>

                          <div className="info-value">
                            {selectedPatient.mobile ||
                              "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="info-divider" />

                      {/* AGE */}

                      <div className="info-row">

                        <div className="info-icon">
                          <FiUser
                            size={18}
                          />
                        </div>

                        <div>
                          <div className="info-label">
                            Age / Gender
                          </div>

                          <div className="info-value">
                            {selectedPatient.age
                              ? `${selectedPatient.age} yrs`
                              : "N/A"}{" "}
                            /{" "}
                            {selectedPatient.gender ||
                              "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="info-divider" />

                      {/* ADDRESS */}

                      <div className="info-row">

                        <div className="info-icon">
                          <FiMapPin
                            size={18}
                          />
                        </div>

                        <div className="address-info">
                          <div className="info-label">
                            Address
                          </div>

                          <div className="info-value">
                            {selectedPatient.address ||
                              "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="action-buttons">

                      <button
                        className="call-button"
                        onClick={() =>
                          handleCall(
                            selectedPatient.mobile
                          )
                        }
                      >
                        <FiPhone
                          size={18}
                        />

                        Call
                      </button>

                      <button
                        className="whatsapp-button"
                        onClick={() =>
                          handleWhatsApp(
                            selectedPatient.mobile
                          )
                        }
                      >
                        <FiMessageCircle
                          size={18}
                        />

                        WhatsApp
                      </button>
                    </div>

                    {/* DELETE */}

                    <button
                      className="delete-button"
                      onClick={() =>
                        deletePatient(
                          selectedPatient.id
                        )
                      }
                    >
                      <FiTrash2
                        size={18}
                      />

                      Delete Patient
                    </button>
                  </div>
                )}

              {/* =================================================
                  ORDERS
              ================================================= */}

              {!historyLoading &&
                detailTab ===
                  "orders" && (
                  <div className="history-section">

                    <h4>
                      Selected Order
                    </h4>

                    {selectedOrder ? (
                      <div className="history-card">

                        <div className="history-title">
                          Order #
                          {selectedOrder.order_number ||
                            selectedOrder.id}
                        </div>

                        <div className="history-date">
                          {selectedOrder.created_at
                            ? new Date(
                                selectedOrder.created_at
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "N/A"}
                        </div>

                        <div className="history-line">
                          Frame:{" "}
                          {selectedOrder.frame_name ||
                            "N/A"}
                        </div>

                        <div className="history-line">
                          Lens:{" "}
                          {selectedOrder.lens_type ||
                            "N/A"}
                        </div>

                        <div className="history-line">
                          Status:{" "}
                          {selectedOrder.status ||
                            "N/A"}
                        </div>

                        <div className="history-line">
                          Payment:{" "}
                          {selectedOrder.payment_status ||
                            "N/A"}
                        </div>

                        <div className="history-price">
                          Total: ₹
                          {selectedOrder.total_amount ||
                            0}
                        </div>
                      </div>
                    ) : (
                      <div className="empty-history">
                        <FiFileText
                          size={36}
                        />

                        <span>
                          No order selected.
                        </span>
                      </div>
                    )}
                  </div>
                )}

              {/* =================================================
                  EYE EXAM
              ================================================= */}

              {!historyLoading &&
                detailTab ===
                  "exams" && (
                  <div className="history-section">

                    <h4>
                      Selected Eye Examination
                    </h4>

                    {selectedEyeExam ? (
                      <div className="history-card">

                        <div className="history-title">
                          Eye Examination
                        </div>

                        <div className="history-date">
                          {selectedEyeExam.exam_date
                            ? new Date(
                                selectedEyeExam.exam_date
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "Date N/A"}
                        </div>

                        <div className="history-line">
                          OD: SPH{" "}
                          {selectedEyeExam.right_sph ||
                            "0.00"}{" "}
                          | CYL{" "}
                          {selectedEyeExam.right_cyl ||
                            "0.00"}{" "}
                          | AXIS{" "}
                          {selectedEyeExam.right_axis ||
                            "0"}
                        </div>

                        <div className="history-line">
                          OS: SPH{" "}
                          {selectedEyeExam.left_sph ||
                            "0.00"}{" "}
                          | CYL{" "}
                          {selectedEyeExam.left_cyl ||
                            "0.00"}{" "}
                          | AXIS{" "}
                          {selectedEyeExam.left_axis ||
                            "0"}
                        </div>

                        <div className="history-line">
                          Vision:{" "}
                          {selectedEyeExam.vision ||
                            "N/A"}
                        </div>

                        <div className="history-line">
                          Diagnosis:{" "}
                          {selectedEyeExam.diagnosis ||
                            "N/A"}
                        </div>

                        <div className="history-note">
                          Doctor Notes:{" "}
                          {selectedEyeExam.notes ||
                            "No notes"}
                        </div>
                      </div>
                    ) : (
                      <div className="empty-history">
                        <FiEye
                          size={36}
                        />

                        <span>
                          No eye examination
                          selected.
                        </span>
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          CSS
      ===================================================== */}

  <style>{`

  * {
    box-sizing: border-box;
  }

  button,
  input,
  textarea {
    font-family: inherit;
  }

  button {
    border: none;
  }

  /* ===================================================
     MAIN
  =================================================== */

  .patients-container {
    min-height: 100vh;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;

    background: #F8FAFC;

    position: relative;
  }

  /* Remove decorative circles */

  .circle-decoration-top,
  .circle-decoration-bottom,
  .circle-decoration-center {
    display: none;
  }

  /* ===================================================
     HEADER
  =================================================== */

  .patients-header {
    position: relative;
    z-index: 2;

    min-height: 78px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 20px;

    padding: 16px 20px;

    margin-bottom: 20px;

    background: #FFFFFF;

    border: 1px solid #E2E8F0;

    border-left: 4px solid #2563EB;

    border-radius: 10px;

    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
  }

  .patients-header-mobile {
    flex-direction: column;
    align-items: stretch;
    padding: 14px;
  }

  .patients-title-row {
    min-width: 0;

    display: flex;
    align-items: center;

    gap: 8px;
  }

  /* ===================================================
     HEADER BUTTONS
  =================================================== */

  .header-icon-button {
    flex-shrink: 0;

    width: 40px;
    height: 40px;

    border-radius: 8px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #2563EB;

    background: #EFF6FF;

    border: 1px solid #DBEAFE;

    cursor: pointer;

    transition: 0.2s;
  }

  .header-icon-button:hover {
    color: #FFFFFF;
    background: #2563EB;
    border-color: #2563EB;
  }

  .header-title-container {
    min-width: 0;
    margin-left: 4px;
  }

  .patients-title {
    color: #0F172A;

    font-size: 22px;
    font-weight: 700;

    letter-spacing: -0.3px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .patients-subtitle {
    color: #64748B;

    font-size: 12px;
    font-weight: 400;

    margin-top: 3px;
  }

  /* ===================================================
     VIEW TOGGLE
  =================================================== */

  .view-toggle {
    flex-shrink: 0;

    display: flex;
    align-items: center;

    gap: 2px;

    padding: 3px;

    border-radius: 8px;

    background: #F1F5F9;

    border: 1px solid #E2E8F0;
  }

  .view-toggle-mobile {
    align-self: flex-end;
  }

  .view-toggle-button {
    width: 38px;
    height: 34px;

    border-radius: 6px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #64748B;

    background: transparent;

    cursor: pointer;

    transition: 0.2s;
  }

  .view-toggle-button:hover {
    color: #2563EB;
  }

  .view-toggle-button.active {
    color: #FFFFFF;

    background: #2563EB;

    box-shadow: none;
  }

  /* ===================================================
     CONTENT
  =================================================== */

  .patients-content {
    position: relative;
    z-index: 2;

    padding-bottom: 40px;
  }

  /* ===================================================
     SEARCH / ACTION BAR
  =================================================== */

  .search-action-bar {
    width: 100%;

    display: flex;
    align-items: center;

    gap: 10px;

    margin-bottom: 16px;
  }

  .search-action-mobile {
    flex-direction: column;
    align-items: stretch;
  }

  /* ===================================================
     INPUTS
  =================================================== */

  .gradient-input-wrapper {
    padding: 0;

    border-radius: 8px;

    background: transparent;
  }

  .search-wrapper {
    flex: 1;
    min-width: 0;
  }

  .gradient-input-inner {
    width: 100%;

    min-height: 42px;

    display: flex;
    align-items: center;

    gap: 8px;

    padding: 0 12px;

    border-radius: 8px;

    background: #FFFFFF;

    border: 1px solid #CBD5E1;

    transition: 0.2s;
  }

  .gradient-input-inner:focus-within {
    border-color: #2563EB;

    box-shadow: 0 0 0 2px #DBEAFE;
  }

  .gradient-input-inner input,
  .gradient-input-inner textarea {
    width: 100%;

    flex: 1;

    min-width: 0;

    border: none;
    outline: none;

    background: transparent;

    color: #0F172A;

    font-size: 13px;
  }

  .gradient-input-inner input::placeholder,
  .gradient-input-inner textarea::placeholder {
    color: #94A3B8;
  }

  /* ===================================================
     DATE
  =================================================== */

  .created-date-box {
    width: 180px;
    height: 42px;

    display: flex;
    align-items: center;

    gap: 8px;

    padding: 0 12px;

    border: 1px solid #CBD5E1;

    border-radius: 8px;

    background: #FFFFFF;
  }

  .created-date-box:focus-within {
    border-color: #2563EB;

    box-shadow: 0 0 0 2px #DBEAFE;
  }

  .created-date-box input {
    flex: 1;

    min-width: 0;

    border: none;
    outline: none;

    background: transparent;

    color: #334155;

    font-size: 13px;
  }

  .date-clear-button {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0;

    background: transparent;

    color: #64748B;

    cursor: pointer;
  }

  .date-clear-button:hover {
    color: #2563EB;
  }

  /* ===================================================
     ACTION BUTTONS
  =================================================== */

  .search-action-symbol-group {
    display: flex;
    align-items: center;

    gap: 8px;
  }

  .gradient-symbol-button {
    width: 42px;
    height: 42px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 8px;

    color: #2563EB;

    background: #FFFFFF;

    border: 1px solid #CBD5E1;

    box-shadow: none;

    cursor: pointer;

    transition: 0.2s;
  }

  .gradient-symbol-button:hover {
    color: #FFFFFF;

    background: #2563EB;

    border-color: #2563EB;
  }

  .gradient-symbol-button.filter-active {
    color: #FFFFFF;

    background: #2563EB;

    border-color: #2563EB;
  }

  /* ===================================================
     FILTER
  =================================================== */

  .horizontal-filter-container {
    display: flex;
    align-items: center;

    gap: 8px;

    margin-bottom: 16px;

    overflow-x: auto;

    scrollbar-width: none;
  }

  .horizontal-filter-container::-webkit-scrollbar {
    display: none;
  }

  .filter-chip {
    flex-shrink: 0;

    padding: 7px 14px;

    border-radius: 7px;

    color: #475569;

    background: #FFFFFF;

    border: 1px solid #CBD5E1;

    font-size: 12px;
    font-weight: 600;

    cursor: pointer;

    transition: 0.2s;
  }

  .filter-chip:hover {
    color: #2563EB;
    border-color: #93C5FD;
  }

  .filter-chip.active {
    color: #FFFFFF;

    border-color: #2563EB;

    background: #2563EB;
  }

  /* ===================================================
     DIRECTORY
  =================================================== */

  .directory-header {
    margin-bottom: 12px;
  }

  .directory-header h2 {
    margin: 0;

    color: #0F172A;

    font-size: 18px;
    font-weight: 700;
  }

  .directory-header p {
    margin: 3px 0 0;

    color: #64748B;

    font-size: 12px;
  }

  /* ===================================================
     PATIENT GRID
  =================================================== */

  .patients-grid {
    display: grid;

    gap: 10px;
  }

  .patients-grid.single {
    grid-template-columns: 1fr;
  }

  .patients-grid.multi {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));

    gap: 12px;
  }

  /* ===================================================
     PATIENT CARD
  =================================================== */

  .patient-card {
    width: 100%;

    min-width: 0;

    padding: 14px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 12px;

    border-radius: 10px;

    background: #FFFFFF;

    border: 1px solid #E2E8F0;

    box-shadow: none;

    text-align: left;

    cursor: pointer;

    transition: 0.2s;
  }

  .patient-card:hover {
    border-color: #93C5FD;

    background: #F8FBFF;

    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
  }

  .patient-card-multi {
    flex-direction: column;
    align-items: flex-start;

    padding: 14px;
  }

  .multi-card-top-row {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 8px;
  }

  .patient-card-left {
    min-width: 0;

    flex: 1;

    display: flex;
    align-items: center;

    gap: 12px;
  }

  .patient-card-details {
    min-width: 0;
  }

  .patient-card-right {
    flex-shrink: 0;

    display: flex;
    align-items: center;

    gap: 10px;
  }

  /* ===================================================
     AVATAR
  =================================================== */

  .card-avatar {
    flex-shrink: 0;

    width: 42px;
    height: 42px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 8px;

    background: #EFF6FF;

    border: 1px solid #DBEAFE;

    color: #2563EB;

    font-size: 16px;
    font-weight: 700;
  }

  .patient-card-multi .card-avatar {
    width: 38px;
    height: 38px;

    border-radius: 8px;

    font-size: 14px;
  }

  .patient-card-name {
    color: #0F172A;

    font-size: 14px;
    font-weight: 700;

    margin-bottom: 3px;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .multi-name {
    font-size: 13px;
  }

  .patient-card-meta {
    color: #64748B;

    font-size: 11px;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .created-meta {
    margin-top: 3px;
  }

  /* ===================================================
     GENDER
  =================================================== */

  .gender-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    padding: 4px 9px;

    border-radius: 6px;

    font-size: 10px;
    font-weight: 600;
  }

  .gender-badge.male {
    color: #2563EB;

    background: #EFF6FF;

    border: 1px solid #DBEAFE;
  }

  .gender-badge.female {
    color: #C026D3;

    background: #FDF4FF;

    border: 1px solid #F5D0FE;
  }

  .patient-card-multi .gender-badge {
    padding: 3px 7px;

    font-size: 10px;
  }

  /* ===================================================
     EMPTY
  =================================================== */

  .empty-patients {
    min-height: 220px;

    grid-column: 1 / -1;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    gap: 6px;

    border-radius: 10px;

    background: #FFFFFF;

    border: 1px dashed #CBD5E1;
  }

  .empty-patients h3 {
    margin: 4px 0 0;

    color: #334155;

    font-size: 15px;
  }

  .empty-patients p {
    margin: 0;

    color: #64748B;

    font-size: 12px;
  }

  /* ===================================================
     MODAL
  =================================================== */

  .modal-overlay {
    position: fixed;

    inset: 0;

    z-index: 1000;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 16px;

    background: rgba(15, 23, 42, 0.45);
  }

  /* ===================================================
     NEW PATIENT MODAL
  =================================================== */

  .compact-modal {
    width: 100%;
    max-width: 440px;

    max-height: 85vh;

    display: flex;
    flex-direction: column;

    padding: 20px;

    border-radius: 12px;

    background: #FFFFFF;

    border: 1px solid #E2E8F0;

    box-shadow: 0 15px 40px rgba(15, 23, 42, 0.18);
  }

  .modal-header {
    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding-bottom: 12px;

    margin-bottom: 4px;

    border-bottom: 1px solid #E2E8F0;
  }

  .modal-header h3 {
    margin: 0;

    color: #0F172A;

    font-size: 17px;
    font-weight: 700;
  }

  .modal-header p {
    margin: 2px 0 0;

    color: #64748B;

    font-size: 11px;
  }

  .modal-close {
    width: 30px;
    height: 30px;

    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 6px;

    color: #64748B;

    background: #F1F5F9;

    cursor: pointer;

    transition: 0.2s;
  }

  .modal-close:hover {
    color: #2563EB;

    background: #EFF6FF;
  }

  .modal-form {
    flex: 1;

    overflow-y: auto;

    padding-right: 2px;
  }

  .modal-form label {
    display: block;

    margin-top: 10px;
    margin-bottom: 5px;

    color: #334155;

    font-size: 12px;
    font-weight: 600;
  }

  .form-row {
    display: grid;

    grid-template-columns:
      repeat(2, minmax(0, 1fr));

    gap: 10px;
  }

  .form-column {
    min-width: 0;
  }

  .textarea-inner {
    align-items: flex-start;

    min-height: 62px;
  }

  .textarea-inner textarea {
    min-height: 58px;

    padding-top: 8px;

    resize: vertical;
  }

  .modal-footer {
    flex-shrink: 0;

    display: flex;

    gap: 10px;

    margin-top: 16px;
    padding-top: 12px;

    border-top: 1px solid #E2E8F0;
  }

  .secondary-button,
  .save-button {
    flex: 1;

    padding: 10px;

    border-radius: 8px;

    font-size: 13px;
    font-weight: 700;

    cursor: pointer;
  }

  .secondary-button {
    color: #475569;

    background: #F1F5F9;

    border: 1px solid #E2E8F0;
  }

  .secondary-button:hover {
    background: #E2E8F0;
  }

  .save-button {
    color: #FFFFFF;

    background: #2563EB;

    border: 1px solid #2563EB;
  }

  .save-button:hover {
    background: #1D4ED8;
  }

  /* ===================================================
     DETAIL MODAL
  =================================================== */

  .detail-modal {
    width: 100%;
    max-width: 520px;

    max-height: 88vh;

    overflow-y: auto;

    padding: 22px;

    border-radius: 12px;

    background: #FFFFFF;

    border: 1px solid #E2E8F0;

    box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);
  }

  .detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding-bottom: 14px;

    margin-bottom: 16px;

    border-bottom: 1px solid #E2E8F0;
  }

  .detail-patient-left {
    min-width: 0;

    display: flex;
    align-items: center;

    gap: 12px;
  }

  .detail-patient-name {
    max-width: 300px;

    color: #0F172A;

    font-size: 16px;
    font-weight: 700;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .detail-patient-id {
    margin-top: 2px;

    color: #64748B;

    font-size: 12px;
  }

  /* ===================================================
     DETAIL TABS
  =================================================== */

  .detail-tabs {
    display: grid;

    grid-template-columns:
      repeat(3, minmax(0, 1fr));

    gap: 2px;

    padding: 3px;

    margin-bottom: 16px;

    border-radius: 8px;

    background: #F1F5F9;

    border: 1px solid #E2E8F0;
  }

  .detail-tab {
    min-width: 0;

    padding: 8px 5px;

    border-radius: 6px;

    color: #64748B;

    background: transparent;

    font-size: 11px;
    font-weight: 600;

    cursor: pointer;
  }

  .detail-tab:hover {
    color: #2563EB;
  }

  .detail-tab.active {
    color: #2563EB;

    background: #FFFFFF;

    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);

    font-weight: 700;
  }

  /* ===================================================
     INFO
  =================================================== */

  .info-card {
    padding: 16px;

    margin-bottom: 16px;

    border-radius: 10px;

    background: #FFFFFF;

    border: 1px solid #E2E8F0;
  }

  .info-row {
    display: flex;
    align-items: center;

    gap: 12px;
  }

  .info-icon {
    width: 36px;
    height: 36px;

    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 8px;

    color: #2563EB;

    background: #EFF6FF;

    border: 1px solid #DBEAFE;
  }

  .info-label {
    color: #64748B;

    font-size: 11px;
    font-weight: 500;
  }

  .info-value {
    margin-top: 1px;

    color: #0F172A;

    font-size: 13px;
    font-weight: 600;
  }

  .address-info {
    flex: 1;
    min-width: 0;
  }

  .info-divider {
    height: 1px;

    margin: 12px 0;

    background: #E2E8F0;
  }

  /* ===================================================
     ACTION BUTTONS
  =================================================== */

  .action-buttons {
    display: grid;

    grid-template-columns:
      repeat(2, minmax(0, 1fr));

    gap: 10px;

    margin-bottom: 10px;
  }

  .call-button,
  .whatsapp-button,
  .delete-button {
    display: flex;
    align-items: center;
    justify-content: center;

    gap: 6px;

    padding: 10px;

    border-radius: 8px;

    font-size: 13px;
    font-weight: 700;

    cursor: pointer;

    transition: 0.2s;
  }

  .call-button {
    color: #2563EB;

    background: #EFF6FF;

    border: 1px solid #BFDBFE;
  }

  .call-button:hover {
    color: #FFFFFF;

    background: #2563EB;
  }

  .whatsapp-button {
    color: #FFFFFF;

    background: #22C55E;

    border: 1px solid #22C55E;
  }

  .whatsapp-button:hover {
    background: #16A34A;
  }

  .delete-button {
    width: 100%;

    color: #DC2626;

    background: #FFFFFF;

    border: 1px solid #FCA5A5;
  }

  .delete-button:hover {
    color: #FFFFFF;

    background: #DC2626;

    border-color: #DC2626;
  }

  /* ===================================================
     HISTORY
  =================================================== */

  .history-section h4 {
    margin: 0 0 10px;

    color: #0F172A;

    font-size: 14px;
  }

  .history-card {
    padding: 14px;

    border-radius: 10px;

    background: #FFFFFF;

    border: 1px solid #E2E8F0;
  }

  .history-title {
    color: #2563EB;

    font-size: 14px;
    font-weight: 700;
  }

  .history-date {
    margin: 3px 0 8px;

    color: #64748B;

    font-size: 11px;
  }

  .history-line {
    margin-top: 4px;

    color: #334155;

    font-size: 12px;

    line-height: 1.5;
  }

  .history-price {
    margin-top: 8px;

    color: #0F172A;

    font-size: 13px;
    font-weight: 700;
  }

  .history-note {
    margin-top: 8px;

    color: #475569;

    font-size: 12px;

    font-style: italic;

    line-height: 1.5;
  }

  .empty-history {
    min-height: 150px;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    gap: 8px;

    color: #94A3B8;

    background: #F8FAFC;

    border-radius: 10px;

    border: 1px solid #E2E8F0;

    font-size: 12px;
  }

  .history-loading {
    padding: 30px;

    text-align: center;

    color: #64748B;

    font-size: 13px;
  }

  /* ===================================================
     TABLET
  =================================================== */

  @media (max-width: 899px) {

    .patients-container {
      padding: 10px;
    }

    .patients-title {
      font-size: 18px;
    }

    .patients-subtitle {
      font-size: 11px;
    }

    .search-action-bar {
      flex-direction: column;
      align-items: stretch;
    }

    .search-wrapper {
      width: 100%;
    }

    .date-wrapper {
      width: 100%;
    }

    .created-date-box {
      width: 100%;
    }

    .search-action-symbol-group {
      width: 100%;

      justify-content: flex-end;
    }

    .gradient-symbol-button {
      width: 44px;
      height: 44px;
    }

    .patients-grid.multi {
      grid-template-columns:
        repeat(2, minmax(0, 1fr));
    }
  }

  /* ===================================================
     SMALL MOBILE
  =================================================== */

  @media (max-width: 499px) {

    .patients-container {
      padding: 8px;
    }

    .patients-header {
      border-radius: 8px;

      border-left-width: 3px;
    }

    .patients-title-row {
      width: 100%;
    }

    .header-icon-button {
      width: 38px;
      height: 38px;
    }

    .patients-title {
      font-size: 17px;
    }

    .patients-subtitle {
      font-size: 10px;
    }

    .view-toggle {
      margin-top: 10px;
    }

    .patients-grid.multi {
      grid-template-columns: 1fr;
    }

    .patient-card {
      padding: 12px;
    }

    .patient-card-right {
      gap: 5px;
    }

    .gender-badge {
      padding: 3px 7px;
      font-size: 10px;
    }

    .detail-modal {
      max-height: 94vh;

      padding: 16px;

      border-radius: 10px;
    }

    .compact-modal {
      max-height: 92vh;

      padding: 16px;

      border-radius: 10px;
    }

    .form-row {
      grid-template-columns: 1fr;

      gap: 0;
    }

    .detail-tab {
      font-size: 10px;
    }

    .detail-patient-name {
      max-width: 180px;
    }
  }

`}</style>
    </>
  );
}