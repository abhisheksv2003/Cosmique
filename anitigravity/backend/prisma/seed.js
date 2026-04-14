// Database Seed File - Beauty & Cosmetics Products
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.address.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin User
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@glamcart.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'GlamCart',
      role: 'ADMIN',
      isVerified: true
    }
  });
  console.log('👤 Admin user created');

  // Create Test Customer
  const customerPassword = await bcrypt.hash('Customer@123', 12);
  const customer = await prisma.user.create({
    data: {
      email: 'customer@test.com',
      password: customerPassword,
      firstName: 'Priya',
      lastName: 'Sharma',
      phone: '+919876543210',
      isVerified: true,
      addresses: {
        create: {
          fullName: 'Priya Sharma',
          phone: '+919876543210',
          street: '42 MG Road, Indiranagar',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560038',
          country: 'India',
          isDefault: true
        }
      }
    }
  });
  console.log('👤 Test customer created');

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Skincare',
        slug: 'skincare',
        description: 'Discover our premium skincare collection for radiant, glowing skin',
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Makeup',
        slug: 'makeup',
        description: 'Express yourself with our stunning makeup range',
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Hair Care',
        slug: 'hair-care',
        description: 'Transform your hair with our professional haircare products',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Fragrances',
        slug: 'fragrances',
        description: 'Find your signature scent from our luxury fragrance collection',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Bath & Body',
        slug: 'bath-body',
        description: 'Luxurious bath and body products for the ultimate self-care',
        image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=400'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Nails',
        slug: 'nails',
        description: 'Complete your look with our nail care and color collection',
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400'
      }
    })
  ]);
  console.log('📂 Categories created');

  // Create Brands
  const brands = await Promise.all([
    prisma.brand.create({ data: { name: 'Luxe Glow', slug: 'luxe-glow', description: 'Premium Korean-inspired skincare' } }),
    prisma.brand.create({ data: { name: 'Velvet Rose', slug: 'velvet-rose', description: 'Luxury cosmetics for the modern woman' } }),
    prisma.brand.create({ data: { name: 'AuraVeda', slug: 'auraveda', description: 'Ayurvedic beauty solutions' } }),
    prisma.brand.create({ data: { name: 'GlowUp', slug: 'glowup', description: 'Trendy makeup for gen-z' } }),
    prisma.brand.create({ data: { name: 'SilkStrand', slug: 'silkstrand', description: 'Professional haircare' } }),
    prisma.brand.create({ data: { name: 'FragranceCo', slug: 'fragranceco', description: 'Designer-inspired fragrances' } })
  ]);
  console.log('🏷️ Brands created');

  // Create Products
  const products = await Promise.all([
    // Skincare Products
    prisma.product.create({
      data: {
        name: 'Hyaluronic Acid Serum',
        slug: 'hyaluronic-acid-serum',
        description: 'Intensely hydrating serum with pure hyaluronic acid. Plumps and moisturizes skin, reduces fine lines, and gives you a dewy, youthful glow. Suitable for all skin types.',
        shortDescription: 'Deep hydration serum for plump, glowing skin',
        price: 899,
        compareAtPrice: 1299,
        sku: 'SKC-HA-001',
        stock: 150,
        images: [
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
          'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300',
        ingredients: 'Hyaluronic Acid, Niacinamide, Vitamin E, Aloe Vera, Glycerin',
        howToUse: 'Apply 2-3 drops on clean, damp skin. Follow with moisturizer.',
        isFeatured: true,
        tags: ['hydrating', 'anti-aging', 'serum', 'bestseller'],
        avgRating: 4.5,
        reviewCount: 128,
        categoryId: categories[0].id,
        brandId: brands[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Vitamin C Brightening Cream',
        slug: 'vitamin-c-brightening-cream',
        description: 'Powerful brightening cream infused with 20% Vitamin C, turmeric extract, and saffron. Fades dark spots, evens skin tone, and reveals luminous skin.',
        shortDescription: 'Brighten and even out your skin tone',
        price: 1299,
        compareAtPrice: 1799,
        sku: 'SKC-VC-002',
        stock: 85,
        images: [
          'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600',
          'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=600'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300',
        ingredients: 'Vitamin C (L-Ascorbic Acid), Turmeric Extract, Saffron, Shea Butter',
        howToUse: 'Apply evenly on face and neck after serum. Use morning and night.',
        isFeatured: true,
        tags: ['brightening', 'vitamin-c', 'cream', 'dark-spots'],
        avgRating: 4.3,
        reviewCount: 95,
        categoryId: categories[0].id,
        brandId: brands[2].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Retinol Night Repair Serum',
        slug: 'retinol-night-repair-serum',
        description: 'Advanced night repair serum with encapsulated retinol. Boosts collagen production, reduces wrinkles, and renews skin while you sleep.',
        shortDescription: 'Anti-aging night serum with retinol',
        price: 1599,
        compareAtPrice: 2199,
        sku: 'SKC-RT-003',
        stock: 60,
        images: [
          'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=300',
        ingredients: 'Retinol 0.5%, Peptides, Squalane, Vitamin E, Jojoba Oil',
        howToUse: 'Apply at night after cleansing. Start with 2-3 times per week.',
        isFeatured: true,
        tags: ['retinol', 'anti-aging', 'night-care', 'premium'],
        avgRating: 4.7,
        reviewCount: 72,
        categoryId: categories[0].id,
        brandId: brands[0].id
      }
    }),

    // Makeup Products
    prisma.product.create({
      data: {
        name: 'Matte Velvet Lipstick - Rose Petal',
        slug: 'matte-velvet-lipstick-rose-petal',
        description: 'Ultra-creamy matte lipstick with a velvet finish. Long-lasting formula that stays comfortable all day. Enriched with shea butter for hydration.',
        shortDescription: 'Creamy matte lipstick with velvet finish',
        price: 599,
        compareAtPrice: 899,
        sku: 'MKP-LP-001',
        stock: 200,
        images: [
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600',
          'https://images.unsplash.com/photo-1631214540553-ff044a3ff1ea?w=600'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300',
        isFeatured: true,
        tags: ['lipstick', 'matte', 'bestseller', 'long-lasting'],
        avgRating: 4.6,
        reviewCount: 245,
        categoryId: categories[1].id,
        brandId: brands[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'HD Foundation - Natural Beige',
        slug: 'hd-foundation-natural-beige',
        description: 'Full-coverage HD foundation with a natural finish. Blurs imperfections, controls oil, and lasts up to 24 hours. Available in 20 shades.',
        shortDescription: 'Full-coverage foundation with natural finish',
        price: 1499,
        compareAtPrice: 1999,
        sku: 'MKP-FD-002',
        stock: 120,
        images: [
          'https://images.unsplash.com/photo-1631214540222-77b69b06b3e2?w=600'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1631214540222-77b69b06b3e2?w=300',
        isFeatured: true,
        tags: ['foundation', 'full-coverage', 'hd', 'long-lasting'],
        avgRating: 4.4,
        reviewCount: 180,
        categoryId: categories[1].id,
        brandId: brands[3].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Smokey Eye Palette - Midnight Glamour',
        slug: 'smokey-eye-palette-midnight-glamour',
        description: '12-shade eyeshadow palette with matte and shimmer finishes. Highly pigmented, blendable formula. Perfect for creating dramatic smokey eyes.',
        shortDescription: '12-shade palette for stunning smokey eyes',
        price: 1799,
        compareAtPrice: 2499,
        sku: 'MKP-EP-003',
        stock: 90,
        images: [
          'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300',
        isFeatured: true,
        tags: ['eyeshadow', 'palette', 'smokey', 'shimmer'],
        avgRating: 4.8,
        reviewCount: 156,
        categoryId: categories[1].id,
        brandId: brands[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Volumizing Mascara - Jet Black',
        slug: 'volumizing-mascara-jet-black',
        description: 'Dramatic volumizing mascara that adds 10x volume without clumping. Waterproof, smudge-proof formula lasts all day.',
        shortDescription: '10x volume waterproof mascara',
        price: 699,
        sku: 'MKP-MS-004',
        stock: 175,
        images: [
          'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=300',
        tags: ['mascara', 'volumizing', 'waterproof', 'eyes'],
        avgRating: 4.2,
        reviewCount: 198,
        categoryId: categories[1].id,
        brandId: brands[3].id
      }
    }),

    // Hair Care
    prisma.product.create({
      data: {
        name: 'Keratin Repair Shampoo',
        slug: 'keratin-repair-shampoo',
        description: 'Salon-quality keratin shampoo that repairs and strengthens damaged hair. Infused with argan oil and biotin for silky smooth results.',
        shortDescription: 'Professional keratin repair shampoo',
        price: 749,
        compareAtPrice: 999,
        sku: 'HC-SH-001',
        stock: 130,
        images: [
          'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300',
        ingredients: 'Keratin Protein, Argan Oil, Biotin, Collagen',
        howToUse: 'Massage into wet hair, lather, and rinse. Follow with conditioner.',
        isFeatured: true,
        tags: ['shampoo', 'keratin', 'repair', 'damaged-hair'],
        avgRating: 4.4,
        reviewCount: 167,
        categoryId: categories[2].id,
        brandId: brands[4].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Argan Oil Hair Serum',
        slug: 'argan-oil-hair-serum',
        description: 'Lightweight hair serum with pure Moroccan argan oil. Tames frizz, adds shine, and protects against heat damage.',
        shortDescription: 'Frizz-free shine with argan oil',
        price: 599,
        sku: 'HC-SR-002',
        stock: 110,
        images: [
          'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=300',
        tags: ['hair-serum', 'argan-oil', 'frizz-free', 'shine'],
        avgRating: 4.5,
        reviewCount: 134,
        categoryId: categories[2].id,
        brandId: brands[4].id
      }
    }),

    // Fragrances
    prisma.product.create({
      data: {
        name: 'Midnight Rose Eau de Parfum',
        slug: 'midnight-rose-eau-de-parfum',
        description: 'A captivating blend of Bulgarian rose, dark vanilla, and smoky oud. Long-lasting oriental fragrance for the confident woman.',
        shortDescription: 'Luxurious oriental fragrance with rose & oud',
        price: 2999,
        compareAtPrice: 4499,
        sku: 'FR-EDP-001',
        stock: 45,
        images: [
          'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600',
          'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300',
        isFeatured: true,
        tags: ['perfume', 'edp', 'luxury', 'rose', 'bestseller'],
        avgRating: 4.9,
        reviewCount: 89,
        categoryId: categories[3].id,
        brandId: brands[5].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Ocean Breeze Body Mist',
        slug: 'ocean-breeze-body-mist',
        description: 'Light and refreshing body mist with notes of sea salt, white jasmine, and crisp linen. Perfect for everyday wear.',
        shortDescription: 'Refreshing everyday body mist',
        price: 499,
        sku: 'FR-BM-002',
        stock: 200,
        images: [
          'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=300',
        tags: ['body-mist', 'fresh', 'everyday', 'light'],
        avgRating: 4.1,
        reviewCount: 225,
        categoryId: categories[3].id,
        brandId: brands[5].id
      }
    }),

    // Bath & Body
    prisma.product.create({
      data: {
        name: 'Rose & Honey Body Butter',
        slug: 'rose-honey-body-butter',
        description: 'Ultra-rich body butter with damask rose and manuka honey. Deeply nourishes and softens skin, leaving it silky smooth.',
        shortDescription: 'Deeply nourishing body butter',
        price: 849,
        compareAtPrice: 1199,
        sku: 'BB-BU-001',
        stock: 95,
        images: [
          'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=600'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=300',
        ingredients: 'Shea Butter, Rose Extract, Manuka Honey, Coconut Oil',
        tags: ['body-butter', 'rose', 'moisturizing', 'luxury'],
        avgRating: 4.6,
        reviewCount: 112,
        categoryId: categories[4].id,
        brandId: brands[2].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Lavender Dream Bath Salts',
        slug: 'lavender-dream-bath-salts',
        description: 'Relaxing bath salts infused with French lavender, dead sea minerals, and essential oils. Perfect for unwinding after a long day.',
        shortDescription: 'Aromatherapy bath salts with lavender',
        price: 649,
        sku: 'BB-BS-002',
        stock: 80,
        images: [
          'https://images.unsplash.com/photo-1600428877878-1a0ff561c8ef?w=600'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1600428877878-1a0ff561c8ef?w=300',
        tags: ['bath-salts', 'lavender', 'relaxation', 'aromatherapy'],
        avgRating: 4.3,
        reviewCount: 78,
        categoryId: categories[4].id,
        brandId: brands[2].id
      }
    }),

    // Nails
    prisma.product.create({
      data: {
        name: 'Gel Effect Nail Polish Set',
        slug: 'gel-effect-nail-polish-set',
        description: 'Set of 6 gel-effect nail polishes in trending colors. Chip-resistant, quick-drying formula with high-shine finish. No UV lamp needed.',
        shortDescription: '6-piece gel-effect nail polish set',
        price: 999,
        compareAtPrice: 1499,
        sku: 'NL-GP-001',
        stock: 70,
        images: [
          'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300',
        tags: ['nail-polish', 'gel-effect', 'set', 'trending'],
        avgRating: 4.4,
        reviewCount: 143,
        categoryId: categories[5].id,
        brandId: brands[3].id
      }
    })
  ]);
  console.log(`💄 ${products.length} products created`);

  // Create sample reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        userId: customer.id,
        productId: products[0].id,
        rating: 5,
        title: 'Best serum I have ever used!',
        comment: 'My skin has never looked better. The hyaluronic acid serum is incredibly hydrating and gives my skin a beautiful glow. I have been using it for 3 weeks and can already see a difference.',
        isVerified: true
      }
    }),
    prisma.review.create({
      data: {
        userId: customer.id,
        productId: products[3].id,
        rating: 4,
        title: 'Beautiful color, lasts all day',
        comment: 'The Rose Petal shade is absolutely gorgeous. It goes on smoothly and does not dry out my lips. Only giving 4 stars because it could be a bit more pigmented.',
        isVerified: true
      }
    })
  ]);
  console.log(`⭐ ${reviews.length} reviews created`);

  // Create Coupons
  await Promise.all([
    prisma.coupon.create({
      data: {
        code: 'WELCOME10',
        description: 'Get 10% off on your first order',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderValue: 499,
        maxDiscount: 200,
        usageLimit: 1000,
        isActive: true,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      }
    }),
    prisma.coupon.create({
      data: {
        code: 'GLAM20',
        description: 'Flat 20% off on orders above ₹1999',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minOrderValue: 1999,
        maxDiscount: 500,
        usageLimit: 500,
        isActive: true,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    }),
    prisma.coupon.create({
      data: {
        code: 'FLAT200',
        description: '₹200 off on orders above ₹999',
        discountType: 'FIXED',
        discountValue: 200,
        minOrderValue: 999,
        usageLimit: 300,
        isActive: true,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      }
    })
  ]);
  console.log('🎫 Coupons created');

  console.log('✅ Seed completed!');
  console.log('\n📋 Login Credentials:');
  console.log('Admin: admin@glamcart.com / Admin@123');
  console.log('Customer: customer@test.com / Customer@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
