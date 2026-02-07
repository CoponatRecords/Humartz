import { getDictionary } from "@repo/internationalization";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import {FileManagerClient} from "../components/file-manager";

type FilesProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: FilesProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  // You can use dictionary.web.files.meta if you add it later
  // For now we use a fallback or the title directly
  return createMetadata({
    title: dictionary.web?.upload?.files?.title,
    description: dictionary.web?.upload?.files?.description
  });
};

const Files = async ({ params }: FilesProps) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return <FileManagerClient dictionary={dictionary} locale={locale} />;
};

export default Files;