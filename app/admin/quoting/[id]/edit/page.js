import QuoteEditorPage from "../../components/editor/QuoteEditorPage";

export default function EditQuotePage({ params }) {
  return <QuoteEditorPage quoteId={params.id} />;
}
