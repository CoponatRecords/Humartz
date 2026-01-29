// app/arbitrum/page.tsx
import { getDictionary } from "@repo/internationalization";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import {ArbitrumForm} from "../components/arbitrum-form";

type ArbitrumProps = {
  params: Promise<{
    locale: string;
  }>;
};

// ✅ Server-side metadata generation
export const generateMetadata = async ({
  params,
}: ArbitrumProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata(dictionary.web.arbitrum.meta);
};

// ✅ Server component wrapping the client form
const ArbitrumPage = async ({ params }: ArbitrumProps) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return <ArbitrumForm dictionary={dictionary.web.arbitrum} />;
};

export default ArbitrumPage;
