import Cors from "cors";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { any } from "zod";

const cors = Cors({
  origin: "https://ts-client-e-commerce.vercel.app", // Replace this with the appropriate origin for your frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

export default async function POST(
  req: Request,
  res: Response,
  { params }: { params: { storeId: string } }
) {
  // Use the CORS middleware for all incoming requests
  await runMiddleware(req, res, cors);

  if (req.method === "OPTIONS") {
    return NextResponse.json({});
  } else if (req.method === "POST") {
    return POST1(req, res, { params });
  } else {
    return NextResponse.json({ error: "Method Not Allowed" });
  }
}

async function runMiddleware(req: Request, res: Response, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

async function POST1(
  req: Request,
  res: Response,
  { params }: { params: { storeId: string } }
) {
  // const { params } = req.query;
  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return NextResponse.json({ error: "Product IDs are required" });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const line_items = products.map((product) => ({
    quantity: 1,
    price_data: {
      currency: "USD",
      product_data: {
        name: product.name,
      },
      unit_amount: product.price.toNumber() * 100,
    },
  }));

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId as string,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  try {
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session creation error:", error);
    return NextResponse.json({ error: "Error creating Stripe session" });
  }
}

// export async function OPTIONS() {
//   return NextResponse.json({}, { headers: corsHeaders });
// }

// export async function POST(
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) {
//   const { productIds } = await req.json();

//   if (!productIds || productIds.length === 0) {
//     return new NextResponse("Product IDs are required", { status: 400 });
//   }

//   const products = await prismadb.product.findMany({
//     where: {
//       id: {
//         in: productIds,
//       },
//     },
//   });

//   const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

//   products.forEach((product) => {
//     line_items.push({
//       quantity: 1,
//       price_data: {
//         currency: "USD",
//         product_data: {
//           name: product.name,
//         },
//         unit_amount: product.price.toNumber() * 100,
//       },
//     });
//   });

//   const order = await prismadb.order.create({
//     data: {
//       storeId: params.storeId,
//       isPaid: false,
//       orderItems: {
//         create: productIds.map((productId: string) => ({
//           product: {
//             connect: {
//               id: productId,
//             },
//           },
//         })),
//       },
//     },
//   });

//   const session = await stripe.checkout.sessions.create({
//     line_items,
//     mode: "payment",
//     billing_address_collection: "required",
//     phone_number_collection: {
//       enabled: true,
//     },
//     success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
//     cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
//     metadata: {
//       orderId: order.id,
//     },
//   });

//   return NextResponse.json({ url: session.url }, { headers: corsHeaders });
// }
