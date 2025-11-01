# Application Structure Analysis & Improvement Plan

## Current Structure Overview

```
src/
├── pages/                    # Route-level pages (Controllers & Master pages)
│   ├── *ControllerPage.tsx  # Feature controllers (Quote, Library, Crew, etc.)
│   ├── aircraft-detail/     # Master pages (CRUD operations)
│   ├── airports/
│   ├── clients/
│   ├── operator/
│   ├── role/
│   ├── user/
│   └── ...
├── features/                # Feature modules (Domain-specific)
│   ├── quotes/
│   │   ├── components/      # Feature-specific components
│   │   ├── hooks/          # Feature-specific hooks
│   │   ├── pages/          # Feature pages (List, Create, Edit)
│   │   └── types.ts
│   ├── library/
│   ├── security/
│   ├── crew-detail/
│   ├── ops/
│   └── ...
├── components/              # Shared UI components
│   ├── DashboardBoardSection.tsx
│   ├── DocumentPreviewDialog.tsx
│   ├── quote-dialog.tsx     # ⚠️ Feature-specific (should be in features/quotes/)
│   └── ...
├── shared/                  # Truly shared code
│   ├── components/
│   ├── hooks/
│   └── types/
├── hooks/                   # App-level hooks (useAppFilter, useDateRangeFilter)
├── interfaces/               # Shared TypeScript interfaces
├── lib/                     # Utilities, GraphQL, configs
└── layouts/                 # Layout components
```

---

## Pros ✅

### 1. **Feature-Based Organization (Partial)**

- ✅ Features directory (`features/quotes/`, `features/library/`) promotes domain-driven structure
- ✅ Self-contained features with components, hooks, and pages
- ✅ Makes it easier to find related code for a feature

### 2. **Controller Pattern**

- ✅ Controller pages separate routing/state management from presentation
- ✅ Consistent pattern for handling filters, search, and tab selection
- ✅ Makes pages reusable and testable

### 3. **Shared vs Feature Separation**

- ✅ `/shared/` folder for cross-cutting concerns
- ✅ `/components/` for reusable UI components
- ✅ Clear separation of concerns in theory

### 4. **Hooks Organization**

- ✅ Feature hooks in `features/*/hooks/`
- ✅ App-level hooks in `/hooks/`
- ✅ Shared utilities in `/shared/hooks/`

---

## Cons ❌

### 1. **Inconsistent Structure**

- ❌ Some features in `/features/` (quotes, library, security)
- ❌ Some features in `/pages/` (aircraft-detail, airports, clients, operator, role, user)
- ❌ **Inconsistency makes it hard to predict where code lives**

### 2. **Mixed Component Placement**

- ❌ Feature-specific components in `/components/`:
  - `quote-dialog.tsx`
  - `quote-preview.tsx`
  - `representative.tsx`
  - `client-form.tsx`
  - `invoice-preview.tsx`
  - `SaleConfirmationPreview.tsx`
- ❌ These should be in their respective `features/*/components/` folders

### 3. **Unclear Component Boundaries**

- ❌ What goes in `/components/` vs `/shared/components/`?
- ❌ No clear criteria for component placement
- ❌ Developers may place components inconsistently

### 4. **Master Pages Not Following Pattern**

- ❌ Master pages (aircraft-detail, airports, etc.) don't follow controller pattern
- ❌ No consistency with feature-based structure
- ❌ Harder to refactor or maintain

### 5. **Routes Scattered**

- ❌ Some routes import from `/pages/` (aircraft-detail, airports)
- ❌ Some routes import from `/features/` (quotes, ops)
- ❌ Controller pages in `/pages/` but they're routing-level, not feature-level

### 6. **Duplicate Patterns**

- ❌ `features/quotes/pages/List.tsx` vs `pages/accounts/List.tsx`
- ❌ Different patterns for similar functionality
- ❌ Creates confusion about which pattern to follow

---

## Recommended Structure (Scalable & Clear)

```
src/
├── app/                     # App-level configuration
│   ├── routes/             # Route definitions (future)
│   ├── providers/          # Context providers ✅
│   │   ├── SessionContext.tsx
│   │   ├── SnackbarContext.tsx
│   │   └── index.ts        # Barrel exports
│   └── store/              # Global state (if using Redux/Zustand) (future)
│
├── features/               # All business features (consistent!)
│   ├── quotes/
│   │   ├── api/            # API calls, queries, mutations
│   │   ├── components/    # Feature-specific components
│   │   ├── hooks/          # Feature hooks
│   │   ├── pages/          # Feature pages (List, Create, Edit)
│   │   ├── types/          # Feature types/interfaces
│   │   └── index.ts        # Public API exports
│   │
│   ├── library/           # Same structure for all features
│   ├── security/
│   ├── crew-detail/
│   ├── aircraft-detail/   # Move from pages/
│   ├── airports/          # Move from pages/
│   ├── clients/           # Move from pages/
│   ├── operator/          # Move from pages/
│   ├── role/              # Move from pages/
│   └── user/              # Move from pages/
│
├── shared/                 # Truly shared across features
│   ├── components/         # Generic UI components
│   │   ├── Dialog/
│   │   ├── Table/
│   │   ├── Form/
│   │   └── ...
│   ├── hooks/              # Generic hooks
│   ├── utils/              # Utility functions
│   ├── types/              # Shared types
│   └── constants/          # Constants
│
├── pages/                  # Route-level pages (ONLY controllers/entry points)
│   ├── QuoteControllerPage.tsx
│   ├── LibraryControllerPage.tsx
│   ├── AircraftControllerPage.tsx  # New controllers for master pages
│   ├── AirportControllerPage.tsx
│   └── ...
│
├── components/             # Legacy or truly app-wide components
│   └── (Keep only if used app-wide, else move to features/)
│
├── lib/                    # Third-party integrations
│   ├── graphql/
│   ├── socket.ts
│   └── utils.ts
│
└── layouts/                # Layout components
    └── dashboard.tsx
```

---

## Improvement Plan

### Phase 1: Consolidate Component Placement (Priority: High)

**Goal:** Move feature-specific components from `/components/` to `/features/`

**Actions:**

1. Move `quote-dialog.tsx` → `features/quotes/components/QuoteDialog.tsx`
2. Move `quote-preview.tsx` → `features/quotes/components/QuotePreview.tsx`
3. Move `representative.tsx` → `features/quotes/components/RepresentativeDialog.tsx`
4. Move `client-form.tsx` → `features/clients/components/ClientForm.tsx` (when moving clients feature)
5. Move `invoice-preview.tsx` → `features/invoices/components/InvoicePreview.tsx`
6. Move `SaleConfirmationPreview.tsx` → `features/quotes/components/SaleConfirmationPreview.tsx`

**Impact:** Clear separation between shared and feature components

---

### Phase 2: Move Master Pages to Features (Priority: High)

**Goal:** Make all features consistent by moving master pages to `/features/`

**Actions:**

1. Move `pages/aircraft-detail/` → `features/aircraft-detail/`

   - Create `AircraftControllerPage.tsx` in `/pages/`
   - Move list, create, edit to `/features/aircraft-detail/pages/`

2. Move `pages/airports/` → `features/airports/`

   - Create `AirportControllerPage.tsx` in `/pages/`

3. Move `pages/clients/` → `features/clients/`

   - Create `ClientControllerPage.tsx` in `/pages/`

4. Move `pages/operator/` → `features/operator/`

   - Create `OperatorControllerPage.tsx` in `/pages/`

5. Move `pages/role/` → `features/role/`

   - Create `RoleControllerPage.tsx` in `/pages/`

6. Move `pages/user/` → `features/user/`
   - Create `UserControllerPage.tsx` in `/pages/`

**Structure Example:**

```
features/
├── aircraft-detail/
│   ├── api/              # GraphQL queries
│   ├── components/       # Aircraft-specific components
│   ├── hooks/
│   │   ├── useAircraftQueries.ts
│   │   └── useAircraftMutations.ts
│   ├── pages/
│   │   ├── List.tsx
│   │   ├── Create.tsx
│   │   └── Edit.tsx
│   └── types.ts

pages/
└── AircraftControllerPage.tsx  # Entry point, filters, search
```

**Impact:** 100% consistency - every feature follows same pattern

---

### Phase 3: Clarify Component Categories (Priority: Medium)

**Goal:** Define clear rules for component placement

**Rules:**

1. **`/shared/components/`** - Generic, reusable across ALL features

   - Dialog wrappers
   - Table components
   - Form inputs
   - Loading states
   - Error boundaries

2. **`/features/*/components/`** - Feature-specific components

   - Components only used within that feature
   - Business logic tied to feature domain

3. **`/components/`** - Legacy or app-wide (deprecate over time)
   - Keep only if truly used app-wide
   - Eventually migrate to `/shared/components/`

**Action:** Document these rules in README or architecture docs

---

### Phase 4: Standardize Feature Structure (Priority: Medium)

**Goal:** Ensure all features follow the same internal structure

**Standard Feature Structure:**

```
features/{feature-name}/
├── api/                   # API calls, GraphQL queries/mutations
├── components/           # Feature-specific UI components
├── hooks/                # Feature hooks (queries, mutations, state)
├── pages/                # Feature pages (List, Create, Edit, View)
├── types/                # Feature TypeScript types/interfaces
├── utils/                # Feature-specific utilities (optional)
└── index.ts              # Public API exports (barrel exports)
```

**Action:** Create a template/boilerplate for new features

---

### Phase 5: Consolidate Hooks (Priority: Low)

**Goal:** Clarify hook placement

**Current:**

- `/hooks/` - App-level hooks
- `/features/*/hooks/` - Feature hooks
- `/shared/hooks/` - Shared hooks

**Rule:**

- **`/features/*/hooks/`** - Feature-specific hooks
- **`/shared/hooks/`** - Generic hooks used by multiple features
- **`/hooks/`** - App-level hooks (session, auth, global state)

**Action:** Move `useAppFilter`, `useDateRangeFilter` to `/shared/hooks/` if used by multiple features

---

### Phase 6: Clean Up Imports (Priority: Low)

**Goal:** Standardize import patterns

**Import Pattern:**

```typescript
// ✅ Good - Feature imports
import { QuoteList } from "@/features/quotes/pages/List";
import { useQuoteData } from "@/features/quotes/hooks/useQuoteData";
import { QuoteDialog } from "@/features/quotes/components/QuoteDialog";

// ✅ Good - Shared imports
import { Dialog } from "@/shared/components/Dialog";
import { useDebounce } from "@/shared/hooks/useDebounce";

// ✅ Good - Controller imports
import { QuoteControllerPage } from "@/pages/QuoteControllerPage";
```

**Action:** Use path aliases (`@/features/`, `@/shared/`, `@/pages/`) for consistency

---

## Decision Matrix: Where Does Code Go?

### Components

| Component Type               | Location                                         | Example                         |
| ---------------------------- | ------------------------------------------------ | ------------------------------- |
| Generic UI (used everywhere) | `/shared/components/`                            | `Button`, `Dialog`, `Table`     |
| Feature-specific             | `/features/{feature}/components/`                | `QuoteDialog`, `InvoicePreview` |
| App-wide layout              | `/components/` (legacy) or `/shared/components/` | `DashboardBoardSection`         |

### Pages

| Page Type                          | Location                     | Example                              |
| ---------------------------------- | ---------------------------- | ------------------------------------ |
| Route entry point (filters, state) | `/pages/*ControllerPage.tsx` | `QuoteControllerPage`                |
| Feature CRUD pages                 | `/features/{feature}/pages/` | `List.tsx`, `Create.tsx`, `Edit.tsx` |

### Hooks

| Hook Type                 | Location                     | Example           |
| ------------------------- | ---------------------------- | ----------------- |
| Feature-specific          | `/features/{feature}/hooks/` | `useQuoteQueries` |
| Used by 2+ features       | `/shared/hooks/`             | `useGqlMutation`  |
| App-level (session, auth) | `/hooks/`                    | `useSession`      |

### Types/Interfaces

| Type Type              | Location                           | Example                      |
| ---------------------- | ---------------------------------- | ---------------------------- |
| Feature-specific       | `/features/{feature}/types/`       | `QuoteFilter`, `QuoteStatus` |
| Shared across features | `/shared/types/`                   | `BaseFilter`, `Pagination`   |
| Global app types       | `/interfaces/` or `/shared/types/` | `User`, `Role`               |

---

## Migration Checklist

### Immediate Actions (Week 1)

- [ ] Move feature-specific components from `/components/` to `/features/`
- [ ] Update imports in affected files
- [ ] Document component placement rules

### Short-term (Month 1)

- [ ] Move one master page (e.g., `aircraft-detail`) to `/features/`
- [ ] Create controller page pattern for moved feature
- [ ] Use as template for other migrations

### Medium-term (Month 2-3)

- [ ] Migrate all master pages to `/features/`
- [ ] Standardize all feature structures
- [ ] Consolidate hooks based on usage

### Long-term (Ongoing)

- [ ] Set up path aliases
- [ ] Create feature templates/boilerplate
- [ ] Document architecture decisions
- [ ] Refactor `/components/` to only app-wide components

---

## Benefits After Migration

1. **Predictability** - Developers know exactly where to find code
2. **Scalability** - Easy to add new features following same pattern
3. **Maintainability** - Consistent structure makes refactoring easier
4. **Team Collaboration** - Clear conventions reduce confusion
5. **Code Reusability** - Clear separation of shared vs feature code
6. **Testing** - Features are self-contained, easier to test

---

## Questions to Consider

1. **Do you want to migrate all at once or incrementally?**

   - Recommendation: Incrementally (one feature at a time)

2. **Should `/components/` folder be deprecated?**

   - Recommendation: Yes, but gradually. Keep only truly app-wide components.

3. **Path aliases?**

   - Recommendation: Yes, use `@/features/`, `@/shared/`, `@/pages/` for cleaner imports

4. **Barrel exports (`index.ts`)?**
   - Recommendation: Yes, for each feature folder to control public API

---

## Next Steps

1. **Review this plan with team**
2. **Choose first feature to migrate** (suggest: `aircraft-detail` or `clients`)
3. **Set up path aliases** in `tsconfig.json` and `vite.config`
4. **Create feature template** for consistency
5. **Start migration** following checklist above

---

**Remember:** Migration is incremental. Don't try to refactor everything at once. Start with one feature, establish the pattern, then apply it to others.
