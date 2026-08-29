import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { useNavigate } from "react-router-dom";


/* =========================================================
   API
========================================================= */

const API_BASE =
  "https://visiontrackdatabase.onrender.com";

/* =========================================================
   STORE CODE
========================================================= */

const getStoreCode = async () => {
  try {
    const stored =
      localStorage.getItem("storeCode") ||
      localStorage.getItem("store_code");

    return stored || "STORE_DEFAULT";
  } catch (error) {
    return "STORE_DEFAULT";
  }
};

/* =========================================================
   DATE HELPERS
========================================================= */

const formatDate = (date) => {
  if (!date) return "";

  const d =
    date instanceof Date
      ? date
      : new Date(date);

  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();

  const month = String(
    d.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    d.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDateOnly = (dateValue) => {
  if (!dateValue) return "";

  const d = new Date(dateValue);

  if (isNaN(d.getTime())) return "";

  return formatDate(d);
};

const getTodayDate = () => {
  return formatDate(new Date());
};

/* =========================================================
   INPUT FIELD
========================================================= */

const InputField = ({
  label,
  value,
  setValue,
  placeholder,
  type = "text",
  disabled = false,
  textarea = false,
  onKeyDown
}) => {
  return (
    <div className="field-container">

      {label && (
        <label className="field-label">
          {label}
        </label>
      )}

      <div
        className={`input-wrapper ${
          disabled
            ? "disabled-input-wrapper"
            : ""
        }`}
      >

        {textarea ? (
          <textarea
            value={value}
            onChange={(e) =>
              setValue(e.target.value)
            }
            placeholder={placeholder}
            disabled={disabled}
            className="text-input textarea-input"
            onKeyDown={onKeyDown}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) =>
              setValue(e.target.value)
            }
            placeholder={placeholder}
            disabled={disabled}
            className="text-input"
            onKeyDown={onKeyDown}
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

      <label className="field-label">
        {label}
      </label>

      <div className="input-wrapper date-wrapper">

        <input
          type="date"
          value={formatDate(value)}
          onChange={(e) => {
            if (e.target.value) {
              onChange(
                new Date(
                  `${e.target.value}T00:00:00`
                )
              );
            }
          }}
          className="text-input"
        />

      </div>

    </div>
  );
};

/* =========================================================
   FORM ROW
========================================================= */

const FormRow = ({ children }) => {
  return (
    <div className="form-row">
      {children}
    </div>
  );
};

/* =========================================================
   SPH LIST
========================================================= */

const generateSph = () => {

  const plus = [];
  const minus = [];

  const addValues = (
    start,
    end,
    step,
    target
  ) => {

    for (
      let v = start;
      v <= end + 0.0001;
      v += step
    ) {
      target.push(v.toFixed(2));
    }
  };

  addValues(
    0.25,
    5.0,
    0.25,
    plus
  );

  addValues(
    0.25,
    5.0,
    0.25,
    minus
  );

  addValues(
    5.5,
    10,
    0.5,
    plus
  );

  addValues(
    5.5,
    10,
    0.5,
    minus
  );

  addValues(
    11,
    20,
    1,
    plus
  );

  addValues(
    11,
    20,
    1,
    minus
  );

  return [
    ...plus.reverse().map(
      (v) => `+${v}`
    ),
    "0.00",
    ...minus.map(
      (v) => `-${v}`
    )
  ];
};

/* =========================================================
   CYL LIST
========================================================= */

const generateCyl = () => {

  const plus = [];
  const minus = [];

  const addValues = (
    start,
    end,
    step,
    target
  ) => {

    for (
      let v = start;
      v <= end + 0.0001;
      v += step
    ) {
      target.push(v.toFixed(2));
    }
  };

  addValues(
    0.25,
    3,
    0.25,
    plus
  );

  addValues(
    0.25,
    3,
    0.25,
    minus
  );

  addValues(
    3.5,
    6,
    0.5,
    plus
  );

  addValues(
    3.5,
    6,
    0.5,
    minus
  );

  return [
    ...plus.reverse().map(
      (v) => `+${v}`
    ),
    "0.00",
    ...minus.map(
      (v) => `-${v}`
    )
  ];
};

const axisList = Array.from(
  { length: 180 },
  (_, i) => String(i + 1)
);

const sphList = generateSph();
const cylList = generateCyl();

/* =========================================================
   SPH STEP
========================================================= */

const calculateSphStep = (
  current,
  direction
) => {

  let value =
    parseFloat(current) || 0;

  let nextValue = value;

  if (direction === "plus") {

    if (Math.abs(value) < 5) {
      nextValue =
        value + 0.25;
    } else if (
      Math.abs(value) < 10
    ) {
      nextValue =
        value + 0.5;
    } else {
      nextValue =
        value + 1;
    }

  } else {

    if (Math.abs(value) <= 5) {
      nextValue =
        value - 0.25;
    } else if (
      Math.abs(value) <= 10
    ) {
      nextValue =
        value - 0.5;
    } else {
      nextValue =
        value - 1;
    }
  }

  if (direction === "plus") {

    if (
      value < 5 &&
      nextValue > 5
    ) {
      nextValue = 5;
    }

    if (value === 5) {
      nextValue = 5.5;
    }

    if (value === 9.5) {
      nextValue = 10;
    }

    if (value === 10) {
      nextValue = 11;
    }
  }

  if (direction === "minus") {

    if (value === 5) {
      nextValue = 4.75;
    }

    if (value === 10) {
      nextValue = 9.5;
    }

    if (value === 11) {
      nextValue = 10;
    }
  }

  if (nextValue > 20) {
    nextValue = 20;
  }

  if (nextValue < -20) {
    nextValue = -20;
  }

  if (nextValue > 0) {
    return `+${nextValue.toFixed(2)}`;
  }

  return nextValue.toFixed(2);
};

/* =========================================================
   CYL STEP
========================================================= */

const calculateCylStep = (
  current,
  direction
) => {

  let value =
    parseFloat(current) || 0;

  let nextValue = value;

  if (direction === "plus") {

    if (Math.abs(value) < 3) {
      nextValue =
        value + 0.25;
    } else {
      nextValue =
        value + 0.5;
    }

  } else {

    if (Math.abs(value) <= 3) {
      nextValue =
        value - 0.25;
    } else {
      nextValue =
        value - 0.5;
    }
  }

  if (
    direction === "plus" &&
    value === 3
  ) {
    nextValue = 3.5;
  }

  if (
    direction === "minus" &&
    value === 3
  ) {
    nextValue = 2.75;
  }

  if (
    direction === "minus" &&
    value === 3.5
  ) {
    nextValue = 3;
  }

  if (nextValue > 6) {
    nextValue = 6;
  }

  if (nextValue < -6) {
    nextValue = -6;
  }

  if (nextValue > 0) {
    return `+${nextValue.toFixed(2)}`;
  }

  return nextValue.toFixed(2);
};

/* =========================================================
   WHEEL DROPDOWN
========================================================= */

const WheelPickerDropdown = ({
  value,
  items,
  onChange
}) => {

  return (
    <select
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
      className="wheel-select"
    >

      <option value="">
        Select
      </option>

      {items.map(
        (item, index) => (
          <option
            key={index}
            value={item}
          >
            {item}
          </option>
        )
      )}

    </select>
  );
};

/* =========================================================
   SPH CONTROL
========================================================= */

const SphDropdownControl = ({
  value,
  setValue
}) => {

  return (
    <div className="power-control">

      <button
        type="button"
        className="power-button"
        onClick={() =>
          setValue(
            calculateSphStep(
              value,
              "minus"
            )
          )
        }
      >
        −
      </button>

      <WheelPickerDropdown
        value={value}
        items={sphList}
        onChange={setValue}
      />

      <button
        type="button"
        className="power-button"
        onClick={() =>
          setValue(
            calculateSphStep(
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
};

/* =========================================================
   CYL CONTROL
========================================================= */

const CylDropdownControl = ({
  value,
  setValue
}) => {

  return (
    <div className="power-control">

      <button
        type="button"
        className="power-button"
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

      <WheelPickerDropdown
        value={value}
        items={cylList}
        onChange={setValue}
      />

      <button
        type="button"
        className="power-button"
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
};

/* =========================================================
   MAIN SALES COMPONENT
========================================================= */

export default function Sales() {

  const navigate = useNavigate();

  /* =======================================================
     VIEW
  ======================================================= */

  const [viewMode, setViewMode] =
    useState("single");

  const [activeFilter, setActiveFilter] =
    useState("All");

  const [searchText, setSearchText] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* =======================================================
     DATA
  ======================================================= */

  const [orders, setOrders] =
    useState([]);

  const [patients, setPatients] =
    useState([]);

  /* =======================================================
     ORDER MODAL
  ======================================================= */

  const [orderModal, setOrderModal] =
    useState(false);

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

  const [
    showPatientDropdown,
    setShowPatientDropdown
  ] = useState(false);

  /* =======================================================
     DATES
  ======================================================= */

  const [orderDate, setOrderDate] =
    useState(new Date());

  const [deliveryDate, setDeliveryDate] =
    useState(new Date());

  /* =======================================================
     ORDER
  ======================================================= */

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

  /* =======================================================
     HISTORY
  ======================================================= */

  const [historyModal, setHistoryModal] =
    useState(false);

  const [historyLoading, setHistoryLoading] =
    useState(false);

  const [
    selectedPatientHistory,
    setSelectedPatientHistory
  ] = useState(null);

  const [
    patientOrdersHistory,
    setPatientOrdersHistory
  ] = useState([]);

  /* =======================================================
     SELECTED PATIENT
  ======================================================= */

  const [selectedPatient, setSelectedPatient] =
    useState(null);

  /* =======================================================
     MOBILE SEARCH
  ======================================================= */

  const [
    mobileSearching,
    setMobileSearching
  ] = useState(false);

  /* =======================================================
     INVENTORY
  ======================================================= */

  const [inventoryItem, setInventoryItem] =
    useState(null);

  const [stockLoading, setStockLoading] =
    useState(false);

  const [
    showInventoryDropdown,
    setShowInventoryDropdown
  ] = useState(false);

  /* =======================================================
     SUMMARY
  ======================================================= */

  const [selectedSummary, setSelectedSummary] =
    useState(null);

  /* =======================================================
     DATE FILTER
  ======================================================= */

  const [activeDateFilter, setActiveDateFilter] =
    useState("All");

  const [
    selectedCalendarDate,
    setSelectedCalendarDate
  ] = useState(null);

  /* =======================================================
     PAYMENT MODAL
  ======================================================= */

  const [paymentModal, setPaymentModal] =
    useState(false);

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [payAmount, setPayAmount] =
    useState("");

  /* =======================================================
     HISTORY FILTER
  ======================================================= */

  const [
    historySearchMobile,
    setHistorySearchMobile
  ] = useState("");

  const [
    historyDateFilter,
    setHistoryDateFilter
  ] = useState("All");

  const [
    historySelectedDate,
    setHistorySelectedDate
  ] = useState(null);

  /* =======================================================
     REFS
  ======================================================= */

  const inputRefs =
    useRef([]);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    fetchInitialData();
  }, []);

  /* =======================================================
     BALANCE
  ======================================================= */

  useEffect(() => {

    const total =
      parseFloat(amount) || 0;

    const paid =
      parseFloat(advance) || 0;

    const remaining =
      total - paid;

    setBalance(
      remaining >= 0
        ? remaining.toString()
        : "0"
    );

  }, [amount, advance]);

  /* =======================================================
     FETCH INITIAL DATA
  ======================================================= */

  const fetchInitialData = async () => {

    setLoading(true);

    await Promise.all([
      loadOrders(),
      loadPatients()
    ]);

    setLoading(false);
  };

  /* =======================================================
     LOAD PATIENTS
  ======================================================= */
const loadPatients = async () => {
  try {
    const res = await fetch(
      `${API_BASE}/patient/superadmin`
    );

    const data = await res.json();

    console.log("Superadmin Patients:", data);

    if (
      data.success &&
      Array.isArray(data.patients)
    ) {
      setPatients(data.patients);
    } else {
      setPatients([]);
    }
  } catch (error) {
    console.log(
      "Error loading superadmin patients:",
      error
    );

    setPatients([]);
  }
};
  /* =======================================================
     LOAD ORDERS
  ======================================================= */
const loadOrders = async () => {
  try {
    const res = await fetch(
      `${API_BASE}/opticalorders/superadmin`
    );

    const data = await res.json();

    console.log("Orders response:", data);

    if (
      data.success &&
      Array.isArray(data.orders)
    ) {
      setOrders(data.orders);
    } else {
      setOrders([]);
    }

  } catch (error) {
    console.log(
      "Error loading orders:",
      error
    );

    setOrders([]);
  }
};

  /* =======================================================
     PATIENT SELECT
  ======================================================= */

  const selectPatient = (patient) => {

    setSelectedPatient(patient);

    setPatientId(
      patient.patient_id ||
      `PT-${patient.id || Date.now()}`
    );

    setCustomer(
      patient.name || ""
    );

    setMobileNumber(
      patient.mobile || ""
    );

    setAge(
      String(patient.age || "")
    );

    setGender(
      patient.gender || ""
    );

    setShowPatientDropdown(false);
  };

  /* =======================================================
     MOBILE SEARCH
  ======================================================= */

  const searchPatientByMobile =
    async (mobile) => {

      setMobileNumber(mobile);

      if (mobile.length < 10) {
        return;
      }

      try {

        setMobileSearching(true);

        const storeCode =
          await getStoreCode();

        const res = await fetch(
          `${API_BASE}/patient?storeCode=${storeCode}`
        );

        const data =
          await res.json();

        if (
          data.success &&
          Array.isArray(data.patients)
        ) {

          const patient =
            data.patients.find(
              (p) =>
                String(p.mobile || "") ===
                String(mobile)
            );

          if (patient) {
            selectPatient(patient);
          }

        }

      } catch (error) {

        console.log(
          "Mobile Search Error:",
          error
        );

      } finally {

        setMobileSearching(false);

      }
    };

  /* =======================================================
     INVENTORY BARCODE SEARCH
  ======================================================= */

  const searchInventoryByBarcode =
    async (barcode) => {

      setFrame(barcode);

      if (!barcode || barcode.length < 3) {

        setInventoryItem(null);
        setShowInventoryDropdown(false);

        return;
      }

      try {

        setStockLoading(true);

        const storeCode =
          await getStoreCode();

        const res = await fetch(
          `${API_BASE}/stockinventory/barcode/${barcode}?storeCode=${storeCode}`
        );

        const data =
          await res.json();

        if (
          data.success &&
          data.item
        ) {

          setInventoryItem(data.item);

          setShowInventoryDropdown(true);

        } else {

          setInventoryItem(null);

          setShowInventoryDropdown(false);
        }

      } catch (error) {

        console.log(
          "Inventory Search Error:",
          error
        );

      } finally {

        setStockLoading(false);

      }
    };

  /* =======================================================
     SELECT INVENTORY PRODUCT
  ======================================================= */

  const selectInventoryProduct =
    (item) => {

      setFrameModel(
        item.product_name ||
        item.model ||
        ""
      );

      setLens(
        item.category === "Lens"
          ? item.product_name
          : ""
      );

      setAmount(
        String(
          item.sale_price ||
          item.price ||
          0
        )
      );

      setShowInventoryDropdown(false);
    };

  /* =======================================================
     RESET FORM
  ======================================================= */

  const resetForm = () => {

    setCustomer("");
    setPatientId("");
    setMobileNumber("");
    setAge("");
    setGender("");

    setOrderDate(new Date());
    setDeliveryDate(new Date());

    setFrame("");
    setFrameModel("");
    setLens("");

    setNotes("");

    setReSph("");
    setReCyl("");
    setReAxis("");
    setReAdd("");

    setLeSph("");
    setLeCyl("");
    setLeAxis("");
    setLeAdd("");

    setPd("");

    setAmount("");
    setAdvance("");
    setBalance("0");

    setPaymentMode("Cash");

    setOrderStatus("Pending");

    setInventoryItem(null);

    setShowPatientDropdown(false);
    setShowInventoryDropdown(false);

    setSelectedPatient(null);
  };

  /* =======================================================
     SAVE ORDER
  ======================================================= */

  const saveOrder = async () => {

    if (!customer || !mobileNumber) {

      alert(
        "Please enter patient name and mobile number."
      );

      return;
    }

    try {

      setLoading(true);

      const storeCode =
        await getStoreCode();

      const prescriptionSummary =
        `RE: ${reSph || "0"}/${reCyl || "0"}x${reAxis || "0"} (Add ${reAdd || "0"}) | LE: ${leSph || "0"}/${leCyl || "0"}x${leAxis || "0"} (Add ${leAdd || "0"}) | IPD: ${pd || "-"}`;

      const body = {

        storeCode,

        order_no:
          "ORD" +
          Math.floor(
            100000 +
            Math.random() *
            900000
          ),

        order_date:
          formatDate(orderDate),

        expected_delivery:
          formatDate(deliveryDate),

        patient_id:
          patientId || "WALK-IN",

        patient_name:
          customer,

        mobile:
          mobileNumber,

        age:
          Number(age || 0),

        gender,

        frame_barcode:
          frame,

        frame_model:
          frameModel,

        lens_type:
          lens,

        prescription_notes:
          `${prescriptionSummary}\nNotes: ${notes}`,

        total_amount:
          Number(amount || 0),

        advance_paid:
          Number(advance || 0),

        payment_mode:
          paymentMode,

        status:
          orderStatus,

        payment_status:
          Number(balance) <= 0
            ? "Paid"
            : "Due"
      };

      const res = await fetch(
        `${API_BASE}/opticalorders/add`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(body)
        }
      );

      const data =
        await res.json();

      if (data.success) {

        alert(
          "Optical order saved successfully."
        );

        setOrderModal(false);

        resetForm();

        await loadOrders();
        await loadPatients();

      } else {

        alert(
          data.message ||
          "Unable to save order."
        );

      }

    } catch (error) {

      console.log(
        "Save Order Error:",
        error
      );

      alert(
        "Something went wrong while saving order."
      );

    } finally {

      setLoading(false);

    }
  };

  /* =======================================================
     FILTERED ORDERS
  ======================================================= */
/* =======================================================
   FILTERED ORDERS
======================================================= */

/* =======================================================
   FILTERED ORDERS
======================================================= */

const filteredOrders = useMemo(() => {

  return orders.filter((o) => {

    // ==========================================
    // STATUS
    // ==========================================

    const status = String(
      o.status || "Pending"
    )
      .toLowerCase()
      .trim();

    const filter = String(
      activeFilter || "All"
    )
      .toLowerCase()
      .trim();

    const matchesStatus =
      filter === "all" ||
      status === filter;


    // ==========================================
    // SEARCH
    // ==========================================

    const search = String(
      searchText || ""
    )
      .toLowerCase()
      .trim();

    const matchesSearch =
      !search ||

      String(
        o.patient_name || ""
      )
        .toLowerCase()
        .includes(search) ||

      String(
        o.mobile || ""
      )
        .includes(search) ||

      String(
        o.order_no || ""
      )
        .toLowerCase()
        .includes(search);


    // ==========================================
    // DATE
    // ==========================================

    let matchesDate = true;

    if (
      activeDateFilter !== "All"
    ) {

      const orderDate =
        getDateOnly(
          o.order_date ||
          o.created_at
        );

      const today =
        getTodayDate();


      // TODAY
      if (
        activeDateFilter ===
        "Today"
      ) {

        matchesDate =
          orderDate === today;
      }


      // THIS WEEK
      else if (
        activeDateFilter ===
        "Week"
      ) {

        const current =
          new Date();

        const day =
          current.getDay();

        const firstDay =
          new Date(current);

        firstDay.setDate(
          current.getDate() -
          day
        );

        const firstDayOnly =
          formatDate(firstDay);

        matchesDate =
          orderDate >=
            firstDayOnly &&
          orderDate <=
            today;
      }


      // THIS MONTH
      else if (
        activeDateFilter ===
        "Month"
      ) {

        const current =
          new Date();

        const year =
          current.getFullYear();

        const month =
          String(
            current.getMonth() + 1
          ).padStart(2, "0");

        matchesDate =
          orderDate.startsWith(
            `${year}-${month}`
          );
      }


      // SELECTED DATE
      else if (
        activeDateFilter ===
          "Date" &&
        selectedCalendarDate
      ) {

        matchesDate =
          orderDate ===
          formatDate(
            selectedCalendarDate
          );
      }
    }


    return (
      matchesStatus &&
      matchesSearch &&
      matchesDate
    );

  });

}, [
  orders,
  activeFilter,
  searchText,
  activeDateFilter,
  selectedCalendarDate
]);
 
/* =======================================================
   SUMMARY - ALL SUPERADMIN ORDERS
   Source: /opticalorders/superadmin
======================================================= */

const totalSales = useMemo(() => {

  return orders.reduce(
    (sum, o) =>
      sum +
      Number(
        o.total_amount || 0
      ),
    0
  );

}, [orders]);


const pendingOrders = useMemo(() => {

  return orders.filter((o) => {

    const status =
      String(
        o.status || "Pending"
      )
        .toLowerCase()
        .trim();

    return status === "pending";

  }).length;

}, [orders]);


const balanceDue = useMemo(() => {

  return orders.reduce(
    (sum, o) => {

      const total =
        Number(
          o.total_amount || 0
        );

      // Prefer API balance_amount
      const apiBalance =
        Number(
          o.balance_amount
        );

      // If balance_amount exists,
      // use it directly
      if (
        o.balance_amount !== null &&
        o.balance_amount !== undefined
      ) {

        return (
          sum +
          Math.max(
            0,
            apiBalance
          )
        );
      }

      // Fallback calculation
      const paid =
        Number(
          o.advance_paid || 0
        );

      return (
        sum +
        Math.max(
          0,
          total - paid
        )
      );

    },
    0
  );

}, [orders]);


const completedOrders = useMemo(() => {

  return orders.filter((o) => {

    const status =
      String(
        o.status || ""
      )
        .toLowerCase()
        .trim();

    return status === "completed";

  }).length;

}, [orders]);

  /* =======================================================
     LATEST PATIENT ORDER
  ======================================================= */

  const getPatientLatestOrder =
    (patient) => {

      const patientOrders =
        orders.filter((o) => {

          return (
            String(
              o.patient_id || ""
            ) ===
              String(
                patient.patient_id ||
                ""
              ) ||

            String(
              o.mobile || ""
            ) ===
              String(
                patient.mobile ||
                ""
              ) ||

            (
              o.patient_name &&
              patient.name &&
              o.patient_name
                .toLowerCase() ===
              patient.name
                .toLowerCase()
            )
          );
        });

      if (!patientOrders.length) {
        return null;
      }

      return [...patientOrders].sort(
        (a, b) =>
          new Date(
            b.order_date ||
            b.created_at ||
            0
          ) -
          new Date(
            a.order_date ||
            a.created_at ||
            0
          )
      )[0];
    };

  /* =======================================================
     SHOULD SHOW PATIENT
  ======================================================= */

  const shouldShowPatient =
    (patient) => {

      const latestOrder =
        getPatientLatestOrder(
          patient
        );

      if (!latestOrder) {
        return true;
      }

      const status =
        String(
          latestOrder.status ||
          "Pending"
        )
          .toLowerCase()
          .trim();

      const today =
        getTodayDate();

      const orderDate =
        getDateOnly(
          latestOrder.order_date ||
          latestOrder.created_at
        );

      if (
        status === "pending" ||
        status === "open" ||
        status === "processing" ||
        status === "ready"
      ) {
        return true;
      }

      if (
        status === "completed" &&
        orderDate === today
      ) {
        return true;
      }

      if (
        status === "completed" &&
        orderDate < today
      ) {
        return false;
      }

      return true;
    };

  /* =======================================================
     FILTERED PATIENTS
  ======================================================= */

  const filteredPatients =
    useMemo(() => {

      if (
        activeDateFilter ===
        "All"
      ) {
        return patients;
      }

      const today =
        getTodayDate();

      const current =
        new Date();

      const day =
        current.getDay();

      const diffToMonday =
        day === 0
          ? 6
          : day - 1;

      const weekStart =
        new Date(current);

      weekStart.setDate(
        current.getDate() -
        diffToMonday
      );

      const weekStartString =
        formatDate(weekStart);

      const monthStart =
        `${current.getFullYear()}-${String(
          current.getMonth() + 1
        ).padStart(2, "0")}-01`;

      const matchesOrderDate =
        (order) => {

          if (!order?.order_date) {
            return false;
          }

          const orderDate =
            getDateOnly(
              order.order_date
            );

          if (
            activeDateFilter ===
            "Today"
          ) {
            return (
              orderDate === today
            );
          }

          if (
            activeDateFilter ===
            "Week"
          ) {
            return (
              orderDate >=
                weekStartString &&
              orderDate <=
                today
            );
          }

          if (
            activeDateFilter ===
            "Month"
          ) {
            return (
              orderDate >=
                monthStart &&
              orderDate <=
                today
            );
          }

          if (
            activeDateFilter ===
              "Date" &&
            selectedCalendarDate
          ) {

            return (
              orderDate ===
              formatDate(
                selectedCalendarDate
              )
            );
          }

          return false;
        };

      const filteredOrderPatients =
        new Set();

      filteredOrders.forEach(
        (order) => {

          if (
            matchesOrderDate(order)
          ) {

            if (
              order.patient_id
            ) {

              filteredOrderPatients.add(
                String(
                  order.patient_id
                )
              );
            }
          }
        }
      );

      return patients.filter(
        (patient) =>
          filteredOrderPatients.has(
            String(
              patient.patient_id
            )
          )
      );

    }, [
      patients,
      filteredOrders,
      activeDateFilter,
      selectedCalendarDate
    ]);

  /* =======================================================
     HISTORY LOAD
  ======================================================= */

  const loadAllHistoryOrders =
    async () => {

      try {

        setHistoryLoading(true);

        const storeCode =
          await getStoreCode();

        const res = await fetch(
          `${API_BASE}/opticalorders?storeCode=${storeCode}`
        );

        const data =
          await res.json();

        if (
          data.success &&
          Array.isArray(data.orders)
        ) {

          setSelectedPatientHistory(
            null
          );

          setPatientOrdersHistory(
            data.orders
          );

          setHistoryModal(true);
        }

      } catch (error) {

        console.log(
          "All History Error:",
          error
        );

      } finally {

        setHistoryLoading(false);

      }
    };

  /* =======================================================
     PATIENT HISTORY
  ======================================================= */

  const loadPatientHistory =
    async (patient) => {

      try {

        setHistoryLoading(true);

        const storeCode =
          await getStoreCode();

        const patientRes =
          await fetch(
            `${API_BASE}/patient?storeCode=${storeCode}`
          );

        const patientData =
          await patientRes.json();

        const currentPatient =
          patientData.patients?.find(
            (p) =>
              p.patient_id ===
              patient.patient_id
          ) || patient;

        const orderRes =
          await fetch(
            `${API_BASE}/opticalorders?storeCode=${storeCode}`
          );

        const orderData =
          await orderRes.json();

        const filtered =
          (
            orderData.orders ||
            []
          ).filter((o) => {

            const matchesPatient =
              o.patient_id ===
                currentPatient.patient_id ||

              o.mobile ===
                currentPatient.mobile ||

              o.patient_name
                ?.toLowerCase() ===
                currentPatient.name
                  ?.toLowerCase();

            if (!matchesPatient) {
              return false;
            }

            let matchesDate =
              true;

            const orderDateOnly =
              String(
                o.order_date || ""
              )
                .split("T")[0]
                .trim();

            const today =
              getTodayDate();

            if (
              activeDateFilter ===
                "Date" &&
              selectedCalendarDate
            ) {

              matchesDate =
                orderDateOnly ===
                formatDate(
                  selectedCalendarDate
                );
            }

            if (
              activeDateFilter ===
              "Today"
            ) {

              matchesDate =
                orderDateOnly ===
                today;
            }

            if (
              activeDateFilter ===
              "Week"
            ) {

              const last7 =
                new Date();

              last7.setDate(
                last7.getDate() -
                7
              );

              const last7String =
                formatDate(last7);

              matchesDate =
                orderDateOnly >=
                  last7String &&
                orderDateOnly <=
                  today;
            }

            if (
              activeDateFilter ===
              "Month"
            ) {

              const monthStart =
                `${new Date().getFullYear()}-${String(
                  new Date().getMonth() + 1
                ).padStart(2, "0")}-01`;

              matchesDate =
                orderDateOnly >=
                  monthStart &&
                orderDateOnly <=
                  today;
            }

            return matchesDate;
          });

        setSelectedPatientHistory(
          currentPatient
        );

        setPatientOrdersHistory(
          filtered
        );

        setHistoryModal(true);

      } catch (error) {

        console.log(
          "Patient History Error:",
          error
        );

      } finally {

        setHistoryLoading(false);

      }
    };

  /* =======================================================
     HISTORY FILTER
  ======================================================= */

/* =======================================================
   FILTERED HISTORY ORDERS
   Uses SAME orders loaded from /superadmin
======================================================= */

const filteredHistoryOrders =
  useMemo(() => {

    let result = [...orders];


    // ==========================================
    // SELECTED PATIENT
    // ==========================================

    if (selectedPatientHistory) {

      const patientId =
        selectedPatientHistory.patient_id;

      const mobile =
        String(
          selectedPatientHistory.mobile ||
          ""
        );

      result = result.filter((o) => {

        return (
          (
            patientId &&
            String(
              o.patient_id || ""
            ) === String(patientId)
          ) ||

          (
            mobile &&
            String(
              o.mobile || ""
            ) === mobile
          )
        );

      });
    }


    // ==========================================
    // MOBILE SEARCH
    // ==========================================

    const mobileSearch =
      String(
        historySearchMobile || ""
      )
        .trim();

    if (mobileSearch) {

      result = result.filter((o) => {

        return String(
          o.mobile || ""
        ).includes(
          mobileSearch
        );

      });
    }


    // ==========================================
    // DATE FILTER
    // ==========================================

    if (
      historyDateFilter !==
      "All"
    ) {

      result = result.filter((o) => {

        const orderDate =
          getDateOnly(
            o.order_date ||
            o.created_at
          );

        const today =
          getTodayDate();


        // TODAY
        if (
          historyDateFilter ===
          "Today"
        ) {

          return (
            orderDate ===
            today
          );
        }


        // THIS MONTH
        if (
          historyDateFilter ===
          "Month"
        ) {

          const current =
            new Date();

          const year =
            current.getFullYear();

          const month =
            String(
              current.getMonth() + 1
            ).padStart(2, "0");

          return orderDate.startsWith(
            `${year}-${month}`
          );
        }


        // SELECTED DATE
        if (
          historyDateFilter ===
            "Date" &&
          historySelectedDate
        ) {

          return (
            orderDate ===
            formatDate(
              historySelectedDate
            )
          );
        }


        return true;

      });
    }


    // ==========================================
    // NEWEST FIRST
    // ==========================================

    result.sort((a, b) => {

      const dateA =
        new Date(
          a.order_date ||
          a.created_at ||
          0
        );

      const dateB =
        new Date(
          b.order_date ||
          b.created_at ||
          0
        );

      return dateB - dateA;
    });


    return result;

  }, [
    orders,
    selectedPatientHistory,
    historySearchMobile,
    historyDateFilter,
    historySelectedDate
  ]);

  /* =======================================================
     PAYMENT
  ======================================================= */

  const payRemainingBalance =
    async () => {

      if (
        !selectedOrder ||
        !payAmount
      ) {

        alert(
          "Please enter payment amount."
        );

        return;
      }

      try {

        const storeCode =
          await getStoreCode();

        const total =
          Number(
            selectedOrder.total_amount ||
            0
          );

        const oldPaid =
          Number(
            selectedOrder.advance_paid ||
            0
          );

        const newPaid =
          oldPaid +
          Number(payAmount);

        const remaining =
          total - newPaid;

        const res = await fetch(
          `${API_BASE}/opticalorders/payment/${selectedOrder.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              storeCode,

              advance_paid:
                newPaid,

              payment_status:
                remaining <= 0
                  ? "Paid"
                  : "Due"
            })
          }
        );

        const data =
          await res.json();

        if (data.success) {

          alert(
            "Balance payment updated."
          );

          setPaymentModal(false);

          setPayAmount("");

          await loadOrders();

          await loadAllHistoryOrders();
        } else {

          alert(
            data.message ||
            "Payment update failed."
          );
        }

      } catch (error) {

        console.log(
          "Payment Error:",
          error
        );

        alert(
          "Unable to update payment."
        );
      }
    };

  /* =======================================================
     OPEN NEW ORDER
  ======================================================= */

  const openNewOrder = () => {

    navigate(
      "/admin/new-order",
      {
        state: {
          patient:
            selectedPatient ||
            null
        }
      }
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

 return (
  <div className="sales-page">

    <style>{`
      /* =========================================================
         SALES PAGE
      ========================================================= */

      * {
        box-sizing: border-box;
      }

      .sales-page {
        min-height: 100vh;
        width: 100%;
        position: relative;
        overflow-x: hidden;
        background:
          linear-gradient(
            135deg,
            #f8fbff 0%,
            #ffffff 45%,
            #f4f8ff 100%
          );
        color: #172033;
        font-family:
          Inter,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
      }

      .bg-circle-top {
        position: fixed;
        width: 420px;
        height: 420px;
        border-radius: 50%;
        background: rgba(37, 99, 235, 0.055);
        top: -220px;
        right: -120px;
        pointer-events: none;
        z-index: 0;
      }

      .bg-circle-bottom {
        position: fixed;
        width: 360px;
        height: 360px;
        border-radius: 50%;
        background: rgba(14, 165, 233, 0.045);
        bottom: -200px;
        left: -140px;
        pointer-events: none;
        z-index: 0;
      }

      /* =========================================================
         HEADER
      ========================================================= */

      .sales-header {
        width: 100%;
        min-height: 82px;
        padding: 14px 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(255, 255, 255, 0.96);
        border-bottom: 1px solid #e5eaf2;
        position: sticky;
        top: 0;
        z-index: 100;
        box-shadow: 0 3px 15px rgba(15, 23, 42, 0.05);
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
      }

      .header-icon-button {
        width: 42px;
        height: 42px;
        border: 1px solid #dce3ee;
        border-radius: 11px;
        background: #ffffff;
        color: #334155;
        font-size: 21px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.2s ease;
      }

      .header-icon-button:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
        transform: translateY(-1px);
      }

      .header-title-container {
        margin-left: 8px;
      }

      .header-title-container h1 {
        margin: 0;
        font-size: 22px;
        font-weight: 750;
        color: #172033;
      }

      .header-title-container p {
        margin: 4px 0 0;
        font-size: 13px;
        color: #64748b;
      }

      .view-toggle {
        display: flex;
        gap: 4px;
        padding: 4px;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        background: #f8fafc;
      }

      .view-toggle button {
        width: 40px;
        height: 34px;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: #64748b;
        font-size: 18px;
        cursor: pointer;
      }

      .view-toggle button.toggle-active {
        background: #2563eb;
        color: white;
        box-shadow: 0 3px 8px rgba(37, 99, 235, 0.25);
      }

      /* =========================================================
         CONTENT
      ========================================================= */

      .sales-content {
        width: min(1400px, calc(100% - 48px));
        margin: 0 auto;
        padding: 30px 0 60px;
        position: relative;
        z-index: 1;
      }

      .top-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 22px;
      }

      .top-row h2 {
        margin: 0;
        font-size: 28px;
        font-weight: 750;
        color: #172033;
      }

      .count-text {
        margin: 6px 0 0;
        font-size: 14px;
        color: #64748b;
      }

      .top-actions {
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .history-button,
      .new-order-button {
        min-height: 44px;
        padding: 0 18px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 650;
        cursor: pointer;
        transition: 0.2s ease;
      }

      .history-button {
        border: 1px solid #dbe3ef;
        background: #ffffff;
        color: #334155;
      }

      .history-button:hover {
        background: #f8fafc;
        transform: translateY(-1px);
      }

      .new-order-button {
        border: 0;
        background: #2563eb;
        color: #ffffff;
        box-shadow: 0 6px 15px rgba(37, 99, 235, 0.22);
      }

      .new-order-button:hover {
        background: #1d4ed8;
        transform: translateY(-1px);
      }

      /* =========================================================
         SUMMARY
      ========================================================= */

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-bottom: 22px;
      }

      .summary-card {
        min-height: 128px;
        border: 1px solid #e3e9f2;
        border-radius: 16px;
        background: #ffffff;
        padding: 18px;
        text-align: left;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: 0.2s ease;
        box-shadow: 0 5px 18px rgba(15, 23, 42, 0.045);
      }

      .summary-card:hover {
        transform: translateY(-2px);
        border-color: #bfdbfe;
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
      }

      .summary-card-active {
        border-color: #2563eb;
        box-shadow:
          0 0 0 2px rgba(37, 99, 235, 0.08),
          0 10px 25px rgba(15, 23, 42, 0.08);
      }

      .summary-icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        background: #eff6ff;
        color: #2563eb;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 10px;
      }

      .summary-label {
        font-size: 13px;
        color: #64748b;
        margin-bottom: 4px;
      }

      .summary-value {
        font-size: 23px;
        font-weight: 750;
        color: #172033;
      }

      /* =========================================================
         SEARCH
      ========================================================= */

      .search-container {
        width: 100%;
        min-height: 48px;
        display: flex;
        align-items: center;
        position: relative;
        background: #ffffff;
        border: 1px solid #dce4ef;
        border-radius: 12px;
        margin-bottom: 14px;
        overflow: hidden;
        transition: 0.2s ease;
      }

      .search-container:focus-within {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
      }

      .search-icon {
        padding-left: 15px;
        color: #64748b;
        font-size: 16px;
      }

      .search-container input {
        flex: 1;
        height: 46px;
        border: 0;
        outline: 0;
        padding: 0 14px;
        font-size: 14px;
        color: #172033;
        background: transparent;
      }

      .search-container input::placeholder {
        color: #94a3b8;
      }

      .clear-search {
        width: 38px;
        height: 38px;
        margin-right: 5px;
        border: 0;
        background: transparent;
        color: #64748b;
        font-size: 23px;
        cursor: pointer;
      }

      /* =========================================================
         DATE FILTER
      ========================================================= */

      .date-filter-container {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 30px;
      }

      .date-input-filter {
        min-height: 40px;
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 0 10px;
        background: #ffffff;
        border: 1px solid #dce4ef;
        border-radius: 10px;
      }

      .date-input-filter input {
        border: 0;
        outline: 0;
        font-size: 13px;
        color: #334155;
        background: transparent;
      }

      .date-input-filter button {
        border: 0;
        background: transparent;
        color: #64748b;
        font-size: 19px;
        cursor: pointer;
      }

      .date-active {
        border-color: #2563eb;
      }

      .date-filter-button {
        min-height: 40px;
        padding: 0 14px;
        border-radius: 9px;
        border: 1px solid #dce4ef;
        background: #ffffff;
        color: #475569;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: 0.2s ease;
      }

      .date-filter-button:hover {
        background: #f8fafc;
      }

      .date-filter-button.active {
        background: #2563eb;
        border-color: #2563eb;
        color: #ffffff;
      }

      /* =========================================================
         PATIENTS
      ========================================================= */

      .section-title {
        margin: 0 0 15px;
        font-size: 19px;
        font-weight: 700;
        color: #172033;
      }

      .patient-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .patient-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
      }

      .patient-card {
        width: 100%;
        min-height: 104px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        padding: 17px 19px;
        background: #ffffff;
        border: 1px solid #e1e7f0;
        border-radius: 14px;
        cursor: pointer;
        transition: 0.2s ease;
        box-shadow: 0 4px 15px rgba(15, 23, 42, 0.035);
      }

      .patient-card:hover {
        border-color: #bfdbfe;
        transform: translateY(-1px);
        box-shadow: 0 8px 22px rgba(15, 23, 42, 0.07);
      }

      .patient-grid-card {
        min-height: 170px;
        align-items: flex-start;
      }

      .patient-info {
        min-width: 0;
      }

      .patient-name {
        font-size: 16px;
        font-weight: 700;
        color: #172033;
        margin-bottom: 5px;
      }

      .patient-meta {
        font-size: 12px;
        color: #64748b;
        margin-top: 3px;
      }

      .order-status-row {
        display: flex;
        align-items: center;
        gap: 7px;
        margin-top: 9px;
        font-size: 12px;
        font-weight: 650;
      }

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .status-dot.pending {
        background: #f59e0b;
      }

      .status-dot.completed {
        background: #16a34a;
      }

      .status-dot.closed {
        background: #94a3b8;
      }

      .status-pending {
        color: #d97706;
      }

      .status-completed {
        color: #16a34a;
      }

      .status-closed {
        color: #64748b;
      }

      .open-button {
        flex-shrink: 0;
        border: 1px solid #bfdbfe;
        background: #eff6ff;
        color: #2563eb;
        border-radius: 8px;
        padding: 8px 13px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
      }

      .open-button:hover {
        background: #dbeafe;
      }

      .close-button {
        flex-shrink: 0;
        border: 1px solid #e2e8f0;
        background: #f8fafc;
        color: #64748b;
        border-radius: 8px;
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 650;
      }

      .empty-patients,
      .empty-history {
        width: 100%;
        padding: 45px 20px;
        text-align: center;
        color: #94a3b8;
        background: #ffffff;
        border: 1px dashed #d8e0eb;
        border-radius: 14px;
      }

      /* =========================================================
         MODAL
      ========================================================= */

      .modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 1000;
        background: rgba(15, 23, 42, 0.58);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        backdrop-filter: blur(4px);
      }

      .order-modal,
      .history-modal,
      .payment-modal {
        width: min(980px, 100%);
        max-height: calc(100vh - 40px);
        background: #ffffff;
        border-radius: 18px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 25px 70px rgba(15, 23, 42, 0.25);
      }

      .history-modal {
        width: min(900px, 100%);
      }

      .payment-modal {
        width: min(450px, 100%);
      }

      .modal-header {
        padding: 20px 24px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
        border-bottom: 1px solid #e8edf4;
        background: #ffffff;
      }

      .modal-header h2 {
        margin: 0;
        font-size: 21px;
        color: #172033;
      }

      .modal-header p {
        margin: 5px 0 0;
        font-size: 13px;
        color: #64748b;
      }

      .modal-close {
        width: 36px;
        height: 36px;
        flex-shrink: 0;
        border: 0;
        border-radius: 9px;
        background: #f1f5f9;
        color: #475569;
        font-size: 24px;
        cursor: pointer;
      }

      .modal-close:hover {
        background: #e2e8f0;
      }

      .modal-body,
      .history-body,
      .payment-body {
        padding: 22px 24px;
        overflow-y: auto;
      }

      .modal-section-title {
        margin: 22px 0 14px;
        padding-bottom: 9px;
        border-bottom: 1px solid #edf1f6;
        color: #1e3a8a;
        font-size: 15px;
        font-weight: 750;
      }

      .modal-section-title:first-child {
        margin-top: 0;
      }

      .form-row {
        display: flex;
        gap: 14px;
        margin-bottom: 14px;
      }

      .flex-field {
        flex: 1;
        min-width: 0;
      }

      .field-container {
        width: 100%;
        margin-bottom: 14px;
        position: relative;
      }

      .field-label {
        display: block;
        margin-bottom: 6px;
        color: #475569;
        font-size: 12px;
        font-weight: 650;
      }

      .input-wrapper {
        width: 100%;
        min-height: 42px;
        border: 1px solid #d8e1ec;
        border-radius: 9px;
        background: #ffffff;
        transition: 0.2s ease;
      }

      .input-wrapper:focus-within {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
      }

      .disabled-input-wrapper {
        background: #f8fafc;
      }

      .text-input {
        width: 100%;
        min-height: 40px;
        border: 0;
        outline: 0;
        padding: 9px 11px;
        border-radius: 9px;
        background: transparent;
        color: #172033;
        font-size: 13px;
      }

      .text-input:disabled {
        color: #64748b;
        cursor: not-allowed;
      }

      .textarea-input {
        min-height: 90px;
        resize: vertical;
        line-height: 1.5;
      }

      .date-wrapper {
        display: flex;
        align-items: center;
      }

      .date-wrapper input {
        cursor: pointer;
      }

      /* =========================================================
         POWER CONTROLS
      ========================================================= */

      .power-control {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 5px;
      }

      .power-button {
        width: 39px;
        height: 42px;
        flex-shrink: 0;
        border: 1px solid #d6dfeb;
        border-radius: 9px;
        background: #f8fafc;
        color: #2563eb;
        font-size: 21px;
        font-weight: 700;
        cursor: pointer;
      }

      .power-button:hover {
        background: #eff6ff;
        border-color: #93c5fd;
      }

      .wheel-select {
        width: 100%;
        min-height: 42px;
        padding: 0 9px;
        border: 1px solid #d6dfeb;
        border-radius: 9px;
        outline: none;
        background: #ffffff;
        color: #172033;
        font-size: 13px;
        cursor: pointer;
      }

      .wheel-select:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
      }

      .eye-label {
        margin: 13px 0 8px;
        padding: 8px 10px;
        border-radius: 8px;
        background: #f8fafc;
        color: #334155;
        font-size: 12px;
        font-weight: 750;
      }

      /* =========================================================
         PATIENT DROPDOWN
      ========================================================= */

      .patient-search-wrapper {
        position: relative;
      }

      .patient-dropdown {
        position: absolute;
        left: 0;
        right: 0;
        top: calc(100% - 12px);
        z-index: 30;
        background: #ffffff;
        border: 1px solid #dce4ef;
        border-radius: 10px;
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
        overflow: hidden;
      }

      .dropdown-patient {
        width: 100%;
        padding: 11px 13px;
        border: 0;
        border-bottom: 1px solid #edf1f6;
        background: #ffffff;
        text-align: left;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .dropdown-patient:last-child {
        border-bottom: 0;
      }

      .dropdown-patient:hover {
        background: #f8fafc;
      }

      .dropdown-patient strong {
        color: #172033;
        font-size: 13px;
      }

      .dropdown-patient span {
        color: #64748b;
        font-size: 11px;
      }

      .relative {
        position: relative;
      }

      .loading-small {
        position: absolute;
        right: 9px;
        bottom: 11px;
        font-size: 10px;
        color: #2563eb;
      }

      /* =========================================================
         INVENTORY
      ========================================================= */

      .inventory-dropdown {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
        margin: -2px 0 14px;
        padding: 13px;
        border: 1px solid #bfdbfe;
        border-radius: 10px;
        background: #eff6ff;
      }

      .inventory-dropdown > div {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .inventory-dropdown strong {
        color: #1e3a8a;
        font-size: 13px;
      }

      .inventory-dropdown span {
        color: #475569;
        font-size: 11px;
      }

      .inventory-dropdown button {
        flex-shrink: 0;
        border: 0;
        border-radius: 8px;
        padding: 8px 13px;
        background: #2563eb;
        color: #ffffff;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
      }

      /* =========================================================
         MODAL FOOTER
      ========================================================= */

      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        padding: 15px 24px;
        border-top: 1px solid #e8edf4;
        background: #ffffff;
      }

      .cancel-button,
      .save-order-button {
        min-height: 42px;
        padding: 0 18px;
        border-radius: 9px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
      }

      .cancel-button {
        border: 1px solid #d8e1ec;
        background: #ffffff;
        color: #475569;
      }

      .cancel-button:hover {
        background: #f8fafc;
      }

      .save-order-button {
        border: 0;
        background: #2563eb;
        color: #ffffff;
        box-shadow: 0 5px 12px rgba(37, 99, 235, 0.2);
      }

      .save-order-button:hover {
        background: #1d4ed8;
      }

      .save-order-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      /* =========================================================
         HISTORY
      ========================================================= */

      .history-profile {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px;
        margin-bottom: 20px;
        border: 1px solid #e4eaf2;
        border-radius: 12px;
        background: #f8fafc;
      }

      .history-avatar {
        width: 45px;
        height: 45px;
        flex-shrink: 0;
        border-radius: 50%;
        background: #dbeafe;
        color: #2563eb;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 19px;
      }

      .history-profile > div:last-child {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .history-profile strong {
        color: #172033;
        font-size: 14px;
      }

      .history-profile span {
        color: #64748b;
        font-size: 11px;
      }

      .history-title {
        margin: 0 0 12px;
        font-size: 15px;
        color: #172033;
      }

      .history-filter-card {
        padding: 12px;
        margin-bottom: 15px;
        background: #f8fafc;
        border: 1px solid #e6ebf2;
        border-radius: 12px;
      }

      .history-filter-card .search-container {
        margin-bottom: 10px;
      }

      .history-filter-card .date-filter-container {
        margin-bottom: 0;
      }

      .history-date-input {
        height: 40px;
        padding: 0 9px;
        border: 1px solid #dce4ef;
        border-radius: 9px;
        background: #ffffff;
        outline: none;
        color: #475569;
        font-size: 12px;
      }

      .history-order-card {
        padding: 16px;
        margin-bottom: 11px;
        border: 1px solid #e2e8f0;
        border-radius: 13px;
        background: #ffffff;
      }

      .history-order-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
      }

      .history-order-top strong {
        font-size: 14px;
        color: #172033;
      }

      .history-status {
        padding: 5px 9px;
        border-radius: 20px;
        font-size: 10px;
        font-weight: 750;
        text-transform: capitalize;
      }

      .history-status.pending {
        background: #fff7ed;
        color: #c2410c;
      }

      .history-status.ready {
        background: #eff6ff;
        color: #2563eb;
      }

      .history-status.delivered {
        background: #f0fdf4;
        color: #15803d;
      }

      .history-divider {
        height: 1px;
        background: #edf1f5;
        margin: 12px 0;
      }

      .history-row {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        padding: 6px 0;
        font-size: 12px;
      }

      .history-row span {
        color: #64748b;
      }

      .history-row strong {
        color: #334155;
        text-align: right;
      }

      .advance-text {
        color: #64748b;
        font-size: 11px;
      }

      .pay-button {
        width: 100%;
        min-height: 39px;
        margin-top: 10px;
        border: 0;
        border-radius: 8px;
        background: #16a34a;
        color: #ffffff;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
      }

      .pay-button:hover {
        background: #15803d;
      }

      .history-loading {
        padding: 70px 20px;
        text-align: center;
        color: #64748b;
        font-size: 14px;
      }

      /* =========================================================
         PAYMENT
      ========================================================= */

      .payment-body {
        padding: 24px;
      }

      .confirm-payment-button {
        width: 100%;
        min-height: 44px;
        border: 0;
        border-radius: 9px;
        background: #16a34a;
        color: #ffffff;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
      }

      .confirm-payment-button:hover {
        background: #15803d;
      }

      /* =========================================================
         RESPONSIVE
      ========================================================= */

      @media (max-width: 1100px) {
        .summary-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .patient-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 768px) {
        .sales-header {
          padding: 12px 15px;
        }

        .header-title-container h1 {
          font-size: 17px;
        }

        .header-title-container p {
          font-size: 11px;
        }

        .header-icon-button {
          width: 37px;
          height: 37px;
        }

        .sales-content {
          width: calc(100% - 24px);
          padding-top: 20px;
        }

        .top-row {
          flex-direction: column;
          align-items: stretch;
        }

        .top-row h2 {
          font-size: 23px;
        }

        .top-actions {
          width: 100%;
        }

        .history-button,
        .new-order-button {
          flex: 1;
          padding: 0 10px;
          font-size: 12px;
        }

        .summary-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .summary-card {
          min-height: 110px;
          padding: 13px;
        }

        .summary-value {
          font-size: 19px;
        }

        .patient-grid {
          grid-template-columns: 1fr;
        }

        .form-row {
          flex-direction: column;
          gap: 0;
          margin-bottom: 0;
        }

        .modal-overlay {
          padding: 8px;
        }

        .order-modal,
        .history-modal,
        .payment-modal {
          max-height: calc(100vh - 16px);
          border-radius: 14px;
        }

        .modal-header {
          padding: 15px;
        }

        .modal-body,
        .history-body,
        .payment-body {
          padding: 15px;
        }

        .modal-footer {
          padding: 12px 15px;
        }

        .power-button {
          width: 36px;
        }
      }

      @media (max-width: 520px) {
        .header-left {
          gap: 5px;
        }

        .header-title-container {
          margin-left: 3px;
        }

        .header-title-container h1 {
          font-size: 15px;
        }

        .header-title-container p {
          display: none;
        }

        .view-toggle {
          display: none;
        }

        .top-actions {
          flex-direction: column;
        }

        .history-button,
        .new-order-button {
          width: 100%;
        }

        .summary-grid {
          grid-template-columns: 1fr 1fr;
        }

        .date-filter-container {
          gap: 6px;
        }

        .date-input-filter {
          width: 100%;
        }

        .date-filter-button {
          flex: 1;
          padding: 0 8px;
          font-size: 11px;
        }

        .patient-card {
          padding: 13px;
        }

        .patient-name {
          font-size: 14px;
        }

        .open-button,
        .close-button {
          padding: 7px 9px;
          font-size: 10px;
        }

        .history-row {
          flex-direction: column;
          gap: 2px;
        }

        .history-row strong {
          text-align: left;
        }

        .modal-footer {
          flex-direction: column-reverse;
        }

        .cancel-button,
        .save-order-button {
          width: 100%;
        }
      }
    `}</style>

    <div className="bg-circle-top" />
    <div className="bg-circle-bottom" />

    {/* YOUR EXISTING HEADER, CONTENT, MODALS ETC. */}

      <div className="bg-circle-top" />
      <div className="bg-circle-bottom" />

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="sales-header">

        <div className="header-left">

        
          <div className="header-title-container">

            <h1>
              Optical Sales Console
            </h1>

            <p>
              Manage optical billing,
              lens specs & tracking
            </p>

          </div>

        </div>

      

      </header>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="sales-content">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="top-row">

          <div>

            <h2>
              Sales & Orders
            </h2>

            <p className="count-text">
              Showing{" "}
              {filteredOrders.length}{" "}
              of{" "}
              {orders.length}{" "}
              total orders
            </p>

          </div>

          <div className="top-actions">

            <button
              className="history-button"
              onClick={
                loadAllHistoryOrders
              }
            >
              🕘 History Orders
            </button>

            <button
              className="new-order-button"
              onClick={
                openNewOrder
              }
            >
              ＋ New Optical Order
            </button>

          </div>

        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="summary-grid">

          <SummaryCard
            label="Total Sales"
            value={`₹${totalSales.toLocaleString()}`}
            icon="₹"
            active={
              selectedSummary ===
              "sales"
            }
            onClick={() => {

              setSelectedSummary(
                selectedSummary ===
                  "sales"
                  ? null
                  : "sales"
              );

              navigate(
                "/sales-report",
                {
                  state: {
                    filter: "all"
                  }
                }
              );
            }}
          />

          <SummaryCard
            label="Pending Orders"
            value={pendingOrders}
            icon="◷"
            active={
              selectedSummary ===
              "pending"
            }
            onClick={() => {

              setSelectedSummary(
                selectedSummary ===
                  "pending"
                  ? null
                  : "pending"
              );

              navigate(
                "/orders",
                {
                  state: {
                    status: "Pending"
                  }
                }
              );
            }}
          />

          <SummaryCard
            label="Balance Due"
            value={`₹${balanceDue.toLocaleString()}`}
            icon="▣"
            active={
              selectedSummary ===
              "due"
            }
            onClick={() => {

              setSelectedSummary(
                selectedSummary ===
                  "due"
                  ? null
                  : "due"
              );

              navigate(
                "/balance-report",
                {
                  state: {
                    filter: "due"
                  }
                }
              );
            }}
          />

          <SummaryCard
            label="Completed Orders"
            value={completedOrders}
            icon="✓"
            active={
              selectedSummary ===
              "completed"
            }
            onClick={() => {

              setSelectedSummary(
                selectedSummary ===
                  "completed"
                  ? null
                  : "completed"
              );

              navigate(
                "/orders",
                {
                  state: {
                    status:
                      "completed"
                  }
                }
              );
            }}
          />

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="search-container">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search by customer name, mobile, or order number..."
            value={searchText}
            onChange={(e) =>
              setSearchText(
                e.target.value
              )
            }
          />

          {searchText && (
            <button
              className="clear-search"
              onClick={() =>
                setSearchText("")
              }
            >
              ×
            </button>
          )}

        </div>

        {/* =================================================
            DATE FILTER
        ================================================= */}

        <div className="date-filter-container">

          <div
            className={`date-input-filter ${
              selectedCalendarDate
                ? "date-active"
                : ""
            }`}
          >

            <span>
              📅
            </span>

            <input
              type="date"
              value={
                selectedCalendarDate
                  ? formatDate(
                      selectedCalendarDate
                    )
                  : ""
              }
              onChange={(e) => {

                if (
                  e.target.value
                ) {

                  setSelectedCalendarDate(
                    new Date(
                      `${e.target.value}T00:00:00`
                    )
                  );

                  setActiveDateFilter(
                    "Date"
                  );
                }

              }}
            />

            {selectedCalendarDate && (
              <button
                onClick={() => {

                  setSelectedCalendarDate(
                    null
                  );

                  setActiveDateFilter(
                    "All"
                  );
                }}
              >
                ×
              </button>
            )}

          </div>

          {[
            {
              label: "All",
              value: "All"
            },
            {
              label: "Today",
              value: "Today"
            },
            {
              label: "This Week",
              value: "Week"
            },
            {
              label: "This Month",
              value: "Month"
            }
          ].map((item) => (

            <button
              key={item.value}
              className={`date-filter-button ${
                activeDateFilter ===
                item.value
                  ? "active"
                  : ""
              }`}
              onClick={() => {

                setActiveDateFilter(
                  item.value
                );

                setSelectedCalendarDate(
                  null
                );
              }}
            >
              {item.label}
            </button>

          ))}

        </div>

        {/* =================================================
            PATIENT TITLE
        ================================================= */}

        <h2 className="section-title">
          Select Patient
        </h2>

        {/* =================================================
            PATIENT LIST
        ================================================= */}

        <div
          className={
            viewMode === "multi"
              ? "patient-grid"
              : "patient-list"
          }
        >

          {filteredPatients

            .filter((p) => {

              const q =
                searchText
                  .toLowerCase()
                  .trim();

              return (

                (
                  p.name || ""
                )
                  .toLowerCase()
                  .includes(q) ||

                (
                  p.mobile || ""
                ).includes(q) ||

                (
                  p.patient_id ||
                  ""
                )
                  .toLowerCase()
                  .includes(q)

              );
            })

            .filter(
              shouldShowPatient
            )

            .map((p) => {

              const latestOrder =
                getPatientLatestOrder(
                  p
                );

              const status =
                String(
                  latestOrder?.status ||
                  "Pending"
                )
                  .toLowerCase()
                  .trim();

              const orderDate =
                getDateOnly(
                  latestOrder?.order_date ||
                  latestOrder?.created_at
                );

              const today =
                getTodayDate();

              const isCompletedToday =
                status ===
                  "completed" &&
                orderDate === today;

              const isPending =
                status ===
                  "pending" ||
                status ===
                  "open" ||
                status ===
                  "processing" ||
                status ===
                  "ready";

              return (

                <div
                  key={
                    p.id ||
                    p.patient_id
                  }
                  className={`patient-card ${
                    viewMode ===
                    "multi"
                      ? "patient-grid-card"
                      : ""
                  }`}
                  onClick={() => {

                    selectPatient(p);

                    navigate(
                      "/admin/new-order",
                      {
                        state: {

                          patient: {
                            id: p.id,

                            patient_id:
                              p.patient_id,

                            name:
                              p.name,

                            mobile:
                              p.mobile,

                            age:
                              p.age,

                            gender:
                              p.gender
                          },

                          order:
                            latestOrder ||
                            null,

                          mode:
                            latestOrder
                              ? "edit"
                              : "add"
                        }
                      }
                    );
                  }}
                >

                  <div className="patient-info">

                    <div className="patient-name">
                      {p.name}
                    </div>

                    <div className="patient-meta">
                      {p.patient_id}
                    </div>

                    <div className="patient-meta">
                      {p.mobile}
                    </div>

                    <div className="patient-meta">
                      {p.age} Years •{" "}
                      {p.gender}
                    </div>

                    {latestOrder && (

                      <div className="order-status-row">

                        <span
                          className={`status-dot ${
                            isPending
                              ? "pending"
                              : isCompletedToday
                              ? "completed"
                              : "closed"
                          }`}
                        />

                        <span
                          className={
                            isPending
                              ? "status-pending"
                              : isCompletedToday
                              ? "status-completed"
                              : "status-closed"
                          }
                        >
                          {
                            latestOrder.order_no ||
                            "Order"
                          }
                        </span>

                      </div>

                    )}

                  </div>

                  {isPending && (

                    <button
                      className="open-button"
                      onClick={(e) => {

                        e.stopPropagation();

                        navigate(
                          "/new-order",
                          {
                            state: {

                              mode: "edit",

                              patient: {
                                id: p.id,
                                patient_id:
                                  p.patient_id,
                                name:
                                  p.name,
                                mobile:
                                  p.mobile,
                                age:
                                  p.age,
                                gender:
                                  p.gender
                              },

                              order:
                                latestOrder
                            }
                          }
                        );
                      }}
                    >
                      🔓 Open
                    </button>

                  )}

                  {isCompletedToday && (

                    <span className="close-button">
                      🔒 Close
                    </span>

                  )}

                </div>
              );
            })}

          {!loading &&
            filteredPatients.length ===
              0 && (

              <div className="empty-patients">
                No patients found.
              </div>

            )}

        </div>

      </main>

      {/* =================================================
          NEW ORDER MODAL
      ================================================= */}

      {orderModal && (

        <div className="modal-overlay">

          <div className="order-modal">

            <div className="modal-header">

              <div>

                <h2>
                  New Optical Sale & Order
                </h2>

                <p>
                  Fill in patient details,
                  optical power, and
                  payment summary
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() => {

                  setOrderModal(false);
                  resetForm();

                }}
              >
                ×
              </button>

            </div>

            <div className="modal-body">

              {/* =================================================
                  PATIENT
              ================================================= */}

              <h3 className="modal-section-title">
                👤 Patient Selection
              </h3>

              <div className="patient-search-wrapper">

                <InputField
                  label="Patient Name / Search"
                  value={customer}
                  setValue={(text) => {

                    setCustomer(text);

                    setShowPatientDropdown(
                      true
                    );
                  }}
                  placeholder="Type name or search patient..."
                />

                {showPatientDropdown &&
                  patients.length >
                    0 && (

                    <div className="patient-dropdown">

                      {patients
                        .filter(
                          (p) =>
                            (
                              p.name ||
                              ""
                            )
                              .toLowerCase()
                              .includes(
                                customer.toLowerCase()
                              ) ||

                            (
                              p.mobile ||
                              ""
                            ).includes(
                              customer
                            )
                        )
                        .slice(0, 8)
                        .map(
                          (p, index) => (

                            <button
                              key={index}
                              className="dropdown-patient"
                              onClick={() =>
                                selectPatient(
                                  p
                                )
                              }
                            >

                              <strong>
                                {p.name}
                              </strong>

                              <span>
                                {p.mobile}
                                {" • "}
                                Age:{" "}
                                {p.age ||
                                  "-"}
                              </span>

                            </button>

                          )
                        )}

                    </div>
                  )}

              </div>

              <FormRow>

                <div className="flex-field">

                  <InputField
                    label="Patient ID"
                    value={patientId}
                    setValue={
                      setPatientId
                    }
                    placeholder="PT-1001"
                  />

                </div>

                <div className="flex-field relative">

                  <InputField
                    label="Mobile Number *"
                    value={mobileNumber}
                    setValue={
                      searchPatientByMobile
                    }
                    type="tel"
                    placeholder="9876543210"
                  />

                  {mobileSearching && (
                    <span className="loading-small">
                      Searching...
                    </span>
                  )}

                </div>

              </FormRow>

              <FormRow>

                <div className="flex-field">

                  <InputField
                    label="Age"
                    value={age}
                    setValue={setAge}
                    type="number"
                    placeholder="25"
                  />

                </div>

                <div className="flex-field">

                  <InputField
                    label="Gender"
                    value={gender}
                    setValue={setGender}
                    placeholder="Male / Female"
                  />

                </div>

              </FormRow>

              {/* =================================================
                  DATES
              ================================================= */}

              <h3 className="modal-section-title">
                📅 Dates & Order Status
              </h3>

              <FormRow>

                <div className="flex-field">

                  <DateField
                    label="Order Date"
                    value={orderDate}
                    onChange={
                      setOrderDate
                    }
                  />

                </div>

                <div className="flex-field">

                  <DateField
                    label="Expected Delivery"
                    value={
                      deliveryDate
                    }
                    onChange={
                      setDeliveryDate
                    }
                  />

                </div>

              </FormRow>

              {/* =================================================
                  PRESCRIPTION
              ================================================= */}

              <h3 className="modal-section-title">
                👓 Prescription Details
                (Eye Power)
              </h3>

              <div className="eye-label">
                Right Eye (RE / OD)
              </div>

              <FormRow>

                <div className="flex-field">

                  <label className="field-label">
                    SPH
                  </label>

                  <SphDropdownControl
                    value={reSph}
                    setValue={
                      setReSph
                    }
                  />

                </div>

                <div className="flex-field">

                  <label className="field-label">
                    CYL
                  </label>

                  <CylDropdownControl
                    value={reCyl}
                    setValue={
                      setReCyl
                    }
                  />

                </div>

                <div className="flex-field">

                  <label className="field-label">
                    AXIS
                  </label>

                  <WheelPickerDropdown
                    value={reAxis}
                    items={axisList}
                    onChange={
                      setReAxis
                    }
                  />

                </div>

                <div className="flex-field">

                  <InputField
                    label="ADD"
                    value={reAdd}
                    setValue={setReAdd}
                    placeholder="+2.00"
                  />

                </div>

              </FormRow>

              <div className="eye-label">
                Left Eye (LE / OS)
              </div>

              <FormRow>

                <div className="flex-field">

                  <label className="field-label">
                    SPH
                  </label>

                  <SphDropdownControl
                    value={leSph}
                    setValue={
                      setLeSph
                    }
                  />

                </div>

                <div className="flex-field">

                  <label className="field-label">
                    CYL
                  </label>

                  <CylDropdownControl
                    value={leCyl}
                    setValue={
                      setLeCyl
                    }
                  />

                </div>

                <div className="flex-field">

                  <label className="field-label">
                    AXIS
                  </label>

                  <WheelPickerDropdown
                    value={leAxis}
                    items={axisList}
                    onChange={
                      setLeAxis
                    }
                  />

                </div>

                <div className="flex-field">

                  <InputField
                    label="ADD"
                    value={leAdd}
                    setValue={setLeAdd}
                    placeholder="+2.00"
                  />

                </div>

              </FormRow>

              <InputField
                label="IPD / Pupillary Distance (mm)"
                value={pd}
                setValue={setPd}
                placeholder="e.g. 63 mm"
              />

              <InputField
                label="Prescription Notes & Special Instructions"
                value={notes}
                setValue={setNotes}
                placeholder="Anti-glare, Blue Cut, Progressive, Photochromic..."
                textarea
              />

              {/* =================================================
                  FRAME
              ================================================= */}

              <h3 className="modal-section-title">
                🏷️ Frame & Lens
                Specifications
              </h3>

              <FormRow>

                <div className="flex-field relative">

                  <InputField
                    label="Frame Barcode / Code"
                    value={frame}
                    setValue={
                      searchInventoryByBarcode
                    }
                    placeholder="Scan / Type Barcode"
                  />

                  {stockLoading && (
                    <span className="loading-small">
                      Searching...
                    </span>
                  )}

                </div>

                <div className="flex-field">

                  <InputField
                    label="Frame Brand / Model"
                    value={frameModel}
                    setValue={
                      setFrameModel
                    }
                    placeholder="Ray-Ban Matte Black"
                  />

                </div>

              </FormRow>

              {showInventoryDropdown &&
                inventoryItem && (

                <div className="inventory-dropdown">

                  <div>

                    <strong>
                      {
                        inventoryItem.product_name ||
                        inventoryItem.model
                      }
                    </strong>

                    <span>
                      Category:{" "}
                      {
                        inventoryItem.category ||
                        "-"
                      }
                    </span>

                    <span>
                      Stock:{" "}
                      {
                        inventoryItem.quantity ||
                        0
                      }
                    </span>

                  </div>

                  <button
                    onClick={() =>
                      selectInventoryProduct(
                        inventoryItem
                      )
                    }
                  >
                    Select →
                  </button>

                </div>
              )}

              <InputField
                label="Lens Type & Coating"
                value={lens}
                setValue={setLens}
                placeholder="1.61 Index Anti-Reflective Blue-Cut Lens"
              />

              {/* =================================================
                  BILLING
              ================================================= */}

              <h3 className="modal-section-title">
                💰 Billing & Payment
              </h3>

              <FormRow>

                <div className="flex-field">

                  <InputField
                    label="Total Amount (₹)"
                    value={amount}
                    setValue={setAmount}
                    type="number"
                    placeholder="0"
                  />

                </div>

                <div className="flex-field">

                  <InputField
                    label="Advance Paid (₹)"
                    value={advance}
                    setValue={setAdvance}
                    type="number"
                    placeholder="0"
                  />

                </div>

                <div className="flex-field">

                  <InputField
                    label="Balance Due (₹)"
                    value={`₹${balance}`}
                    disabled
                    setValue={() => {}}
                  />

                </div>

              </FormRow>

            </div>

            {/* =================================================
                MODAL FOOTER
            ================================================= */}

            <div className="modal-footer">

              <button
                className="cancel-button"
                onClick={() => {

                  setOrderModal(false);
                  resetForm();

                }}
              >
                Cancel
              </button>

              <button
                className="save-order-button"
                onClick={saveOrder}
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : "✓ Save & Generate Order"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          HISTORY MODAL
      ================================================= */}

      {historyModal && (

        <div className="modal-overlay">

          <div className="history-modal">

            <div className="modal-header">

              <div>

                <h2>
                  Order History
                </h2>

                <p>
                  View previous optical
                  sales orders and
                  payments
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() => {

                  setHistoryModal(false);

                  setSelectedPatientHistory(
                    null
                  );

                  setPatientOrdersHistory(
                    []
                  );

                  setHistorySearchMobile(
                    ""
                  );

                  setHistoryDateFilter(
                    "All"
                  );

                  setHistorySelectedDate(
                    null
                  );

                }}
              >
                ×
              </button>

            </div>

            {historyLoading ? (

              <div className="history-loading">
                Loading history...
              </div>

            ) : (

              <div className="history-body">

                {/* =================================================
                    PROFILE
                ================================================= */}

                {selectedPatientHistory ? (

                  <div className="history-profile">

                    <div className="history-avatar">
                      👤
                    </div>

                    <div>

                      <strong>
                        {
                          selectedPatientHistory.name
                        }
                      </strong>

                      <span>
                        ID:{" "}
                        {
                          selectedPatientHistory.patient_id
                        }
                      </span>

                      <span>
                        Mobile:{" "}
                        {
                          selectedPatientHistory.mobile
                        }
                      </span>

                    </div>

                  </div>

                ) : (

                  <div className="history-profile">

                    <div className="history-avatar">
                      📄
                    </div>

                    <div>

                      <strong>
                        All Patient
                        Order History
                      </strong>

                      <span>
                        Showing all
                        optical sales
                        orders
                      </span>

                    </div>

                  </div>

                )}

                <h3 className="history-title">
                  Previous Order Logs (
                  {
                    filteredHistoryOrders.length
                  }
                  )
                </h3>

                {/* =================================================
                    HISTORY FILTER
                ================================================= */}

                <div className="history-filter-card">

                  <div className="search-container">

                    <span>
                      🔍
                    </span>

                    <input
                      type="tel"
                      placeholder="Search mobile number..."
                      value={
                        historySearchMobile
                      }
                      onChange={(e) =>
                        setHistorySearchMobile(
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <div className="date-filter-container">

                    {[
                      {
                        label: "All",
                        value: "All"
                      },
                      {
                        label: "Today",
                        value: "Today"
                      },
                      {
                        label: "This Month",
                        value: "Month"
                      }
                    ].map(
                      (item) => (

                        <button
                          key={
                            item.value
                          }
                          className={`date-filter-button ${
                            historyDateFilter ===
                            item.value
                              ? "active"
                              : ""
                          }`}
                          onClick={() => {

                            setHistoryDateFilter(
                              item.value
                            );

                            setHistorySelectedDate(
                              null
                            );
                          }}
                        >
                          {
                            item.label
                          }
                        </button>

                      )
                    )}

                    <input
                      type="date"
                      value={
                        historySelectedDate
                          ? formatDate(
                              historySelectedDate
                            )
                          : ""
                      }
                      onChange={(e) => {

                        if (
                          e.target.value
                        ) {

                          setHistorySelectedDate(
                            new Date(
                              `${e.target.value}T00:00:00`
                            )
                          );

                          setHistoryDateFilter(
                            "Date"
                          );
                        }

                      }}
                      className="history-date-input"
                    />

                  </div>

                </div>

                {/* =================================================
                    HISTORY ORDERS
                ================================================= */}

                {filteredHistoryOrders.length ===
                0 ? (

                  <div className="empty-history">

                    <div>
                      📂
                    </div>

                    <p>
                      No previous optical
                      orders found
                    </p>

                  </div>

                ) : (

                  filteredHistoryOrders.map(
                    (o) => {

                      const status =
                        (
                          o.status ||
                          "Pending"
                        ).toLowerCase();

                      const due =
                        Number(
                          o.total_amount ||
                          0
                        ) >
                        Number(
                          o.advance_paid ||
                          0
                        );

                      const remaining =
                        Number(
                          o.total_amount ||
                          0
                        ) -
                        Number(
                          o.advance_paid ||
                          0
                        );

                      return (

                        <div
                          key={
                            o.id ||
                            o.order_no
                          }
                          className="history-order-card"
                        >

                          <div className="history-order-top">

                            <strong>
                              {
                                o.order_no
                              }
                            </strong>

                            <span
                              className={`history-status ${
                                status ===
                                "ready"
                                  ? "ready"
                                  : status ===
                                    "delivered"
                                  ? "delivered"
                                  : "pending"
                              }`}
                            >
                              {
                                o.status ||
                                "Pending"
                              }
                            </span>

                          </div>

                          <div className="history-divider" />

                          <HistoryRow
                            label="Order Date"
                            value={
                              o.order_date ||
                              "-"
                            }
                          />

                          <HistoryRow
                            label="Lens Type"
                            value={
                              o.lens_type ||
                              "Standard Lens"
                            }
                          />

                          <HistoryRow
                            label="Amount & Paid"
                            value={
                              <>
                                ₹
                                {
                                  o.total_amount ||
                                  0
                                }

                                <span className="advance-text">
                                  {" "}
                                  (Adv: ₹
                                  {
                                    o.advance_paid ||
                                    0
                                  }
                                  )
                                </span>
                              </>
                            }
                          />

                          {due && (

                            <button
                              className="pay-button"
                              onClick={() => {

                                setSelectedOrder(
                                  o
                                );

                                setPayAmount(
                                  String(
                                    remaining
                                  )
                                );

                                setPaymentModal(
                                  true
                                );
                              }}
                            >
                              Pay Remaining ₹
                              {
                                remaining
                              }
                            </button>

                          )}

                        </div>

                      );
                    }
                  )

                )}

              </div>

            )}

          </div>

        </div>
      )}

      {/* =================================================
          PAYMENT MODAL
      ================================================= */}

      {paymentModal && (

        <div className="modal-overlay">

          <div className="payment-modal">

            <div className="modal-header">

              <div>

                <h2>
                  Pay Remaining Balance
                </h2>

                <p>
                  Order:{" "}
                  {
                    selectedOrder?.order_no
                  }
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setPaymentModal(false)
                }
              >
                ×
              </button>

            </div>

            <div className="payment-body">

              <InputField
                label="Payment Amount"
                value={payAmount}
                setValue={setPayAmount}
                type="number"
                placeholder="Enter payment"
              />

              <button
                className="confirm-payment-button"
                onClick={
                  payRemainingBalance
                }
              >
                ✓ Confirm Payment
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  label,
  value,
  icon,
  active,
  onClick
}) {

  return (

    <button
      className={`summary-card ${
        active
          ? "summary-card-active"
          : ""
      }`}
      onClick={onClick}
    >

      <div className="summary-icon">
        {icon}
      </div>

      <div className="summary-label">
        {label}
      </div>

      <div className="summary-value">
        {value}
      </div>

    </button>
  );
}

/* =========================================================
   HISTORY ROW
========================================================= */

function HistoryRow({
  label,
  value
}) {

  return (

    <div className="history-row">

      <span>
        {label}:
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}
