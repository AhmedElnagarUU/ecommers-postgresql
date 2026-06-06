import Stripe from 'stripe';
import logger from '../../config/logger';

export class StripePayment {
  private stripe: Stripe;

  constructor() {
    const apiKey = process.env.STRIPE_SECRET_KEY || '';
    this.stripe = new Stripe(apiKey, { apiVersion: '2025-10-29.clover' });
  }

  async createCheckoutSession(product: { name: string; price: number; currency?: string }) {
    logger.info('StripePayment.createCheckoutSession');
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: product.currency || 'usd',
            product_data: { name: product.name },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });
    return { sessionId: session.id, url: session.url };
  }
}
