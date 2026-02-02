---
name: better-styled
description: Create type-safe styled components with variants, context propagation, and slots for React and React Native. Use when building component libraries, design systems, or when needing automatic variant inheritance between parent and child components.
license: MIT
compatibility: React, React Native, TypeScript, Tailwind CSS, NativeWind, Uniwind
metadata:
  author: Bruno Garcia
  version: "2.0"
  npm: better-styled
  github: brunowilliang/better-styled
---

# better-styled

A library for creating type-safe styled components with variant support for React and React Native.

## When to Use

Use better-styled when you need:

- **Variant-based components** - Define size, color, state variants with type safety
- **Context propagation** - Parent components automatically share variants with children (e.g., Button size affects Icon size)
- **Compound components** - Build components with dot notation like `<Card.Header>`
- **React Native support** - Same API works with NativeWind or Uniwind
- **Tailwind conflict resolution** - Automatic class merging with tailwind-merge

## When NOT to Use

- Simple one-off styling (use regular className)
- Components without variants
- Projects not using Tailwind CSS

## Core API

### styled()

Creates a styled component with variant support.

```tsx
import { styled } from "better-styled";

const Button = styled("button", {
  base: { className: "px-4 py-2 rounded font-medium" },
  variants: {
    size: {
      sm: { className: "text-sm h-8" },
      md: { className: "text-base h-10" },
      lg: { className: "text-lg h-12" },
    },
    variant: {
      primary: { className: "bg-blue-600 text-white" },
      secondary: { className: "bg-gray-200 text-gray-900" },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

// Usage
<Button size="lg" variant="secondary">Click me</Button>
```

### createStyledContext()

Creates a context for sharing variants between parent and child components.

```tsx
import { styled, createStyledContext } from "better-styled";

const ButtonContext = createStyledContext({
  size: ["sm", "md", "lg"],
  variant: ["primary", "secondary"],
});

const Button = styled("button", {
  context: ButtonContext,
  variants: {
    size: {
      sm: { className: "text-sm px-2" },
      md: { className: "text-base px-4" },
      lg: { className: "text-lg px-6" },
    },
  },
});

const ButtonIcon = styled("span", {
  context: ButtonContext, // Inherits size from Button
  variants: {
    size: {
      sm: { className: "w-4 h-4" },
      md: { className: "w-5 h-5" },
      lg: { className: "w-6 h-6" },
    },
  },
});

// Icon automatically gets size="lg" from parent Button
<Button size="lg">
  <ButtonIcon>★</ButtonIcon>
  Submit
</Button>
```

### withSlots()

Attaches child components as static properties for dot notation.

```tsx
import { styled, withSlots } from "better-styled";

const CardRoot = styled("div", {
  base: { className: "rounded-lg border p-4" },
});

const CardHeader = styled("div", {
  base: { className: "font-bold text-lg mb-2" },
});

const CardBody = styled("div", {
  base: { className: "text-gray-600" },
});

export const Card = withSlots(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
});

// Usage with dot notation
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content here</Card.Body>
</Card>
```

### Utility Functions

```tsx
import { cn, mergeFinalProps, mergeStyles } from "better-styled";

// cn() - Merge classes with Tailwind conflict resolution
cn("px-4 py-2", "px-8"); // → "py-2 px-8"

// mergeStyles() - Merge style objects
mergeStyles({ padding: 16 }, { padding: 32 }); // → { padding: 32 }

// mergeFinalProps() - Merge props with special handling
mergeFinalProps(
  { className: "p-4", onClick: () => console.log("a") },
  { className: "p-8", onClick: () => console.log("b") }
);
// → { className: "p-8", onClick: [composed function] }
```

## React Native

Same API, just use React Native components:

```tsx
import { Pressable, Text } from "react-native";
import { styled, createStyledContext, withSlots } from "better-styled";

const Button = styled(Pressable, {
  base: { className: "rounded-lg px-4 py-2 bg-blue-600" },
  variants: {
    size: {
      sm: { className: "px-2 py-1" },
      lg: { className: "px-6 py-3" },
    },
  },
});

const ButtonText = styled(Text, {
  base: { className: "text-white font-medium text-center" },
});

export const StyledButton = withSlots(Button, { Text: ButtonText });

// Usage
<StyledButton size="lg">
  <StyledButton.Text>Press me</StyledButton.Text>
</StyledButton>
```

Requires NativeWind or Uniwind for className support.

## Boolean Variants

```tsx
const Input = styled("input", {
  base: { className: "border rounded px-3 py-2" },
  variants: {
    hasError: {
      true: { className: "border-red-500" },
      // false case uses base styles by default
    },
  },
});

<Input hasError />
<Input hasError={false} />
```

## Compound Variants

Apply styles when multiple variants match:

```tsx
const Badge = styled("span", {
  variants: {
    size: { sm: {}, lg: {} },
    color: { blue: {}, red: {} },
  },
  compoundVariants: [
    {
      size: "lg",
      color: "blue",
      props: { className: "ring-2 ring-blue-300" },
    },
  ],
});
```

## Code Patterns

When generating code with better-styled, follow these patterns:

### Component Declaration

```tsx
// Correct - Arrow function without React.FC
const Button = ({ children, ...props }: ButtonProps) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

// Incorrect - Don't use React.FC
const Button: React.FC<ButtonProps> = ({ children }) => { ... };
```

### Type Extraction

```tsx
// Extract props type from styled component
type ButtonProps = React.ComponentProps<typeof Button>;
```

### Context Pattern for Design Systems

```tsx
// 1. Create shared context
const ComponentContext = createStyledContext({
  size: ["sm", "md", "lg"],
  variant: ["default", "outline"],
});

// 2. Use in parent (provides context)
const Parent = styled("div", {
  context: ComponentContext,
  variants: { /* ... */ },
});

// 3. Use in children (consumes context)
const Child = styled("span", {
  context: ComponentContext,
  variants: { /* ... */ },
});
```

## Props Merge Priority

1. `base` (lowest)
2. `variants`
3. `compoundVariants`
4. Direct props (highest)

## Key Differentiators

| Feature | better-styled | Other libs (CVA, TV) |
|---------|---------------|----------------------|
| Context propagation | ✅ Built-in | ❌ Manual |
| Function composition | ✅ Auto-composed | ❌ Override |
| React Native | ✅ Native | ⚠️ Via NativeWind |
| Output | React Component | Class string |
