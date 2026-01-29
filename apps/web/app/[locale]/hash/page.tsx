import { getDictionary } from "@repo/internationalization";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { HashRegistryForm } from "./components/hash-form";

type HashProps = {
  params: Promise<{ locale: string }>;
};

export const generateMetadata = async ({ params }: HashProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  // Assuming your dictionary has a hash section
  return createMetadata(dictionary.web.hash?.meta || { title: "Hash Registry" });
};

const HashPage = async ({ params }: HashProps) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <main className="container mx-auto py-10">
      <HashRegistryForm dictionary={dictionary} />
    </main>
  );
};

export default HashPage;