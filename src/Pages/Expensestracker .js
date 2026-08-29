import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

/* ============================================================
   API
============================================================ */

const API_BASE =
  "https://visiontrackdatabase.onrender.com";


/* ============================================================
   HELPERS
============================================================ */

const today = () => {
  const d = new Date();

  const year = d.getFullYear();

  const month = String(
    d.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    d.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


const formatMoney = (value) => {
  return `₹${Number(value || 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
};


const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
};


/* ============================================================
   COMPONENT
============================================================ */

const ExpenseTracker = () => {

  const [transactions, setTransactions] =
    useState([]);

  const [summary, setSummary] = useState({
    total_money_in: 0,
    total_money_out: 0,
    current_balance: 0,
    pending_to_collect: 0,
    pending_to_pay: 0,
  });

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [paymentFilter, setPaymentFilter] =
    useState("All");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [form, setForm] = useState({
    transaction_type: "IN",
    transaction_date: today(),
    amount: "",
    person_name: "",
    description: "",
    expense_category: "",
    payment_mode: "Cash",
    reference_number: "",
    notes: "",
    status: "Completed",
    added_by: "Admin",
  });


  /* ============================================================
     FETCH SUMMARY
  ============================================================ */

  const fetchSummary =
    useCallback(async () => {
      try {
        const response = await fetch(
          `${API_BASE}/expenses/summary`
        );

        const data =
          await response.json();

        if (data.success) {
          setSummary(
            data.summary || {
              total_money_in: 0,
              total_money_out: 0,
              current_balance: 0,
              pending_to_collect: 0,
              pending_to_pay: 0,
            }
          );
        }
      } catch (error) {
        console.error(
          "Summary error:",
          error
        );
      }
    }, []);


  /* ============================================================
     FETCH TRANSACTIONS
  ============================================================ */

  const fetchTransactions =
    useCallback(async () => {

      try {

        setLoading(true);

        const params =
          new URLSearchParams();

        if (typeFilter !== "All") {
          params.append(
            "type",
            typeFilter
          );
        }

        if (statusFilter !== "All") {
          params.append(
            "status",
            statusFilter
          );
        }

        if (paymentFilter !== "All") {
          params.append(
            "payment_mode",
            paymentFilter
          );
        }

        if (fromDate) {
          params.append(
            "from_date",
            fromDate
          );
        }

        if (toDate) {
          params.append(
            "to_date",
            toDate
          );
        }

        if (search.trim()) {
          params.append(
            "search",
            search.trim()
          );
        }

        const response =
          await fetch(
            `${API_BASE}/expenses/all?${params.toString()}`
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load transactions"
          );
        }

        if (data.success) {
          setTransactions(
            data.transactions || []
          );
        }

      } catch (error) {

        console.error(error);

        alert(
          error.message ||
            "Unable to connect to server"
        );

      } finally {

        setLoading(false);

      }

    }, [
      typeFilter,
      statusFilter,
      paymentFilter,
      fromDate,
      toDate,
      search,
    ]);


  /* ============================================================
     INITIAL LOAD
  ============================================================ */

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);


  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);


  /* ============================================================
     FORM CHANGE
  ============================================================ */

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  /* ============================================================
     OPEN ADD MODAL
  ============================================================ */

  const openAddModal = (
    type = "IN"
  ) => {

    setEditingId(null);

    setForm({
      transaction_type: type,
      transaction_date: today(),
      amount: "",
      person_name: "",
      description: "",
      expense_category: "",
      payment_mode: "Cash",
      reference_number: "",
      notes: "",
      status: "Completed",
      added_by: "Admin",
    });

    setShowModal(true);
  };


  /* ============================================================
     OPEN EDIT MODAL
  ============================================================ */

  const openEditModal = (
    item
  ) => {

    setEditingId(item.id);

    setForm({
      transaction_type:
        item.transaction_type || "IN",

      transaction_date:
        item.transaction_date
          ? String(
              item.transaction_date
            ).substring(0, 10)
          : today(),

      amount:
        item.amount ?? "",

      person_name:
        item.person_name || "",

      description:
        item.description || "",

      expense_category:
        item.expense_category || "",

      payment_mode:
        item.payment_mode || "Cash",

      reference_number:
        item.reference_number || "",

      notes:
        item.notes || "",

      status:
        item.status || "Completed",

      added_by:
        item.added_by || "Admin",
    });

    setShowModal(true);
  };


  /* ============================================================
     SAVE TRANSACTION
  ============================================================ */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (!form.transaction_date) {
        alert(
          "Please select transaction date"
        );
        return;
      }

      if (
        !form.amount ||
        Number(form.amount) <= 0
      ) {
        alert(
          "Please enter a valid amount"
        );
        return;
      }

      if (
        !form.person_name.trim()
      ) {
        alert(
          form.transaction_type ===
          "IN"
            ? "Please enter Received From"
            : "Please enter Given To"
        );
        return;
      }

      try {

        setSaving(true);

        const url = editingId
          ? `${API_BASE}/expenses/update/${editingId}`
          : `${API_BASE}/expenses/add`;

        const method = editingId
          ? "PUT"
          : "POST";

        const response =
          await fetch(url, {
            method,
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              ...form,
              amount: Number(
                form.amount
              ),
            }),
          });

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to save transaction"
          );
        }

        alert(
          editingId
            ? "Transaction updated successfully"
            : "Transaction added successfully"
        );

        setShowModal(false);

        await Promise.all([
          fetchTransactions(),
          fetchSummary(),
        ]);

      } catch (error) {

        console.error(error);

        alert(
          error.message ||
            "Something went wrong"
        );

      } finally {

        setSaving(false);

      }
    };


  /* ============================================================
     DELETE
  ============================================================ */

  const deleteTransaction =
    async (id) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this transaction?"
        );

      if (!confirmed) return;

      try {

        const response =
          await fetch(
            `${API_BASE}/expenses/delete/${id}`,
            {
              method: "DELETE",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Delete failed"
          );
        }

        await Promise.all([
          fetchTransactions(),
          fetchSummary(),
        ]);

      } catch (error) {

        console.error(error);

        alert(
          error.message ||
            "Unable to delete transaction"
        );

      }
    };


  /* ============================================================
     CLEAR FILTERS
  ============================================================ */

  const clearFilters = () => {

    setSearch("");
    setTypeFilter("All");
    setStatusFilter("All");
    setPaymentFilter("All");
    setFromDate("");
    setToDate("");

  };


  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <>
      <style>{`

        * {
          box-sizing: border-box;
        }

        .expense-page {
          width: 100%;
          min-height: 100vh;
          background: #f5f7fb;
          padding: 28px;
          color: #172033;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }


        /* =====================================================
           HEADER
        ===================================================== */

        .expense-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 26px;
        }

        .expense-eyebrow {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.5px;
          color: #64748b;
          margin-bottom: 6px;
        }

        .expense-header h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 850;
          letter-spacing: -0.7px;
          color: #0f172a;
        }

        .expense-header p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .btn {
          border: 0;
          min-height: 44px;
          padding: 0 18px;
          border-radius: 10px;
          color: white;
          font-weight: 800;
          cursor: pointer;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .btn:hover {
          transform: translateY(-1px);
          box-shadow:
            0 6px 16px
            rgba(15, 23, 42, 0.12);
        }

        .money-in-btn {
          background: #059669;
        }

        .money-out-btn {
          background: #dc2626;
        }


        /* =====================================================
           SUMMARY
        ===================================================== */

        .summary-grid {
          display: grid;
          grid-template-columns:
            repeat(5, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 20px;
        }

        .summary-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 18px;
          min-height: 105px;
          display: flex;
          align-items: center;
          gap: 13px;
          box-shadow:
            0 3px 15px
            rgba(15, 23, 42, 0.035);
        }

        .summary-icon {
          width: 45px;
          height: 45px;
          min-width: 45px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
          font-weight: 900;
        }

        .summary-card span {
          display: block;
          color: #64748b;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 5px;
          white-space: nowrap;
        }

        .summary-card strong {
          display: block;
          font-size: 19px;
          font-weight: 850;
          color: #0f172a;
          white-space: nowrap;
        }

        .income .summary-icon {
          color: #047857;
          background: #dcfce7;
        }

        .expense .summary-icon {
          color: #b91c1c;
          background: #fee2e2;
        }

        .balance .summary-icon {
          color: #2563eb;
          background: #dbeafe;
        }

        .pending-collect .summary-icon {
          color: #d97706;
          background: #fef3c7;
        }

        .pending-pay .summary-icon {
          color: #db2777;
          background: #fce7f3;
        }


        /* =====================================================
           QUICK ADD
        ===================================================== */

        .quick-add {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow:
            0 3px 15px
            rgba(15, 23, 42, 0.035);
        }

        .quick-add-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .quick-add h2 {
          margin: 0;
          font-size: 17px;
          font-weight: 850;
        }

        .quick-add p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .quick-buttons {
          display: flex;
          gap: 10px;
        }

        .quick-buttons button {
          border: 1px solid #e2e8f0;
          padding: 10px 15px;
          border-radius: 9px;
          background: white;
          cursor: pointer;
          font-size: 13px;
          font-weight: 800;
          transition: 0.2s;
        }

        .quick-buttons button:hover {
          transform: translateY(-1px);
        }

        .quick-buttons button:first-child {
          color: #047857;
          border-color: #bbf7d0;
          background: #f0fdf4;
        }

        .quick-buttons button:last-child {
          color: #b91c1c;
          border-color: #fecaca;
          background: #fef2f2;
        }


        /* =====================================================
           FILTER
        ===================================================== */

        .filter-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 15px;
          box-shadow:
            0 3px 15px
            rgba(15, 23, 42, 0.035);
        }

        .filter-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 18px;
        }

        .filter-top h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 850;
        }

        .filter-top p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .transaction-count {
          background: #f1f5f9;
          color: #475569;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .filters {
          display: grid;
          grid-template-columns:
            minmax(200px, 1.8fr)
            repeat(5, minmax(105px, 1fr))
            auto;
          gap: 10px;
          align-items: end;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-group label {
          font-size: 10px;
          font-weight: 900;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .filter-group input,
        .filter-group select {
          width: 100%;
          height: 40px;
          border: 1px solid #dbe2ea;
          border-radius: 9px;
          padding: 0 10px;
          outline: none;
          background: #ffffff;
          color: #172033;
          font-size: 12px;
        }

        .filter-group input:focus,
        .filter-group select:focus {
          border-color: #2563eb;
          box-shadow:
            0 0 0 3px
            rgba(37, 99, 235, 0.08);
        }

        .clear-filters {
          height: 40px;
          padding: 0 13px;
          border-radius: 9px;
          border: 1px solid #cbd5e1;
          background: #f8fafc;
          color: #475569;
          cursor: pointer;
          font-size: 12px;
          font-weight: 800;
        }

        .clear-filters:hover {
          background: #f1f5f9;
        }


        /* =====================================================
           TABLE
        ===================================================== */

        .table-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
          box-shadow:
            0 3px 15px
            rgba(15, 23, 42, 0.035);
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 1200px;
          border-collapse: collapse;
        }

        thead {
          background: #f8fafc;
        }

        th {
          padding: 13px 14px;
          text-align: left;
          white-space: nowrap;
          border-bottom: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        td {
          padding: 14px;
          border-bottom: 1px solid #eef2f7;
          color: #334155;
          font-size: 12px;
          vertical-align: middle;
        }

        tbody tr {
          transition: background 0.15s;
        }

        tbody tr:hover {
          background: #fafcff;
        }

        .person-cell strong {
          color: #0f172a;
          font-size: 13px;
          font-weight: 750;
        }

        .description-cell {
          display: flex;
          flex-direction: column;
          gap: 3px;
          max-width: 190px;
        }

        .description-cell strong {
          color: #334155;
          font-weight: 700;
        }

        .description-cell small {
          color: #94a3b8;
          line-height: 1.4;
        }

        .type-badge,
        .status-badge,
        .payment-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 25px;
          padding: 4px 9px;
          border-radius: 7px;
          font-size: 10px;
          font-weight: 900;
          white-space: nowrap;
        }

        .type-in {
          color: #047857;
          background: #dcfce7;
        }

        .type-out {
          color: #b91c1c;
          background: #fee2e2;
        }

        .status-completed {
          color: #047857;
          background: #dcfce7;
        }

        .status-pending {
          color: #b45309;
          background: #fef3c7;
        }

        .payment-badge {
          background: #f1f5f9;
          color: #475569;
        }

        .reference {
          color: #64748b;
          font-family: monospace;
          font-size: 11px;
        }

        .amount-in,
        .amount-out {
          white-space: nowrap;
          font-size: 13px;
          font-weight: 850;
        }

        .amount-in {
          color: #059669;
        }

        .amount-out {
          color: #dc2626;
        }

        .action-buttons {
          display: flex;
          gap: 6px;
        }

        .edit-btn,
        .delete-btn {
          border: 0;
          border-radius: 7px;
          padding: 7px 9px;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
        }

        .edit-btn {
          color: #2563eb;
          background: #eff6ff;
        }

        .delete-btn {
          color: #dc2626;
          background: #fef2f2;
        }

        .edit-btn:hover {
          background: #dbeafe;
        }

        .delete-btn:hover {
          background: #fee2e2;
        }


        /* =====================================================
           LOADING / EMPTY
        ===================================================== */

        .table-loading,
        .empty-state {
          min-height: 310px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          color: #64748b;
          text-align: center;
        }

        .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid #e2e8f0;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: expense-spin 0.8s linear infinite;
          margin-bottom: 12px;
        }

        @keyframes expense-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .empty-icon {
          width: 55px;
          height: 55px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eff6ff;
          color: #2563eb;
          font-size: 22px;
          font-weight: 900;
        }

        .empty-state h3 {
          margin: 14px 0 5px;
          color: #172033;
          font-size: 16px;
        }

        .empty-state p {
          margin: 0;
          font-size: 12px;
        }

        .empty-buttons {
          display: flex;
          gap: 9px;
          margin-top: 18px;
        }

        .empty-buttons button {
          border: 0;
          padding: 10px 13px;
          border-radius: 9px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 800;
        }

        .empty-buttons button:first-child {
          color: #047857;
          background: #dcfce7;
        }

        .empty-buttons button:last-child {
          color: #b91c1c;
          background: #fee2e2;
        }


        /* =====================================================
           MODAL
        ===================================================== */

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            rgba(15, 23, 42, 0.62);
        }

        .expense-modal {
          width: min(760px, 100%);
          max-height: 92vh;
          overflow-y: auto;
          background: #ffffff;
          border-radius: 18px;
          box-shadow:
            0 30px 90px
            rgba(0, 0, 0, 0.24);
        }

        .modal-header {
          padding: 21px 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          border-bottom: 1px solid #eef2f7;
        }

        .modal-label {
          display: inline-block;
          margin-bottom: 5px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .modal-income {
          color: #059669;
        }

        .modal-expense {
          color: #dc2626;
        }

        .modal-header h2 {
          margin: 0;
          color: #0f172a;
          font-size: 21px;
          font-weight: 850;
        }

        .close-modal {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          border: 0;
          border-radius: 8px;
          background: #f1f5f9;
          color: #475569;
          font-size: 23px;
          line-height: 1;
          cursor: pointer;
        }

        .close-modal:hover {
          background: #e2e8f0;
        }


        /* =====================================================
           TYPE SWITCH
        ===================================================== */

        .transaction-type-switch {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 18px 24px 0;
        }

        .transaction-type-switch button {
          height: 43px;
          border-radius: 9px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #475569;
          cursor: pointer;
          font-size: 13px;
          font-weight: 850;
        }

        .transaction-type-switch button.active-in {
          color: #047857;
          background: #ecfdf5;
          border-color: #86efac;
        }

        .transaction-type-switch button.active-out {
          color: #b91c1c;
          background: #fef2f2;
          border-color: #fca5a5;
        }


        /* =====================================================
           FORM
        ===================================================== */

        .expense-modal form {
          padding: 20px 24px 24px;
        }

        .form-grid {
          display: grid;
          grid-template-columns:
            1fr 1fr;
          gap: 16px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .form-field.full {
          grid-column: 1 / -1;
        }

        .form-field label {
          color: #334155;
          font-size: 11px;
          font-weight: 850;
        }

        .form-field input,
        .form-field select,
        .form-field textarea {
          width: 100%;
          border: 1px solid #dbe2ea;
          border-radius: 9px;
          padding: 10px 12px;
          outline: none;
          background: #ffffff;
          color: #172033;
          font-family: inherit;
          font-size: 13px;
        }

        .form-field input,
        .form-field select {
          height: 42px;
        }

        .form-field textarea {
          resize: vertical;
          min-height: 85px;
        }

        .form-field input:focus,
        .form-field select:focus,
        .form-field textarea:focus {
          border-color: #2563eb;
          box-shadow:
            0 0 0 3px
            rgba(37, 99, 235, 0.08);
        }

        .amount-input {
          height: 42px;
          display: flex;
          align-items: center;
          border: 1px solid #dbe2ea;
          border-radius: 9px;
          overflow: hidden;
        }

        .amount-input:focus-within {
          border-color: #2563eb;
          box-shadow:
            0 0 0 3px
            rgba(37, 99, 235, 0.08);
        }

        .amount-input span {
          padding-left: 12px;
          color: #64748b;
          font-weight: 850;
        }

        .amount-input input {
          height: 40px;
          border: 0;
          border-radius: 0;
          box-shadow: none !important;
        }


        /* =====================================================
           MODAL FOOTER
        ===================================================== */

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding-top: 20px;
          margin-top: 20px;
          border-top: 1px solid #eef2f7;
        }

        .cancel-btn,
        .save-in-btn,
        .save-out-btn {
          min-height: 42px;
          padding: 0 18px;
          border: 0;
          border-radius: 9px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 850;
        }

        .cancel-btn {
          background: #f1f5f9;
          color: #475569;
        }

        .save-in-btn {
          background: #059669;
          color: white;
        }

        .save-out-btn {
          background: #dc2626;
          color: white;
        }

        .save-in-btn:disabled,
        .save-out-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1350px) {

          .summary-grid {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }

          .filters {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }

          .search-group {
            grid-column: span 3;
          }

        }


        @media (max-width: 850px) {

          .expense-page {
            padding: 16px;
          }

          .expense-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
          }

          .header-actions .btn {
            flex: 1;
          }

          .summary-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .quick-add-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .quick-buttons {
            width: 100%;
          }

          .quick-buttons button {
            flex: 1;
          }

          .filters {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .search-group {
            grid-column: span 2;
          }

        }


        @media (max-width: 560px) {

          .expense-page {
            padding: 12px;
          }

          .expense-header h1 {
            font-size: 25px;
          }

          .header-actions {
            flex-direction: column;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .summary-card {
            min-height: 90px;
          }

          .filters {
            grid-template-columns: 1fr;
          }

          .search-group {
            grid-column: auto;
          }

          .filter-top {
            align-items: flex-start;
            flex-direction: column;
          }

          .quick-buttons {
            flex-direction: column;
          }

          .transaction-type-switch {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-field.full {
            grid-column: auto;
          }

          .expense-modal {
            max-height: 95vh;
            border-radius: 14px;
          }

          .modal-header,
          .expense-modal form {
            padding-left: 16px;
            padding-right: 16px;
          }

          .transaction-type-switch {
            padding-left: 16px;
            padding-right: 16px;
          }

          .modal-footer {
            flex-direction: column-reverse;
          }

          .cancel-btn,
          .save-in-btn,
          .save-out-btn {
            width: 100%;
          }

        }

      `}</style>


      <div className="expense-page">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="expense-header">

          <div>

            <div className="expense-eyebrow">
              ADMIN FINANCE
            </div>

            <h1>
              Expense Tracker
            </h1>

            <p>
              Manage business money in,
              money out and pending
              payments.
            </p>

          </div>


          <div className="header-actions">

            <button
              type="button"
              className="btn money-in-btn"
              onClick={() =>
                openAddModal("IN")
              }
            >
              <span>＋</span>
              Money In
            </button>


            <button
              type="button"
              className="btn money-out-btn"
              onClick={() =>
                openAddModal("OUT")
              }
            >
              <span>−</span>
              Money Out
            </button>

          </div>

        </div>


        {/* ==================================================
            SUMMARY
        ================================================== */}

        <div className="summary-grid">

          <div className="summary-card income">

            <div className="summary-icon">
              ↓
            </div>

            <div>

              <span>
                Total Money In
              </span>

              <strong>
                {formatMoney(
                  summary.total_money_in
                )}
              </strong>

            </div>

          </div>


          <div className="summary-card expense">

            <div className="summary-icon">
              ↑
            </div>

            <div>

              <span>
                Total Money Out
              </span>

              <strong>
                {formatMoney(
                  summary.total_money_out
                )}
              </strong>

            </div>

          </div>


          <div className="summary-card balance">

            <div className="summary-icon">
              ₹
            </div>

            <div>

              <span>
                Current Balance
              </span>

              <strong>
                {formatMoney(
                  summary.current_balance
                )}
              </strong>

            </div>

          </div>


          <div className="summary-card pending-collect">

            <div className="summary-icon">
              ↓
            </div>

            <div>

              <span>
                Pending to Collect
              </span>

              <strong>
                {formatMoney(
                  summary.pending_to_collect
                )}
              </strong>

            </div>

          </div>


          <div className="summary-card pending-pay">

            <div className="summary-icon">
              ↑
            </div>

            <div>

              <span>
                Pending to Pay
              </span>

              <strong>
                {formatMoney(
                  summary.pending_to_pay
                )}
              </strong>

            </div>

          </div>

        </div>


        {/* ==================================================
            QUICK ADD
        ================================================== */}

        <div className="quick-add">

          <div className="quick-add-content">

            <div>

              <h2>
                Record a transaction
              </h2>

              <p>
                Add received money or
                business expenses.
              </p>

            </div>


            <div className="quick-buttons">

              <button
                type="button"
                onClick={() =>
                  openAddModal("IN")
                }
              >
                ＋ Add Money In
              </button>


              <button
                type="button"
                onClick={() =>
                  openAddModal("OUT")
                }
              >
                − Add Money Out
              </button>

            </div>

          </div>

        </div>


        {/* ==================================================
            FILTER CARD
        ================================================== */}

        <div className="filter-card">

          <div className="filter-top">

            <div>

              <h2>
                Transactions
              </h2>

              <p>
                View and manage all
                business transactions.
              </p>

            </div>


            <div className="transaction-count">

              {transactions.length}{" "}
              Transactions

            </div>

          </div>


          <div className="filters">

            <div className="filter-group search-group">

              <label>
                Search
              </label>

              <input
                type="text"
                value={search}
                placeholder="Search person, description, reference..."
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>


            <div className="filter-group">

              <label>
                Type
              </label>

              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(
                    e.target.value
                  )
                }
              >

                <option value="All">
                  All
                </option>

                <option value="IN">
                  Money In
                </option>

                <option value="OUT">
                  Money Out
                </option>

              </select>

            </div>


            <div className="filter-group">

              <label>
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
              >

                <option value="All">
                  All
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Pending">
                  Pending
                </option>

              </select>

            </div>


            <div className="filter-group">

              <label>
                Payment
              </label>

              <select
                value={paymentFilter}
                onChange={(e) =>
                  setPaymentFilter(
                    e.target.value
                  )
                }
              >

                <option value="All">
                  All
                </option>

                <option value="Cash">
                  Cash
                </option>

                <option value="UPI">
                  UPI
                </option>

                <option value="Bank">
                  Bank
                </option>

              </select>

            </div>


            <div className="filter-group">

              <label>
                From
              </label>

              <input
                type="date"
                value={fromDate}
                onChange={(e) =>
                  setFromDate(
                    e.target.value
                  )
                }
              />

            </div>


            <div className="filter-group">

              <label>
                To
              </label>

              <input
                type="date"
                value={toDate}
                onChange={(e) =>
                  setToDate(
                    e.target.value
                  )
                }
              />

            </div>


            <button
              type="button"
              className="clear-filters"
              onClick={
                clearFilters
              }
            >
              Clear
            </button>

          </div>

        </div>


        {/* ==================================================
            TRANSACTION TABLE
        ================================================== */}

        <div className="table-card">

          {loading ? (

            <div className="table-loading">

              <div className="spinner"></div>

              Loading transactions...

            </div>

          ) : transactions.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                ₹
              </div>

              <h3>
                No transactions found
              </h3>

              <p>
                Start by adding your
                first money in or money
                out transaction.
              </p>

              <div className="empty-buttons">

                <button
                  type="button"
                  onClick={() =>
                    openAddModal("IN")
                  }
                >
                  ＋ Money In
                </button>


                <button
                  type="button"
                  onClick={() =>
                    openAddModal("OUT")
                  }
                >
                  − Money Out
                </button>

              </div>

            </div>

          ) : (

            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>

                    <th>
                      Date
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Person
                    </th>

                    <th>
                      Description
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Payment
                    </th>

                    <th>
                      Reference
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Added By
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {transactions.map(
                    (item) => (

                      <tr key={item.id}>

                        <td>
                          {formatDate(
                            item.transaction_date
                          )}
                        </td>


                        <td>

                          <span
                            className={`type-badge ${
                              item.transaction_type ===
                              "IN"
                                ? "type-in"
                                : "type-out"
                            }`}
                          >

                            {item.transaction_type ===
                            "IN"
                              ? "Money In"
                              : "Money Out"}

                          </span>

                        </td>


                        <td>

                          <div className="person-cell">

                            <strong>
                              {
                                item.person_name
                              }
                            </strong>

                          </div>

                        </td>


                        <td>

                          <div className="description-cell">

                            <strong>
                              {
                                item.description ||
                                "-"
                              }
                            </strong>

                            {item.notes && (
                              <small>
                                {
                                  item.notes
                                }
                              </small>
                            )}

                          </div>

                        </td>


                        <td>
                          {
                            item.expense_category ||
                            "-"
                          }
                        </td>


                        <td>

                          <span className="payment-badge">
                            {
                              item.payment_mode
                            }
                          </span>

                        </td>


                        <td>

                          <span className="reference">
                            {
                              item.reference_number ||
                              "-"
                            }
                          </span>

                        </td>


                        <td>

                          <strong
                            className={
                              item.transaction_type ===
                              "IN"
                                ? "amount-in"
                                : "amount-out"
                            }
                          >

                            {item.transaction_type ===
                            "IN"
                              ? "+"
                              : "-"}

                            {formatMoney(
                              item.amount
                            )}

                          </strong>

                        </td>


                        <td>

                          <span
                            className={`status-badge ${
                              item.status ===
                              "Pending"
                                ? "status-pending"
                                : "status-completed"
                            }`}
                          >
                            {
                              item.status
                            }
                          </span>

                        </td>


                        <td>
                          {
                            item.added_by ||
                            "Admin"
                          }
                        </td>


                        <td>

                          <div className="action-buttons">

                            <button
                              type="button"
                              className="edit-btn"
                              onClick={() =>
                                openEditModal(
                                  item
                                )
                              }
                            >
                              Edit
                            </button>


                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() =>
                                deleteTransaction(
                                  item.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* ==================================================
            ADD / EDIT MODAL
        ================================================== */}

        {showModal && (

          <div
            className="modal-overlay"
            onMouseDown={(e) => {

              if (
                e.target ===
                e.currentTarget
              ) {
                setShowModal(false);
              }

            }}
          >

            <div className="expense-modal">

              {/* MODAL HEADER */}

              <div className="modal-header">

                <div>

                  <span
                    className={`modal-label ${
                      form.transaction_type ===
                      "IN"
                        ? "modal-income"
                        : "modal-expense"
                    }`}
                  >
                    {form.transaction_type ===
                    "IN"
                      ? "MONEY IN"
                      : "MONEY OUT"}
                  </span>

                  <h2>
                    {editingId
                      ? "Edit Transaction"
                      : form.transaction_type ===
                        "IN"
                      ? "Add Money In"
                      : "Add Money Out"}
                  </h2>

                </div>


                <button
                  type="button"
                  className="close-modal"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  ×
                </button>

              </div>


              {/* TYPE SWITCH */}

              <div className="transaction-type-switch">

                <button
                  type="button"
                  className={
                    form.transaction_type ===
                    "IN"
                      ? "active-in"
                      : ""
                  }
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      transaction_type:
                        "IN",
                    }))
                  }
                >
                  ＋ Money In
                </button>


                <button
                  type="button"
                  className={
                    form.transaction_type ===
                    "OUT"
                      ? "active-out"
                      : ""
                  }
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      transaction_type:
                        "OUT",
                    }))
                  }
                >
                  − Money Out
                </button>

              </div>


              {/* FORM */}

              <form
                onSubmit={
                  handleSubmit
                }
              >

                <div className="form-grid">

                  {/* DATE */}

                  <div className="form-field">

                    <label>
                      Date *
                    </label>

                    <input
                      type="date"
                      name="transaction_date"
                      value={
                        form.transaction_date
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>


                  {/* AMOUNT */}

                  <div className="form-field">

                    <label>
                      Amount *
                    </label>

                    <div className="amount-input">

                      <span>
                        ₹
                      </span>

                      <input
                        type="number"
                        name="amount"
                        value={
                          form.amount
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="0.00"
                        min="0.01"
                        step="0.01"
                        required
                      />

                    </div>

                  </div>


                  {/* PERSON */}

                  <div className="form-field full">

                    <label>
                      {form.transaction_type ===
                      "IN"
                        ? "Received From *"
                        : "Given To *"}
                    </label>

                    <input
                      type="text"
                      name="person_name"
                      value={
                        form.person_name
                      }
                      onChange={
                        handleChange
                      }
                      placeholder={
                        form.transaction_type ===
                        "IN"
                          ? "Customer / Person / Company"
                          : "Supplier / Person / Company"
                      }
                      required
                    />

                  </div>


                  {/* DESCRIPTION */}

                  <div className="form-field full">

                    <label>
                      {form.transaction_type ===
                      "IN"
                        ? "Purpose / Description"
                        : "Purpose / Expense Description"}
                    </label>

                    <input
                      type="text"
                      name="description"
                      value={
                        form.description
                      }
                      onChange={
                        handleChange
                      }
                      placeholder={
                        form.transaction_type ===
                        "IN"
                          ? "Example: Product payment"
                          : "Example: Electricity bill"
                      }
                    />

                  </div>


                  {/* EXPENSE CATEGORY */}

                  {form.transaction_type ===
                    "OUT" && (

                    <div className="form-field">

                      <label>
                        Expense Category
                      </label>

                      <select
                        name="expense_category"
                        value={
                          form.expense_category
                        }
                        onChange={
                          handleChange
                        }
                      >

                        <option value="">
                          Select Category
                        </option>

                        <option value="Stock Purchase">
                          Stock Purchase
                        </option>

                        <option value="Salary">
                          Salary
                        </option>

                        <option value="Rent">
                          Rent
                        </option>

                        <option value="Electricity">
                          Electricity
                        </option>

                        <option value="Transport">
                          Transport
                        </option>

                        <option value="Office Expense">
                          Office Expense
                        </option>

                        <option value="Maintenance">
                          Maintenance
                        </option>

                        <option value="Marketing">
                          Marketing
                        </option>

                        <option value="Other">
                          Other
                        </option>

                      </select>

                    </div>

                  )}


                  {/* PAYMENT MODE */}

                  <div className="form-field">

                    <label>
                      Payment Mode *
                    </label>

                    <select
                      name="payment_mode"
                      value={
                        form.payment_mode
                      }
                      onChange={
                        handleChange
                      }
                      required
                    >

                      <option value="Cash">
                        Cash
                      </option>

                      <option value="UPI">
                        UPI
                      </option>

                      <option value="Bank">
                        Bank
                      </option>

                    </select>

                  </div>


                  {/* REFERENCE */}

                  <div className="form-field">

                    <label>
                      Reference Number
                    </label>

                    <input
                      type="text"
                      name="reference_number"
                      value={
                        form.reference_number
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Transaction / Invoice No."
                    />

                  </div>


                  {/* STATUS */}

                  <div className="form-field">

                    <label>
                      Status
                    </label>

                    <select
                      name="status"
                      value={
                        form.status
                      }
                      onChange={
                        handleChange
                      }
                    >

                      <option value="Completed">
                        Completed
                      </option>

                      <option value="Pending">
                        Pending
                      </option>

                    </select>

                  </div>


                  {/* ADDED BY */}

                  <div className="form-field">

                    <label>
                      Added By
                    </label>

                    <input
                      type="text"
                      name="added_by"
                      value={
                        form.added_by
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Admin"
                    />

                  </div>


                  {/* NOTES */}

                  <div className="form-field full">

                    <label>
                      Notes
                    </label>

                    <textarea
                      name="notes"
                      value={
                        form.notes
                      }
                      onChange={
                        handleChange
                      }
                      rows="3"
                      placeholder="Additional notes..."
                    />

                  </div>

                </div>


                {/* FOOTER */}

                <div className="modal-footer">

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() =>
                      setShowModal(false)
                    }
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    className={
                      form.transaction_type ===
                      "IN"
                        ? "save-in-btn"
                        : "save-out-btn"
                    }
                    disabled={saving}
                  >

                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Update Transaction"
                      : form.transaction_type ===
                        "IN"
                      ? "Add Money In"
                      : "Add Money Out"}

                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </div>
    </>
  );
};

export default ExpenseTracker;