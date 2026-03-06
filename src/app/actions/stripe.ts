'use server'

import { stripe } from '../../lib/stripe'
import { PRODUCTS } from '../../lib/products'

export interface SponsorData {
  title: string
  description: string
  websiteUrl: string
  email: string
}

export async function startCheckoutSession(productId: string, sponsorData?: SponsorData) {
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer_email: sponsorData?.email,
    metadata: sponsorData ? {
      sponsor_title: sponsorData.title,
      sponsor_description: sponsorData.description,
      sponsor_website: sponsorData.websiteUrl,
      sponsor_email: sponsorData.email,
    } : undefined,
  })

  return session.client_secret
}
