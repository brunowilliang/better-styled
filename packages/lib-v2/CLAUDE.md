# better-styled

Biblioteca para criar componentes React/React Native com variantes tipadas e suporte a Context para compartilhamento de variantes entre parent/child.

## Estrutura

```
src/
├── styled.tsx          # styled(component, config) - cria componente com variantes
├── context.tsx         # createStyledContext(variants) - cria contexto para compartilhar variantes
├── withSlots.tsx       # withSlots(component, slots) - adiciona sub-componentes
├── types/
│   ├── config.ts       # Config, VariantsConfig, CompoundVariant
│   ├── props.ts        # FinalProps, StyledComponent
│   └── context.ts      # StyledContext, StyledContextInput, InferContextValue
└── utils/
    ├── cn.ts           # cn(...classes) - merge de classes Tailwind
    ├── merge.ts        # mergeFinalProps() - merge de props com composição de funções
    └── variants.ts     # resolveVariantProps(), resolveCompoundVariantProps()
```

## API Principal

### `createStyledContext(variants)`

Cria um contexto para compartilhar variantes entre componentes pai/filho.

```tsx
// Usa arrays para definir os valores possíveis
// Use ["boolean"] para variantes booleanas
const ButtonContext = createStyledContext({
  variant: ["primary", "secondary", "outline"],  // → "primary" | "secondary" | "outline"
  size: ["sm", "md", "lg"],                      // → "sm" | "md" | "lg"
  isDisabled: ["boolean"],                       // → boolean (true/false)
});

// Retorna:
// {
//   Context: React.Context<InferContextValue<T> | null>
//   Provider: Context.Provider
//   useVariants: () => InferContextValue<T> | null
//   variantKeys: T  // preserva os arrays originais para inferência de tipos
// }
```

**Importante:** Não precisa usar `as const`! O tipo genérico `<const T>` infere automaticamente os literais.

### `styled(component, config)`

Cria um componente estilizado com suporte a variantes.

```tsx
// SEM context - variantes locais
const Button = styled("button", {
  base: { className: "px-4 py-2 rounded" },
  variants: {
    size: {
      sm: { className: "text-sm" },
      lg: { className: "text-lg" },
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

// COM context - variantes compartilhadas
const StyledButton = styled(Pressable, {
  context: ButtonContext,  // ← Conecta ao contexto
  base: { className: "flex-row items-center justify-center" },
  variants: {
    variant: {
      primary: { className: "bg-blue-500" },
      secondary: { className: "bg-gray-500" },
    },
    isDisabled: {
      true: { className: "opacity-50", disabled: true },   // ← Para ["boolean"]
      false: { disabled: false },
    },
  },
  defaultVariants: {
    variant: "primary",
    isDisabled: false,  // ← boolean para ["boolean"]
  },
});
```

### `withSlots(component, slots)`

Adiciona sub-componentes como propriedades.

```tsx
export const Button = withSlots(StyledButton, {
  Label: StyledButtonText,
  Icon: StyledButtonIcon,
});

// Uso:
<Button variant="primary">
  <Button.Icon name="check" />
  <Button.Label>Click me</Button.Label>
</Button>
```

## Sistema de Tipos

### Tipos de Contexto (`types/context.ts`)

```tsx
// Opção de variante - "boolean" é especial
type VariantOption = "boolean" | (string & {})

// Input do createStyledContext
type StyledContextInput = Record<string, readonly VariantOption[]>

// Converte arrays para unions
// { variant: ["a", "b"] } → { variant: "a" | "b" }
// { disabled: ["boolean"] } → { disabled: boolean }
type InferContextValue<T extends StyledContextInput> = {
  [K in keyof T]: T[K] extends readonly ["boolean"] ? boolean : T[K][number]
}

// Tipo do contexto retornado
type StyledContext<T extends StyledContextInput> = {
  Context: Context<InferContextValue<T> | null>
  Provider: Context<InferContextValue<T> | null>["Provider"]
  useVariants: () => InferContextValue<T> | null
  variantKeys: T
}
```

### Overloads do `styled()` (`styled.tsx`)

```tsx
// Overload 1: COM context
// O tipo Input é inferido de config.context.variantKeys
function styled<T extends ElementType, const Input extends StyledContextInput>(
  component: T,
  config: ConfigWithContext<T, Input>,
): StyledComponentWithContext<T, Input>;

// Overload 2: SEM context
// Usa <const V> para inferir tipos literais das variantes
function styled<T extends ElementType, const V extends VariantsConfig<T>>(
  component: T,
  config: ConfigWithoutContextTyped<T, V>,
): StyledComponentWithoutContext<T, V>;
```

### Tipos para `styled()` SEM context

```tsx
// Config de variantes - mapeia nomes para valores possíveis
type VariantsConfig<T extends ElementType> = {
  [variantName: string]: {
    [value: string]: VariantProps<T>;
  };
};

// Detecta se uma variante tem keys booleanas (true/false)
type HasBooleanKeys<V> = "true" extends keyof V ? true : "false" extends keyof V ? true : false;

// Extrai apenas keys string de um objeto
type StringKeys<V> = Extract<keyof V, string>;

// Infere defaultVariants - boolean se tem true/false, senão union de keys
type InferDefaultVariants<V extends VariantsConfig<ElementType>> = {
  [K in keyof V]?: HasBooleanKeys<V[K]> extends true
    ? boolean
    : StringKeys<V[K]>;
};

// Infere props de variantes para o componente
type InferVariantProps<V extends VariantsConfig<ElementType>> = {
  [K in keyof V]?: HasBooleanKeys<V[K]> extends true
    ? boolean
    : StringKeys<V[K]>;
};
```

### Mapeamento de Tipos para Variants

```tsx
// Para arrays de string: { [value]?: Props }
// variant: ["primary", "secondary"]
// → variants: { variant: { primary?: Props, secondary?: Props } }

// Para ["boolean"]: { true?: Props, false?: Props }
// isDisabled: ["boolean"]
// → variants: { isDisabled: { true?: Props, false?: Props } }

type VariantsConfigFromInput<T, Input> = {
  [K in keyof Input]?: Input[K] extends readonly ["boolean"]
    ? { true?: VariantProps<T>; false?: VariantProps<T> }
    : { [V in Input[K][number]]?: VariantProps<T> };
};
```

## Fluxo de Rendering

```
styled(component, { context, base, variants, defaultVariants })
  ↓
Componente renderiza:
  1. useVariants() busca valores do contexto (se houver)
  2. Merge: defaultVariants → contextVariants → props diretas
  3. Resolve props das variantes ativas
  4. Resolve compound variants
  5. Merge final: base → variants → compounds → direct
  6. Se tem context E recebeu variant props → wrapa com Provider
  7. createElement(component, finalProps)
```

## Compound Variants

Compound variants permitem aplicar props quando uma combinação específica de variantes está ativa.

```tsx
const Button = styled(Pressable, {
  // ...
  variants: {
    variant: {
      primary: { className: "bg-blue-500" },
      secondary: { className: "bg-gray-500" },
    },
    size: {
      sm: { className: "p-2" },
      lg: { className: "p-6" },
    },
    isDisabled: {
      true: { className: "opacity-50" },
      false: {},
    },
  },
  compoundVariants: [
    {
      // Quando variant="primary" E size="lg"
      variant: "primary",
      size: "lg",
      props: { className: "shadow-lg" },
    },
    {
      // Quando variant="secondary" E isDisabled=true
      variant: "secondary",
      isDisabled: true,
      props: { className: "bg-gray-300" },
    },
  ],
});
```

### Tipos do compoundVariants

```tsx
// O tipo usa props? opcional para melhor autocomplete na IDE
type CompoundVariant<T extends ElementType, V extends VariantsConfig<T>> = {
  [K in keyof V]?: HasBooleanKeys<V[K]> extends true
    ? boolean
    : StringKeys<V[K]>;
} & {
  props?: VariantProps<T>;  // ← Opcional para mostrar todas as keys no autocomplete
};
```

**Importante:** O `props` é marcado como opcional (`props?`) no tipo para que o TypeScript mostre todas as keys (variant, size, etc.) no autocomplete. Se fosse `props:` (required), a IDE priorizaria mostrar apenas `props` primeiro.

## Merge de Props

Ordem de prioridade (último vence):

1. `base` - sempre aplicado
2. `variants` - baseado nas variantes ativas
3. `compoundVariants` - quando combinação de variantes bate
4. `directProps` - props passadas diretamente

Comportamento especial:

- `className` → usa `cn()` (tailwind-merge)
- `style` → Object.assign
- `funções` (onClick, etc) → compostas em sequência (todas executam)

## Exemplo SEM Context

Para componentes simples que não precisam compartilhar variantes com filhos:

```tsx
import { styled } from "better-styled";
import { Pressable, Text } from "react-native";

// Variantes são inferidas automaticamente do objeto
const StyledButton = styled(Pressable, {
  base: { className: "flex-row items-center justify-center rounded-xl" },
  variants: {
    variant: {
      primary: { className: "bg-red-500" },
      secondary: { className: "bg-blue-500" },
      outline: { className: "bg-transparent border border-blue-500" },
    },
    size: {
      sm: { className: "p-2" },
      md: { className: "p-4" },
      lg: { className: "p-6" },
    },
    isDisabled: {
      true: { disabled: true, className: "opacity-20" },
      // false é opcional - omitir se não precisa de props específicas
    },
  },
  defaultVariants: {
    variant: "primary",  // ← Autocomplete mostra: "primary" | "secondary" | "outline"
    size: "md",          // ← Autocomplete mostra: "sm" | "md" | "lg"
    // isDisabled: true,  // ← Autocomplete mostra: boolean
  },
  compoundVariants: [
    {
      variant: "primary",  // ← Autocomplete funciona aqui também
      size: "lg",
      props: { className: "shadow-xl" },
    },
  ],
});

// Uso - props têm autocomplete completo
<StyledButton variant="secondary" size="lg" isDisabled={false}>
  <Text>Click me</Text>
</StyledButton>
```

## Exemplo COM Context

```tsx
import { createStyledContext, styled, withSlots } from "better-styled";
import { Pressable, Text } from "react-native";

// 1. Criar contexto com arrays
const ButtonContext = createStyledContext({
  variant: ["primary", "secondary", "outline"],
  size: ["sm", "md", "lg"],
  isDisabled: ["boolean"],
});

// 2. Componente pai com context
const StyledButton = styled(Pressable, {
  context: ButtonContext,
  base: { className: "flex-row items-center justify-center rounded-xl" },
  variants: {
    variant: {
      primary: { className: "bg-blue-500" },
      secondary: { className: "bg-gray-500" },
      outline: { className: "border border-blue-500" },
    },
    size: {
      sm: { className: "p-2" },
      md: { className: "p-4" },
      lg: { className: "p-6" },
    },
    isDisabled: {
      true: { className: "opacity-50", disabled: true },
      false: { disabled: false },
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    isDisabled: false,
  },
});

// 3. Componente filho herda variantes do contexto
const StyledButtonText = styled(Text, {
  context: ButtonContext,
  base: { className: "font-semibold" },
  variants: {
    variant: {
      primary: { className: "text-white" },
      secondary: { className: "text-white" },
      outline: { className: "text-blue-500" },
    },
    size: {
      sm: { className: "text-sm" },
      md: { className: "text-base" },
      lg: { className: "text-lg" },
    },
  },
});

// 4. Exportar com slots
export const Button = withSlots(StyledButton, {
  Label: StyledButtonText,
});

// 5. Uso
<Button variant="primary" size="lg" isDisabled={false}>
  <Button.Label>Click me</Button.Label>
</Button>
```

## Dependências

- `clsx` - concatenação de classes
- `tailwind-merge` - resolve conflitos Tailwind

## Comandos

```bash
bun run build   # Build JS + types
bun run test    # Testes
```
