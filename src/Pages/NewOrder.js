
import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

/* =========================================================
   API
========================================================= */

const API_BASE =
  "https://visiontrackdatabase.onrender.com";

/* =========================================================
   DATE
========================================================= */

const today = () =>
  new Date().toISOString().split("T")[0];

/* =========================================================
   ICON
========================================================= */

const Icon = ({
  children,
  className = ""
}) => (
  <span className={`icon ${className}`}>
    {children}
  </span>
);

/* =========================================================
   INPUT FIELD
========================================================= */

const InputField = ({
  label,
  value,
  setValue,
  placeholder,
  type = "text",
  editable = true,
  textarea = false,
  className = "",
  onFocus
}) => {
  return (
    <div className={`field-container ${className}`}>
      {label && (
        <label className="field-label">
          {label}
        </label>
      )}

      <div
        className={`input-wrapper ${
          !editable
            ? "disabled-input-wrapper"
            : ""
        }`}
      >
        {textarea ? (
          <textarea
            value={value || ""}
            onChange={(e) =>
              setValue &&
              setValue(e.target.value)
            }
            onFocus={onFocus}
            placeholder={placeholder}
            disabled={!editable}
            className={`text-input textarea-input ${
              !editable
                ? "disabled-text"
                : ""
            }`}
          />
        ) : (
          <input
            type={type}
            value={value || ""}
            onChange={(e) =>
              setValue &&
              setValue(e.target.value)
            }
            onFocus={onFocus}
            placeholder={placeholder}
            disabled={!editable}
            className={`text-input ${
              !editable
                ? "disabled-text"
                : ""
            }`}
          />
        )}
      </div>
    </div>
  );
};

/* =========================================================
   DATE FIELD
========================================================= */

const DateField = ({
  label,
  value,
  onChange
}) => {
  return (
    <div className="field-container">
      {label && (
        <label className="field-label">
          {label}
        </label>
      )}

      <div className="input-wrapper date-wrapper">
        <input
          type="date"
          value={
            value
              ? String(value).split("T")[0]
              : ""
          }
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="date-input"
        />

        <Icon>📅</Icon>
      </div>
    </div>
  );
};

/* =========================================================
   FORM ROW
========================================================= */

const FormRow = ({
  children,
  className = ""
}) => (
  <div
    className={`form-row ${className}`}
  >
    {children}
  </div>
);

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function NewOrder() {
  const navigate = useNavigate();
  const location = useLocation();

  /* =======================================================
     ROUTE STATE
  ======================================================= */

  const routeState =
    location.state || {};

  const routePatient =
    routeState.patient || null;

  const routeOrder =
    routeState.order || null;

  const routeMode =
    routeState.mode ||
    (routeOrder
      ? "edit"
      : "add");

  const isEditMode =
    routeMode === "edit" &&
    !!routeOrder?.id;

  /* =======================================================
     PATIENTS
  ======================================================= */

  const [patients, setPatients] =
    useState(
      Array.isArray(
        routeState.patients
      )
        ? routeState.patients
        : []
    );

  const [
    showPatientDropdown,
    setShowPatientDropdown
  ] = useState(false);

  const [
    mobileSearching,
    setMobileSearching
  ] = useState(false);

  /* =======================================================
     PATIENT
  ======================================================= */

  const [customer, setCustomer] =
    useState("");

  const [patientId, setPatientId] =
    useState("");

  const [mobileNumber, setMobileNumber] =
    useState("");

  const [age, setAge] =
    useState("");

  const [gender, setGender] =
    useState("");

  /* =======================================================
     DATE / STATUS
  ======================================================= */

  const [orderDate, setOrderDate] =
    useState(today());

  const [deliveryDate, setDeliveryDate] =
    useState("");

  const [
    nextReminderDate,
    setNextReminderDate
  ] = useState("");

  const [orderStatus, setOrderStatus] =
    useState("Pending");

  /* =======================================================
     PRESCRIPTION
  ======================================================= */

  const [reSph, setReSph] =
    useState("");

  const [reCyl, setReCyl] =
    useState("");

  const [reAxis, setReAxis] =
    useState("");

  const [reAdd, setReAdd] =
    useState("");

  const [leSph, setLeSph] =
    useState("");

  const [leCyl, setLeCyl] =
    useState("");

  const [leAxis, setLeAxis] =
    useState("");

  const [leAdd, setLeAdd] =
    useState("");

  const [pd, setPd] =
    useState("");

  const [notes, setNotes] =
    useState("");

  /* =======================================================
     PRODUCT
  ======================================================= */

  const [frame, setFrame] =
    useState("");

  const [frameModel, setFrameModel] =
    useState("");

  const [lens, setLens] =
    useState("");

  /* =======================================================
     PAYMENT
  ======================================================= */

  const [amount, setAmount] =
    useState("");

  const [advance, setAdvance] =
    useState("");

  const [balance, setBalance] =
    useState("0");

  const [paymentMode, setPaymentMode] =
    useState("Cash");

  const [billNumber, setBillNumber] =
    useState("");

  /* =======================================================
     UI
  ======================================================= */

  const [
    activeRefractionField,
    setActiveRefractionField
  ] = useState(null);

  const [loading, setLoading] =
    useState(false);

  /* =======================================================
     INVENTORY
  ======================================================= */

  const [inventoryItem, setInventoryItem] =
    useState(null);

  const [
    showInventoryDropdown,
    setShowInventoryDropdown
  ] = useState(false);

  const [stockLoading, setStockLoading] =
    useState(false);

  /* =========================================================
     LOAD PATIENTS
     NO STORE CODE
  ========================================================= */

  useEffect(() => {
    const loadPatients = async () => {
      try {
        if (patients.length > 0) {
          return;
        }

        const response =
          await fetch(
            `${API_BASE}/patient?role=superadmin`
          );

        if (!response.ok) {
          console.error(
            "LOAD PATIENTS FAILED:",
            response.status
          );
          return;
        }

        const data =
          await response.json();

        if (
          data.success &&
          Array.isArray(
            data.patients
          )
        ) {
          setPatients(
            data.patients
          );
        }
      } catch (error) {
        console.error(
          "LOAD PATIENTS ERROR:",
          error
        );
      }
    };

    loadPatients();
  }, [patients.length]);

  /* =========================================================
     LOAD LATEST EYE EXAM
     NO STORE CODE
  ========================================================= */

  const loadLatestEyeExam =
    async (
      patientIdValue
    ) => {
      if (!patientIdValue) {
        console.log(
          "No patient ID provided"
        );
        return;
      }

      try {
        const response =
          await fetch(
            `${API_BASE}/eyeexam/super-admin`
          );

        if (!response.ok) {
          console.log(
            "Eye exam fetch failed:",
            response.status
          );
          return;
        }

        const result =
          await response.json();

        console.log(
          "EYE EXAM API RESPONSE:",
          result
        );

        let exams =
          Array.isArray(
            result?.exams
          )
            ? result.exams
            : [];

        exams =
          exams.filter(
            (exam) =>
              String(
                exam.patient_id || ""
              ).trim() ===
              String(
                patientIdValue
              ).trim()
          );

        if (exams.length === 0) {
          setReSph("");
          setReCyl("");
          setReAxis("");
          setReAdd("");

          setLeSph("");
          setLeCyl("");
          setLeAxis("");
          setLeAdd("");

          setPd("");

          return;
        }

        const latestExam =
          [...exams].sort(
            (a, b) => {
              const dateA =
                new Date(
                  a.exam_date ||
                    a.created_at ||
                    a.updated_at ||
                    0
                );

              const dateB =
                new Date(
                  b.exam_date ||
                    b.created_at ||
                    b.updated_at ||
                    0
                );

              return dateB - dateA;
            }
          )[0];

        console.log(
          "LATEST EYE EXAM:",
          latestExam
        );

        /* RIGHT EYE */

        setReSph(
          latestExam.right_sph ??
            ""
        );

        setReCyl(
          latestExam.right_cyl ??
            ""
        );

        setReAxis(
          latestExam.right_axis ??
            ""
        );

        setReAdd(
          latestExam.right_add ??
            latestExam.add_power ??
            ""
        );

        /* LEFT EYE */

        setLeSph(
          latestExam.left_sph ??
            ""
        );

        setLeCyl(
          latestExam.left_cyl ??
            ""
        );

        setLeAxis(
          latestExam.left_axis ??
            ""
        );

        setLeAdd(
          latestExam.left_add ??
            latestExam.add_power ??
            ""
        );

        /* PD */

        setPd(
          latestExam.pd ?? ""
        );
      } catch (error) {
        console.error(
          "LOAD EYE EXAM ERROR:",
          error
        );
      }
    };

  /* =========================================================
     LOAD PATIENT FROM ROUTE
  ========================================================= */

  useEffect(() => {
    if (!routePatient) {
      return;
    }

    const id =
      routePatient.patient_id ||
      "";

    setPatientId(id);

    setCustomer(
      routePatient.name || ""
    );

    setMobileNumber(
      routePatient.mobile || ""
    );

    setAge(
      routePatient.age !== null &&
      routePatient.age !== undefined
        ? String(
            routePatient.age
          )
        : ""
    );

    setGender(
      routePatient.gender || ""
    );

    if (id) {
      loadLatestEyeExam(id);
    }
  }, [routePatient]);

  /* =========================================================
     LOAD EDIT ORDER
  ========================================================= */

  useEffect(() => {
    if (
      !isEditMode ||
      !routeOrder
    ) {
      return;
    }

    console.log(
      "EDIT ORDER RECEIVED:",
      routeOrder
    );

    setPatientId(
      routeOrder.patient_id ||
        ""
    );

    setCustomer(
      routeOrder.patient_name ||
        routeOrder.name ||
        ""
    );

    setMobileNumber(
      routeOrder.mobile ||
        ""
    );

    setAge(
      routeOrder.age !== null &&
      routeOrder.age !== undefined
        ? String(
            routeOrder.age
          )
        : ""
    );

    setGender(
      routeOrder.gender ||
        ""
    );

    setOrderDate(
      routeOrder.order_date
        ? String(
            routeOrder.order_date
          ).split("T")[0]
        : today()
    );

    setDeliveryDate(
      routeOrder.expected_delivery
        ? String(
            routeOrder.expected_delivery
          ).split("T")[0]
        : ""
    );

    setNextReminderDate(
      routeOrder.next_reminder_date
        ? String(
            routeOrder.next_reminder_date
          ).split("T")[0]
        : ""
    );

    setFrame(
      routeOrder.frame_barcode ||
        ""
    );

    setFrameModel(
      routeOrder.frame_model ||
        ""
    );

    setLens(
      routeOrder.lens_type ||
        ""
    );

    setAmount(
      routeOrder.total_amount !==
        null &&
      routeOrder.total_amount !==
        undefined
        ? String(
            routeOrder.total_amount
          )
        : ""
    );

    setAdvance(
      routeOrder.advance_paid !==
        null &&
      routeOrder.advance_paid !==
        undefined
        ? String(
            routeOrder.advance_paid
          )
        : ""
    );

    setBalance(
      routeOrder.balance_amount !==
        null &&
      routeOrder.balance_amount !==
        undefined
        ? String(
            routeOrder.balance_amount
          )
        : "0"
    );

    setOrderStatus(
      routeOrder.status ||
        "Pending"
    );

    setPaymentMode(
      routeOrder.payment_mode ||
        "Cash"
    );

    setBillNumber(
      routeOrder.bill_number ||
        ""
    );

    const prescription =
      routeOrder.prescription_notes ||
      "";

    const getPrescriptionValue =
      (label) => {
        const regex =
          new RegExp(
            `${label}:\\s*([^|]*)`,
            "i"
          );

        const match =
          prescription.match(
            regex
          );

        return match
          ? match[1].trim()
          : "";
      };

    setReSph(
      getPrescriptionValue(
        "RE SPH"
      )
    );

    setReCyl(
      getPrescriptionValue(
        "RE CYL"
      )
    );

    setReAxis(
      getPrescriptionValue(
        "RE AXIS"
      )
    );

    setReAdd(
      getPrescriptionValue(
        "RE ADD"
      )
    );

    setLeSph(
      getPrescriptionValue(
        "LE SPH"
      )
    );

    setLeCyl(
      getPrescriptionValue(
        "LE CYL"
      )
    );

    setLeAxis(
      getPrescriptionValue(
        "LE AXIS"
      )
    );

    setLeAdd(
      getPrescriptionValue(
        "LE ADD"
      )
    );

    setPd(
      getPrescriptionValue(
        "PD"
      )
    );

    setNotes(
      getPrescriptionValue(
        "Notes"
      )
    );
  }, [
    isEditMode,
    routeOrder
  ]);

  /* =========================================================
     SPH LIST
  ========================================================= */

  const sphList =
    useMemo(() => {
      const values = [];

      for (
        let v = 0.25;
        v <= 5;
        v += 0.25
      ) {
        values.push(
          `+${v.toFixed(2)}`
        );
      }

      for (
        let v = 5.5;
        v <= 10;
        v += 0.5
      ) {
        values.push(
          `+${v.toFixed(2)}`
        );
      }

      for (
        let v = 11;
        v <= 20;
        v += 1
      ) {
        values.push(
          `+${v.toFixed(2)}`
        );
      }

      values.push("0.00");

      for (
        let v = 0.25;
        v <= 5;
        v += 0.25
      ) {
        values.push(
          `-${v.toFixed(2)}`
        );
      }

      for (
        let v = 5.5;
        v <= 10;
        v += 0.5
      ) {
        values.push(
          `-${v.toFixed(2)}`
        );
      }

      for (
        let v = 11;
        v <= 20;
        v += 1
      ) {
        values.push(
          `-${v.toFixed(2)}`
        );
      }

      return values;
    }, []);

  /* =========================================================
     CYL LIST
  ========================================================= */

  const cylList =
    useMemo(() => {
      const values = [];

      for (
        let v = 0.25;
        v <= 3;
        v += 0.25
      ) {
        values.push(
          `+${v.toFixed(2)}`
        );
      }

      for (
        let v = 3.5;
        v <= 6;
        v += 0.5
      ) {
        values.push(
          `+${v.toFixed(2)}`
        );
      }

      values.push("0.00");

      for (
        let v = 0.25;
        v <= 3;
        v += 0.25
      ) {
        values.push(
          `-${v.toFixed(2)}`
        );
      }

      for (
        let v = 3.5;
        v <= 6;
        v += 0.5
      ) {
        values.push(
          `-${v.toFixed(2)}`
        );
      }

      return values;
    }, []);

  /* =========================================================
     AXIS
  ========================================================= */

  const axisList =
    useMemo(
      () =>
        Array.from(
          { length: 180 },
          (_, index) =>
            String(index + 1)
        ),
      []
    );

  /* =========================================================
     PRESCRIPTION DROPDOWN
  ========================================================= */

  const PrescriptionDropdown = ({
    value,
    items,
    onChange,
    name,
    title
  }) => {
    const isOpen =
      activeRefractionField ===
      name;

    return (
      <>
        <button
          type="button"
          className="prescription-select-button"
          onClick={() =>
            setActiveRefractionField(
              name
            )
          }
        >
          <span
            className={
              value
                ? "prescription-select-text"
                : "prescription-placeholder"
            }
          >
            {value || "Select"}
          </span>

          <span>⌄</span>
        </button>

        {isOpen && (
          <div
            className="prescription-modal-overlay"
            onMouseDown={(e) => {
              if (
                e.target ===
                e.currentTarget
              ) {
                setActiveRefractionField(
                  null
                );
              }
            }}
          >
            <div className="prescription-modal-box">
              <div className="prescription-modal-header">
                <strong>
                  {title ||
                    "Select Value"}
                </strong>

                <button
                  type="button"
                  className="modal-close-button"
                  onClick={() =>
                    setActiveRefractionField(
                      null
                    )
                  }
                >
                  ✕
                </button>
              </div>

              <div className="prescription-current-value-box">
                <span>
                  Selected
                </span>

                <strong>
                  {value || "None"}
                </strong>
              </div>

              <div className="prescription-options-list">
                {items.map(
                  (
                    item,
                    index
                  ) => (
                    <button
                      type="button"
                      key={`${name}-${item}-${index}`}
                      className={`prescription-option ${
                        item === value
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => {
                        onChange(
                          item
                        );

                        setActiveRefractionField(
                          null
                        );
                      }}
                    >
                      <span>
                        {item}
                      </span>

                      {item ===
                        value && (
                        <span>
                          ✓
                        </span>
                      )}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  /* =========================================================
     SPH STEP
  ========================================================= */

  const changeSph =
    (
      value,
      type
    ) => {
      let num =
        parseFloat(
          value
        ) || 0;

      if (
        type === "plus"
      ) {
        if (
          Math.abs(num) < 5
        ) {
          num += 0.25;
        } else if (
          Math.abs(num) < 10
        ) {
          num += 0.5;
        } else {
          num += 1;
        }
      } else {
        if (
          Math.abs(num) <= 5
        ) {
          num -= 0.25;
        } else if (
          Math.abs(num) <= 10
        ) {
          num -= 0.5;
        } else {
          num -= 1;
        }
      }

      if (num > 20)
        num = 20;

      if (num < -20)
        num = -20;

      return num > 0
        ? `+${num.toFixed(2)}`
        : num.toFixed(2);
    };

  const SphDropdownControl =
    ({
      value,
      setValue,
      name,
      title
    }) => (
      <div className="prescription-control">
        <button
          type="button"
          className="prescription-step-button"
          onClick={() =>
            setValue(
              changeSph(
                value,
                "minus"
              )
            )
          }
        >
          −
        </button>

        <div className="prescription-value-container">
          <PrescriptionDropdown
            name={name}
            title={title}
            value={value}
            items={sphList}
            onChange={setValue}
          />
        </div>

        <button
          type="button"
          className="prescription-step-button"
          onClick={() =>
            setValue(
              changeSph(
                value,
                "plus"
              )
            )
          }
        >
          +
        </button>
      </div>
    );

  /* =========================================================
     CYL STEP
  ========================================================= */

  const calculateCylStep =
    (
      current,
      direction
    ) => {
      let value =
        parseFloat(
          current
        ) || 0;

      let nextValue =
        value;

      if (
        direction === "plus"
      ) {
        if (
          Math.abs(value) < 3
        ) {
          nextValue =
            value + 0.25;
        } else {
          nextValue =
            value + 0.5;
        }
      } else {
        if (
          Math.abs(value) <= 3
        ) {
          nextValue =
            value - 0.25;
        } else {
          nextValue =
            value - 0.5;
        }
      }

      if (
        direction ===
          "plus" &&
        value === 3
      ) {
        nextValue = 3.5;
      }

      if (
        direction ===
        "minus"
      ) {
        if (value === 3) {
          nextValue = 2.75;
        }

        if (value === 3.5) {
          nextValue = 3;
        }
      }

      if (
        nextValue > 6
      ) {
        nextValue = 6;
      }

      if (
        nextValue < -6
      ) {
        nextValue = -6;
      }

      return nextValue > 0
        ? `+${nextValue.toFixed(
            2
          )}`
        : nextValue.toFixed(2);
    };

  const CylDropdownControl =
    ({
      value,
      setValue,
      name,
      title
    }) => (
      <div className="prescription-control">
        <button
          type="button"
          className="prescription-step-button"
          onClick={() =>
            setValue(
              calculateCylStep(
                value,
                "minus"
              )
            )
          }
        >
          −
        </button>

        <div className="prescription-value-container">
          <PrescriptionDropdown
            name={name}
            title={title}
            value={value}
            items={cylList}
            onChange={setValue}
          />
        </div>

        <button
          type="button"
          className="prescription-step-button"
          onClick={() =>
            setValue(
              calculateCylStep(
                value,
                "plus"
              )
            )
          }
        >
          +
        </button>
      </div>
    );

  /* =========================================================
     PATIENT SELECT
  ========================================================= */

  const handlePatientSelect =
    async (p) => {
      if (!p) return;

      const id =
        p.patient_id ||
        `PT-${p.id || Date.now()}`;

      setPatientId(id);

      setCustomer(
        p.name || ""
      );

      setMobileNumber(
        p.mobile || ""
      );

      setAge(
        String(
          p.age || ""
        )
      );

      setGender(
        p.gender || ""
      );

      setShowPatientDropdown(
        false
      );

      if (p.patient_id) {
        await loadLatestEyeExam(
          p.patient_id
        );
      }
    };

  /* =========================================================
     MOBILE SEARCH
     NO STORE CODE
  ========================================================= */

  const handleMobileChange =
    async (mobile) => {
      setMobileNumber(
        mobile
      );

      const search =
        String(
          mobile || ""
        ).trim();

      if (
        search.length < 3
      ) {
        return;
      }

      setMobileSearching(
        true
      );

      try {
        const localPatient =
          patients.find(
            (p) =>
              String(
                p.mobile || ""
              ).includes(
                search
              )
          );

        if (localPatient) {
          setPatientId(
            localPatient.patient_id ||
              `PT-${localPatient.id}`
          );

          setCustomer(
            localPatient.name ||
              ""
          );

          setAge(
            String(
              localPatient.age ||
                ""
            )
          );

          setGender(
            localPatient.gender ||
              ""
          );

          if (
            localPatient.patient_id
          ) {
            await loadLatestEyeExam(
              localPatient.patient_id
            );
          }

          return;
        }

        const response =
          await fetch(
            `${API_BASE}/patient?role=superadmin`
          );

        if (!response.ok) {
          return;
        }

        const data =
          await response.json();

        const list =
          Array.isArray(
            data?.patients
          )
            ? data.patients
            : [];

        setPatients(list);

        const patientObj =
          list.find(
            (p) =>
              String(
                p.mobile || ""
              ).includes(
                search
              )
          );

        if (patientObj) {
          setPatientId(
            patientObj.patient_id ||
              `PT-${patientObj.id}`
          );

          setCustomer(
            patientObj.name ||
              ""
          );

          setAge(
            String(
              patientObj.age ||
                ""
            )
          );

          setGender(
            patientObj.gender ||
              ""
          );

          if (
            patientObj.patient_id
          ) {
            await loadLatestEyeExam(
              patientObj.patient_id
            );
          }
        }
      } catch (error) {
        console.error(
          "MOBILE SEARCH ERROR:",
          error
        );
      } finally {
        setMobileSearching(
          false
        );
      }
    };

  /* =========================================================
     INVENTORY SEARCH
     NO STORE CODE
  ========================================================= */

  const fetchStockInventory =
    async (barcode) => {
      const searchValue =
        String(
          barcode || ""
        ).trim();

      if (!searchValue) {
        setInventoryItem(
          null
        );

        setShowInventoryDropdown(
          false
        );

        return;
      }

      try {
        setStockLoading(
          true
        );

        const response =
          await fetch(
            `${API_BASE}/stockinventory/barcode/${encodeURIComponent(
              searchValue
            )}?role=superadmin`
          );

        const data =
          await response.json();

        if (!response.ok) {
          console.log(
            "Inventory search failed:",
            data
          );

          return;
        }

        if (
          !data?.success ||
          !data?.item
        ) {
          setInventoryItem(
            null
          );

          setShowInventoryDropdown(
            false
          );

          setFrameModel(
            ""
          );

          setLens("");

          setAmount("");

          return;
        }

        const item =
          data.item;

        setInventoryItem(
          item
        );

        setShowInventoryDropdown(
          true
        );

        setFrame(
          item.barcode ||
            item.product_code ||
            item.stock_code ||
            searchValue
        );

        setFrameModel(
          item.product_name ||
            item.model ||
            item.frame_model ||
            item.frame_name ||
            ""
        );

        setLens(
          item.category ||
            item.lens_type ||
            item.product_category ||
            ""
        );

        setAmount(
          String(
            item.sale_price ??
              item.selling_price ??
              item.price ??
              item.amount ??
              0
          )
        );
      } catch (error) {
        console.error(
          "STOCK INVENTORY ERROR:",
          error
        );
      } finally {
        setStockLoading(
          false
        );
      }
    };

  /* =========================================================
     BARCODE
  ========================================================= */

  const handleBarcodeChange =
    (barcode) => {
      setFrame(
        barcode
      );

      if (
        barcode &&
        barcode.trim()
      ) {
        fetchStockInventory(
          barcode
        );
      } else {
        setInventoryItem(
          null
        );

        setShowInventoryDropdown(
          false
        );
      }
    };

  /* =========================================================
     INVENTORY SELECT
  ========================================================= */

  const handleInventorySelect =
    (item) => {
      if (!item) return;

      setInventoryItem(
        item
      );

      setFrame(
        item.barcode ||
          item.product_code ||
          item.stock_code ||
          frame
      );

      setFrameModel(
        item.product_name ||
          item.model ||
          item.frame_model ||
          item.frame_name ||
          ""
      );

      setLens(
        item.lens_type ||
          item.category ||
          item.product_category ||
          ""
      );

      setAmount(
        String(
          item.sale_price ??
            item.selling_price ??
            item.price ??
            item.amount ??
            0
        )
      );

      setShowInventoryDropdown(
        false
      );
    };

  /* =========================================================
     BALANCE
  ========================================================= */

  const calculateBalance =
    (
      total,
      paid
    ) => {
      const totalValue =
        parseFloat(total) ||
        0;

      const paidValue =
        parseFloat(paid) ||
        0;

      const remaining =
        totalValue -
        paidValue;

      setBalance(
        remaining >= 0
          ? remaining.toString()
          : "0"
      );
    };

  /* =========================================================
     NEXT BILL NUMBER
     NO STORE CODE
  ========================================================= */

  const loadNextBillNumber =
    async () => {
      try {
        const response =
          await fetch(
            `${API_BASE}/opticalorders/next-bill-number?role=superadmin`
          );

        const data =
          await response.json();

        if (!response.ok) {
          console.error(
            "NEXT BILL ERROR:",
            data
          );

          return;
        }

        const nextBill =
          data.nextBillNumber ??
          data.next_bill_number ??
          data.nextBill ??
          data.orders?.bill_number ??
          null;

        if (
          nextBill !== null &&
          nextBill !== undefined &&
          nextBill !== ""
        ) {
          setBillNumber(
            String(
              nextBill
            )
          );
        }
      } catch (error) {
        console.error(
          "LOAD NEXT BILL ERROR:",
          error
        );
      }
    };

  useEffect(() => {
    if (!isEditMode) {
      loadNextBillNumber();
    }
  }, [isEditMode]);

  /* =========================================================
     ORDER DATA
  ========================================================= */

  const buildOrderData =
    async () => {
      const totalAmount =
        Number(amount) || 0;

      const advancePaid =
        Number(advance) || 0;

      const balanceAmount =
        Math.max(
          totalAmount -
            advancePaid,
          0
        );

      const paymentStatus =
        balanceAmount <= 0
          ? "Paid"
          : "Due";

      return {
        /* ROLE */

        role: "superadmin",

        /* ORDER */

        bill_number:
          billNumber || null,

        order_no:
          billNumber ||
          routeOrder?.order_no ||
          `ORD-${Date.now()}`,

        order_date:
          orderDate || null,

        expected_delivery:
          deliveryDate || null,

        /* PATIENT */

        patient_id:
          patientId || null,

        patient_name:
          customer || null,

        mobile:
          mobileNumber || null,

        age:
          age
            ? Number(age)
            : null,

        gender:
          gender || null,

        /* PRODUCT */

        frame_barcode:
          frame || null,

        frame_model:
          frameModel || null,

        lens_type:
          lens || null,

        /* REMINDER */

        next_reminder_date:
          nextReminderDate ||
          null,

        /* PRESCRIPTION */

        prescription_notes: [
          `RE SPH: ${reSph || ""}`,
          `RE CYL: ${reCyl || ""}`,
          `RE AXIS: ${reAxis || ""}`,
          `RE ADD: ${reAdd || ""}`,

          `LE SPH: ${leSph || ""}`,
          `LE CYL: ${leCyl || ""}`,
          `LE AXIS: ${leAxis || ""}`,
          `LE ADD: ${leAdd || ""}`,

          `PD: ${pd || ""}`,

          `Notes: ${notes || ""}`
        ].join(" | "),

        /* PAYMENT */

        total_amount:
          totalAmount,

        advance_paid:
          advancePaid,

        balance_amount:
          balanceAmount,

        status:
          orderStatus ||
          "Pending",

        payment_status:
          paymentStatus,

        payment_mode:
          paymentMode ||
          "Cash"
      };
    };

  /* =========================================================
     SUBMIT ORDER
  ========================================================= */

  const submitOrder =
    async (
      orderData
    ) => {
      try {
        const editing =
          isEditMode &&
          routeOrder?.id;

        const url = editing
          ? `${API_BASE}/opticalorders/${routeOrder.id}`
          : `${API_BASE}/opticalorders/add`;

        console.log(
          "OPTICAL ORDER DATA:",
          JSON.stringify(
            orderData,
            null,
            2
          )
        );

        const response =
          await fetch(
            url,
            {
              method:
                editing
                  ? "PUT"
                  : "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(
                  orderData
                )
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          window.alert(
            data?.message ||
              (
                editing
                  ? "Failed to update order."
                  : "Failed to create order."
              )
          );

          return null;
        }

        return data;
      } catch (error) {
        console.error(
          "SUBMIT ORDER ERROR:",
          error
        );

        window.alert(
          error?.message ||
            "Unable to save order."
        );

        return null;
      }
    };

  /* =========================================================
     WHATSAPP HISTORY
     NO STORE CODE
  ========================================================= */

  const saveWhatsAppHistory =
    async ({
      savedOrderId,
      message
    }) => {
      try {
        const response =
          await fetch(
            `${API_BASE}/whatsapp/history`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                role:
                  "superadmin",

                order_id:
                  savedOrderId,

                patient_id:
                  patientId || null,

                patient_name:
                  customer || null,

                mobile:
                  mobileNumber || null,

                message,

                message_type:
                  "optical_order"
              })
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          console.log(
            "WhatsApp history failed:",
            data
          );
        } else {
          console.log(
            "WhatsApp history saved:",
            data
          );
        }
      } catch (error) {
        console.error(
          "WHATSAPP HISTORY ERROR:",
          error
        );
      }
    };

  /* =========================================================
     CREATE WHATSAPP MESSAGE
  ========================================================= */

  const createOrderWhatsAppMessage =
    (orderData) => {
      const productName =
        frameModel ||
        lens ||
        "Spectacles";

      const orderNumber =
        billNumber ||
        orderData.order_no ||
        "-";

      const totalAmount =
        Number(
          orderData.total_amount
        ) || 0;

      const advancePaid =
        Number(
          orderData.advance_paid
        ) || 0;

      const balanceAmount =
        Number(
          orderData.balance_amount
        ) || 0;

      return `Dear ${
        customer ||
        "Patient"
      },

Thank you for placing your optical order with us.

Order Details:
━━━━━━━━━━━━━━━━
Bill Number: ${orderNumber}
Order Date: ${
        orderDate || "-"
      }
Product: ${productName}
Total Amount: ₹${totalAmount.toLocaleString(
        "en-IN"
      )}
Advance Paid: ₹${advancePaid.toLocaleString(
        "en-IN"
      )}
Balance Due: ₹${balanceAmount.toLocaleString(
        "en-IN"
      )}
Expected Delivery: ${
        deliveryDate ||
        "To be confirmed"
      }

We will contact you when your order is ready.

Thank you for choosing us.
We look forward to serving you again.`;
    };

  /* =========================================================
     OPEN WHATSAPP
  ========================================================= */

  const openWhatsApp =
    async (
      message
    ) => {
      let phone =
        String(
          mobileNumber || ""
        ).replace(
          /\D/g,
          ""
        );

      if (
        phone.length === 10
      ) {
        phone =
          `91${phone}`;
      }

      if (
        phone.length < 12
      ) {
        window.alert(
          "Invalid mobile number."
        );

        return;
      }

      const whatsappUrl =
        `https://wa.me/${phone}?text=${encodeURIComponent(
          message
        )}`;

      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );
    };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave =
    async () => {
      try {
        setLoading(true);

        if (
          !customer ||
          !mobileNumber
        ) {
          window.alert(
            "Required Fields\n\nPlease enter patient name and mobile number."
          );

          return;
        }

        if (
          !amount ||
          Number(amount) <= 0
        ) {
          window.alert(
            "Required Fields\n\nPlease enter total amount."
          );

          return;
        }

        const orderData =
          await buildOrderData();

        const result =
          await submitOrder(
            orderData
          );

        if (!result) {
          return;
        }

        let savedOrderId =
          routeOrder?.id ||
          null;

        if (result?.id) {
          savedOrderId =
            result.id;
        }

        if (
          result?.order?.id
        ) {
          savedOrderId =
            result.order.id;
        }

        if (
          result?.data?.id
        ) {
          savedOrderId =
            result.data.id;
        }

        const message =
          createOrderWhatsAppMessage(
            orderData
          );

        const sendWhatsApp =
          window.confirm(
            isEditMode
              ? "Order Updated\n\nOrder is updated successfully.\n\nSend order details to the patient on WhatsApp?"
              : "Order Created\n\nOrder is created successfully.\n\nSend order details to the patient on WhatsApp?"
          );

        if (sendWhatsApp) {
          await saveWhatsAppHistory(
            {
              savedOrderId,
              message
            }
          );

          await openWhatsApp(
            message
          );
        }

        navigate(
          "/admin/opticalsales",
          {
            state: {
              patient: {
                patient_id:
                  patientId,

                name:
                  customer,

                mobile:
                  mobileNumber,

                age,

                gender
              }
            }
          }
        );
      } catch (error) {
        console.error(
          "SAVE ORDER ERROR:",
          error
        );

        window.alert(
          `Error\n\n${
            error?.message ||
            "Failed to create order."
          }`
        );
      } finally {
        setLoading(false);
      }
    };

  /* =========================================================
     WHATSAPP
  ========================================================= */

  const handleWhatsApp =
    async () => {
      try {
        if (
          !customer ||
          !mobileNumber
        ) {
          window.alert(
            "Required Fields\n\nPlease enter patient name and mobile number."
          );

          return;
        }

        if (
          !amount ||
          Number(amount) <= 0
        ) {
          window.alert(
            "Required Fields\n\nPlease enter total amount."
          );

          return;
        }

        let phone =
          String(
            mobileNumber
          ).replace(
            /\D/g,
            ""
          );

        if (
          phone.length === 10
        ) {
          phone =
            `91${phone}`;
        }

        if (
          phone.length < 12
        ) {
          window.alert(
            "Invalid mobile number."
          );

          return;
        }

        const orderData =
          await buildOrderData();

        const savedResult =
          await submitOrder(
            orderData
          );

        if (!savedResult) {
          return;
        }

        let savedOrderId =
          routeOrder?.id ||
          null;

        if (
          savedResult?.id
        ) {
          savedOrderId =
            savedResult.id;
        }

        if (
          savedResult?.order?.id
        ) {
          savedOrderId =
            savedResult.order.id;
        }

        if (
          savedResult?.data?.id
        ) {
          savedOrderId =
            savedResult.data.id;
        }

        const message =
          createOrderWhatsAppMessage(
            orderData
          );

        await saveWhatsAppHistory(
          {
            savedOrderId,
            message
          }
        );

        const whatsappUrl =
          `https://wa.me/${phone}?text=${encodeURIComponent(
            message
          )}`;

        window.open(
          whatsappUrl,
          "_blank",
          "noopener,noreferrer"
        );

        navigate(
          "/admin/opticalsales",
          {
            state: {
              patient: {
                patient_id:
                  patientId,

                name:
                  customer,

                mobile:
                  mobileNumber,

                age,

                gender
              }
            }
          }
        );
      } catch (error) {
        console.error(
          "WHATSAPP ERROR:",
          error
        );

        window.alert(
          `WhatsApp Error\n\n${
            error?.message ||
            "Unable to save order or open WhatsApp."
          }`
        );
      }
    };

  /* =========================================================
     DELETE ORDER
     NO STORE CODE
  ========================================================= */

  const deleteOrder =
    async () => {
      try {
        setLoading(true);

        if (
          !routeOrder?.id
        ) {
          window.alert(
            "Delete Order\n\nOrder ID not found."
          );

          return;
        }

        const response =
          await fetch(
            `${API_BASE}/opticalorders/orders/delete/${routeOrder.id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                role:
                  "superadmin",

                deleted_by:
                  "Admin"
              })
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data?.success
        ) {
          throw new Error(
            data?.message ||
              data?.error ||
              "Failed to delete optical order."
          );
        }

        window.alert(
          "Order Deleted\n\nOptical order moved to delete history successfully."
        );

        navigate(
          "/admin/opticalsales"
        );
      } catch (error) {
        console.error(
          "DELETE ORDER ERROR:",
          error
        );

        window.alert(
          "Delete Order Failed\n\n" +
            (
              error?.message ||
              "Unable to delete order."
            )
        );
      } finally {
        setLoading(false);
      }
    };

  /* =========================================================
     DELETE CONFIRM
  ========================================================= */

  const handleDelete =
    () => {
      if (
        !routeOrder?.id
      ) {
        window.alert(
          "Error\n\nOrder ID not found."
        );

        return;
      }

      const confirmed =
        window.confirm(
          "Delete Order\n\nAre you sure you want to delete this optical order?"
        );

      if (confirmed) {
        deleteOrder();
      }
    };

  /* =========================================================
     THANK YOU WHATSAPP
  ========================================================= */

  const openWhatsAppThankYou =
    async () => {
      try {
        if (
          !mobileNumber ||
          !String(
            mobileNumber
          ).trim()
        ) {
          window.alert(
            "WhatsApp\n\nPatient mobile number is not available."
          );

          return;
        }

        let phone =
          String(
            mobileNumber
          ).replace(
            /\D/g,
            ""
          );

        if (
          phone.length === 10
        ) {
          phone =
            `91${phone}`;
        }

        if (
          phone.length < 10
        ) {
          window.alert(
            "Invalid Mobile Number\n\nPlease enter a valid patient mobile number."
          );

          return;
        }

        let productName =
          "Spectacles";

        if (
          frameModel &&
          frameModel.trim()
        ) {
          productName =
            frameModel.trim();
        } else if (
          lens &&
          lens.trim()
        ) {
          productName =
            lens.trim();
        }

        const totalAmount =
          Number(
            amount || 0
          );

        const formattedAmount =
          totalAmount.toLocaleString(
            "en-IN"
          );

        const message =
`Dear ${
          customer ||
          "Patient"
        },

Thank you for purchasing ${productName} from us.

Bill Number: ${
          billNumber || "-"
        }

Purchase Amount: ₹${formattedAmount}

Thank you for choosing us.

We look forward to serving you again.`;

        const whatsappUrl =
          `https://wa.me/${phone}?text=${encodeURIComponent(
            message
          )}`;

        window.open(
          whatsappUrl,
          "_blank",
          "noopener,noreferrer"
        );
      } catch (error) {
        console.error(
          "THANK YOU WHATSAPP ERROR:",
          error
        );

        window.alert(
          "WhatsApp\n\nUnable to open WhatsApp."
        );
      }
    };

  /* =========================================================
     BACK
  ========================================================= */

  const handleBack =
    () => {
      navigate(
        "/admin/opticalsales"
      );
    };

  /* =========================================================
     FILTER PATIENTS
  ========================================================= */

  const filteredPatients =
    useMemo(() => {
      const search =
        String(
          customer || ""
        ).toLowerCase();

      if (!search) {
        return patients.slice(
          0,
          8
        );
      }

      return patients
        .filter(
          (p) =>
            String(
              p.name || ""
            )
              .toLowerCase()
              .includes(search) ||
            String(
              p.mobile || ""
            ).includes(search)
        )
        .slice(0, 8);
    }, [
      patients,
      customer
    ]);

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <div className="screen-container">

      <div className="screen-header">
        <div className="header-left-row">

          <button
            type="button"
            className="back-button"
            onClick={handleBack}
          >
            ←
          </button>

          <div>
            <div className="screen-title">
              New Optical Sale & Order
            </div>

            <div className="screen-subtitle">
              Professional clinical prescription & billing console
            </div>
          </div>

        </div>
      </div>

      <div className="scroll-container">

        <div className="form-container-card">

          {/* PATIENT */}

          <div className="section-header">
            <Icon>👤</Icon>
            <span>
              Patient Identification
            </span>
          </div>

          <div className="patient-search-container">

            <InputField
              label="Patient Full Name / Search"
              value={customer}
              setValue={(text) => {
                setCustomer(text);
                setShowPatientDropdown(
                  true
                );
              }}
              placeholder="Search by name or mobile..."
              className="full-width"
            />

            {showPatientDropdown &&
              filteredPatients.length >
                0 && (
                <div className="patient-dropdown">

                  {filteredPatients.map(
                    (
                      p,
                      index
                    ) => (
                      <button
                        type="button"
                        key={
                          p.id ||
                          p.patient_id ||
                          index
                        }
                        className="dropdown-item"
                        onClick={() =>
                          handlePatientSelect(
                            p
                          )
                        }
                      >
                        <div className="patient-name">
                          {p.name}
                        </div>

                        <div className="patient-sub">
                          {p.mobile} • Age:{" "}
                          {p.age ||
                            "-"}
                        </div>
                      </button>
                    )
                  )}

                </div>
              )}

          </div>

          <FormRow>

            <div className="field-with-loader">

              <InputField
                label="Mobile Number *"
                value={mobileNumber}
                setValue={
                  handleMobileChange
                }
                type="tel"
                placeholder="9876543210"
              />

              {mobileSearching && (
                <span className="loader">
                  ⟳
                </span>
              )}

            </div>

            <InputField
              label="Age"
              value={age}
              setValue={setAge}
              type="number"
              placeholder="25"
            />

            <InputField
              label="Gender"
              value={gender}
              setValue={setGender}
              placeholder="Male / Female"
            />

          </FormRow>

          {/* SCHEDULE */}

          <div className="section-header">
            <Icon>📅</Icon>

            <span>
              Schedule & Status
            </span>
          </div>

          <FormRow>

            <DateField
              label="Order Date"
              value={orderDate}
              onChange={
                setOrderDate
              }
            />

            <DateField
              label="Expected Delivery"
              value={
                deliveryDate
              }
              onChange={
                setDeliveryDate
              }
            />

            <DateField
              label="Next Reminder Date"
              value={
                nextReminderDate
              }
              onChange={
                setNextReminderDate
              }
            />

            <InputField
              label="Order Status"
              value={
                orderStatus
              }
              setValue={
                setOrderStatus
              }
              placeholder="Pending"
            />

          </FormRow>

          {/* PRESCRIPTION */}

          <div className="section-header">
            <Icon>👓</Icon>

            <span>
              Optical Prescription (Refraction)
            </span>
          </div>

          <div className="eye-label">
            Right Eye (RE / OD)
          </div>

          <div className="refraction-grid">

            <div className="refraction-column">
              <div className="small-label">
                SPH
              </div>

              <SphDropdownControl
                name="orderReSph"
                title="Right Eye SPH"
                value={reSph}
                setValue={setReSph}
              />
            </div>

            <div className="refraction-column">
              <div className="small-label">
                CYL
              </div>

              <CylDropdownControl
                name="orderReCyl"
                title="Right Eye CYL"
                value={reCyl}
                setValue={setReCyl}
              />
            </div>

            <div className="refraction-column">
              <div className="small-label">
                AXIS
              </div>

              <PrescriptionDropdown
                name="orderReAxis"
                title="Right Eye AXIS"
                value={reAxis}
                items={axisList}
                onChange={
                  setReAxis
                }
              />
            </div>

            <div className="refraction-column">

              <InputField
                label="ADD"
                value={reAdd}
                setValue={
                  setReAdd
                }
                placeholder="+2.00"
                className="full-width"
              />

            </div>

          </div>

          <div className="eye-label left-eye">
            Left Eye (LE / OS)
          </div>

          <div className="refraction-grid">

            <div className="refraction-column">
              <div className="small-label">
                SPH
              </div>

              <SphDropdownControl
                name="orderLeSph"
                title="Left Eye SPH"
                value={leSph}
                setValue={setLeSph}
              />
            </div>

            <div className="refraction-column">
              <div className="small-label">
                CYL
              </div>

              <CylDropdownControl
                name="orderLeCyl"
                title="Left Eye CYL"
                value={leCyl}
                setValue={setLeCyl}
              />
            </div>

            <div className="refraction-column">
              <div className="small-label">
                AXIS
              </div>

              <PrescriptionDropdown
                name="orderLeAxis"
                title="Left Eye AXIS"
                value={leAxis}
                items={axisList}
                onChange={
                  setLeAxis
                }
              />
            </div>

            <div className="refraction-column">

              <InputField
                label="ADD"
                value={leAdd}
                setValue={
                  setLeAdd
                }
                placeholder="+2.00"
                className="full-width"
              />

            </div>

          </div>

          <FormRow>

            <InputField
              label="IPD / PD"
              value={pd}
              setValue={setPd}
              placeholder="64"
            />

            <InputField
              label="Lens Notes"
              value={notes}
              setValue={setNotes}
              placeholder="Progressive, anti-glare..."
            />

          </FormRow>

          {/* INVENTORY */}

          <div className="section-header">
            <Icon>📦</Icon>

            <span>
              Inventory & Frame Details
            </span>
          </div>

          <div className="inventory-container">

            <InputField
              label="Frame Barcode / Search"
              value={frame}
              setValue={
                handleBarcodeChange
              }
              placeholder="Scan or type barcode..."
              onFocus={() => {
                if (
                  frame &&
                  frame.trim()
                ) {
                  fetchStockInventory(
                    frame
                  );
                }
              }}
              className="full-width"
            />

            {stockLoading && (
              <span className="inventory-loader">
                ⟳
              </span>
            )}

            {showInventoryDropdown &&
              inventoryItem && (
                <button
                  type="button"
                  className="inventory-dropdown"
                  onClick={() =>
                    handleInventorySelect(
                      inventoryItem
                    )
                  }
                >

                  <div className="inventory-title">
                    {inventoryItem.product_name ||
                      inventoryItem.model ||
                      inventoryItem.frame_model}
                  </div>

                  <div className="inventory-sub">
                    Price: ₹
                    {inventoryItem.sale_price ||
                      inventoryItem.selling_price ||
                      inventoryItem.price ||
                      0}
                    {" | "}
                    Stock:{" "}
                    {
                      inventoryItem.stock ??
                      0
                    }
                  </div>

                </button>
              )}

          </div>

          <FormRow>

            <InputField
              label="Frame Model / Name"
              value={frameModel}
              setValue={
                setFrameModel
              }
              placeholder="RayBan / Aviator"
            />

            <InputField
              label="Lens Type"
              value={lens}
              setValue={setLens}
              placeholder="Blue Cut / Progressive"
            />

          </FormRow>

          {/* PAYMENT */}

          <div className="section-header">
            <Icon>💳</Icon>

            <span>
              Billing & Payment Summary
            </span>
          </div>

          <FormRow>

            <InputField
              label="Bill Number"
              value={billNumber}
              setValue={
                setBillNumber
              }
              placeholder="BILL-1001"
            />

            <InputField
              label="Total Amount (₹)"
              value={amount}
              setValue={(val) => {
                setAmount(val);

                calculateBalance(
                  val,
                  advance
                );
              }}
              type="number"
              placeholder="1500"
            />

            <InputField
              label="Advance Paid (₹)"
              value={advance}
              setValue={(val) => {
                setAdvance(val);

                calculateBalance(
                  amount,
                  val
                );
              }}
              type="number"
              placeholder="500"
            />

            <InputField
              label="Balance Due (₹)"
              value={balance}
              editable={false}
            />

            <InputField
              label="Payment Mode"
              value={paymentMode}
              setValue={
                setPaymentMode
              }
              placeholder="Cash / UPI / Card"
            />

          </FormRow>

          {/* FOOTER */}

          <div className="action-footer">

            <button
              type="button"
              className="cancel-button"
              onClick={
                handleBack
              }
              disabled={loading}
            >
              Cancel
            </button>

            {isEditMode && (
              <button
                type="button"
                className="delete-button"
                onClick={
                  handleDelete
                }
                disabled={loading}
              >
                🗑
                <span>
                  Delete
                </span>
              </button>
            )}

            <button
              type="button"
              className="whatsapp-button"
              onClick={
                handleWhatsApp
              }
              disabled={loading}
            >
              WhatsApp
            </button>

            <button
              type="button"
              className="save-button"
              onClick={
                handleSave
              }
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Order"
                : "Save & Generate Order"}
            </button>

          </div>

        </div>
      </div>

      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .screen-container {
          width: 100%;
          min-height: 100vh;
          background: #F8FAFC;
          color: #0F172A;
        }

        .screen-header {
          width: 100%;
          background: #0047AB;
          padding: 14px 16px;
          border-bottom: 1px solid #E2E8F0;
        }

        .header-left-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .back-button {
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 8px;
          background: #F1F5F9;
          color: #0F172A;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .back-button:hover {
          background: #E2E8F0;
        }

        .screen-title {
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
        }

        .screen-subtitle {
          font-size: 11px;
          color: #FFFFFF;
          margin-top: 2px;
        }

        .scroll-container {
          width: 100%;
          padding: 10px;
          padding-bottom: 100px;
        }

        .form-container-card {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          background: #FFFFFF;
          border-radius: 12px;
          padding: 12px;
          box-shadow:
            0 2px 6px rgba(0,0,0,0.04);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 14px;
          margin-bottom: 8px;
          padding-bottom: 4px;
          border-bottom: 1px solid #F1F5F9;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
        }

        .icon {
          color: #0284C7;
          font-size: 18px;
        }

        .form-row {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 0;
          margin-bottom: 2px;
        }

        .field-container {
          width: 48%;
          min-width: 48%;
          max-width: 48%;
          margin-bottom: 8px;
          position: relative;
        }

        .full-width {
          width: 100% !important;
          min-width: 100% !important;
          max-width: 100% !important;
        }

        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 3px;
        }

        .input-wrapper {
          width: 100%;
          height: 38px;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          padding: 0 8px;
        }

        .input-wrapper:focus-within {
          border-color: #0284C7;
          box-shadow:
            0 0 0 2px rgba(2,132,199,0.08);
        }

        .text-input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #0F172A;
          font-size: 13px;
          font-family: inherit;
          padding: 0;
        }

        .text-input::placeholder {
          color: #94A3B8;
        }

        .textarea-input {
          min-height: 70px;
          padding-top: 6px;
          resize: vertical;
        }

        .disabled-input-wrapper {
          background: #F1F5F9;
        }

        .disabled-text {
          color: #64748B;
          cursor: not-allowed;
        }

        .date-wrapper {
          position: relative;
        }

        .date-input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          font-size: 13px;
          color: #0F172A;
          font-family: inherit;
          cursor: pointer;
        }

        .date-wrapper .icon {
          position: absolute;
          right: 8px;
          pointer-events: none;
        }

        .patient-search-container {
          width: 100%;
          position: relative;
          z-index: 100;
        }

        .patient-dropdown {
          position: absolute;
          top: 61px;
          left: 0;
          right: 0;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          overflow: hidden;
          box-shadow:
            0 5px 15px rgba(0,0,0,0.12);
          z-index: 1000;
          max-height: 240px;
          overflow-y: auto;
        }

        .dropdown-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 10px 12px;
          border: none;
          border-bottom: 1px solid #F1F5F9;
          background: #FFFFFF;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background: #F0F9FF;
        }

        .patient-name {
          font-size: 13px;
          font-weight: 600;
          color: #0F172A;
        }

        .patient-sub {
          font-size: 11px;
          color: #64748B;
          margin-top: 2px;
        }

        .field-with-loader {
          width: 48%;
          min-width: 48%;
          max-width: 48%;
          position: relative;
        }

        .field-with-loader .field-container {
          width: 100%;
          min-width: 100%;
          max-width: 100%;
        }

        .loader,
        .inventory-loader {
          position: absolute;
          right: 12px;
          top: 31px;
          font-size: 16px;
          color: #2563EB;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .eye-label {
          font-size: 12px;
          font-weight: 700;
          color: #0284C7;
          margin-top: 4px;
          margin-bottom: 4px;
        }

        .left-eye {
          margin-top: 10px;
        }

        .refraction-grid {
          width: 100%;
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 8px;
        }

        .refraction-column {
          min-width: 0;
        }

        .small-label {
          font-size: 10px;
          font-weight: 600;
          color: #64748B;
          margin-bottom: 2px;
        }

        .prescription-control {
          width: 100%;
          height: 38px;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .prescription-step-button {
          width: 26px;
          height: 38px;
          flex-shrink: 0;
          border: none;
          border-radius: 4px;
          background: #E2E8F0;
          color: #334155;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .prescription-step-button:hover {
          background: #CBD5E1;
        }

        .prescription-value-container {
          flex: 1;
          min-width: 0;
          height: 38px;
        }

        .prescription-select-button {
          width: 100%;
          height: 38px;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          background: #FFFFFF;
          padding: 0 7px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          color: #334155;
          overflow: hidden;
        }

        .prescription-select-text {
          font-size: 12px;
          font-weight: 600;
          color: #0F172A;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .prescription-placeholder {
          font-size: 12px;
          color: #94A3B8;
        }

        .prescription-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 5000;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .prescription-modal-box {
          width: 100%;
          max-width: 320px;
          max-height: 75vh;
          background: #FFFFFF;
          border-radius: 12px;
          padding: 14px;
          box-shadow:
            0 8px 30px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
        }

        .prescription-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 7px;
          margin-bottom: 10px;
          border-bottom: 1px solid #F1F5F9;
          color: #0F172A;
          font-size: 14px;
        }

        .modal-close-button {
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 17px;
          color: #334155;
        }

        .prescription-current-value-box {
          background: #F0F9FF;
          border-radius: 6px;
          padding: 8px;
          margin-bottom: 10px;
          text-align: center;
        }

        .prescription-current-value-box span {
          display: block;
          color: #0284C7;
          font-size: 10px;
          font-weight: 600;
        }

        .prescription-current-value-box strong {
          display: block;
          color: #0369A1;
          font-size: 16px;
          margin-top: 2px;
        }

        .prescription-options-list {
          overflow-y: auto;
          min-height: 0;
        }

        .prescription-option {
          width: 100%;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: none;
          border-bottom: 1px solid #F8FAFC;
          border-radius: 6px;
          padding: 10px 12px;
          background: #FFFFFF;
          color: #334155;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
        }

        .prescription-option:hover {
          background: #F8FAFC;
        }

        .prescription-option.selected {
          background: #E0F2FE;
          color: #0284C7;
          font-weight: 700;
        }

        .inventory-container {
          position: relative;
          width: 100%;
          z-index: 40;
        }

        .inventory-dropdown {
          position: absolute;
          left: 0;
          right: 0;
          top: 61px;
          width: 100%;
          background: #F0F9FF;
          border: 1px solid #BAE6FD;
          border-radius: 8px;
          padding: 10px;
          cursor: pointer;
          text-align: left;
          box-shadow:
            0 5px 15px rgba(0,0,0,0.1);
          z-index: 1000;
        }

        .inventory-dropdown:hover {
          background: #E0F2FE;
        }

        .inventory-title {
          font-size: 13px;
          font-weight: 600;
          color: #0369A1;
        }

        .inventory-sub {
          font-size: 11px;
          color: #0284C7;
          margin-top: 2px;
        }

        .action-footer {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 20px;
          padding: 14px 2px 0;
          border-top: 1px solid #F1F5F9;
        }

        .action-footer button {
          height: 40px;
          min-width: 0;
          border-radius: 7px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-family: inherit;
        }

        .action-footer button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cancel-button {
          flex: 1;
          background: #F1F5F9;
          color: #475569;
          font-size: 11px;
          font-weight: 600;
        }

        .delete-button {
          flex: 1;
          background: #DC2626;
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 600;
        }

        .whatsapp-button {
          flex: 1;
          background: #16A34A;
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 600;
        }

        .save-button {
          flex: 1.5;
          background: #0284C7;
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 700;
        }

        @media (max-width: 800px) {
          .refraction-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .field-container,
          .field-with-loader {
            width: 48%;
            min-width: 48%;
            max-width: 48%;
          }
        }

        @media (max-width: 600px) {
          .screen-header {
            padding: 12px;
          }

          .screen-title {
            font-size: 14px;
          }

          .screen-subtitle {
            font-size: 10px;
          }

          .scroll-container {
            padding: 7px;
          }

          .form-container-card {
            border-radius: 8px;
            padding: 9px;
          }

          .field-container,
          .field-with-loader {
            width: 48%;
            min-width: 48%;
            max-width: 48%;
          }

          .refraction-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .action-footer {
            gap: 4px;
          }

          .action-footer button {
            padding: 0 4px;
            font-size: 9px;
          }

          .save-button {
            font-size: 9px;
          }

          .delete-button,
          .whatsapp-button {
            font-size: 9px;
          }
        }

        @media (max-width: 400px) {
          .field-container,
          .field-with-loader {
            width: 48%;
            min-width: 48%;
            max-width: 48%;
          }

          .action-footer {
            gap: 3px;
          }

          .action-footer button {
            height: 38px;
            padding: 0 3px;
            font-size: 8px;
          }

          .save-button {
            font-size: 8px;
          }

          .screen-title {
            font-size: 13px;
          }
        }

      `}</style>

    </div>
  );
}
