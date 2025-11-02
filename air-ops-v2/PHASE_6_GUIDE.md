# Phase 6: Clean Up Imports - Migration Guide

## ✅ Completed Setup

### 1. Path Aliases Configured

- **`tsconfig.json`** - TypeScript path aliases added
- **`vite.config.mts`** - Vite resolve aliases configured

### 2. Barrel Exports Created

All features now have `index.ts` files for cleaner imports:

- `@/features/quotes`
- `@/features/library`
- `@/features/manuals`
- `@/features/security`
- `@/features/crew-detail`
- `@/features/invoices`
- `@/features/aircraft-detail`
- `@/features/airports`
- `@/features/clients`
- `@/features/operator`
- `@/features/user`
- `@/features/role`

## 📝 Available Path Aliases

```typescript
@/*                  → src/*
@/features/*          → src/features/*
@/shared/*            → src/shared/*
@/pages/*             → src/pages/*
@/components/*        → src/components/*
@/hooks/*             → src/hooks/*
@/lib/*               → src/lib/*
@/interfaces/*        → src/interfaces/*
```

## 🔄 Migration Pattern

### Before:

```typescript
import { LibraryList } from "../features/library/pages/List";
import { useLibraryData } from "../features/library/hooks/useLibraryQueries";
import { LibraryCreate } from "../features/library/pages/Create";
import StatCard from "../components/DashboardBoardSection";
import { useAppFilter } from "../hooks/useAppFilter";
import { DEPARTMENT_TYPES } from "../lib/utils";
```

### After (with barrel exports):

```typescript
import { LibraryList, useLibraryData, LibraryCreate } from "@/features/library";
import StatCard from "@/components/DashboardBoardSection";
import { useAppFilter } from "@/hooks/useAppFilter";
import { DEPARTMENT_TYPES } from "@/lib/utils";
```

### After (without barrel exports):

```typescript
import { LibraryList } from "@/features/library/pages/List";
import { useLibraryData } from "@/features/library/hooks/useLibraryQueries";
import StatCard from "@/components/DashboardBoardSection";
import { useAppFilter } from "@/hooks/useAppFilter";
import { DEPARTMENT_TYPES } from "@/lib/utils";
```

## 🎯 Migration Checklist

### Priority 1: Controller Pages

- [x] `QuoteControllerPage.tsx` - Updated ✅
- [x] `LibraryControllerPage.tsx` - Updated ✅
- [x] `CrewControllerPage.tsx` - Updated ✅
- [ ] `ManualControllerPage.tsx`
- [ ] `SecurityControllerPage.tsx`
- [ ] `AircraftControllerPage.tsx`
- [ ] `AirportControllerPage.tsx`
- [ ] `OperatorControllerPage.tsx`
- [ ] `RoleControllerPage.tsx`
- [ ] `UserControllerPage.tsx`
- [ ] `OpsControllerPage.tsx`

### Priority 2: Feature Pages

- [ ] Update imports within feature pages to use `@/` aliases
- [ ] Use barrel exports where applicable

### Priority 3: Other Pages

- [ ] Update imports in remaining page files
- [ ] Update imports in shared components

## 📚 Usage Examples

### Using Barrel Exports (Recommended)

```typescript
// ✅ Clean - Single import with multiple exports
import {
  LibraryList,
  LibraryCreate,
  LibraryEdit,
  useLibraryData,
} from "@/features/library";

// ✅ Also works with individual imports
import { LibraryList } from "@/features/library";
```

### Using Direct Paths

```typescript
// ✅ Also valid - Direct path import
import { LibraryList } from "@/features/library/pages/List";
import { useLibraryData } from "@/features/library/hooks/useLibraryQueries";
```

### Context and Special Cases

For files at the root of `src/` (like `SessionContext.tsx`, `SnackbarContext.tsx`), you may need to use relative imports:

```typescript
// ✅ Correct for root-level files
import { useSession } from "../SessionContext";
import { useSnackbar } from "../SnackbarContext";

// ❌ Won't work (no alias for root)
import { useSession } from "@/SessionContext";
```

## 🚀 Benefits

1. **Shorter Imports** - No more `../../../`
2. **Easier Refactoring** - Move files without breaking imports
3. **Better IDE Support** - Autocomplete and navigation
4. **Consistent Structure** - Clear import patterns
5. **Barrel Exports** - Cleaner, more maintainable imports

## 📖 Next Steps

1. Gradually update imports in controller pages (Priority 1)
2. Update feature internal imports (Priority 2)
3. Update remaining files (Priority 3)
4. Test to ensure everything works
5. Document final patterns for team

---

**Note:** Migration can be done incrementally. You don't need to update everything at once!
