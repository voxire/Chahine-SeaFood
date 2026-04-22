import { getTranslations } from "next-intl/server";

import { Pinned } from "@/components/motion/Pinned";
import { ScrollStage } from "@/components/motion/ScrollStage";
import { StoryStripScene } from "./StoryStripScene";

/**
 * Story strip — the pinned split storytelling beat of the home page.
 *
 * Server component: pulls every string through `getTranslations` so the
 * heading, body, and chapter labels all live in the initial HTML (SEO
 * and the no-JS pass both see the copy). Hands them to the client
 * `<StoryStripScene>` which drives the scroll-linked reveal off the
 * ScrollStage progress MotionValue.
 *
 * Runway is 160vh — enough for the photo strip on the right to cycle
 * through three chapters while the text column stays anchored on the
 * left. Same visual grammar as the Signature Dish beat above, with the
 * split flipped horizontally.
 */
export async function StoryStrip() {
  const t = await getTranslations("story");

  return (
    <ScrollStage id="story" height="160vh" className="bg-cs-bg">
      <Pinned align="center">
        <StoryStripScene
          plain={t("plain")}
          pill={t("pill")}
          body={t("body")}
          cta={t("cta")}
          chapters={{
            est: t("chapters.est"),
            daily: t("chapters.daily"),
            reach: t("chapters.reach"),
          }}
        />
      </Pinned>
    </ScrollStage>
  );
}
