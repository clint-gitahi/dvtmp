import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Badge, Button, ErrorState, Text } from '@shared/components';
import { palette, radii, shadows, spacing } from '@shared/theme';
import { useAppDispatch } from '@shared/hooks/redux';
import { useGetProductByIdQuery } from '@features/products/api/productsApi';
import { ImageGallery } from '@features/products/components/ImageGallery';
import { RelatedProducts } from '@features/products/components/RelatedProducts';
import {
  canAddToCart,
  describeCartIneligibility,
  getCartIneligibilityReason,
  isLowStock,
  isOutOfStock,
  isPremium,
  maxQuantityInCart,
} from '@features/products/businessRules';
import { addItem } from '@features/cart/slice';
import type { Product } from '@models/Product';
import type { RootStackParamList } from '@app/navigation/types';

type DetailsRoute = RouteProp<RootStackParamList, 'ProductDetails'>;
type DetailsNav = NativeStackNavigationProp<RootStackParamList, 'ProductDetails'>;

export function ProductDetailsScreen() {
  const route = useRoute<DetailsRoute>();
  const navigation = useNavigation<DetailsNav>();
  const { productId } = route.params;
  const { data: product, isLoading, error, refetch } = useGetProductByIdQuery(productId);

  const handleRelatedPress = useCallback(
    (related: Product) => {
      navigation.push('ProductDetails', { productId: related.id });
    },
    [navigation],
  );

  if (isLoading || (!product && !error)) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={palette.primary} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centered}>
        <ErrorState
          title="Couldn’t load this product"
          description="Please check your connection and try again."
          onRetry={refetch}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.galleryWrap}>
        <ImageGallery images={product.images.length > 0 ? product.images : [product.thumbnail]} />
        <BackButton onPress={navigation.goBack} />
      </View>

      <View style={styles.body}>
        <DetailsHeader product={product} />
        <PriceBlock product={product} />
        <AddToCartBlock product={product} />
        <Section title="Description">
          <Text variant="body" color="inkSoft">
            {product.description}
          </Text>
        </Section>
        <AvailabilityBlock product={product} />
        <ReviewsBlock product={product} />
        <Section title="More from this category">
          <RelatedProducts
            category={product.category}
            excludeId={product.id}
            onPress={handleRelatedPress}
          />
        </Section>
      </View>
    </ScrollView>
  );
}

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}>
      <Text variant="bodyStrong" color="ink">
        ←
      </Text>
    </Pressable>
  );
}

function DetailsHeader({ product }: { product: Product }) {
  const premium = isPremium(product);
  const lowStock = isLowStock(product);
  const outOfStock = isOutOfStock(product);

  return (
    <View style={styles.headerBlock}>
      <Text variant="micro" color="inkMuted">
        {(product.brand ?? product.category).toUpperCase()}
      </Text>
      <Text variant="display">{product.title}</Text>
      <View style={styles.badgeRow}>
        <Text variant="captionStrong" color="ink">
          ★ {product.rating.toFixed(1)}
        </Text>
        <Text variant="caption" color="inkMuted">
          • {product.reviews?.length ?? 0} reviews
        </Text>
      </View>
      <View style={styles.badgeRow}>
        {premium ? <Badge tone="premium" label="Premium Choice" /> : null}
        {outOfStock ? (
          <Badge tone="danger" label="Out of stock" />
        ) : lowStock ? (
          <Badge tone="warning" label={`Almost sold out — ${product.stock} left`} />
        ) : null}
        {product.discountPercentage >= 1 ? (
          <Badge tone="danger" label={`-${Math.round(product.discountPercentage)}%`} />
        ) : null}
      </View>
    </View>
  );
}

function PriceBlock({ product }: { product: Product }) {
  const finalPrice = product.price * (1 - product.discountPercentage / 100);
  return (
    <View style={styles.priceBlock}>
      <Text variant="title" color="ink">
        ${finalPrice.toFixed(2)}
      </Text>
      {product.discountPercentage >= 1 ? (
        <Text variant="body" color="inkMuted" style={styles.strike}>
          ${product.price.toFixed(2)}
        </Text>
      ) : null}
    </View>
  );
}

function AddToCartBlock({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const [qty, setQty] = useState(1);
  const max = maxQuantityInCart(product);
  const eligible = canAddToCart(product);
  const reason = eligible ? null : getCartIneligibilityReason(product);

  const canIncrement = qty < max;
  const canDecrement = qty > 1;

  const handleAdd = () => {
    if (!eligible) return;
    dispatch(addItem(product, qty));
  };

  return (
    <View style={styles.cartCard}>
      {eligible ? (
        <View style={styles.qtyRow}>
          <Text variant="captionStrong" color="inkSoft">
            Quantity
          </Text>
          <View style={styles.qtyGroup}>
            <QtyBtn label="−" onPress={() => setQty(q => Math.max(1, q - 1))} disabled={!canDecrement} />
            <Text variant="bodyStrong" style={styles.qtyValue}>
              {qty}
            </Text>
            <QtyBtn label="+" onPress={() => setQty(q => Math.min(max, q + 1))} disabled={!canIncrement} />
          </View>
        </View>
      ) : null}

      <Button
        label={reason ? describeCartIneligibility(reason) : `Add ${qty} to cart`}
        onPress={handleAdd}
        disabled={!eligible}
        fullWidth
        size="lg"
      />
    </View>
  );
}

function QtyBtn({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.qtyBtn,
        disabled && styles.qtyBtnDisabled,
        pressed && !disabled && styles.qtyBtnPressed,
      ]}
    >
      <Text variant="bodyStrong" color={disabled ? 'inkMuted' : 'ink'}>
        {label}
      </Text>
    </Pressable>
  );
}

function AvailabilityBlock({ product }: { product: Product }) {
  const lines = [
    product.availabilityStatus ? { label: 'Availability', value: product.availabilityStatus } : null,
    product.shippingInformation ? { label: 'Shipping', value: product.shippingInformation } : null,
    product.warrantyInformation ? { label: 'Warranty', value: product.warrantyInformation } : null,
    product.returnPolicy ? { label: 'Returns', value: product.returnPolicy } : null,
  ].filter((x): x is { label: string; value: string } => x !== null);

  if (lines.length === 0) return null;

  return (
    <Section title="Details">
      <View style={styles.detailsList}>
        {lines.map(line => (
          <View key={line.label} style={styles.detailsRow}>
            <Text variant="captionStrong" color="inkSoft" style={styles.detailsLabel}>
              {line.label}
            </Text>
            <Text variant="caption" color="ink" style={styles.detailsValue}>
              {line.value}
            </Text>
          </View>
        ))}
      </View>
    </Section>
  );
}

function ReviewsBlock({ product }: { product: Product }) {
  const reviews = product.reviews ?? [];
  if (reviews.length === 0) return null;

  return (
    <Section title={`Reviews (${reviews.length})`}>
      <View style={styles.reviewList}>
        {reviews.slice(0, 5).map((review, idx) => (
          <View key={`${review.reviewerEmail}-${idx}`} style={styles.review}>
            <View style={styles.reviewHeader}>
              <Text variant="captionStrong">{review.reviewerName}</Text>
              <Text variant="caption" color="inkMuted">
                ★ {review.rating.toFixed(1)}
              </Text>
            </View>
            <Text variant="caption" color="inkSoft">
              {review.comment}
            </Text>
          </View>
        ))}
      </View>
    </Section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="heading" style={styles.sectionTitle}>
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: palette.surfaceAlt 
  },
  centered: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: palette.surfaceAlt 
  },
  scroll: { 
    paddingBottom: spacing.xxxl 
  },
  galleryWrap: { 
    position: 'relative' 
  },
  backBtn: {
    position: 'absolute',
    top: spacing.xxl + spacing.sm,
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  backBtnPressed: { 
    opacity: 0.7 
  },
  body: { 
    paddingHorizontal: spacing.lg, 
    paddingTop: spacing.xl, 
    gap: spacing.lg 
  },
  headerBlock: { 
    gap: spacing.xs 
  },
  badgeRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: spacing.sm, 
    flexWrap: 'wrap' 
  },
  priceBlock: { 
    flexDirection: 'row', 
    alignItems: 'baseline', 
    gap: spacing.sm 
  },
  strike: { 
    textDecorationLine: 'line-through' 
  },
  cartCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnDisabled: { 
    backgroundColor: palette.surfaceMuted, 
    borderColor: palette.surfaceMuted 
  },
  qtyBtnPressed: { 
    opacity: 0.7 
  },
  qtyValue: { 
    minWidth: 24, 
    textAlign: 'center'
   },
  section: { 
    gap: spacing.sm 
  },
  sectionTitle: {},
  detailsList: { 
    gap: spacing.sm 
  },
  detailsRow: { 
    flexDirection: 'row', 
    gap: spacing.md 
  },
  detailsLabel: { 
    width: 96 
  },
  detailsValue: { 
    flex: 1 
  },
  reviewList: { 
    gap: spacing.md 
  },
  review: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});