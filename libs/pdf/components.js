import fs from "node:fs";
import path from "node:path";
import { Fixed, Svg, Text, View } from "@formepdf/react";
import { company } from "@/libs/documentFormat";

export {
  company,
  formatCurrency,
  formatDate,
  formatProjectType,
} from "@/libs/documentFormat";

// Brand tokens (mirrors tailwind.config.js `brand` palette)
export const colors = {
  ink: "#202925",
  inkSoft: "#4A524D",
  muted: "#7A807B",
  chalk: "#F4F1EA",
  chalkDeep: "#EDE9E0",
  stone: "#D8D2C6",
  line: "#E6E1D7",
  olive: "#4D5B4B",
  oliveDark: "#3E4A3C",
  clay: "#A65B43",
  clayLight: "#C48A6A",
  white: "#FFFFFF",
  red: "#B42318",
  redBg: "#FDF0EE",
  green: "#2F6B3F",
  greenBg: "#EEF5EF",
};

const FONT_DIR = path.join(process.cwd(), "libs", "pdf", "fonts");
const FONT_FILES = [
  { file: "Satoshi-Regular.ttf", fontWeight: 400, fontStyle: "normal" },
  { file: "Satoshi-Medium.ttf", fontWeight: 500, fontStyle: "normal" },
  { file: "Satoshi-Bold.ttf", fontWeight: 700, fontStyle: "normal" },
  { file: "Satoshi-Italic.ttf", fontWeight: 400, fontStyle: "italic" },
];

let cachedFonts = null;

// Satoshi is shipped as TrueType (converted from the site's OTF files) so it
// embeds cleanly in every PDF viewer. The GSUB table is stripped: Forme emits
// ligature glyphs without a Unicode mapping, which breaks copy/search ("ft").
export const getFonts = () => {
  if (!cachedFonts) {
    cachedFonts = FONT_FILES.map(({ file, fontWeight, fontStyle }) => ({
      family: "Satoshi",
      src: new Uint8Array(fs.readFileSync(path.join(FONT_DIR, file))),
      fontWeight,
      fontStyle,
    }));
  }
  return cachedFonts;
};

export const baseTextStyle = {
  fontFamily: "Satoshi",
  fontSize: 9.5,
  lineHeight: 1.45,
  color: colors.ink,
};

export const PAGE_MARGIN = { top: 44, right: 48, bottom: 64, left: 48 };

// Forme <Text> only accepts string children
export const str = (value) =>
  value === null || value === undefined ? "" : String(value);

export const BrandMark = ({ size = 30 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    content={
      '<path d="M3 21v-8.5a9 9 0 0 1 18 0V21" stroke="#4D5B4B" stroke-width="1.6" stroke-linecap="round" fill="none"/>' +
      '<path d="M8 21v-8a4 4 0 0 1 8 0v8z" fill="#C48A6A"/>' +
      '<path d="M2 21h20" stroke="#4D5B4B" stroke-width="1.6" stroke-linecap="round"/>'
    }
  />
);

/**
 * Top-of-document band: brand on the left, document type and reference
 * details on the right.
 */
export const DocumentHeader = ({ label, reference, meta = [], badge }) => (
  <View wrap={false} style={{ marginBottom: 26 }}>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingBottom: 18,
        borderBottomWidth: 2,
        borderBottomColor: colors.olive,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <BrandMark size={34} />
        <View>
          <Text
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: colors.ink,
              letterSpacing: -0.2,
            }}
          >
            {company.name}
          </Text>
          <Text style={{ fontSize: 8, color: colors.muted, marginTop: 1 }}>
            {company.tagline}
          </Text>
        </View>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: colors.olive,
            letterSpacing: 3,
          }}
        >
          {label}
        </Text>
        {reference ? (
          <Text
            style={{ fontSize: 10, fontWeight: 500, color: colors.inkSoft }}
          >
            {reference}
          </Text>
        ) : null}
        {badge ? <View style={{ marginTop: 6 }}>{badge}</View> : null}
      </View>
    </View>
    {meta.length > 0 ? (
      <View
        style={{
          flexDirection: "row",
          backgroundColor: colors.chalk,
          borderRadius: 4,
          paddingVertical: 10,
          paddingHorizontal: 14,
          marginTop: 14,
          gap: 16,
        }}
      >
        {meta.map((item) => (
          <View key={item.label} style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 7,
                fontWeight: 700,
                color: colors.muted,
                letterSpacing: 0.8,
                textTransform: "uppercase",
              }}
            >
              {item.label}
            </Text>
            <Text
              style={{
                fontSize: 9.5,
                fontWeight: 500,
                color: item.color || colors.ink,
                marginTop: 2,
              }}
            >
              {str(item.value)}
            </Text>
          </View>
        ))}
      </View>
    ) : null}
  </View>
);

/** Repeats on every page: document reference + page count. */
export const PageFooter = ({ left }) => (
  <Fixed position="footer" style={{ paddingTop: 14 }}>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 0.75,
        borderTopColor: colors.stone,
        paddingTop: 8,
      }}
    >
      <Text style={{ ...baseTextStyle, fontSize: 7.5, color: colors.muted }}>
        {left}
      </Text>
      <Text style={{ ...baseTextStyle, fontSize: 7.5, color: colors.muted }}>
        {"Page {{pageNumber}} of {{totalPages}}"}
      </Text>
    </View>
  </Fixed>
);

export const Eyebrow = ({ children, color = colors.clay, style }) => (
  <Text
    style={{
      fontSize: 7.5,
      fontWeight: 700,
      color,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      ...style,
    }}
  >
    {children}
  </Text>
);

/**
 * Section heading. Rendered unbreakable so a heading is never stranded at the
 * bottom of a page without content beneath it (pass `keepWith` to glue the
 * first block of content to the title).
 */
export const SectionTitle = ({ eyebrow, title, keepWith, style }) => (
  <View wrap={false} style={{ marginTop: 22, ...style }}>
    {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
    <Text
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: colors.ink,
        marginTop: eyebrow ? 2 : 0,
        marginBottom: 10,
      }}
    >
      {title}
    </Text>
    {keepWith || null}
  </View>
);

/** Label / value rows inside a card. */
export const InfoCard = ({ title, rows, style }) => {
  const visible = rows.filter((row) => row.value);
  return (
    <View
      wrap={false}
      style={{
        flex: 1,
        borderWidth: 0.75,
        borderColor: colors.line,
        borderRadius: 4,
        padding: 12,
        ...style,
      }}
    >
      <Eyebrow color={colors.olive} style={{ marginBottom: 6 }}>
        {title}
      </Eyebrow>
      {visible.length === 0 ? (
        <Text style={{ color: colors.muted }}>—</Text>
      ) : (
        visible.map((row) => (
          <View key={row.label} style={{ flexDirection: "row", marginTop: 3 }}>
            <Text style={{ width: 62, color: colors.muted, fontSize: 8.5 }}>
              {row.label}
            </Text>
            <Text style={{ flex: 1, fontSize: 9, color: colors.ink }}>
              {str(row.value)}
            </Text>
          </View>
        ))
      )}
    </View>
  );
};

/** Paragraphs from free text, preserving the author's line breaks. */
export const Paragraphs = ({ text, style }) => (
  <View>
    {str(text)
      .split(/\n{2,}/)
      .map((para) => para.trim())
      .filter(Boolean)
      .map((para, i) => (
        <Text
          key={i}
          style={{
            color: colors.inkSoft,
            marginBottom: 5,
            minOrphanLines: 2,
            minWidowLines: 2,
            ...style,
          }}
        >
          {para}
        </Text>
      ))}
  </View>
);

/** Right-aligned totals block. */
export const TotalsBox = ({ rows, grandLabel, grandValue, children }) => (
  <View
    wrap={false}
    style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 14 }}
  >
    <View style={{ width: 250 }}>
      {rows.map((row) => (
        <View
          key={row.label}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 5,
            borderBottomWidth: 0.75,
            borderBottomColor: colors.line,
          }}
        >
          <Text style={{ color: colors.inkSoft }}>{row.label}</Text>
          <Text style={{ fontWeight: 500 }}>{row.value}</Text>
        </View>
      ))}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: colors.olive,
          borderRadius: 4,
          paddingVertical: 9,
          paddingHorizontal: 12,
          marginTop: 8,
        }}
      >
        <Text style={{ color: colors.white, fontWeight: 700, fontSize: 10.5 }}>
          {grandLabel}
        </Text>
        <Text style={{ color: colors.white, fontWeight: 700, fontSize: 14 }}>
          {grandValue}
        </Text>
      </View>
      {children}
    </View>
  </View>
);

export const Pill = ({ label, color, background }) => (
  <View
    style={{
      backgroundColor: background,
      borderRadius: 8,
      paddingVertical: 2,
      paddingHorizontal: 7,
    }}
  >
    <Text
      style={{
        fontSize: 7,
        fontWeight: 700,
        color,
        letterSpacing: 0.8,
        textTransform: "uppercase",
      }}
    >
      {label}
    </Text>
  </View>
);
