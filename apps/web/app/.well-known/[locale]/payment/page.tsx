import { getDictionary } from "@repo/internationalization";
import { EmbeddedCheckoutForm } from "../components/embedded-checkout";

export default async function PaymentPage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <div className="container mx-auto max-w-3xl py-20 px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          {dictionary.web?.payment?.title || "Complete your Payment"}
        </h1>
        <p className="text-muted-foreground">
          {dictionary.web?.payment?.description || "Final step to process your files."}
        </p>
      </div>

      <EmbeddedCheckoutForm locale={locale} />
    </div>
  );
}   