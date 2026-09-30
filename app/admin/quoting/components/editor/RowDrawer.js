"use client";

import { Lock } from "lucide-react";
import { formatCurrency } from "@/libs/documentFormat";
import { evaluateNumber, lineMargin, lineTotal } from "./quoteModel";
import { Button, Drawer, Field, TextArea, TextInput } from "./ui";

/** Full-size editing for one line item, including its notes. */
export default function RowDrawer({
  item,
  sectionName,
  onChange,
  onClose,
  onDelete,
  onSaveToCatalogue,
}) {
  const numberField = (key, label, placeholder) => (
    <Field label={label}>
      <TextInput
        inputMode="decimal"
        defaultValue={item[key] ?? ""}
        placeholder={placeholder}
        onBlur={(e) => {
          const raw = e.target.value.trim();
          if (raw === "") {
            onChange({ [key]: key === "costPrice" ? null : 0 });
            return;
          }
          const n = evaluateNumber(raw);
          if (n === null) e.target.value = item[key] ?? "";
          else {
            onChange({ [key]: n });
            e.target.value = n;
          }
        }}
        className="text-right tabular-nums"
      />
    </Field>
  );

  const margin = lineMargin(item);

  return (
    <Drawer
      title="Line item"
      onClose={onClose}
      footer={
        <>
          <Button
            variant="ghost"
            className="mr-auto text-[#B42318]"
            onClick={onDelete}
          >
            Delete row
          </Button>
          <Button onClick={onSaveToCatalogue} disabled={!item.name}>
            Save to catalogue
          </Button>
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </>
      }
    >
      <p className="mb-4 text-xs text-[#7A807B]">In “{sectionName}”</p>
      <div className="space-y-4">
        <Field label="Item">
          <TextInput
            value={item.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Item name"
            autoFocus
          />
        </Field>
        <Field label="Description">
          <TextArea
            rows={4}
            value={item.description}
            onChange={(e) => onChange({ description: e.target.value })}
          />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          {numberField("quantity", "Quantity")}
          <Field label="Unit">
            <TextInput
              value={item.unit}
              onChange={(e) => onChange({ unit: e.target.value })}
              placeholder="sqm, day…"
            />
          </Field>
          {numberField("unitPrice", "Rate (£)")}
        </div>
        <div className="flex items-center justify-between rounded bg-[#F4F1EA] px-3 py-2 text-sm">
          <span className="text-[#4A524D]">Line total</span>
          <span className="font-semibold tabular-nums">
            {formatCurrency(lineTotal(item))}
          </span>
        </div>
        <Field
          label="Note to the client"
          hint="Shown under the item on the quote."
        >
          <TextArea
            rows={2}
            value={item.notes || ""}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="e.g. Includes skip hire and disposal"
          />
        </Field>

        <div className="rounded border border-[#EAD9C8] bg-[#FFFCF5] p-3">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-[#A65B43]">
            <Lock className="h-3.5 w-3.5" /> Internal — never shown to the
            client
          </p>
          <div className="grid grid-cols-2 gap-3">
            {numberField("costPrice", "Unit cost (£)", "Optional")}
            <Field label="Margin">
              <div className="flex h-[38px] items-center justify-end border border-transparent px-2.5 text-sm tabular-nums">
                {margin === null ? "—" : `${margin.toFixed(1)}%`}
              </div>
            </Field>
          </div>
          <Field label="Internal note" className="mt-3">
            <TextArea
              rows={3}
              value={item.internalNote || ""}
              onChange={(e) => onChange({ internalNote: e.target.value })}
              placeholder="Supplier, lead time, assumptions…"
            />
          </Field>
        </div>
      </div>
    </Drawer>
  );
}
