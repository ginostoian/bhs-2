"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { getCalculator, runEstimate, sanitizeAnswers, summarizeAnswers } from "@/libs/calculators/registry";
import { decodeAnswers, encodeAnswers, formatGBP } from "@/libs/calculators/common";
import { hasAnalyticsConsent } from "@/libs/enquiryAnalytics";
import { publicFormFetch } from "@/libs/publicFormClient";
import { BOOKING_URL } from "@/libs/booking";
import { businessFacts } from "@/libs/businessFacts";
import Field from "./Fields";
import s from "./Calculator.module.css";

const SITE = "https://bhstudio.co.uk";

function track(event, calculator, extra = {}) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: `calculator_${event}`, calculator, ...extra });
}

function useEffectiveConfig(calc) {
  const [config, setConfig] = useState(calc.defaultConfig || null);
  useEffect(() => {
    if (!calc.rateType) return;
    let live = true;
    fetch(`/api/calculator-rates/${calc.rateType}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => live && d?.config && setConfig(d.config))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [calc.rateType]);
  return config;
}

/* ------------------------------------------------------------- live summary */

function RangeBar({ low, expected, high }) {
  const min = low * 0.75;
  const max = high * 1.15;
  const pct = (v) => `${((v - min) / (max - min)) * 100}%`;
  return (
    <div className={s.rangeBar} aria-hidden="true">
      <span className={s.rangeFill} style={{ left: pct(low), width: `calc(${pct(high)} - ${pct(low)})` }} />
      <span className={s.rangeMarker} style={{ left: pct(expected) }} />
    </div>
  );
}

function LiveEstimate({ calc, result, onSeeResult, done }) {
  if (!result) return null;
  if (calc.kind === "btu") {
    return (
      <div className={s.estimate} aria-live="polite">
        <p className={s.estimateEyebrow}>Heat needed</p>
        <div className={s.estimateValue}>{result.btu.toLocaleString("en-GB")} BTU</div>
        <p className={s.estimateRange}>{result.watts.toLocaleString("en-GB")} watts</p>
        <dl className={s.facts}>
          <div>
            <dt>Radiators</dt>
            <dd>{result.radiators}</dd>
          </div>
          <div>
            <dt>{result.heatPump ? "Rated (ΔT50) each" : "Output each"}</dt>
            <dd>{result.perRadiatorWatts.toLocaleString("en-GB")} W</dd>
          </div>
        </dl>
      </div>
    );
  }
  return (
    <div className={s.estimate} aria-live="polite">
      <p className={s.estimateEyebrow}>{done ? "Your estimate" : "Live estimate"}</p>
      <div className={s.estimateValue}>{formatGBP(result.expected)}</div>
      <p className={s.estimateRange}>
        Likely {formatGBP(result.low)} – {formatGBP(result.high)}
      </p>
      <RangeBar {...result} />
      <dl className={s.facts}>
        {result.perM2 ? (
          <div>
            <dt>Per m²</dt>
            <dd>{formatGBP(result.perM2)}</dd>
          </div>
        ) : null}
        <div>
          <dt>Time on site</dt>
          <dd>{result.timeline?.replace(" on site", "") || (result.weeks ? `${result.weeks[0]}–${result.weeks[1]} weeks` : result.days ? `${result.days[0]}–${result.days[1]} days` : "–")}</dd>
        </div>
      </dl>
      {!done ? (
        <button type="button" className={s.secondary} onClick={onSeeResult} style={{ marginTop: 18, width: "100%", color: "#fff", borderColor: "rgba(255,255,255,.35)" }}>
          See the full breakdown
        </button>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ dialogs */

function EmailDialog({ calc, answers, dialogRef }) {
  const [form, setForm] = useState({ name: "", email: "", consent: false, honeypot: "" });
  const [state, setState] = useState({ status: "idle", error: "" });
  const startedAt = useRef(Date.now());
  const submit = async (e) => {
    e.preventDefault();
    if (!form.consent) return setState({ status: "idle", error: "Please tick the box so we can email you." });
    setState({ status: "sending", error: "" });
    try {
      const res = await publicFormFetch("/api/calculator-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calculator: calc.id, answers, ...form, startedAt: startedAt.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setState({ status: "sent", error: "" });
      track("pdf_sent", calc.id);
    } catch (err) {
      setState({ status: "idle", error: err.message });
    }
  };
  return (
    <dialog ref={dialogRef} className={s.dialog} onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}>
      <form className={s.dialogBody} onSubmit={submit}>
        {state.status === "sent" ? (
          <>
            <h3>Check your inbox</h3>
            <p className={s.success}>Your PDF breakdown is on its way to {form.email}.</p>
            <p>It includes every line of the estimate, what is and isn&apos;t included, and the questions to ask builders when you get quotes.</p>
            <button type="button" className={s.primary} onClick={() => dialogRef.current.close()}>
              Done
            </button>
          </>
        ) : (
          <>
            <h3>Email me the PDF breakdown</h3>
            <p>A clear, itemised copy of your estimate to keep, share with your partner or take to builders.</p>
            <input className={s.input} placeholder="Your name (optional)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
            <input className={s.input} type="email" required placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
            <input className={s.hp} tabIndex={-1} aria-hidden="true" autoComplete="off" value={form.honeypot} onChange={(e) => setForm({ ...form, honeypot: e.target.value })} />
            <label className={s.consent}>
              <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} />
              <span>
                Email me my estimate. Better Homes may follow up once about my project. See our <Link href="/privacy-policy">privacy policy</Link>.
              </span>
            </label>
            {state.error ? <p className={s.error}>{state.error}</p> : null}
            <button className={s.primary} disabled={state.status === "sending"}>
              {state.status === "sending" ? "Sending…" : "Send my PDF"}
            </button>
          </>
        )}
      </form>
    </dialog>
  );
}

function EmbedDialog({ calc, dialogRef }) {
  const [copied, setCopied] = useState(false);
  const code = `<iframe src="${SITE}/embed/${calc.id}" title="${calc.name}" style="width:100%;height:860px;border:0" loading="lazy" id="bh-calc-${calc.id}"></iframe>
<p style="font:13px sans-serif">Free <a href="${SITE}${calc.path}">${calc.name.toLowerCase()}</a> by Better Homes, London builders.</p>
<script>addEventListener("message",function(e){if(e.origin==="${SITE}"&&e.data&&e.data.bhCalcHeight){document.getElementById("bh-calc-${calc.id}").style.height=e.data.bhCalcHeight+"px"}})</script>`;
  return (
    <dialog ref={dialogRef} className={s.dialog} onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}>
      <div className={s.dialogBody}>
        <h3>Add this calculator to your website</h3>
        <p>Free to use on blogs, estate agent and mortgage broker sites. Paste this code where you want it to appear. It resizes itself and always uses our latest prices.</p>
        <textarea className={s.code} readOnly value={code} onFocus={(e) => e.target.select()} />
        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            className={s.primary}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(code);
                setCopied(true);
                track("embed_copied", calc.id);
              } catch {}
            }}
          >
            {copied ? "Copied" : "Copy code"}
          </button>
          <button type="button" className={s.secondary} onClick={() => dialogRef.current.close()}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}

/* ------------------------------------------------------------------- result */

function CostResult({ calc, result, answers, config, onEdit, onRestart, actions }) {
  const max = Math.max(...result.breakdown.map((b) => b.amount));
  const summary = summarizeAnswers(calc, answers, config);
  const priceDate = config?.priceBookDate ? new Date(`${config.priceBookDate}-01`).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : null;
  const time = result.timeline || (result.weeks ? `${result.weeks[0]}–${result.weeks[1]} weeks on site` : result.days ? `${result.days[0]}–${result.days[1]} working days` : null);
  return (
    <div>
      <div className={s.resultHead}>
        <div>
          <p className={s.estimateEyebrow} style={{ color: "#5f6a63", opacity: 1 }}>
            Your {calc.short.toLowerCase()} estimate
          </p>
          <div className={s.resultValue}>{formatGBP(result.expected)}</div>
          <p className={s.resultRange}>
            Most projects like yours land between <strong>{formatGBP(result.low)}</strong> and <strong>{formatGBP(result.high)}</strong>
            {answers.vat === "zero" ? ", excluding VAT." : ", including VAT and fees."}
          </p>
        </div>
      </div>
      <dl className={s.statRow}>
        {result.perM2 ? (
          <div className={s.stat}>
            <dt>Cost per m²</dt>
            <dd>{formatGBP(result.perM2)}</dd>
          </div>
        ) : null}
        {time ? (
          <div className={s.stat}>
            <dt>Build time</dt>
            <dd>{time.replace(" on site", "")}</dd>
            {result.timelineNote ? <small>{result.timelineNote}</small> : <small>on site</small>}
          </div>
        ) : null}
        {result.area ? (
          <div className={s.stat}>
            <dt>Floor area</dt>
            <dd>{result.area} m²</dd>
          </div>
        ) : null}
        {priceDate ? (
          <div className={s.stat}>
            <dt>Prices updated</dt>
            <dd>{priceDate}</dd>
          </div>
        ) : null}
      </dl>
      {actions}
      <h3 className={s.sectionTitle}>Where the money goes</h3>
      <ul className={s.breakdown}>
        {result.breakdown.map((b) => (
          <li key={b.label} className={s.breakdownRow}>
            <span>{b.label}</span>
            <strong>{formatGBP(b.amount)}</strong>
            <span className={s.bar}>
              <i style={{ width: `${Math.max(2, (b.amount / max) * 100)}%` }} />
            </span>
          </li>
        ))}
      </ul>
      <div className={s.twoCol} style={{ marginTop: 8 }}>
        <div>
          <h3 className={s.sectionTitle}>Included</h3>
          <ul className={s.list}>
            {result.included.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className={s.sectionTitle}>Not included</h3>
          <ul className={s.list}>
            {result.excluded.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
      <h3 className={s.sectionTitle}>Worth knowing</h3>
      {result.notes.map((n) => (
        <p key={n} className={s.note}>
          {n}
        </p>
      ))}
      <h3 className={s.sectionTitle}>Your answers</h3>
      <dl className={s.answers}>
        {summary.map((x) => (
          <div key={x.question}>
            <dt>{x.question}</dt>
            <dd>{x.answer}</dd>
          </div>
        ))}
      </dl>
      <div className={s.actions}>
        <button type="button" className={s.secondary} onClick={onEdit}>
          Change answers
        </button>
        <button type="button" className={s.ghost} onClick={onRestart}>
          Start again
        </button>
      </div>
    </div>
  );
}

function BtuResult({ result, onEdit, actions }) {
  return (
    <div>
      <p className={s.estimateEyebrow} style={{ color: "#5f6a63", opacity: 1 }}>
        Heat needed for this room
      </p>
      <div className={s.resultValue}>{result.btu.toLocaleString("en-GB")} BTU/h</div>
      <p className={s.resultRange}>
        That&apos;s <strong>{result.watts.toLocaleString("en-GB")} watts</strong> for a {result.area} m² room ({result.volume} m³).
      </p>
      <dl className={s.statRow}>
        <div className={s.stat}>
          <dt>Suggested radiators</dt>
          <dd>{result.radiators}</dd>
        </div>
        <div className={s.stat}>
          <dt>Each radiator</dt>
          <dd>{result.perRadiatorWatts.toLocaleString("en-GB")} W</dd>
          <small>{result.perRadiatorBtu.toLocaleString("en-GB")} BTU/h</small>
        </div>
        {result.heatPump ? (
          <div className={s.stat}>
            <dt>Rated output (ΔT50)</dt>
            <dd>{result.ratedWatts.toLocaleString("en-GB")} W</dd>
            <small>to deliver {result.watts.toLocaleString("en-GB")} W at 45°C</small>
          </div>
        ) : null}
      </dl>
      {actions}
      <h3 className={s.sectionTitle}>How to use this</h3>
      <p className={s.note}>Radiator brochures list output at ΔT50. Look for radiators whose combined ΔT50 output meets the {result.heatPump ? "rated" : ""} figure above.</p>
      {result.heatPump ? <p className={s.note}>Heat pumps run radiators cooler, so they need to be roughly twice the size of radiators on a gas boiler. Ask your installer for a room-by-room heat loss survey (MCS requirement).</p> : null}
      <p className={s.note}>Split the output across two radiators in long rooms or rooms with several windows. Put them under windows where you can.</p>
      <div className={s.actions}>
        <button type="button" className={s.secondary} onClick={onEdit}>
          Change answers
        </button>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------- main */

export default function CalculatorApp({ id, embed = false, service }) {
  const calc = getCalculator(id);
  const config = useEffectiveConfig(calc);
  const [answers, setAnswers] = useState(() => sanitizeAnswers(calc, {}));
  const [step, setStep] = useState(0);
  const [shared, setShared] = useState(false);
  const emailRef = useRef(null);
  const embedRef = useRef(null);
  const topRef = useRef(null);
  const started = useRef(false);
  const done = step >= calc.steps.length;

  // Restore a shared estimate from ?a=… and go straight to the result.
  useEffect(() => {
    const fromUrl = decodeAnswers(new URLSearchParams(window.location.search).get("a"));
    if (fromUrl) {
      setAnswers(sanitizeAnswers(calc, fromUrl));
      setStep(calc.steps.length);
    }
  }, [calc]);

  // Embedded calculators tell the parent page how tall they are.
  useEffect(() => {
    if (!embed || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => window.parent?.postMessage({ bhCalcHeight: document.documentElement.scrollHeight + 8 }, "*"));
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [embed]);

  const result = useMemo(() => {
    try {
      return runEstimate(calc, answers, config);
    } catch {
      return null;
    }
  }, [calc, answers, config]);

  const shareUrl = useMemo(() => `${SITE}${embed ? calc.path : calc.path}?a=${encodeAnswers(answers)}`, [answers, calc.path, embed]);

  useEffect(() => {
    if (!done || embed) return;
    window.history.replaceState(null, "", `${calc.path}?a=${encodeAnswers(answers)}`);
  }, [done, answers, calc.path, embed]);

  const patch = useCallback(
    (p) => {
      if (!started.current) {
        started.current = true;
        track("start", calc.id);
      }
      setAnswers((a) => {
        const changes = typeof p === "function" ? p(a) : p;
        const next = { ...a, ...changes };
        const derived = calc.onChange?.(changes, next, config || calc.defaultConfig);
        return derived ? { ...next, ...derived } : next;
      });
    },
    [calc, config],
  );

  const go = (n) => {
    setStep(n);
    if (n >= calc.steps.length) track("complete", calc.id);
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const share = async () => {
    track("share", calc.id);
    try {
      if (navigator.share) await navigator.share({ title: calc.name, text: `My ${calc.short.toLowerCase()} estimate`, url: shareUrl });
      else {
        await navigator.clipboard.writeText(shareUrl);
        setShared(true);
        setTimeout(() => setShared(false), 2500);
      }
    } catch {}
  };

  const utm = embed ? `utm_source=embed&utm_medium=calculator&utm_campaign=${calc.id}` : "";
  const contactHref = `/contact?${new URLSearchParams({ service: service || calc.short, ...(utm ? Object.fromEntries(new URLSearchParams(utm)) : {}) })}#brief`;
  const linkProps = embed ? { target: "_blank", rel: "noopener" } : {};

  const actions =
    calc.kind === "btu" ? (
      <div className={s.actions}>
        <button type="button" className={s.secondary} onClick={share}>
          {shared ? "Link copied" : "Share result"}
        </button>
      </div>
    ) : (
      <div className={s.actions}>
        {embed ? (
          <a className={s.primary} href={`${shareUrl}&${utm}`} {...linkProps}>
            Get the PDF breakdown
          </a>
        ) : (
          <button type="button" className={s.primary} onClick={() => (track("pdf_open", calc.id), emailRef.current?.showModal())}>
            Email me the PDF
          </button>
        )}
        <button type="button" className={s.secondary} onClick={share}>
          {shared ? "Link copied" : "Share this estimate"}
        </button>
      </div>
    );

  const current = calc.steps[step];

  return (
    <div ref={topRef} style={{ scrollMarginTop: 96 }}>
      <div className={`${s.app} ${embed ? s.embed : ""}`}>
        <div className={s.panel}>
          <nav className={s.progress} aria-label="Calculator steps">
            {calc.steps.map((st, i) => (
              <button key={st.id} type="button" className={s.progressItem} data-state={i < step ? "done" : i === step ? "current" : "todo"} onClick={() => go(i)} aria-current={i === step ? "step" : undefined}>
                {i + 1}. {st.title.replace(/\?$/, "")}
              </button>
            ))}
            <button type="button" className={s.progressItem} data-state={done ? "current" : "todo"} onClick={() => go(calc.steps.length)}>
              Result
            </button>
          </nav>

          {done && result ? (
            <>
              {calc.kind === "btu" ? (
                <BtuResult result={result} onEdit={() => go(0)} actions={actions} />
              ) : (
                <CostResult calc={calc} result={result} answers={answers} config={config} onEdit={() => go(0)} onRestart={() => (setAnswers(sanitizeAnswers(calc, {})), go(0))} actions={actions} />
              )}
              {calc.kind !== "btu" ? (
                <div className={s.cta}>
                  <h3>Want a fixed price for your home?</h3>
                  <p>Talk it through with our team. We&apos;ll tell you honestly whether the budget works, what to prioritise and what would change the number.</p>
                  <div className={s.actions} style={{ marginTop: 0 }}>
                    <a className={s.primary} href={BOOKING_URL} {...linkProps} target="_blank" rel="noopener">
                      Book a free 20-minute call
                    </a>
                    <a className={s.secondary} href={embed ? `${SITE}${contactHref}` : contactHref} {...linkProps}>
                      Send us your plans
                    </a>
                  </div>
                </div>
              ) : null}
            </>
          ) : current ? (
            <>
              <h2 className={s.stepTitle}>{current.title}</h2>
              {current.subtitle ? <p className={s.stepSubtitle}>{current.subtitle}</p> : null}
              <div className={s.fields}>
                {current.fields.map((f) => (
                  <Field key={f.id} field={f} answers={answers} onPatch={patch} config={config || calc.defaultConfig} />
                ))}
              </div>
              <div className={s.nav}>
                {step > 0 ? (
                  <button type="button" className={s.secondary} onClick={() => go(step - 1)}>
                    Back
                  </button>
                ) : (
                  <span />
                )}
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  {step < calc.steps.length - 1 ? (
                    <button type="button" className={s.ghost} onClick={() => go(calc.steps.length)}>
                      Skip to result
                    </button>
                  ) : null}
                  <button type="button" className={s.primary} onClick={() => go(step + 1)}>
                    {step === calc.steps.length - 1 ? "See my estimate" : "Next"}
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>

        <aside className={s.aside}>
          <LiveEstimate calc={calc} result={result} done={done} onSeeResult={() => go(calc.steps.length)} />
          {!embed ? (
            <div className={s.asideCard}>
              <p>
                <strong>Built from real 2026 prices.</strong> Rates are checked against London builders&apos; published prices and our own quotes, and updated as the market moves.
              </p>
              <p className={s.trust}>
                {businessFacts.reviews.rating}/5 on Houzz · {businessFacts.experience} building London homes
              </p>
              {calc.kind !== "btu" ? (
                <button type="button" className={s.linkButton} onClick={() => embedRef.current?.showModal()}>
                  Add this calculator to your website
                </button>
              ) : null}
            </div>
          ) : null}
        </aside>
      </div>

      {embed ? (
        <p className={s.poweredBy}>
          Free calculator by{" "}
          <a href={`${SITE}${calc.path}?${utm}`} target="_blank" rel="noopener">
            Better Homes, London builders
          </a>
        </p>
      ) : null}

      {!done && result && calc.kind !== "btu" ? (
        <div className={s.mobileBar} style={embed ? { display: "none" } : undefined}>
          <div>
            <span>Live estimate</span>
            <strong>{formatGBP(result.expected)}</strong>
          </div>
          <button type="button" onClick={() => go(calc.steps.length)}>
            See breakdown
          </button>
        </div>
      ) : null}

      {!embed ? (
        <>
          <EmailDialog calc={calc} answers={answers} dialogRef={emailRef} />
          <EmbedDialog calc={calc} dialogRef={embedRef} />
        </>
      ) : null}
    </div>
  );
}
