'use client';

import { useCart } from '@/contexts/CartContext';
import { useLocale } from '@/contexts/LocaleContext';
import { CartItemRow } from '@/features/cart/components/CartItemRow';
import { CartSummary } from '@/features/cart/components/CartSummary';
import { EmptyCart } from '@/features/cart/components/EmptyCart';
import { Container } from '@/shared/ui/Container';
import { SectionHeader } from '@/shared/ui/SectionHeader';

export default function CartPage() {
  const { t } = useLocale();
  const { items, totalPrice, count, updateQuantity, removeItem } = useCart();

  if (!items.length) {
    return (
      <Container className="py-16">
        <EmptyCart title={t('cart.empty')} actionLabel={t('cart.continue')} />
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <SectionHeader eyebrow="Shopping bag" title={t('cart.title')} description="Review quantities before moving to checkout." />
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <CartItemRow
              key={`${item.productId}-${JSON.stringify(item.selectedVariants || {})}`}
              item={item}
              onUpdateQuantity={(quantity) => updateQuantity(item.productId, quantity, item.selectedVariants)}
              onRemove={() => removeItem(item.productId, item.selectedVariants)}
            />
          ))}
        </div>
        <CartSummary totalLabel={t('cart.total')} checkoutLabel={t('cart.checkout')} totalPrice={totalPrice} count={count} />
      </div>
    </Container>
  );
}
