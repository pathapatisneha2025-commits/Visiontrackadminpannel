import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://visiontrackdatabase.onrender.com";

/* =========================================================
   QR IMAGE
========================================================= */

const getQRCodeUrl = (barcode, size = 100) => {
  if (!barcode) return "";

  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=1&data=${encodeURIComponent(
    String(barcode)
  )}`;
};

/* =========================================================
   QR COMPONENT
========================================================= */

function QRCodeImage({ barcode, size = 55 }) {
  if (!barcode) {
    return <div className="qr-placeholder">QR</div>;
  }

  return (
    <img
      src={getQRCodeUrl(barcode, 100)}
      alt={`QR ${barcode}`}
      className="qr-image"
      style={{
        width: size,
        height: size,
      }}
    />
  );
}

/* =========================================================
   INVENTORY
========================================================= */

export default function Inventory() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("single");
  const [selectedCategory, setSelectedCategory] = useState("frames");

  const [loading, setLoading] = useState(false);

  const [selectedStock, setSelectedStock] = useState(null);
  const [productModalVisible, setProductModalVisible] =
    useState(false);

  /* =========================================================
     LOAD STOCK
  ========================================================= */

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE}/stockinventory/all`
      );

      const result = await response.json();

      if (result.success) {
        setData(result.stocks || []);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("LOAD STOCK ERROR:", error);
      alert("Unable to load inventory");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     PRODUCT NAME
  ========================================================= */

  const getProductName = (item) => {
    const category =
      item.category || selectedCategory;

    if (category === "frames") {
      return (
        item.frame_name ||
        item.model ||
        "Unnamed Frame"
      );
    }

    if (category === "lenses") {
      return (
        item.lens_type ||
        item.power_range ||
        "Unnamed Lens"
      );
    }

    if (category === "contact_lenses") {
      return (
        item.type ||
        item.power ||
        "Contact Lens"
      );
    }

    if (category === "accessories") {
      return (
        item.accessory_name ||
        "Unnamed Accessory"
      );
    }

    return "Product";
  };

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredData = useMemo(() => {
    const query = searchQuery
      .toLowerCase()
      .trim();

    return data.filter((item) => {
      const matchesSearch =
        !query ||
        String(item.barcode || "")
          .toLowerCase()
          .includes(query) ||
        String(item.brand || "")
          .toLowerCase()
          .includes(query) ||
        String(item.frame_name || "")
          .toLowerCase()
          .includes(query) ||
        String(item.model || "")
          .toLowerCase()
          .includes(query) ||
        String(item.accessory_name || "")
          .toLowerCase()
          .includes(query) ||
        String(item.lens_type || "")
          .toLowerCase()
          .includes(query) ||
        String(item.type || "")
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        selectedCategory
          ? item.category === selectedCategory
          : true;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    data,
    searchQuery,
    selectedCategory,
  ]);

  /* =========================================================
     OPEN PRODUCT
  ========================================================= */

  const openProduct = async (barcode) => {
    if (!barcode) return;

    try {
      const response = await fetch(
        `${API_BASE}/stockinventory/scan/${encodeURIComponent(
          barcode
        )}`
      );

      const result = await response.json();

      if (result.success) {
        setSelectedStock(result.stock);
        setProductModalVisible(true);
      } else {
        alert("Product not found");
      }
    } catch (error) {
      console.error(
        "SCAN ERROR:",
        error
      );

      alert("Unable to find product");
    }
  };

  /* =========================================================
     CATEGORY LABEL
  ========================================================= */

  const getCategoryLabel = (
    category
  ) => {
    if (
      category === "contact_lenses"
    ) {
      return "CONTACT LENSES";
    }

    return String(
      category || ""
    ).toUpperCase();
  };

  /* =========================================================
     CLOSE MODAL
  ========================================================= */

  const closeProductModal = () => {
    setProductModalVisible(false);
    setSelectedStock(null);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      <div className="inventory-page">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="inventory-header">

          <div className="inventory-header-left">

            <div className="inventory-header-icon">
              📦
            </div>

            <div>
              <h1>
                Inventory Management
              </h1>

              <p>
                Manage stock levels and
                pricing
              </p>
            </div>

          </div>

       
        </div>

        {/* =====================================================
            TOP SECTION
        ===================================================== */}

        <div className="inventory-top">

          <div>
            <h2>
              Stock Directory
            </h2>

            <p>
              {filteredData.length} active
              records found
            </p>
          </div>

          <button
            className="add-stock-button"
            onClick={() =>
              navigate("/admin/add-stock")
            }
          >
            <span>+</span>
            Add Stock
          </button>

        </div>

        {/* =====================================================
            CATEGORY
        ===================================================== */}

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
              className={
                selectedCategory ===
                category.key
                  ? "category-tab active"
                  : "category-tab"
              }
              onClick={() =>
                setSelectedCategory(
                  category.key
                )
              }
            >
              {category.label}
            </button>

          ))}

        </div>

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <div className="search-wrapper">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search barcode, brand, name..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(
                e.target.value
              )
            }
          />

          {searchQuery && (
            <button
              className="clear-search"
              onClick={() =>
                setSearchQuery("")
              }
            >
              ×
            </button>
          )}

        </div>

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading ? (

          <div className="empty-container">

            <div className="loader"></div>

            <h3>
              Loading inventory...
            </h3>

          </div>

        ) : viewMode === "single" ? (

          /* ===================================================
             SINGLE VIEW
          =================================================== */

          <div className="inventory-table">

            {/* TABLE HEADER */}

            <div className="table-header">

              <div className="qr-column">
                QR
              </div>

              <div>
                BARCODE
              </div>

              <div>
                BRAND
              </div>

              <div className="product-column">
                {selectedCategory ===
                "frames"
                  ? "FRAME / MODEL"
                  : selectedCategory ===
                    "lenses"
                  ? "LENS TYPE / POWER"
                  : selectedCategory ===
                    "contact_lenses"
                  ? "TYPE / POWER"
                  : "ACCESSORY NAME"}
              </div>

              <div>
                SELLING
              </div>

              <div>
                STOCK
              </div>

            </div>

            {/* TABLE ROWS */}

            {filteredData.map(
              (item, index) => {

                const quantity =
                  Number(
                    item.quantity || 0
                  );

                const isLowStock =
                  quantity <= 5;

                return (
                  <div
                    className="table-row"
                    key={
                      item.id ||
                      item.barcode ||
                      index
                    }
                  >

                    {/* QR */}

                    <div className="qr-column">

                      {item.barcode ? (

                        <button
                          className="qr-button"
                          onClick={() =>
                            openProduct(
                              item.barcode
                            )
                          }
                          title="View product"
                        >
                          <QRCodeImage
                            barcode={
                              item.barcode
                            }
                            size={50}
                          />
                        </button>

                      ) : (

                        <div className="qr-placeholder">
                          QR
                        </div>

                      )}

                    </div>

                    {/* BARCODE */}

                    <div className="barcode-text">
                      {item.barcode || "-"}
                    </div>

                    {/* BRAND */}

                    <div className="brand-text">
                      {item.brand || "-"}
                    </div>

                    {/* PRODUCT */}

                    <div className="product-column product-text">
                      {getProductName(
                        item
                      )}
                    </div>

                    {/* PRICE */}

                    <div className="price-text">
                      ₹
                      {item.selling_price ||
                        0}
                    </div>

                    {/* STOCK */}

                    <div>

                      <span
                        className={
                          isLowStock
                            ? "stock-badge low"
                            : "stock-badge good"
                        }
                      >
                        {quantity}
                      </span>

                    </div>

                  </div>
                );
              }
            )}

            {/* EMPTY */}

            {!filteredData.length && (

              <div className="empty-container">

                <div className="empty-icon">
                  📦
                </div>

                <h3>
                  No stock found
                </h3>

                <p>
                  No products match your
                  search or category.
                </p>

              </div>

            )}

          </div>

        ) : (

          /* ===================================================
             MULTI / GRID VIEW
          =================================================== */

          <div className="inventory-grid">

            {filteredData.map(
              (item, index) => {

                const quantity =
                  Number(
                    item.quantity || 0
                  );

                const isLowStock =
                  quantity <= 5;

                return (

                  <div
                    className="inventory-card"
                    key={
                      item.id ||
                      item.barcode ||
                      index
                    }
                  >

                    {/* CARD HEADER */}

                    <div className="card-header">

                      <button
                        className="qr-card"
                        onClick={() =>
                          openProduct(
                            item.barcode
                          )
                        }
                      >
                        <QRCodeImage
                          barcode={
                            item.barcode
                          }
                          size={58}
                        />
                      </button>

                      <div className="card-product">

                        <h3>
                          {getProductName(
                            item
                          )}
                        </h3>

                        <div className="card-brand">

                          <span className="brand-avatar">
                            {item.brand
                              ? String(
                                  item.brand
                                )
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase()
                              : "B"}
                          </span>

                          <span>
                            {item.brand ||
                              "No brand"}
                          </span>

                        </div>

                      </div>

                    </div>

                    <div className="card-divider"></div>

                    {/* BARCODE */}

                    <div className="info-row">

                      <div className="info-label">
                        <span>▦</span>
                        Barcode
                      </div>

                      <strong>
                        {item.barcode ||
                          "-"}
                      </strong>

                    </div>

                    {/* PRICE */}

                    <div className="info-row">

                      <div className="info-label">
                        <span>₹</span>
                        Selling Price
                      </div>

                      <strong className="card-price">
                        ₹
                        {item.selling_price ||
                          0}
                      </strong>

                    </div>

                    {/* STOCK */}

                    <div className="info-row">

                      <div className="info-label">
                        <span>📦</span>
                        Available Stock
                      </div>

                      <span
                        className={
                          isLowStock
                            ? "card-stock low"
                            : "card-stock good"
                        }
                      >

                        <span
                          className={
                            isLowStock
                              ? "stock-dot red"
                              : "stock-dot green"
                          }
                        ></span>

                        {quantity} units

                      </span>

                    </div>

                    {/* CATEGORY */}

                    <div className="card-footer">

                      <span className="category-badge">
                        {getCategoryLabel(
                          item.category
                        )}
                      </span>

                    </div>

                  </div>

                );
              }
            )}

            {!filteredData.length && (

              <div className="empty-container">

                <div className="empty-icon">
                  📦
                </div>

                <h3>
                  No stock found
                </h3>

                <p>
                  No products match your
                  search or category.
                </p>

              </div>

            )}

          </div>

        )}

      </div>

      {/* =====================================================
          PRODUCT DETAILS MODAL
      ===================================================== */}

      {productModalVisible &&
        selectedStock && (

          <div
            className="modal-overlay"
            onClick={closeProductModal}
          >

            <div
              className="product-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                className="modal-close"
                onClick={
                  closeProductModal
                }
              >
                ×
              </button>

              <div className="modal-icon">
                📦
              </div>

              <h2>
                Product Details
              </h2>

              <div className="modal-details">

                <div className="modal-detail-row">
                  <span>
                    Barcode
                  </span>

                  <strong>
                    {selectedStock.barcode ||
                      "-"}
                  </strong>
                </div>

                <div className="modal-detail-row">
                  <span>
                    Brand
                  </span>

                  <strong>
                    {selectedStock.brand ||
                      "-"}
                  </strong>
                </div>

                <div className="modal-detail-row">
                  <span>
                    Category
                  </span>

                  <strong>
                    {selectedStock.category ||
                      "-"}
                  </strong>
                </div>

                {selectedStock.frame_name && (
                  <div className="modal-detail-row">
                    <span>
                      Frame Name
                    </span>

                    <strong>
                      {
                        selectedStock.frame_name
                      }
                    </strong>
                  </div>
                )}

                {selectedStock.lens_type && (
                  <div className="modal-detail-row">
                    <span>
                      Lens Type
                    </span>

                    <strong>
                      {
                        selectedStock.lens_type
                      }
                    </strong>
                  </div>
                )}

                {selectedStock.power_range && (
                  <div className="modal-detail-row">
                    <span>
                      Power
                    </span>

                    <strong>
                      {
                        selectedStock.power_range
                      }
                    </strong>
                  </div>
                )}

                <div className="modal-detail-row">
                  <span>
                    Selling Price
                  </span>

                  <strong className="modal-price">
                    ₹
                    {selectedStock.selling_price ||
                      0}
                  </strong>
                </div>

                <div className="modal-detail-row">
                  <span>
                    Available Quantity
                  </span>

                  <strong>
                    {selectedStock.quantity ||
                      0}
                  </strong>
                </div>

              </div>

            </div>

          </div>
        )}
    </>
  );
}

/* =========================================================
   CSS - SAME FILE
========================================================= */

const style = document.createElement("style");

style.innerHTML = `

* {
  box-sizing: border-box;
}

.inventory-page {
  width: 100%;
  min-height: 100vh;
  padding: 24px;
  background: #f5f9ff;
  color: #0f172a;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

/* =========================================================
   HEADER
========================================================= */

.inventory-header {
  width: 100%;
  min-height: 78px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  background: #ffffff;

  border: 1px solid #dbeafe;
  border-radius: 16px;

  box-shadow:
    0 4px 18px rgba(37, 99, 235, 0.08);

  margin-bottom: 24px;
}

.inventory-header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.inventory-header-icon {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #2563eb;
  color: #ffffff;

  border-radius: 12px;

  font-size: 23px;
}

.inventory-header h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
}

.inventory-header p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 13px;
}

/* =========================================================
   VIEW TOGGLE
========================================================= */

.view-toggle {
  display: flex;
  gap: 5px;

  padding: 4px;

  background: #eff6ff;

  border: 1px solid #dbeafe;

  border-radius: 10px;
}

.toggle-button {
  width: 38px;
  height: 34px;

  border: none;
  border-radius: 8px;

  background: transparent;

  color: #64748b;

  font-size: 18px;

  cursor: pointer;

  transition: 0.2s;
}

.toggle-button:hover {
  background: #dbeafe;
  color: #2563eb;
}

.toggle-button.active {
  background: #2563eb;
  color: #ffffff;

  box-shadow:
    0 3px 8px rgba(37, 99, 235, 0.25);
}

/* =========================================================
   TOP
========================================================= */

.inventory-top {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 18px;
}

.inventory-top h2 {
  margin: 0;

  font-size: 19px;
  font-weight: 800;

  color: #0f172a;
}

.inventory-top p {
  margin: 4px 0 0;

  color: #64748b;

  font-size: 12px;
}

.add-stock-button {
  display: flex;
  align-items: center;
  gap: 8px;

  border: none;

  padding: 11px 18px;

  border-radius: 10px;

  background: #2563eb;

  color: #ffffff;

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;

  box-shadow:
    0 5px 12px rgba(37, 99, 235, 0.22);

  transition: 0.2s;
}

.add-stock-button:hover {
  background: #1d4ed8;

  transform: translateY(-1px);
}

.add-stock-button span {
  font-size: 20px;
  line-height: 12px;
}

/* =========================================================
   CATEGORY
========================================================= */

.category-tabs {
  width: 100%;

  display: flex;
  gap: 8px;

  overflow-x: auto;

  padding-bottom: 5px;

  margin-bottom: 16px;
}

.category-tabs::-webkit-scrollbar {
  height: 4px;
}

.category-tabs::-webkit-scrollbar-thumb {
  background: #bfdbfe;
  border-radius: 10px;
}

.category-tab {
  flex-shrink: 0;

  padding: 9px 16px;

  border-radius: 20px;

  border: 1px solid #bfdbfe;

  background: #ffffff;

  color: #2563eb;

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;
}

.category-tab:hover {
  background: #eff6ff;
}

.category-tab.active {
  background: #2563eb;
  color: #ffffff;

  border-color: #2563eb;

  box-shadow:
    0 3px 8px rgba(37, 99, 235, 0.2);
}

/* =========================================================
   SEARCH
========================================================= */

.search-wrapper {
  width: 100%;
  height: 48px;

  display: flex;
  align-items: center;

  background: #ffffff;

  border: 1px solid #dbeafe;

  border-radius: 11px;

  padding: 0 13px;

  margin-bottom: 20px;

  box-shadow:
    0 2px 8px rgba(15, 23, 42, 0.03);
}

.search-icon {
  margin-right: 10px;

  color: #64748b;

  font-size: 16px;
}

.search-wrapper input {
  flex: 1;

  width: 100%;

  height: 46px;

  border: none;
  outline: none;

  background: transparent;

  color: #0f172a;

  font-size: 13px;
}

.search-wrapper input::placeholder {
  color: #94a3b8;
}

.clear-search {
  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;

  background: transparent;

  color: #64748b;

  font-size: 21px;

  cursor: pointer;

  border-radius: 50%;
}

.clear-search:hover {
  background: #eff6ff;
  color: #2563eb;
}

/* =========================================================
   TABLE
========================================================= */

.inventory-table {
  width: 100%;

  background: #ffffff;

  border: 1px solid #dbeafe;

  border-radius: 15px;

  overflow: hidden;

  box-shadow:
    0 4px 15px rgba(37, 99, 235, 0.05);
}

.table-header,
.table-row {
  width: 100%;

  display: grid;

  grid-template-columns:
    80px
    1fr
    1fr
    2fr
    1fr
    100px;

  align-items: center;
}

.table-header {
  min-height: 52px;

  padding: 0 12px;

  background: #eff6ff;

  border-bottom: 1px solid #dbeafe;

  color: #64748b;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 0.5px;
}

.table-row {
  min-height: 82px;

  padding: 10px 12px;

  background: #ffffff;

  border-bottom: 1px solid #eef2f7;

  color: #334155;

  font-size: 13px;

  transition: 0.15s;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: #f8fbff;
}

.qr-column {
  display: flex;

  align-items: center;

  justify-content: center;
}

.qr-button {
  width: 60px;
  height: 60px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #dbeafe;

  background: #ffffff;

  border-radius: 9px;

  cursor: pointer;

  padding: 3px;
}

.qr-button:hover {
  border-color: #2563eb;

  box-shadow:
    0 3px 8px rgba(37, 99, 235, 0.15);
}

.qr-image {
  display: block;

  object-fit: contain;

  background: #ffffff;
}

.qr-placeholder {
  width: 50px;
  height: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 8px;

  background: #f8fafc;

  border: 1px dashed #cbd5e1;

  color: #94a3b8;

  font-size: 10px;
  font-weight: 700;
}

.barcode-text {
  color: #475569;

  font-size: 12px;

  font-weight: 600;
}

.brand-text {
  color: #0f172a;

  font-size: 13px;

  font-weight: 700;
}

.product-text {
  color: #334155;

  font-size: 13px;

  font-weight: 600;

  padding-right: 12px;
}

.price-text {
  color: #2563eb;

  font-size: 14px;

  font-weight: 800;
}

.stock-badge {
  display: inline-flex;

  min-width: 48px;

  align-items: center;
  justify-content: center;

  padding: 6px 10px;

  border-radius: 8px;

  font-size: 12px;

  font-weight: 800;
}

.stock-badge.low {
  background: #fef2f2;

  border: 1px solid #fecaca;

  color: #dc2626;
}

.stock-badge.good {
  background: #f0fdf4;

  border: 1px solid #bbf7d0;

  color: #15803d;
}

/* =========================================================
   GRID
========================================================= */

.inventory-grid {
  width: 100%;

  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 16px;
}

.inventory-card {
  min-width: 0;

  padding: 17px;

  background: #ffffff;

  border: 1px solid #dbeafe;

  border-radius: 16px;

  box-shadow:
    0 4px 14px rgba(37, 99, 235, 0.06);

  transition: 0.2s;
}

.inventory-card:hover {
  transform: translateY(-2px);

  border-color: #bfdbfe;

  box-shadow:
    0 7px 18px rgba(37, 99, 235, 0.1);
}

.card-header {
  display: flex;

  align-items: center;

  gap: 13px;
}

.qr-card {
  width: 68px;
  height: 68px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f8fbff;

  border: 1px solid #dbeafe;

  border-radius: 11px;

  padding: 4px;

  cursor: pointer;
}

.qr-card:hover {
  border-color: #2563eb;
}

.card-product {
  min-width: 0;

  flex: 1;
}

.card-product h3 {
  margin: 0;

  color: #0f172a;

  font-size: 15px;

  line-height: 20px;

  font-weight: 800;
}

.card-brand {
  display: flex;

  align-items: center;

  gap: 7px;

  margin-top: 7px;

  color: #64748b;

  font-size: 12px;

  font-weight: 600;
}

.brand-avatar {
  width: 27px;
  height: 27px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #eff6ff;

  border: 1px solid #bfdbfe;

  color: #2563eb;

  font-size: 11px;

  font-weight: 800;
}

.card-divider {
  height: 1px;

  background: #e2e8f0;

  margin: 15px 0;
}

.info-row {
  min-height: 38px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  margin-bottom: 4px;

  font-size: 12px;
}

.info-label {
  display: flex;

  align-items: center;

  gap: 7px;

  color: #64748b;

  font-weight: 700;
}

.info-label span {
  color: #2563eb;

  font-size: 14px;
}

.info-row strong {
  color: #334155;

  font-size: 12px;

  font-weight: 700;

  text-align: right;

  word-break: break-word;
}

.card-price {
  color: #2563eb !important;

  font-size: 15px !important;

  font-weight: 800 !important;
}

.card-stock {
  display: inline-flex;

  align-items: center;

  gap: 5px;

  padding: 5px 9px;

  border-radius: 8px;

  border: 1px solid;

  font-size: 11px;

  font-weight: 800;
}

.card-stock.low {
  background: #fef2f2;

  border-color: #fecaca;

  color: #dc2626;
}

.card-stock.good {
  background: #f0fdf4;

  border-color: #bbf7d0;

  color: #15803d;
}

.stock-dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;
}

.stock-dot.red {
  background: #dc2626;
}

.stock-dot.green {
  background: #16a34a;
}

.card-footer {
  margin-top: 13px;

  display: flex;

  justify-content: flex-start;
}

.category-badge {
  padding: 6px 9px;

  border-radius: 7px;

  background: #eff6ff;

  border: 1px solid #bfdbfe;

  color: #2563eb;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 0.4px;
}

/* =========================================================
   EMPTY
========================================================= */

.empty-container {
  width: 100%;

  min-height: 230px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-direction: column;

  background: #ffffff;

  border: 1px solid #dbeafe;

  border-radius: 14px;

  padding: 30px;

  text-align: center;
}

.empty-icon {
  font-size: 34px;

  margin-bottom: 8px;
}

.empty-container h3 {
  margin: 0;

  color: #0f172a;

  font-size: 16px;
}

.empty-container p {
  margin: 6px 0 0;

  color: #64748b;

  font-size: 12px;
}

/* =========================================================
   LOADER
========================================================= */

.loader {
  width: 34px;
  height: 34px;

  border: 3px solid #dbeafe;

  border-top-color: #2563eb;

  border-radius: 50%;

  animation:
    inventory-spin 0.8s linear infinite;

  margin-bottom: 12px;
}

@keyframes inventory-spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================================================
   MODAL
========================================================= */

.modal-overlay {
  position: fixed;

  inset: 0;

  z-index: 9999;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 20px;

  background:
    rgba(15, 23, 42, 0.55);
}

.product-modal {
  position: relative;

  width: 100%;

  max-width: 500px;

  max-height: 90vh;

  overflow-y: auto;

  padding: 25px;

  background: #ffffff;

  border-radius: 18px;

  border: 1px solid #dbeafe;

  box-shadow:
    0 20px 50px rgba(15, 23, 42, 0.2);

  animation:
    inventory-modal-in
    0.2s ease;
}

@keyframes inventory-modal-in {
  from {
    opacity: 0;

    transform: translateY(10px)
      scale(0.98);
  }

  to {
    opacity: 1;

    transform: translateY(0)
      scale(1);
  }
}

.modal-close {
  position: absolute;

  top: 14px;
  right: 14px;

  width: 34px;
  height: 34px;

  border: none;

  border-radius: 50%;

  background: #eff6ff;

  color: #2563eb;

  font-size: 24px;

  line-height: 1;

  cursor: pointer;
}

.modal-close:hover {
  background: #dbeafe;
}

.modal-icon {
  width: 55px;
  height: 55px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 13px;

  background: #eff6ff;

  color: #2563eb;

  font-size: 25px;

  margin-bottom: 12px;
}

.product-modal h2 {
  margin: 0 0 18px;

  color: #0f172a;

  font-size: 20px;

  font-weight: 800;
}

.modal-details {
  width: 100%;

  border: 1px solid #dbeafe;

  border-radius: 12px;

  overflow: hidden;
}

.modal-detail-row {
  min-height: 48px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  padding: 10px 14px;

  border-bottom: 1px solid #eef2f7;
}

.modal-detail-row:last-child {
  border-bottom: none;
}

.modal-detail-row span {
  color: #64748b;

  font-size: 12px;

  font-weight: 600;
}

.modal-detail-row strong {
  color: #0f172a;

  font-size: 13px;

  font-weight: 700;

  text-align: right;

  word-break: break-word;
}

.modal-price {
  color: #2563eb !important;

  font-size: 16px !important;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1100px) {

  .inventory-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .table-header,
  .table-row {
    grid-template-columns:
      70px
      1fr
      1fr
      1.5fr
      90px
      80px;
  }

}

@media (max-width: 800px) {

  .inventory-page {
    padding: 14px;
  }

  .inventory-header {
    padding: 15px;

    min-height: auto;
  }

  .inventory-header h1 {
    font-size: 18px;
  }

  .inventory-header p {
    font-size: 11px;
  }

  .inventory-header-icon {
    width: 42px;
    height: 42px;

    font-size: 19px;
  }

  .inventory-top {
    align-items: flex-start;

    gap: 12px;
  }

  .inventory-top h2 {
    font-size: 17px;
  }

  .add-stock-button {
    padding: 9px 13px;

    font-size: 12px;
  }

  .inventory-table {
    overflow-x: auto;
  }

  .table-header,
  .table-row {
    min-width: 720px;
  }

  .inventory-grid {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 550px) {

  .inventory-page {
    padding: 10px;
  }

  .inventory-header {
    flex-direction: column;

    align-items: stretch;

    gap: 12px;
  }

  .view-toggle {
    align-self: flex-end;
  }

  .inventory-top {
    flex-direction: column;
  }

  .add-stock-button {
    width: 100%;

    justify-content: center;
  }

  .category-tab {
    padding: 8px 13px;
  }

  .product-modal {
    padding: 20px;
  }

}

`;

document.head.appendChild(style);