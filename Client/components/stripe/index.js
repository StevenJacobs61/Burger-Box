import { loadStripe } from "@stripe/stripe-js";

export async function CheckOut({lineItems}, id, email){
	let stripePromise = null

	const getStripe = () => {
		if(!stripePromise) {
			stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
		};
		return stripePromise;
	};

	const stripe = await getStripe();

	const res = await stripe.redirectToCheckout({
		clientReferenceId: id,
		customerEmail:email,
		mode: 'payment',
		lineItems,
		successUrl: `http://localhost:3000/order/${id}`,
		cancelUrl: `http://localhost:3000/order/${id}`
	});
};
