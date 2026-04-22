type Props = {
  /** One or more schema.org objects to emit as JSON-LD. */
  data: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * Renders one or more `<script type="application/ld+json">` blocks inline.
 * Server-component only — no client JS required. Pass a single object or
 * an array; each becomes its own script tag.
 *
 * The JSON is serialized with `JSON.stringify` and closing-bracket-escaped
 * to prevent `</script>` injection from any dynamic string values.
 */
export function StructuredData({ data }: Props) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Escape "</" inside values so the serialized JSON can't close the
          // <script> tag early.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(obj).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
