import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Headphones,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

const money = (value) => `${value.toLocaleString("ru-RU")} ₽`;

export function Panel({ open, onClose, title, children, className = "" }) {
  const panelRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    panelRef.current?.querySelector("[data-autofocus], button, input")?.focus();
    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const elements = [
        ...panelRef.current.querySelectorAll(
          "button:not([disabled]), input, a[href], select",
        ),
      ];
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="panel-overlay" onClick={onClose}>
      <section
        ref={panelRef}
        className={`side-panel ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="panel-header">
          <h2 id={titleId}>{title}</h2>
          <button
            type="button"
            className="panel-close icon-button"
            aria-label="Oynani yopish"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>
        <div className="panel-body">{children}</div>
      </section>
    </div>
  );
}

export function SearchPanel({ open, onClose, products, onAdd }) {
  const [query, setQuery] = useState("");
  const visible = products.filter((product) =>
    product.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );

  return (
    <Panel
      open={open}
      onClose={onClose}
      title="Qidiruv"
      className="search-panel"
    >
      <label className="search-field">
        <Search size={21} aria-hidden="true" />
        <input
          data-autofocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Qaysi qurilmani izlayapsiz?"
          aria-label="Mahsulot nomi bo‘yicha qidirish"
        />
        {query && (
          <button
            type="button"
            aria-label="Qidiruvni tozalash"
            onClick={() => setQuery("")}
          >
            <X size={18} />
          </button>
        )}
      </label>
      <p className="panel-caption">
        {query.trim()
          ? `${visible.length} ta mahsulot topildi`
          : "Sevimli qurilmangiz shu yerda"}
      </p>
      <div className="search-results">
        {visible.map((product) => (
          <article className="panel-product" key={product.id}>
            <img src={product.image} alt={product.name} />
            <div className="panel-product-info">
              <h3>{product.name}</h3>
              <p>{money(product.price)} dan</p>
            </div>
            <button
              type="button"
              className="round-button"
              aria-label={`${product.name}ni savatchaga qo‘shish`}
              onClick={() => onAdd(product)}
            >
              <Plus size={19} />
            </button>
          </article>
        ))}
        {!visible.length && (
          <div className="panel-empty">
            <Search size={35} />
            <h3>Hozircha topilmadi</h3>
            <p>“iPhone”, “MacBook” yoki “AirPods” deb qidirib ko‘ring.</p>
            <button
              type="button"
              className="text-button"
              onClick={() => setQuery("")}
            >
              Barcha mahsulotlar <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </Panel>
  );
}

export function CartPanel({ open, onClose, items, onAdd, onRemove, onClear }) {
  const [showNotice, setShowNotice] = useState(false);
  const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const total = items.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0,
  );

  useEffect(() => {
    if (!open) setShowNotice(false);
  }, [open]);

  return (
    <Panel
      open={open}
      onClose={onClose}
      title="Savatchangiz"
      className="cart-panel"
    >
      {!items.length ? (
        <div className="panel-empty">
          <ShoppingBag size={43} strokeWidth={1.3} />
          <h3>Yangi imkoniyatlar uchun joy</h3>
          <p>Yoqtirgan qurilmangiz yonidagi “+” tugmasini bosing.</p>
          <button type="button" className="primary-button" onClick={onClose}>
            Xaridni boshlash <ArrowRight size={17} />
          </button>
        </div>
      ) : (
        <>
          <div className="cart-topline">
            <p className="panel-caption">{count} ta mahsulot</p>
            <button type="button" className="text-button" onClick={onClear}>
              <Trash2 size={14} /> Tozalash
            </button>
          </div>
          <div className="cart-items">
            {items.map((item) => (
              <article className="panel-product cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="panel-product-info">
                  <h3>{item.name}</h3>
                  <p>{money(item.price)}</p>
                  <div className="quantity-control">
                    <button
                      type="button"
                      aria-label={`${item.name} sonini kamaytirish`}
                      onClick={() => onRemove(item.id)}
                    >
                      <Minus size={15} />
                    </button>
                    <span aria-label="Miqdori">{item.quantity || 1}</span>
                    <button
                      type="button"
                      aria-label={`${item.name} sonini oshirish`}
                      onClick={() => onAdd(item)}
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
                <strong className="item-total">
                  {money(item.price * (item.quantity || 1))}
                </strong>
              </article>
            ))}
          </div>
          <div className="cart-summary">
            <div>
              <span>Jami</span>
              <strong>{money(total)}</strong>
            </div>
            <p>Qurilmalaringizni qabul qilishda tekshirib oling.</p>
            <button
              type="button"
              className="primary-button"
              onClick={() => setShowNotice(true)}
            >
              Buyurtma berish <ArrowRight size={18} />
            </button>
            {showNotice && (
              <p className="demo-notice" role="status">
                Bu namoyish do‘koni. Buyurtma va to‘lov yuborilmaydi;
                savatchangiz ushbu brauzerda saqlanadi.
              </p>
            )}
          </div>
        </>
      )}
    </Panel>
  );
}

const suggestions = {
  phone: {
    name: "Smartfon",
    title: "Har kuningiz uchun — iPhone 16",
    text: "Suratga olish, yaqinlar bilan muloqot va kundalik ishlar uchun iPhone 16 bilan tanishing.",
  },
  laptop: {
    name: "Noutbuk",
    title: "Ish va ijod uchun — MacBook Air",
    text: "Yengil korpus va qulay ekran. O‘qish, ish va ijodiy vazifalar uchun MacBook Air’ni ko‘rib chiqing.",
  },
  audio: {
    name: "Quloqchin",
    title: "O‘z ohangingizda — AirPods Pro",
    text: "Musiqa, qo‘ng‘iroqlar va sevimli podkastlaringiz uchun AirPods Pro bilan tanishing.",
  },
};

export function HelpPanel({ open, onClose, onBrowse }) {
  const [selection, setSelection] = useState("phone");
  const suggestion = suggestions[selection];

  return (
    <Panel
      open={open}
      onClose={onClose}
      title="Birga tanlaymiz"
      className="help-panel"
    >
      <div className="help-intro">
        <span className="help-icon">
          <Headphones size={28} />
        </span>
        <h3>Sizga nima kerak?</h3>
        <p>Ehtiyojingizga mos qurilmani topishga yordam beramiz.</p>
      </div>
      <div
        className="help-options"
        role="group"
        aria-label="Qurilma turini tanlang"
      >
        {Object.entries(suggestions).map(([key, value]) => (
          <button
            type="button"
            className={`help-option ${selection === key ? "selected" : ""}`}
            aria-pressed={selection === key}
            key={key}
            onClick={() => setSelection(key)}
          >
            {value.name}
            {selection === key && <Check size={16} />}
          </button>
        ))}
      </div>
      <div className="help-recommendation" aria-live="polite">
        <p className="eyebrow">SIZ UCHUN TAVSIYA</p>
        <h3>{suggestion.title}</h3>
        <p>{suggestion.text}</p>
      </div>
      <button
        type="button"
        className="primary-button"
        onClick={onBrowse || onClose}
      >
        Mahsulotlarni ko‘rish <ArrowRight size={18} />
      </button>
      <p className="panel-footnote">Tanlov sizniki. Biz esa yoningizdamiz.</p>
    </Panel>
  );
}
