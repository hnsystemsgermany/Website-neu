import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import usbCCable from "@/assets/usb-c-cable.avif";
import smarthelmRuecklicht from "@/assets/smarthelm-ruecklicht.png";

const products = [
  {
    id: 1,
    price: 49.99,
    originalPrice: 59.99,
    rating: 4.8,
    reviews: 127,
    badged: true,
    image: smarthelmRuecklicht,
  },
  { id: 2, price: 14.99, rating: 4.6, reviews: 84 },
  { id: 3, price: 9.99, rating: 4.9, reviews: 201, image: usbCCable },
  { id: 4, price: 24.99, rating: 4.7, reviews: 56 },
];

export default function ShopPage() {
  const { toast } = useToast();
  const { addItem, setOpen } = useCart();
  const { t } = useLanguage();

  const addToCart = (p: typeof products[number]) => {
    const name = t(`product.${p.id}.name`);
    addItem({ id: p.id, name, price: p.price, image: (p as any).image });
    setOpen(true);
    toast({ title: t("cart.added"), description: `${name} ${t("cart.addedDesc")}` });
  };

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-gradient-accent">{t("shop.title")}</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">{t("shop.subtitle")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {products.map((p, i) => {
            const name = t(`product.${p.id}.name`);
            const desc = t(`product.${p.id}.desc`);
            return (
              <motion.div
                key={p.id}
                className="group rounded-xl border border-border bg-card-gradient overflow-hidden flex flex-col hover:border-primary/30 transition-colors"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              >
                <div className="aspect-square bg-muted relative flex items-center justify-center overflow-hidden">
                  {(p as any).image ? (
                    <img src={(p as any).image} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingCart className="h-12 w-12 text-muted-foreground/30" />
                  )}
                  {p.badged && (
                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md">
                      {t("shop.bestseller")}
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    <span className="text-sm font-medium text-foreground">{p.rating}</span>
                    <span className="text-xs text-muted-foreground">({p.reviews})</span>
                  </div>
                  <h3 className="font-heading text-base font-semibold mb-1">{name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 flex-1">{desc}</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl font-heading font-bold text-foreground">€{p.price.toFixed(2)}</span>
                    {p.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">€{p.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <Button
                    onClick={() => addToCart(p)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading tracking-wide"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1.5" />
                    {t("shop.add")}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
