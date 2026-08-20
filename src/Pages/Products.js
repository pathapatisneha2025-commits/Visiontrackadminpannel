import React, { useEffect, useState } from "react";

const API_BASE =
  "https://visiontrackdatabase.onrender.com";

const ProductApproval = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE}/products/adminall`
      );

      const data = await response.json();

      if (data?.success) {
        setProducts(
          Array.isArray(data.data)
            ? data.data
            : []
        );
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error(
        "FETCH PRODUCTS ERROR:",
        error
      );

      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =====================================================
  // APPROVE / REJECT
  // =====================================================

  const handleApproval = async (
    productId,
    status
  ) => {
    const action =
      status === "approved"
        ? "approve"
        : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this product?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(productId);

      const response = await fetch(
        `${API_BASE}/products/approval/${productId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (data?.success) {
        alert(
          status === "approved"
            ? "Product approved successfully."
            : "Product rejected successfully."
        );

        setSelectedProduct(null);

        await fetchProducts();
      } else {
        alert(
          data?.message ||
            `Failed to ${action} product`
        );
      }
    } catch (error) {
      console.error(
        "APPROVAL ERROR:",
        error
      );

      alert(
        `Unable to ${action} product`
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredProducts =
    products.filter((product) => {
      const status =
        product.approval_status ||
        product.status ||
        "pending";

      if (filter === "all") {
        return true;
      }

      return status === filter;
    });

  // =====================================================
  // STATUS
  // =====================================================

  const getStatus = (product) => {
    return (
      product.approval_status ||
      product.status ||
      "pending"
    );
  };

  const getStatusClass = (status) => {
    if (status === "approved") {
      return "status-approved";
    }

    if (status === "rejected") {
      return "status-rejected";
    }

    return "status-pending";
  };

  // =====================================================
  // VARIANTS
  // =====================================================

  const getVariants = (product) => {
    if (!product.variants) {
      return [];
    }

    if (Array.isArray(product.variants)) {
      return product.variants;
    }

    try {
      return JSON.parse(
        product.variants
      );
    } catch {
      return [];
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="approval-page">

      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <div className="page-header">

        <div>
          <h1>
            Product Approval
          </h1>

          <p>
            Review products submitted by
            stores before publishing them.
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchProducts}
          disabled={loading}
        >
          ↻ Refresh
        </button>

      </div>

      {/* ============================================= */}
      {/* FILTER TABS */}
      {/* ============================================= */}

      <div className="filter-container">

        <button
          className={
            filter === "pending"
              ? "filter-btn active"
              : "filter-btn"
          }
          onClick={() =>
            setFilter("pending")
          }
        >
          Pending
          <span>
            {
              products.filter(
                (p) =>
                  getStatus(p) ===
                  "pending"
              ).length
            }
          </span>
        </button>

        <button
          className={
            filter === "approved"
              ? "filter-btn active"
              : "filter-btn"
          }
          onClick={() =>
            setFilter("approved")
          }
        >
          Approved
          <span>
            {
              products.filter(
                (p) =>
                  getStatus(p) ===
                  "approved"
              ).length
            }
          </span>
        </button>

        <button
          className={
            filter === "rejected"
              ? "filter-btn active"
              : "filter-btn"
          }
          onClick={() =>
            setFilter("rejected")
          }
        >
          Rejected
          <span>
            {
              products.filter(
                (p) =>
                  getStatus(p) ===
                  "rejected"
              ).length
            }
          </span>
        </button>

        <button
          className={
            filter === "all"
              ? "filter-btn active"
              : "filter-btn"
          }
          onClick={() =>
            setFilter("all")
          }
        >
          All
          <span>
            {products.length}
          </span>
        </button>

      </div>

      {/* ============================================= */}
      {/* CONTENT */}
      {/* ============================================= */}

      {loading ? (
        <div className="loading-box">
          <div className="spinner"></div>

          <p>
            Loading products...
          </p>
        </div>
      ) : filteredProducts.length ===
        0 ? (
        <div className="empty-box">

          <div className="empty-icon">
            📦
          </div>

          <h2>
            No products found
          </h2>

          <p>
            There are no{" "}
            {filter} products at the
            moment.
          </p>

        </div>
      ) : (

        <div className="product-grid">

          {filteredProducts.map(
            (product) => {

              const status =
                getStatus(product);

              const variants =
                getVariants(product);

              const firstImage =
                variants?.[0]?.image;

              return (
                <div
                  className="product-card"
                  key={product.id}
                >

                  {/* IMAGE */}

                  <div className="product-image">

                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt={
                          product.product_name
                        }
                      />
                    ) : (
                      <div className="no-image">
                        📦
                      </div>
                    )}

                    <span
                      className={`status-badge ${getStatusClass(
                        status
                      )}`}
                    >
                      {status
                        .charAt(0)
                        .toUpperCase() +
                        status.slice(1)}
                    </span>

                  </div>

                  {/* INFO */}

                  <div className="product-info">

                    <div className="product-category">
                      {product.category ||
                        "No Category"}
                    </div>

                    <h3>
                      {product.product_name}
                    </h3>

                    <p className="brand">
                      Brand:{" "}
                      <strong>
                        {product.brand ||
                          "No Brand"}
                      </strong>
                    </p>

                    <p className="description">
                      {product.description ||
                        "No description available."}
                    </p>

                    {/* VARIANTS */}

                    {variants.length >
                      0 && (
                      <div className="variants">

                        <strong>
                          Variants
                        </strong>

                        <div className="variant-list">

                          {variants.map(
                            (
                              variant,
                              index
                            ) => (
                              <div
                                className="variant"
                                key={
                                  index
                                }
                              >

                                {variant.image ? (
                                  <img
                                    src={
                                      variant.image
                                    }
                                    alt={
                                      variant.color
                                    }
                                  />
                                ) : (
                                  <div className="variant-placeholder">
                                    —
                                  </div>
                                )}

                                <div>
                                  <div>
                                    {variant.color ||
                                      "Default"}
                                  </div>

                                  <strong>
                                    ₹
                                    {variant.price ||
                                      "0"}
                                  </strong>
                                </div>

                              </div>
                            )
                          )}

                        </div>

                      </div>
                    )}

                    {/* ACTIONS */}

                    <div className="action-row">

                      <button
                        className="view-btn"
                        onClick={() =>
                          setSelectedProduct(
                            product
                          )
                        }
                      >
                        View
                      </button>

                      {status ===
                        "pending" && (
                        <>
                          <button
                            className="reject-btn"
                            disabled={
                              actionLoading ===
                              product.id
                            }
                            onClick={() =>
                              handleApproval(
                                product.id,
                                "rejected"
                              )
                            }
                          >
                            {actionLoading ===
                            product.id
                              ? "..."
                              : "Reject"}
                          </button>

                          <button
                            className="approve-btn"
                            disabled={
                              actionLoading ===
                              product.id
                            }
                            onClick={() =>
                              handleApproval(
                                product.id,
                                "approved"
                              )
                            }
                          >
                            {actionLoading ===
                            product.id
                              ? "..."
                              : "Approve"}
                          </button>
                        </>
                      )}

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

      {/* ============================================= */}
      {/* PRODUCT MODAL */}
      {/* ============================================= */}

      {selectedProduct && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedProduct(null)
          }
        >

          <div
            className="product-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <h2>
                  {
                    selectedProduct.product_name
                  }
                </h2>

                <p>
                  Product Details
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setSelectedProduct(
                    null
                  )
                }
              >
                ×
              </button>

            </div>

            <div className="modal-content">

              <div className="detail-row">
                <span>
                  Category
                </span>

                <strong>
                  {
                    selectedProduct.category ||
                    "-"
                  }
                </strong>
              </div>

              <div className="detail-row">
                <span>
                  Brand
                </span>

                <strong>
                  {
                    selectedProduct.brand ||
                    "-"
                  }
                </strong>
              </div>

              <div className="detail-row">
                <span>
                  Status
                </span>

                <strong
                  className={getStatusClass(
                    getStatus(
                      selectedProduct
                    )
                  )}
                >
                  {getStatus(
                    selectedProduct
                  )}
                </strong>
              </div>

              <div className="description-box">

                <h4>
                  Description
                </h4>

                <p>
                  {
                    selectedProduct.description ||
                    "No description"
                  }
                </p>

              </div>

              <h4>
                Variants
              </h4>

              <div className="modal-variants">

                {getVariants(
                  selectedProduct
                ).map(
                  (
                    variant,
                    index
                  ) => (
                    <div
                      className="modal-variant"
                      key={index}
                    >

                      {variant.image && (
                        <img
                          src={
                            variant.image
                          }
                          alt=""
                        />
                      )}

                      <div>
                        <strong>
                          {
                            variant.color
                          }
                        </strong>

                        <p>
                          Price: ₹
                          {
                            variant.price ||
                            "0"
                          }
                        </p>

                        {variant.sku && (
                          <p>
                            SKU:{" "}
                            {
                              variant.sku
                            }
                          </p>
                        )}
                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

            {getStatus(
              selectedProduct
            ) === "pending" && (

              <div className="modal-actions">

                <button
                  className="reject-btn"
                  onClick={() =>
                    handleApproval(
                      selectedProduct.id,
                      "rejected"
                    )
                  }
                >
                  Reject Product
                </button>

                <button
                  className="approve-btn"
                  onClick={() =>
                    handleApproval(
                      selectedProduct.id,
                      "approved"
                    )
                  }
                >
                  Approve Product
                </button>

              </div>

            )}

          </div>

        </div>
      )}

      {/* ============================================= */}
      {/* CSS */}
      {/* ============================================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .approval-page {
          min-height: 100vh;
          background: #f4f7fb;
          padding: 25px;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .page-header {
          background: #ffffff;
          border-radius: 16px;
          padding: 22px 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
          box-shadow:
            0 3px 15px
            rgba(0,0,0,0.06);
        }

        .page-header h1 {
          margin: 0;
          color: #0f172a;
          font-size: 25px;
        }

        .page-header p {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .refresh-btn {
          border: none;
          background: #2563eb;
          color: white;
          padding: 11px 18px;
          border-radius: 9px;
          cursor: pointer;
          font-weight: 700;
        }

        .refresh-btn:hover {
          background: #1d4ed8;
        }

        .filter-container {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .filter-btn {
          border: 1px solid #dbe3ef;
          background: white;
          color: #475569;
          padding: 10px 16px;
          border-radius: 9px;
          cursor: pointer;
          font-weight: 600;
        }

        .filter-btn span {
          margin-left: 7px;
          background: #e2e8f0;
          padding: 2px 7px;
          border-radius: 20px;
          font-size: 11px;
        }

        .filter-btn.active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        .filter-btn.active span {
          background: white;
          color: #2563eb;
        }

        .product-grid {
          display: grid;
          grid-template-columns:
            repeat(
              auto-fill,
              minmax(300px, 1fr)
            );
          gap: 18px;
        }

        .product-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow:
            0 3px 15px
            rgba(0,0,0,0.06);
          border: 1px solid #e2e8f0;
        }

        .product-image {
          height: 190px;
          background: #f8fafc;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 15px;
        }

        .no-image {
          font-size: 50px;
          color: #94a3b8;
        }

        .status-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-approved {
          background: #dcfce7;
          color: #166534;
        }

        .status-rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .product-info {
          padding: 17px;
        }

        .product-category {
          color: #2563eb;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .product-info h3 {
          margin: 5px 0;
          color: #0f172a;
          font-size: 18px;
        }

        .brand {
          margin: 5px 0;
          color: #64748b;
          font-size: 13px;
        }

        .description {
          color: #64748b;
          font-size: 13px;
          line-height: 19px;
          min-height: 38px;
        }

        .variants {
          margin-top: 12px;
        }

        .variants > strong {
          font-size: 13px;
          color: #334155;
        }

        .variant-list {
          display: flex;
          gap: 7px;
          overflow-x: auto;
          margin-top: 8px;
        }

        .variant {
          flex-shrink: 0;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 5px;
          display: flex;
          gap: 6px;
          align-items: center;
          min-width: 120px;
          font-size: 11px;
        }

        .variant img,
        .variant-placeholder {
          width: 40px;
          height: 40px;
          object-fit: contain;
          border-radius: 5px;
          background: #f8fafc;
        }

        .variant-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-row {
          display: flex;
          gap: 7px;
          margin-top: 15px;
        }

        .action-row button {
          border: none;
          border-radius: 8px;
          padding: 10px 12px;
          cursor: pointer;
          font-weight: 700;
          flex: 1;
        }

        .view-btn {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .approve-btn {
          background: #16a34a;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 15px;
          cursor: pointer;
          font-weight: 700;
        }

        .approve-btn:hover {
          background: #15803d;
        }

        .reject-btn {
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 15px;
          cursor: pointer;
          font-weight: 700;
        }

        .reject-btn:hover {
          background: #b91c1c;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-box,
        .empty-box {
          background: white;
          border-radius: 15px;
          padding: 60px 20px;
          text-align: center;
          color: #64748b;
        }

        .empty-icon {
          font-size: 45px;
          margin-bottom: 10px;
        }

        .empty-box h2 {
          color: #334155;
          margin: 5px;
        }

        .spinner {
          width: 35px;
          height: 35px;
          border: 4px solid #dbeafe;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation:
            spin 0.8s linear infinite;
          margin: auto;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ========================================= */
        /* MODAL */
        /* ========================================= */

        .modal-overlay {
          position: fixed;
          inset: 0;
          background:
            rgba(15,23,42,0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 9999;
        }

        .product-modal {
          width: 100%;
          max-width: 650px;
          max-height: 90vh;
          overflow-y: auto;
          background: white;
          border-radius: 18px;
          box-shadow:
            0 20px 50px
            rgba(0,0,0,0.25);
        }

        .modal-header {
          padding: 20px;
          border-bottom:
            1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          margin: 0;
          color: #0f172a;
        }

        .modal-header p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .close-btn {
          width: 38px;
          height: 38px;
          border: none;
          border-radius: 50%;
          background: #f1f5f9;
          font-size: 25px;
          cursor: pointer;
          color: #475569;
        }

        .modal-content {
          padding: 20px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 10px 0;
          border-bottom:
            1px solid #f1f5f9;
        }

        .detail-row span {
          color: #64748b;
        }

        .detail-row strong {
          color: #0f172a;
        }

        .description-box {
          background: #f8fafc;
          padding: 13px;
          border-radius: 10px;
          margin: 15px 0;
        }

        .description-box h4 {
          margin: 0 0 5px;
        }

        .description-box p {
          margin: 0;
          color: #64748b;
          line-height: 20px;
        }

        .modal-variants {
          display: grid;
          grid-template-columns:
            repeat(
              auto-fill,
              minmax(180px, 1fr)
            );
          gap: 10px;
          margin-top: 10px;
        }

        .modal-variant {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px;
          display: flex;
          gap: 10px;
        }

        .modal-variant img {
          width: 70px;
          height: 70px;
          object-fit: contain;
          background: #f8fafc;
          border-radius: 7px;
        }

        .modal-variant p {
          margin: 4px 0;
          color: #64748b;
          font-size: 12px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          padding: 15px 20px 20px;
          border-top:
            1px solid #e2e8f0;
        }

        .modal-actions button {
          flex: 1;
        }

        @media (max-width: 600px) {

          .approval-page {
            padding: 12px;
          }

          .page-header {
            padding: 17px;
            align-items: flex-start;
            flex-direction: column;
          }

          .page-header h1 {
            font-size: 21px;
          }

          .product-grid {
            grid-template-columns: 1fr;
          }

          .action-row {
            flex-wrap: wrap;
          }

          .action-row button {
            min-width: 30%;
          }

          .modal-actions {
            flex-direction: column;
          }

        }

      `}</style>

    </div>
  );
};

export default ProductApproval;