import React, { useState } from "react";
import { useLocation } from "react-router-dom";
export default function NewEyeExamination() {
     const location = useLocation();

  const selectedPatient = location.state?.patient || null;

  // =========================================================
  // PATIENT
  // =========================================================
 const [patient, setPatient] = useState(
    selectedPatient?.name || ""
  );

  const [patientId, setPatientId] = useState(
    selectedPatient?.patient_id || ""
  );

  const [mobileNumber, setMobileNumber] = useState(
    selectedPatient?.mobile || ""
  );

  const [patientAge, setPatientAge] = useState(
    selectedPatient?.age?.toString() || ""
  );

  const [patientGender, setPatientGender] = useState(
    selectedPatient?.gender || ""
  );

  const [patientAddress, setPatientAddress] = useState(
    selectedPatient?.address || ""
  );

  // =========================================================
  // COMPLAINT / HISTORY
  // =========================================================
  const complaintsList = [
  "Blurred Vision",
  "Decreased Vision",
  "Sudden Loss of Vision",
  "Gradual Loss of Vision",
  "Near Vision Difficulty",
  "Distance Vision Difficulty",
  "Difficulty Reading",
  "Double Vision",
  "Distorted Vision",
  "Poor Night Vision",
  "Eye Pain",
  "Headache",
  "Eye Strain",
  "Foreign Body Sensation",
  "Burning Sensation",
  "Itching",
  "Irritation",
  "Dryness",
  "Eye Fatigue",
  "Red Eye",
  "Watering",
  "Sticky Eyes",
  "Eye Discharge",
  "Swollen Eyelid",
  "Photophobia",
  "Glare",
  "Halos Around Lights",
  "Floaters",
  "Flashes of Light",
  "Eye Injury",
  "Foreign Body in Eye",
  "Chemical Injury",
  "Blunt Trauma",
  "Glasses Check-up",
  "Power Change",
  "Broken Glasses",
  "Lost Glasses",
  "Contact Lens Discomfort",
  "Routine Eye Check-up",
  "Follow-up Visit",
  "School Eye Check-up",
  "Pre-operative Check-up",
  "Post-operative Review",
];
  const [complaint, setComplaint] = useState("");
  const [complaintSearch, setComplaintSearch] = useState("");
  const [showComplaintDropdown, setShowComplaintDropdown] =
    useState(false);

  const [historyNotes, setHistoryNotes] = useState("");
  const [historyModal, setHistoryModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState([]);

  // =========================================================
  // VISION
  // =========================================================
  const [odVision, setOdVision] = useState("");
  const [osVision, setOsVision] = useState("");
  const [odPH, setOdPH] = useState("");
  const [osPH, setOsPH] = useState("");

  const [visionModal, setVisionModal] = useState(false);
  const [activeVisionEye, setActiveVisionEye] = useState("");
  const [visionSearch, setVisionSearch] = useState("");

  // =========================================================
  // REFRACTION
  // =========================================================
  const [rightSph, setRightSph] = useState("");
  const [rightCyl, setRightCyl] = useState("");
  const [rightAxis, setRightAxis] = useState("");
  const [rightAdd, setRightAdd] = useState("");

  const [leftSph, setLeftSph] = useState("");
  const [leftCyl, setLeftCyl] = useState("");
  const [leftAxis, setLeftAxis] = useState("");
  const [leftAdd, setLeftAdd] = useState("");

  const [refractionModal, setRefractionModal] = useState(false);
  const [activeRefractionField, setActiveRefractionField] =
    useState("");
  const [refractionSearch, setRefractionSearch] = useState("");

  // =========================================================
  // OTHER
  // =========================================================
  const [pd, setPd] = useState("");
  const [lens, setLens] = useState("");
  const [odIOP, setOdIOP] = useState("");
  const [osIOP, setOsIOP] = useState("");

  // =========================================================
  // DIAGNOSIS
  // =========================================================
  const [diagnosisText, setDiagnosisText] = useState("");
  const [diagnosisModal, setDiagnosisModal] = useState(false);
  const [diagnosisSearch, setDiagnosisSearch] = useState("");
  const [selectedDiagnosis, setSelectedDiagnosis] = useState([]);
  const [selectedDiagnosisCategory, setSelectedDiagnosisCategory] =
    useState(null);

  // =========================================================
  // RX
  // =========================================================
  const [rx, setRx] = useState("");
  const [rxModal, setRxModal] = useState(false);
  const [rxText, setRxText] = useState("");
  const [selectedMedicines, setSelectedMedicines] = useState([]);

  // =========================================================
  // NOTES
  // =========================================================
  const [notes, setNotes] = useState("");
  const [nextReviewDate, setNextReviewDate] = useState("");

  const [saving, setSaving] = useState(false);

  // =========================================================
  // SAMPLE DATA
  // Replace these with your actual API data
  // =========================================================

const complaintSuggestions = complaintsList.filter((item) => {
  const search = complaintSearch.toLowerCase().trim();

  if (!search) {
    return false;
  }

  const firstWord = item.split(" ")[0].toLowerCase();

  return firstWord.startsWith(search);
});
const visionList = [
  "NPL",
  "PL + PR",
  "HM",
  "CF 1",
  "CF 2",
  "CF 3",
  "1/60",
  "2/60",
  "3/60",
  "4/60",
  "5/60",
  "6/60",
  "6/36",
  "6/24",
  "6/18",
  "6/12",
  "6/9",
  "6/6",
  "6/5",
];
const visionSuggestions = visionList.filter((item) => {
  const search = visionSearch.trim().toLowerCase();

  if (!search) {
    return true;
  }

  return item.toLowerCase().startsWith(search);
});

  const sphSuggestions = [
    "-10.00",
    "-9.50",
    "-9.00",
    "-8.50",
    "-8.00",
    "-7.50",
    "-7.00",
    "-6.50",
    "-6.00",
    "-5.50",
    "-5.00",
    "-4.50",
    "-4.00",
    "-3.50",
    "-3.00",
    "-2.50",
    "-2.00",
    "-1.50",
    "-1.00",
    "-0.50",
    "0.00",
    "+0.50",
    "+1.00",
    "+1.50",
    "+2.00",
    "+2.50",
    "+3.00",
    "+3.50",
    "+4.00",
    "+4.50",
    "+5.00",
    "+5.50",
    "+6.00",
    "+6.50",
    "+7.00",
    "+7.50",
    "+8.00",
    "+8.50",
    "+9.00",
    "+9.50",
    "+10.00",
  ];

  const cylSuggestions = [
    "-5.00",
    "-4.50",
    "-4.00",
    "-3.50",
    "-3.00",
    "-2.50",
    "-2.00",
    "-1.50",
    "-1.00",
    "-0.50",
    "0.00",
    "+0.50",
    "+1.00",
    "+1.50",
    "+2.00",
    "+2.50",
    "+3.00",
    "+3.50",
    "+4.00",
    "+4.50",
    "+5.00",
  ];

  const axisSuggestions = Array.from(
    { length: 180 },
    (_, index) => String(index + 1)
  );
/* =========================================================
   SPH LIST
========================================================= */

const generateSph = () => {
  const plus = [];
  const minus = [];

  const addValues = (start, end, step, target) => {
    for (let v = start; v <= end + 0.0001; v += step) {
      target.push(v.toFixed(2));
    }
  };

  // ±0.25 to ±5.00 in 0.25 steps
  addValues(0.25, 5.00, 0.25, plus);
  addValues(0.25, 5.00, 0.25, minus);

  // ±5.50 to ±10.00 in 0.50 steps
  addValues(5.50, 10.00, 0.50, plus);
  addValues(5.50, 10.00, 0.50, minus);

  // ±11.00 to ±20.00 in 1.00 steps
  addValues(11.00, 20.00, 1.00, plus);
  addValues(11.00, 20.00, 1.00, minus);

  return [
    ...plus.reverse().map((v) => `+${v}`),
    "0.00",
    ...minus.map((v) => `-${v}`),
  ];
};


/* =========================================================
   CYL LIST
========================================================= */

const generateCyl = () => {
  const plus = [];
  const minus = [];

  const addValues = (start, end, step, target) => {
    for (let v = start; v <= end + 0.0001; v += step) {
      target.push(v.toFixed(2));
    }
  };

  // ±0.25 to ±3.00 in 0.25 steps
  addValues(0.25, 3.00, 0.25, plus);
  addValues(0.25, 3.00, 0.25, minus);

  // ±3.50 to ±6.00 in 0.50 steps
  addValues(3.50, 6.00, 0.50, plus);
  addValues(3.50, 6.00, 0.50, minus);

  return [
    ...plus.reverse().map((v) => `+${v}`),
    "0.00",
    ...minus.map((v) => `-${v}`),
  ];
};

const sphList = generateSph();
const cylList = generateCyl();

const axisList = Array.from(
  { length: 180 },
  (_, index) => String(index + 1)
);


/* =========================================================
   SPH + / - CONTROL
========================================================= */

const changeSph = (value, type) => {
  let num = parseFloat(value) || 0;

  if (type === "plus") {
    if (Math.abs(num) < 5) {
      num += 0.25;
    } else if (Math.abs(num) < 10) {
      num += 0.50;
    } else {
      num += 1;
    }
  } else {
    if (Math.abs(num) <= 5) {
      num -= 0.25;
    } else if (Math.abs(num) <= 10) {
      num -= 0.50;
    } else {
      num -= 1;
    }
  }

  // Limits
  if (num > 20) num = 20;
  if (num < -20) num = -20;

  // Prevent floating point problems
  num = Math.round(num * 100) / 100;

  if (num > 0) {
    return `+${num.toFixed(2)}`;
  }

  if (num === 0) {
    return "0.00";
  }

  return num.toFixed(2);
};


/* =========================================================
   CYL + / - CONTROL
========================================================= */

const changeCyl = (value, type) => {
  let num = parseFloat(value) || 0;

  if (type === "plus") {
    if (Math.abs(num) < 3) {
      num += 0.25;
    } else {
      num += 0.50;
    }
  } else {
    if (Math.abs(num) <= 3) {
      num -= 0.25;
    } else {
      num -= 0.50;
    }
  }

  // Limits
  if (num > 6) num = 6;
  if (num < -6) num = -6;

  // Prevent floating point problems
  num = Math.round(num * 100) / 100;

  if (num > 0) {
    return `+${num.toFixed(2)}`;
  }

  if (num === 0) {
    return "0.00";
  }

  return num.toFixed(2);
};
  const historyCategories = {
    "General History": [
      "No significant history",
      "Diabetes",
      "Hypertension",
      "Thyroid disorder",
      "Asthma",
    ],
    "Ocular History": [
      "Previous eye surgery",
      "Cataract surgery",
      "Glaucoma",
      "Dry eye",
      "Previous eye injury",
    ],
    "Family History": [
      "Family history of glaucoma",
      "Family history of diabetes",
      "Family history of eye disease",
    ],
    "Medication History": [
      "Regular medication",
      "Eye drops",
      "Blood pressure medication",
      "Diabetes medication",
    ],
  };

  const diagnosisCategories = {
    "Refractive Errors": [
      "Myopia",
      "Hypermetropia",
      "Astigmatism",
      "Presbyopia",
      "Mixed Astigmatism",
    ],
    "Cataract": [
      "Immature Cataract",
      "Mature Cataract",
      "Nuclear Cataract",
      "Posterior Subcapsular Cataract",
    ],
    "Glaucoma": [
      "Primary Open Angle Glaucoma",
      "Ocular Hypertension",
      "Glaucoma Suspect",
    ],
    "Retina": [
      "Diabetic Retinopathy",
      "Macular Degeneration",
      "Retinal Detachment",
    ],
    "Other": [
      "Dry Eye",
      "Conjunctivitis",
      "Blepharitis",
      "Normal Eye Examination",
    ],
  };

  const medicines = [
    "Moxifloxacin Eye Drops",
    "Lubricating Eye Drops",
    "Timolol Eye Drops",
    "Olopatadine Eye Drops",
    "Ketorolac Eye Drops",
    "Atropine Eye Drops",
    "Tropicamide Eye Drops",
    "Artificial Tears",
  ];

  // =========================================================
  // HELPERS
  // =========================================================

  const openVisionModal = (eye) => {
    setActiveVisionEye(eye);
    setVisionSearch("");
    setVisionModal(true);
  };

  const selectVision = (value) => {
    if (activeVisionEye === "OD") {
      setOdVision(value);
    } else {
      setOsVision(value);
    }

    setVisionModal(false);
  };

  const openRefraction = (field) => {
    setActiveRefractionField(field);
    setRefractionSearch("");
    setRefractionModal(true);
  };

  const handleRefractionSelect = (field, value) => {
    switch (field) {
      case "rightSph":
        setRightSph(value);
        break;

      case "rightCyl":
        setRightCyl(value);

        if (
          value === "0.00" ||
          value === "+0.00" ||
          value === "-0.00"
        ) {
          setRightAxis("");
        }

        break;

      case "rightAxis":
        setRightAxis(value);
        break;

      case "leftSph":
        setLeftSph(value);
        break;

      case "leftCyl":
        setLeftCyl(value);

        if (
          value === "0.00" ||
          value === "+0.00" ||
          value === "-0.00"
        ) {
          setLeftAxis("");
        }

        break;

      case "leftAxis":
        setLeftAxis(value);
        break;

      default:
        break;
    }

    setRefractionModal(false);
  };
const axisDisabled = (cyl) => {
  return !cyl || cyl.trim() === "";
};

  const handleAxisChange = (value, setter) => {
    let cleaned = value.replace(/[^0-9]/g, "");

    if (cleaned.length > 3) {
      cleaned = cleaned.slice(0, 3);
    }

    if (cleaned !== "") {
      const number = Number(cleaned);

      if (number > 180) {
        cleaned = "180";
      }
    }

    setter(cleaned);
  };

  const toggleHistory = (item) => {
    setSelectedHistory((current) =>
      current.includes(item)
        ? current.filter((x) => x !== item)
        : [...current, item]
    );
  };

const saveHistorySelection = () => {
  selectedHistory.forEach((item) => {
    setHistoryNotes((prev) => {
      const current = prev.trim();

      if (!current) {
        return item;
      }

      // Avoid adding the same history twice
      const alreadyExists = current
        .split(",")
        .some(
          (x) =>
            x.trim().toLowerCase() ===
            item.trim().toLowerCase()
        );

      if (alreadyExists) {
        return current;
      }

      return `${current}, ${item}`;
    });
  });

  setHistoryModal(false);
};

  const toggleDiagnosis = (item) => {
    setSelectedDiagnosis((current) =>
      current.includes(item)
        ? current.filter((x) => x !== item)
        : [...current, item]
    );
  };

  const saveDiagnosisSelection = () => {
  const selectedText = selectedDiagnosis.join(", ").trim();

  if (!selectedText) {
    setDiagnosisModal(false);
    return;
  }

  setDiagnosisText((prev) => {
    const current = prev.trim();

    if (!current) {
      return selectedText;
    }

    return `${current}, ${selectedText}`;
  });

  setDiagnosisModal(false);
};

  const addMedicine = (item) => {
    if (selectedMedicines.includes(item)) {
      return;
    }

    const updated = [...selectedMedicines, item];

    setSelectedMedicines(updated);

    setRx((current) => {
      const currentText = current.trim();

      if (!currentText) {
        return item;
      }

      const exists = currentText
        .split("\n")
        .some(
          (line) =>
            line.trim().toLowerCase() ===
            item.trim().toLowerCase()
        );

      if (exists) {
        return currentText;
      }

      return `${currentText}\n${item}`;
    });

    setRxText("");
  };

  // =========================================================
  // SAVE
  // =========================================================

 const saveExam = async () => {
  try {
    setSaving(true);

    const data = {
      // =====================================================
      // ROLE
      // =====================================================
      role: "super_admin",
      storeCode: null,

      // =====================================================
      // PATIENT
      // =====================================================
      patient_name: patient,
      patient_id: patientId,
      mobile_number: mobileNumber,
      age: patientAge,
      gender: patientGender,

      // =====================================================
      // COMPLAINT / HISTORY
      // =====================================================
      complaint,
      history_notes: historyNotes,

      // =====================================================
      // VISION
      // =====================================================
      od_vision: odVision,
      od_ph: odPH,

      os_vision: osVision,
      os_ph: osPH,

      // =====================================================
      // RIGHT EYE REFRACTION
      // =====================================================
      right_sph: rightSph,
      right_cyl: rightCyl,
      right_axis: rightAxis,

      // =====================================================
      // LEFT EYE REFRACTION
      // =====================================================
      left_sph: leftSph,
      left_cyl: leftCyl,
      left_axis: leftAxis,

      // =====================================================
      // OTHER
      // =====================================================
      pd,

      od_iop: odIOP,
      os_iop: osIOP,

      // =====================================================
      // DIAGNOSIS
      // =====================================================
      diagnosis: diagnosisText || selectedDiagnosis?.join(", "),

      // =====================================================
      // RX / NOTES
      // =====================================================
      rx,
      notes,

      // =====================================================
      // FOLLOW UP
      // =====================================================
      next_review_date: nextReviewDate,
    };

    console.log("EXAM DATA:", data);

    const response = await fetch(
      "https://visiontrackdatabase.onrender.com/eyeexam/add",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    console.log("SAVE EXAM RESPONSE:", result);

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Failed to save examination"
      );
    }

    alert("Eye examination saved successfully.");

  } catch (error) {
    console.error("SAVE EXAM ERROR:", error);

    alert(
      error.message ||
      "Unable to save examination."
    );

  } finally {
    setSaving(false);
  }
};

  // =========================================================
  // PRINT
  // =========================================================

  const printExam = () => {
    window.print();
  };

  // =========================================================
  // WHATSAPP
  // =========================================================

  const openWhatsApp = () => {
    if (!mobileNumber) {
      alert("Please enter patient mobile number.");
      return;
    }

    const message = `
Eye Examination

Patient: ${patient}
Patient ID: ${patientId}

OD Vision: ${odVision || "-"}
OS Vision: ${osVision || "-"}

OD SPH: ${rightSph || "-"}
OD CYL: ${rightCyl || "-"}
OD AXIS: ${rightAxis || "-"}
OD ADD: ${rightAdd || "-"}

OS SPH: ${leftSph || "-"}
OS CYL: ${leftCyl || "-"}
OS AXIS: ${leftAxis || "-"}
OS ADD: ${leftAdd || "-"}

PD: ${pd || "-"}
Lens: ${lens || "-"}

Diagnosis: ${diagnosisText || "-"}

Next Review: ${nextReviewDate || "-"}
`;

    const phone = mobileNumber.replace(/\D/g, "");

    window.open(
      `https://wa.me/91${phone}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };

  return (
    <div className="eye-exam-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="exam-header">

        <button
          className="back-button"
          onClick={() => window.history.back()}
        >
          ←
        </button>

        <div>
          <h1>New Eye Examination</h1>
          <p>Create patient vision prescription</p>
        </div>

      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="exam-container">

        <div className="exam-card">

          {/* =================================================
              PATIENT DETAILS
          ================================================= */}

          <SectionTitle title="Patient Details" />

          <div className="form-grid form-grid-2">

            <Field label="Patient Name">
              <input
                value={patient}
                onChange={(e) =>
                  setPatient(e.target.value)
                }
                placeholder="Patient name"
              />
            </Field>

            <Field label="Patient ID">
              <input
                value={patientId}
                onChange={(e) =>
                  setPatientId(e.target.value)
                }
                placeholder="Patient ID"
              />
            </Field>

          </div>

          <div className="form-grid form-grid-3">

            <Field label="Mobile Number">
              <input
                value={mobileNumber}
                onChange={(e) =>
                  setMobileNumber(
                    e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 10)
                  )
                }
                placeholder="10-digit mobile"
                inputMode="numeric"
              />
            </Field>

            <Field label="Age">
              <input
                value={patientAge}
                onChange={(e) =>
                  setPatientAge(
                    e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 3)
                  )
                }
                placeholder="Age"
                inputMode="numeric"
              />
            </Field>

            <Field label="Gender">
              <input
                value={patientGender}
                onChange={(e) =>
                  setPatientGender(e.target.value)
                }
                placeholder="Gender"
              />
            </Field>

          </div>

          <Field label="Address">
            <input
              value={patientAddress}
              onChange={(e) =>
                setPatientAddress(e.target.value)
              }
              placeholder="Address"
            />
          </Field>
{/* =================================================
    COMPLAINT
================================================= */}

<div className="section-spacing">

  <Field label="C/O (Chief Complaint)">

    <div
      className={`input-with-button ${
        showComplaintDropdown
          ? "complaint-dropdown-active"
          : ""
      }`}
    >

      {/* =================================================
          MANUAL INPUT
      ================================================= */}

      <input
        type="text"
        value={complaint}
        onChange={(e) => {
          const value = e.target.value;

          // Manual typing
          setComplaint(value);

          // Keep search text in sync
          setComplaintSearch(value);

          // IMPORTANT:
          // Do NOT open dropdown while typing
          setShowComplaintDropdown(false);
        }}
        placeholder="Enter complaint"
        autoComplete="off"
      />

      {/* =================================================
          SMALL SEARCH BUTTON
      ================================================= */}

      <button
        type="button"
        className="complaint-search-btn"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          // Open search dropdown only when button is clicked
          setShowComplaintDropdown(true);
        }}
        title="Search complaints"
      >
        🔍
      </button>


      {/* =================================================
          COMPLAINT SEARCH DROPDOWN
      ================================================= */}

      {showComplaintDropdown && (
        <div className="dropdown">

          {/* SEARCH INSIDE DROPDOWN */}

          <div className="complaint-dropdown-search">

            <input
              type="text"
              value={complaintSearch}
              onChange={(e) => {
                setComplaintSearch(e.target.value);
              }}
              placeholder="Search complaints..."
              autoFocus
              autoComplete="off"
            />

          </div>


          {/* =================================================
              RESULTS
          ================================================= */}

          {complaintsList
            .filter((item) => {

              const search =
                complaintSearch
                  .toLowerCase()
                  .trim();

              // Empty search = show all
              if (!search) {
                return true;
              }

              return item
                .toLowerCase()
                .includes(search);
            })
            .map((item) => (

              <button
                type="button"
                className="dropdown-item"
                key={item}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {

                  // Selected complaint
                  setComplaint(item);
                  setComplaintSearch(item);

                  // Close dropdown
                  setShowComplaintDropdown(false);
                }}
              >
                {item}
              </button>

            ))}


          {/* =================================================
              NO RESULTS
          ================================================= */}

          {complaintsList.filter((item) => {

            const search =
              complaintSearch
                .toLowerCase()
                .trim();

            if (!search) {
              return false;
            }

            return item
              .toLowerCase()
              .includes(search);

          }).length === 0 && (

            <div className="dropdown-no-results">
              No matching complaints
            </div>

          )}

        </div>
      )}

    </div>

  </Field>

</div>
          {/* =================================================
              HISTORY
          ================================================= */}

      {/* =================================================
    HISTORY
================================================= */}

<Field label="H/O (History)">

  <div className="input-with-button">

    {/* MANUAL TYPING */}

    <textarea
      value={historyNotes}
      onChange={(e) => {
        setHistoryNotes(e.target.value);
      }}
      placeholder="Enter history"
    />

    {/* SMALL DROPDOWN BUTTON */}

    <button
      type="button"
      className="history-dropdown-btn"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        setHistoryModal(true);
      }}
      title="Select history"
    >
      ▼
    </button>

  </div>

</Field>

          {/* =================================================
              VISION
          ================================================= */}

          <SectionTitle title="Vision" />

          <div className="vision-grid">

            {/* OD */}

            <div className="eye-box">

              <div className="eye-heading">
                <span className="eye-badge">OD</span>
                <strong>Right Eye</strong>
              </div>

              <label>Vision</label>

              <div className="input-with-button">

                <input
                  value={odVision}
                  onChange={(e) =>
                    setOdVision(e.target.value)
                  }
                  placeholder="Type Vision"
                />

                <button
                  type="button"
                  onClick={() =>
                    openVisionModal("OD")
                  }
                >
                  ▼
                </button>

              </div>

              <label>PH</label>

              <input
                value={odPH}
                onChange={(e) =>
                  setOdPH(e.target.value)
                }
                placeholder="PH"
              />

            </div>

            {/* OS */}

            <div className="eye-box">

              <div className="eye-heading">
                <span className="eye-badge">OS</span>
                <strong>Left Eye</strong>
              </div>

              <label>Vision</label>

              <div className="input-with-button">

                <input
                  value={osVision}
                  onChange={(e) =>
                    setOsVision(e.target.value)
                  }
                  placeholder="Type Vision"
                />

                <button
                  type="button"
                  onClick={() =>
                    openVisionModal("OS")
                  }
                >
                  ▼
                </button>

              </div>

              <label>PH</label>

              <input
                value={osPH}
                onChange={(e) =>
                  setOsPH(e.target.value)
                }
                placeholder="PH"
              />

            </div>

          </div>
{/* =================================================
    REFRACTION
================================================= */}

<SectionTitle title="Refraction" />

{/* =================================================
    OD — RIGHT EYE
================================================= */}

<div className="refraction-section">

  <div className="refraction-title">
    OD — (Right Eye)
  </div>

  <div className="refraction-grid">

    {/* =================================================
        SPH - RIGHT EYE
    ================================================= */}

    <div className="refraction-field">

      <label>SPH</label>

      <div className="refraction-control-with-signs">

        {/* MINUS */}
       <button
  type="button"
  className="sign-button"
  onClick={() => {
    setRightSph(changeSph(rightSph, "minus"));
  }}
>
  −
</button>
        {/* INPUT + DROPDOWN */}
        <div className="refraction-input-wrapper">

          <input
            type="text"
            value={rightSph}
            onChange={(e) => {

              let value = e.target.value;

              value = value.replace(
                /[^0-9.+-]/g,
                ""
              );

              if (value.length > 0) {

                const firstCharacter =
                  value.charAt(0);

                if (
                  firstCharacter === "+" ||
                  firstCharacter === "-"
                ) {

                  value =
                    firstCharacter +
                    value
                      .slice(1)
                      .replace(/[+-]/g, "");

                } else {

                  value =
                    value.replace(/[+-]/g, "");

                }

              }

              const decimalParts =
                value.split(".");

              if (decimalParts.length > 2) {

                value =
                  decimalParts[0] +
                  "." +
                  decimalParts
                    .slice(1)
                    .join("");

              }

              if (
                decimalParts[1] &&
                decimalParts[1].length > 2
              ) {

                value =
                  decimalParts[0] +
                  "." +
                  decimalParts[1].slice(0, 2);

              }

              setRightSph(value);

            }}
            placeholder="0.00"
          />

          <button
            type="button"
            className="dropdown-inside-button"
            onClick={() =>
              openRefraction("rightSph")
            }
          >
            ▼
          </button>

        </div>

        {/* PLUS */}
       <button
  type="button"
  className="sign-button"
  onClick={() => {
    setRightSph(changeSph(rightSph, "plus"));
  }}
>
  +
</button>

      </div>

    </div>


    {/* =================================================
        CYL - RIGHT EYE
    ================================================= */}

    <div className="refraction-field">

      <label>CYL</label>

      <div className="refraction-control-with-signs">

        {/* MINUS */}
       <button
  type="button"
  className="sign-button"
  onClick={() => {
    const newValue = changeCyl(rightCyl, "minus");

    setRightCyl(newValue);

    if (
      newValue === "0.00" ||
      newValue === "+0.00" ||
      newValue === "-0.00"
    ) {
      setRightAxis("");
    }
  }}
>
  −
</button>

        {/* INPUT + DROPDOWN */}
        <div className="refraction-input-wrapper">

          <input
            type="text"
            value={rightCyl}
            onChange={(e) => {

              let value = e.target.value;

              value = value.replace(
                /[^0-9.+-]/g,
                ""
              );

              if (value.length > 0) {

                const firstCharacter =
                  value.charAt(0);

                if (
                  firstCharacter === "+" ||
                  firstCharacter === "-"
                ) {

                  value =
                    firstCharacter +
                    value
                      .slice(1)
                      .replace(/[+-]/g, "");

                } else {

                  value =
                    value.replace(/[+-]/g, "");

                }

              }

              const decimalParts =
                value.split(".");

              if (decimalParts.length > 2) {

                value =
                  decimalParts[0] +
                  "." +
                  decimalParts
                    .slice(1)
                    .join("");

              }

              if (
                decimalParts[1] &&
                decimalParts[1].length > 2
              ) {

                value =
                  decimalParts[0] +
                  "." +
                  decimalParts[1].slice(0, 2);

              }

              setRightCyl(value);

              if (
                value === "0.00" ||
                value === "+0.00" ||
                value === "-0.00"
              ) {

                setRightAxis("");

              }

            }}
            placeholder="0.00"
          />

          <button
            type="button"
            className="dropdown-inside-button"
            onClick={() =>
              openRefraction("rightCyl")
            }
          >
            ▼
          </button>

        </div>

        {/* PLUS */}
       <button
  type="button"
  className="sign-button"
  onClick={() => {
    const newValue = changeCyl(rightCyl, "plus");

    setRightCyl(newValue);

    if (
      newValue === "0.00" ||
      newValue === "+0.00" ||
      newValue === "-0.00"
    ) {
      setRightAxis("");
    }
  }}
>
  +
</button>
      </div>

    </div>


    {/* =================================================
        AXIS - RIGHT EYE
    ================================================= */}

    <div className="refraction-field">

      <label>AXIS</label>

      <div
        className={
          axisDisabled(rightCyl)
            ? "refraction-control axis-disabled"
            : "refraction-control"
        }
      >

        <input
          type="text"
          value={rightAxis}
          onChange={(e) => {

            let cleaned =
              e.target.value.replace(
                /[^0-9]/g,
                ""
              );

            if (cleaned.length > 3) {
              cleaned =
                cleaned.slice(0, 3);
            }

            if (cleaned !== "") {

              const numericValue =
                Number(cleaned);

              if (numericValue > 180) {
                cleaned = "180";
              }

            }

            setRightAxis(cleaned);

          }}
          placeholder="0–180"
          inputMode="numeric"
          disabled={axisDisabled(rightCyl)}
          className={
            axisDisabled(rightCyl)
              ? "disabled-input"
              : ""
          }
        />

        <button
          type="button"
          className="dropdown-inside-button"
          disabled={axisDisabled(rightCyl)}
          onClick={() =>
            openRefraction("rightAxis")
          }
          title="Select AXIS"
        >
          ▼
        </button>

      </div>

    </div>


    {/* =================================================
        ADD - RIGHT EYE
    ================================================= */}

    <div className="refraction-field">

      <label>ADD</label>

      <input
        type="text"
        value={rightAdd}
        onChange={(e) => {

          let value = e.target.value;

          value = value.replace(
            /[^0-9.+-]/g,
            ""
          );

          if (value.length > 0) {

            const firstCharacter =
              value.charAt(0);

            if (
              firstCharacter === "+" ||
              firstCharacter === "-"
            ) {

              value =
                firstCharacter +
                value
                  .slice(1)
                  .replace(/[+-]/g, "");

            } else {

              value =
                value.replace(/[+-]/g, "");

            }

          }

          const decimalParts =
            value.split(".");

          if (decimalParts.length > 2) {

            value =
              decimalParts[0] +
              "." +
              decimalParts
                .slice(1)
                .join("");

          }

          if (
            decimalParts[1] &&
            decimalParts[1].length > 2
          ) {

            value =
              decimalParts[0] +
              "." +
              decimalParts[1].slice(0, 2);

          }

          setRightAdd(value);

        }}
        placeholder="+2.00 / -2.00"
      />

    </div>

  </div>

</div>


{/* =================================================
    OS — LEFT EYE
================================================= */}

<div className="refraction-section">

  <div className="refraction-title">
    OS — (Left Eye)
  </div>

  <div className="refraction-grid">

    {/* =================================================
        SPH - LEFT EYE
    ================================================= */}

    <div className="refraction-field">

      <label>SPH</label>

      <div className="refraction-control-with-signs">

        {/* MINUS */}
      <button
  type="button"
  className="sign-button"
  onClick={() => {
    setLeftSph(changeSph(leftSph, "minus"));
  }}
>
  −
</button>

        {/* INPUT + DROPDOWN */}
        <div className="refraction-input-wrapper">

          <input
            type="text"
            value={leftSph}
            onChange={(e) => {

              let value = e.target.value;

              value = value.replace(
                /[^0-9.+-]/g,
                ""
              );

              if (value.length > 0) {

                const firstCharacter =
                  value.charAt(0);

                if (
                  firstCharacter === "+" ||
                  firstCharacter === "-"
                ) {

                  value =
                    firstCharacter +
                    value
                      .slice(1)
                      .replace(/[+-]/g, "");

                } else {

                  value =
                    value.replace(/[+-]/g, "");

                }

              }

              const decimalParts =
                value.split(".");

              if (decimalParts.length > 2) {

                value =
                  decimalParts[0] +
                  "." +
                  decimalParts
                    .slice(1)
                    .join("");

              }

              if (
                decimalParts[1] &&
                decimalParts[1].length > 2
              ) {

                value =
                  decimalParts[0] +
                  "." +
                  decimalParts[1].slice(0, 2);

              }

              setLeftSph(value);

            }}
            placeholder="0.00"
          />

          <button
            type="button"
            className="dropdown-inside-button"
            onClick={() =>
              openRefraction("leftSph")
            }
          >
            ▼
          </button>

        </div>

        {/* PLUS */}
      <button
  type="button"
  className="sign-button"
  onClick={() => {
    setLeftSph(changeSph(leftSph, "plus"));
  }}
>
  +
</button>

      </div>

    </div>


    {/* =================================================
        CYL - LEFT EYE
    ================================================= */}

    <div className="refraction-field">

      <label>CYL</label>

      <div className="refraction-control-with-signs">

        {/* MINUS */}
       <button
  type="button"
  className="sign-button"
  onClick={() => {
    const newValue = changeCyl(leftCyl, "minus");

    setLeftCyl(newValue);

    if (
      newValue === "0.00" ||
      newValue === "+0.00" ||
      newValue === "-0.00"
    ) {
      setLeftAxis("");
    }
  }}
>
  −
</button>

        {/* INPUT + DROPDOWN */}
        <div className="refraction-input-wrapper">

          <input
            type="text"
            value={leftCyl}
            onChange={(e) => {

              let value = e.target.value;

              value = value.replace(
                /[^0-9.+-]/g,
                ""
              );

              if (value.length > 0) {

                const firstCharacter =
                  value.charAt(0);

                if (
                  firstCharacter === "+" ||
                  firstCharacter === "-"
                ) {

                  value =
                    firstCharacter +
                    value
                      .slice(1)
                      .replace(/[+-]/g, "");

                } else {

                  value =
                    value.replace(/[+-]/g, "");

                }

              }

              const decimalParts =
                value.split(".");

              if (decimalParts.length > 2) {

                value =
                  decimalParts[0] +
                  "." +
                  decimalParts
                    .slice(1)
                    .join("");

              }

              if (
                decimalParts[1] &&
                decimalParts[1].length > 2
              ) {

                value =
                  decimalParts[0] +
                  "." +
                  decimalParts[1].slice(0, 2);

              }

              setLeftCyl(value);

              if (
                value === "0.00" ||
                value === "+0.00" ||
                value === "-0.00"
              ) {

                setLeftAxis("");

              }

            }}
            placeholder="0.00"
          />

          <button
            type="button"
            className="dropdown-inside-button"
            onClick={() =>
              openRefraction("leftCyl")
            }
          >
            ▼
          </button>

        </div>

        {/* PLUS */}
        <button
  type="button"
  className="sign-button"
  onClick={() => {
    const newValue = changeCyl(leftCyl, "plus");

    setLeftCyl(newValue);

    if (
      newValue === "0.00" ||
      newValue === "+0.00" ||
      newValue === "-0.00"
    ) {
      setLeftAxis("");
    }
  }}
>
  +
</button>

      </div>

    </div>


    {/* =================================================
        AXIS - LEFT EYE
    ================================================= */}

    <div className="refraction-field">

      <label>AXIS</label>

      <div
        className={
          axisDisabled(leftCyl)
            ? "refraction-control axis-disabled"
            : "refraction-control"
        }
      >

        <input
          type="text"
          value={leftAxis}
          onChange={(e) => {

            let cleaned =
              e.target.value.replace(
                /[^0-9]/g,
                ""
              );

            if (cleaned.length > 3) {
              cleaned =
                cleaned.slice(0, 3);
            }

            if (cleaned !== "") {

              const numericValue =
                Number(cleaned);

              if (numericValue > 180) {
                cleaned = "180";
              }

            }

            setLeftAxis(cleaned);

          }}
          placeholder="0–180"
          inputMode="numeric"
          disabled={axisDisabled(leftCyl)}
          className={
            axisDisabled(leftCyl)
              ? "disabled-input"
              : ""
          }
        />

        <button
          type="button"
          className="dropdown-inside-button"
          disabled={axisDisabled(leftCyl)}
          onClick={() =>
            openRefraction("leftAxis")
          }
          title="Select AXIS"
        >
          ▼
        </button>

      </div>

    </div>


    {/* =================================================
        ADD - LEFT EYE
    ================================================= */}

    <div className="refraction-field">

      <label>ADD</label>

      <input
        type="text"
        value={leftAdd}
        onChange={(e) => {

          let value = e.target.value;

          value = value.replace(
            /[^0-9.+-]/g,
            ""
          );

          if (value.length > 0) {

            const firstCharacter =
              value.charAt(0);

            if (
              firstCharacter === "+" ||
              firstCharacter === "-"
            ) {

              value =
                firstCharacter +
                value
                  .slice(1)
                  .replace(/[+-]/g, "");

            } else {

              value =
                value.replace(/[+-]/g, "");

            }

          }

          const decimalParts =
            value.split(".");

          if (decimalParts.length > 2) {

            value =
              decimalParts[0] +
              "." +
              decimalParts
                .slice(1)
                .join("");

          }

          if (
            decimalParts[1] &&
            decimalParts[1].length > 2
          ) {

            value =
              decimalParts[0] +
              "." +
              decimalParts[1].slice(0, 2);

          }

          setLeftAdd(value);

        }}
        placeholder="+2.00 / -2.00"
      />

    </div>

  </div>

</div>
          {/* =================================================
              OTHER MEASUREMENTS
          ================================================= */}

          <SectionTitle title="Other Measurements" />

          <Field label="P.D (Pupillary Distance)">
            <input
              value={pd}
              onChange={(e) =>
                setPd(
                  e.target.value.replace(/[^0-9]/g, "")
                )
              }
              placeholder="Enter P.D"
              inputMode="numeric"
            />
          </Field>

          <Field label="Lens">
            <input
              value={lens}
              onChange={(e) =>
                setLens(e.target.value)
              }
              placeholder="Enter Lens type (e.g., Progressive, Single Vision)"
            />
          </Field>

          <div className="form-grid form-grid-2">

            <Field label="IOP OD (mmHg)">
              <input
                value={odIOP}
                onChange={(e) =>
                  setOdIOP(e.target.value)
                }
                placeholder="OD IOP"
                inputMode="decimal"
              />
            </Field>

            <Field label="IOP OS (mmHg)">
              <input
                value={osIOP}
                onChange={(e) =>
                  setOsIOP(e.target.value)
                }
                placeholder="OS IOP"
                inputMode="decimal"
              />
            </Field>

          </div>

          {/* =================================================
              DIAGNOSIS
          ================================================= */}

          <SectionTitle title="Diagnosis" />

          <div className="input-with-button">

            <textarea
              value={diagnosisText}
              onChange={(e) =>
                setDiagnosisText(e.target.value)
              }
              placeholder="Type Diagnosis"
            />

            <button
              type="button"
              onClick={() =>
                setDiagnosisModal(true)
              }
            >
              ▼
            </button>

          </div>

          {/* =================================================
              RX
          ================================================= */}

          <SectionTitle title="Rx / Dosage / Frequency" />

          <div className="rx-wrapper">

            <textarea
              value={rx}
              onChange={(e) =>
                setRx(e.target.value)
              }
              placeholder="Type medicine / dosage / frequency..."
            />

            <div className="rx-actions">

              {(rx || selectedMedicines.length > 0) && (
                <button
                  type="button"
                  className="clear-button"
                  onClick={() => {
                    setRx("");
                    setSelectedMedicines([]);
                    setRxText("");
                  }}
                >
                  ✕
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setRxText("");
                  setRxModal(true);
                }}
              >
                ▼
              </button>

            </div>

          </div>

          {/* =================================================
              CLINICAL NOTES
          ================================================= */}

          <SectionTitle title="Clinical Notes" />

          <textarea
            className="large-textarea"
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            placeholder="Clinical notes"
          />

          {/* =================================================
              REVIEW DATE
          ================================================= */}

          <SectionTitle title="Next Review Date" />

          <input
            value={nextReviewDate}
            onChange={(e) =>
              setNextReviewDate(e.target.value)
            }
            placeholder="DD/MM/YYYY"
            className="date-input"
          />

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="button-row">

            <button
              className="save-button"
              disabled={saving}
              onClick={saveExam}
            >
              💾 {saving ? "SAVING..." : "SAVE"}
            </button>

            <button
              className="print-button"
              onClick={printExam}
            >
              🖨 PRINT
            </button>

            <button
              className="whatsapp-button"
              onClick={openWhatsApp}
            >
              WhatsApp
            </button>

          </div>

        </div>

        {/* =====================================================
            PREVIOUS HISTORY
        ===================================================== */}

        {patientId && (
          <div className="history-section">

            <div className="history-section-header">

              <div>
                <h2>Previous Eye Examination History</h2>

                <p>
                  Previous visits for{" "}
                  {patient || "selected patient"}
                </p>
              </div>

              <span className="history-count">
                0
              </span>

            </div>

            <div className="empty-history">

              <div className="empty-icon">
                👁
              </div>

              <h3>
                No previous eye examinations
              </h3>

              <p>
                This patient has no previous examination
                records.
              </p>

            </div>

          </div>
        )}

      </div>
{/* =====================================================
    VISION MODAL
===================================================== */}

{visionModal && (
  <Modal
    title={`Select ${activeVisionEye} Vision`}
    close={() => setVisionModal(false)}
  >

    <input
      className="modal-search"
      type="text"
      value={visionSearch}
      onChange={(e) => {
        setVisionSearch(e.target.value);
      }}
      placeholder="Search vision..."
      autoComplete="off"
      autoFocus
    />

    <div className="modal-list">

      {visionSuggestions.length > 0 ? (

        visionSuggestions.map((item) => (
          <button
            type="button"
            className="modal-item"
            key={item}
            onClick={() => selectVision(item)}
          >
            {item}
          </button>
        ))

      ) : (

        <div className="dropdown-no-results">
          No matching vision
        </div>

      )}

    </div>

  </Modal>
)}

      {/* =====================================================
          REFRACTION MODAL
      ===================================================== */}

      {refractionModal && (
        <Modal
          title={getRefractionTitle(
            activeRefractionField
          )}
          close={() => setRefractionModal(false)}
        >

          <input
            className="modal-search"
            value={refractionSearch}
            onChange={(e) =>
              setRefractionSearch(e.target.value)
            }
            placeholder={
              activeRefractionField.includes("Axis")
                ? "Type AXIS or search 1-180"
                : "Search value"
            }
          />

          <div className="modal-list">

            {(activeRefractionField.includes(
              "Axis"
            )
              ? axisSuggestions
              : activeRefractionField.includes("Sph")
              ? sphSuggestions
              : cylSuggestions
            )
              .filter((item) =>
                item
                  .toLowerCase()
                  .includes(
                    refractionSearch.toLowerCase()
                  )
              )
              .map((item) => (
                <button
                  className="modal-item"
                  key={item}
                  onClick={() =>
                    handleRefractionSelect(
                      activeRefractionField,
                      item
                    )
                  }
                >
                  {item}
                </button>
              ))}

          </div>

        </Modal>
      )}

      {/* =====================================================
          HISTORY MODAL
      ===================================================== */}

      {historyModal && (
        <Modal
          title="Select History"
          close={() => setHistoryModal(false)}
        >

          <div className="modal-list">

            {Object.entries(historyCategories).map(
              ([category, items]) => (
                <div
                  className="history-category"
                  key={category}
                >

                  <h4>{category}</h4>

                  {items.map((item) => (
                    <label
                      className="checkbox-item"
                      key={item}
                    >
                      <input
                        type="checkbox"
                        checked={selectedHistory.includes(
                          item
                        )}
                        onChange={() =>
                          toggleHistory(item)
                        }
                      />

                      <span>{item}</span>
                    </label>
                  ))}

                </div>
              )
            )}

          </div>

          <button
            className="modal-done-button"
            onClick={saveHistorySelection}
          >
            DONE
          </button>

        </Modal>
      )}

      {/* =====================================================
          DIAGNOSIS MODAL
      ===================================================== */}

      {diagnosisModal && (
        <Modal
          title="Select Diagnosis"
          close={() => setDiagnosisModal(false)}
        >

          <input
            className="modal-search"
            value={diagnosisSearch}
            onChange={(e) =>
              setDiagnosisSearch(e.target.value)
            }
            placeholder="Search diagnosis"
          />

          <div className="modal-list">

            {Object.entries(diagnosisCategories).map(
              ([category, items]) => {

                const filteredItems = items.filter(
                  (item) =>
                    item
                      .toLowerCase()
                      .includes(
                        diagnosisSearch
                          .toLowerCase()
                      )
                );

                if (!filteredItems.length) {
                  return null;
                }

                return (
                  <div
                    className="history-category"
                    key={category}
                  >

                    <h4>{category}</h4>

                    {filteredItems.map((item) => {

                      const checked =
                        selectedDiagnosis.includes(
                          item
                        );

                      return (
                        <label
                          className={`checkbox-item ${
                            checked
                              ? "selected-item"
                              : ""
                          }`}
                          key={item}
                        >

                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              toggleDiagnosis(item)
                            }
                          />

                          <span>{item}</span>

                        </label>
                      );
                    })}

                  </div>
                );
              }
            )}

          </div>

          {selectedDiagnosis.length > 0 && (
            <div className="selected-box">

              <strong>
                Selected Diagnosis
              </strong>

              <p>
                {selectedDiagnosis.join(", ")}
              </p>

            </div>
          )}

          <button
            className="modal-done-button"
            onClick={saveDiagnosisSelection}
          >
            DONE
          </button>

        </Modal>
      )}

      {/* =====================================================
          RX MODAL
      ===================================================== */}

      {rxModal && (
        <Modal
          title="Select Medicine / Rx"
          close={() => setRxModal(false)}
        >

          <input
            className="modal-search"
            value={rxText}
            onChange={(e) =>
              setRxText(e.target.value)
            }
            placeholder="Search medicine..."
          />

          <div className="modal-list">

            {medicines
              .filter((item) =>
                item
                  .toLowerCase()
                  .includes(
                    rxText.toLowerCase()
                  )
              )
              .map((item) => {

                const selected =
                  selectedMedicines.includes(item);

                return (
                  <button
                    className={`modal-item ${
                      selected
                        ? "selected-medicine"
                        : ""
                    }`}
                    key={item}
                    onClick={() =>
                      addMedicine(item)
                    }
                  >

                    <span>{item}</span>

                    {selected && (
                      <span>✓</span>
                    )}

                  </button>
                );
              })}

          </div>

          {(rx || selectedMedicines.length > 0) && (
            <button
              className="clear-rx-modal"
              onClick={() => {
                setRx("");
                setSelectedMedicines([]);
                setRxText("");
              }}
            >
              Clear Rx
            </button>
          )}

        </Modal>
      )}

      {/* =====================================================
          CSS
      ===================================================== */}

     <style>{`

/* =========================================================
   GLOBAL RESET
========================================================= */

* {
  box-sizing: border-box;
}

html,
body,
#root {
  margin: 0;
  padding: 0;
  min-height: 100%;
}

body {
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Helvetica,
    Arial,
    sans-serif;

  background: #f4f7fb;
  color: #172033;

  overflow-x: hidden;
}

button,
input,
textarea {
  font-family: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
}


/* =========================================================
   PAGE
========================================================= */

.eye-exam-page {
  min-height: 100vh;
  width: 100%;
  background:
    linear-gradient(
      180deg,
      #f3f7fc 0%,
      #f8fafc 45%,
      #f4f7fb 100%
    );

  overflow-x: hidden;
}


/* =========================================================
   HEADER
========================================================= */

.exam-header {
  width: 100%;
  min-height: 78px;

  background:
    linear-gradient(
      135deg,
      #0047ab 0%,
      #075fc5 55%,
      #0a68d1 100%
    );

  color: white;

  display: flex;
  align-items: center;

  gap: 15px;

  padding: 14px 32px;

  box-shadow:
    0 4px 18px rgba(0, 71, 171, 0.18);

  position: relative;
  z-index: 10;
}

.exam-header::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  height: 1px;

  background: rgba(255,255,255,0.18);
}

.exam-header h1 {
  margin: 0;

  font-size: 21px;
  line-height: 1.2;
  font-weight: 750;

  letter-spacing: -0.2px;
}

.exam-header p {
  margin: 5px 0 0;

  font-size: 12px;
  line-height: 1.4;

  color: #dbeafe;
}

.back-button {
  width: 40px;
  height: 40px;

  flex-shrink: 0;

  border: 1px solid rgba(255,255,255,0.2);

  border-radius: 9px;

  background: rgba(255,255,255,0.12);

  color: white;

  font-size: 22px;
  line-height: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.back-button:hover {
  background: rgba(255,255,255,0.2);
}

.back-button:active {
  transform: scale(0.95);
}


/* =========================================================
   MAIN CONTAINER
========================================================= */

.exam-container {
  width: 100%;
  max-width: 1240px;

  margin: 0 auto;

  padding: 26px 24px 50px;
}


/* =========================================================
   MAIN CARD
========================================================= */

.exam-card {
  width: 100%;

  background: #ffffff;

  border: 1px solid #e2e8f0;

  border-radius: 15px;

  padding: 28px;

  box-shadow:
    0 8px 30px rgba(15, 23, 42, 0.055);
}


/* =========================================================
   SECTION TITLES
========================================================= */

.section-title {
  position: relative;

  margin: 28px 0 18px;

  padding: 0 0 11px 12px;

  border-bottom: 1px solid #e5eaf1;

  color: #162033;

  font-size: 15px;
  font-weight: 750;

  line-height: 1.3;

  letter-spacing: -0.1px;
}

.section-title::before {
  content: "";

  position: absolute;

  left: 0;
  top: 1px;

  width: 4px;
  height: 18px;

  border-radius: 4px;

  background: #0057b8;
}

.section-title:first-child {
  margin-top: 0;
}

.section-spacing {
  margin-top: 18px;
}


/* =========================================================
   FORM GRID
========================================================= */

.form-grid {
  width: 100%;

  display: grid;

  gap: 16px;

  margin-bottom: 3px;
}

.form-grid-2 {
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
}

.form-grid-3 {
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
}


/* =========================================================
   FIELD
========================================================= */

.field {
  width: 100%;

  margin-bottom: 16px;

  position: relative;
}

.field label,
.eye-box label {
  display: block;

  margin-bottom: 7px;

  color: #34445b;

  font-size: 11px;
  font-weight: 700;

  line-height: 1.3;

  letter-spacing: 0.1px;
}


/* =========================================================
   ALL INPUTS
========================================================= */

input,
textarea {
  width: 100%;

  border: 1px solid #cbd5e1;

  background: #ffffff;

  border-radius: 9px;

  padding: 10px 12px;

  color: #172033;

  font-size: 13px;

  line-height: 1.4;

  outline: none;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

input {
  height: 42px;
}

textarea {
  min-height: 82px;

  resize: vertical;
}

input:hover,
textarea:hover {
  border-color: #b8c7da;
}

input:focus,
textarea:focus {
  border-color: #2d73d5;

  box-shadow:
    0 0 0 3px rgba(45,115,213,0.09);
}

input::placeholder,
textarea::placeholder {
  color: #9aa8ba;
}

input:disabled,
textarea:disabled {
  background: #f1f5f9;
  color: #94a3b8;
}


/* =========================================================
   PATIENT DETAILS ENHANCEMENT
========================================================= */

.exam-card > .form-grid:first-of-type,
.exam-card > .form-grid:nth-of-type(2) {
  position: relative;
}

.exam-card > .form-grid:first-of-type input,
.exam-card > .form-grid:nth-of-type(2) input {
  background: #fbfdff;
}


/* =========================================================
   INPUT WITH BUTTON
========================================================= */

.input-with-button {
  width: 100%;

  display: flex;
  align-items: stretch;

  position: relative;
}

.input-with-button input,
.input-with-button textarea {
  padding-right: 48px;
}

.input-with-button > button {
  position: absolute;

  right: 1px;
  top: 1px;

  width: 42px;
  height: 40px;

  border: 0;

  border-radius: 0 8px 8px 0;

  background: transparent;

  color: #54708f;

  font-size: 14px;

  display: flex;
  align-items: center;
  justify-content: center;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.input-with-button > button:hover {
  background: #eef5ff;
  color: #0057b8;
}

.input-with-button textarea + button {
  top: 1px;
  height: 40px;
}


/* =========================================================
   COMPLAINT DROPDOWN
========================================================= */

.dropdown {
  position: absolute;

  left: 0;
  right: 0;

  top: calc(100% - 10px);

  margin-top: 4px;

  background: #ffffff;

  border: 1px solid #d5deea;

  border-radius: 10px;

  max-height: 230px;

  overflow-y: auto;

  z-index: 500;

  box-shadow:
    0 15px 35px rgba(15,23,42,0.14);

  padding: 5px;
}

.dropdown::-webkit-scrollbar {
  width: 5px;
}

.dropdown::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.dropdown-item {
  display: block;

  width: 100%;

  border: 0;

  border-radius: 7px;

  background: white;

  text-align: left;

  padding: 10px 11px;

  font-size: 12px;

  color: #334155;

  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.dropdown-item:hover {
  background: #eff6ff;
  color: #0047ab;
}


/* =========================================================
   VISION
========================================================= */

.vision-grid {
  width: 100%;

  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 18px;
}

.eye-box {
  border: 1px solid #d7e1ec;

  border-radius: 12px;

  padding: 18px;

  background:
    linear-gradient(
      180deg,
      #fbfdff 0%,
      #f8fbff 100%
    );

  box-shadow:
    0 3px 12px rgba(15,23,42,0.025);

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.eye-box:hover {
  border-color: #c4d4e6;

  box-shadow:
    0 5px 18px rgba(15,23,42,0.05);
}

.eye-heading {
  display: flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 18px;

  padding-bottom: 12px;

  border-bottom: 1px solid #e6edf5;
}

.eye-badge {
  width: 38px;
  height: 32px;

  flex-shrink: 0;

  border-radius: 8px;

  background:
    linear-gradient(
      135deg,
      #dbeafe,
      #e8f2ff
    );

  color: #0057b8;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 11px;
  font-weight: 800;

  border: 1px solid #c8def8;
}

.eye-heading strong {
  color: #20324a;

  font-size: 14px;

  font-weight: 750;
}

/* =========================================================
   REFRACTION — PROFESSIONAL CLINICAL UI
========================================================= */

.refraction-section {
  width: 100%;
  margin-bottom: 18px;

  padding: 20px;

  background: #ffffff;

  border: 1px solid #d9e3ef;
  border-radius: 12px;

  box-shadow:
    0 3px 12px rgba(15, 23, 42, 0.035);
}


/* =========================================================
   OD / OS TITLE
========================================================= */

.refraction-title {
  display: flex;
  align-items: center;

  min-height: 36px;

  margin-bottom: 18px;
  padding-left: 12px;

  border-left: 4px solid #0057b8;

  color: #17416f;

  font-size: 14px;
  font-weight: 800;

  letter-spacing: 0.1px;
}


/* =========================================================
   REFRACTION GRID
   EXACTLY 2 INPUTS PER ROW
========================================================= */

.refraction-grid {
  width: 100%;

  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  column-gap: 20px;
  row-gap: 18px;

  align-items: start;
}


/* =========================================================
   REFRACTION FIELD
========================================================= */

.refraction-field {
  width: 100%;
  min-width: 0;
}

.refraction-field label {
  display: block;

  margin: 0 0 8px 2px;

  color: #334155;

  font-size: 12px;
  font-weight: 700;

  line-height: 1.3;
}


/* =========================================================
   +/- + INPUT ROW
========================================================= */

.refraction-control-with-signs {
  width: 100%;

  display: flex;
  align-items: center;

  gap: 8px;
}


/* =========================================================
   + / - BUTTON
========================================================= */

.sign-button {
  width: 44px;
  min-width: 44px;

  height: 48px;

  flex-shrink: 0;

  padding: 0;

  border: 1px solid #c7d9ee;
  border-radius: 8px;

  background: #f3f8ff;

  color: #0057b8;

  font-size: 23px;
  font-weight: 500;

  line-height: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    transform 0.12s ease,
    box-shadow 0.18s ease;
}

.sign-button:hover {
  background: #e8f2ff;

  border-color: #9fc2e9;

  color: #0047ab;

  box-shadow:
    0 3px 8px rgba(0, 87, 184, 0.08);
}

.sign-button:active {
  transform: scale(0.96);
}


/* =========================================================
   INPUT WRAPPER
========================================================= */

.refraction-input-wrapper {
  position: relative;

  flex: 1;

  min-width: 0;

  height: 48px;
}


/* =========================================================
   SPH / CYL INPUT
========================================================= */

.refraction-input-wrapper input {
  width: 100%;
  height: 48px;

  border: 1px solid #c7d5e5;
  border-radius: 8px;

  background: #ffffff;

  color: #172033;

  padding: 0 48px 0 12px;

  font-size: 15px;
  font-weight: 600;

  text-align: center;

  outline: none;

  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.refraction-input-wrapper input:hover {
  border-color: #aebfd3;
}

.refraction-input-wrapper input:focus {
  border-color: #2874c6;

  background: #ffffff;

  box-shadow:
    0 0 0 3px rgba(40, 116, 198, 0.09);
}


/* =========================================================
   DROPDOWN BUTTON
========================================================= */

.dropdown-inside-button {
  position: absolute;

  top: 1px;
  right: 1px;

  width: 43px;
  height: 46px;

  padding: 0;

  border: 0;
  border-left: 1px solid #e1e8f0;

  border-radius: 0 7px 7px 0;

  background: transparent;

  color: #60758d;

  font-size: 13px;

  display: flex;
  align-items: center;
  justify-content: center;

  transition:
    background 0.18s ease,
    color 0.18s ease;
}

.dropdown-inside-button:hover:not(:disabled) {
  background: #f2f7fd;

  color: #0057b8;
}

.dropdown-inside-button:disabled {
  color: #aeb9c6;

  background: #edf2f7;

  cursor: not-allowed;
}


/* =========================================================
   AXIS CONTROL
========================================================= */

.refraction-control {
  position: relative;

  width: 100%;

  height: 48px;
}

.refraction-control input {
  width: 100%;
  height: 48px;

  border: 1px solid #c7d5e5;
  border-radius: 8px;

  background: #ffffff;

  color: #172033;

  padding: 0 48px 0 12px;

  font-size: 15px;
  font-weight: 600;

  text-align: center;

  outline: none;

  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.refraction-control input:hover {
  border-color: #aebfd3;
}

.refraction-control input:focus {
  border-color: #2874c6;

  box-shadow:
    0 0 0 3px rgba(40, 116, 198, 0.09);
}


/* =========================================================
   DISABLED AXIS
========================================================= */

.axis-disabled {
  opacity: 0.72;
}

.axis-disabled input,
.disabled-input {
  background: #f0f3f6 !important;

  color: #94a3b8 !important;

  border-color: #d8e0e8 !important;

  cursor: not-allowed;
}

.axis-disabled .dropdown-inside-button {
  background: #edf1f5;

  color: #a6b1bd;

  cursor: not-allowed;
}


/* =========================================================
   MOBILE / TABLET
========================================================= */

@media (max-width: 900px) {

  .refraction-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));

    column-gap: 15px;
    row-gap: 16px;
  }

  .refraction-section {
    padding: 17px;
  }

  .sign-button {
    width: 40px;
    min-width: 40px;

    height: 46px;

    font-size: 21px;
  }

  .refraction-input-wrapper,
  .refraction-input-wrapper input,
  .refraction-control,
  .refraction-control input {
    height: 46px;
  }

  .dropdown-inside-button {
    height: 44px;
    width: 40px;
  }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 600px) {

  .refraction-grid {
    grid-template-columns: 1fr;

    gap: 15px;
  }

  .refraction-section {
    padding: 15px;
  }

  .refraction-title {
    margin-bottom: 15px;

    font-size: 13px;
  }

}


/* =========================================================
   VERY SMALL MOBILE
========================================================= */

@media (max-width: 380px) {

  .refraction-control-with-signs {
    gap: 5px;
  }

  .sign-button {
    width: 38px;
    min-width: 38px;

    height: 44px;

    font-size: 20px;
  }

  .refraction-input-wrapper,
  .refraction-input-wrapper input,
  .refraction-control,
  .refraction-control input {
    height: 44px;
  }

  .refraction-input-wrapper input,
  .refraction-control input {
    font-size: 14px;

    padding-left: 8px;
    padding-right: 42px;
  }

  .dropdown-inside-button {
    width: 38px;
    height: 42px;
  }

}


/* =========================================================
   PRINT
========================================================= */

@media print {

  .refraction-section {
    border: 1px solid #999;

    box-shadow: none;

    break-inside: avoid;
  }

  .refraction-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .sign-button {
    border: 1px solid #999;

    background: white;

    color: black;
  }

  .refraction-input-wrapper input,
  .refraction-control input {
    box-shadow: none !important;

    color: black;
  }

}


/* =========================================================
   OTHER MEASUREMENTS
========================================================= */

.exam-card > .field input {
  background: #ffffff;
}

.exam-card > .field input:focus {
  background: #ffffff;
}


/* =========================================================
   RX
========================================================= */

.rx-wrapper {
  position: relative;

  width: 100%;
}

.rx-wrapper textarea {
  min-height: 95px;

  padding:
    12px 75px 12px 13px;
}

.rx-actions {
  position: absolute;

  top: 8px;
  right: 8px;

  display: flex;

  gap: 4px;

  background: white;

  padding: 3px;

  border-radius: 8px;

  border: 1px solid #e5ebf2;

  box-shadow:
    0 2px 7px rgba(15,23,42,0.05);
}

.rx-actions button {
  border: 0;

  background: transparent;

  color: #64748b;

  width: 31px;
  height: 31px;

  border-radius: 6px;

  font-size: 14px;

  display: flex;
  align-items: center;
  justify-content: center;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.rx-actions button:hover {
  background: #eff6ff;

  color: #0047ab;
}

.rx-actions .clear-button {
  color: #dc2626;
}

.rx-actions .clear-button:hover {
  background: #fef2f2;

  color: #b91c1c;
}


/* =========================================================
   CLINICAL NOTES
========================================================= */

.large-textarea {
  min-height: 120px;

  line-height: 1.6;

  padding: 13px;
}


/* =========================================================
   DATE
========================================================= */

.date-input {
  width: 100%;

  max-width: 330px;

  height: 44px;

  font-weight: 500;
}


/* =========================================================
   ACTION BUTTON AREA
========================================================= */

.button-row {
  width: 100%;

  display: flex;

  justify-content: flex-end;

  align-items: center;

  gap: 10px;

  margin-top: 30px;

  padding-top: 20px;

  border-top: 1px solid #e3e9f0;
}

.button-row button {
  min-width: 130px;

  height: 43px;

  padding: 0 17px;

  border-radius: 8px;

  border: 1px solid transparent;

  font-size: 12px;

  font-weight: 750;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  transition:
    transform 0.15s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.button-row button:hover {
  transform: translateY(-1px);
}

.button-row button:active {
  transform: translateY(0) scale(0.98);
}


/* =========================================================
   SAVE
========================================================= */

.save-button {
  background:
    linear-gradient(
      135deg,
      #0047ab,
      #075fc5
    );

  color: white;

  box-shadow:
    0 5px 13px rgba(0,71,171,0.18);
}

.save-button:hover {
  background:
    linear-gradient(
      135deg,
      #003d95,
      #0057b8
    );

  box-shadow:
    0 7px 17px rgba(0,71,171,0.22);
}

.save-button:disabled {
  opacity: 0.6;

  box-shadow: none;

  transform: none;
}


/* =========================================================
   PRINT
========================================================= */

.print-button {
  background: #ffffff;

  border-color: #bfd4ed !important;

  color: #0057b8;
}

.print-button:hover {
  background: #eff6ff;

  border-color: #a7c7ed !important;
}


/* =========================================================
   WHATSAPP
========================================================= */

.whatsapp-button {
  background:
    linear-gradient(
      135deg,
      #16a34a,
      #22b45a
    );

  color: white;

  box-shadow:
    0 5px 13px rgba(22,163,74,0.15);
}

.whatsapp-button:hover {
  background:
    linear-gradient(
      135deg,
      #15803d,
      #16a34a
    );
}


/* =========================================================
   PREVIOUS HISTORY
========================================================= */

.history-section {
  width: 100%;

  margin-top: 22px;

  background: #ffffff;

  border: 1px solid #e2e8f0;

  border-radius: 15px;

  padding: 24px;

  box-shadow:
    0 7px 25px rgba(15,23,42,0.045);
}

.history-section-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  margin-bottom: 20px;

  padding-bottom: 15px;

  border-bottom: 1px solid #e7edf4;
}

.history-section-header h2 {
  margin: 0;

  color: #172033;

  font-size: 15px;

  font-weight: 750;
}

.history-section-header p {
  margin: 5px 0 0;

  color: #718096;

  font-size: 11px;

  line-height: 1.5;
}

.history-count {
  min-width: 34px;
  height: 30px;

  padding: 0 10px;

  border-radius: 20px;

  background: #e8f2ff;

  border: 1px solid #cfe2fa;

  color: #0057b8;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;

  font-weight: 750;
}

.empty-history {
  border: 1px dashed #cbd5e1;

  border-radius: 11px;

  padding: 42px 20px;

  text-align: center;

  background:
    linear-gradient(
      180deg,
      #fbfdff,
      #f8fafc
    );
}

.empty-icon {
  width: 54px;
  height: 54px;

  margin: 0 auto 12px;

  border-radius: 50%;

  background: #eef5ff;

  border: 1px solid #d6e7fb;

  color: #0057b8;

  font-size: 25px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-history h3 {
  margin: 0;

  color: #334155;

  font-size: 13px;

  font-weight: 700;
}

.empty-history p {
  margin: 7px 0 0;

  color: #7b8798;

  font-size: 11px;

  line-height: 1.5;
}


/* =========================================================
   MODAL OVERLAY
========================================================= */

.modal-overlay {
  position: fixed;

  inset: 0;

  width: 100%;
  height: 100%;

  background:
    rgba(15,23,42,0.58);

  backdrop-filter: blur(3px);

  -webkit-backdrop-filter: blur(3px);

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 20px;

  z-index: 99999;

  animation: modalFadeIn 0.18s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}


/* =========================================================
   MODAL
========================================================= */

.modal-container {
  width: min(540px, 100%);

  max-height: 86vh;

  background: #ffffff;

  border-radius: 15px;

  padding: 20px;

  border: 1px solid #e1e7ef;

  box-shadow:
    0 25px 70px rgba(15,23,42,0.28);

  display: flex;

  flex-direction: column;

  overflow: hidden;

  animation: modalSlideIn 0.2s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;

    transform:
      translateY(10px)
      scale(0.985);
  }

  to {
    opacity: 1;

    transform:
      translateY(0)
      scale(1);
  }
}


/* =========================================================
   MODAL HEADER
========================================================= */

.modal-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;

  margin-bottom: 15px;

  padding-bottom: 13px;

  border-bottom: 1px solid #e7edf4;
}

.modal-header h3 {
  margin: 0;

  color: #17345d;

  font-size: 16px;

  font-weight: 750;
}

.modal-close {
  width: 32px;
  height: 32px;

  flex-shrink: 0;

  border: 0;

  border-radius: 7px;

  background: #f5f7fa;

  color: #64748b;

  font-size: 21px;

  line-height: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.modal-close:hover {
  background: #feecec;

  color: #dc2626;
}


/* =========================================================
   MODAL SEARCH
========================================================= */

.modal-search {
  width: 100%;

  height: 43px;

  margin-bottom: 11px;

  background: #fbfdff;

  font-size: 12px;
}


/* =========================================================
   MODAL LIST
========================================================= */

.modal-list {
  width: 100%;

  overflow-y: auto;

  max-height: 390px;

  padding: 2px;

  scrollbar-width: thin;

  scrollbar-color:
    #cbd5e1
    transparent;
}

.modal-list::-webkit-scrollbar {
  width: 6px;
}

.modal-list::-webkit-scrollbar-track {
  background: transparent;
}

.modal-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;

  border-radius: 10px;
}


/* =========================================================
   MODAL ITEM
========================================================= */

.modal-item {
  width: 100%;

  min-height: 42px;

  border: 1px solid transparent;

  border-bottom: 1px solid #edf1f5;

  border-radius: 7px;

  background: #ffffff;

  text-align: left;

  padding: 9px 11px;

  color: #334155;

  font-size: 12px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
}

.modal-item:hover {
  background: #eff6ff;

  color: #0047ab;

  border-color: #d9e9fb;
}

.selected-medicine {
  background: #eff6ff;

  color: #0047ab;

  font-weight: 700;

  border-color: #cfe2fa;
}


/* =========================================================
   HISTORY CATEGORY
========================================================= */

.history-category {
  margin-bottom: 18px;

  padding: 12px;

  border: 1px solid #e8edf3;

  border-radius: 9px;

  background: #fbfdff;
}

.history-category h4 {
  margin: 0 0 9px;

  padding-bottom: 7px;

  border-bottom: 1px solid #e8edf3;

  color: #1e3a8a;

  font-size: 12px;

  font-weight: 750;
}


/* =========================================================
   CHECKBOX
========================================================= */

.checkbox-item {
  display: flex;

  align-items: center;

  gap: 9px;

  padding: 9px;

  margin-bottom: 2px;

  border-radius: 7px;

  color: #334155;

  font-size: 12px;

  cursor: pointer;

  transition:
    background 0.15s ease;
}

.checkbox-item:hover {
  background: #f1f6fc;
}

.checkbox-item input {
  width: 15px;
  height: 15px;

  margin: 0;

  accent-color: #0057b8;

  cursor: pointer;
}

.selected-item {
  background: #eff6ff;

  color: #0047ab;

  font-weight: 600;
}


/* =========================================================
   SELECTED BOX
========================================================= */

.selected-box {
  margin-top: 11px;

  padding: 12px;

  border: 1px solid #cfe2fa;

  background: #eff6ff;

  border-radius: 9px;
}

.selected-box strong {
  font-size: 11px;

  color: #1e3a8a;
}

.selected-box p {
  margin: 6px 0 0;

  color: #334155;

  font-size: 11px;

  line-height: 18px;
}


/* =========================================================
   MODAL DONE BUTTON
========================================================= */

.modal-done-button {
  width: 100%;

  margin-top: 13px;

  height: 42px;

  border: 0;

  border-radius: 8px;

  background:
    linear-gradient(
      135deg,
      #0047ab,
      #075fc5
    );

  color: white;

  font-size: 12px;

  font-weight: 750;

  box-shadow:
    0 4px 10px rgba(0,71,171,0.15);

  transition:
    background 0.2s ease,
    transform 0.15s ease;
}

.modal-done-button:hover {
  background:
    linear-gradient(
      135deg,
      #003d95,
      #0057b8
    );
}

.modal-done-button:active {
  transform: scale(0.985);
}


/* =========================================================
   CLEAR RX MODAL
========================================================= */

.clear-rx-modal {
  width: 100%;

  margin-top: 10px;

  height: 39px;

  border: 1px solid #fecaca;

  border-radius: 8px;

  background: #fff7f7;

  color: #dc2626;

  font-size: 12px;

  font-weight: 700;

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.clear-rx-modal:hover {
  background: #fef2f2;

  border-color: #fca5a5;
}


/* =========================================================
   SCROLLBAR
========================================================= */

::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;

  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1000px) {

  .exam-container {
    padding: 20px 18px 40px;
  }

  .exam-card {
    padding: 22px;
  }

  .form-grid-3 {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .refraction-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .refraction-field {
    min-width: 0;
  }
}


/* =========================================================
   SMALL TABLET
========================================================= */

@media (max-width: 760px) {

  .exam-header {
    min-height: 70px;

    padding:
      12px 17px;
  }

  .exam-header h1 {
    font-size: 18px;
  }

  .exam-header p {
    font-size: 11px;
  }

  .back-button {
    width: 38px;
    height: 38px;
  }

  .exam-container {
    padding:
      15px 12px 30px;
  }

  .exam-card {
    padding: 18px;

    border-radius: 12px;
  }

  .vision-grid {
    grid-template-columns: 1fr;
  }

  .form-grid-2 {
    grid-template-columns: 1fr;
  }

  .form-grid-3 {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .button-row {
    justify-content: stretch;
  }

  .button-row button {
    flex: 1;
  }
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 560px) {

  .exam-header {
    padding:
      11px 13px;
  }

  .exam-header h1 {
    font-size: 17px;
  }

  .exam-header p {
    font-size: 10px;

    margin-top: 3px;
  }

  .back-button {
    width: 36px;
    height: 36px;

    font-size: 20px;
  }

  .exam-container {
    padding:
      10px 8px 25px;
  }

  .exam-card {
    padding: 15px;

    border-radius: 11px;
  }

  .section-title {
    margin-top: 23px;

    font-size: 14px;

    padding-bottom: 10px;
  }

  .form-grid-2,
  .form-grid-3,
  .vision-grid,
  .refraction-grid {
    grid-template-columns: 1fr;
  }

  .field {
    margin-bottom: 13px;
  }

  input {
    height: 42px;
  }

  textarea {
    min-height: 78px;
  }

  .eye-box {
    padding: 14px;
  }

  .refraction-section {
    padding: 14px;
  }

  /*
     Keep Refraction controls usable on mobile.
  */

  .refraction-control-with-signs {
    gap: 5px;
  }

  .sign-button {
    width: 48px;
    min-width: 48px;
    height: 52px;

    font-size: 23px;
  }

  .refraction-input-wrapper {
    height: 52px;
  }

  .refraction-input-wrapper input {
    height: 52px;

    font-size: 16px;

    padding-left: 8px;
    padding-right: 45px;
  }

  .dropdown-inside-button {
    width: 44px;
  }

  .refraction-control {
    height: 52px;
  }

  .refraction-control input {
    height: 52px;

    font-size: 16px;

    padding-left: 8px;
    padding-right: 45px;
  }

  .refraction-field label {
    font-size: 11px;
  }

  .button-row {
    flex-direction: column;

    gap: 9px;

    align-items: stretch;
  }

  .button-row button {
    width: 100%;

    min-width: 0;

    flex: none;
  }

  .date-input {
    max-width: 100%;
  }

  .history-section {
    padding: 17px;

    border-radius: 12px;
  }

  .history-section-header {
    align-items: flex-start;
  }

  .history-section-header h2 {
    font-size: 14px;
  }

  .modal-overlay {
    align-items: flex-end;

    padding: 0;
  }

  .modal-container {
    width: 100%;

    max-height: 91vh;

    border-radius:
      16px 16px 0 0;

    padding: 17px;

    border-bottom: 0;

    animation:
      modalMobileSlide 0.22s ease;
  }

  @keyframes modalMobileSlide {

    from {
      transform: translateY(100%);
    }

    to {
      transform: translateY(0);
    }

  }

  .modal-list {
    max-height: 55vh;
  }

}


/* =========================================================
   VERY SMALL MOBILE
========================================================= */

@media (max-width: 380px) {

  .exam-card {
    padding: 12px;
  }

  .exam-header {
    gap: 9px;
  }

  .exam-header h1 {
    font-size: 16px;
  }

  .exam-header p {
    display: none;
  }

  .refraction-section {
    padding: 11px;
  }

  .sign-button {
    width: 43px;
    min-width: 43px;

    height: 49px;

    font-size: 21px;
  }

  .refraction-input-wrapper,
  .refraction-input-wrapper input,
  .refraction-control,
  .refraction-control input {
    height: 49px;
  }

  .refraction-input-wrapper input,
  .refraction-control input {
    font-size: 15px;
  }

  .dropdown-inside-button {
    width: 40px;
  }
}


/* =========================================================
   PRINT
========================================================= */

@media print {

  @page {
    size: A4;
    margin: 12mm;
  }

  html,
  body {
    background: white !important;
  }

  .eye-exam-page {
    background: white !important;
  }

  .exam-header {
    background: white !important;

    color: black !important;

    box-shadow: none;

    border-bottom:
      1px solid #d1d5db;

    min-height: auto;

    padding:
      8px 0;
  }

  .exam-header h1 {
    color: black !important;
  }

  .exam-header p {
    color: #555 !important;
  }

  .back-button,
  .button-row,
  .history-section {
    display: none !important;
  }

  .exam-container {
    max-width: 100%;

    padding: 0;
  }

  .exam-card {
    border: 0;

    box-shadow: none;

    padding: 0;
  }

  .section-title {
    color: black;

    break-after: avoid;
  }

  .refraction-section,
  .eye-box {
    box-shadow: none;

    break-inside: avoid;
  }

  input,
  textarea {
    border-color: #aaa;

    box-shadow: none !important;

    color: black;
  }

  .modal-overlay {
    display: none !important;
  }

}


/* =========================================================
   ACCESSIBILITY
========================================================= */

button:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid #4f8edc;

  outline-offset: 2px;
}


/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;

    animation-iteration-count: 1 !important;

    transition-duration: 0.01ms !important;
  }

}

`}</style>
    </div>
  );
}

/* ============================================================
   SECTION TITLE
============================================================ */

function SectionTitle({ title }) {
  return (
    <h2 className="section-title">
      {title}
    </h2>
  );
}

/* ============================================================
   FIELD
============================================================ */

function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

/* ============================================================
   REFRACTION EYE
============================================================ */

function RefractionEye({
  title,
  sph,
  setSph,
  cyl,
  setCyl,
  axis,
  setAxis,
  add,
  setAdd,
  axisDisabled,
  openRefraction,
  handleAxisChange,
  sphField,
  cylField,
  axisField,
}) {
  return (
    <div className="refraction-section">

      <div className="refraction-title">
        {title}
      </div>

      <div className="refraction-grid">

        {/* SPH */}

        <div className="refraction-field">

          <label>SPH</label>

          <div className="refraction-control">

            <input
              value={sph}
              onChange={(e) =>
                setSph(e.target.value)
              }
              placeholder="SPH"
            />

            <button
              type="button"
              onClick={() =>
                openRefraction(sphField)
              }
            >
              ▼
            </button>

          </div>

        </div>

        {/* CYL */}

        <div className="refraction-field">

          <label>CYL</label>

          <div className="refraction-control">

            <input
              value={cyl}
              onChange={(e) => {
                const value = e.target.value;

                setCyl(value);

                if (
                  value === "0.00" ||
                  value === "+0.00" ||
                  value === "-0.00"
                ) {
                  setAxis("");
                }
              }}
              placeholder="CYL"
            />

            <button
              type="button"
              onClick={() =>
                openRefraction(cylField)
              }
            >
              ▼
            </button>

          </div>

        </div>

        {/* AXIS */}

        <div className="refraction-field">

          <label>AXIS</label>

          <div className="refraction-control">

            <input
              value={axis}
              disabled={axisDisabled}
              onChange={(e) =>
                handleAxisChange(
                  e.target.value,
                  setAxis
                )
              }
              placeholder="0–180"
              inputMode="numeric"
              className={
                axisDisabled
                  ? "disabled-input"
                  : ""
              }
            />

            <button
              type="button"
              disabled={axisDisabled}
              onClick={() =>
                openRefraction(axisField)
              }
            >
              ▼
            </button>

          </div>

        </div>

        {/* ADD */}

        <div className="refraction-field">

          <label>ADD</label>

          <input
            value={add}
            onChange={(e) =>
              setAdd(e.target.value)
            }
            placeholder="+2.00"
          />

        </div>

      </div>

    </div>
  );
}

/* ============================================================
   MODAL
============================================================ */

function Modal({
  title,
  close,
  children,
}) {
  return (
    <div className="modal-overlay">

      <div className="modal-container">

        <div className="modal-header">

          <h3>{title}</h3>

          <button
            className="modal-close"
            onClick={close}
          >
            ×
          </button>

        </div>

        {children}

      </div>

    </div>
  );
}

/* ============================================================
   REFRACTION TITLE
============================================================ */

function getRefractionTitle(field) {
  switch (field) {
    case "rightSph":
      return "Select OD SPH";

    case "rightCyl":
      return "Select OD CYL";

    case "rightAxis":
      return "Select OD AXIS";

    case "leftSph":
      return "Select OS SPH";

    case "leftCyl":
      return "Select OS CYL";

    case "leftAxis":
      return "Select OS AXIS";

    default:
      return "Select Refraction";
  }
}