import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  "https://visiontrackdatabase.onrender.com";

/* ============================================================
   DATE HELPERS
============================================================ */

const normalizeDate = (dateString) => {
  if (!dateString) return null;

  let value = String(dateString)
    .trim()
    .split("T")[0];

  let day;
  let month;
  let year;

  if (value.includes("-")) {
    const parts = value.split("-");

    if (parts.length !== 3) return null;

    if (parts[0]?.length === 4) {
      year = parts[0];
      month = parts[1];
      day = parts[2];
    } else if (parts[2]?.length === 4) {
      day = parts[0];
      month = parts[1];
      year = parts[2];
    }
  } else if (value.includes("/")) {
    const parts = value.split("/");

    if (parts.length !== 3) return null;

    day = parts[0];
    month = parts[1];
    year = parts[2];
  }

  if (!day || !month || !year) return null;

  const d = Number(day);
  const m = Number(month);
  const y = Number(year);

  if (
    !Number.isInteger(d) ||
    !Number.isInteger(m) ||
    !Number.isInteger(y) ||
    d < 1 ||
    d > 31 ||
    m < 1 ||
    m > 12 ||
    y < 1900
  ) {
    return null;
  }

  return `${String(y).padStart(
    4,
    "0"
  )}-${String(m).padStart(
    2,
    "0"
  )}-${String(d).padStart(
    2,
    "0"
  )}`;
};

const formatDateForInput = (dateString) => {
  const normalized =
    normalizeDate(dateString);

  if (!normalized) return "";

  const [year, month, day] =
    normalized.split("-");

  return `${day}-${month}-${year}`;
};

const cleanMobileNumber = (mobile) => {
  return String(mobile || "").replace(
    /\D/g,
    ""
  );
};

const isCompletedStatus = (status) => {
  const value = String(status || "")
    .toLowerCase()
    .trim();

  return [
    "completed",
    "complete",
    "closed",
    "done",
    "visited",
  ].includes(value);
};

const getTodayString = () => {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(
    2,
    "0"
  )}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
};

const getTomorrowString = () => {
  const date = new Date();

  date.setDate(
    date.getDate() + 1
  );

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(
    2,
    "0"
  )}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
};

/* ============================================================
   COMPONENT
============================================================ */

export default function Followup() {
  const navigate = useNavigate();

  /* ==========================================================
     DATA
  ========================================================== */

  const [reminders, setReminders] =
    useState([]);

  const [eyeExamPatients, setEyeExamPatients] =
    useState([]);

  /* ==========================================================
     LOADING
  ========================================================== */

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [completingId, setCompletingId] =
    useState(null);

  const [mobileSearching, setMobileSearching] =
    useState(false);

  /* ==========================================================
     MODAL
  ========================================================== */

  const [modal, setModal] =
    useState(false);

  const [editingItem, setEditingItem] =
    useState(null);

  /* ==========================================================
     FORM
  ========================================================== */

  const [patientName, setPatientName] =
    useState("");

  const [patientId, setPatientId] =
    useState("");

  const [mobileNo, setMobileNo] =
    useState("");

  const [date, setDate] =
    useState("");

  const [reason, setReason] =
    useState("");

  /* ==========================================================
     PATIENT SEARCH
  ========================================================== */

  const [patientSearch, setPatientSearch] =
    useState("");

  const [showPatients, setShowPatients] =
    useState(false);

  /* ==========================================================
     FILTER
  ========================================================== */

  const [activeFilter, setActiveFilter] =
    useState("All");

  /* ==========================================================
     RESPONSIVE
  ========================================================== */

  const [windowWidth, setWindowWidth] =
    useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(
        window.innerWidth
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  const isMobile =
    windowWidth < 600;

  const isTablet =
    windowWidth >= 600 &&
    windowWidth < 1000;

  const isDesktop =
    windowWidth >= 1000;

  /* ==========================================================
     MESSAGE
  ========================================================== */

  const showMessage = useCallback(
    (title, message) => {
      window.alert(
        `${title}\n\n${message || ""}`
      );
    },
    []
  );

  /* ==========================================================
     LOAD FOLLOWUPS
  ========================================================== */

  const loadFollowups =
    useCallback(async () => {
      try {
        setLoading(true);

        const url =
          `${API_BASE}/eyeexam/super-admin`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            Accept:
              "application/json",
          },
        });

        let data;

        try {
          data = await res.json();
        } catch {
          throw new Error(
            `Invalid server response (${res.status})`
          );
        }

        if (
          !res.ok ||
          !data.success ||
          !Array.isArray(data.exams)
        ) {
          setReminders([]);
          setEyeExamPatients([]);

          showMessage(
            "Failed",
            data?.message ||
              `Unable to load eye examinations (${res.status}).`
          );

          return;
        }

        const exams =
          data.exams || [];

        /* ====================================================
           UNIQUE PATIENTS
        ==================================================== */

        const uniqueMap =
          new Map();

        exams.forEach((item) => {
          if (
            !item.patient_id &&
            !item.mobile_number
          ) {
            return;
          }

          const normalizedPatientId =
            String(
              item.patient_id || ""
            )
              .trim()
              .toLowerCase();

          const normalizedMobile =
            cleanMobileNumber(
              item.mobile_number
            );

          const key =
            normalizedPatientId
              ? `patient-${normalizedPatientId}`
              : normalizedMobile
              ? `mobile-${normalizedMobile}`
              : null;

          if (!key) return;

          uniqueMap.set(key, {
            id: item.id,
            patient_id:
              item.patient_id,
            name:
              item.patient_name,
            mobile:
              item.mobile_number,
            age: item.age,
            gender: item.gender,
          });
        });

        setEyeExamPatients(
          Array.from(
            uniqueMap.values()
          )
        );

        /* ====================================================
           FOLLOW-UP RECORDS
        ==================================================== */

        const reviews =
          exams
            .filter(
              (item) =>
                item.next_review_date
            )
            .map((item) => ({
              id: item.id,
              patient_id:
                item.patient_id,
              patient_name:
                item.patient_name,
              mobile:
                item.mobile_number,
              followup_date:
                item.next_review_date,
              reason:
                item.notes ||
                item.diagnosis ||
                "General Eye Review",
              status:
                item.followup_status ||
                item.status ||
                "upcoming",
              exam: item,
            }));

        setReminders(reviews);
      } catch (error) {
        console.error(
          "SUPER ADMIN FOLLOWUPS ERROR:",
          error
        );

        setReminders([]);
        setEyeExamPatients([]);

        showMessage(
          "Error",
          error?.message ||
            "Failed to load follow-ups."
        );
      } finally {
        setLoading(false);
      }
    }, [showMessage]);

  /* ==========================================================
     INITIAL LOAD
  ========================================================== */

  useEffect(() => {
    loadFollowups();
  }, [loadFollowups]);

  /* ==========================================================
     PATIENT SEARCH
  ========================================================== */

  const filteredPatients =
    useMemo(() => {
      const search =
        patientSearch
          .toLowerCase()
          .trim();

      if (!search) return [];

      const cleanSearch =
        cleanMobileNumber(
          search
        );

      return eyeExamPatients.filter(
        (p) => {
          const name =
            String(
              p.name || ""
            ).toLowerCase();

          const mobile =
            cleanMobileNumber(
              p.mobile
            );

          const id =
            String(
              p.patient_id || ""
            ).toLowerCase();

          return (
            name.includes(search) ||
            (cleanSearch &&
              mobile.includes(
                cleanSearch
              )) ||
            id.includes(search)
          );
        }
      );
    }, [
      eyeExamPatients,
      patientSearch,
    ]);

  /* ==========================================================
     SELECT PATIENT
  ========================================================== */

  const selectPatient = (
    patient
  ) => {
    setPatientName(
      patient.name || ""
    );

    setPatientId(
      String(
        patient.patient_id || ""
      ).trim()
    );

    setMobileNo(
      cleanMobileNumber(
        patient.mobile
      )
    );

    setPatientSearch(
      patient.name || ""
    );

    setShowPatients(false);
  };

  /* ==========================================================
     MOBILE SEARCH
  ========================================================== */

  const searchPatientByMobile =
    (mobile) => {
      const clean =
        cleanMobileNumber(
          mobile
        );

      const limited =
        clean.slice(0, 10);

      setMobileNo(limited);

      if (limited.length < 10) {
        setPatientName("");
        setPatientId("");
        setPatientSearch("");
        setShowPatients(false);
        return;
      }

      try {
        setMobileSearching(true);

        const found =
          eyeExamPatients.find(
            (patient) =>
              cleanMobileNumber(
                patient.mobile
              ) === limited
          );

        if (found) {
          selectPatient(found);
        } else {
          setPatientName("");
          setPatientId("");
          setPatientSearch("");
        }
      } catch (error) {
        console.error(
          "MOBILE SEARCH ERROR:",
          error
        );
      } finally {
        setMobileSearching(false);
      }
    };

  /* ==========================================================
     RESET FORM
  ========================================================== */

  const resetForm = () => {
    setEditingItem(null);
    setPatientName("");
    setPatientId("");
    setMobileNo("");
    setDate("");
    setReason("");
    setPatientSearch("");
    setShowPatients(false);
  };

  /* ==========================================================
     CLOSE MODAL
  ========================================================== */

  const closeModal = () => {
    setModal(false);
    resetForm();
  };

  /* ==========================================================
     NEW
  ========================================================== */

  const openNewReminder = () => {
    resetForm();
    setModal(true);
  };

  /* ==========================================================
     EDIT
  ========================================================== */

  const editFollowup = (
    item
  ) => {
    setEditingItem(item);

    setPatientName(
      item.patient_name || ""
    );

    setPatientId(
      String(
        item.patient_id || ""
      )
    );

    setMobileNo(
      cleanMobileNumber(
        item.mobile
      )
    );

    setPatientSearch(
      item.patient_name || ""
    );

    setDate(
      formatDateForInput(
        item.followup_date
      )
    );

    setReason(
      item.reason ||
        item.exam?.notes ||
        item.exam?.diagnosis ||
        ""
    );

    setShowPatients(false);
    setModal(true);
  };

  /* ==========================================================
     FIND ACTIVE FOLLOW-UP
  ========================================================== */

  const findActiveFollowupForPatient =
    (currentPatientId) => {
      if (!currentPatientId)
        return null;

      const targetId =
        String(
          currentPatientId
        )
          .trim()
          .toLowerCase();

      return (
        reminders.find(
          (item) => {
            if (!item.patient_id) {
              return false;
            }

            const itemId =
              String(
                item.patient_id
              )
                .trim()
                .toLowerCase();

            if (
              itemId !== targetId
            ) {
              return false;
            }

            return !isCompletedStatus(
              item.status
            );
          }
        ) || null
      );
    };

  /* ==========================================================
     SAVE / UPDATE FOLLOW-UP
  ========================================================== */
/* ============================================================
   SAVE / UPDATE FOLLOW-UP
   IMPORTANT:
   THIS ONLY UPDATES EXISTING EYE EXAM RECORDS.
   IT NEVER CREATES / ADDS A NEW FOLLOW-UP.
============================================================ */

/* ============================================================
   SAVE / UPDATE FOLLOW-UP

   ADD:
   POST /eyeexam/super-admin/add-review

   EDIT:
   PUT /eyeexam/super-admin/update-review/:examId
============================================================ */

const saveFollowup = async () => {
  if (saving) return;

  const finalPatientId = String(
    patientId || ""
  ).trim();

  const finalPatientName = String(
    patientName || ""
  ).trim();

  const finalMobile = cleanMobileNumber(
    mobileNo
  );

  /* ==========================================================
     VALIDATION
  ========================================================== */

  if (!finalPatientId) {
    showMessage(
      "Patient Required",
      "Please select a patient with a valid Patient ID."
    );
    return;
  }

  if (!finalPatientName) {
    showMessage(
      "Patient Required",
      "Please select a valid patient."
    );
    return;
  }

  if (!date.trim()) {
    showMessage(
      "Date Required",
      "Please enter follow-up date."
    );
    return;
  }

  const formattedDate = normalizeDate(date);

  if (!formattedDate) {
    showMessage(
      "Invalid Date",
      "Please enter date in DD-MM-YYYY format."
    );
    return;
  }

  try {
    setSaving(true);

    /* ========================================================
       EDIT EXISTING FOLLOW-UP
    ======================================================== */

    if (editingItem) {
      /*
        IMPORTANT:
        Backend expects eye_exams.id

        We first get the exact exam ID from:
        editingItem.exam.id
        or
        editingItem.id
      */

      const examId =
        editingItem?.exam?.id ||
        editingItem?.id;

      if (!examId) {
        showMessage(
          "Update Failed",
          "Eye examination ID was not found."
        );

        return;
      }

      const updateUrl =
        `${API_BASE}/eyeexam/super-admin/update-review/` +
        `${encodeURIComponent(examId)}`;

      const updateBody = {
        next_review_date:
          formattedDate,

        notes:
          reason.trim() || "",
      };

      console.log(
        "UPDATING FOLLOW-UP:",
        {
          examId,
          patientId:
            finalPatientId,
          body: updateBody,
        }
      );

      const res = await fetch(
        updateUrl,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body:
            JSON.stringify(
              updateBody
            ),
        }
      );

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error(
          `Invalid server response (${res.status})`
        );
      }

      if (
        res.ok &&
        data?.success
      ) {
        setModal(false);

        resetForm();

        await loadFollowups();

        showMessage(
          "Success",
          "Follow-up updated successfully."
        );

        return;
      }

      showMessage(
        "Update Failed",
        data?.message ||
          `Failed to update follow-up (${res.status}).`
      );

      return;
    }

    /* ========================================================
       ADD NEW FOLLOW-UP
    ======================================================== */

    const addUrl =
      `${API_BASE}/eyeexam/super-admin/add-review`;

    const addBody = {
      patient_id:
        finalPatientId,

      patient_name:
        finalPatientName,

      mobile_number:
        finalMobile,

      next_review_date:
        formattedDate,

      notes:
        reason.trim() || "",
    };

    console.log(
      "ADDING NEW FOLLOW-UP:",
      addBody
    );

    const res = await fetch(
      addUrl,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Accept:
            "application/json",
        },

        body:
          JSON.stringify(
            addBody
          ),
      }
    );

    let data;

    try {
      data = await res.json();
    } catch {
      throw new Error(
        `Invalid server response (${res.status})`
      );
    }

    /* ========================================================
       ADD SUCCESS
    ======================================================== */

    if (
      res.ok &&
      data?.success
    ) {
      setModal(false);

      resetForm();

      await loadFollowups();

      showMessage(
        "Success",
        "Follow-up added successfully."
      );

      return;
    }

    /* ========================================================
       ADD FAILED
    ======================================================== */

    showMessage(
      "Add Failed",
      data?.message ||
        `Failed to add follow-up (${res.status}).`
    );
  } catch (error) {
    console.error(
      "SAVE FOLLOWUP ERROR:",
      error
    );

    showMessage(
      "Error",
      error?.message ||
        "Failed to save follow-up."
    );
  } finally {
    setSaving(false);
  }
};
  /* ==========================================================
     DELETE FOLLOW-UP
  ========================================================== */

  const deleteFollowup =
    async (item) => {
      if (!item?.id) {
        showMessage(
          "Error",
          "Eye examination ID not found."
        );
        return;
      }

      if (deletingId) return;

      const confirmed =
        window.confirm(
          `Delete follow-up for ${
            item.patient_name ||
            "this patient"
          }?`
        );

      if (!confirmed) return;

      try {
        setDeletingId(item.id);

        const url =
          `${API_BASE}/eyeexam/delete/` +
          `${encodeURIComponent(
            item.id
          )}`;

        const res = await fetch(
          url,
          {
            method: "DELETE",
            headers: {
              "Content-Type":
                "application/json",
              Accept:
                "application/json",
            },
            body: JSON.stringify({
              deletedBy:
                "SuperAdmin",
            }),
          }
        );

        let data;

        try {
          data = await res.json();
        } catch {
          throw new Error(
            `Server returned invalid response (${res.status})`
          );
        }

        if (
          res.ok &&
          data.success
        ) {
          await loadFollowups();

          showMessage(
            "Success",
            "Follow-up deleted successfully."
          );
        } else {
          showMessage(
            "Delete Failed",
            data?.message ||
              `Failed to delete follow-up (${res.status})`
          );
        }
      } catch (error) {
        console.error(
          "DELETE ERROR:",
          error
        );

        showMessage(
          "Error",
          error?.message ||
            "Failed to delete follow-up."
        );
      } finally {
        setDeletingId(null);
      }
    };

  /* ==========================================================
     WHATSAPP
  ========================================================== */

  const handleWhatsApp = (
    mobileNumber,
    name,
    followupDate,
    followupReason
  ) => {
    if (!mobileNumber) {
      showMessage(
        "Mobile Number",
        "Mobile number not available."
      );
      return;
    }

    let mobile =
      cleanMobileNumber(
        mobileNumber
      );

    if (mobile.startsWith("0")) {
      mobile =
        mobile.substring(1);
    }

    if (mobile.length === 10) {
      mobile = `91${mobile}`;
    }

    if (mobile.length !== 12) {
      showMessage(
        "Invalid Mobile",
        "Please enter a valid 10 digit mobile number."
      );
      return;
    }

    const message =
      `Hello ${
        name || "Patient"
      },\n\n` +
      `This is a friendly reminder from Vision Track regarding your eye care follow-up.\n\n` +
      `📅 Follow-Up Date: ${
        formatDateForInput(
          followupDate
        ) || "Not specified"
      }\n\n` +
      `📝 Reason: ${
        followupReason ||
        "General Eye Review"
      }\n\n` +
      `Please let us know if you need to reschedule your appointment.\n\n` +
      `Thank you,\nVision Track`;

    const encodedMessage =
      encodeURIComponent(
        message
      );

    const webUrl =
      `https://wa.me/${mobile}?text=${encodedMessage}`;

    window.open(
      webUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* ==========================================================
     CALL
  ========================================================== */

  const handleCall = (
    mobileNumber
  ) => {
    if (!mobileNumber) {
      showMessage(
        "Mobile Number",
        "Mobile number not available."
      );
      return;
    }

    const cleanMobile =
      cleanMobileNumber(
        mobileNumber
      );

    if (!cleanMobile) {
      showMessage(
        "Invalid Mobile",
        "Invalid mobile number."
      );
      return;
    }

    window.location.href =
      `tel:${cleanMobile}`;
  };

  /* ==========================================================
     DATE
  ========================================================== */

  const todayString =
    getTodayString();

  const tomorrowString =
    getTomorrowString();

  /* ==========================================================
     NEXT 7 DAYS
  ========================================================== */

  const isWithinNext7Days = (
    dateValue
  ) => {
    if (!dateValue) return false;

    const normalized =
      normalizeDate(dateValue);

    if (!normalized) return false;

    const current =
      new Date(
        `${todayString}T00:00:00`
      );

    const target =
      new Date(
        `${normalized}T00:00:00`
      );

    const weekEnd =
      new Date(
        `${todayString}T00:00:00`
      );

    weekEnd.setDate(
      weekEnd.getDate() + 7
    );

    return (
      target >= current &&
      target <= weekEnd
    );
  };

  /* ==========================================================
     SUMMARY
  ========================================================== */

  const activeReminders =
    reminders.filter(
      (item) =>
        !isCompletedStatus(
          item.status
        )
    );

  const dueToday =
    activeReminders.filter(
      (item) =>
        normalizeDate(
          item.followup_date
        ) === todayString
    ).length;

  const tomorrowCount =
    activeReminders.filter(
      (item) =>
        normalizeDate(
          item.followup_date
        ) === tomorrowString
    ).length;

  const thisWeek =
    activeReminders.filter(
      (item) =>
        isWithinNext7Days(
          item.followup_date
        )
    ).length;

  /* ==========================================================
     FILTERED DATA
  ========================================================== */

  const filteredReminders =
    useMemo(() => {
      return reminders.filter(
        (item) => {
          const followDate =
            normalizeDate(
              item.followup_date
            );

          const completed =
            isCompletedStatus(
              item.status
            );

          if (
            activeFilter ===
            "Completed"
          ) {
            return completed;
          }

          if (completed) {
            return false;
          }

          if (
            activeFilter ===
            "Overdue"
          ) {
            return (
              followDate &&
              followDate <
                todayString
            );
          }

          if (
            activeFilter ===
            "Today"
          ) {
            return (
              followDate ===
              todayString
            );
          }

          if (
            activeFilter ===
            "Tomorrow"
          ) {
            return (
              followDate ===
              tomorrowString
            );
          }

          if (
            activeFilter ===
            "This Week"
          ) {
            return (
              followDate &&
              isWithinNext7Days(
                followDate
              )
            );
          }

          if (
            activeFilter ===
            "Upcoming"
          ) {
            return (
              followDate &&
              followDate >
                todayString
            );
          }

          return true;
        }
      );
    }, [
      reminders,
      activeFilter,
      todayString,
      tomorrowString,
    ]);

  /* ==========================================================
     COMPLETE FOLLOW-UP
  ========================================================== */

  const completeFollowup =
    async (item) => {
      if (
        completingId ||
        !item?.id
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          `Mark follow-up for ${
            item.patient_name ||
            "this patient"
          } as completed?`
        );

      if (!confirmed) return;

      try {
        setCompletingId(item.id);

        const url =
          `${API_BASE}/eyeexam/followups/complete/` +
          `${encodeURIComponent(
            item.id
          )}`;

        const res = await fetch(
          url,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
              Accept:
                "application/json",
            },
          }
        );

        let data;

        try {
          data = await res.json();
        } catch {
          throw new Error(
            `Invalid server response (${res.status})`
          );
        }

        if (
          res.ok &&
          data.success
        ) {
          await loadFollowups();

          showMessage(
            "Success",
            "Follow-up completed successfully."
          );
        } else {
          showMessage(
            "Failed",
            data?.message ||
              "Failed to complete follow-up."
          );
        }
      } catch (error) {
        console.error(
          "COMPLETE ERROR:",
          error
        );

        showMessage(
          "Error",
          error?.message ||
            "Failed to complete follow-up."
        );
      } finally {
        setCompletingId(null);
      }
    };

  /* ==========================================================
     STATUS
  ========================================================== */

  const getStatus = (
    item
  ) => {
    const followDate =
      normalizeDate(
        item.followup_date
      );

    const completed =
      isCompletedStatus(
        item.status
      );

    if (completed) {
      return {
        label: "Completed",
        className:
          "status-completed",
      };
    }

    if (
      followDate ===
      todayString
    ) {
      return {
        label: "Due Today",
        className:
          "status-today",
      };
    }

    if (
      followDate ===
      tomorrowString
    ) {
      return {
        label: "Tomorrow",
        className:
          "status-tomorrow",
      };
    }

    if (
      followDate &&
      followDate < todayString
    ) {
      return {
        label: "Overdue",
        className:
          "status-overdue",
      };
    }

    return {
      label: "Upcoming",
      className:
        "status-upcoming",
    };
  };

  /* ==========================================================
     AVATAR
  ========================================================== */

  const getAvatar = (
    name
  ) => {
    const value = String(
      name || "VT"
    ).trim();

    if (!value) return "VT";

    const parts =
      value.split(/\s+/);

    if (parts.length >= 2) {
      return (
        parts[0][0] +
        parts[1][0]
      ).toUpperCase();
    }

    return value
      .substring(0, 2)
      .toUpperCase();
  };

  /* ==========================================================
     RENDER CARD
  ========================================================== */

  const renderCard = (
    item
  ) => {
    const status =
      getStatus(item);

    const completed =
      isCompletedStatus(
        item.status
      );

    return (
      <div
        className={`followup-card ${
          completed
            ? "completed-card"
            : ""
        }`}
        key={item.id}
      >
        <div className="patient-row">
          <div className="avatar">
            {getAvatar(
              item.patient_name
            )}
          </div>

          <div className="patient-info">
            <div className="patient-name">
              {item.patient_name ||
                "Unknown Patient"}
            </div>

            <div className="date-row">
              <span>📅</span>

              <span>
                {formatDateForInput(
                  item.followup_date
                ) || "-"}
              </span>
            </div>
          </div>

          <span
            className={`status-badge ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        <div className="divider" />

        <div className="patient-details">
          <span>
            ID:{" "}
            {item.patient_id ||
              "-"}
          </span>

          <span>
            {item.mobile || "-"}
          </span>
        </div>

        <div className="reminder-box">
          <div className="medical-icon">
            👁
          </div>

          <div className="note">
            {item.reason ||
              item.exam?.diagnosis ||
              "General Eye Review"}
          </div>
        </div>

        <div className="action-grid">
          <button
            className="action-btn whatsapp-btn"
            onClick={() =>
              handleWhatsApp(
                item.mobile,
                item.patient_name,
                item.followup_date,
                item.reason ||
                  item.exam
                    ?.diagnosis
              )
            }
          >
            <span>💬</span>
            <span>WhatsApp</span>
          </button>

          <button
            className="action-btn call-btn"
            onClick={() =>
              handleCall(
                item.mobile
              )
            }
          >
            <span>📞</span>
            <span>
              {item.mobile ||
                "Call"}
            </span>
          </button>

          {!completed && (
            <button
              className="action-btn complete-btn"
              onClick={() =>
                completeFollowup(
                  item
                )
              }
              disabled={
                completingId ===
                item.id
              }
            >
              {completingId ===
              item.id ? (
                <>
                  <span className="spinner small" />
                  <span>
                    Completing...
                  </span>
                </>
              ) : (
                <>
                  <span>✓</span>
                  <span>
                    Complete
                  </span>
                </>
              )}
            </button>
          )}

          <button
            className="action-btn edit-btn"
            onClick={() =>
              editFollowup(item)
            }
          >
            <span>✏️</span>
            <span>Edit</span>
          </button>

          <button
            className="action-btn delete-btn"
            onClick={() =>
              deleteFollowup(item)
            }
            disabled={
              deletingId ===
              item.id
            }
          >
            {deletingId ===
            item.id ? (
              <>
                <span className="spinner small red-spinner" />
                <span>
                  Deleting...
                </span>
              </>
            ) : (
              <>
                <span>🗑</span>
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  /* ==========================================================
     EMPTY
  ========================================================== */

  const emptyComponent = (
    <div className="empty-container">
      <div className="empty-icon">
        🔕
      </div>

      <div className="empty-title">
        No Follow-ups Found
      </div>

      <div className="empty-subtitle">
        All caught up! Add a new
        reminder to get started.
      </div>
    </div>
  );

  /* ==========================================================
     SUMMARY
  ========================================================== */

  const summaryData = [
    {
      id: "due",
      label: "Due Today",
      value: dueToday,
      icon: "⏰",
      className:
        "summary-red",
    },
    {
      id: "tomorrow",
      label: "Tomorrow",
      value:
        tomorrowCount,
      icon: "🕐",
      className:
        "summary-orange",
    },
    {
      id: "week",
      label: "This Week",
      value: thisWeek,
      icon: "📅",
      className:
        "summary-blue",
    },
  ];

  /* ==========================================================
     NAVIGATION
  ========================================================== */

  const handleBack = () => {
    if (
      window.history.length > 1
    ) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleHome = () => {
    navigate("/dashboard");
  };

  /* ==========================================================
     JSX
  ========================================================== */

  return (
    <>
      <div className="followup-page">
        {/* BACKGROUND */}

        <div className="bg-circle top-right" />
        <div className="bg-circle bottom-left" />

        {/* HEADER */}

        <header className="followup-header">
          <div className="header-left">
            <button
              className="header-icon-btn"
              onClick={
                handleBack
              }
              title="Back"
            >
              ←
            </button>

            <button
              className="header-icon-btn"
              onClick={
                handleHome
              }
              title="Home"
            >
              🏠
            </button>

            <div className="header-title-area">
              <h1>
                Follow-Up
                Reminders
              </h1>

              {!isMobile && (
                <p>
                  Super Admin •
                  Manage patient
                  reviews &
                  recalls
                </p>
              )}
            </div>
          </div>

          <button
            className="new-reminder-btn"
            onClick={
              openNewReminder
            }
          >
            <span>＋</span>

            {!isMobile && (
              <span>
                New Reminder
              </span>
            )}
          </button>
        </header>

        {/* MAIN */}

        <main className="followup-content">
          {/* SUMMARY */}

          <div className="summary-grid">
            {summaryData.map(
              (item) => (
                <div
                  className={`summary-card ${item.className}`}
                  key={item.id}
                >
                  <div className="summary-icon">
                    {item.icon}
                  </div>

                  <div className="summary-label">
                    {item.label}
                  </div>

                  <div className="summary-value">
                    {item.value}
                  </div>
                </div>
              )
            )}
          </div>

          {/* FILTERS */}

          <div className="filter-wrapper">
            <div className="filter-scroll">
              {[
                "All",
                "Today",
                "Tomorrow",
                "This Week",
                "Upcoming",
                "Overdue",
                "Completed",
              ].map(
                (filter) => (
                  <button
                    key={filter}
                    className={`filter-btn ${
                      activeFilter ===
                      filter
                        ? "active-filter"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveFilter(
                        filter
                      )
                    }
                  >
                    {filter}
                  </button>
                )
              )}
            </div>
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="loading-container">
              <span className="spinner" />

              <div>
                Loading
                follow-ups...
              </div>
            </div>
          ) : (
            <>
              {filteredReminders.length ===
              0 ? (
                emptyComponent
              ) : (
                <div
                  className={`followup-list ${
                    isDesktop
                      ? "desktop-list"
                      : ""
                  }`}
                >
                  {filteredReminders.map(
                    (item) =>
                      renderCard(
                        item
                      )
                  )}
                </div>
              )}
            </>
          )}
        </main>

        {/* MODAL */}

        {modal && (
          <div
            className="modal-overlay"
            onMouseDown={(e) => {
              if (
                e.target ===
                e.currentTarget
              ) {
                closeModal();
              }
            }}
          >
            <div className="modal-card">
              {/* MODAL HEADER */}

              <div className="modal-header">
                <div>
                  <h2>
                    {editingItem
                      ? "Edit Follow-Up"
                      : "Schedule Follow-Up"}
                  </h2>

                  <p>
                    {editingItem
                      ? "Update patient follow-up details"
                      : "Select a patient and schedule review dates"}
                  </p>
                </div>

                <button
                  className="modal-close-btn"
                  onClick={
                    closeModal
                  }
                >
                  ×
                </button>
              </div>

              {/* MODAL CONTENT */}

              <div className="modal-body">
                <h3 className="section-heading">
                  👤 Patient Search
                </h3>

                <div className="field">
                  <label>
                    Search Patient
                  </label>

                  <div className="input-wrapper">
                    <span className="input-icon">
                      🔍
                    </span>

                    <input
                      type="text"
                      placeholder="Search by Name, Mobile, or ID..."
                      value={
                        patientSearch
                      }
                      onFocus={() =>
                        setShowPatients(
                          true
                        )
                      }
                      onChange={(e) => {
                        setPatientSearch(
                          e.target
                            .value
                        );

                        setShowPatients(
                          true
                        );
                      }}
                    />
                  </div>

                  {showPatients &&
                    patientSearch
                      .trim()
                      .length >
                      0 && (
                      <div className="patient-dropdown">
                        {filteredPatients.length >
                        0 ? (
                          filteredPatients.map(
                            (
                              patient,
                              index
                            ) => (
                              <button
                                key={
                                  patient.patient_id ||
                                  patient.id ||
                                  index
                                }
                                className="patient-option"
                                onClick={() =>
                                  selectPatient(
                                    patient
                                  )
                                }
                              >
                                <strong>
                                  {patient.name ||
                                    "Unknown"}
                                </strong>

                                <span>
                                  ID:{" "}
                                  {patient.patient_id ||
                                    "-"}{" "}
                                  • Ph:{" "}
                                  {patient.mobile ||
                                    "-"}
                                </span>
                              </button>
                            )
                          )
                        ) : (
                          <div className="no-patient">
                            No patient
                            found
                          </div>
                        )}
                      </div>
                    )}
                </div>

                {/* PATIENT ID / MOBILE */}

                <div className="form-row">
                  <div className="field">
                    <label>
                      Patient ID
                    </label>

                    <div className="input-wrapper disabled">
                      <input
                        value={
                          patientId
                        }
                        readOnly
                        placeholder="Auto-filled"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>
                      Mobile Number
                    </label>

                    <div className="input-wrapper">
                      <input
                        value={
                          mobileNo
                        }
                        placeholder="Enter mobile number"
                        maxLength={
                          10
                        }
                        inputMode="numeric"
                        onChange={(e) =>
                          searchPatientByMobile(
                            e.target
                              .value
                          )
                        }
                      />

                      {mobileSearching && (
                        <span className="spinner small" />
                      )}
                    </div>
                  </div>
                </div>

                {/* TIMING */}

                <h3 className="section-heading">
                  📅 Follow-Up
                  Timing
                </h3>

                {/* DATE */}

                <div className="field">
                  <label>
                    Next Follow-Up
                    Date
                  </label>

                  <div className="input-wrapper">
                    <span className="input-icon">
                      📅
                    </span>

                    <input
                      type="text"
                      placeholder="DD-MM-YYYY"
                      value={date}
                      onChange={(e) =>
                        setDate(
                          e.target
                            .value
                        )
                      }
                      inputMode="numeric"
                    />
                  </div>
                </div>

                {/* REASON */}

                <div className="field">
                  <label>
                    Reason /
                    Clinical Notes
                  </label>

                  <textarea
                    placeholder="e.g., Post-cataract review, Power check"
                    value={reason}
                    onChange={(e) =>
                      setReason(
                        e.target
                          .value
                      )
                    }
                  />
                </div>

                {/* SAVE */}

                <button
                  className="save-btn"
                  onClick={
                    saveFollowup
                  }
                  disabled={
                    saving
                  }
                >
                  {saving ? (
                    <>
                      <span className="spinner small white-spinner" />
                      <span>
                        Saving...
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        {editingItem
                          ? "💾"
                          : "＋"}
                      </span>

                      <span>
                        {editingItem
                          ? "Update Reminder"
                          : "Save Reminder"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================
          ALL STYLES IN SAME FILE
      ====================================================== */}

      <style>{`
        * {
          box-sizing: border-box;
        }

        .followup-page {
          min-height: 100vh;
          width: 100%;
          position: relative;
          overflow-x: hidden;
          background:
            linear-gradient(
              135deg,
              #f7fbff 0%,
              #eef7ff 45%,
              #f8fbff 100%
            );
          color: #172033;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Arial,
            sans-serif;
        }

        .followup-page button,
        .followup-page input,
        .followup-page textarea {
          font-family: inherit;
        }

        .bg-circle {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          filter: blur(1px);
        }

        .top-right {
          width: 360px;
          height: 360px;
          right: -180px;
          top: -180px;
          background: rgba(14, 165, 233, 0.08);
        }

        .bottom-left {
          width: 420px;
          height: 420px;
          left: -220px;
          bottom: -220px;
          background: rgba(37, 99, 235, 0.06);
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .followup-header {
          position: sticky;
          top: 0;
          z-index: 20;
          min-height: 78px;
          padding: 14px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #e4ebf3;
          box-shadow:
            0 4px 20px rgba(15, 23, 42, 0.05);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .header-icon-btn {
          width: 42px;
          height: 42px;
          border: 1px solid #dbe5ef;
          border-radius: 12px;
          background: #ffffff;
          color: #334155;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 20px;
          flex-shrink: 0;
          transition: 0.2s ease;
        }

        .header-icon-btn:hover {
          background: #eff6ff;
          border-color: #93c5fd;
          transform: translateY(-1px);
        }

        .header-title-area {
          margin-left: 8px;
          min-width: 0;
        }

        .header-title-area h1 {
          margin: 0;
          color: #0f172a;
          font-size: 23px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.4px;
        }

        .header-title-area p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.3;
        }

        .new-reminder-btn {
          min-height: 44px;
          padding: 0 18px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            #2563eb,
            #0284c7
          );
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow:
            0 8px 18px rgba(37, 99, 235, 0.22);
          transition: 0.2s ease;
          white-space: nowrap;
        }

        .new-reminder-btn:hover {
          transform: translateY(-1px);
          box-shadow:
            0 11px 24px rgba(37, 99, 235, 0.28);
        }

        .new-reminder-btn span:first-child {
          font-size: 21px;
          line-height: 1;
        }

        /* =====================================================
           CONTENT
        ===================================================== */

        .followup-content {
          position: relative;
          z-index: 1;
          width: min(1400px, 100%);
          margin: 0 auto;
          padding: 28px;
        }

        /* =====================================================
           SUMMARY
        ===================================================== */

        .summary-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 24px;
        }

        .summary-card {
          position: relative;
          min-height: 128px;
          padding: 20px;
          border-radius: 18px;
          border: 1px solid;
          overflow: hidden;
          background: #ffffff;
          box-shadow:
            0 8px 24px rgba(15, 23, 42, 0.05);
          transition: 0.2s ease;
        }

        .summary-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 12px 28px rgba(15, 23, 42, 0.08);
        }

        .summary-red {
          border-color: #fecaca;
          background:
            linear-gradient(
              135deg,
              #fffafa,
              #fff1f2
            );
        }

        .summary-orange {
          border-color: #fed7aa;
          background:
            linear-gradient(
              135deg,
              #fffaf5,
              #fff7ed
            );
        }

        .summary-blue {
          border-color: #bfdbfe;
          background:
            linear-gradient(
              135deg,
              #f8fbff,
              #eff6ff
            );
        }

        .summary-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          box-shadow:
            0 4px 12px rgba(
              15,
              23,
              42,
              0.08
            );
          font-size: 21px;
          margin-bottom: 12px;
        }

        .summary-label {
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
        }

        .summary-value {
          position: absolute;
          right: 22px;
          bottom: 18px;
          color: #0f172a;
          font-size: 34px;
          line-height: 1;
          font-weight: 800;
        }

        /* =====================================================
           FILTERS
        ===================================================== */

        .filter-wrapper {
          width: 100%;
          margin-bottom: 22px;
          overflow: hidden;
        }

        .filter-scroll {
          display: flex;
          align-items: center;
          gap: 9px;
          overflow-x: auto;
          padding: 3px 2px 8px;
          scrollbar-width: thin;
        }

        .filter-scroll::-webkit-scrollbar {
          height: 5px;
        }

        .filter-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 20px;
        }

        .filter-btn {
          flex-shrink: 0;
          border: 1px solid #dbe5ef;
          background: #ffffff;
          color: #475569;
          border-radius: 10px;
          min-height: 40px;
          padding: 0 15px;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .filter-btn:hover {
          border-color: #93c5fd;
          color: #2563eb;
          background: #f8fbff;
        }

        .active-filter {
          color: #ffffff !important;
          border-color: #2563eb !important;
          background: #2563eb !important;
          box-shadow:
            0 5px 13px rgba(
              37,
              99,
              235,
              0.18
            );
        }

        /* =====================================================
           LIST
        ===================================================== */

        .followup-list {
          display: grid;
          grid-template-columns:
            1fr;
          gap: 18px;
        }

        .desktop-list {
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
        }

        .followup-card {
          position: relative;
          padding: 20px;
          border-radius: 18px;
          background: #ffffff;
          border: 1px solid #e3ebf3;
          box-shadow:
            0 8px 24px rgba(
              15,
              23,
              42,
              0.055
            );
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
          min-width: 0;
        }

        .followup-card:hover {
          transform: translateY(-2px);
          border-color: #cbdcf1;
          box-shadow:
            0 13px 32px rgba(
              15,
              23,
              42,
              0.09
            );
        }

        .completed-card {
          opacity: 0.82;
          background: #fbfdff;
        }

        .patient-row {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
        }

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #0ea5e9
            );
          color: #ffffff;
          font-size: 15px;
          font-weight: 800;
          box-shadow:
            0 6px 14px rgba(
              37,
              99,
              235,
              0.2
            );
        }

        .patient-info {
          flex: 1;
          min-width: 0;
        }

        .patient-name {
          color: #172033;
          font-size: 16px;
          font-weight: 800;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .date-row {
          margin-top: 5px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge {
          flex-shrink: 0;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 750;
          border: 1px solid transparent;
          white-space: nowrap;
        }

        .status-completed {
          color: #166534;
          background: #dcfce7;
          border-color: #bbf7d0;
        }

        .status-today {
          color: #b91c1c;
          background: #fee2e2;
          border-color: #fecaca;
        }

        .status-tomorrow {
          color: #c2410c;
          background: #ffedd5;
          border-color: #fed7aa;
        }

        .status-overdue {
          color: #991b1b;
          background: #fef2f2;
          border-color: #fecaca;
        }

        .status-upcoming {
          color: #1d4ed8;
          background: #dbeafe;
          border-color: #bfdbfe;
        }

        .divider {
          height: 1px;
          background: #edf2f7;
          margin: 16px 0;
        }

        .patient-details {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          flex-wrap: wrap;
        }

        .reminder-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 15px;
          padding: 12px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e7edf4;
        }

        .medical-icon {
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #e0f2fe;
          font-size: 15px;
        }

        .note {
          color: #475569;
          font-size: 13px;
          line-height: 1.5;
          word-break: break-word;
        }

        /* =====================================================
           ACTIONS
        ===================================================== */

        .action-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 9px;
          margin-top: 16px;
        }

        .action-btn {
          min-height: 40px;
          padding: 0 11px;
          border-radius: 10px;
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.18s ease;
          min-width: 0;
        }

        .action-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .action-btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .whatsapp-btn {
          color: #15803d;
          background: #f0fdf4;
          border-color: #bbf7d0;
        }

        .whatsapp-btn:hover {
          background: #dcfce7;
        }

        .call-btn {
          color: #0369a1;
          background: #f0f9ff;
          border-color: #bae6fd;
        }

        .call-btn:hover {
          background: #e0f2fe;
        }

        .complete-btn {
          color: #166534;
          background: #f0fdf4;
          border-color: #bbf7d0;
        }

        .complete-btn:hover {
          background: #dcfce7;
        }

        .edit-btn {
          color: #7c3aed;
          background: #faf5ff;
          border-color: #ddd6fe;
        }

        .edit-btn:hover {
          background: #f3e8ff;
        }

        .delete-btn {
          color: #dc2626;
          background: #fff7f7;
          border-color: #fecaca;
        }

        .delete-btn:hover {
          background: #fee2e2;
        }

        /* =====================================================
           LOADING
        ===================================================== */

        .loading-container {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 13px;
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
        }

        .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid #dbeafe;
          border-top-color: #2563eb;
          border-radius: 50%;
          display: inline-block;
          animation:
            followupSpin 0.75s linear infinite;
        }

        .spinner.small {
          width: 16px;
          height: 16px;
          border-width: 2px;
        }

        .white-spinner {
          border-color: rgba(
            255,
            255,
            255,
            0.35
          );
          border-top-color: #ffffff;
        }

        .red-spinner {
          border-color: #fecaca;
          border-top-color: #dc2626;
        }

        @keyframes followupSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================================
           EMPTY
        ===================================================== */

        .empty-container {
          min-height: 320px;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border: 1px dashed #cbd5e1;
          border-radius: 18px;
          background: rgba(
            255,
            255,
            255,
            0.72
          );
        }

        .empty-icon {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          font-size: 32px;
          margin-bottom: 15px;
        }

        .empty-title {
          color: #334155;
          font-size: 18px;
          font-weight: 800;
        }

        .empty-subtitle {
          max-width: 380px;
          margin-top: 6px;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.5;
        }

        /* =====================================================
           MODAL
        ===================================================== */

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(
            15,
            23,
            42,
            0.55
          );
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          overflow-y: auto;
        }

        .modal-card {
          width: min(
            650px,
            100%
          );
          max-height: calc(
            100vh - 40px
          );
          overflow: hidden;
          border-radius: 20px;
          background: #ffffff;
          box-shadow:
            0 30px 70px rgba(
              15,
              23,
              42,
              0.24
            );
          animation:
            modalIn 0.2s ease;
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform:
              translateY(10px)
              scale(0.98);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          padding: 22px 24px;
          border-bottom: 1px solid #e8eef5;
          background:
            linear-gradient(
              135deg,
              #ffffff,
              #f8fbff
            );
        }

        .modal-header h2 {
          margin: 0;
          color: #0f172a;
          font-size: 20px;
          font-weight: 800;
        }

        .modal-header p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.4;
        }

        .modal-close-btn {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #ffffff;
          color: #64748b;
          font-size: 24px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s ease;
        }

        .modal-close-btn:hover {
          background: #fef2f2;
          color: #dc2626;
          border-color: #fecaca;
        }

        .modal-body {
          padding: 24px;
          max-height:
            calc(100vh - 150px);
          overflow-y: auto;
        }

        .section-heading {
          margin: 0 0 15px;
          color: #1e293b;
          font-size: 14px;
          font-weight: 800;
        }

        .section-heading:not(:first-child) {
          margin-top: 25px;
        }

        .field {
          position: relative;
          margin-bottom: 17px;
        }

        .field label {
          display: block;
          margin-bottom: 7px;
          color: #475569;
          font-size: 12px;
          font-weight: 750;
        }

        .input-wrapper {
          position: relative;
          width: 100%;
        }

        .input-wrapper input {
          width: 100%;
          height: 45px;
          padding: 0 13px;
          border: 1px solid #d8e1eb;
          border-radius: 11px;
          outline: none;
          background: #ffffff;
          color: #172033;
          font-size: 13px;
          transition: 0.2s ease;
        }

        .input-wrapper input:focus {
          border-color: #60a5fa;
          box-shadow:
            0 0 0 3px
            rgba(
              37,
              99,
              235,
              0.09
            );
        }

        .input-wrapper.disabled input {
          background: #f8fafc;
          color: #64748b;
          cursor: not-allowed;
        }

        .input-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          font-size: 15px;
          z-index: 1;
        }

        .input-icon + input {
          padding-left: 39px;
        }

        .form-row {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .field textarea {
          width: 100%;
          min-height: 105px;
          resize: vertical;
          padding: 12px 13px;
          border: 1px solid #d8e1eb;
          border-radius: 11px;
          outline: none;
          background: #ffffff;
          color: #172033;
          font-size: 13px;
          line-height: 1.5;
          transition: 0.2s ease;
        }

        .field textarea:focus {
          border-color: #60a5fa;
          box-shadow:
            0 0 0 3px
            rgba(
              37,
              99,
              235,
              0.09
            );
        }

        .field input::placeholder,
        .field textarea::placeholder {
          color: #94a3b8;
        }

        /* =====================================================
           PATIENT DROPDOWN
        ===================================================== */

        .patient-dropdown {
          position: absolute;
          left: 0;
          right: 0;
          top: calc(
            100% + 5px
          );
          z-index: 50;
          max-height: 240px;
          overflow-y: auto;
          border: 1px solid #dbe5ef;
          border-radius: 12px;
          background: #ffffff;
          box-shadow:
            0 14px 30px rgba(
              15,
              23,
              42,
              0.12
            );
        }

        .patient-option {
          width: 100%;
          padding: 12px 13px;
          border: none;
          border-bottom: 1px solid #eef2f7;
          background: #ffffff;
          color: #334155;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          text-align: left;
          cursor: pointer;
          transition: 0.15s ease;
        }

        .patient-option:last-child {
          border-bottom: none;
        }

        .patient-option:hover {
          background: #eff6ff;
        }

        .patient-option strong {
          color: #172033;
          font-size: 13px;
        }

        .patient-option span {
          color: #64748b;
          font-size: 11px;
        }

        .no-patient {
          padding: 16px;
          color: #94a3b8;
          text-align: center;
          font-size: 12px;
        }

        /* =====================================================
           SAVE
        ===================================================== */

        .save-btn {
          width: 100%;
          min-height: 47px;
          margin-top: 5px;
          border: none;
          border-radius: 11px;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #0284c7
            );
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          box-shadow:
            0 8px 18px rgba(
              37,
              99,
              235,
              0.2
            );
          transition: 0.2s ease;
        }

        .save-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow:
            0 11px 24px rgba(
              37,
              99,
              235,
              0.27
            );
        }

        .save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 999px) {
          .followup-content {
            padding: 22px;
          }

          .desktop-list {
            grid-template-columns:
              1fr;
          }
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 599px) {
          .followup-header {
            min-height: 66px;
            padding: 10px 13px;
            gap: 8px;
          }

          .header-left {
            gap: 6px;
          }

          .header-icon-btn {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            font-size: 17px;
          }

          .header-title-area {
            margin-left: 3px;
          }

          .header-title-area h1 {
            font-size: 17px;
          }

          .new-reminder-btn {
            width: 40px;
            min-height: 40px;
            padding: 0;
            border-radius: 10px;
          }

          .new-reminder-btn span:first-child {
            font-size: 22px;
          }

          .followup-content {
            padding: 16px 13px 25px;
          }

          .summary-grid {
            gap: 9px;
            margin-bottom: 17px;
          }

          .summary-card {
            min-height: 105px;
            padding: 13px;
            border-radius: 14px;
          }

          .summary-icon {
            width: 32px;
            height: 32px;
            margin-bottom: 7px;
            border-radius: 9px;
            font-size: 16px;
          }

          .summary-label {
            font-size: 10px;
          }

          .summary-value {
            right: 13px;
            bottom: 14px;
            font-size: 25px;
          }

          .filter-wrapper {
            margin-bottom: 15px;
          }

          .filter-btn {
            min-height: 36px;
            padding: 0 12px;
            border-radius: 9px;
            font-size: 11px;
          }

          .followup-list {
            gap: 13px;
          }

          .followup-card {
            padding: 14px;
            border-radius: 15px;
          }

          .patient-row {
            gap: 9px;
            align-items: flex-start;
          }

          .avatar {
            width: 42px;
            height: 42px;
            border-radius: 11px;
            font-size: 13px;
          }

          .patient-name {
            font-size: 14px;
          }

          .date-row {
            font-size: 11px;
          }

          .status-badge {
            padding: 5px 7px;
            font-size: 9px;
          }

          .divider {
            margin: 12px 0;
          }

          .patient-details {
            font-size: 10px;
          }

          .reminder-box {
            margin-top: 12px;
            padding: 10px;
          }

          .medical-icon {
            width: 27px;
            height: 27px;
            border-radius: 8px;
            font-size: 13px;
          }

          .note {
            font-size: 11px;
          }

          .action-grid {
            gap: 7px;
            margin-top: 12px;
          }

          .action-btn {
            min-height: 37px;
            padding: 0 6px;
            border-radius: 9px;
            gap: 4px;
            font-size: 10px;
          }

          .empty-container {
            min-height: 260px;
            padding: 30px 15px;
          }

          .empty-icon {
            width: 60px;
            height: 60px;
            border-radius: 17px;
            font-size: 26px;
          }

          .empty-title {
            font-size: 16px;
          }

          .empty-subtitle {
            font-size: 11px;
          }

          .modal-overlay {
            padding: 0;
            align-items: flex-end;
          }

          .modal-card {
            width: 100%;
            max-height: 94vh;
            border-radius:
              20px 20px 0 0;
          }

          .modal-header {
            padding: 17px;
          }

          .modal-header h2 {
            font-size: 17px;
          }

          .modal-header p {
            font-size: 10px;
          }

          .modal-body {
            padding: 17px;
            max-height:
              calc(94vh - 75px);
          }

          .section-heading {
            font-size: 12px;
            margin-bottom: 12px;
          }

          .section-heading:not(:first-child) {
            margin-top: 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .field {
            margin-bottom: 14px;
          }

          .field label {
            font-size: 11px;
          }

          .input-wrapper input {
            height: 43px;
            font-size: 12px;
          }

          .field textarea {
            min-height: 90px;
            font-size: 12px;
          }

          .save-btn {
            min-height: 45px;
            font-size: 12px;
          }
        }

        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 380px) {
          .header-title-area h1 {
            font-size: 15px;
          }

          .header-icon-btn {
            width: 35px;
            height: 35px;
          }

          .new-reminder-btn {
            width: 37px;
            min-height: 37px;
          }

          .summary-card {
            min-height: 98px;
            padding: 10px;
          }

          .summary-label {
            font-size: 9px;
          }

          .summary-value {
            font-size: 22px;
            right: 10px;
            bottom: 10px;
          }

          .action-btn {
            font-size: 9px;
          }

          .status-badge {
            font-size: 8px;
          }
        }
      `}</style>
    </>
  );
}