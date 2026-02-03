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

A library for creating type-safe styled components with variant support for
React and React Native.

## When to Use

Use better-styled when you need:

- **Variant-based components** - Define size, color, state variants with type
  safety
- **Context propagation** - Parent components automatically share variants with
  children (e.g., Button size affects Icon size)
- **Compound components** - Build components with dot notation like
  `<Card.Header>`
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
<Button size="lg" variant="secondary">Click me</Button>;
```

### createStyledContext()

Creates a context for sharing variants between parent and child components.

```tsx
import { createStyledContext, styled } from "better-styled";

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
</Button>;
```

### defaultVariants Propagation

When a parent component has `defaultVariants` and shares context with children,
the children automatically inherit those values—even without explicit props:

```tsx
const ButtonRoot = styled(Pressable, {
  context: ButtonContext,
  variants: {
    variant: {
      primary: { className: "bg-blue-600" },
      secondary: { className: "bg-gray-200" },
    },
  },
  defaultVariants: {
    variant: "primary", // This propagates to children via context
  },
});

const ButtonLabel = styled(Text, {
  context: ButtonContext, // Same context = inherits variants
  variants: {
    variant: {
      primary: { className: "text-white" },
      secondary: { className: "text-gray-900" },
    },
  },
});

// No props needed - children inherit defaultVariants from parent
<ButtonRoot>
  <ButtonLabel>Click me</ButtonLabel> {/* Gets variant="primary" automatically */}
</ButtonRoot>
```

This is powerful for design systems where sensible defaults cascade through the
component tree without repetition.

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
</Card>;
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
  { className: "p-8", onClick: () => console.log("b") },
);
// → { className: "p-8", onClick: [composed function] }
```

## React Native

Same API, just use React Native components:

```tsx
import { Pressable, Text } from "react-native";
import { createStyledContext, styled, withSlots } from "better-styled";

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
</StyledButton>;
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
// ✅ Correct - Arrow function without React.FC
const Button = ({ children, ...props }: ButtonProps) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

// ❌ Incorrect - Never use React.FC
const Button: React.FC<ButtonProps> = ({ children }) => { ... };
```

### Type Inference

Let TypeScript infer types automatically. Don't add manual type annotations:

```tsx
// ✅ Correct - TypeScript infers variant types
const Button = styled("button", {
  variants: {
    size: { sm: {}, md: {}, lg: {} },
  },
});

// ✅ Extract props type when needed
type ButtonProps = React.ComponentProps<typeof Button>;
```

### Variant Naming

Use semantic names. Prefer `variant` over boolean flags:

```tsx
// ✅ Correct - Single variant with all options
variants: {
  variant: {
    solid: { className: "bg-blue-600 text-white" },
    outline: { className: "border-2 border-blue-600 bg-transparent" },
    ghost: { className: "bg-transparent hover:bg-blue-50" },
  },
}

// ❌ Incorrect - Separate booleans for each style
variants: {
  isSolid: { true: { ... } },
  isOutline: { true: { ... } },
  isGhost: { true: { ... } },
}
```

### Boolean Variants

Prefix with `is` or `has` to avoid shadowing native props:

```tsx
// ✅ Correct
isDisabled, isLoading, isActive, hasIcon;

// ❌ Incorrect - Shadows native props
disabled, loading, active;
```

### Context Pattern for Design Systems

```tsx
// 1. Create shared context
const ComponentContext = createStyledContext({
  size: ["sm", "md", "lg"],
  variant: ["solid", "outline", "ghost"],
});

// 2. Use in parent (provides context)
const Parent = styled("div", {
  context: ComponentContext,
  variants: {/* ... */},
});

// 3. Use in children (consumes context)
const Child = styled("span", {
  context: ComponentContext,
  variants: {/* ... */},
});
```

### Single-File Organization

Define context, root, and slots in the same file:

```tsx
// Button.tsx
import { styled, createStyledContext, withSlots } from "better-styled";

// 1. Context
const ButtonContext = createStyledContext({
  size: ["sm", "md", "lg"],
});

// 2. Root
const ButtonRoot = styled("button", {
  context: ButtonContext,
  variants: { size: { ... } },
});

// 3. Slots
const ButtonIcon = styled("span", {
  context: ButtonContext,
  variants: { size: { ... } },
});

// 4. Export
export const Button = withSlots(ButtonRoot, { Icon: ButtonIcon });
```

## Props Merge Priority

1. `base` (lowest)
2. `variants`
3. `compoundVariants`
4. Direct props (highest)

## Key Differentiators

| Feature              | better-styled    | Other libs (CVA, TV) |
| -------------------- | ---------------- | -------------------- |
| Context propagation  | ✅ Built-in      | ❌ Manual            |
| Function composition | ✅ Auto-composed | ❌ Override          |
| React Native         | ✅ Native        | ⚠️ Via NativeWind    |
| Output               | React Component  | Class string         |
