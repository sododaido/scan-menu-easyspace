import { useState } from "react";
import "./EditModal.css";

function EditModal({ item, onSave, onClose }) {
  const isEdit = item !== null;

  const [formData, setFormData] = useState({
    nameTh: isEdit ? item.name.th : "",
    nameEn: isEdit ? item.name.en : "",
    price: isEdit ? item.price : "",
    category: isEdit ? item.category : "drink",
    image: isEdit ? item.image : "",
  });

  const [errors, setErrors] = useState({});
  const [imgError, setImgError] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.nameTh.trim()) errs.nameTh = "กรุณากรอกข้อมูล";
    if (!formData.nameEn.trim()) errs.nameEn = "กรุณากรอกข้อมูล";
    if (!formData.price || Number(formData.price) <= 0) errs.price = "ราคาต้องมากกว่า 0";
    if (!formData.image.trim()) errs.image = "กรุณากรอกข้อมูล";
    else if (!formData.image.startsWith("http")) errs.image = "URL ไม่ถูกต้อง";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      nameTh: formData.nameTh.trim(),
      nameEn: formData.nameEn.trim(),
      price: Number(formData.price),
      category: formData.category,
      image: formData.image.trim(),
    });
  };

  const update = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (field === "image") setImgError(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? "✏️ แก้ไขสินค้า" : "➕ เพิ่มสินค้าใหม่"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label>ชื่อภาษาไทย</label>
            <input
              type="text"
              value={formData.nameTh}
              onChange={(e) => update("nameTh", e.target.value)}
              placeholder="ชื่อสินค้า (ไทย)"
            />
            {errors.nameTh && <span className="modal-err">{errors.nameTh}</span>}
          </div>

          <div className="modal-field">
            <label>ชื่อภาษาอังกฤษ</label>
            <input
              type="text"
              value={formData.nameEn}
              onChange={(e) => update("nameEn", e.target.value)}
              placeholder="Product name (EN)"
            />
            {errors.nameEn && <span className="modal-err">{errors.nameEn}</span>}
          </div>

          <div className="modal-field">
            <label>ราคา (บาท)</label>
            <input
              type="number"
              min="1"
              value={formData.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="0"
            />
            {errors.price && <span className="modal-err">{errors.price}</span>}
          </div>

          <div className="modal-field">
            <label>หมวดหมู่</label>
            <select
              value={formData.category}
              onChange={(e) => update("category", e.target.value)}
            >
              <option value="drink">เครื่องดื่ม</option>
              <option value="snack">ของว่าง</option>
            </select>
          </div>

          <div className="modal-field">
            <label>URL รูปภาพ</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => update("image", e.target.value)}
              placeholder="https://..."
            />
            {errors.image && <span className="modal-err">{errors.image}</span>}
            {formData.image && !imgError && (
              <img
                src={formData.image}
                alt="preview"
                className="modal-preview"
                onError={() => setImgError(true)}
              />
            )}
            {imgError && (
              <p className="modal-img-err">ไม่สามารถโหลดรูปได้</p>
            )}
          </div>

          <div className="modal-footer">
            <button type="submit" className="modal-btn-save">
              บันทึก
            </button>
            <button type="button" className="modal-btn-cancel" onClick={onClose}>
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
