import { client } from "@/sanity/lib/client";
import { pageQuery } from "@/sanity/lib/queries";
import { Page } from "@/lib/types/page";

export async function getPage(slug: string): Promise<Page | null> {
  return client.fetch(
    pageQuery,
    { slug },
    { next: { revalidate: 60, tags: [`page-${slug}`] } }
  );
}
