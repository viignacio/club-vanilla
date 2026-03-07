import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

function invalidate(tag: string) {
  revalidateTag(tag, "max");
}

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const documentType = body._type as string | undefined;

    if (documentType === "page") {
      const slug = body.slug?.current as string | undefined;
      if (slug) {
        invalidate(`page-${slug}`);
      } else {
        invalidate("page-home");
        invalidate("page-menu");
        invalidate("page-parking");
        invalidate("page-recruit");
      }
    } else if (documentType === "dictionary") {
      invalidate("dictionary");
    } else if (documentType === "siteSettings") {
      invalidate("site-settings");
    } else {
      invalidate("page-home");
      invalidate("page-menu");
      invalidate("page-parking");
      invalidate("page-recruit");
      invalidate("dictionary");
      invalidate("site-settings");
    }

    return NextResponse.json({ revalidated: true, timestamp: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ message: "Error revalidating", error: String(err) }, { status: 500 });
  }
}
