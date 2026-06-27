"use client";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, BellRing, Star, X, Plus, Minus, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface Product {
  id: string; name: string; nameEn?: string; description?: string; descriptionEn?: string;
  price: number; image?: string; calories?: number; allergens: string[];
}
interface Category { id: string; name: string; nameEn?: string; products: Product[]; }
interface Settings {
  primaryColor?: string | null; logoUrl?: string | null; welcomeMessage?: string | null;
  showCalories?: boolean | null; showAllergens?: boolean | null; enableOrdering?: boolean | null;
  enableWaiterCall?: boolean | null; enableFeedback?: boolean | null; googleRatingUrl?: string | null;
  whatsappNumber?: string | null; currency?: string | null;
}
interface Business {
  id: string; name: string; slug: string; settings: Settings | null;
  categories: Category[]; announcements: { id: string; title: string; content?: string | null }[];
}
interface CartItem extends Product { quantity: number; }

export function PublicMenu({ business }: { business: Business }) {
  const color = business.settings?.primaryColor ?? "#7C3AED";
  const [activeCat, setActiveCat] = useState(business.categories[0]?.id ?? "");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [lang, setLang] = useState<"tr" | "en">("tr");
  const [showAnnouncement, setShowAnnouncement] = useState(business.announcements.length > 0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const addToCart = (product: Product) => {
    setCart((c) => {
      const existing = c.find((i) => i.id === product.id);
      if (existing) return c.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...c, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} sepete eklendi`, { duration: 1500 });
  };

  const changeQty = (id: string, delta: number) => {
    setCart((c) => {
      const updated = c.map((i) => i.id === id ? { ...i, quantity: i.quantity + delta } : i).filter((i) => i.quantity > 0);
      return updated;
    });
  };

  const placeOrder = async () => {
    const res = await fetch(`/api/menu/${business.slug}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart.map((i) => ({ productId: i.id, quantity: i.quantity, price: i.price })) }),
    });
    if (res.ok) {
      setCart([]);
      setShowCart(false);
      toast.success("Siparişiniz alındı! 🎉");
    } else toast.error("Sipariş gönderilemedi");
  };

  const callWaiter = async () => {
    const res = await fetch(`/api/menu/${business.slug}/waiter-call`, { method: "POST" });
    if (res.ok) toast.success("Garson çağrıldı! 🔔");
    else toast.error("Hata oluştu");
  };

  const submitFeedback = async () => {
    if (!rating) { toast.error("Puan seçin"); return; }
    const res = await fetch(`/api/menu/${business.slug}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });
    if (res.ok) { toast.success("Geri bildiriminiz alındı, teşekkürler!"); setShowFeedback(false); setRating(0); setComment(""); }
  };

  const currentCat = business.categories.find((c) => c.id === activeCat);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Announcement popup */}
      {showAnnouncement && business.announcements[0] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-gray-900">{business.announcements[0].title}</h3>
              <button onClick={() => setShowAnnouncement(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            {business.announcements[0].content && (
              <p className="text-gray-500 text-sm">{business.announcements[0].content}</p>
            )}
            <button
              onClick={() => setShowAnnouncement(false)}
              className="w-full mt-4 py-2.5 rounded-xl text-white font-medium text-sm"
              style={{ backgroundColor: color }}
            >
              Tamam
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {business.settings?.logoUrl ? (
              <Image src={business.settings.logoUrl} alt={business.name} width={32} height={32} className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: color }}>
                {business.name[0]}
              </div>
            )}
            <span className="font-bold text-gray-900 text-sm">{business.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "tr" ? "en" : "tr")}
              className="text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 px-2 py-1 rounded-lg"
            >
              {lang === "tr" ? "EN" : "TR"}
            </button>
            {business.settings?.enableWaiterCall && (
              <button
                onClick={callWaiter}
                className="p-2 rounded-lg text-white flex items-center gap-1 text-xs font-medium"
                style={{ backgroundColor: color }}
              >
                <BellRing className="w-3.5 h-3.5" />
                Garson
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Welcome message */}
      {business.settings?.welcomeMessage && (
        <div className="max-w-lg mx-auto px-4 pt-4">
          <div className="rounded-xl p-3 text-white text-sm text-center font-medium" style={{ backgroundColor: color }}>
            {business.settings.welcomeMessage}
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto flex overflow-x-auto scrollbar-none px-4 gap-1 py-2">
          {business.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeCat === cat.id ? "text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
              style={activeCat === cat.id ? { backgroundColor: color } : {}}
            >
              {lang === "en" ? (cat.nameEn ?? cat.name) : cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        {currentCat && (
          <div className="space-y-3">
            <h2 className="font-bold text-gray-900 text-lg">{lang === "en" ? (currentCat.nameEn ?? currentCat.name) : currentCat.name}</h2>
            {currentCat.products.map((product) => {
              const cartItem = cart.find((i) => i.id === product.id);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="flex gap-3 p-3">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-2xl">🍽️</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {lang === "en" ? (product.nameEn ?? product.name) : product.name}
                      </h3>
                      {(product.description || product.descriptionEn) && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {lang === "en" ? (product.descriptionEn ?? product.description) : product.description}
                        </p>
                      )}
                      {business.settings?.showCalories && product.calories && (
                        <p className="text-xs text-gray-400 mt-1">{product.calories} kcal</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-base" style={{ color }}>
                          {formatPrice(product.price, business.settings?.currency ?? undefined)}
                        </span>
                        {business.settings?.enableOrdering && (
                          cartItem ? (
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => changeQty(product.id, -1)}
                                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-bold text-gray-900 w-4 text-center">{cartItem.quantity}</span>
                              <button
                                onClick={() => changeQty(product.id, 1)}
                                className="w-6 h-6 rounded-full text-white flex items-center justify-center"
                                style={{ backgroundColor: color }}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                              className="w-7 h-7 rounded-full text-white flex items-center justify-center"
                              style={{ backgroundColor: color }}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  {business.settings?.showAllergens && product.allergens.length > 0 && (
                    <div className="px-3 pb-3 flex flex-wrap gap-1">
                      {product.allergens.map((a) => (
                        <span key={a} className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">{a}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom bar: cart + feedback */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-2">
          {business.settings?.enableFeedback && (
            <button
              onClick={() => setShowFeedback(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Star className="w-4 h-4" />
              Değerlendir
            </button>
          )}
          {business.settings?.googleRatingUrl && (
            <a
              href={business.settings.googleRatingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              ⭐ Google
            </a>
          )}
          {business.settings?.enableOrdering && cartCount > 0 && (
            <button
              onClick={() => setShowCart(true)}
              className="flex-1 flex items-center justify-between px-4 py-2.5 rounded-xl text-white font-medium text-sm"
              style={{ backgroundColor: color }}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span>{cartCount} ürün</span>
              </div>
              <span>{formatPrice(cartTotal)}</span>
            </button>
          )}
        </div>
      </div>

      {/* Cart modal */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Sepetim</h2>
              <button onClick={() => setShowCart(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400">{formatPrice(item.price)} / adet</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => changeQty(item.id, -1)} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => changeQty(item.id, 1)} className="w-6 h-6 rounded-full text-white flex items-center justify-center" style={{ backgroundColor: color }}>
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="w-20 text-right text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100">
              <div className="flex justify-between mb-4">
                <span className="font-semibold text-gray-900">Toplam</span>
                <span className="font-bold text-lg" style={{ color }}>{formatPrice(cartTotal)}</span>
              </div>
              <button
                onClick={placeOrder}
                className="w-full py-3 rounded-xl text-white font-semibold"
                style={{ backgroundColor: color }}
              >
                Sipariş Ver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback modal */}
      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFeedback(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Deneyiminizi Puanlayın</h2>
              <button onClick={() => setShowFeedback(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="flex justify-center gap-3 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s)} className="text-3xl transition-transform hover:scale-110">
                  {s <= rating ? "⭐" : "☆"}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              placeholder="Yorumunuzu yazın (opsiyonel)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 mb-4"
              style={{ "--tw-ring-color": color } as any}
            />
            <button
              onClick={submitFeedback}
              className="w-full py-3 rounded-xl text-white font-semibold"
              style={{ backgroundColor: color }}
            >
              Gönder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
