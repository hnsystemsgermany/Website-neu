import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

export default function CartDrawer() {
  const { items, isOpen, setOpen, updateQuantity, removeItem, totalPrice, totalCount } = useCart();
  const { t } = useLanguage();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md bg-background">
        <SheetHeader>
          <SheetTitle className="font-heading flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {t("cart.title")} {totalCount > 0 && <span className="text-muted-foreground text-sm">({totalCount})</span>}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">{t("cart.empty")}</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 rounded-lg border border-border p-3">
                <div className="h-16 w-16 rounded-md bg-muted overflow-hidden flex items-center justify-center shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingCart className="h-6 w-6 text-muted-foreground/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <h4 className="text-sm font-medium truncate">{item.name}</h4>
                    <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground">€{item.price.toFixed(2)}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-sm font-semibold">€{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("cart.total")}</span>
              <span className="text-lg font-heading font-bold">€{totalPrice.toFixed(2)}</span>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {t("cart.checkout")}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
