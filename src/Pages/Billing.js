import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Html5Qrcode } from "html5-qrcode";
import { QRCodeSVG } from "qrcode.react";

const API_BASE =
  "https://visiontrackdatabase.onrender.com";

const Billing = () => {
  const [patients, setPatients] = useState([]);
  const [allOrders, setAllOrders] = useState([]);

  const [selectedPatient, setSelectedPatient] =
    useState(null);

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [loadingPatients, setLoadingPatients] =
    useState(false);

  const [loadingOrders, setLoadingOrders] =
    useState(false);

  const [patientSearch, setPatientSearch] =
    useState("");

  /* =========================================================
     SCANNER
  ========================================================= */

  const [scannerOpen, setScannerOpen] =
    useState(false);

  const [scannerLoading, setScannerLoading] =
    useState(false);

  const [scannerError, setScannerError] =
    useState("");

  const [torchOn, setTorchOn] =
    useState(false);

  const scannerRef = useRef(null);
  const scannerStartedRef = useRef(false);

  /* =========================================================
     BILLING
  ========================================================= */

  const getToday = () =>
    new Date().toISOString().split("T")[0];

  const [billing, setBilling] = useState({
    invoiceNumber: "",
    date: getToday(),
    courierCharges: 0,
    discount: 0,
    receivedAmount: 0,
    paymentMode: "Cash",
  });

  /* =========================================================
     LOAD DATA
  ========================================================= */

  useEffect(() => {
    loadPatients();
    loadOrders();

    return () => {
      stopScanner();
    };
  }, []);

  /* =========================================================
     LOAD PATIENTS
  ========================================================= */

  const loadPatients = async () => {
    try {
      setLoadingPatients(true);

      const response = await fetch(
        `${API_BASE}/patient/superadmin`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load patients"
        );
      }

      const data = await response.json();

      setPatients(
        data.success &&
          Array.isArray(data.patients)
          ? data.patients
          : []
      );
    } catch (error) {
      console.error(
        "LOAD PATIENTS ERROR:",
        error
      );

      setPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  };

  /* =========================================================
     LOAD ORDERS
  ========================================================= */

  const loadOrders = async () => {
    try {
      setLoadingOrders(true);

      const response = await fetch(
        `${API_BASE}/opticalorders/superadmin`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load optical orders"
        );
      }

      const data = await response.json();

      setAllOrders(
        data.success &&
          Array.isArray(data.orders)
          ? data.orders
          : []
      );
    } catch (error) {
      console.error(
        "LOAD ORDERS ERROR:",
        error
      );

      setAllOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  /* =========================================================
     FILTER PATIENTS
  ========================================================= */

  const filteredPatients = useMemo(() => {
    const search =
      patientSearch.trim().toLowerCase();

    if (!search) {
      return patients;
    }

    return patients.filter((patient) => {
      return (
        String(patient.name || "")
          .toLowerCase()
          .includes(search) ||
        String(patient.patient_id || "")
          .toLowerCase()
          .includes(search) ||
        String(patient.mobile || "")
          .toLowerCase()
          .includes(search)
      );
    });
  }, [patients, patientSearch]);

  /* =========================================================
     PATIENT ORDERS
  ========================================================= */

  const patientOrders = useMemo(() => {
    if (!selectedPatient) {
      return [];
    }

    return allOrders.filter((order) => {
      return (
        String(order.patient_id || "")
          .trim()
          .toLowerCase() ===
        String(
          selectedPatient.patient_id || ""
        )
          .trim()
          .toLowerCase()
      );
    });
  }, [
    allOrders,
    selectedPatient,
  ]);

  /* =========================================================
     SELECT PATIENT
  ========================================================= */

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setSelectedOrder(null);

    setBilling({
      invoiceNumber: "",
      date: getToday(),
      courierCharges: 0,
      discount: 0,
      receivedAmount: 0,
      paymentMode: "Cash",
    });

    const matchingOrders =
      allOrders.filter((order) => {
        return (
          String(order.patient_id || "")
            .trim()
            .toLowerCase() ===
          String(
            patient.patient_id || ""
          )
            .trim()
            .toLowerCase()
        );
      });

    if (matchingOrders.length > 0) {
      const sortedOrders =
        [...matchingOrders].sort(
          (a, b) =>
            new Date(
              b.created_at ||
                b.order_date ||
                0
            ) -
            new Date(
              a.created_at ||
                a.order_date ||
                0
            )
        );

      loadOrderIntoBilling(
        sortedOrders[0]
      );
    }
  };

  /* =========================================================
     LOAD ORDER INTO BILL
  ========================================================= */

  const loadOrderIntoBilling = (
    order
  ) => {
    if (!order) {
      return;
    }

    setSelectedOrder(order);

    const advancePaid = Number(
      order.advance_paid || 0
    );

    setBilling({
      invoiceNumber:
        order.bill_number ||
        order.order_no ||
        "",
      date: order.order_date
        ? String(
            order.order_date
          ).split("T")[0]
        : getToday(),
      courierCharges: 0,
      discount: 0,
      receivedAmount: advancePaid,
      paymentMode:
        order.payment_mode ||
        "Cash",
    });
  };

  /* =========================================================
     CALCULATIONS
  ========================================================= */

  const subtotal = useMemo(() => {
    if (!selectedOrder) {
      return 0;
    }

    return Number(
      selectedOrder.total_amount || 0
    );
  }, [selectedOrder]);

  const total = useMemo(() => {
    return Math.max(
      subtotal +
        Number(
          billing.courierCharges || 0
        ) -
        Number(
          billing.discount || 0
        ),
      0
    );
  }, [
    subtotal,
    billing.courierCharges,
    billing.discount,
  ]);

  const balance = useMemo(() => {
    return Math.max(
      total -
        Number(
          billing.receivedAmount || 0
        ),
      0
    );
  }, [
    total,
    billing.receivedAmount,
  ]);

  const updateBillingField = (
    field,
    value
  ) => {
    setBilling((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =========================================================
     FORMATTERS
  ========================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "-";
    }

    return d.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatMoney = (value) => {
    return Number(
      value || 0
    ).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getStatusClass = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "completed") {
      return "status completed";
    }

    if (value === "pending") {
      return "status pending";
    }

    if (value === "cancelled") {
      return "status cancelled";
    }

    return "status";
  };

  /* =========================================================
     SCANNER
  ========================================================= */

  const startScanner = async () => {
    try {
      setScannerLoading(true);
      setScannerError("");
      setTorchOn(false);

      if (!scannerRef.current) {
        setScannerError(
          "Scanner container is not available."
        );

        setScannerLoading(false);
        return;
      }

      if (scannerStartedRef.current) {
        return;
      }

      const scanner =
        new Html5Qrcode(
          "billing-qr-reader"
        );

      scannerRef.current = scanner;
      scannerStartedRef.current = true;

      const config = {
        fps: 15,
        qrbox: {
          width: 240,
          height: 240,
        },
        aspectRatio: 1,
        formatsToSupport: [
          0,
          1,
          3,
          5,
          6,
          9,
          11,
        ],
      };

      await scanner.start(
        {
          facingMode: "environment",
        },
        config,
        async (decodedText) => {
          updateBillingField(
            "invoiceNumber",
            decodedText
          );

          await stopScanner();

          setScannerOpen(false);
        },
        () => {}
      );

      setScannerLoading(false);
    } catch (error) {
      console.error(
        "START SCANNER ERROR:",
        error
      );

      scannerStartedRef.current =
        false;

      setScannerLoading(false);

      setScannerError(
        "Camera permission denied or unavailable. Check browser permissions."
      );
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        if (
          scannerStartedRef.current
        ) {
          try {
            await scannerRef.current.stop();
          } catch (e) {}
        }

        try {
          await scannerRef.current.clear();
        } catch (e) {}
      }
    } catch (error) {
      console.error(
        "STOP SCANNER ERROR:",
        error
      );
    } finally {
      scannerStartedRef.current =
        false;

      scannerRef.current = null;

      setTorchOn(false);
    }
  };

  const toggleTorch = async () => {
    try {
      if (
        scannerRef.current &&
        scannerStartedRef.current
      ) {
        if (
          scannerRef.current
            .applyVideoConstraints
        ) {
          const nextState =
            !torchOn;

          await scannerRef.current.applyVideoConstraints(
            {
              advanced: [
                {
                  torch: nextState,
                },
              ],
            }
          );

          setTorchOn(nextState);
        }
      }
    } catch (error) {
      alert(
        "Flashlight mode is not supported on this device."
      );
    }
  };

  const openScanner = () => {
    setScannerError("");
    setScannerOpen(true);

    setTimeout(() => {
      startScanner();
    }, 300);
  };

  const closeScanner = async () => {
    await stopScanner();

    setScannerOpen(false);
    setScannerError("");
  };

  /* =========================================================
     PRINT
  ========================================================= */

  const printInvoice = () => {
    if (
      !selectedPatient ||
      !selectedOrder
    ) {
      alert(
        "Please select a patient and order first."
      );

      return;
    }

    window.print();
  };

  /* =========================================================
     WHATSAPP
  ========================================================= */

  const shareOnWhatsApp = () => {
    if (
      !selectedPatient ||
      !selectedOrder
    ) {
      alert(
        "Please select a patient and order first."
      );

      return;
    }

    const mobileNumber =
      String(
        selectedPatient.mobile || ""
      ).replace(/\D/g, "");

    if (!mobileNumber) {
      alert(
        "Patient mobile number is missing."
      );

      return;
    }

    const message = `*VISIONTRACK INVOICE*
----------------------------
Bill No: ${
      billing.invoiceNumber ||
      selectedOrder.order_no ||
      "N/A"
    }
Patient Name: ${
      selectedPatient.name ||
      "N/A"
    }
Patient ID: ${
      selectedPatient.patient_id ||
      "N/A"
    }
Date: ${formatDate(billing.date)}
Payment Mode: ${
      billing.paymentMode
    }

Subtotal: ₹${formatMoney(
      subtotal
    )}
Courier: ₹${formatMoney(
      billing.courierCharges
    )}
Discount: ₹${formatMoney(
      billing.discount
    )}
*Total Amount: ₹${formatMoney(
      total
    )}*
Received: ₹${formatMoney(
      billing.receivedAmount
    )}
*Balance Due: ₹${formatMoney(
      balance
    )}*
----------------------------
Thank you for choosing VisionTrack!`;

    const encodedMessage =
      encodeURIComponent(message);

    const whatsappUrl =
      `https://wa.me/${mobileNumber}?text=${encodedMessage}`;

    window.open(
      whatsappUrl,
      "_blank"
    );
  };

  /* =========================================================
     CLEAR
  ========================================================= */

  const clearSelection = () => {
    setSelectedPatient(null);
    setSelectedOrder(null);

    setBilling({
      invoiceNumber: "",
      date: getToday(),
      courierCharges: 0,
      discount: 0,
      receivedAmount: 0,
      paymentMode: "Cash",
    });
  };

  /* =========================================================
     QR PAYLOAD
  ========================================================= */

  const qrCodePayload = useMemo(() => {
    if (
      !selectedPatient ||
      !selectedOrder
    ) {
      return "VISIONTRACK-INVOICE-PENDING";
    }

    return JSON.stringify({
      invoice:
        billing.invoiceNumber ||
        selectedOrder.order_no ||
        "N/A",
      patientId:
        selectedPatient.patient_id,
      name: selectedPatient.name,
      mobile: selectedPatient.mobile,
      total,
      balance,
      date: billing.date,
    });
  }, [
    selectedPatient,
    selectedOrder,
    billing,
    total,
    balance,
  ]);

  /* =========================================================
     UI
  ========================================================= */

  return (
    <>
      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
          background: #f5f7fb;
        }

        button,
        input,
        select {
          font-family: inherit;
        }

        .billingPage {
          min-height: 100vh;
          background: #f5f7fb;
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .pageHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
        }

        .pageTitle {
          margin: 0;
          font-size: 28px;
          font-weight: 800;
          color: #111827;
        }

        .pageSubtitle {
          margin: 5px 0 0;
          color: #6b7280;
          font-size: 14px;
        }

        .refreshButton {
          border: 1px solid #dbe1ea;
          background: #fff;
          color: #374151;
          padding: 10px 16px;
          border-radius: 9px;
          cursor: pointer;
          font-weight: 600;
        }

        .card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          box-shadow:
            0 3px 15px
            rgba(15, 23, 42, 0.04);
        }

        .patientSelectorContainer {
          margin-top: 10px;
        }

        .cardHeader {
          padding: 22px;
          border-bottom: 1px solid #eef0f4;
        }

        .cardHeaderTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .cardTitle {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
          color: #111827;
        }

        .countBadge {
          background: #eef2ff;
          color: #4338ca;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
        }

        .searchBox {
          margin-top: 16px;
        }

        .searchInput {
          width: 100%;
          height: 46px;
          border: 1px solid #d9dee8;
          border-radius: 10px;
          padding: 0 16px;
          outline: none;
          font-size: 15px;
        }

        .patientGridList {
          display: grid;
          grid-template-columns:
            repeat(
              auto-fill,
              minmax(280px, 1fr)
            );
          gap: 15px;
          padding: 20px;
          max-height:
            calc(100vh - 280px);
          overflow-y: auto;
        }

        .patientCard {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 18px;
          cursor: pointer;
          background: #fff;
          transition: 0.18s;
        }

        .patientCard:hover {
          background: #f8fafc;
          border-color: #93c5fd;
          transform: translateY(-2px);
        }

        .patientName {
          margin: 0 0 6px;
          color: #111827;
          font-size: 16px;
          font-weight: 800;
        }

        .patientMeta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: #6b7280;
          font-size: 13px;
        }

        .patientOrderBadge,
        .patientNoOrderBadge {
          display: inline-flex;
          margin-top: 12px;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
        }

        .patientOrderBadge {
          background: #ecfdf5;
          color: #047857;
        }

        .patientNoOrderBadge {
          background: #f3f4f6;
          color: #6b7280;
        }

        .emptyState {
          padding: 45px 20px;
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
          grid-column: 1 / -1;
        }

        .loading {
          padding: 30px;
          text-align: center;
          color: #6b7280;
          font-size: 13px;
          grid-column: 1 / -1;
        }

        .patientHeader {
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: center;
          border-bottom: 1px solid #edf0f4;
          background: #fafbfc;
          border-radius:
            16px 16px 0 0;
        }

        .patientHeaderInfo {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .avatar {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #2563eb;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
          font-weight: 800;
        }

        .selectedPatientName {
          margin: 0;
          font-size: 21px;
          color: #111827;
        }

        .selectedPatientMeta {
          margin: 4px 0 0;
          color: #6b7280;
          font-size: 13px;
        }

        .clearButton {
          border: 1px solid #dbe1ea;
          background: #fff;
          color: #374151;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
        }

        .section {
          padding: 20px 24px;
          border-bottom: 1px solid #edf0f4;
        }

        .sectionTitle {
          margin: 0 0 14px;
          font-size: 15px;
          font-weight: 750;
          color: #111827;
        }

        .orderList {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .orderCard {
          border: 1px solid #e5e7eb;
          border-radius: 11px;
          padding: 14px;
          cursor: pointer;
          background: #fff;
        }

        .orderCard.active {
          border-color: #2563eb;
          background: #eff6ff;
        }

        .orderTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .orderNumber {
          font-size: 14px;
          font-weight: 800;
          color: #111827;
        }

        .orderDate {
          color: #6b7280;
          font-size: 12px;
        }

        .orderDetails {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 12px;
          margin-top: 13px;
        }

        .detailLabel {
          color: #9ca3af;
          font-size: 11px;
          text-transform: uppercase;
        }

        .detailValue {
          margin-top: 3px;
          color: #374151;
          font-size: 13px;
          font-weight: 600;
          word-break: break-word;
        }

        .status {
          display: inline-flex;
          align-items: center;
          padding: 5px 9px;
          border-radius: 20px;
          background: #f3f4f6;
          color: #4b5563;
          font-size: 11px;
          font-weight: 750;
        }

        .status.pending {
          background: #fff7ed;
          color: #c2410c;
        }

        .status.completed {
          background: #ecfdf5;
          color: #047857;
        }

        .status.cancelled {
          background: #fef2f2;
          color: #b91c1c;
        }

        .invoiceDetailsGrid {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }

        .formGroup {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .formLabel {
          color: #374151;
          font-size: 12px;
          font-weight: 700;
        }

        .formInput,
        .formSelect {
          height: 42px;
          width: 100%;
          border: 1px solid #d9dee8;
          border-radius: 8px;
          padding: 0 11px;
          outline: none;
          color: #111827;
          background: #fff;
          font-size: 13px;
        }

        .scannerContainer {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .scannerInput {
          flex: 1;
        }

        .qrProScanBtn {
          height: 42px;
          padding: 0 14px;
          border: none;
          border-radius: 9px;
          background: #2563eb;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
          font-weight: 700;
          font-size: 13px;
          white-space: nowrap;
        }

        .productBox {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .productHeader {
          background: #f8fafc;
          padding: 11px 14px;
          display: grid;
          grid-template-columns:
            1.5fr 1fr 1fr;
          gap: 10px;
          color: #6b7280;
          font-size: 11px;
          font-weight: 750;
          text-transform: uppercase;
        }

        .productRow {
          padding: 15px 14px;
          display: grid;
          grid-template-columns:
            1.5fr 1fr 1fr;
          gap: 10px;
          border-top: 1px solid #edf0f4;
          align-items: center;
        }

        .productName {
          font-weight: 750;
          color: #111827;
          font-size: 14px;
        }

        .productSub {
          margin-top: 3px;
          color: #6b7280;
          font-size: 11px;
        }

        .priceText {
          color: #111827;
          font-weight: 750;
          font-size: 14px;
        }

        .summaryLayout {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr) 220px;
          gap: 25px;
          align-items: center;
        }

        .qrCodeWrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 15px;
          text-align: center;
        }

        .qrCodeWrapper p {
          margin: 8px 0 0;
          font-size: 11px;
          color: #6b7280;
          font-weight: 600;
        }

        .amountSummary {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 17px;
        }

        .amountLine {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          gap: 15px;
          color: #6b7280;
          font-size: 13px;
        }

        .amountLine strong {
          color: #111827;
        }

        .amountInput {
          width: 145px;
          height: 37px;
          border: 1px solid #d9dee8;
          border-radius: 7px;
          padding: 0 9px;
          text-align: right;
          outline: none;
        }

        .totalLine {
          margin-top: 7px;
          padding-top: 14px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .totalLabel {
          color: #111827;
          font-size: 17px;
          font-weight: 800;
        }

        .totalValue {
          color: #2563eb;
          font-size: 22px;
          font-weight: 850;
        }

        .receivedLine {
          margin-top: 13px;
          padding: 12px;
          background: #f0fdf4;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .balanceLine {
          margin-top: 10px;
          padding: 14px;
          background: #fff7ed;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .balanceLine span {
          color: #9a3412;
          font-weight: 700;
        }

        .balanceLine strong {
          color: #c2410c;
          font-size: 18px;
        }

        .actionBar {
          padding: 20px 24px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
        }

        .primaryButton,
        .secondaryButton {
          min-height: 43px;
          padding: 0 17px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 750;
          font-size: 13px;
        }

        .primaryButton {
          border: none;
          background: #2563eb;
          color: #fff;
        }

        .secondaryButton {
          border: 1px solid #d5dce7;
          background: #fff;
          color: #374151;
        }

        /* =====================================================
           SCANNER MODAL
        ===================================================== */

        .qrProOverlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(
            5,
            7,
            15,
            0.85
          );
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .qrProModal {
          width: min(420px, 100%);
          background: #111827;
          border-radius: 24px;
          overflow: hidden;
          color: #fff;
        }

        .qrProHeader {
          padding: 18px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid
            rgba(
              255,
              255,
              255,
              0.08
            );
        }

        .qrProHeaderInfo h3 {
          margin: 0;
          font-size: 17px;
        }

        .qrProHeaderInfo p {
          margin: 3px 0 0;
          font-size: 12px;
          color: #9ca3af;
        }

        .qrProCloseBtn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background:
            rgba(
              255,
              255,
              255,
              0.08
            );
          color: #fff;
          cursor: pointer;
          font-size: 18px;
        }

        .qrProBody {
          padding: 20px;
        }

        .qrProCameraCard {
          position: relative;
          width: 100%;
          height: 320px;
          background: #000;
          border-radius: 16px;
          overflow: hidden;
        }

        #billing-qr-reader {
          width: 100% !important;
          border: none !important;
        }

        #billing-qr-reader video {
          width: 100% !important;
          height: 320px !important;
          object-fit: cover !important;
        }

        #billing-qr-reader__dashboard,
        #billing-qr-reader img {
          display: none !important;
        }

        .qrProTargetOverlay {
          pointer-events: none;
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qrProScanWindow {
          width: 220px;
          height: 220px;
          border: 2px solid #3b82f6;
          border-radius: 16px;
          position: relative;
        }

        .qrProLaserBeam {
          position: absolute;
          left: 10px;
          right: 10px;
          height: 2px;
          background: #60a5fa;
          animation:
            laserScan
            2.2s infinite
            ease-in-out;
        }

        @keyframes laserScan {
          0% {
            top: 10px;
            opacity: 0.2;
          }

          50% {
            top: 200px;
            opacity: 1;
          }

          100% {
            top: 10px;
            opacity: 0.2;
          }
        }

        .qrProFooterControls {
          width: 100%;
          margin-top: 16px;
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .qrProActionTag {
          background:
            rgba(
              255,
              255,
              255,
              0.06
            );
          border: 1px solid
            rgba(
              255,
              255,
              255,
              0.08
            );
          color: #d1d5db;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        /* =====================================================
           PRINT ONLY INVOICE
        ===================================================== */

        .printInvoice {
          display: none;
        }

        @media print {

          @page {
            size: A4 portrait;
            margin: 8mm;
          }

          html,
          body {
            width: 210mm;
            min-height: 297mm;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body * {
            visibility: hidden !important;
          }

          .printInvoice,
          .printInvoice * {
            visibility: visible !important;
          }

          .billingPage {
            display: none !important;
          }

          .printInvoice {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            min-height: 100%;
            background: #fff;
            color: #111827;
            font-family:
              Arial,
              Helvetica,
              sans-serif;
          }

          .printSheet {
            width: 100%;
            max-width: 194mm;
            margin: 0 auto;
            padding: 0;
            background: #fff;
          }

          /* Header */

          .printHeader {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 7px;
            border-bottom: 2px solid #111827;
          }

          .printCompanyName {
            margin: 0;
            font-size: 22px;
            line-height: 1.1;
            font-weight: 800;
            letter-spacing: 0.2px;
          }

          .printCompanySub {
            margin-top: 4px;
            font-size: 9px;
            color: #64748b;
          }

          .printInvoiceTitle {
            text-align: right;
          }

          .printInvoiceTitle h2 {
            margin: 0;
            font-size: 19px;
            font-weight: 800;
            text-transform: uppercase;
          }

          .printInvoiceTitle p {
            margin: 3px 0 0;
            font-size: 9px;
            color: #64748b;
          }

          /* Top information */

          .printInfoGrid {
            display: grid;
            grid-template-columns: 1.35fr 1fr;
            gap: 12px;
            margin-top: 9px;
          }

          .printInfoBox {
            border: 1px solid #d1d5db;
            border-radius: 4px;
            padding: 7px 9px;
            min-height: 54px;
          }

          .printBoxTitle {
            margin: 0 0 4px;
            font-size: 8px;
            font-weight: 800;
            text-transform: uppercase;
            color: #64748b;
            letter-spacing: 0.4px;
          }

          .printPatientName {
            margin: 0;
            font-size: 12px;
            font-weight: 800;
          }

          .printSmall {
            margin-top: 2px;
            font-size: 9px;
            color: #374151;
          }

          .printBillGrid {
            display: grid;
            grid-template-columns:
              repeat(2, 1fr);
            gap: 4px 12px;
          }

          .printBillItem {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            font-size: 9px;
          }

          .printBillItem span:first-child {
            color: #64748b;
          }

          .printBillItem strong {
            font-weight: 700;
          }

          /* Item table */

          .printSectionTitle {
            margin: 10px 0 5px;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }

          .printTable {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }

          .printTable th {
            background: #f1f5f9 !important;
            border: 1px solid #cbd5e1;
            padding: 5px 6px;
            text-align: left;
            font-size: 8px;
            font-weight: 800;
            text-transform: uppercase;
          }

          .printTable td {
            border: 1px solid #d1d5db;
            padding: 6px;
            font-size: 9px;
            vertical-align: top;
          }

          .printTable th:nth-child(1),
          .printTable td:nth-child(1) {
            width: 8%;
            text-align: center;
          }

          .printTable th:nth-child(2),
          .printTable td:nth-child(2) {
            width: 48%;
          }

          .printTable th:nth-child(3),
          .printTable td:nth-child(3) {
            width: 14%;
            text-align: center;
          }

          .printTable th:nth-child(4),
          .printTable td:nth-child(4) {
            width: 15%;
            text-align: right;
          }

          .printTable th:nth-child(5),
          .printTable td:nth-child(5) {
            width: 15%;
            text-align: right;
          }

          .printItemName {
            font-size: 10px;
            font-weight: 800;
          }

          .printItemSub {
            margin-top: 2px;
            font-size: 8px;
            color: #64748b;
          }

          /* Bottom area */

          .printBottom {
            display: grid;
            grid-template-columns:
              1fr 72mm;
            gap: 14px;
            margin-top: 10px;
            align-items: start;
          }

          .printNotes {
            border: 1px solid #d1d5db;
            border-radius: 4px;
            padding: 8px;
            min-height: 95px;
          }

          .printNotesTitle {
            font-size: 9px;
            font-weight: 800;
            margin-bottom: 5px;
            text-transform: uppercase;
          }

          .printNotes p {
            margin: 3px 0;
            font-size: 8px;
            color: #4b5563;
            line-height: 1.35;
          }

          .printSummary {
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            padding: 7px 9px;
          }

          .printSummaryRow {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 3px 0;
            font-size: 9px;
          }

          .printSummaryRow span:first-child {
            color: #64748b;
          }

          .printSummaryRow strong {
            font-weight: 700;
          }

          .printGrandTotal {
            margin-top: 4px;
            padding: 7px 0;
            border-top: 1px solid #111827;
            border-bottom: 1px solid #111827;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .printGrandTotal span {
            font-size: 11px;
            font-weight: 800;
          }

          .printGrandTotal strong {
            font-size: 14px;
            font-weight: 900;
          }

          .printReceived {
            margin-top: 5px;
            padding: 5px 6px;
            background: #f0fdf4 !important;
            display: flex;
            justify-content: space-between;
            font-size: 9px;
          }

          .printBalance {
            margin-top: 4px;
            padding: 6px;
            background: #fff7ed !important;
            display: flex;
            justify-content: space-between;
            font-size: 9px;
          }

          .printBalance strong {
            font-size: 11px;
          }

          /* QR */

          .printFooterArea {
            display: grid;
            grid-template-columns:
              1fr 35mm;
            gap: 10px;
            margin-top: 9px;
            align-items: center;
          }

          .printThankYou {
            text-align: left;
          }

          .printThankYou h4 {
            margin: 0 0 3px;
            font-size: 10px;
            font-weight: 800;
          }

          .printThankYou p {
            margin: 0;
            font-size: 8px;
            color: #64748b;
            line-height: 1.4;
          }

          .printQR {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .printQR svg {
            width: 27mm !important;
            height: 27mm !important;
          }

          .printQRText {
            margin-top: 2px;
            font-size: 7px;
            color: #64748b;
            text-align: center;
          }

          .printSignature {
            margin-top: 11px;
            display: grid;
            grid-template-columns:
              1fr 1fr;
            gap: 30px;
          }

          .signatureBox {
            border-top: 1px solid #9ca3af;
            padding-top: 3px;
            text-align: center;
            font-size: 7px;
            color: #64748b;
          }

          .printCopyright {
            margin-top: 8px;
            padding-top: 5px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 7px;
            color: #94a3b8;
          }

          .printAvoidBreak {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }

        @media (max-width: 768px) {

          .billingPage {
            padding: 12px;
          }

          .pageHeader {
            align-items: flex-start;
            gap: 12px;
          }

          .pageTitle {
            font-size: 22px;
          }

          .invoiceDetailsGrid {
            grid-template-columns: 1fr;
          }

          .summaryLayout {
            grid-template-columns: 1fr;
          }

          .orderDetails {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

      `}</style>

      {/* =====================================================
          NORMAL BILLING SCREEN
      ===================================================== */}

      <div className="billingPage">

        <div className="pageHeader">
          <div>
            <h1 className="pageTitle">
              Billing &amp; Invoices
            </h1>

            <p className="pageSubtitle">
              Select a patient first to
              manage their orders and
              generate bills.
            </p>
          </div>

          <button
            className="refreshButton"
            onClick={() => {
              loadPatients();
              loadOrders();
            }}
          >
            Refresh Data
          </button>
        </div>

        {!selectedPatient ? (
          <div className="card patientSelectorContainer">

            <div className="cardHeader">

              <div className="cardHeaderTop">

                <h3 className="cardTitle">
                  Select a Patient to Start
                  Billing
                </h3>

                <span className="countBadge">
                  {filteredPatients.length}{" "}
                  Patients
                </span>

              </div>

              <div className="searchBox">

                <input
                  type="text"
                  className="searchInput"
                  placeholder="Search patient by name, ID, or mobile number..."
                  value={patientSearch}
                  onChange={(e) =>
                    setPatientSearch(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            <div className="patientGridList">

              {loadingPatients ? (
                <div className="loading">
                  Loading patient records...
                </div>
              ) : filteredPatients.length ===
                0 ? (
                <div className="emptyState">
                  No patients matched your
                  search
                </div>
              ) : (
                filteredPatients.map(
                  (patient) => {

                    const hasOrders =
                      allOrders.some(
                        (o) =>
                          String(
                            o.patient_id ||
                              ""
                          )
                            .trim()
                            .toLowerCase() ===
                          String(
                            patient.patient_id ||
                              ""
                          )
                            .trim()
                            .toLowerCase()
                      );

                    return (
                      <div
                        key={
                          patient.patient_id ||
                          patient.id
                        }
                        className="patientCard"
                        onClick={() =>
                          handlePatientClick(
                            patient
                          )
                        }
                      >
                        <h4 className="patientName">
                          {patient.name ||
                            "Unnamed Patient"}
                        </h4>

                        <div className="patientMeta">
                          <span>
                            ID:{" "}
                            {patient.patient_id ||
                              "-"}
                          </span>

                          <span>
                            Mobile:{" "}
                            {patient.mobile ||
                              "-"}
                          </span>
                        </div>

                        {hasOrders ? (
                          <span className="patientOrderBadge">
                            Has Optical Orders
                          </span>
                        ) : (
                          <span className="patientNoOrderBadge">
                            No Active Orders
                          </span>
                        )}
                      </div>
                    );
                  }
                )
              )}

            </div>
          </div>
        ) : (

          <div className="card">

            {/* Patient Header */}

            <div className="patientHeader">

              <div className="patientHeaderInfo">

                <div className="avatar">
                  {selectedPatient.name
                    ? selectedPatient.name
                        .charAt(0)
                        .toUpperCase()
                    : "P"}
                </div>

                <div>

                  <h2 className="selectedPatientName">
                    {selectedPatient.name}
                  </h2>

                  <p className="selectedPatientMeta">
                    Patient ID:{" "}
                    {selectedPatient.patient_id ||
                      "-"}{" "}
                    | Mobile:{" "}
                    {selectedPatient.mobile ||
                      "-"}
                  </p>

                </div>

              </div>

              <button
                className="clearButton"
                onClick={
                  clearSelection
                }
              >
                &larr; Back to Patients
              </button>

            </div>

            {/* Orders */}

            <div className="section">

              <h4 className="sectionTitle">
                Select Associated Order
              </h4>

              {patientOrders.length ===
              0 ? (
                <div
                  className="emptyState"
                  style={{
                    padding:
                      "15px 0",
                  }}
                >
                  No optical orders found
                  for this patient.
                </div>
              ) : (

                <div className="orderList">

                  {patientOrders.map(
                    (ord) => {

                      const isOrdActive =
                        selectedOrder?.order_no ===
                          ord.order_no ||
                        selectedOrder?.id ===
                          ord.id;

                      return (
                        <div
                          key={
                            ord.order_no ||
                            ord.id
                          }
                          className={`orderCard ${
                            isOrdActive
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            loadOrderIntoBilling(
                              ord
                            )
                          }
                        >

                          <div className="orderTop">

                            <span className="orderNumber">
                              Order:{" "}
                              {ord.order_no ||
                                ord.bill_number ||
                                "N/A"}
                            </span>

                            <span className="orderDate">
                              {formatDate(
                                ord.order_date ||
                                  ord.created_at
                              )}
                            </span>

                            <span
                              className={getStatusClass(
                                ord.status
                              )}
                            >
                              {ord.status ||
                                "Pending"}
                            </span>

                          </div>

                          <div className="orderDetails">

                            <div>
                              <div className="detailLabel">
                                Frame
                              </div>

                              <div className="detailValue">
                                {ord.frame_model ||
                                  "-"}
                              </div>
                            </div>

                            <div>
                              <div className="detailLabel">
                                Lens
                              </div>

                              <div className="detailValue">
                                {ord.lens_type ||
                                  "-"}
                              </div>
                            </div>

                            <div>
                              <div className="detailLabel">
                                Advance Paid
                              </div>

                              <div className="detailValue">
                                ₹
                                {formatMoney(
                                  ord.advance_paid
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="detailLabel">
                                Total Amount
                              </div>

                              <div className="detailValue">
                                ₹
                                {formatMoney(
                                  ord.total_amount
                                )}
                              </div>
                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </div>

            {/* Invoice Settings */}

            <div className="section">

              <h4 className="sectionTitle">
                Invoice Settings &amp;
                Barcode Scanner
              </h4>

              <div className="invoiceDetailsGrid">

                <div className="formGroup">

                  <label className="formLabel">
                    Invoice / Bill Number
                  </label>

                  <div className="scannerContainer">

                    <input
                      type="text"
                      className="formInput scannerInput"
                      placeholder="Scan or enter bill no."
                      value={
                        billing.invoiceNumber
                      }
                      onChange={(e) =>
                        updateBillingField(
                          "invoiceNumber",
                          e.target.value
                        )
                      }
                    />

                    <button
                      type="button"
                      className="qrProScanBtn"
                      onClick={
                        openScanner
                      }
                    >
                      ▦ Scan
                    </button>

                  </div>
                </div>

                <div className="formGroup">

                  <label className="formLabel">
                    Invoice Date
                  </label>

                  <input
                    type="date"
                    className="formInput"
                    value={billing.date}
                    onChange={(e) =>
                      updateBillingField(
                        "date",
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="formGroup">

                  <label className="formLabel">
                    Payment Mode
                  </label>

                  <select
                    className="formSelect"
                    value={
                      billing.paymentMode
                    }
                    onChange={(e) =>
                      updateBillingField(
                        "paymentMode",
                        e.target.value
                      )
                    }
                  >
                    <option value="Cash">
                      Cash
                    </option>

                    <option value="UPI">
                      UPI
                    </option>

                    <option value="Card">
                      Card
                    </option>

                    <option value="Credit">
                      Credit
                    </option>

                    <option value="Online">
                      Online
                    </option>
                  </select>

                </div>

              </div>

              {selectedOrder && (

                <div className="productBox">

                  <div className="productHeader">
                    <div>
                      Item Name /
                      Description
                    </div>

                    <div>Qty</div>

                    <div>
                      Price / Amount
                    </div>
                  </div>

                  <div className="productRow">

                    <div>

                      <div className="productName">
                        {selectedOrder.frame_model ||
                          selectedOrder.lens_type ||
                          "Optical Order Item"}
                      </div>

                      <div className="productSub">
                        {selectedOrder.frame_barcode
                          ? `Barcode: ${selectedOrder.frame_barcode}`
                          : ""}
                      </div>

                    </div>

                    <div>1</div>

                    <div className="priceText">
                      ₹
                      {formatMoney(
                        subtotal
                      )}
                    </div>

                  </div>

                </div>
              )}

              {/* Summary */}

              <div className="summaryLayout">

                <div className="amountSummary">

                  <div className="amountLine">
                    <span>
                      Subtotal
                    </span>

                    <strong>
                      ₹
                      {formatMoney(
                        subtotal
                      )}
                    </strong>
                  </div>

                  <div className="amountLine">
                    <span>
                      Courier Charges
                    </span>

                    <input
                      type="number"
                      className="amountInput"
                      value={
                        billing.courierCharges
                      }
                      onChange={(e) =>
                        updateBillingField(
                          "courierCharges",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="amountLine">
                    <span>
                      Discount
                    </span>

                    <input
                      type="number"
                      className="amountInput"
                      value={
                        billing.discount
                      }
                      onChange={(e) =>
                        updateBillingField(
                          "discount",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="totalLine">
                    <span className="totalLabel">
                      Total
                    </span>

                    <span className="totalValue">
                      ₹
                      {formatMoney(
                        total
                      )}
                    </span>
                  </div>

                  <div className="receivedLine">

                    <span>
                      Received Amount
                    </span>

                    <input
                      type="number"
                      className="amountInput"
                      value={
                        billing.receivedAmount
                      }
                      onChange={(e) =>
                        updateBillingField(
                          "receivedAmount",
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <div className="balanceLine">

                    <span>
                      Balance Due
                    </span>

                    <strong>
                      ₹
                      {formatMoney(
                        balance
                      )}
                    </strong>

                  </div>

                </div>

                <div className="qrCodeWrapper">

                  <QRCodeSVG
                    value={
                      qrCodePayload
                    }
                    size={110}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                  />

                  <p>
                    Scan to verify bill
                  </p>

                </div>

              </div>

            </div>

            {/* Buttons */}

            <div className="actionBar">

              <button
                className="secondaryButton"
                onClick={
                  shareOnWhatsApp
                }
              >
                Share on WhatsApp
              </button>

              <button
                className="primaryButton"
                onClick={
                  printInvoice
                }
              >
                Print Invoice
              </button>

            </div>

          </div>
        )}

        {/* Scanner */}

        {scannerOpen && (

          <div className="qrProOverlay">

            <div className="qrProModal">

              <div className="qrProHeader">

                <div className="qrProHeaderInfo">

                  <h3>
                    QR Pro Scanner
                  </h3>

                  <p>
                    Align barcode or QR
                    code within the frame
                  </p>

                </div>

                <button
                  className="qrProCloseBtn"
                  onClick={
                    closeScanner
                  }
                >
                  &times;
                </button>

              </div>

              <div className="qrProBody">

                {scannerError ? (

                  <div
                    className="emptyState"
                    style={{
                      color: "#f87171",
                      padding:
                        "20px 0",
                    }}
                  >
                    {scannerError}
                  </div>

                ) : (

                  <div className="qrProCameraCard">

                    <div id="billing-qr-reader"></div>

                    <div className="qrProTargetOverlay">

                      <div className="qrProScanWindow">

                        <div className="qrProLaserBeam"></div>

                      </div>

                    </div>

                  </div>
                )}

                {scannerLoading && (
                  <div
                    className="loading"
                    style={{
                      color:
                        "#9ca3af",
                    }}
                  >
                    Starting camera
                    feed...
                  </div>
                )}

                <div className="qrProFooterControls">

                  <button
                    type="button"
                    className="qrProActionTag"
                    onClick={
                      toggleTorch
                    }
                  >
                    🔦 Flash:{" "}
                    {torchOn
                      ? "ON"
                      : "OFF"}
                  </button>

                  <button
                    type="button"
                    className="qrProActionTag"
                    onClick={
                      closeScanner
                    }
                  >
                    Cancel Scan
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* =====================================================
          DEDICATED A4 PRINT INVOICE
          THIS IS THE ONLY THING PRINTED
      ===================================================== */}

      {selectedPatient &&
        selectedOrder && (

          <div className="printInvoice">

            <div className="printSheet">

              {/* HEADER */}

              <div className="printHeader">

                <div>

                  <h1 className="printCompanyName">
                    VISIONTRACK
                  </h1>

                  <div className="printCompanySub">
                    Optical &amp; Eye Care
                    Management System
                  </div>

                </div>

                <div className="printInvoiceTitle">

                  <h2>
                    TAX INVOICE
                  </h2>

                  <p>
                    Original Customer Copy
                  </p>

                </div>

              </div>

              {/* PATIENT + BILL DETAILS */}

              <div className="printInfoGrid printAvoidBreak">

                <div className="printInfoBox">

                  <div className="printBoxTitle">
                    Bill To
                  </div>

                  <div className="printPatientName">
                    {selectedPatient.name ||
                      "N/A"}
                  </div>

                  <div className="printSmall">
                    Patient ID:{" "}
                    {selectedPatient.patient_id ||
                      "-"}
                  </div>

                  <div className="printSmall">
                    Mobile:{" "}
                    {selectedPatient.mobile ||
                      "-"}
                  </div>

                </div>

                <div className="printInfoBox">

                  <div className="printBoxTitle">
                    Invoice Details
                  </div>

                  <div className="printBillGrid">

                    <div className="printBillItem">
                      <span>
                        Bill No.
                      </span>

                      <strong>
                        {billing.invoiceNumber ||
                          selectedOrder.order_no ||
                          "N/A"}
                      </strong>
                    </div>

                    <div className="printBillItem">
                      <span>
                        Date
                      </span>

                      <strong>
                        {formatDate(
                          billing.date
                        )}
                      </strong>
                    </div>

                    <div className="printBillItem">
                      <span>
                        Order No.
                      </span>

                      <strong>
                        {selectedOrder.order_no ||
                          "-"}
                      </strong>
                    </div>

                    <div className="printBillItem">
                      <span>
                        Payment
                      </span>

                      <strong>
                        {billing.paymentMode ||
                          "Cash"}
                      </strong>
                    </div>

                  </div>

                </div>

              </div>

              {/* ITEMS */}

              <div className="printSectionTitle">
                Order Details
              </div>

              <table className="printTable printAvoidBreak">

                <thead>

                  <tr>
                    <th>
                      #
                    </th>

                    <th>
                      Item / Description
                    </th>

                    <th>
                      Qty
                    </th>

                    <th>
                      Rate
                    </th>

                    <th>
                      Amount
                    </th>
                  </tr>

                </thead>

                <tbody>

                  <tr>

                    <td>
                      1
                    </td>

                    <td>

                      <div className="printItemName">
                        {selectedOrder.frame_model ||
                          "Optical Order"}
                      </div>

                      <div className="printItemSub">
                        Lens:{" "}
                        {selectedOrder.lens_type ||
                          "-"}
                      </div>

                      {selectedOrder.frame_barcode && (
                        <div className="printItemSub">
                          Frame Barcode:{" "}
                          {
                            selectedOrder.frame_barcode
                          }
                        </div>
                      )}

                    </td>

                    <td>
                      1
                    </td>

                    <td>
                      ₹
                      {formatMoney(
                        subtotal
                      )}
                    </td>

                    <td>
                      ₹
                      {formatMoney(
                        subtotal
                      )}
                    </td>

                  </tr>

                </tbody>

              </table>

              {/* BOTTOM */}

              <div className="printBottom printAvoidBreak">

                <div className="printNotes">

                  <div className="printNotesTitle">
                    Order Information
                  </div>

                  <p>
                    <strong>
                      Frame:
                    </strong>{" "}
                    {selectedOrder.frame_model ||
                      "-"}
                  </p>

                  <p>
                    <strong>
                      Lens:
                    </strong>{" "}
                    {selectedOrder.lens_type ||
                      "-"}
                  </p>

                  <p>
                    <strong>
                      Order Status:
                    </strong>{" "}
                    {selectedOrder.status ||
                      "Pending"}
                  </p>

                  <p>
                    <strong>
                      Payment Mode:
                    </strong>{" "}
                    {billing.paymentMode ||
                      "Cash"}
                  </p>

                  <p>
                    Thank you for choosing
                    VisionTrack Optical
                    Services.
                  </p>

                </div>

                <div className="printSummary">

                  <div className="printSummaryRow">

                    <span>
                      Subtotal
                    </span>

                    <strong>
                      ₹
                      {formatMoney(
                        subtotal
                      )}
                    </strong>

                  </div>

                  <div className="printSummaryRow">

                    <span>
                      Courier
                    </span>

                    <strong>
                      ₹
                      {formatMoney(
                        billing.courierCharges
                      )}
                    </strong>

                  </div>

                  <div className="printSummaryRow">

                    <span>
                      Discount
                    </span>

                    <strong>
                      - ₹
                      {formatMoney(
                        billing.discount
                      )}
                    </strong>

                  </div>

                  <div className="printGrandTotal">

                    <span>
                      TOTAL
                    </span>

                    <strong>
                      ₹
                      {formatMoney(
                        total
                      )}
                    </strong>

                  </div>

                  <div className="printReceived">

                    <span>
                      Received
                    </span>

                    <strong>
                      ₹
                      {formatMoney(
                        billing.receivedAmount
                      )}
                    </strong>

                  </div>

                  <div className="printBalance">

                    <span>
                      Balance Due
                    </span>

                    <strong>
                      ₹
                      {formatMoney(
                        balance
                      )}
                    </strong>

                  </div>

                </div>

              </div>

              {/* FOOTER */}

              <div className="printFooterArea printAvoidBreak">

                <div className="printThankYou">

                  <h4>
                    Thank You!
                  </h4>

                  <p>
                    Please retain this invoice
                    for your records.
                  </p>

                  <p>
                    This is a computer-generated
                    invoice.
                  </p>

                </div>

                <div className="printQR">

                  <QRCodeSVG
                    value={
                      qrCodePayload
                    }
                    size={105}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                  />

                  <div className="printQRText">
                    Scan to verify invoice
                  </div>

                </div>

              </div>

              {/* SIGNATURE */}

              <div className="printSignature printAvoidBreak">

                <div className="signatureBox">
                  Customer Signature
                </div>

                <div className="signatureBox">
                  Authorized Signature
                </div>

              </div>

              <div className="printCopyright">
                VISIONTRACK • Optical &amp;
                Eye Care • Thank you for
                your business
              </div>

            </div>

          </div>
        )}

    </>
  );
};

export default Billing;