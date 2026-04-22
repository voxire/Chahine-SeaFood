import { getTranslations } from "next-intl/server";

import { ScrollStage } from "@/components/motion/ScrollStage";
import { Pinned } from "@/components/motion/Pinned";
import { menuImage } from "@/lib/menuImage";
import { SignatureDishScene } from "./SignatureDishScene";

/**
 * Signature Dish — the scroll-pinned storytelling beat of the home page.
 *
 * The server component fetches every string up front so the initial HTML
 * includes the heading, body, image placeholder, and three callouts. The
 * `SignatureDishScene` client island then drives the scroll-linked
 * reveal off the ScrollStage progress MotionValue.
 *
 * Runway is 180vh — tall enough for the three callouts to fan in one
 * after another, short enough not to dominate the home page's scroll
 * depth. Mobile keeps the same runway (the callouts reposition closer
 * to the image) so the choreography doesn't break on narrow viewports.
 */
export async function SignatureDish() {
  const t = await getTranslations("signatureDish");

  return (
    <ScrollStage
      id="signature"
      height="180vh"
      className="bg-cs-bg"
    >
      <Pinned align="top">
        <SignatureDishScene
          plain={t("plain")}
          pill={t("pill")}
          description={t("description")}
          cta={t("cta")}
          imagePlaceholder={t("imagePlaceholder")}
          imageSrc={menuImage("sandwiches", "crispy-fillet") ?? undefined}
          callouts={{
            bread: t("callouts.bread"),
            fish: t("callouts.fish"),
            sauce: t("callouts.sauce"),
          }}
        />
      </Pinned>
    </ScrollStage>
  );
}
