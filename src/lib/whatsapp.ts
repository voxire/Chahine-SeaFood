// Single source of truth for WhatsApp deep-links. See CLAUDE.md §11.
// Never hand-assemble a wa.me URL anywhere else in the codebase.

type OrderItem = {
  name: string;
  qty: number;
  price?: number; // in LBP pounds, integer
};

type BuildOrderLinkOpts = {
  branchPhone: string; // E.164 without the leading "+", e.g. "96178905282"
  branchName: string;
  items: OrderItem[];
  locale: "en" | "ar";
};

export function buildOrderLink(opts: BuildOrderLinkOpts): string {
  const header =
    opts.locale === "ar" ? `مرحبا! أود طلب:\n` : `Hi! I'd like to order:\n`;

  const lines = opts.items
    .map((i) => {
      const pricePart = i.price ? ` — ${i.price.toLocaleString()} LL` : "";
      return `• ${i.name} × ${i.qty}${pricePart}`;
    })
    .join("\n");

  const footer =
    opts.locale === "ar"
      ? `\nمن فرع: ${opts.branchName}`
      : `\nFrom: ${opts.branchName}`;

  const text = encodeURIComponent(header + lines + footer);
  return `https://wa.me/${opts.branchPhone}?text=${text}`;
}

/** For "Contact this branch" buttons with no pre-filled items. */
export function buildContactLink(branchPhone: string): string {
  return `https://wa.me/${branchPhone}`;
}
