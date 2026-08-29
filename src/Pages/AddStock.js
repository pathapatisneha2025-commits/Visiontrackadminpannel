
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://visiontrackdatabase.onrender.com";

export default function AddStock() {
  const navigate = useNavigate();

  /* =========================================================
     CATEGORY
  ========================================================= */

  const [selectedCategory, setSelectedCategory] = useState("frames");

  /* =========================================================
     COMMON
  ========================================================= */

  const [brand, setBrand] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  /* =========================================================
     FRAMES
  ========================================================= */

  const [frameName, setFrameName] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [material, setMaterial] = useState("");
  const [gender, setGender] = useState("");
  const [rackForLenses, setRackForLenses] = useState("");

  /* =========================================================
     LENSES
  ========================================================= */

  const [lensType, setLensType] = useState("");
  const [powerRange, setPowerRange] = useState("");
  const [coating, setCoating] = useState("");
  const [index, setIndex] = useState("");

  /* =========================================================
     CONTACT LENSES
  ========================================================= */

  const [clType, setClType] = useState("");
  const [power, setPower] = useState("");
  const [baseCurve, setBaseCurve] = useState("");
  const [diameter, setDiameter] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  /* =========================================================
     ACCESSORIES
  ========================================================= */

  const [accessoryName, setAccessoryName] = useState("");

  /* =========================================================
     LOADING
  ========================================================= */

  const [saving, setSaving] = useState(false);

  /* =========================================================
     INPUT REFS
  ========================================================= */

  const inputRefs = useRef({});

  const setInputRef = (id, element) => {
    if (element) {
      inputRefs.current[id] = element;
    }
  };

  /* =========================================================
     ACTIVE FIELD ORDER
  ========================================================= */

  const getActiveFields = () => {
    if (selectedCategory === "frames") {
      return [
        "brand",
        "frameName",
        "gender",
        "purchasePrice",
        "sellingPrice",
        "quantity",
      ];
    }

    if (selectedCategory === "lenses") {
      return [
        "brand",
        "lensType",
        "powerRange",
        "coating",
        "index",
        "quantity",
        "purchasePrice",
        "sellingPrice",
      ];
    }

    if (selectedCategory === "contact_lenses") {
      return [
        "brand",
        "clType",
        "purchasePrice",
        "sellingPrice",
        "quantity",
      ];
    }

    if (selectedCategory === "accessories") {
      return [
        "brand",
        "accessoryName",
        "purchasePrice",
        "sellingPrice",
        "quantity",
      ];
    }

    return [];
  };

  /* =========================================================
     CATEGORY CHANGE
  ========================================================= */

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    resetForm();
  };

  /* =========================================================
     RESET FORM
  ========================================================= */

  const resetForm = () => {
    setBrand("");
    setPurchasePrice("");
    setSellingPrice("");
    setQuantity("");

    setFrameName("");
    setModel("");
    setColor("");
    setSize("");
    setMaterial("");
    setGender("");
    setRackForLenses("");

    setLensType("");
    setPowerRange("");
    setCoating("");
    setIndex("");

    setClType("");
    setPower("");
    setBaseCurve("");
    setDiameter("");
    setExpiryDate("");

    setAccessoryName("");
  };

  /* =========================================================
     KEYBOARD NAVIGATION
  ========================================================= */

  const handleKeyDown = (
    event,
    fieldKey,
    value,
    setValue
  ) => {
    const fields = getActiveFields();

    const currentIndex = fields.indexOf(fieldKey);

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();

      if (
        currentIndex !== -1 &&
        currentIndex < fields.length - 1
      ) {
        const nextField = fields[currentIndex + 1];

        inputRefs.current[nextField]?.focus();
      }

      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();

      if (currentIndex > 0) {
        const previousField =
          fields[currentIndex - 1];

        inputRefs.current[previousField]?.focus();
      }

      return;
    }

    /* =======================================================
       PAGE UP / PAGE DOWN FOR NUMERIC FIELDS
    ======================================================= */

    if (
      ["purchasePrice", "sellingPrice", "quantity"].includes(
        fieldKey
      )
    ) {
      if (event.key === "PageUp") {
        event.preventDefault();

        const number = parseFloat(value) || 0;

        setValue(String(number + 1));
      }

      if (event.key === "PageDown") {
        event.preventDefault();

        const number = parseFloat(value) || 0;

        setValue(
          String(Math.max(0, number - 1))
        );
      }
    }
  };

  /* =========================================================
     SAVE STOCK
  ========================================================= */

  const saveStock = async () => {
    /* =======================================================
       BRAND VALIDATION
    ======================================================= */

    if (!brand.trim()) {
      alert("Brand is required");

      inputRefs.current.brand?.focus();

      return;
    }

    /* =======================================================
       QUANTITY VALIDATION
    ======================================================= */

    if (!quantity.trim()) {
      alert("Quantity is required");

      inputRefs.current.quantity?.focus();

      return;
    }

    const quantityNumber = Number(quantity);

    if (
      !Number.isInteger(quantityNumber) ||
      quantityNumber <= 0
    ) {
      alert(
        "Quantity must be a whole number greater than 0"
      );

      inputRefs.current.quantity?.focus();

      return;
    }

    try {
      setSaving(true);

      /* =====================================================
         STORE CODE

         Change this if your React JS application stores
         store code under another localStorage key.
      ===================================================== */

      const storeCode =
        localStorage.getItem("storeCode") ||
        localStorage.getItem("store_code") ||
        "";

      if (!storeCode) {
        alert("Store code is required");

        setSaving(false);

        return;
      }

      /* =====================================================
         COMMON DATA
      ===================================================== */

      let body = {
        storeCode,
        category: selectedCategory,
        brand: brand.trim(),

        purchase_price:
          Number(purchasePrice) || 0,

        selling_price:
          Number(sellingPrice) || 0,

        quantity: quantityNumber,
      };

      /* =====================================================
         FRAMES
      ===================================================== */

      if (selectedCategory === "frames") {
        body = {
          ...body,

          frame_name: frameName.trim(),
          model: model.trim(),
          color: color.trim(),
          size: size.trim(),
          material: material.trim(),
          gender: gender.trim(),
          rack_for_lenses:
            rackForLenses.trim(),
        };
      }

      /* =====================================================
         LENSES
      ===================================================== */

      else if (selectedCategory === "lenses") {
        body = {
          ...body,

          lens_type: lensType.trim(),
          power_range: powerRange.trim(),
          coating: coating.trim(),
          index: index.trim(),
        };
      }

      /* =====================================================
         CONTACT LENSES
      ===================================================== */

      else if (
        selectedCategory === "contact_lenses"
      ) {
        body = {
          ...body,

          type: clType.trim(),
          power: power.trim(),
          base_curve: baseCurve.trim(),
          diameter: diameter.trim(),
          expiry_date: expiryDate,
        };
      }

      /* =====================================================
         ACCESSORIES
      ===================================================== */

      else if (
        selectedCategory === "accessories"
      ) {
        body = {
          ...body,

          accessory_name:
            accessoryName.trim(),
        };
      }

      console.log("SAVE STOCK BODY:", body);

      /* =====================================================
         API
      ===================================================== */

      const response = await fetch(
        `${API_BASE}/stockinventory/add`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      console.log("SAVE STOCK RESPONSE:", result);

      /* =====================================================
         SUCCESS
      ===================================================== */

      if (result.success) {
        alert("Stock added successfully");

        resetForm();

        navigate(-1);

        return;
      }

      /* =====================================================
         API ERROR
      ===================================================== */

      alert(
        result.message ||
          "Failed to save stock"
      );
    } catch (error) {
      console.error(
        "SAVE STOCK ERROR:",
        error
      );

      alert(
        "Error saving stock. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     FIELD COMPONENT
  ========================================================= */

  const InputField = ({
    fieldKey,
    label,
    value,
    onChange,
    placeholder,
    required = false,
    type = "text",
  }) => {
    return (
      <div className="stock-field">
        <label>
          {label}

          {required && (
            <span className="required-star">
              *
            </span>
          )}
        </label>

        <input
          ref={(element) =>
            setInputRef(fieldKey, element)
          }
          type={type}
          value={value}
          placeholder={
            placeholder || label
          }
          onChange={(event) =>
            onChange(event.target.value)
          }
          onKeyDown={(event) =>
            handleKeyDown(
              event,
              fieldKey,
              value,
              onChange
            )
          }
          autoComplete="off"
        />
      </div>
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      <style>{`

        * {
          box-sizing: border-box;
        }

        .add-stock-page {
          min-height: 100vh;
          width: 100%;
          background: #eef5ff;
          padding: 24px;
          position: relative;
          overflow-x: hidden;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          color: #0f172a;
        }

        /* =====================================================
           DECORATIVE CIRCLES
        ===================================================== */

        .decor-circle {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .decor-circle.top {
          width: 360px;
          height: 360px;
          right: -150px;
          top: -160px;
          background: rgba(59, 130, 246, 0.07);
        }

        .decor-circle.bottom {
          width: 420px;
          height: 420px;
          left: -180px;
          bottom: -190px;
          background: rgba(29, 78, 216, 0.06);
        }

        .decor-circle.center {
          width: 300px;
          height: 300px;
          left: 35%;
          top: 45%;
          background: rgba(147, 197, 253, 0.05);
        }

        /* =====================================================
           MAIN CONTENT
        ===================================================== */

        .add-stock-wrapper {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .stock-header {
          width: 100%;
          min-height: 95px;
          background: #0047ab;
          border: 1px solid #003b91;
          border-radius: 20px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          box-shadow:
            0 10px 30px rgba(0, 71, 171, 0.18);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
        }

        .back-button {
          width: 42px;
          height: 42px;
          border: none;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.14);
          color: white;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s ease;
          flex-shrink: 0;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.24);
          transform: translateX(-2px);
        }

        .header-text {
          min-width: 0;
        }

        .header-text h1 {
          margin: 0;
          color: white;
          font-size: 25px;
          font-weight: 800;
          letter-spacing: 0.2px;
        }

        .header-text p {
          margin: 4px 0 0;
          color: #cbdcf8;
          font-size: 13px;
          font-weight: 500;
        }

        /* =====================================================
           FORM CARD
        ===================================================== */

        .stock-form-card {
          background: white;
          border-radius: 20px;
          padding: 28px;
          box-shadow:
            0 8px 28px rgba(15, 23, 42, 0.07);
          border: 1px solid #e2e8f0;
        }

        /* =====================================================
           CATEGORY
        ===================================================== */

        .section-label {
          display: block;
          margin-bottom: 9px;
          color: #334155;
          font-size: 13px;
          font-weight: 700;
        }

        .required-star {
          color: #dc2626;
          margin-left: 3px;
        }

        .category-tabs {
          display: flex;
          gap: 9px;
          overflow-x: auto;
          padding-bottom: 5px;
          margin-bottom: 22px;
          scrollbar-width: thin;
        }

        .category-tab {
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #64748b;
          padding: 10px 17px;
          border-radius: 22px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .category-tab:hover {
          border-color: #93c5fd;
          color: #1d4ed8;
          background: #eff6ff;
        }

        .category-tab.active {
          background: #eff6ff;
          border-color: #3b82f6;
          color: #0047ab;
          box-shadow:
            0 2px 8px rgba(59, 130, 246, 0.12);
        }

        /* =====================================================
           FORM GRID
        ===================================================== */

        .stock-fields-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 4px 18px;
        }

        .stock-field {
          width: 100%;
          margin-bottom: 12px;
        }

        .stock-field label {
          display: block;
          margin: 0 0 7px;
          color: #334155;
          font-size: 13px;
          font-weight: 700;
        }

        .stock-field input {
          width: 100%;
          height: 46px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 12px;
          padding: 0 14px;
          color: #0f172a;
          font-size: 14px;
          outline: none;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .stock-field input::placeholder {
          color: #94a3b8;
        }

        .stock-field input:hover {
          border-color: #cbd5e1;
        }

        .stock-field input:focus {
          background: white;
          border-color: #3b82f6;
          box-shadow:
            0 0 0 3px rgba(59, 130, 246, 0.12);
        }

        /* =====================================================
           ACTION BUTTONS
        ===================================================== */

        .action-buttons {
          border-top: 1px solid #f1f5f9;
          margin-top: 15px;
          padding-top: 18px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 12px;
        }

        .cancel-button {
          height: 46px;
          padding: 0 22px;
          border: none;
          border-radius: 12px;
          background: #f1f5f9;
          color: #64748b;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .cancel-button:hover {
          background: #e2e8f0;
          color: #334155;
        }

        .save-button {
          height: 46px;
          padding: 0 25px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            #3b82f6,
            #1d4ed8
          );
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 135px;
          box-shadow:
            0 5px 14px rgba(37, 99, 235, 0.22);
          transition: 0.2s ease;
        }

        .save-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow:
            0 8px 18px rgba(37, 99, 235, 0.28);
        }

        .save-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .save-icon {
          font-size: 18px;
          line-height: 1;
        }

        /* =====================================================
           LOADING SPINNER
        ===================================================== */

        .button-spinner {
          width: 17px;
          height: 17px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 700px) {

          .add-stock-page {
            padding: 10px;
          }

          .stock-header {
            min-height: auto;
            padding: 15px;
            border-radius: 16px;
          }

          .header-content {
            gap: 10px;
          }

          .back-button {
            width: 38px;
            height: 38px;
            border-radius: 10px;
          }

          .header-text h1 {
            font-size: 19px;
          }

          .header-text p {
            font-size: 11px;
          }

          .stock-form-card {
            padding: 15px;
            border-radius: 16px;
          }

          .stock-fields-grid {
            grid-template-columns: 1fr 1fr;
            gap: 0 10px;
          }

          .stock-field input {
            height: 43px;
            padding: 0 10px;
            font-size: 13px;
          }

          .stock-field label {
            font-size: 12px;
          }

          .category-tab {
            padding: 9px 13px;
            font-size: 12px;
          }

          .action-buttons {
            justify-content: stretch;
          }

          .cancel-button,
          .save-button {
            flex: 1;
          }
        }

        @media (max-width: 430px) {

          .stock-fields-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }

          .cancel-button,
          .save-button {
            width: 100%;
          }
        }

      `}</style>

      <div className="add-stock-page">

        {/* =====================================================
            DECORATION
        ===================================================== */}

        <div className="decor-circle top"></div>
        <div className="decor-circle bottom"></div>
        <div className="decor-circle center"></div>

        <div className="add-stock-wrapper">

          {/* ===================================================
              HEADER
          =================================================== */}

          <div className="stock-header">

            <div className="header-content">

              <button
                type="button"
                className="back-button"
                onClick={() => navigate(-1)}
                title="Go Back"
              >
                ←
              </button>

              <div className="header-text">

                <h1>
                  Add New Stock
                </h1>

                <p>
                  Select category and enter inventory details
                </p>

              </div>

            </div>

          </div>

          {/* ===================================================
              FORM CARD
          =================================================== */}

          <div className="stock-form-card">

            {/* =================================================
                CATEGORY
            ================================================= */}

            <label className="section-label">
              Select Category
              <span className="required-star">
                *
              </span>
            </label>

            <div className="category-tabs">

              {[
                {
                  key: "frames",
                  label: "Frames",
                },
                {
                  key: "lenses",
                  label: "Lenses",
                },
                {
                  key: "contact_lenses",
                  label: "Contact Lenses",
                },
                {
                  key: "accessories",
                  label: "Accessories",
                },
              ].map((category) => (

                <button
                  key={category.key}
                  type="button"
                  className={
                    selectedCategory ===
                    category.key
                      ? "category-tab active"
                      : "category-tab"
                  }
                  onClick={() =>
                    handleCategoryChange(
                      category.key
                    )
                  }
                >
                  {category.label}
                </button>

              ))}

            </div>

            {/* =================================================
                FORM FIELDS
            ================================================= */}

            <div className="stock-fields-grid">

              {/* =================================================
                  BRAND
              ================================================= */}

              <InputField
                fieldKey="brand"
                label="Brand"
                required
                value={brand}
                onChange={setBrand}
              />

              {/* =================================================
                  FRAMES
              ================================================= */}

              {selectedCategory === "frames" && (
                <>
                  <InputField
                    fieldKey="frameName"
                    label="Frame Name"
                    value={frameName}
                    onChange={setFrameName}
                  />

                  <InputField
                    fieldKey="gender"
                    label="Gender"
                    value={gender}
                    onChange={setGender}
                  />

                  <InputField
                    fieldKey="purchasePrice"
                    label="Purchase Price"
                    placeholder="0"
                    type="number"
                    value={purchasePrice}
                    onChange={setPurchasePrice}
                  />

                  <InputField
                    fieldKey="sellingPrice"
                    label="Selling Price"
                    placeholder="0"
                    type="number"
                    value={sellingPrice}
                    onChange={setSellingPrice}
                  />

                  <InputField
                    fieldKey="quantity"
                    label="Quantity"
                    required
                    placeholder="0"
                    type="number"
                    value={quantity}
                    onChange={setQuantity}
                  />
                </>
              )}

              {/* =================================================
                  LENSES
              ================================================= */}

              {selectedCategory === "lenses" && (
                <>
                  <InputField
                    fieldKey="lensType"
                    label="Lens Type"
                    value={lensType}
                    onChange={setLensType}
                  />

                  <InputField
                    fieldKey="powerRange"
                    label="Power Range"
                    value={powerRange}
                    onChange={setPowerRange}
                  />

                  <InputField
                    fieldKey="coating"
                    label="Coating"
                    value={coating}
                    onChange={setCoating}
                  />

                  <InputField
                    fieldKey="index"
                    label="Index"
                    value={index}
                    onChange={setIndex}
                  />

                  <InputField
                    fieldKey="quantity"
                    label="Quantity"
                    required
                    placeholder="0"
                    type="number"
                    value={quantity}
                    onChange={setQuantity}
                  />

                  <InputField
                    fieldKey="purchasePrice"
                    label="Purchase Price"
                    placeholder="0"
                    type="number"
                    value={purchasePrice}
                    onChange={setPurchasePrice}
                  />

                  <InputField
                    fieldKey="sellingPrice"
                    label="Selling Price"
                    placeholder="0"
                    type="number"
                    value={sellingPrice}
                    onChange={setSellingPrice}
                  />
                </>
              )}

              {/* =================================================
                  CONTACT LENSES
              ================================================= */}

              {selectedCategory ===
                "contact_lenses" && (
                <>
                  <InputField
                    fieldKey="clType"
                    label="Type"
                    value={clType}
                    onChange={setClType}
                  />

                  <InputField
                    fieldKey="purchasePrice"
                    label="Purchase Price"
                    placeholder="0"
                    type="number"
                    value={purchasePrice}
                    onChange={setPurchasePrice}
                  />

                  <InputField
                    fieldKey="sellingPrice"
                    label="Selling Price"
                    placeholder="0"
                    type="number"
                    value={sellingPrice}
                    onChange={setSellingPrice}
                  />

                  <InputField
                    fieldKey="quantity"
                    label="Quantity"
                    required
                    placeholder="0"
                    type="number"
                    value={quantity}
                    onChange={setQuantity}
                  />
                </>
              )}

              {/* =================================================
                  ACCESSORIES
              ================================================= */}

              {selectedCategory ===
                "accessories" && (
                <>
                  <InputField
                    fieldKey="accessoryName"
                    label="Accessory Name"
                    required
                    value={accessoryName}
                    onChange={setAccessoryName}
                  />

                  <InputField
                    fieldKey="purchasePrice"
                    label="Purchase Price"
                    placeholder="0"
                    type="number"
                    value={purchasePrice}
                    onChange={setPurchasePrice}
                  />

                  <InputField
                    fieldKey="sellingPrice"
                    label="Selling Price"
                    placeholder="0"
                    type="number"
                    value={sellingPrice}
                    onChange={setSellingPrice}
                  />

                  <InputField
                    fieldKey="quantity"
                    label="Quantity"
                    required
                    placeholder="0"
                    type="number"
                    value={quantity}
                    onChange={setQuantity}
                  />
                </>
              )}

            </div>

            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <div className="action-buttons">

              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate(-1)}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="save-button"
                onClick={saveStock}
                disabled={saving}
              >

                {saving ? (
                  <>
                    <span className="button-spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="save-icon">
                      ✓
                    </span>

                    Save Stock
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}
