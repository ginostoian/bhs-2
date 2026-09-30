import { Cell, Document, Page, Row, Table, Text, View } from "@formepdf/react";
import {
  DocumentHeader,
  Eyebrow,
  PAGE_MARGIN,
  PageFooter,
  Paragraphs,
  Pill,
  SectionTitle,
  TotalsBox,
  baseTextStyle,
  colors,
  company,
  formatCurrency,
  formatDate,
  getFonts,
  str,
} from "./components";

const COLUMNS = [
  { width: { fraction: 0.4 } },
  { width: { fraction: 0.12 } },
  { width: { fraction: 0.08 } },
  { width: { fraction: 0.16 } },
  { width: { fraction: 0.08 } },
  { width: { fraction: 0.16 } },
];

const cellPad = { paddingVertical: 7, paddingHorizontal: 7 };
const headCell = cellPad;
const headText = {
  fontSize: 7,
  fontWeight: 700,
  color: colors.white,
  letterSpacing: 0.8,
  textTransform: "uppercase",
};

const statusFor = (invoice) => {
  if (invoice.status === "paid")
    return { label: "Paid", color: colors.green, background: colors.greenBg };
  if (invoice.isOverdue)
    return { label: "Overdue", color: colors.red, background: colors.redBg };
  const label = str(invoice.status);
  return {
    label: label.charAt(0).toUpperCase() + label.slice(1),
    color: colors.olive,
    background: colors.chalkDeep,
  };
};

export const InvoiceDocument = ({ invoice }) => {
  const reference = str(invoice.invoiceNumber);
  const client = invoice.client || {};
  const status = statusFor(invoice);
  const lineItems = [...(invoice.lineItems || [])].sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  );

  return (
    <Document
      title={`Invoice ${reference} – ${company.name}`}
      author={company.name}
      subject={invoice.title || "Invoice"}
      lang="en-GB"
      fonts={getFonts()}
      style={baseTextStyle}
    >
      <Page size="A4" margin={PAGE_MARGIN}>
        <PageFooter
          left={`${company.name} · Invoice ${reference} · ${company.website}`}
        />

        <DocumentHeader
          label="INVOICE"
          reference={`No. ${reference}`}
          badge={<Pill {...status} />}
          meta={[
            {
              label: "Issue date",
              value: formatDate(invoice.issueDate) || "—",
            },
            {
              label: "Due date",
              value: formatDate(invoice.dueDate) || "On receipt",
              color: invoice.isOverdue ? colors.red : undefined,
            },
            {
              label: "Amount due",
              value:
                invoice.status === "paid"
                  ? formatCurrency(0)
                  : formatCurrency(invoice.total),
            },
          ]}
        />

        <View wrap={false} style={{ flexDirection: "row", gap: 12 }}>
          <View
            style={{
              flex: 1,
              borderWidth: 0.75,
              borderColor: colors.line,
              borderRadius: 4,
              padding: 12,
            }}
          >
            <Eyebrow color={colors.olive} style={{ marginBottom: 6 }}>
              Bill to
            </Eyebrow>
            <Text style={{ fontWeight: 700, fontSize: 10.5 }}>
              {str(client.name)}
            </Text>
            {client.address ? (
              <Text style={{ color: colors.inkSoft, marginTop: 2 }}>
                {str(client.address)}
              </Text>
            ) : null}
            {client.email ? (
              <Text style={{ color: colors.inkSoft, marginTop: 2 }}>
                {str(client.email)}
              </Text>
            ) : null}
            {client.phone ? (
              <Text style={{ color: colors.inkSoft }}>{str(client.phone)}</Text>
            ) : null}
          </View>
          <View
            style={{
              flex: 1,
              borderWidth: 0.75,
              borderColor: colors.line,
              borderRadius: 4,
              padding: 12,
            }}
          >
            <Eyebrow color={colors.olive} style={{ marginBottom: 6 }}>
              From
            </Eyebrow>
            <Text style={{ fontWeight: 700, fontSize: 10.5 }}>
              {company.name}
            </Text>
            <Text style={{ color: colors.inkSoft, marginTop: 2 }}>
              {company.location}
            </Text>
            <Text style={{ color: colors.inkSoft, marginTop: 2 }}>
              {company.phone}
            </Text>
            <Text style={{ color: colors.inkSoft }}>{company.website}</Text>
          </View>
        </View>

        <SectionTitle
          eyebrow="Services"
          title={invoice.title || "Invoice details"}
        />

        <Table columns={COLUMNS}>
          <Row header style={{ backgroundColor: colors.olive }}>
            <Cell style={headCell}>
              <Text style={headText}>Service</Text>
            </Cell>
            <Cell style={headCell}>
              <Text style={headText}>Type</Text>
            </Cell>
            <Cell style={headCell}>
              <Text style={{ ...headText, textAlign: "right" }}>Qty</Text>
            </Cell>
            <Cell style={headCell}>
              <Text style={{ ...headText, textAlign: "right" }}>
                Price ex. VAT
              </Text>
            </Cell>
            <Cell style={headCell}>
              <Text style={{ ...headText, textAlign: "right" }}>VAT</Text>
            </Cell>
            <Cell style={headCell}>
              <Text style={{ ...headText, textAlign: "right" }}>
                Total inc. VAT
              </Text>
            </Cell>
          </Row>
          {lineItems.map((item, i) => {
            const rowStyle = {
              ...cellPad,
              backgroundColor: i % 2 === 1 ? colors.chalk : colors.white,
              borderBottomWidth: 0.75,
              borderBottomColor: colors.line,
            };
            const muted = { textAlign: "right", color: colors.inkSoft };
            return (
              <Row key={i}>
                <Cell style={rowStyle}>
                  <Text style={{ fontWeight: 500 }}>
                    {str(item.serviceName)}
                  </Text>
                </Cell>
                <Cell style={rowStyle}>
                  <Text
                    style={{
                      fontSize: 8,
                      color:
                        item.type === "Labour" ? colors.olive : colors.clay,
                      fontWeight: 500,
                    }}
                  >
                    {str(item.type)}
                  </Text>
                </Cell>
                <Cell style={rowStyle}>
                  <Text style={muted}>{str(item.quantity)}</Text>
                </Cell>
                <Cell style={rowStyle}>
                  <Text style={muted}>{formatCurrency(item.priceExclVat)}</Text>
                </Cell>
                <Cell style={rowStyle}>
                  <Text style={muted}>{`${str(item.vatRate)}%`}</Text>
                </Cell>
                <Cell style={rowStyle}>
                  <Text style={{ textAlign: "right", fontWeight: 700 }}>
                    {formatCurrency(item.totalVatIncluded)}
                  </Text>
                </Cell>
              </Row>
            );
          })}
        </Table>

        <TotalsBox
          rows={[
            {
              label: "Subtotal (ex. VAT)",
              value: formatCurrency(invoice.subtotal),
            },
            { label: "VAT", value: formatCurrency(invoice.totalVat) },
          ]}
          grandLabel={invoice.status === "paid" ? "Total paid" : "Total due"}
          grandValue={formatCurrency(invoice.total)}
        />

        {invoice.isOverdue ? (
          <View
            wrap={false}
            style={{
              marginTop: 16,
              backgroundColor: colors.redBg,
              borderLeftWidth: 3,
              borderLeftColor: colors.red,
              paddingVertical: 9,
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ color: colors.red, fontWeight: 700 }}>
              This invoice is overdue
            </Text>
            <Text style={{ color: colors.red, fontSize: 8.5, marginTop: 2 }}>
              {`Payment was due on ${formatDate(
                invoice.dueDate,
              )}. Please contact us to arrange payment.`}
            </Text>
          </View>
        ) : null}

        {invoice.notes ? (
          <View>
            <SectionTitle eyebrow="Notes" title="Additional information" />
            <Paragraphs text={invoice.notes} />
          </View>
        ) : null}

        {invoice.terms ? (
          <View>
            <SectionTitle eyebrow="Terms" title="Terms & conditions" />
            <Paragraphs text={invoice.terms} style={{ fontSize: 8.5 }} />
          </View>
        ) : null}

        <View
          wrap={false}
          style={{
            marginTop: 22,
            alignItems: "center",
            paddingTop: 14,
            borderTopWidth: 0.75,
            borderTopColor: colors.line,
          }}
        >
          <Text style={{ fontWeight: 700, fontSize: 10.5 }}>
            Thank you for your business
          </Text>
          <Text style={{ color: colors.inkSoft, fontSize: 8.5, marginTop: 2 }}>
            {`${company.name} · ${company.location}`}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
