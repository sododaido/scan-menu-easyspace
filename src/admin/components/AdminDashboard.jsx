import { useState, useCallback } from "react";
import { useMenuData } from "../../hooks/useMenuData";
import DashboardTab from "./DashboardTab";
import MenuTable from "./MenuTable";
import EditModal from "./EditModal";
import AddItemTab from "./AddItemTab";
import Toast from "./Toast";
import "./AdminDashboard.css";

function AdminDashboard({ onLogout }) {
  const { items, loading, error, saveMenu } = useMenuData();
  const [activeTab, setActiveTab] = useState(0);
  const [editItem, setEditItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);

  const tabs = [
    { label: " ภาพรวม" },
    { label: " จัดการเมนู" },
    { label: " เพิ่มสินค้า" },
  ];

  const showToast = (message, type = "success") => {
    setToast({ message, type, key: Date.now() });
  };

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  const handleEdit = (item) => {
    setEditItem(item);
    setShowEditModal(true);
  };

  const handleEditSave = async (formData) => {
    const updated = items.map((i) =>
      i.id === editItem.id
        ? {
            ...i,
            name: { th: formData.nameTh, en: formData.nameEn },
            price: formData.price,
            category: formData.category,
            image: formData.image,
          }
        : i,
    );
    try {
      await saveMenu(updated);
      setShowEditModal(false);
      setEditItem(null);
      showToast("แก้ไขรายการสินค้าเรียบร้อย ✅");
    } catch (err) {
      showToast("บันทึกไม่สำเร็จ กรุณาลองใหม่ ❌", "error");
    }
  };

  const handleDelete = async (id) => {
    const filtered = items.filter((i) => i.id !== id);
    try {
      await saveMenu(filtered);
      showToast("ลบรายการสินค้าเรียบร้อย ✅");
    } catch (err) {
      showToast("ลบไม่สำเร็จ กรุณาลองใหม่ ❌", "error");
    }
  };

  const handleToggle = async (id) => {
    const updated = items.map((i) =>
      i.id === id
        ? { ...i, available: i.available === false ? true : false }
        : i,
    );
    try {
      await saveMenu(updated);
      showToast("อัปเดตสถานะเรียบร้อย ✅");
    } catch (err) {
      showToast("อัปเดตไม่สำเร็จ กรุณาลองใหม่ ❌", "error");
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="ad-header">
        <h1 className="ad-logo"> EasySpace Admin</h1>
        <button className="ad-logout" onClick={onLogout}>
          ออกจากระบบ
        </button>
      </header>

      <nav className="ad-tabs">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={`ad-tab ${activeTab === i ? "ad-tab-active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="ad-content">
        {loading ? (
          <div className="ad-loading">⏳ กำลังโหลด...</div>
        ) : (
          <>
            {error && (
              <div className="ad-error">โหลดข้อมูลล้มเหลว (ใช้ข้อมูลสำรอง)</div>
            )}

            {activeTab === 0 && <DashboardTab items={items} />}
            {activeTab === 1 && (
              <MenuTable
                items={items}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            )}
            {activeTab === 2 && (
              <AddItemTab items={items} saveMenu={saveMenu} />
            )}
          </>
        )}
      </main>

      {showEditModal && (
        <EditModal
          item={editItem}
          onSave={handleEditSave}
          onClose={() => {
            setShowEditModal(false);
            setEditItem(null);
          }}
        />
      )}

      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          duration={2000}
          onClose={clearToast}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
