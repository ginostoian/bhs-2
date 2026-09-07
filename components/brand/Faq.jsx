export default function Faq({
  items,
  title = "Questions, answered",
  compact = false,
  id,
}) {
  if (!items?.length) return null;
  return (
    <section id={id} className={compact ? "bh-help" : "bh-wrap bh-section"}>
      <p className="bh-eyebrow">
        {compact ? "Help with this page" : "Useful to know"}
      </p>
      <h2 className={compact ? undefined : "bh-heading"}>{title}</h2>
      <div className="bh-faq">
        {items.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <div className="bh-faq-answer">
              {item.answer || item.answerText}
              {item.link ? (
                <>
                  <br />
                  <a className="bh-text-link" href={item.link.href}>
                    {item.link.label || item.link.text || "Read the guide"}
                  </a>
                </>
              ) : null}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
