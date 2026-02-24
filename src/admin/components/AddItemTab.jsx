import { useState } from "react";
import "./AddItemTab.css";

function AddItemTab({ items, saveMenu }) {
  const [formData, setFormData] = useState({
    nameTh: "",
    nameEn: "",
    price: "",
    category: "drink",
    image: "",
  });
  const [errors, setErrors] = useState({});
  const [imgError, setImgError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.nameTh.trim()) errs.nameTh = "กรุณากรอกข้อมูล";
    if (!formData.nameEn.trim()) errs.nameEn = "กรุณากรอกข้อมูล";
    if (!formData.price || Number(formData.price) <= 0)
      errs.price = "ราคาต้องมากกว่า 0";
    if (!formData.image.trim()) errs.image = "กรุณากรอกข้อมูล";
    else if (!formData.image.startsWith("http")) errs.image = "URL ไม่ถูกต้อง";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetForm = () => {
    setFormData({
      nameTh: "",
      nameEn: "",
      price: "",
      category: "drink",
      image: "",
    });
    setErrors({});
    setImgError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setBanner(null);

    const newId =
      items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    const newItem = {
      id: newId,
      name: { th: formData.nameTh.trim(), en: formData.nameEn.trim() },
      price: Number(formData.price),
      category: formData.category,
      image: formData.image.trim(),
      available: true,
    };

    try {
      await saveMenu([...items, newItem]);
      setBanner({ type: "success", msg: "✅ เพิ่มสินค้าสำเร็จ!" });
      resetForm();
      setTimeout(() => setBanner(null), 3000);
    } catch (err) {
      setBanner({ type: "error", msg: `❌ เกิดข้อผิดพลาด: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  const update = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (field === "image") setImgError(false);
  };

  return (
    <div className="add-tab">
      <h2 className="add-tab-title"> เพิ่มสินค้าใหม่</h2>

      {banner && (
        <div className={`add-banner add-banner-${banner.type}`}>
          {banner.msg}
          {banner.type === "error" && (
            <button className="add-retry" onClick={handleSubmit}>
              ลองอีกครั้ง
            </button>
          )}
        </div>
      )}

      <form className="add-form" onSubmit={handleSubmit}>
        <div className="add-field">
          <label>ชื่อภาษาไทย</label>
          <input
            type="text"
            value={formData.nameTh}
            onChange={(e) => update("nameTh", e.target.value)}
            placeholder="ชื่อสินค้า (ไทย)"
          />
          {errors.nameTh && <span className="add-err">{errors.nameTh}</span>}
        </div>

        <div className="add-field">
          <label>ชื่อภาษาอังกฤษ</label>
          <input
            type="text"
            value={formData.nameEn}
            onChange={(e) => update("nameEn", e.target.value)}
            placeholder="Product name (EN)"
          />
          {errors.nameEn && <span className="add-err">{errors.nameEn}</span>}
        </div>

        <div className="add-field">
          <label>ราคา (บาท)</label>
          <input
            type="number"
            min="1"
            value={formData.price}
            onChange={(e) => update("price", e.target.value)}
            placeholder="0"
          />
          {errors.price && <span className="add-err">{errors.price}</span>}
        </div>

        <div className="add-field">
          <label>หมวดหมู่</label>
          <select
            value={formData.category}
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="drink">เครื่องดื่ม</option>
            <option value="snack">ของว่าง</option>
          </select>
        </div>

        <div className="add-field">
          <label>URL รูปภาพ</label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) => update("image", e.target.value)}
            placeholder="https://..."
          />
          {errors.image && <span className="add-err">{errors.image}</span>}
          {formData.image && !imgError && (
            <img
              src={formData.image}
              alt="preview"
              className="add-preview"
              onError={() => setImgError(true)}
            />
          )}
          {imgError && <p className="add-img-err">ไม่สามารถโหลดรูปได้</p>}
        </div>

        <button type="submit" className="add-submit" disabled={saving}>
          {saving ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </form>
    </div>
  );
}

export default AddItemTab;
