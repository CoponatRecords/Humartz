import { NextResponse } from "next/server";
import Stripe from "stripe";
import argon2 from "argon2";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  try {
    const { locale, email, name, password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    // 1. HASH WITH ARGON2
    // Argon2 automatically handles salting and is extremely robust.
    const hashedPassword = await argon2.hash(password);

    // 2. CREATE STRIPE SESSION
    // We store the robust Argon2 hash in Stripe's metadata.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1SvGGpEM5GFTN4U125i2moRe",
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/signup`,
      
      metadata: {
        userName: name,
        userEmail: email,
        userPasswordHash: hashedPassword, // Storing the Argon2 string
        planType: "Producer"
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}