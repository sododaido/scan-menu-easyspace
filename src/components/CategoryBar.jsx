import "./CategoryBar.css";

function CategoryBar({ category, setCategory, language }) {
  const categories = {
    all: { th: "ทั้งหมด", en: "All" },
    drink: { th: "เครื่องดื่ม", en: "Drinks" },
    snack: { th: "ขนม", en: "Snacks" },
  };

  return (
    <div className="category-bar">
      {Object.keys(categories).map((cat) => (
        <button
          key={cat}
          className={`category-btn ${category === cat ? "active" : ""}`}
          onClick={() => setCategory(cat)}
        >
          {categories[cat][language]}
        </button>
      ))}
    </div>
  );
}

export default CategoryBar;
