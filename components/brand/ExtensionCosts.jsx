export default function ExtensionCosts() {
  return (
    <section id="costs" className="bh-wrap bh-section">
      <p className="bh-eyebrow">Planning ranges</p>
      <h2 className="bh-heading">A starting point for your extension budget</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="bh-cost-table">
          <thead>
            <tr>
              <th>Extension type</th>
              <th>Indicative construction investment</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Side return", "£35,000 to £60,000"],
              ["Single-storey rear extension", "£50,000 to £95,000"],
              ["Wraparound extension", "£75,000 to £140,000"],
              ["Kitchen extension with fit-out", "£80,000 to £160,000"],
              ["Double-storey extension", "£100,000 to £200,000+"],
            ].map(([name, range]) => (
              <tr key={name}>
                <th>{name}</th>
                <td>{range}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="bh-small" style={{ marginTop: 24 }}>
        These existing planning bands describe different scopes. A published
        all-in example may include VAT, fees and finishes that a
        construction-only range excludes. Your itemised quotation confirms the
        basis, inclusions and allowances.
      </p>
      <p style={{ marginTop: 16 }}>
        The build phase is often 12 to 24 weeks. Allow around 6 to 10 months for
        the wider journey, including design, approvals and preconstruction,
        depending on the property.
      </p>
    </section>
  );
}
