import { Cell, Document, Page, Row, Table, Text, View } from "@formepdf/react";
import { businessFacts } from "@/libs/businessFacts";
import {
  DEFAULT_LEAD_TIME,
  DEFAULT_PAYMENT_TERMS,
  calculateQuoteTotals,
  quoteCategoryTotal,
  quoteTermsSections,
} from "@/libs/quoteTerms";
import {
  Eyebrow,
  DocumentHeader,
  InfoCard,
  PAGE_MARGIN,
  PageFooter,
  Paragraphs,
  SectionTitle,
  TotalsBox,
  baseTextStyle,
  colors,
  company,
  formatCurrency,
  formatDate,
  formatProjectType,
  getFonts,
  str,
} from "./components";

const COLUMNS = [
  { width: { fraction: 0.55 } },
  { width: { fraction: 0.13 } },
  { width: { fraction: 0.16 } },
  { width: { fraction: 0.16 } },
];

const cellPad = { paddingVertical: 7, paddingHorizontal: 8 };
const headCell = { ...cellPad, paddingVertical: 5 };
const headText = {
  fontSize: 7,
  fontWeight: 700,
  color: colors.muted,
  letterSpacing: 0.8,
  textTransform: "uppercase",
};

const HeadingBlock = ({ service, first }) => (
  <View
    wrap={false}
    style={{
      borderLeftWidth: 3,
      borderLeftColor: colors.clay,
      backgroundColor: colors.chalk,
      paddingVertical: 9,
      paddingHorizontal: 12,
      marginTop: first ? 0 : 14,
      marginBottom: 2,
    }}
  >
    <Text style={{ fontSize: 11.5, fontWeight: 700 }}>
      {str(service.headingText)}
    </Text>
    {service.headingDescription ? (
      <Text style={{ color: colors.inkSoft, marginTop: 3, fontSize: 9 }}>
        {str(service.headingDescription)}
      </Text>
    ) : null}
  </View>
);

// Each category is its own table. Both header rows (category name + column
// labels) repeat automatically when the table continues onto a new page, and
// individual rows never split across pages.
const CategoryTable = ({ service, first }) => (
  <Table columns={COLUMNS} style={{ marginTop: first ? 0 : 14 }}>
    <Row header style={{ backgroundColor: colors.olive }}>
      <Cell colSpan={3} style={{ paddingVertical: 7, paddingHorizontal: 8 }}>
        <Text style={{ color: colors.white, fontWeight: 700, fontSize: 10.5 }}>
          {str(service.categoryName)}
        </Text>
      </Cell>
      <Cell style={{ paddingVertical: 7, paddingHorizontal: 8 }}>
        <Text
          style={{
            color: colors.white,
            fontWeight: 700,
            fontSize: 10.5,
            textAlign: "right",
          }}
        >
          {formatCurrency(quoteCategoryTotal(service))}
        </Text>
      </Cell>
    </Row>
    <Row header style={{ backgroundColor: colors.chalk }}>
      <Cell style={headCell}>
        <Text style={headText}>Item</Text>
      </Cell>
      <Cell style={headCell}>
        <Text style={{ ...headText, textAlign: "right" }}>Qty</Text>
      </Cell>
      <Cell style={headCell}>
        <Text style={{ ...headText, textAlign: "right" }}>Unit price</Text>
      </Cell>
      <Cell style={headCell}>
        <Text style={{ ...headText, textAlign: "right" }}>Total</Text>
      </Cell>
    </Row>
    {(service.items || []).map((item, i) => {
      const rowStyle = {
        ...cellPad,
        borderBottomWidth: 0.75,
        borderBottomColor: colors.line,
      };
      return (
        <Row key={i}>
          <Cell style={rowStyle}>
            <Text style={{ fontWeight: 500 }}>{str(item.name)}</Text>
            {item.description ? (
              <Text
                style={{ fontSize: 8.5, color: colors.inkSoft, marginTop: 2 }}
              >
                {str(item.description)}
              </Text>
            ) : null}
            {item.notes ? (
              <Text style={{ fontSize: 8, color: colors.clay, marginTop: 3 }}>
                {`Note: ${item.notes}`}
              </Text>
            ) : null}
          </Cell>
          <Cell style={rowStyle}>
            <Text style={{ textAlign: "right", color: colors.inkSoft }}>
              {`${str(item.quantity)} ${str(item.unit)}`.trim()}
            </Text>
          </Cell>
          <Cell style={rowStyle}>
            <Text style={{ textAlign: "right", color: colors.inkSoft }}>
              {formatCurrency(item.customerUnitPrice || item.unitPrice)}
            </Text>
          </Cell>
          <Cell style={rowStyle}>
            <Text style={{ textAlign: "right", fontWeight: 700 }}>
              {formatCurrency(item.customerTotal || item.total)}
            </Text>
          </Cell>
        </Row>
      );
    })}
  </Table>
);

const KeyTerm = ({ title, text }) => (
  <View
    style={{
      flex: 1,
      backgroundColor: colors.chalk,
      borderRadius: 4,
      padding: 12,
    }}
  >
    <Eyebrow color={colors.olive} style={{ marginBottom: 5 }}>
      {title}
    </Eyebrow>
    <Text style={{ fontSize: 8.5, color: colors.inkSoft }}>{text}</Text>
  </View>
);

const TermsSection = ({ section }) => {
  const small = { fontSize: 8.5, color: colors.inkSoft };
  const first =
    section.intro || section.paragraphs?.[0] || section.bullets?.[0];
  return (
    <View style={{ marginBottom: 10 }}>
      {/* Title is glued to its first line of content */}
      <View wrap={false}>
        <Text style={{ fontSize: 9.5, fontWeight: 700, marginBottom: 3 }}>
          {section.title}
        </Text>
        {section.intro ? (
          <Text style={{ ...small, marginBottom: 3 }}>{section.intro}</Text>
        ) : null}
        {!section.intro && section.paragraphs ? (
          <Text style={{ ...small, marginBottom: 4 }}>{first}</Text>
        ) : null}
        {!section.intro && !section.paragraphs && section.bullets ? (
          <Bullet text={first} />
        ) : null}
      </View>
      {(section.paragraphs || []).slice(section.intro ? 0 : 1).map((p, i) => (
        <Text
          key={i}
          style={{
            ...small,
            marginBottom: 4,
            minOrphanLines: 2,
            minWidowLines: 2,
          }}
        >
          {p}
        </Text>
      ))}
      {(section.bullets || [])
        .slice(section.intro || section.paragraphs ? 0 : 1)
        .map((b, i) => (
          <Bullet key={i} text={b} />
        ))}
    </View>
  );
};

const Bullet = ({ text }) => (
  <View wrap={false} style={{ flexDirection: "row", marginBottom: 2.5 }}>
    <Text style={{ width: 10, fontSize: 8.5, color: colors.clay }}>•</Text>
    <Text style={{ flex: 1, fontSize: 8.5, color: colors.inkSoft }}>
      {text}
    </Text>
  </View>
);

export const QuoteDocument = ({ quote }) => {
  const totals = calculateQuoteTotals(quote);
  const reference = quote.quoteNumber || str(quote._id || quote.id);
  const services = quote.services || [];
  const client = quote.client || {};
  const issued = quote.sentAt || quote.createdAt;

  return (
    <Document
      title={`Quote ${reference} – ${company.name}`}
      author={company.name}
      subject={quote.title || "Quote"}
      lang="en-GB"
      fonts={getFonts()}
      style={baseTextStyle}
    >
      <Page size="A4" margin={PAGE_MARGIN}>
        <PageFooter
          left={`${company.name} · Quote ${reference} · ${company.website}`}
        />

        <DocumentHeader
          label="QUOTE"
          reference={`No. ${reference}`}
          meta={[
            { label: "Issued", value: formatDate(issued) || "—" },
            {
              label: "Valid until",
              value: formatDate(quote.validUntil) || "30 days from issue",
            },
            {
              label: "Project type",
              value: formatProjectType(quote.projectType) || "—",
            },
            { label: "Duration", value: quote.estimatedDuration || "—" },
          ]}
        />

        {quote.title ? (
          <Text
            style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 12,
              letterSpacing: -0.2,
            }}
          >
            {quote.title}
          </Text>
        ) : null}

        <View style={{ flexDirection: "row", gap: 12 }}>
          <InfoCard
            title="Prepared for"
            rows={[
              { label: "Name", value: client.name },
              { label: "Email", value: client.email },
              { label: "Phone", value: client.phone },
              { label: "Address", value: client.address },
              { label: "Postcode", value: client.postcode },
            ]}
          />
          <InfoCard
            title="Project"
            rows={[
              { label: "Site", value: quote.projectAddress },
              {
                label: "Start date",
                value: formatDate(quote.startDate),
              },
              { label: "Duration", value: quote.estimatedDuration },
            ]}
          />
        </View>

        {quote.projectDescription ? (
          <View>
            <SectionTitle eyebrow="Overview" title="Project description" />
            <Paragraphs text={quote.projectDescription} />
          </View>
        ) : null}

        {services.length > 0 ? (
          <View>
            <SectionTitle eyebrow="Scope of work" title="Services & costs" />
            {services.map((service, i) =>
              service.type === "heading" ? (
                <HeadingBlock key={i} service={service} first={i === 0} />
              ) : (
                <CategoryTable key={i} service={service} first={i === 0} />
              ),
            )}
          </View>
        ) : null}

        <TotalsBox
          rows={[
            {
              label: "Services subtotal",
              value: formatCurrency(totals.subtotal),
            },
            {
              label: `VAT (${totals.vatRate}%)`,
              value: formatCurrency(totals.vat),
            },
          ]}
          grandLabel="Total (inc. VAT)"
          grandValue={formatCurrency(totals.total)}
        >
          {quote.pricing?.depositRequired ? (
            <View
              style={{
                marginTop: 8,
                borderWidth: 0.75,
                borderColor: colors.clayLight,
                borderRadius: 4,
                paddingVertical: 8,
                paddingHorizontal: 12,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontWeight: 700, color: colors.clay }}>
                  Deposit to book
                </Text>
                <Text style={{ fontWeight: 700, color: colors.clay }}>
                  {formatCurrency(quote.pricing.depositAmount || 0)}
                </Text>
              </View>
              <Text
                style={{ fontSize: 7.5, color: colors.inkSoft, marginTop: 2 }}
              >
                Secures your project slot and covers initial materials.
              </Text>
            </View>
          ) : null}
        </TotalsBox>

        <SectionTitle
          eyebrow="Good to know"
          title="Key terms"
          keepWith={
            <View style={{ flexDirection: "row", gap: 10 }}>
              <KeyTerm
                title="Payment"
                text={quote.termsAndConditions || DEFAULT_PAYMENT_TERMS}
              />
              <KeyTerm
                title="Timeline"
                text={`${quote.leadTime || DEFAULT_LEAD_TIME}${
                  quote.estimatedDuration
                    ? ` The estimated duration for this project is ${quote.estimatedDuration}.`
                    : ""
                }`}
              />
              <KeyTerm
                title="Warranty"
                text={quote.warrantyInformation || businessFacts.workmanship}
              />
            </View>
          }
        />

        <SectionTitle eyebrow="The detail" title="Terms & conditions" />
        {quoteTermsSections.map((section) => (
          <TermsSection key={section.title} section={section} />
        ))}

        <View
          wrap={false}
          style={{
            marginTop: 16,
            backgroundColor: colors.chalk,
            borderRadius: 4,
            paddingVertical: 14,
            paddingHorizontal: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: 700, fontSize: 10.5 }}>
            {`This quote is valid until ${
              formatDate(quote.validUntil) || "30 days from issue"
            }.`}
          </Text>
          <Text style={{ color: colors.inkSoft, fontSize: 8.5, marginTop: 3 }}>
            {`Questions? Call ${company.phone} or visit ${company.website}`}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
