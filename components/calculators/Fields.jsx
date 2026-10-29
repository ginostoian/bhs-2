"use client";

import { useState } from "react";
import { LONDON_ZONES, REGIONS, clamp } from "@/libs/calculators/common";
import OptionIcon from "./Icons";
import s from "./Calculator.module.css";

function Label({ field }) {
  if (!field.label && !field.help) return null;
  return (
    <>
      {field.label ? <span className={s.fieldLabel}>{field.label}</span> : null}
      {field.help ? <p className={s.fieldHelp}>{field.help}</p> : null}
    </>
  );
}

function Cards({ field, value, onChange }) {
  const cols = field.columns || 3;
  return (
    <div>
      <Label field={field} />
      <div className={s.optionsGrid} role="radiogroup" aria-label={field.label} style={{ "--cols": cols }} data-cols={cols}>
        {field.options.map((o) => (
          <button key={o.id} type="button" role="radio" aria-checked={value === o.id} className={s.card} onClick={() => onChange(o.id)}>
            {o.icon ? <OptionIcon name={o.icon} className={s.cardIcon} /> : null}
            <span className={s.cardLabel}>{o.label}</span>
            {o.hint ? <span className={s.cardHint}>{o.hint}</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
}

function Chips({ field, value, onChange }) {
  return (
    <div>
      <Label field={field} />
      <div className={s.chips} role="radiogroup" aria-label={field.label}>
        {field.options.map((o) => (
          <button key={String(o.id)} type="button" role="radio" aria-checked={value === o.id} className={s.chip} onClick={() => onChange(o.id)} title={o.hint}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function NumberInput({ value, min, max, step = 1, unit, onChange, label }) {
  const [draft, setDraft] = useState(null);
  return (
    <label className={s.bigNumber}>
      <input
        type="number"
        inputMode="decimal"
        aria-label={label}
        value={draft ?? value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft !== null && draft !== "") onChange(clamp(Number(draft), min, max));
          setDraft(null);
        }}
        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      />
      <span>{unit}</span>
    </label>
  );
}

function Area({ field, value, onChange }) {
  const [measuring, setMeasuring] = useState(false);
  const [dims, setDims] = useState({ l: "", w: "" });
  const step = field.step || 1;
  const applyDims = (next) => {
    setDims(next);
    const area = Number(next.l) * Number(next.w);
    if (area > 0) onChange(clamp(Math.round(area / step) * step, field.min, field.max));
  };
  return (
    <div>
      <Label field={field} />
      <div className={s.areaRow}>
        <NumberInput value={value} min={field.min} max={field.max} step={step} unit="m²" onChange={onChange} label={field.label} />
        <input className={s.slider} type="range" min={field.min} max={field.max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={`${field.label} slider`} />
      </div>
      {field.presets ? (
        <div className={s.chips} style={{ marginTop: 12 }}>
          {field.presets.map((p) => (
            <button key={p} type="button" className={s.chip} aria-pressed={value === p} onClick={() => onChange(p)}>
              {p} m²
            </button>
          ))}
        </div>
      ) : null}
      <div style={{ marginTop: 12 }}>
        <button type="button" className={s.linkButton} onClick={() => setMeasuring((m) => !m)}>
          {measuring ? "Hide measurements" : "Work it out from length × width"}
        </button>
        {measuring ? (
          <div className={s.measure}>
            <input type="number" inputMode="decimal" placeholder="Length" aria-label="Length in metres" value={dims.l} onChange={(e) => applyDims({ ...dims, l: e.target.value })} />
            <span>m ×</span>
            <input type="number" inputMode="decimal" placeholder="Width" aria-label="Width in metres" value={dims.w} onChange={(e) => applyDims({ ...dims, w: e.target.value })} />
            <span>m = {Number(dims.l) * Number(dims.w) > 0 ? `${Math.round(Number(dims.l) * Number(dims.w) * 10) / 10} m²` : "…"}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function NumberField({ field, value, onChange }) {
  return (
    <div className={s.inlineField}>
      <div>
        <Label field={field} />
      </div>
      <NumberInput value={value} min={field.min} max={field.max} step={field.step} unit={field.unit} onChange={onChange} label={field.label} />
    </div>
  );
}

function Counter({ field, value, onChange }) {
  const v = Number(value) || 0;
  return (
    <div className={s.inlineField}>
      <div>
        <Label field={field} />
      </div>
      <div className={s.counter}>
        <button type="button" onClick={() => onChange(Math.max(field.min ?? 0, v - 1))} disabled={v <= (field.min ?? 0)} aria-label={`Fewer ${field.label}`}>
          −
        </button>
        <output aria-live="polite">{v}</output>
        <button type="button" onClick={() => onChange(Math.min(field.max ?? 10, v + 1))} disabled={v >= (field.max ?? 10)} aria-label={`More ${field.label}`}>
          +
        </button>
      </div>
    </div>
  );
}

function Toggle({ field, value, onChange }) {
  return (
    <button type="button" role="switch" aria-checked={Boolean(value)} className={s.toggle} onClick={() => onChange(!value)} style={{ width: "100%", textAlign: "left", color: "inherit" }}>
      <span>
        <span className={s.extraLabel}>{field.label}</span>
        {field.hint ? <span className={s.extraHint} style={{ display: "block" }}>{field.hint}</span> : null}
      </span>
      <span className={s.switch} />
    </button>
  );
}

function Extras({ field, value = {}, onChange, config }) {
  const options = typeof field.options === "function" ? field.options(config) : field.options;
  const set = (id, v) => onChange((prev) => ({ ...(prev || {}), [id]: v }));
  return (
    <div>
      <Label field={field} />
      <div className={s.extras}>
        {options.map((o) => {
          const on = Boolean(value[o.id]);
          const qty = typeof value[o.id] === "number" ? value[o.id] : o.qty?.min || 1;
          return (
            <div key={o.id} className={s.extra} role="checkbox" aria-checked={on} tabIndex={0} onClick={() => set(o.id, on ? false : o.qty ? qty : true)} onKeyDown={(e) => (e.key === " " || e.key === "Enter") && (e.preventDefault(), set(o.id, on ? false : o.qty ? qty : true))}>
              <span className={s.tick} />
              <span className={s.extraBody}>
                <span className={s.extraLabel} style={{ display: "block" }}>{o.label}</span>
                {o.hint ? <span className={s.extraHint}>{o.hint}</span> : null}
              </span>
              {on && o.qty ? (
                <span className={s.miniCounter} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                  <button type="button" aria-label={`Fewer ${o.label}`} onClick={() => set(o.id, Math.max(o.qty.min, qty - 1))}>
                    −
                  </button>
                  <strong style={{ minWidth: 18, textAlign: "center" }}>{qty}</strong>
                  <button type="button" aria-label={`More ${o.label}`} onClick={() => set(o.id, Math.min(o.qty.max, qty + 1))}>
                    +
                  </button>
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Location({ answers, onPatch }) {
  return (
    <div>
      <span className={s.fieldLabel}>Where is the property?</span>
      <div className={s.chips} role="radiogroup" aria-label="Region" style={{ marginTop: 10 }}>
        {REGIONS.map((r) => (
          <button key={r.id} type="button" role="radio" aria-checked={answers.region === r.id} className={s.chip} onClick={() => onPatch({ region: r.id })}>
            {r.label}
          </button>
        ))}
      </div>
      {answers.region === "london" ? (
        <>
          <p className={s.fieldHelp} style={{ margin: "16px 0 8px" }}>
            Which part of London? Central boroughs cost more because of access, parking and labour.
          </p>
          <div className={s.chips} role="radiogroup" aria-label="London zone">
            {LONDON_ZONES.map((z) => (
              <button key={z.id} type="button" role="radio" aria-checked={answers.londonZone === z.id} className={s.chip} onClick={() => onPatch({ londonZone: z.id })}>
                {z.label} <span className={s.chipHint}>{z.hint}</span>
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default function Field({ field, answers, onPatch, config }) {
  if (field.showIf && !field.showIf(answers)) return null;
  const value = answers[field.id];
  // Updater functions read the latest answers, so quick consecutive clicks never clobber each other.
  const onChange = (v) => onPatch(typeof v === "function" ? (a) => ({ [field.id]: v(a[field.id]) }) : { [field.id]: v });
  switch (field.type) {
    case "cards":
      return <Cards field={field} value={value} onChange={onChange} />;
    case "chips":
      return <Chips field={field} value={value} onChange={onChange} />;
    case "area":
      return <Area field={field} value={value} onChange={onChange} />;
    case "number":
      return <NumberField field={field} value={value} onChange={onChange} />;
    case "counter":
      return <Counter field={field} value={value} onChange={onChange} />;
    case "toggle":
      return <Toggle field={field} value={value} onChange={onChange} />;
    case "extras":
      return <Extras field={field} value={value} onChange={onChange} config={config} />;
    case "location":
      return <Location answers={answers} onPatch={onPatch} />;
    default:
      return null;
  }
}
