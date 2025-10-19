# Role-Based Document Management System - Complete Guide

## 🎯 **System Overview**

### **3 User Roles:**
1. **Admin** - Full control, can reassign, restore
2. **Manager** - Can approve assigned documents, view all
3. **Employee** - View only

---

## 👥 **Users in System:**

| ID | Name | Role | Department | Can Approve? |
|----|------|------|------------|--------------|
| **1** | Sarah Johnson | **Admin** | IT | ✅ Yes |
| **2** | Ahmed Al-Rashid | **Manager** | HR | ✅ Yes |
| **3** | Fatima Al-Zahra | Employee | HR | ❌ No |
| **4** | ISO Administrator | **Admin** | Quality | ✅ Yes |

---

## 📋 **Document Assignment System:**

### **Document Fields:**

```typescript
{
  id: 'iso-3',
  title: 'Management Review',
  approvalStatus: 'pending',
  
  // Assignment fields
  assignedTo: '4',              // ← User ID (ISO Administrator)
  assignedDate: new Date(...),  // ← When assigned
  
  // Approver info (same as assigned user)
  approver: {
    id: '4',
    name: 'ISO Administrator',
    title: 'Quality Manager',
    email: 'admini_iso@edaratgroup.com',
    avatar: 'https://...',
    approved: false             // ← Not yet approved
  }
}
```

---

## 🔐 **Admin Role Permissions:**

### ✅ **What Admin CAN Do:**

1. **Pending Approvals Page:**
   - ✅ View ALL pending documents (all users)
   - ✅ See days delayed for each document
   - ✅ Sort any column (asc/desc)
   - ✅ View documents
   - ✅ See security level
   - ✅ Re-assign documents to myself
   - ✅ Approve documents assigned to me ONLY
   - ✅ Restore deleted documents

2. **DocsDB / See More Page:**
   - ✅ Mark status if assigned to me
   - ✅ Edit documents assigned to me
   - ✅ Delete documents assigned to me or unassigned
   - ✅ View all documents

### ❌ **What Admin CANNOT Do:**

1. **Pending Approvals Page:**
   - ❌ Approve from Edit document option
   - ❌ Edit/Delete if assigned to another user
   
2. **DocsDB Page:**
   - ❌ Change status if assigned to another user
   - ❌ Edit/Delete if assigned to another user

---

## 📊 **Pending Approvals Page - Admin View:**

### **Table Columns:**

| Column | Shows | Purpose |
|--------|-------|---------|
| **Document** | Icon + Title + Size • Type | Basic info |
| **Subject** | Department/Section | Category |
| **Assigned To** | User avatar + name | Who must approve |
| **Days Delayed** | Number of days since assigned | Track overdue |
| **Status** | Pending badge | Current state |
| **Security** | Security level badge | Access control |
| **Actions** | Re-assign / View | Available actions |

### **Example Row:**

```
┌──────────────────────────────────────────────────────────────────┐
│ 📄 Management Review    │ Quality   │ 👤 ISO Admin │ 🔴 9 days │
│    1.5 MB • PDF         │ Mgmt Sys  │              │           │
├──────────────────────────────────────────────────────────────────┤
│ ⏳ Pending │ 🔴 Confidential │ [Re-assign to Me] [View]        │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 **Re-assign Functionality:**

### **Flow:**

1. Admin sees document assigned to another user
2. Click "Re-assign to Me" button
3. System:
   - Changes `assignedTo` to current admin's ID
   - Updates `assignedDate` to now
   - Logs activity: "Document re-assigned from [User A] to [User B]"
   - Updates approver field
4. Admin can now approve/edit the document

### **Activity Log Entry:**

```typescript
{
  userId: '1',                      // Sarah Johnson
  userName: 'Sarah Johnson',
  documentId: 'iso-3',
  documentTitle: 'Management Review',
  action: 'reassign',
  oldAssignee: 'ISO Administrator',
  newAssignee: 'Sarah Johnson',
  timestamp: new Date()
}
```

---

## 📊 **Manager Role Permissions:**

### ✅ **What Manager CAN Do:**

1. **Pending Approvals Page:**
   - ✅ View documents assigned to me ONLY
   - ✅ Approve documents assigned to me
   - ✅ View documents
   - ✅ See days delayed

2. **DocsDB Page:**
   - ✅ View all documents
   - ✅ Edit documents assigned to me

### ❌ **What Manager CANNOT Do:**

- ❌ See documents assigned to other users (in Pending Approvals)
- ❌ Re-assign documents
- ❌ Restore deleted documents
- ❌ Edit/Delete documents assigned to others
- ❌ Change status of documents not assigned to them

---

## 👁️ **Employee Role Permissions:**

### ✅ **What Employee CAN Do:**

- ✅ View documents only
- ✅ Read documents
- ✅ Search documents

### ❌ **What Employee CANNOT Do:**

- ❌ Approve anything
- ❌ Edit anything  
- ❌ Delete anything
- ❌ See Pending Approvals page
- ❌ Access admin features

---

## 🎨 **UI Changes Needed:**

### **Pending Approvals Table:**

**Current Columns:**
```
Document | Subject | Submitted | Approver | Actions
```

**New Columns:**
```
Document | Subject | Assigned To | Days Delayed | Status | Security | Actions
```

### **New Action Buttons:**

**For Admins:**
```
[Re-assign to Me] [View]
```

**For Managers:**
```
[Approve] [View]  (only for their assigned docs)
```

**For Employees:**
```
[View]  (if they have access)
```

---

## 🔧 **Implementation Plan:**

### **Step 1: Update Document Data** ✅ (In Progress)
- Add `assignedTo` to all pending documents
- Add `assignedDate` to all pending documents
- Add `approver` object to all pending documents

### **Step 2: Update Pending Approvals Table**
- Add "Days Delayed" column
- Add "Security" column
- Replace "Submitted" with "Assigned To"
- Update actions based on user role

### **Step 3: Add Permission Checks**
- Implement `canEditDocument()`
- Implement `canDeleteDocument()`  
- Implement `canApproveDocument()`
- Implement `canReassignDocument()`

### **Step 4: Add Re-assign Functionality**
- Add "Re-assign to Me" button
- Log activity when re-assigned
- Update document assignment

### **Step 5: Add Restore Functionality**
- Soft delete documents (isDeleted flag)
- Show restore button for admins
- Filter out deleted docs by default

### **Step 6: Filter by Role**
- Admin: See all documents
- Manager: See only their assigned documents
- Employee: Read-only access

---

## 📊 **Document Assignment Examples:**

### **Assigned Documents:**

```typescript
// Assigned to ISO Administrator (ID: 4)
{
  id: 'iso-3',
  title: 'Management Review',
  approvalStatus: 'pending',
  assignedTo: '4',
  assignedDate: new Date('2024-01-11'),
  approver: { id: '4', name: 'ISO Administrator', ... }
}

// Assigned to Ahmed (Manager, ID: 2)
{
  id: 'iso-21',
  title: 'Competence Assessment',
  approvalStatus: 'pending',
  assignedTo: '2',
  assignedDate: new Date('2024-01-22'),
  approver: { id: '2', name: 'Ahmed Al-Rashid', ... }
}

// Assigned to Sarah (Admin, ID: 1)
{
  id: 'iso-39',
  title: 'Risk Mitigation Plan',
  approvalStatus: 'pending',
  assignedTo: '1',
  assignedDate: new Date('2024-01-31'),
  approver: { id: '1', name: 'Sarah Johnson', ... }
}
```

---

## 🎯 **Next Steps:**

**Shall I:**
1. ✅ Assign all 10 pending ISO9000 documents to appropriate users?
2. ✅ Update Pending Approvals table with Days Delayed column?
3. ✅ Add Re-assign functionality?
4. ✅ Implement all permission checks?

**Say YES and I'll complete the entire role-based permission system!** 🚀

