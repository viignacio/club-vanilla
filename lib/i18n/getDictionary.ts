import { client } from "@/sanity/lib/client";
import { dictionaryQuery } from "@/sanity/lib/queries";
import { Dictionary, Lang } from "@/lib/types/i18n";

interface DictionaryEntry {
  key: string;
  en?: string;
  ja?: string;
}

interface DictionaryData {
  entries?: DictionaryEntry[];
}

export async function getDictionary(lang: Lang): Promise<Dictionary> {
  const data: DictionaryData | null = await client.fetch(
    dictionaryQuery,
    {},
    { next: { revalidate: 3600, tags: ["dictionary"] } }
  );

  if (!data?.entries) return {};

  return data.entries.reduce<Dictionary>((acc, entry) => {
    if (entry.key) {
      acc[entry.key] = entry[lang] ?? entry.en ?? "";
    }
    return acc;
  }, {});
}
