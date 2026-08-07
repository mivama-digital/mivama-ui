import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axe from "axe-core"
import { describe, expect, it, vi } from "vitest"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "../../src/components/ui/alert.js"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "../../src/components/ui/attachment.js"
import { Badge } from "../../src/components/ui/badge.js"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../src/components/ui/empty.js"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "../../src/components/ui/message.js"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "../../src/components/ui/progress.js"
import { Skeleton } from "../../src/components/ui/skeleton.js"

describe("feedback components", () => {
  it("provides urgent and polite alert semantics without accessibility violations", async () => {
    const { container, rerender } = render(
      <Alert>
        <AlertTitle>Upload failed</AlertTitle>
        <AlertDescription>Try the upload again.</AlertDescription>
        <AlertAction>Retry available</AlertAction>
      </Alert>
    )

    expect(screen.getByRole("alert")).toHaveTextContent("Upload failed")
    expect(screen.getByRole("alert")).toHaveTextContent("Try the upload again.")

    let results = await axe.run(container)
    expect(results.violations).toEqual([])

    rerender(
      <Alert role="status">
        <AlertTitle>Upload complete</AlertTitle>
        <AlertDescription>Your file is ready.</AlertDescription>
      </Alert>
    )

    expect(screen.getByRole("status")).toHaveTextContent("Upload complete")
    results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it("exposes attachment state and keeps its full-surface trigger keyboard accessible", async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    const { container } = render(
      <Attachment state="processing" size="sm" orientation="vertical">
        <AttachmentMedia aria-hidden="true">PDF</AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>proposal.pdf</AttachmentTitle>
          <AttachmentDescription>Processing</AttachmentDescription>
        </AttachmentContent>
        <AttachmentTrigger aria-label="Open proposal" onClick={onOpen} />
      </Attachment>
    )

    const attachment = container.querySelector('[data-slot="attachment"]')
    expect(attachment).toHaveAttribute("data-state", "processing")
    expect(attachment).toHaveAttribute("data-size", "sm")
    expect(attachment).toHaveAttribute("data-orientation", "vertical")

    const trigger = screen.getByRole("button", { name: "Open proposal" })
    expect(trigger).toHaveAttribute("type", "button")
    trigger.focus()
    expect(trigger).toHaveFocus()
    await user.keyboard("{Enter}")
    expect(onOpen).toHaveBeenCalledTimes(1)

    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it("supports polymorphic badges while retaining link semantics", async () => {
    const { container } = render(
      <Badge variant="outline" wrap render={<a href="/status" />}>
        Deployment status
      </Badge>
    )

    const link = screen.getByRole("link", { name: "Deployment status" })
    expect(link).toHaveAttribute("href", "/status")
    expect(link).toHaveAttribute("data-slot", "badge")
    expect(link).toHaveAttribute("data-variant", "outline")

    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it("composes empty states and message metadata without changing native semantics", async () => {
    const { container } = render(
      <>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon" aria-hidden="true">
              ?
            </EmptyMedia>
            <EmptyTitle>No messages</EmptyTitle>
            <EmptyDescription>
              New conversations will appear here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>Start a new conversation.</EmptyContent>
        </Empty>
        <MessageGroup aria-label="Conversation">
          <Message align="end">
            <MessageAvatar aria-hidden="true">MS</MessageAvatar>
            <MessageContent>
              <MessageHeader>Mykhailo</MessageHeader>
              <p>Ready for review.</p>
              <MessageFooter>Just now</MessageFooter>
            </MessageContent>
          </Message>
        </MessageGroup>
      </>
    )

    const message = container.querySelector('[data-slot="message"]')
    expect(message).toHaveAttribute("data-align", "end")
    expect(screen.getByText("No messages")).toBeVisible()
    expect(screen.getByText("Ready for review.")).toBeVisible()

    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it("exposes progress value and label through native progressbar semantics", async () => {
    const { container } = render(
      <Progress value={64}>
        <ProgressLabel>Uploading</ProgressLabel>
        <ProgressValue />
      </Progress>
    )

    const progress = screen.getByRole("progressbar", { name: "Uploading" })
    expect(progress).toHaveAttribute("aria-valuenow", "64")
    expect(progress).toHaveAttribute("aria-valuetext", "64%")
    expect(screen.getByText("Uploading")).toBeVisible()

    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it("keeps decorative skeletons opt-out friendly and forwards DOM attributes", () => {
    render(
      <Skeleton
        aria-hidden="true"
        data-testid="loading-placeholder"
        className="min-h-8"
      />
    )

    const skeleton = screen.getByTestId("loading-placeholder")
    expect(skeleton).toHaveAttribute("data-slot", "skeleton")
    expect(skeleton).toHaveAttribute("aria-hidden", "true")
    expect(skeleton).toHaveClass("min-h-8")
  })
})
