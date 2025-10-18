# Universal Documents Table Implementation Guide

## 🎯 Overview
Created a fully flexible, reusable `UniversalDocumentsTable` component that can be used across all pages in the application with just different column configurations and mock data.

## ✅ Completed

### 1. Universal Components Created

#### `UniversalDocumentsTable.tsx`
- **Location**: `src/components/UniversalDocumentsTable.tsx`
- **Features**:
  - Configurable columns via props
  - Built-in sorting, selection, and hover states
  - Role-based column visibility
  - Custom action renderers
  - Accessibility features (aria-labels, keyboard navigation)
  - All utility functions included (icons, status colors, date formatting)

#### `tableConfigs.tsx`
- **Location**: `src/components/tableConfigs.tsx`
- **Contains**: Pre-configured column sets for different use cases:
  - `docsDBColumns` - Full-featured table for DocsDB page
  - `pendingApprovalsColumns` - Approval workflow table
  - `folderViewColumns` - Simpler folder document table
  - `isoCardDocumentsColumns` - ISO card documents table
  - `filterColumnsByRole()` - Helper to filter columns by user role

### 2. Pages Updated

#### ✅ DocsDBPage.tsx
- Now uses `UniversalDocumentsTable` with `docsDBColumns`
- Maintains all existing functionality
- Supports role-based column visibility

#### ✅ PendingApprovalsPage.tsx
- Now uses `UniversalDocumentsTable` with `pendingApprovalsColumns`
- Custom "Send Reminder" action button via `customActions` prop
- Simplified codebase (removed ~120 lines of table HTML)

## 🚧 Next Steps

### 3. Update FolderView Page
- Replace existing table with `UniversalDocumentsTable`
- Use `folderViewColumns` configuration
- Maintain document selection functionality

### 4. Update ISO9000Page
- Add table view mode to show documents when card is clicked
- Use `isoCardDocumentsColumns` configuration
- Toggle between card view and table view

### 5. Update ISO2Page
- Same as ISO9000Page
- Add table view on card click

### 6. Update EDCPage
- Same as ISO9000Page and ISO2Page
- Add table view on card click

## 📋 How to Use Universal Table

### Basic Usage

```tsx
import UniversalDocumentsTable from './UniversalDocumentsTable';
import { docsDBColumns, filterColumnsByRole } from './tableConfigs';

<UniversalDocumentsTable
  documents={yourDocuments}
  columns={filterColumnsByRole(docsDBColumns, user?.role)}
  user={user}
  showCheckbox={true}
  showActions={true}
  onDocumentClick={handleClick}
  onView={handleView}
  onEdit={handleEdit}
/>
```

### Custom Actions

```tsx
const renderCustomActions = (document: Document) => {
  return (
    <button onClick={() => doSomething(document)}>
      Custom Action
    </button>
  );
};

<UniversalDocumentsTable
  ...
  customActions={renderCustomActions}
/>
```

### Custom Columns

```tsx
const myColumns: ColumnConfig[] = [
  {
    id: 'title',
    label: 'Document Name',
    sortable: true,
    render: (document, helpers) => (
      <span>{document.title}</span>
    ),
  },
  {
    id: 'date',
    label: 'Upload Date',
    sortable: true,
    render: (document, helpers) => (
      <span>{helpers.formatDateTime(document.uploadedAt)}</span>
    ),
  },
];
```

## 🎨 Benefits

1. **Consistency**: Same table UI/UX across all pages
2. **Maintainability**: Update table in one place
3. **Flexibility**: Easy to customize per use case
4. **Reusability**: Just pass different data and columns
5. **Code Reduction**: ~300 lines removed from various pages
6. **Type Safety**: Full TypeScript support

## 📊 Configuration Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `documents` | `Document[]` | required | Array of documents to display |
| `columns` | `ColumnConfig[]` | required | Column configuration |
| `user` | `User \| null` | - | Current user for role-based features |
| `showCheckbox` | `boolean` | `false` | Show selection checkboxes |
| `showActions` | `boolean` | `true` | Show actions column |
| `selectedDocuments` | `Set<string>` | `new Set()` | Selected document IDs |
| `sortBy` | `string` | `''` | Current sort field |
| `sortOrder` | `'asc' \| 'desc'` | `'asc'` | Sort direction |
| `onDocumentClick` | `function` | - | Handler for document click |
| `onView` | `function` | - | Handler for view action |
| `onEdit` | `function` | - | Handler for edit action |
| `customActions` | `function` | - | Custom actions renderer |

## 🔄 Migration Pattern

### Before
```tsx
<table className="w-full">
  <thead>
    <tr>
      <th>Title</th>
      <th>Type</th>
      ...
    </tr>
  </thead>
  <tbody>
    {documents.map(doc => (
      <tr key={doc.id}>
        <td>{doc.title}</td>
        <td>{doc.type}</td>
        ...
      </tr>
    ))}
  </tbody>
</table>
```

### After
```tsx
<UniversalDocumentsTable
  documents={documents}
  columns={yourColumns}
  user={user}
/>
```

## 🎯 Status

- ✅ Universal Table Component Created
- ✅ Column Configurations Created
- ✅ DocsDBPage Updated
- ✅ PendingApprovalsPage Updated
- ⏳ FolderView Update (In Progress)
- ⏳ ISO9000Page Update (Pending)
- ⏳ ISO2Page Update (Pending)
- ⏳ EDCPage Update (Pending)

