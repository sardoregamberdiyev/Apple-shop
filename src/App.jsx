import { useCallback, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCheck,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import {
  SearchPanel,
  CartPanel,
  HelpPanel,
  Panel,
} from "./components/ShopPanels";

export const products = [
  {
    id: "iphone",
    name: "iPhone 16",
    price: 69990,
    image: "/images/iphone.svg",
    category: "Smartfonlar",
    detail: "Har kuni. Yangi imkoniyatlar.",
  },
  {
    id: "macbook",
    name: "MacBook Air",
    price: 89990,
    image: "/images/macbook.svg",
    category: "Noutbuklar",
    detail: "Yengil. Kuchli. Sizniki.",
  },
  {
    id: "airpods",
    name: "AirPods Pro",
    price: 19990,
    image: "/images/airpods.svg",
    category: "Quloqchinlar",
    detail: "Faqat siz va sevimli musiqangiz.",
  },
  {
    id: "watch",
    name: "Apple Watch",
    price: 29990,
    image: "/images/watch.svg",
    category: "Aksessuarlar",
    detail: "Har bir harakatingiz bilan.",
  },
];
const categories = [
  {
    name: "Smartfonlar",
    image: "/images/iphone.svg",
    className: "category-phone",
  },
  {
    name: "Noutbuklar",
    image: "/images/macbook-category.svg",
    className: "category-laptop",
  },
  {
    name: "Quloqchinlar",
    image: "/images/headphones.svg",
    className: "category-headphones",
  },
  {
    name: "Aksessuarlar",
    image: "/images/charger.svg",
    className: "category-accessories",
  },
];
const benefits = [
  {
    Icon: ShieldCheck,
    title: "Qabul qilishda tekshirish",
    description: "Mahsulot sifatini to‘lovdan oldin tekshiring",
  },
  {
    Icon: Settings2,
    title: "Sozlashda yordam",
    description: "Qurilmangizni moslab beramiz",
  },
  {
    Icon: MessageCircle,
    title: "Xariddan keyingi yordam",
    description: "Savollar tug‘ilsa doim aloqadamiz",
  },
];

function Logo() {
  return (
    <a className="logo" href="#" aria-label="ORBITA — bosh sahifa">
      <span className="logo-symbol" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <i key={i} style={{ "--i": i }} />
        ))}
        <b />
      </span>
      <span>ORBITA</span>
    </a>
  );
}

function getSavedCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("orbita-cart") || "{}");
    return Object.fromEntries(
      products
        .filter((p) => Number.isInteger(saved?.[p.id]) && saved[p.id] > 0)
        .map((p) => [p.id, Math.min(saved[p.id], 99)]),
    );
  } catch {
    return {};
  }
}

export default function App() {
  const [cart, setCart] = useState(getSavedCart);
  const [panel, setPanel] = useState(null);
  const [filter, setFilter] = useState(null);
  const [toast, setToast] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [recent, setRecent] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const closePanel = useCallback(() => setPanel(null), []);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const items = products
    .filter((p) => cart[p.id])
    .map((p) => ({ ...p, quantity: cart[p.id] }));
  const visible = products.filter(
    (p) =>
      (!filter || p.category === filter) &&
      (!showNew || ["iphone", "watch"].includes(p.id)),
  );

  useEffect(() => {
    try {
      localStorage.setItem("orbita-cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!recent) return;
    const timer = setTimeout(() => setRecent(null), 1200);
    return () => clearTimeout(timer);
  }, [recent]);
  useEffect(() => {
    document.body.style.overflow = panel ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [panel]);

  function add(product) {
    setCart((previous) => ({
      ...previous,
      [product.id]: Math.min((previous[product.id] || 0) + 1, 99),
    }));
    setRecent(product.id);
    setToast(`${product.name} savatchaga qo‘shildi`);
  }
  function remove(id) {
    setCart((previous) => {
      const next = { ...previous };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });
  }
  function browse(category = null, fresh = false) {
    setFilter(category);
    setShowNew(fresh);
    setMobileMenu(false);
    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <header className="header page-width">
        <Logo />
        <nav
          className={mobileMenu ? "navigation navigation-open" : "navigation"}
          aria-label="Asosiy menyu"
        >
          <button
            className={!showNew ? "nav-active" : ""}
            onClick={() => {
              setMobileMenu(false);
              document
                .getElementById("categories")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Katalog
          </button>
          <button
            className={showNew ? "nav-active" : ""}
            onClick={() => browse(null, true)}
          >
            Yangi mahsulotlar
          </button>
          <button
            onClick={() => {
              setPanel("delivery");
              setMobileMenu(false);
            }}
          >
            Yetkazib berish
          </button>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Mahsulot qidirish"
            onClick={() => setPanel("search")}
          >
            <Search size={19} strokeWidth={1.6} />
          </button>
          <button
            className="icon-button cart-trigger"
            aria-label={`Savatcha, ${count} ta mahsulot`}
            onClick={() => setPanel("cart")}
          >
            <ShoppingBag size={20} strokeWidth={1.6} />
            <span className="cart-count">{count}</span>
          </button>
          <button
            className="icon-button mobile-menu-toggle"
            aria-label="Menyuni ochish"
            aria-expanded={mobileMenu}
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <main className="page-width">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="eyebrow">SIZNING YANGI ORBITANGIZ</span>
            <h1 id="hero-title">
              Kelajakka
              <br />
              yanada yaqin
            </h1>
            <p>
              Apple va raqamli texnika
              <br />
              kuningiz uchun
            </p>
            <button className="primary-button" onClick={() => browse()}>
              Texnikani tanlash <ArrowRight size={16} />
            </button>
          </div>
          <img
            className="hero-art"
            src="/images/hero.svg"
            alt="Titan rangli iPhone 16 Pro, AirPods va MagSafe aksessuarlari"
            fetchPriority="high"
          />
          <div className="hero-product-label">
            <span />
            iPhone 16 Pro
          </div>
          <div className="hero-bottom">
            <span>Yaqinroq. Qulayroq. Siz uchun.</span>
            <a href="#categories" aria-label="Kategoriyalarga o‘tish">
              <ArrowDown size={17} />
            </a>
          </div>
        </section>

        <section
          className="categories section"
          id="categories"
          aria-labelledby="categories-title"
        >
          <div className="section-heading">
            <h2 id="categories-title">Keraklisini toping</h2>
            <span>Sizga mos texnika shu yerda</span>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => browse(category.name)}
                className={`category-card ${category.className}`}
              >
                <span className="category-name">{category.name}</span>
                <span className="round-arrow">
                  <ArrowRight size={17} />
                </span>
                <img src={category.image} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </section>

        <section
          className="products section"
          id="products"
          aria-labelledby="products-title"
        >
          <div className="section-heading">
            <h2 id="products-title">
              {filter ||
                (showNew ? "Yangi mahsulotlar" : "Ommabop mahsulotlar")}
            </h2>
            {filter || showNew ? (
              <button
                className="text-button"
                onClick={() => {
                  setFilter(null);
                  setShowNew(false);
                }}
              >
                Barchasi <X size={14} />
              </button>
            ) : (
              <span>Har kuni ilhom beradigan tanlov</span>
            )}
          </div>
          <div className="product-grid">
            {visible.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-top">
                  <h3>{product.name}</h3>
                  <button
                    className={`add-button ${recent === product.id ? "added" : ""}`}
                    onClick={() => add(product)}
                    aria-label={`${product.name} savatchaga qo‘shish`}
                  >
                    {recent === product.id ? (
                      <Check size={17} />
                    ) : (
                      <Plus size={17} />
                    )}
                  </button>
                </div>
                <img src={product.image} alt={product.name} loading="lazy" />
                <p className="product-price">
                  {product.price.toLocaleString("ru-RU")} ₽ <span>dan</span>
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="benefits section" aria-labelledby="benefits-title">
          <div className="benefits-main">
            <h2 id="benefits-title">
              Yaxshi texnika.
              <br />
              Xotirjam xarid.
            </h2>
            <div className="benefit-grid">
              {benefits.map(({ Icon, title, description }) => (
                <div className="benefit" key={title}>
                  <span className="benefit-icon">
                    <Icon size={28} strokeWidth={1.4} />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="support">
            <button className="primary-button" onClick={() => setPanel("help")}>
              Tanlashda yordam <ArrowRight size={16} />
            </button>
            <div className="support-caption">
              <p>
                O‘zingizga mosini
                <br />
                birga topamiz.
              </p>
              <div className="support-avatar" aria-hidden="true">
                <img src="/images/support.svg" alt="" loading="lazy" />
                <span className="online-dot" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="page-width footer">
        <span>© {new Date().getFullYear()} ORBITA</span>
        <span>Texnika yaqinlashtiradi.</span>
        <button onClick={() => setPanel("help")}>
          Savolingiz bormi? <ArrowUpRight />
        </button>
      </footer>
      <SearchPanel
        open={panel === "search"}
        onClose={closePanel}
        products={products}
        onAdd={add}
      />
      <CartPanel
        open={panel === "cart"}
        onClose={closePanel}
        items={items}
        onAdd={add}
        onRemove={remove}
        onClear={() => setCart({})}
      />
      <HelpPanel
        open={panel === "help"}
        onClose={closePanel}
        onBrowse={() => {
          closePanel();
          browse();
        }}
      />
      {panel === "delivery" && <DeliveryPanel onClose={closePanel} />}
      <div className={`toast ${toast ? "toast-visible" : ""}`} role="status">
        <CheckCheck size={18} />
        {toast}
      </div>
    </>
  );
}

function ArrowUpRight() {
  return <ArrowRight size={13} className="footer-arrow" />;
}
function DeliveryPanel({ onClose }) {
  return (
    <Panel open onClose={onClose} title="Yetkazib berish">
      <div className="delivery-symbol">
        <Truck size={38} strokeWidth={1.3} />
      </div>
      <h3>Qulaylik eshigingizgacha.</h3>
      <p className="muted">
        Ushbu sayt — namoyish uchun tayyorlangan do‘kon. Haqiqiy buyurtmalar va
        yetkazib berish hozircha mavjud emas.
      </p>
      <div className="info-card">
        <ShieldCheck size={24} />
        <div>
          <h4>Avval tekshiring, keyin to‘lang</h4>
          <p>
            Haqiqiy do‘kon ishga tushganda yetkazib berish hududi, muddati va
            narxi shu yerda ko‘rsatiladi.
          </p>
        </div>
      </div>
      <button className="primary-button w-full" onClick={onClose}>
        Xaridni davom ettirish <ArrowRight size={16} />
      </button>
    </Panel>
  );
}
