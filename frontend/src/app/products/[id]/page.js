'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AppContext';
import { useCart } from '@/context/AppContext';
import { productAPI, cartAPI, wishlistAPI, reviewAPI } from '@/lib/api';
import styles from './detail.module.css';
import toast from 'react-hot-toast';

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const { isAuthenticated } = useAuth();
  const { setCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getProduct(id);
      setProduct(data.product);
      if (data.product?.reviews) setReviews(data.product.reviews);
      // Check wishlist
      if (isAuthenticated) {
        const wishRes = await wishlistAPI.checkWishlist(data.product.id).catch(() => null);
        if (wishRes) setInWishlist(wishRes.data.inWishlist);
      }
    } catch {
      // Fallback product
      setProduct({
        id: '1', name: 'Hyaluronic Acid Serum', slug: 'hyaluronic-acid-serum',
        description: 'Intensely hydrating serum with pure hyaluronic acid. Plumps and moisturizes skin, reduces fine lines, and gives you a dewy, youthful glow. Suitable for all skin types.',
        shortDescription: 'Deep hydration serum for plump, glowing skin',
        price: 899, compareAtPrice: 1299, sku: 'SKC-HA-001', stock: 150,
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600'],
        thumbnail: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300',
        ingredients: 'Hyaluronic Acid, Niacinamide, Vitamin E, Aloe Vera, Glycerin',
        howToUse: 'Apply 2-3 drops on clean, damp skin. Follow with moisturizer.',
        isFeatured: true, tags: ['hydrating', 'anti-aging', 'serum'],
        avgRating: 4.5, reviewCount: 128,
        category: { name: 'Skincare', slug: 'skincare' },
        brand: { name: 'Luxe Glow', slug: 'luxe-glow' },
        reviews: [
          { id: '1', rating: 5, title: 'Amazing serum!', comment: 'My skin has never looked better. Highly recommend!', user: { firstName: 'Priya', lastName: 'S.' }, createdAt: new Date().toISOString(), isVerified: true }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setAddingToCart(true);
    try {
      await cartAPI.addToCart({ productId: product.id, quantity });
      const { data } = await cartAPI.getCart();
      setCart(data);
      toast.success('Successfully added to cart!', {
        icon: '🛒',
      });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) { window.location.href = '/login'; return; }
    try {
      if (inWishlist) {
        await wishlistAPI.removeFromWishlist(product.id);
        setInWishlist(false);
      } else {
        await wishlistAPI.addToWishlist({ productId: product.id });
        setInWishlist(true);
      }
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  const renderStars = (rating) => {
    const r = parseFloat(rating) || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < r ? styles.starFill : styles.starEmpty}>★</span>
    ));
  };

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.loadingSpinner}>Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="empty-state">
        <h3>Product not found</h3>
        <Link href="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  const discount = product.compareAtPrice
    ? Math.round(((parseFloat(product.compareAtPrice) - parseFloat(product.price)) / parseFloat(product.compareAtPrice)) * 100)
    : 0;

  const images = product.images?.length > 0 ? product.images : [product.thumbnail || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600'];

  return (
    <div className={styles.detailPage}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/products">Products</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/products?category=${product.category.slug}`}>{product.category.name}</Link>
              <span>/</span>
            </>
          )}
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className={styles.productSection}>
          {/* Images */}
          <div className={styles.imageSection}>
            <div className={styles.mainImage}>
              <img src={images[selectedImage]} alt={product.name} />
              {discount > 0 && <span className={styles.discountBadge}>-{discount}%</span>}
            </div>
            {images.length > 1 && (
              <div className={styles.thumbnails}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumbnail} ${selectedImage === i ? styles.thumbActive : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img} alt={`View ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className={styles.infoSection}>
            {product.brand && <span className={styles.brand}>{product.brand.name}</span>}
            <h1 className={styles.productName}>{product.name}</h1>

            <div className={styles.ratingRow}>
              <div className={styles.stars}>{renderStars(product.avgRating)}</div>
              <span className={styles.ratingText}>{parseFloat(product.avgRating).toFixed(1)}</span>
              <span className={styles.reviewCount}>({product.reviewCount} reviews)</span>
            </div>

            <p className={styles.shortDesc}>{product.shortDescription || product.description?.slice(0, 120) + '...'}</p>

            <div className={styles.priceSection}>
              <span className={styles.price}>₹{parseFloat(product.price).toLocaleString()}</span>
              {product.compareAtPrice && (
                <>
                  <span className={styles.mrp}>₹{parseFloat(product.compareAtPrice).toLocaleString()}</span>
                  <span className={styles.savings}>Save {discount}%</span>
                </>
              )}
            </div>
            <p className={styles.taxNote}>Inclusive of all taxes</p>

            <div className={styles.divider}></div>

            {/* Quantity & Add to Cart */}
            <div className={styles.quantityRow}>
              <label>Quantity:</label>
              <div className={styles.quantityControl}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}>+</button>
              </div>
              <span className={styles.stockStatus}>
                {product.stock > 0 ? (
                  <span className={styles.inStock}>✓ In Stock ({product.stock} available)</span>
                ) : (
                  <span className={styles.outOfStock}>✗ Out of Stock</span>
                )}
              </span>
            </div>

            <div className={styles.actions}>
              <button
                className={`btn btn-primary btn-lg ${styles.addToCartBtn}`}
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
              >
                {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
              </button>
              <button
                className={`${styles.wishlistBtn} ${inWishlist ? styles.wishlisted : ''}`}
                onClick={toggleWishlist}
              >
                {inWishlist ? '♥' : '♡'}
              </button>
            </div>

            {/* Features */}
            <div className={styles.features}>
              <div className={styles.featureItem}>Free shipping on orders above ₹499</div>
              <div className={styles.featureItem}>30-day easy returns</div>
              <div className={styles.featureItem}>100% authentic product</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabSection}>
          <div className={styles.tabs}>
            {['description', 'ingredients', 'how-to-use', 'reviews'].map(tab => (
              <button
                key={tab}
                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
          <div className={styles.tabContent}>
            {activeTab === 'description' && (
              <div className={styles.descriptionContent}>
                <p>{product.description}</p>
                {product.tags?.length > 0 && (
                  <div className={styles.tagList}>
                    {product.tags.map(tag => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'ingredients' && (
              <div className={styles.ingredientsTab}>
                {product.ingredients ? (
                  <>
                    <div className={styles.ingredientList}>
                      {product.ingredients.split(',').map((item, idx) => (
                        <div key={idx} className={styles.ingredientBadge}>
                          {item.trim()}
                        </div>
                      ))}
                    </div>
                    <div className={styles.transparencyNote}>
                      <span className={styles.transparencyIcon}>🔬</span>
                      <p><strong>Science-Backed Formulation:</strong> We prioritize transparency. All ingredients used are dermatologically tested and chosen for their efficacy and safety profile.</p>
                    </div>
                  </>
                ) : (
                  <p>Ingredients information will be available soon.</p>
                )}
              </div>
            )}
            {activeTab === 'how-to-use' && (
              <div className={styles.usageTab}>
                {product.howToUse ? (
                  <>
                    <div className={styles.usageInstructions}>
                      <p>{product.howToUse}</p>
                    </div>
                    <div className={styles.routineGuide}>
                      <h4>Routine Step</h4>
                      <div className={styles.routineSteps}>
                        <div className={`${styles.step} ${styles.stepDone}`}>1. Cleanse</div>
                        <div className={`${styles.step} ${styles.stepActive}`}>2. Treat ({product.name})</div>
                        <div className={styles.step}>3. Moisturize</div>
                        <div className={styles.step}>4. Protect (SPF)</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p>Usage instructions will be available soon.</p>
                )}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className={styles.reviewsSection}>
                {(product.reviews || reviews).length > 0 ? (
                  (product.reviews || reviews).map((review, i) => (
                    <div key={i} className={styles.reviewCard}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewStars}>{renderStars(review.rating)}</div>
                        {review.isVerified && <span className={styles.verifiedBadge}>✓ Verified Purchase</span>}
                      </div>
                      {review.title && <h4 className={styles.reviewTitle}>{review.title}</h4>}
                      <p className={styles.reviewComment}>{review.comment}</p>
                      <span className={styles.reviewAuthor}>
                        {review.user?.firstName} {review.user?.lastName} · {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No reviews yet. Be the first to review!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
