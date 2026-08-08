import {
  Alert,
  AlertDescription,
  AlertTitle,
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentTitle,
  AttachmentTrigger,
  Badge,
  BentoGrid,
  BentoGridItem,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Choice,
  ChoiceGroup,
  Container,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  EditorialGrid,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Eyebrow,
  Field,
  FieldDescription,
  FieldLabel,
  Heading,
  Input,
  Message,
  MessageContent,
  MessageFooter,
  MessageHeader,
  MivamaProvider,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Progress,
  ProgressLabel,
  ProgressValue,
  ScrollLayer,
  ScrollScene,
  Section,
  Select,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  Skeleton,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../src/index.js"

export function MivamaProviderExample() {
  return (
    <MivamaProvider theme="editorial" density="compact" className="rounded-xl border p-6">
      <Heading variant="title">Provider shell</Heading>
      <Text>The provider owns theme, density, and portal context.</Text>
    </MivamaProvider>
  )
}

export function AlertExample() {
  return (
    <Alert className="max-w-md">
      <AlertTitle>Deployment complete</AlertTitle>
      <AlertDescription>The production build passed all required checks.</AlertDescription>
    </Alert>
  )
}

export function AttachmentExample() {
  return (
    <Attachment>
      <AttachmentTrigger aria-label="Open quarterly-report.pdf" />
      <AttachmentContent>
        <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
        <AttachmentDescription>2.4 MB · PDF</AttachmentDescription>
      </AttachmentContent>
    </Attachment>
  )
}

export function BadgeExample() {
  return <Badge>Stable</Badge>
}

export function BentoGridExample() {
  return (
    <BentoGrid className="w-[44rem] max-w-full">
      <BentoGridItem className="rounded-xl border bg-card p-5">Primary story</BentoGridItem>
      <BentoGridItem className="rounded-xl border bg-card p-5">Supporting story</BentoGridItem>
      <BentoGridItem className="rounded-xl border bg-card p-5">Signal</BentoGridItem>
    </BentoGrid>
  )
}

export function BreadcrumbExample() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Library</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Components</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function ButtonExample() {
  return <Button>Continue</Button>
}

export function CardExample() {
  return (
    <Card className="w-[24rem] max-w-full">
      <CardHeader>
        <CardTitle>Design-system card</CardTitle>
        <CardDescription>Use one surface primitive for grouped content.</CardDescription>
      </CardHeader>
      <CardContent>
        <Text>Card spacing and surface tokens respond to theme and density.</Text>
      </CardContent>
    </Card>
  )
}

export function ChoiceExample() {
  return (
    <ChoiceGroup className="w-72">
      <legend className="text-sm font-medium">Notification level</legend>
      <label className="flex items-center gap-2">
        <Choice type="radio" name="notification-level" defaultChecked />
        All activity
      </label>
      <label className="flex items-center gap-2">
        <Choice type="radio" name="notification-level" />
        Mentions only
      </label>
    </ChoiceGroup>
  )
}

export function ContainerExample() {
  return (
    <Container size="reading" className="rounded-xl border bg-card py-6">
      <Heading variant="title">Reading container</Heading>
      <Text>Container centralizes responsive width and page gutter behavior.</Text>
    </Container>
  )
}

export function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>Open dialog</DialogTrigger>
      <DialogContent>
        <DialogTitle>Confirm change</DialogTitle>
        <DialogDescription>Focus stays inside the modal until it closes.</DialogDescription>
        <Input aria-label="Change note" placeholder="Optional note" />
      </DialogContent>
    </Dialog>
  )
}

export function EditorialGridExample() {
  return (
    <EditorialGrid className="w-[48rem] max-w-full">
      <Card><CardContent className="p-5">Lead</CardContent></Card>
      <Card><CardContent className="p-5">Analysis</CardContent></Card>
      <Card><CardContent className="p-5">Context</CardContent></Card>
    </EditorialGrid>
  )
}

export function EmptyExample() {
  return (
    <Empty className="w-[28rem] max-w-full">
      <EmptyHeader>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>Create the first project to start organizing work.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export function FieldExample() {
  return (
    <Field className="w-80 max-w-full">
      <FieldLabel htmlFor="storybook-email">Email</FieldLabel>
      <Input id="storybook-email" type="email" placeholder="name@example.com" />
      <FieldDescription>Used for release notifications.</FieldDescription>
    </Field>
  )
}

export function InputExample() {
  return <Input className="w-80 max-w-full" aria-label="Project name" placeholder="Project name" />
}

export function MessageExample() {
  return (
    <Message className="w-[28rem] max-w-full">
      <MessageContent>
        <MessageHeader>Release bot · now</MessageHeader>
        <div className="rounded-xl bg-muted px-3 py-2">All package checks passed.</div>
        <MessageFooter>Delivered</MessageFooter>
      </MessageContent>
    </Message>
  )
}

export function PaginationExample() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
        <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
        <PaginationItem><PaginationNext href="#" /></PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export function ProgressExample() {
  return (
    <Progress value={68} className="w-80 max-w-full">
      <ProgressLabel>Migration</ProgressLabel>
      <ProgressValue />
    </Progress>
  )
}

export function ScrollSceneExample() {
  return (
    <ScrollScene className="w-[32rem] max-w-full rounded-xl border bg-card p-6">
      <ScrollLayer effect="reveal" distance={16}>
        <Heading variant="title">Progressive motion</Heading>
        <Text>Scroll effects fall back cleanly and respect reduced motion.</Text>
      </ScrollLayer>
    </ScrollScene>
  )
}

export function SectionExample() {
  return (
    <Section density="compact" className="w-[40rem] max-w-full rounded-xl border">
      <Container size="reading">
        <Heading variant="title">Section rhythm</Heading>
        <Text>Section owns vertical rhythm without fixing document semantics.</Text>
      </Container>
    </Section>
  )
}

export function SelectExample() {
  return (
    <Select className="w-80 max-w-full" aria-label="Environment" defaultValue="production">
      <option value="preview">Preview</option>
      <option value="production">Production</option>
    </Select>
  )
}

export function SeparatorExample() {
  return (
    <div className="w-80 max-w-full">
      <Text>Overview</Text>
      <Separator className="my-4" />
      <Text>Details</Text>
    </div>
  )
}

export function SheetExample() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger>
      <SheetContent>
        <SheetTitle>Project details</SheetTitle>
        <SheetDescription>Sheet uses the same modal focus contract as Dialog.</SheetDescription>
        <Input aria-label="Project title" placeholder="Project title" />
      </SheetContent>
    </Sheet>
  )
}

function SidebarNavigation() {
  return (
    <>
      <SidebarHeader><strong>Workspace</strong></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem><SidebarMenuButton isActive>Dashboard</SidebarMenuButton></SidebarMenuItem>
              <SidebarMenuItem><SidebarMenuButton>Projects</SidebarMenuButton></SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>mivama-ui</SidebarFooter>
    </>
  )
}

export function SidebarExample() {
  return (
    <div className="h-80 w-[52rem] max-w-full overflow-hidden rounded-xl border">
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="none"><SidebarNavigation /></Sidebar>
        <SidebarInset className="min-h-80 p-6">
          <Heading variant="title">Static sidebar</Heading>
          <Text>Use the responsive shell for application navigation.</Text>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

export function SidebarCollapsibleExample() {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" mobileTitle="Storybook navigation" mobileDescription="Navigation example for the Sidebar component.">
        <SidebarNavigation />
        <SidebarRail label="Toggle Storybook navigation" />
      </Sidebar>
      <SidebarInset className="min-h-[32rem] p-6">
        <SidebarTrigger label="Toggle Storybook navigation" />
        <Heading variant="title">Collapsible sidebar</Heading>
      </SidebarInset>
    </SidebarProvider>
  )
}

export function SkeletonExample() {
  return (
    <div className="grid w-80 max-w-full gap-3">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}

export function SwitchExample() {
  return (
    <label className="flex items-center gap-3 text-sm font-medium">
      <Switch aria-label="Enable notifications" defaultChecked />
      Enable notifications
    </label>
  )
}

export function TabsExample() {
  return (
    <Tabs defaultValue="overview" className="w-[28rem] max-w-full">
      <TabsList aria-label="Component sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Tabs associate each trigger with one panel.</TabsContent>
      <TabsContent value="accessibility">Arrow keys move between tab triggers.</TabsContent>
    </Tabs>
  )
}

export function TextareaExample() {
  return <Textarea className="w-80 max-w-full" aria-label="Release notes" placeholder="Release notes" />
}

export function TooltipExample() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>Hover or focus</TooltipTrigger>
        <TooltipContent>Keyboard-focusable tooltip target</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function TypographyExample() {
  return (
    <div className="grid w-[36rem] max-w-full gap-3">
      <Eyebrow>Design system</Eyebrow>
      <Heading variant="page">Clear hierarchy without local type scales</Heading>
      <Text>Typography primitives use shared semantic tokens across themes.</Text>
    </div>
  )
}

export function FormsExample() {
  return (
    <div className="grid w-80 max-w-full gap-5">
      <Field>
        <FieldLabel htmlFor="forms-name">Name</FieldLabel>
        <Input id="forms-name" />
        <FieldDescription>Canonical form-field composition.</FieldDescription>
      </Field>
      <Select aria-label="Plan" defaultValue="team">
        <option value="personal">Personal</option>
        <option value="team">Team</option>
      </Select>
      <label className="flex items-center gap-2"><Choice type="checkbox" /> Email updates</label>
      <Textarea aria-label="Notes" placeholder="Notes" />
    </div>
  )
}
