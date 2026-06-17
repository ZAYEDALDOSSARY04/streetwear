require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const bcrypt = require('bcryptjs')

const adapter = new PrismaPg(process.env.DATABASE_URL)
const prisma = new PrismaClient({ adapter })

// Real Unsplash streetwear/fashion photos
const PHOTOS = {
  // Manama Drip products
  md001: [ // Chrome Reflective Bomber
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=720&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=720&fit=crop',
    'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&h=720&fit=crop',
  ],
  md002: [ // Techwear Cargo Pants
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=720&fit=crop',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=720&fit=crop',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=720&fit=crop',
  ],
  md003: [ // Matrix Mesh Top
    'https://images.unsplash.com/photo-1523398002811-999ca8deecb3?w=600&h=720&fit=crop',
    'https://images.unsplash.com/photo-1583743089695-4b816a340f82?w=600&h=720&fit=crop',
    'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=720&fit=crop',
  ],
  md004: [ // Modular Utility Vest
    'https://images.unsplash.com/photo-1544966503-7cc5ac882d05?w=600&h=720&fit=crop',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=720&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=720&fit=crop',
  ],
  // Riyadh Fits products
  rf001: [ // Silk Cargo Trousers
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=720&fit=crop',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=720&fit=crop',
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=720&fit=crop',
  ],
  rf002: [ // Alpha Tech Shell Jacket
    'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=600&h=720&fit=crop',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=720&fit=crop',
    'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&h=720&fit=crop',
  ],
  rf003: [ // Embossed Logo Tee
    'https://images.unsplash.com/photo-1583743089695-4b816a340f82?w=600&h=720&fit=crop',
    'https://images.unsplash.com/photo-1523398002811-999ca8deecb3?w=600&h=720&fit=crop',
    'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=720&fit=crop',
  ],
  rf004: [ // CORDURA Harness Bag
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=720&fit=crop',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=720&fit=crop',
    'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=600&h=720&fit=crop',
  ],
  // Shop logos & covers
  manamaLogo:  'https://images.unsplash.com/photo-1556821840-3a63f15732c8?w=200&h=200&fit=crop',
  manamacover: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&h=480&fit=crop',
  riyadhLogo:  'https://images.unsplash.com/photo-1523398002811-999ca8deecb3?w=200&h=200&fit=crop',
  riyadhCover: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=480&fit=crop',
}

async function main() {
  console.log('🌱 Seeding database...')

  // ── Users ──────────────────────────────────────────────────────
  const hash = (pw) => bcrypt.hash(pw, 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@streetmap.com' },
    update: {},
    create: {
      email: 'admin@streetmap.com',
      password: await hash('Admin1234!'),
      name: 'StreetMap Admin',
      role: 'ADMIN',
      emailVerified: true,
    },
  })

  const manamaOwner = await prisma.user.upsert({
    where: { email: 'manama@streetmap.com' },
    update: {},
    create: {
      email: 'manama@streetmap.com',
      password: await hash('Shop1234!'),
      name: 'Manama Drip Owner',
      role: 'SHOP_OWNER',
      emailVerified: true,
    },
  })

  const riyadhOwner = await prisma.user.upsert({
    where: { email: 'riyadh@streetmap.com' },
    update: {},
    create: {
      email: 'riyadh@streetmap.com',
      password: await hash('Shop1234!'),
      name: 'Riyadh Fits Owner',
      role: 'SHOP_OWNER',
      emailVerified: true,
    },
  })

  const customer = await prisma.user.upsert({
    where: { email: 'user@streetmap.com' },
    update: {},
    create: {
      email: 'user@streetmap.com',
      password: await hash('User1234!'),
      name: 'Demo Customer',
      role: 'CUSTOMER',
      emailVerified: true,
    },
  })

  console.log('✓ Users created')

  // ── Shop 1: Manama Drip ────────────────────────────────────────
  const manamaShop = await prisma.shop.upsert({
    where: { ownerId: manamaOwner.id },
    update: {},
    create: {
      name: 'Manama Drip',
      bio: "Born in the alleys of Manama, Manama Drip is Bahrain's first destination for Y2K and techwear. We source globally, curate locally, and ship everywhere.",
      city: 'Bahrain',
      country: 'Bahrain',
      currency: 'BHD',
      logoUrl: PHOTOS.manamaLogo,
      coverUrl: PHOTOS.manamacover,
      instagram: 'manamadrip',
      styleTags: ['Y2K', 'techwear'],
      status: 'APPROVED',
      ownerId: manamaOwner.id,
    },
  })

  const manamaProducts = [
    {
      name: 'Chrome Reflective Bomber',
      description: 'Holographic chrome-finish bomber jacket with ribbed cuffs and stand collar. A statement piece for Bahrain nights.',
      price: 38, currency: 'BHD', styleTags: ['Y2K'],
      photos: PHOTOS.md001,
      sizes: [{ label: 'S', stock: 3 }, { label: 'M', stock: 5 }, { label: 'L', stock: 2 }, { label: 'XL', stock: 1 }],
    },
    {
      name: 'Techwear Cargo Pants',
      description: 'Waterproof ripstop cargo pants with 8 utility pockets and adjustable cinch ankles.',
      price: 28, currency: 'BHD', styleTags: ['techwear'],
      photos: PHOTOS.md002,
      sizes: [{ label: 'S', stock: 4 }, { label: 'M', stock: 6 }, { label: 'L', stock: 3 }, { label: 'XL', stock: 2 }],
    },
    {
      name: 'Matrix Mesh Top',
      description: 'Semi-sheer mesh top with bold logo embroidery. Pairs with cargo or layers under a jacket.',
      price: 18, currency: 'BHD', styleTags: ['Y2K'],
      photos: PHOTOS.md003,
      sizes: [{ label: 'XS', stock: 2 }, { label: 'S', stock: 4 }, { label: 'M', stock: 5 }, { label: 'L', stock: 3 }],
    },
    {
      name: 'Modular Utility Vest',
      description: 'Multi-strap tactical vest with detachable pockets and MOLLE webbing. Function meets edge.',
      price: 22, currency: 'BHD', styleTags: ['techwear'],
      photos: PHOTOS.md004,
      sizes: [{ label: 'S', stock: 2 }, { label: 'M', stock: 4 }, { label: 'L', stock: 3 }, { label: 'XL', stock: 1 }],
    },
  ]

  for (const p of manamaProducts) {
    const existing = await prisma.product.findFirst({ where: { name: p.name, shopId: manamaShop.id } })
    if (!existing) {
      await prisma.product.create({
        data: {
          name: p.name, description: p.description, price: p.price,
          currency: p.currency, styleTags: p.styleTags, photos: p.photos,
          shopId: manamaShop.id,
          sizes: { create: p.sizes },
        },
      })
    }
  }
  console.log('✓ Manama Drip products created')

  // ── Shop 2: Riyadh Fits ────────────────────────────────────────
  const riyadhShop = await prisma.shop.upsert({
    where: { ownerId: riyadhOwner.id },
    update: {},
    create: {
      name: 'Riyadh Fits',
      bio: "Riyadh Fits is the Saudi capital's premium streetwear destination. We blend luxury aesthetics with techwear functionality for the modern Saudi street.",
      city: 'Riyadh',
      country: 'Saudi Arabia',
      currency: 'SAR',
      logoUrl: PHOTOS.riyadhLogo,
      coverUrl: PHOTOS.riyadhCover,
      instagram: 'riyadhfits',
      styleTags: ['luxury street', 'techwear'],
      status: 'APPROVED',
      ownerId: riyadhOwner.id,
    },
  })

  const riyadhProducts = [
    {
      name: 'Silk Cargo Trousers',
      description: 'Premium silk-blend cargo trousers with subtle sheen. Where luxury meets utility in the Saudi capital.',
      price: 220, currency: 'SAR', styleTags: ['luxury street'],
      photos: PHOTOS.rf001,
      sizes: [{ label: 'S', stock: 2 }, { label: 'M', stock: 4 }, { label: 'L', stock: 3 }, { label: 'XL', stock: 1 }],
    },
    {
      name: 'Alpha Tech Shell Jacket',
      description: 'Gore-Tex shell jacket with integrated balaclava hood, waterproof zippers and fully taped seams.',
      price: 380, currency: 'SAR', styleTags: ['techwear'],
      photos: PHOTOS.rf002,
      sizes: [{ label: 'S', stock: 1 }, { label: 'M', stock: 3 }, { label: 'L', stock: 2 }, { label: 'XL', stock: 1 }],
    },
    {
      name: 'Embossed Logo Tee',
      description: 'Egyptian cotton tee with tonal embossed Riyadh Fits monogram. Minimal, premium, understated.',
      price: 95, currency: 'SAR', styleTags: ['luxury street'],
      photos: PHOTOS.rf003,
      sizes: [{ label: 'XS', stock: 3 }, { label: 'S', stock: 5 }, { label: 'M', stock: 6 }, { label: 'L', stock: 4 }, { label: 'XL', stock: 2 }],
    },
    {
      name: 'CORDURA Harness Bag',
      description: 'CORDURA® chest harness with two zip compartments and molle loops.',
      price: 165, currency: 'SAR', styleTags: ['techwear'],
      photos: PHOTOS.rf004,
      sizes: [{ label: 'One Size', stock: 8 }],
    },
  ]

  for (const p of riyadhProducts) {
    const existing = await prisma.product.findFirst({ where: { name: p.name, shopId: riyadhShop.id } })
    if (!existing) {
      await prisma.product.create({
        data: {
          name: p.name, description: p.description, price: p.price,
          currency: p.currency, styleTags: p.styleTags, photos: p.photos,
          shopId: riyadhShop.id,
          sizes: { create: p.sizes },
        },
      })
    }
  }
  console.log('✓ Riyadh Fits products created')

  // ── Demo order ────────────────────────────────────────────────
  const product = await prisma.product.findFirst({ where: { shopId: manamaShop.id } })
  const existingOrder = await prisma.order.findFirst({ where: { customerId: customer.id } })
  if (!existingOrder && product) {
    await prisma.order.create({
      data: {
        customerId: customer.id,
        shopId: manamaShop.id,
        status: 'DELIVERED',
        totalAmount: product.price,
        platformFee: product.price * 0.1,
        shopEarnings: product.price * 0.9,
        stripePaymentId: 'pi_demo_001',
        shippingAddress: {
          name: 'Demo Customer',
          address: '123 Main St',
          city: 'Manama',
          country: 'Bahrain',
          phone: '+973 1234 5678',
        },
        items: {
          create: [{
            productId: product.id,
            size: 'M',
            quantity: 1,
            price: product.price,
          }],
        },
      },
    })
  }
  console.log('✓ Demo order created')
  console.log('\n✅ Seed complete!\n')
  console.log('Demo accounts:')
  console.log('  Admin:    admin@streetmap.com / Admin1234!')
  console.log('  Shop 1:   manama@streetmap.com / Shop1234!')
  console.log('  Shop 2:   riyadh@streetmap.com / Shop1234!')
  console.log('  Customer: user@streetmap.com / User1234!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
