import { getDictionary } from "@repo/internationalization";
import { SignupFormClient } from "../components/signup-form";

export default async function SignupPage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  const planInfo = {
    name: "Producer",
    tagline: "Best Value",
    description: "For beatmakers and career musicians. Sell 'Certified Human' beats at a premium.",
    price: "49",
  };

  return (
    <div className="w-full py-20 lg:py-40">
      <SignupFormClient dictionary={dictionary} locale={locale} plan={planInfo} />
    </div>
  );
}