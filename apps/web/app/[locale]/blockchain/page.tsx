// app/arbitrum/page.tsx
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import {ArbitrumForm} from "../components/arbitrum-form";
import { getDictionary } from "@repo/internationalization";

type ArbitrumPageProps = {
  params: Promise<{ locale: string }>;
};

export const generateMetadata = async ({ params }: ArbitrumPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata(dictionary.web.arbitrum.meta);
};

const ArbitrumPage = async ({ params }: ArbitrumPageProps) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
    return <ArbitrumForm dictionary={dictionary} />;

};

export default ArbitrumPage;
