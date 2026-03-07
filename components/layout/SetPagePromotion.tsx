"use client";

import { useEffect } from "react";
import { usePromotionContext } from "./PromotionProvider";

export default function SetPagePromotion({ show }: { show: boolean }) {
  const { setShowForPage } = usePromotionContext();

  useEffect(() => {
    setShowForPage(show);
    return () => setShowForPage(false);
  }, [show, setShowForPage]);

  return null;
}
