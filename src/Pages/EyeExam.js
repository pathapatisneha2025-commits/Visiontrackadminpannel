
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Home,
  Eye,
  Search,
  List,
  Grid,
  Clock3,
  PlusCircle,
  ChevronRight,
  X,
  Calendar,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";

const API_BASE = "https://visiontrackdatabase.onrender.com";

export default function EyeExam() {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [storeName, setStoreName] = useState("");

  const [patients, setPatients] = useState([]);
  const [exams, setExams] = useState([]);

  const [patientSearch, setPatientSearch] = useState("");
  const [viewMode, setViewMode] = useState("single");

  const [historyFilter, setHistoryFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);

  const [eyeHistoryModal, setEyeHistoryModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const [historyPatientSearch, setHistoryPatientSearch] =
    useState("");

  const [historySearchText, setHistorySearchText] =
    useState("");

  const [historyFromDate, setHistoryFromDate] =
    useState("");

  const [historyToDate, setHistoryToDate] =
    useState("");

  // H/O history modal
  const [historyModal, setHistoryModal] = useState(false);
  const [selectedHistoryCategory, setSelectedHistoryCategory] =
    useState(null);

  const [historySearch, setHistorySearch] = useState("");
  const [selectedHistory, setSelectedHistory] = useState([]);

  // =========================================================
  // HISTORY DATA
  // =========================================================

  const historyData = {
    "Medical History": [
      "Diabetes",
      "Hypertension",
      "Thyroid",
      "Asthma",
      "Heart Disease",
    ],

    "Eye History": [
      "Previous Spectacles",
      "Previous Contact Lens",
      "Cataract Surgery",
      "LASIK Surgery",
      "Glaucoma",
      "Dry Eye",
    ],

    "Family History": [
      "Glaucoma",
      "Diabetes",
      "Hypertension",
      "High Myopia",
    ],

    Allergies: [
      "Drug Allergy",
      "Dust Allergy",
      "Food Allergy",
      "Seasonal Allergy",
    ],
  };

  const historySuggestions = selectedHistoryCategory
    ? (historyData[selectedHistoryCategory] || []).filter((item) =>
        item.toLowerCase().includes(historySearch.toLowerCase())
      )
    : [];

  // =========================================================
  // GET STORE CODE
  // =========================================================

  const getStoreCode = () => {
    return (
      localStorage.getItem("storeCode") ||
      localStorage.getItem("store_code") ||
      ""
    );
  };

  // =========================================================
  // LOAD STORE DETAILS
  // =========================================================

  const loadStoreDetails = async () => {
    try {
      const storeCode = getStoreCode();

      if (!storeCode) {
        console.warn("Store code not found");
        return;
      }

      const res = await fetch(
        `${API_BASE}/registration/store-details/${encodeURIComponent(
          storeCode
        )}`
      );

      if (!res.ok) {
        throw new Error(
          `Store details API failed: ${res.status}`
        );
      }

      const data = await res.json();

      console.log("STORE DETAILS:", data);

      if (data.success) {
        setStoreName(
          data.data?.store_name ||
            data.data?.storeName ||
            ""
        );
      }
    } catch (error) {
      console.error("STORE LOAD ERROR:", error);
    }
  };

  // =========================================================
  // LOAD SUPER ADMIN PATIENTS
  //
  // IMPORTANT:
  // Super Admin patients do NOT use storeCode.
  //
  // API:
  // GET /patient/superadmin
  //
  // Response:
  // {
  //   success: true,
  //   patients: [...]
  // }
  // =========================================================

  const loadPatients = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/patient/superadmin`
      );

      if (!res.ok) {
        throw new Error(
          `Patient API failed: ${res.status}`
        );
      }

      const data = await res.json();

      console.log("SUPER ADMIN PATIENTS:", data);

      if (
        data.success === true &&
        Array.isArray(data.patients)
      ) {
        setPatients(data.patients);
      } else {
        console.warn(
          "Invalid patient response:",
          data
        );

        setPatients([]);
      }
    } catch (error) {
      console.error(
        "SUPER ADMIN PATIENT LOAD ERROR:",
        error
      );

      setPatients([]);
    }
  };

// =========================================================
// LOAD SUPER ADMIN EYE EXAMS
//
// IMPORTANT:
// Super Admin eye exams do NOT use storeCode.
//
// API:
// GET /eyeexam/super-admin
// =========================================================

const loadExams = async () => {
  try {
    const res = await fetch(
      `${API_BASE}/eyeexam/super-admin`
    );

    if (!res.ok) {
      throw new Error(
        `Eye exam API failed: ${res.status}`
      );
    }

    const data = await res.json();

    console.log("SUPER ADMIN EYE EXAMS:", data);

    if (
      data.success === true &&
      Array.isArray(data.exams)
    ) {
      setExams(data.exams);
    } else {
      setExams([]);
    }
  } catch (error) {
    console.error(
      "SUPER ADMIN EYE EXAM LOAD ERROR:",
      error
    );

    setExams([]);
  }
};
  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadPatients();
    loadExams();
    loadStoreDetails();
  }, []);

  // =========================================================
  // DATE HELPERS
  // =========================================================

  const normalizeDateOnly = (date) => {
    if (!date) return null;

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return null;
    }

    d.setHours(0, 0, 0, 0);

    return d;
  };

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;

    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getStartOfWeek = (date) => {
    const d = new Date(date);

    const day = d.getDay();

    const diff = day === 0 ? -6 : 1 - day;

    d.setDate(d.getDate() + diff);

    d.setHours(0, 0, 0, 0);

    return d;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "-";
    }

    return d.toLocaleDateString("en-IN");
  };

  const parseDDMMYYYY = (value) => {
    if (!value) return null;

    const parts = value.split("-");

    if (parts.length !== 3) {
      return null;
    }

    const day = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const year = Number(parts[2]);

    if (
      !Number.isInteger(day) ||
      !Number.isInteger(month) ||
      !Number.isInteger(year) ||
      year < 1900 ||
      month < 0 ||
      month > 11 ||
      day < 1 ||
      day > 31
    ) {
      return null;
    }

    const date = new Date(
      year,
      month,
      day
    );

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    // Validate date
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      return null;
    }

    date.setHours(0, 0, 0, 0);

    return date;
  };
// =========================================================
// PATIENT FILTER
// =========================================================

const filteredPatients = useMemo(() => {
  const search = patientSearch
    .toLowerCase()
    .trim();

  return patients.filter((patient) => {
    const patientName = String(
      patient.name || ""
    ).toLowerCase();

    const patientId = String(
      patient.patient_id || ""
    ).toLowerCase();

    const mobile = String(
      patient.mobile || ""
    );

    // -------------------------------------------------------
    // SEARCH
    // -------------------------------------------------------

    const matchesSearch =
      patientName.includes(search) ||
      patientId.includes(search) ||
      mobile.includes(search);

    if (!matchesSearch) {
      return false;
    }

    // -------------------------------------------------------
    // ALL PATIENTS
    // -------------------------------------------------------

    if (historyFilter === "all") {
      return true;
    }

    // -------------------------------------------------------
    // FIND ALL EXAMS FOR THIS PATIENT
    // -------------------------------------------------------

    const patientExams = exams.filter(
      (exam) =>
        String(exam.patient_id || "") ===
        String(patient.patient_id || "")
    );

    if (patientExams.length === 0) {
      return false;
    }

    // -------------------------------------------------------
    // CHECK WHETHER ANY EXAM MATCHES THE FILTER
    // -------------------------------------------------------

    return patientExams.some((exam) => {
      if (!exam.exam_date) {
        return false;
      }

      const examDate = normalizeDateOnly(
        exam.exam_date
      );

      const today = normalizeDateOnly(
        new Date()
      );

      if (!examDate || !today) {
        return false;
      }

      // -----------------------------------------------------
      // TODAY
      // -----------------------------------------------------

      if (historyFilter === "today") {
        return isSameDay(
          examDate,
          today
        );
      }

      // -----------------------------------------------------
      // THIS WEEK
      // Monday -> Sunday
      // -----------------------------------------------------

      if (historyFilter === "week") {
        const start =
          getStartOfWeek(today);

        const end = new Date(start);

        end.setDate(
          start.getDate() + 6
        );

        end.setHours(
          23,
          59,
          59,
          999
        );

        return (
          examDate >= start &&
          examDate <= end
        );
      }

      // -----------------------------------------------------
      // THIS MONTH
      // -----------------------------------------------------

      if (historyFilter === "month") {
        return (
          examDate.getMonth() ===
            today.getMonth() &&
          examDate.getFullYear() ===
            today.getFullYear()
        );
      }

      // -----------------------------------------------------
      // SPECIFIC DATE
      // -----------------------------------------------------

      if (historyFilter === "date") {
        if (!selectedDate) {
          return true;
        }

        return isSameDay(
          examDate,
          selectedDate
        );
      }

      return true;
    });
  });
}, [
  patients,
  exams,
  patientSearch,
  historyFilter,
  selectedDate,
]);

  // =========================================================
  // EYE HISTORY FILTER
  // =========================================================

  const filteredEyeHistory = useMemo(() => {
    return exams.filter((exam) => {
      const patientSearchValue =
        historyPatientSearch
          .toLowerCase()
          .trim();

      const textSearch =
        historySearchText
          .toLowerCase()
          .trim();

      const examPatientName = String(
        exam.patient_name || ""
      ).toLowerCase();

      const examPatientId = String(
        exam.patient_id || ""
      ).toLowerCase();

      const examMobile = String(
        exam.mobile_number ||
          exam.mobile ||
          ""
      );

      const matchesPatient =
        !patientSearchValue ||
        examPatientName.includes(
          patientSearchValue
        ) ||
        examPatientId.includes(
          patientSearchValue
        ) ||
        examMobile.includes(
          patientSearchValue
        );

      const diagnosis = String(
        exam.diagnosis || ""
      ).toLowerCase();

      const complaint = String(
        exam.complaint || ""
      ).toLowerCase();

      const matchesText =
        !textSearch ||
        diagnosis.includes(textSearch) ||
        complaint.includes(textSearch);

      if (!exam.exam_date) {
        return false;
      }

      const examDate = normalizeDateOnly(
        exam.exam_date
      );

      const today = normalizeDateOnly(
        new Date()
      );

      if (!examDate || !today) {
        return false;
      }

      let matchesFilter = true;

      switch (historyFilter) {
        case "today":
          matchesFilter = isSameDay(
            examDate,
            today
          );
          break;

        case "week": {
          const start =
            getStartOfWeek(today);

          const end = new Date(start);

          end.setDate(
            start.getDate() + 6
          );

          end.setHours(
            23,
            59,
            59,
            999
          );

          matchesFilter =
            examDate >= start &&
            examDate <= end;

          break;
        }

        case "month":
          matchesFilter =
            examDate.getMonth() ===
              today.getMonth() &&
            examDate.getFullYear() ===
              today.getFullYear();

          break;

        case "date":
          if (selectedDate) {
            matchesFilter = isSameDay(
              examDate,
              selectedDate
            );
          }

          break;

        default:
          matchesFilter = true;
      }

      const from =
        parseDDMMYYYY(
          historyFromDate
        );

      const to =
        parseDDMMYYYY(
          historyToDate
        );

      let dateRangeMatch = true;

      if (from) {
        dateRangeMatch =
          dateRangeMatch &&
          examDate >= from;
      }

      if (to) {
        const endDate = new Date(to);

        endDate.setHours(
          23,
          59,
          59,
          999
        );

        dateRangeMatch =
          dateRangeMatch &&
          examDate <= endDate;
      }

      return (
        matchesPatient &&
        matchesText &&
        matchesFilter &&
        dateRangeMatch
      );
    });
  }, [
    exams,
    historyPatientSearch,
    historySearchText,
    historyFilter,
    selectedDate,
    historyFromDate,
    historyToDate,
  ]);

  // =========================================================
  // FILTER HANDLERS
  // =========================================================

  const setFilter = (filter) => {
    setSelectedDate(null);
    setHistoryFilter(filter);
  };

  const handleDateChange = (event) => {
    const value = event.target.value;

    if (!value) {
      setSelectedDate(null);
      setHistoryFilter("all");
      return;
    }

    const [year, month, day] =
      value.split("-");

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    date.setHours(0, 0, 0, 0);

    setSelectedDate(date);
    setHistoryFilter("date");
  };

  const clearDateFilter = () => {
    setSelectedDate(null);
    setHistoryFilter("all");
  };

  // =========================================================
  // OPEN NEW EXAM
  // =========================================================

  const openNewExam = (patient = null) => {
    if (patient) {
      navigate(
        "/admin/new-eye-examination",
        {
          state: {
            patient,
          },
        }
      );
    } else {
      navigate(
        "/admin/new-eye-examination"
      );
    }
  };

  // =========================================================
  // H/O HISTORY
  // =========================================================

  const toggleHistoryItem = (item) => {
    if (
      selectedHistory.includes(item)
    ) {
      setSelectedHistory(
        selectedHistory.filter(
          (i) => i !== item
        )
      );
    } else {
      setSelectedHistory([
        ...selectedHistory,
        item,
      ]);
    }
  };

  // =========================================================
  // SELECTED DATE INPUT VALUE
  // =========================================================

  const selectedDateInputValue =
    selectedDate
      ? `${selectedDate.getFullYear()}-${String(
          selectedDate.getMonth() + 1
        ).padStart(2, "0")}-${String(
          selectedDate.getDate()
        ).padStart(2, "0")}`
      : "";

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="eye-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="eye-header">

        <div className="eye-header-left">

        

          <div className="header-title-wrapper">

            <h1>
              Eye Examination
            </h1>

            <p>
              Vision testing records
              {storeName
                ? ` • ${storeName}`
                : ""}
            </p>

          </div>

        </div>

      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="eye-content">

        {/* TOP CARD */}

        <section className="top-info">

          <div className="top-info-left">

            <div className="eye-icon-circle">
              <Eye size={24} />
            </div>

            <div>

              <h2>
                Vision Testing
              </h2>

              <p>
                {exams.length}{" "}
                {exams.length === 1
                  ? "examination"
                  : "examinations"}{" "}
                completed
              </p>

            </div>

          </div>

          <div className="top-actions">

            <button
              className="history-action"
              onClick={() =>
                setEyeHistoryModal(true)
              }
              type="button"
            >
              <Clock3 size={19} />
              <span>
                Eye History
              </span>
            </button>

            <button
              className="new-exam-action"
              onClick={() =>
                openNewExam()
              }
              type="button"
            >
              <PlusCircle size={19} />
              <span>
                New Exam
              </span>
            </button>

          </div>

        </section>

        {/* =================================================
            FILTER SECTION
        ================================================= */}

        <section className="filter-card">

          <div className="search-wrapper">

            <Search size={19} />

            <input
              type="text"
              placeholder="Search patient name, ID or mobile..."
              value={patientSearch}
              onChange={(e) =>
                setPatientSearch(
                  e.target.value
                )
              }
            />

            {patientSearch && (
              <button
                className="search-clear"
                onClick={() =>
                  setPatientSearch("")
                }
                type="button"
              >
                <X size={16} />
              </button>
            )}

          </div>

          <div className="filter-row">

            <button
              className={`filter-chip ${
                historyFilter === "all"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setFilter("all")
              }
              type="button"
            >
              All Patients
            </button>

            <button
              className={`filter-chip ${
                historyFilter === "today"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setFilter("today")
              }
              type="button"
            >
              Today
            </button>

            <button
              className={`filter-chip ${
                historyFilter === "week"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setFilter("week")
              }
              type="button"
            >
              This Week
            </button>

            <button
              className={`filter-chip ${
                historyFilter === "month"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setFilter("month")
              }
              type="button"
            >
              This Month
            </button>

            <div
              className={`date-filter ${
                historyFilter === "date"
                  ? "active"
                  : ""
              }`}
            >

              <Calendar size={17} />

              <input
                type="date"
                value={
                  selectedDateInputValue
                }
                onChange={
                  handleDateChange
                }
              />

              {selectedDate && (
                <button
                  className="date-clear"
                  onClick={
                    clearDateFilter
                  }
                  type="button"
                >
                  <X size={16} />
                </button>
              )}

            </div>

          </div>

        </section>

        {/* =================================================
            PATIENT LIST
        ================================================= */}

        <section
          className={
            viewMode === "multi"
              ? "patient-grid"
              : "patient-list"
          }
        >

          {filteredPatients.map(
            (patient) => (
              <button
                key={
                  patient.patient_id ||
                  patient.id
                }
                className={`patient-card ${
                  viewMode === "multi"
                    ? "patient-card-grid"
                    : ""
                }`}
                onClick={() =>
                  openNewExam(patient)
                }
                type="button"
              >

                <div className="patient-info">

                  <div className="patient-avatar-small">

                    {(
                      patient.name ||
                      "P"
                    )
                      .charAt(0)
                      .toUpperCase()}

                  </div>

                  <div>

                    <h3>
                      {patient.name ||
                        "Unknown Patient"}
                    </h3>

                    <p>
                      ID:{" "}
                      {patient.patient_id ||
                        "-"}
                    </p>

                    <p>
                      Mobile:{" "}
                      {patient.mobile ||
                        "-"}
                    </p>

                  </div>

                </div>

                <ChevronRight
                  size={25}
                  className="patient-arrow"
                />

              </button>
            )
          )}

          {filteredPatients.length ===
            0 && (
            <div className="empty-state">

              <Eye size={42} />

              <h3>
                No patients found
              </h3>

              <p>
                Try changing your search
                or date filter.
              </p>

            </div>
          )}

        </section>

      </main>

      {/* =====================================================
          EYE HISTORY MODAL
      ===================================================== */}

      {eyeHistoryModal && (
        <div
          className="modal-overlay"
          onMouseDown={() =>
            setEyeHistoryModal(false)
          }
        >

          <div
            className="history-modal"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2>
                  Eye Examination History
                </h2>

                <p>
                  All patient eye examination
                  records
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setEyeHistoryModal(false)
                }
                type="button"
              >
                <X size={20} />
              </button>

            </div>

            {/* PATIENT SEARCH */}

            <input
              className="modal-input"
              placeholder="Search patient name / ID / mobile"
              value={
                historyPatientSearch
              }
              onChange={(e) =>
                setHistoryPatientSearch(
                  e.target.value
                )
              }
            />

            {/* DIAGNOSIS SEARCH */}

            <input
              className="modal-input"
              placeholder="Diagnosis / Complaint"
              value={
                historySearchText
              }
              onChange={(e) =>
                setHistorySearchText(
                  e.target.value
                )
              }
            />

            {/* DATE RANGE */}

            <div className="date-range">

              <input
                className="modal-input"
                placeholder="From DD-MM-YYYY"
                value={historyFromDate}
                onChange={(e) =>
                  setHistoryFromDate(
                    e.target.value
                  )
                }
              />

              <input
                className="modal-input"
                placeholder="To DD-MM-YYYY"
                value={historyToDate}
                onChange={(e) =>
                  setHistoryToDate(
                    e.target.value
                  )
                }
              />

            </div>

            {/* FILTER */}

            <div className="history-filter-row">

              <button
                className={
                  historyFilter === "all"
                    ? "small-filter active"
                    : "small-filter"
                }
                onClick={() =>
                  setHistoryFilter(
                    "all"
                  )
                }
                type="button"
              >
                All
              </button>

              <button
                className={
                  historyFilter === "today"
                    ? "small-filter active"
                    : "small-filter"
                }
                onClick={() =>
                  setHistoryFilter(
                    "today"
                  )
                }
                type="button"
              >
                Today
              </button>

              <button
                className={
                  historyFilter === "week"
                    ? "small-filter active"
                    : "small-filter"
                }
                onClick={() =>
                  setHistoryFilter(
                    "week"
                  )
                }
                type="button"
              >
                This Week
              </button>

              <button
                className={
                  historyFilter === "month"
                    ? "small-filter active"
                    : "small-filter"
                }
                onClick={() =>
                  setHistoryFilter(
                    "month"
                  )
                }
                type="button"
              >
                This Month
              </button>

            </div>

            {/* HISTORY RESULTS */}

            <div className="history-results">

              {filteredEyeHistory.map(
                (exam, index) => (
                  <button
                    key={
                      exam.id || index
                    }
                    className="history-card"
                    onClick={() => {
                      setSelectedExam(
                        exam
                      );

                      setEyeHistoryModal(
                        false
                      );
                    }}
                    type="button"
                  >

                    <div>

                      <h3>
                        {exam.patient_name ||
                          "Unknown Patient"}
                      </h3>

                      <p>
                        ID:{" "}
                        {exam.patient_id ||
                          "-"}
                      </p>

                      <p>
                        Date:{" "}
                        {formatDate(
                          exam.exam_date
                        )}
                      </p>

                      <p>
                        Diagnosis:{" "}
                        {exam.diagnosis ||
                          "-"}
                      </p>

                    </div>

                    <ChevronRight
                      size={21}
                    />

                  </button>
                )
              )}

              {filteredEyeHistory.length ===
                0 && (
                <div className="history-empty">
                  No eye examination history
                  found
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          EXAM DETAIL MODAL
      ===================================================== */}

      {selectedExam && (
        <div
          className="modal-overlay"
          onMouseDown={() =>
            setSelectedExam(null)
          }
        >

          <div
            className="detail-modal"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >

            <div className="detail-header">

              <div className="detail-patient">

                <div className="detail-avatar">

                  {(
                    selectedExam.patient_name ||
                    "P"
                  )
                    .charAt(0)
                    .toUpperCase()}

                </div>

                <div>

                  <h2>
                    {
                      selectedExam.patient_name ||
                      "Unknown Patient"
                    }
                  </h2>

                  <p>
                    Patient ID:{" "}
                    {
                      selectedExam.patient_id ||
                      "-"
                    }
                  </p>

                </div>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedExam(null)
                }
                type="button"
              >
                <X size={20} />
              </button>

            </div>

            {/* DATE */}

            <div className="detail-date">

              <Calendar size={20} />

              <div>

                <span>
                  Examination Date
                </span>

                <strong>
                  {formatDate(
                    selectedExam.exam_date
                  )}
                </strong>

              </div>

            </div>

            {/* EYES */}

            <div className="eye-detail-grid">

              <div className="eye-detail-card">

                <div className="eye-detail-title">

                  <Eye size={19} />

                  <strong>
                    Right Eye (OD)
                  </strong>

                </div>

                <p>
                  SPH:{" "}
                  {selectedExam.right_sph ||
                    "-"}
                </p>

                <p>
                  CYL:{" "}
                  {selectedExam.right_cyl ||
                    "-"}
                </p>

                <p>
                  AXIS:{" "}
                  {selectedExam.right_axis ||
                    "-"}
                </p>

              </div>

              <div className="eye-detail-card">

                <div className="eye-detail-title">

                  <Eye size={19} />

                  <strong>
                    Left Eye (OS)
                  </strong>

                </div>

                <p>
                  SPH:{" "}
                  {selectedExam.left_sph ||
                    "-"}
                </p>

                <p>
                  CYL:{" "}
                  {selectedExam.left_cyl ||
                    "-"}
                </p>

                <p>
                  AXIS:{" "}
                  {selectedExam.left_axis ||
                    "-"}
                </p>

              </div>

            </div>

            {/* PD */}

            <div className="detail-info-card">

              <span>
                PD
              </span>

              <strong>
                {selectedExam.pd ||
                  "-"}
              </strong>

            </div>

            {/* RX */}

            <div className="detail-note-card">

              <h3>
                Rx / Prescription
              </h3>

              <p>
                {selectedExam.rx ||
                  "No Rx available"}
              </p>

            </div>

            {/* NOTES */}

            <div className="detail-note-card">

              <h3>
                Notes / Diagnosis
              </h3>

              <p>
                {selectedExam.notes ||
                  selectedExam.diagnosis ||
                  "No notes available"}
              </p>

            </div>

            {/* NEXT REVIEW */}

            <div className="detail-note-card">

              <h3>
                Next Review Date
              </h3>

              <p>
                {selectedExam.next_review_date ||
                  "Not set"}
              </p>

            </div>

            <button
              className="detail-close-button"
              onClick={() =>
                setSelectedExam(null)
              }
              type="button"
            >

              <CheckCircle2 size={19} />

              Close

            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          H/O HISTORY MODAL
      ===================================================== */}

      {historyModal && (
        <div className="modal-overlay">

          <div className="history-select-modal">

            {/* HEADER */}

            <div className="modal-header">

              <div className="history-header-left">

                {selectedHistoryCategory && (
                  <button
                    className="back-history-button"
                    onClick={() => {
                      setSelectedHistoryCategory(
                        null
                      );

                      setHistorySearch("");
                    }}
                    type="button"
                  >
                    <ChevronLeft
                      size={20}
                    />
                  </button>
                )}

                <div>

                  <h2>
                    {selectedHistoryCategory ||
                      "Select H/O Category"}
                  </h2>

                  <p>
                    {selectedHistoryCategory
                      ? "Select items below"
                      : "Choose a category"}
                  </p>

                </div>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setHistoryModal(false)
                }
                type="button"
              >
                <X size={20} />
              </button>

            </div>

            {/* BODY */}

            {!selectedHistoryCategory ? (
              <div className="history-category-list">

                {Object.keys(
                  historyData
                ).map((category) => (
                  <button
                    key={category}
                    className="category-card"
                    onClick={() =>
                      setSelectedHistoryCategory(
                        category
                      )
                    }
                    type="button"
                  >

                    <span>
                      {category}
                    </span>

                    <ChevronRight
                      size={18}
                    />

                  </button>
                ))}

              </div>
            ) : (
              <>
                <input
                  className="modal-input"
                  placeholder="Search history..."
                  value={historySearch}
                  onChange={(e) =>
                    setHistorySearch(
                      e.target.value
                    )
                  }
                />

                <div className="history-items">

                  {historySuggestions.length >
                  0 ? (
                    historySuggestions.map(
                      (item) => {
                        const selected =
                          selectedHistory.includes(
                            item
                          );

                        return (
                          <button
                            key={item}
                            className={`history-item ${
                              selected
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              toggleHistoryItem(
                                item
                              )
                            }
                            type="button"
                          >

                            <span>
                              {item}
                            </span>

                            {selected && (
                              <CheckCircle2
                                size={18}
                              />
                            )}

                          </button>
                        );
                      }
                    )
                  ) : (
                    <div className="history-empty">
                      No history found
                    </div>
                  )}

                </div>

                <button
                  className="history-done-button"
                  onClick={() => {
                    setHistoryModal(
                      false
                    );
                  }}
                  type="button"
                >

                  <CheckCircle2
                    size={19}
                  />

                  Done

                </button>
              </>
            )}

          </div>

        </div>
      )}

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .eye-page {
          min-height: 100vh;
          background: #f3f7ff;
          color: #0f172a;
          padding: 20px;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        /* HEADER */

        .eye-header {
          max-width: 1400px;
          margin: 0 auto 20px;
          min-height: 72px;
          padding: 14px 18px;
          background: #2563eb;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow:
            0 8px 25px rgba(37, 99, 235, 0.18);
        }

        .eye-header-left {
          display: flex;
          align-items: center;
          min-width: 0;
        }

        .header-icon-btn {
          width: 38px;
          height: 38px;
          border: none;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-right: 7px;
        }

        .header-icon-btn:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        .header-title-wrapper {
          margin-left: 6px;
          min-width: 0;
        }

        .header-title-wrapper h1 {
          margin: 0;
          color: white;
          font-size: 21px;
          font-weight: 800;
        }

        .header-title-wrapper p {
          margin: 3px 0 0;
          color: #dbeafe;
          font-size: 12px;
        }

        .view-toggle {
          display: flex;
          gap: 3px;
          padding: 3px;
          background: rgba(255, 255, 255, 0.16);
          border-radius: 10px;
        }

        .view-toggle button {
          width: 34px;
          height: 30px;
          border: none;
          border-radius: 7px;
          background: transparent;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .view-toggle button.view-toggle-active {
          background: white;
          color: #2563eb;
        }

        /* CONTENT */

        .eye-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        .top-info {
          background: white;
          border: 1px solid #dbeafe;
          border-radius: 16px;
          padding: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          box-shadow:
            0 4px 15px rgba(37, 99, 235, 0.06);
        }

        .top-info-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .eye-icon-circle {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #eff6ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .top-info h2 {
          margin: 0;
          font-size: 19px;
          font-weight: 800;
        }

        .top-info p {
          margin: 3px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .top-actions {
          display: flex;
          gap: 9px;
        }

        .top-actions button {
          border: none;
          color: white;
          height: 42px;
          padding: 0 15px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .history-action {
          background: #1d4ed8;
        }

        .new-exam-action {
          background: #2563eb;
        }

        .top-actions button:hover {
          opacity: 0.9;
        }

        /* FILTER */

        .filter-card {
          margin-top: 15px;
          padding: 14px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow:
            0 4px 15px rgba(15, 23, 42, 0.05);
        }

        .search-wrapper {
          height: 45px;
          display: flex;
          align-items: center;
          padding: 0 13px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 11px;
          color: #64748b;
        }

        .search-wrapper input {
          flex: 1;
          min-width: 0;
          border: none;
          outline: none;
          background: transparent;
          margin-left: 9px;
          font-size: 14px;
          color: #0f172a;
        }

        .search-clear {
          border: none;
          background: transparent;
          color: #94a3b8;
          cursor: pointer;
        }

        .filter-row {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 12px;
          overflow-x: auto;
          padding-bottom: 2px;
        }

        .filter-chip {
          flex-shrink: 0;
          border: 1px solid #e2e8f0;
          background: #f1f5f9;
          color: #475569;
          border-radius: 20px;
          padding: 9px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .filter-chip.active {
          background: #2563eb;
          border-color: #2563eb;
          color: white;
        }

        .date-filter {
          height: 40px;
          display: flex;
          align-items: center;
          gap: 7px;
          flex-shrink: 0;
          padding: 0 10px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          color: #2563eb;
          background: white;
        }

        .date-filter.active {
          background: #eff6ff;
          border-color: #2563eb;
        }

        .date-filter input {
          border: none;
          outline: none;
          background: transparent;
          color: #334155;
          font-size: 13px;
          cursor: pointer;
        }

        .date-clear {
          border: none;
          background: transparent;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
        }

        /* PATIENT LIST */

        .patient-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 18px;
        }

        .patient-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .patient-card {
          width: 100%;
          min-height: 86px;
          border: 1px solid #bfdbfe;
          background: white;
          border-radius: 14px;
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          cursor: pointer;
          transition: 0.2s ease;
          box-shadow:
            0 3px 10px rgba(37, 99, 235, 0.05);
        }

        .patient-card:hover {
          border-color: #2563eb;
          transform: translateY(-1px);
          box-shadow:
            0 7px 18px rgba(37, 99, 235, 0.10);
        }

        .patient-card-grid {
          min-height: 125px;
          align-items: flex-start;
        }

        .patient-info {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
        }

        .patient-avatar-small {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #eff6ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 17px;
        }

        .patient-info h3 {
          margin: 0;
          font-size: 15px;
          color: #0f172a;
        }

        .patient-info p {
          margin: 3px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .patient-arrow {
          color: #2563eb;
          flex-shrink: 0;
        }

        .empty-state {
          padding: 60px 20px;
          text-align: center;
          color: #64748b;
          background: white;
          border: 1px dashed #bfdbfe;
          border-radius: 15px;
          grid-column: 1 / -1;
        }

        .empty-state svg {
          color: #93c5fd;
        }

        .empty-state h3 {
          margin: 10px 0 5px;
          color: #334155;
        }

        .empty-state p {
          margin: 0;
          font-size: 13px;
        }

        /* MODALS */

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(15, 23, 42, 0.58);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .history-modal {
          width: 100%;
          max-width: 650px;
          max-height: 85vh;
          background: white;
          border-radius: 16px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          box-shadow:
            0 25px 60px rgba(0, 0, 0, 0.22);
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 17px;
          color: #0f172a;
        }

        .modal-header p {
          margin: 3px 0 0;
          font-size: 11px;
          color: #64748b;
        }

        .modal-close {
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 50%;
          background: #f1f5f9;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
        }

        .modal-input {
          width: 100%;
          height: 40px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 0 11px;
          margin-top: 9px;
          outline: none;
          font-size: 13px;
          color: #0f172a;
          background: white;
        }

        .modal-input:focus {
          border-color: #2563eb;
          box-shadow:
            0 0 0 3px #dbeafe;
        }

        .date-range {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .history-filter-row {
          display: flex;
          gap: 7px;
          margin-top: 10px;
          overflow-x: auto;
        }

        .small-filter {
          flex-shrink: 0;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #475569;
          border-radius: 18px;
          padding: 7px 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .small-filter.active {
          background: #2563eb;
          border-color: #2563eb;
          color: white;
        }

        .history-results {
          overflow-y: auto;
          margin-top: 12px;
          padding-right: 2px;
        }

        .history-card {
          width: 100%;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 7px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          cursor: pointer;
          color: #2563eb;
        }

        .history-card:hover {
          border-color: #93c5fd;
          background: #eff6ff;
        }

        .history-card h3 {
          margin: 0 0 5px;
          color: #0f172a;
          font-size: 14px;
        }

        .history-card p {
          margin: 3px 0;
          color: #64748b;
          font-size: 11px;
        }

        .history-empty {
          text-align: center;
          padding: 35px 10px;
          color: #64748b;
          font-size: 13px;
        }

        /* DETAIL MODAL */

        .detail-modal {
          width: 100%;
          max-width: 620px;
          max-height: 88vh;
          overflow-y: auto;
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow:
            0 25px 60px rgba(0, 0, 0, 0.22);
        }

        .detail-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 16px;
        }

        .detail-patient {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .detail-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #2563eb;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 800;
        }

        .detail-header h2 {
          margin: 0;
          font-size: 17px;
        }

        .detail-header p {
          margin: 3px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .detail-date {
          padding: 12px;
          background: #eff6ff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #2563eb;
          margin-bottom: 15px;
        }

        .detail-date span {
          display: block;
          color: #64748b;
          font-size: 10px;
        }

        .detail-date strong {
          display: block;
          margin-top: 2px;
          color: #0f172a;
          font-size: 13px;
        }

        .eye-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .eye-detail-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 13px;
        }

        .eye-detail-title {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #2563eb;
          margin-bottom: 9px;
          font-size: 12px;
        }

        .eye-detail-card p {
          margin: 5px 0;
          color: #334155;
          font-size: 12px;
        }

        .detail-info-card,
        .detail-note-card {
          margin-top: 12px;
          padding: 13px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
        }

        .detail-info-card {
          display: flex;
          justify-content: space-between;
        }

        .detail-info-card span {
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
        }

        .detail-info-card strong {
          color: #334155;
          font-size: 12px;
        }

        .detail-note-card h3 {
          margin: 0 0 5px;
          color: #64748b;
          font-size: 12px;
        }

        .detail-note-card p {
          margin: 0;
          white-space: pre-wrap;
          color: #334155;
          font-size: 13px;
          line-height: 1.5;
        }

        .detail-close-button {
          width: 100%;
          height: 43px;
          margin-top: 14px;
          border: none;
          border-radius: 9px;
          background: #2563eb;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-weight: 700;
          cursor: pointer;
        }

        /* HISTORY SELECT */

        .history-select-modal {
          width: 100%;
          max-width: 480px;
          max-height: 80vh;
          background: white;
          border-radius: 16px;
          padding: 18px;
          overflow-y: auto;
          box-shadow:
            0 25px 60px rgba(0, 0, 0, 0.22);
        }

        .history-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .back-history-button {
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 8px;
          background: #eff6ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .category-card {
          width: 100%;
          margin-top: 8px;
          padding: 13px;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
          background: #f8fafc;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #334155;
          font-weight: 600;
          cursor: pointer;
        }

        .category-card:hover {
          border-color: #93c5fd;
          background: #eff6ff;
          color: #2563eb;
        }

        .history-items {
          margin-top: 10px;
          max-height: 350px;
          overflow-y: auto;
        }

        .history-item {
          width: 100%;
          padding: 11px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #f8fafc;
          margin-bottom: 7px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          color: #334155;
          cursor: pointer;
        }

        .history-item.selected {
          background: #2563eb;
          border-color: #2563eb;
          color: white;
        }

        .history-done-button {
          width: 100%;
          height: 42px;
          margin-top: 12px;
          border: none;
          border-radius: 8px;
          background: #2563eb;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-weight: 700;
          cursor: pointer;
        }

        /* RESPONSIVE */

        @media (max-width: 700px) {

          .eye-page {
            padding: 10px;
          }

          .eye-header {
            padding: 12px;
            border-radius: 13px;
          }

          .header-title-wrapper h1 {
            font-size: 16px;
          }

          .header-title-wrapper p {
            font-size: 10px;
          }

          .header-icon-btn {
            width: 34px;
            height: 34px;
          }

          .top-info {
            flex-direction: column;
            align-items: stretch;
          }

          .top-actions {
            width: 100%;
          }

          .top-actions button {
            flex: 1;
            padding: 0 8px;
          }

          .patient-grid {
            grid-template-columns: 1fr;
          }

          .date-range {
            grid-template-columns: 1fr;
          }

          .modal-overlay {
            padding: 10px;
          }

          .history-modal,
          .history-select-modal {
            max-height: 90vh;
            border-radius: 14px;
          }

          .detail-modal {
            max-height: 92vh;
            border-radius: 14px;
          }

          .eye-detail-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 430px) {

          .view-toggle {
            margin-left: 5px;
          }

          .top-actions span {
            font-size: 11px;
          }

          .top-info-left h2 {
            font-size: 17px;
          }
        }

      `}</style>

    </div>
  );
}
