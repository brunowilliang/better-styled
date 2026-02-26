<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/brunowilliang/better-styled/master/apps/docs/assets/logo_dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/brunowilliang/better-styled/master/apps/docs/assets/logo_light.svg">
    <img alt="better-styled" src="https://raw.githubusercontent.com/brunowilliang/better-styled/master/apps/docs/assets/logo_light.svg" width="400">
  </picture>
</p>

<p align="center">
  Type-safe styled components with variant propagation for React and React Native
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/better-styled"><img src="https://img.shields.io/npm/v/better-styled?style=flat-square&color=623791" alt="npm version"></a>
  <a href="https://github.com/brunowilliang/better-styled/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/better-styled?style=flat-square&color=623791" alt="license"></a>
  <a href="https://www.npmjs.com/package/better-styled"><img src="https://img.shields.io/npm/dm/better-styled?style=flat-square&color=623791" alt="downloads"></a>
</p>

## Installation

```bash
npm install better-styled
# or
yarn add better-styled
# or
pnpm add better-styled
# or
bun add better-styled
```

## Quick Example

```tsx
import { createStyledContext, styled, withSlots } from "better-styled";

const ButtonContext = createStyledContext({
  size: ["sm", "md", "lg"],
});

const ButtonRoot = styled("button", {
  context: ButtonContext,
  base: { className: "px-4 py-2 rounded font-medium" },
  variants: {
    size: {
      sm: { className: "text-sm h-8" },
      md: { className: "text-base h-10" },
      lg: { className: "text-lg h-12" },
    },
  },
});

const ButtonIcon = styled("span", {
  context: ButtonContext,
  variants: {
    size: {
      sm: { className: "w-4 h-4" },
      md: { className: "w-5 h-5" },
      lg: { className: "w-6 h-6" },
    },
  },
});

export const Button = withSlots(ButtonRoot, { Icon: ButtonIcon });

// Icon automatically inherits size from Button
<Button size="lg">
  <Button.Icon>★</Button.Icon>
  Click me
</Button>;
```

## Documentation

Full documentation at [better-styled.com](https://better-styled.com)

## License

MIT
