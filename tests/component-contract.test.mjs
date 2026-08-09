import assert from "node:assert/strict"
import test from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

import {
  Choice,
  ChoiceGroup,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  Fieldset,
  Select,
} from "../dist/index.js"
import { readRoot, readUiSource } from "./lib/source.mjs"

test("sidebar internal buttons never submit ancestor forms and expose disclosure state", async () => {
  const [shell, content, menu, context] = await Promise.all([
    readUiSource("sidebar/shell"),
    readUiSource("sidebar/content"),
    readUiSource("sidebar/menu"),
    readUiSource("sidebar/context"),
  ])
  assert.match(
    shell,
    /function SidebarTrigger[\s\S]*aria-expanded=\{isMobile \? openMobile : state === "expanded"\}[\s\S]*aria-controls=\{sidebarId\}/
  )
  assert.match(
    shell,
    /function SidebarRail[\s\S]*type="button"[\s\S]*aria-expanded=\{state === "expanded"\}[\s\S]*aria-controls=\{sidebarId\}/
  )
  assert.match(content, /function SidebarGroupAction[\s\S]*type: "button"/)
  assert.match(menu, /function SidebarMenuButton[\s\S]*type: "button"/)
  assert.match(menu, /function SidebarMenuAction[\s\S]*type: "button"/)
  assert.match(context, /sidebarId: string/)
})

test("sidebar keyboard shortcut ignores editable targets", async () => {
  const context = await readUiSource("sidebar/context")
  assert.match(context, /target instanceof Element/)
  assert.match(context, /target\.matches\("input, textarea, select"\)/)
  assert.match(context, /target\.closest\(/)
  assert.match(context, /contenteditable/)
})

test("mobile detection uses the same media-query snapshot for subscription and reads", async () => {
  const source = await readRoot("src/hooks/use-mobile.ts")

  assert.match(source, /const MOBILE_QUERY =/)
  assert.match(
    source,
    /useSyncExternalStore\(subscribe, getSnapshot, getServerSnapshot\)/
  )
  assert.match(source, /window\.matchMedia\(MOBILE_QUERY\)\.matches/)
  assert.doesNotMatch(source, /window\.innerWidth/)
})

test("skeleton output and hidden ellipses are deterministic", async () => {
  const [sidebarMenu, pagination, breadcrumb] = await Promise.all([
    readUiSource("sidebar/menu"),
    readUiSource("pagination"),
    readUiSource("breadcrumb"),
  ])
  assert.doesNotMatch(sidebarMenu, /Math\.random/)
  assert.match(sidebarMenu, /width = "70%"/)
  assert.doesNotMatch(pagination, /sr-only[^\n]*More/)
  assert.doesNotMatch(breadcrumb, /sr-only[^\n]*More/)
})

test("modal contracts include localization, scrolling, and safe areas", async () => {
  const [dialog, sheet] = await Promise.all([
    readUiSource("dialog"),
    readUiSource("sheet"),
  ])
  assert.match(dialog, /closeLabel = "Close"/)
  assert.match(dialog, /max-h-\[calc\(100dvh-env\(safe-area-inset-top\)/)
  assert.match(sheet, /closeLabel = "Close"/)
  assert.match(sheet, /overflow-y-auto/)
  assert.match(sheet, /safe-area-inset-bottom/)
  assert.match(sheet, /SheetOverlay,[\s\S]*SheetPortal,/)
})

test("sheets expose reusable overlays and typed horizontal sizes", async () => {
  const [index, sheet] = await Promise.all([
    readRoot("src/index.ts"),
    readUiSource("sheet"),
  ])
  assert.match(sheet, /type SheetSize = "sm" \| "md" \| "full"/)
  assert.match(sheet, /overlayClassName\?: string/)
  assert.match(sheet, /side = "right"/)
  assert.match(sheet, /size = "sm"/)
  assert.match(sheet, /<SheetOverlay className=\{overlayClassName\} \/>/)
  assert.match(sheet, /sm: "[^"]*w-3\/4[^"]*sm:max-w-sm/)
  assert.match(sheet, /md: "[^"]*w-full[^"]*sm:max-w-lg/)
  assert.match(sheet, /full: "[^"]*w-full[^"]*max-w-none/)
  assert.match(index, /export type \{ SheetContentProps, SheetSize \}/)
  assert.doesNotMatch(sheet, /navigation/i)
})

test("field, choice, and select primitives retain native server-rendered semantics", () => {
  assert.match(
    renderToStaticMarkup(
      React.createElement(FieldLabel, { htmlFor: "email" }, "Email")
    ),
    /^<label/
  )
  assert.match(
    renderToStaticMarkup(
      React.createElement(FieldDescription, { id: "hint" }, "Hint")
    ),
    /^<p/
  )
  assert.match(
    renderToStaticMarkup(
      React.createElement(FieldError, { id: "error" }, "Error")
    ),
    /^<p/
  )
  assert.match(
    renderToStaticMarkup(React.createElement(Fieldset)),
    /^<fieldset/
  )
  assert.match(
    renderToStaticMarkup(React.createElement(FieldLegend, null, "Options")),
    /^<legend/
  )
  assert.match(
    renderToStaticMarkup(
      React.createElement(Choice, { type: "radio", name: "plan" })
    ),
    /<input type="radio"/
  )
  assert.match(
    renderToStaticMarkup(React.createElement(ChoiceGroup)),
    /^<fieldset/
  )
  assert.match(
    renderToStaticMarkup(React.createElement(Select, { "aria-invalid": true })),
    /^<select/
  )
})

test("built-in modal closes reserve title space without taxing custom composition", async () => {
  const [dialog, sheet] = await Promise.all([
    readUiSource("dialog"),
    readUiSource("sheet"),
  ])
  assert.match(
    dialog,
    /showCloseButton &&\s+"\[&>\[data-slot=dialog-header\]\]:pr-12 \[&>\[data-slot=dialog-title\]\]:pr-12"/
  )
  assert.match(
    sheet,
    /showCloseButton &&\s+"\[&>\[data-slot=sheet-header\]\]:pr-16 \[&>\[data-slot=sheet-title\]\]:pr-16"/
  )
  const dialogHeader = dialog.slice(
    dialog.indexOf("function DialogHeader"),
    dialog.indexOf("function DialogFooter")
  )
  const sheetHeader = sheet.slice(
    sheet.indexOf("function SheetHeader"),
    sheet.indexOf("function SheetFooter")
  )
  assert.doesNotMatch(dialogHeader, /\bpr-\d/)
  assert.doesNotMatch(sheetHeader, /\bpr-\d/)
})
