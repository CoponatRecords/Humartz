import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {apiVersion: "2025-12-15.clover" // Ensure this is a recent version
});

export async function POST(req: Request) {
  try {
    const { locale } = await req.json();

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded', // Crucial for Option 2
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "File Processing",
            },
            unit_amount: 1500, // €15.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ client_secret: session.client_secret });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}