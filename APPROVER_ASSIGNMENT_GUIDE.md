# Document Approver Assignment Guide

## 👥 **Available Users in App:**

### **Location**: `src/data/mockData.ts` (lines 49-86)

```typescript
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'fms-admin@edaratgroup.com',
    role: 'admin',              // ← ADMIN
    department: 'Information Technology',
    avatar: 'https://...'
  },
  {
    id: '2', 
    name: 'Ahmed Al-Rashid',
    email: 'fms-hr@edaratgroup.com',
    role: 'manager',            // ← MANAGER
    department: 'Human Resources',
    avatar: 'https://...'
  },
  {
    id: '3',
    name: 'Fatima Al-Zahra', 
    email: 'fms-em001@edaratgroup.com',
    role: 'employee',           // ← EMPLOYEE
    department: 'Human Resources',
    avatar: 'https://...'
  },
  {
    id: '4',
    name: 'ISO Administrator',
    email: 'admini_iso@edaratgroup.com',
    role: 'admin',              // ← ADMIN
    department: 'Quality Management',
    avatar: 'https://...'
  }
];
```

---

## 📋 **How to Assign Approvers to Documents:**

### **Document Structure with Approver:**

```typescript
{
  id: 'iso-1',
  title: 'Quality Policy',
  type: 'Policy',
  fileType: 'pdf',
  fileSize: '1.2 MB',
  department: 'Quality Management System',
  uploadedBy: 'ISO Administrator',
  uploadedAt: new Date('2024-01-10 09:00:00'),
  lastModified: new Date('2024-01-10 09:00:00'),
  accessType: 'public',
  approvalStatus: 'approved',      // ← Status
  tags: ['ISO9000', 'Quality', 'Policy'],
  description: 'Comprehensive quality policy statement.',
  url: '/documents/iso9000/quality-policy.pdf',
  securityLevel: 'Public',
  
  // ↓ APPROVER FIELD ↓
  approver: {
    id: '4',                        // ← User ID
    name: 'ISO Administrator',       // ← User name
    title: 'Quality Manager',        // ← User title/position
    email: 'admini_iso@edaratgroup.com',
    avatar: 'https://...',
    approved: true                   // ← Has this approver approved?
  }
}
```

---

## 🎯 **How to Add Approvers:**

### **Option 1: Assign to Specific Document**

Find the document in `mockISO9000Sections` and add the `approver` field:

```typescript
{
  id: 'iso-3',
  title: 'Management Review',
  // ... other fields ...
  approvalStatus: 'pending',
  
  // Add approver object
  approver: {
    id: '2',                          // Ahmed Al-Rashid (Manager)
    name: 'Ahmed Al-Rashid',
    title: 'HR Manager',
    email: 'fms-hr@edaratgroup.com',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?...',
    approved: false                   // Still pending approval
  }
}
```

---

### **Option 2: Assign Approvers by Role**

**For Managers (Ahmed Al-Rashid):**
```typescript
approver: {
  id: '2',
  name: 'Ahmed Al-Rashid',
  title: 'HR Manager',
  email: 'fms-hr@edaratgroup.com',
  avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?...',
  approved: false
}
```

**For Admins (Sarah Johnson):**
```typescript
approver: {
  id: '1',
  name: 'Sarah Johnson',
  title: 'IT Administrator',
  email: 'fms-admin@edaratgroup.com',
  avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?...',
  approved: false
}
```

**For Admins (ISO Administrator):**
```typescript
approver: {
  id: '4',
  name: 'ISO Administrator',
  title: 'Quality Manager',
  email: 'admini_iso@edaratgroup.com',
  avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?...',
  approved: false
}
```

---

## 📊 **Current Approver Assignments:**

### **ISO9000 Documents:**

Currently, **NONE** of the ISO9000 documents have approvers assigned! ❌

**You need to add the `approver` field to each document.**

---

## ✅ **Recommended Approver Assignment:**

### **By Department Logic:**

| Section | Recommended Approver | Why |
|---------|---------------------|-----|
| Quality Management System | ISO Administrator (Admin) | Owns quality management |
| Document Control | ISO Administrator (Admin) | Controls all documentation |
| Internal Audits | ISO Administrator (Admin) | Oversees compliance |
| Training & Competence | Ahmed Al-Rashid (Manager) | HR department |
| Customer Satisfaction | Ahmed Al-Rashid (Manager) | Customer relations |
| Continuous Improvement | ISO Administrator (Admin) | Process oversight |
| Risk Management | Sarah Johnson (Admin) | IT/Security expertise |
| Process Management | ISO Administrator (Admin) | Process authority |

---

## 🔧 **Example: Assigning Approvers to ISO9000 Documents**

Would you like me to:

1. ✅ **Automatically assign approvers** to all pending ISO9000 documents based on section?
2. ✅ **Show you specific assignments** so you can customize?
3. ✅ **Create helper function** to dynamically assign approvers?

---

## 💡 **Where Approvers Are Displayed:**

### **In Tables:**
- **DocsDB Table**: Shows "Approver" column (managers & admins only)
- **ISO9000 Table**: Shows "Uploaded By" (can add approver column if needed)
- **Pending Approvals Table**: Shows approver with avatar and name

### **In Document Preview:**
- Shows approver information
- Shows approval status
- Allows approval actions (for managers/admins)

---

**Tell me: Would you like me to automatically assign approvers to all pending ISO9000 documents right now?**

I can assign:
- ISO Administrator → Quality, Document, Audit, Process sections
- Ahmed Al-Rashid (Manager) → Training, Customer Satisfaction sections  
- Sarah Johnson (Admin) → Risk Management section
