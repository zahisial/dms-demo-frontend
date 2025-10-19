import { User, Document, Department, AuditLog, Notification } from '../types';
import { DocumentAcceptance } from '../types';
import { Award, FileText, Shield, Users, Heart, TrendingUp } from 'lucide-react';

// ISO Document Types
export interface ISO9000Document extends Document {
  sectionTitle?: string;
}
// ISO 2 Document Types
export interface ISO2Document {
  id: string;
  title: string;
  type: string;
  url: string;
}
// EDC Document Types
export interface EDCDocument {
  id: string;
  title: string;
  type: string;
  url: string;
  securityLevel: 'Public' | 'Restricted' | 'Confidential' | 'Top Secret';
}

// CE Document Types
export interface CEDocument extends Document {
  sectionTitle?: string;
}

// ISO 9000 Sections Data  
export interface ISO9000Section {
  id: string;
  title: string;
  color: string;
  icon: React.ComponentType<any>;
  documents: ISO9000Document[];
}

// ISO 2 Sections Data
export interface ISO2Section {
  id: string;
  title: string;
  color: string;
  documents: ISO2Document[];
}
  // EDC Sections Data
export interface EDCSection {
  id: string;
  title: string;
  color: string;
  documents: EDCDocument[];
}

// CE Sections Data
export interface CESection {
  id: string;
  title: string;
  color: string;
  icon: React.ComponentType<any>;
  documents: CEDocument[];
}
  
// Users Data
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'fms-admin@edaratgroup.com',
    password: 'admin123',
    role: 'admin',
    department: 'Information Technology',
   avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1'
  },
  {
    id: '2', 
    name: 'Ahmed Al-Rashid',
    email: 'fms-hr@edaratgroup.com',
    password: 'manager123',
    role: 'manager',
    department: 'Human Resources',
   avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1'
  },
  {
    id: '3',
    name: 'Fatima Al-Zahra', 
    email: 'fms-em001@edaratgroup.com',
    password: 'employee123',
    role: 'employee',
    department: 'Human Resources',
   avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1'
  },
  {
    id: '4',
    name: 'ISO Administrator',
    email: 'admini_iso@edaratgroup.com',
    password: '$ecuRe_#K3y',
    role: 'admin',
    department: 'Quality Management',
   avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1'
  }
];
// Get user
export const mockUser: User = mockUsers[0];
// Documents Data
export const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Employee Handbook 2024',
    type: 'Manual',
    fileType: 'pdf',
    fileSize: '2.1 MB',
    department: 'Human Resources/Policies/Employee Guidelines',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-15 10:30:00'),
    lastModified: new Date('2024-01-15 10:30:00'),
    accessType: 'public',
    approvalStatus: 'approved',
    approvedBy: 'Admin User',
    approvedAt: new Date('2024-01-15 11:45:00'),
    publishStatus: 'published',
    publishedBy: 'Sarah Johnson',
    publishedAt: new Date('2024-01-16 09:15:00'),
    tags: ['handbook', 'policies', 'hr'],
    description: 'Comprehensive guide for all employees covering company policies, procedures, and benefits.',
    url: '/documents/employee-handbook-2024.pdf',
    expiryDate: new Date('2025-12-31'),
    requiresAcceptance: true,
    securityLevel: 'Public',
    approver: {
      id: '2',
      name: 'Ahmed Al-Rashid',
      title: 'HR Manager',
      email: 'fms-hr@edaratgroup.com',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1'
    }
  },
  {
    id: '2',
    title: 'IT Security Policy',
    type: 'Policy',
    fileType: 'docx',
    fileSize: '0.8 MB',
    department: 'Information Technology/Security Policies',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-20 14:20:00'),
    lastModified: new Date('2024-01-20 14:20:00'),
    accessType: 'department',
    approvalStatus: 'pending',
    tags: ['security', 'it', 'compliance'],
    description: 'Security protocols and guidelines for all IT systems and data handling.',
    url: '/documents/it-security-policy.docx',
    expiryDate: new Date('2025-06-30'),
    requiresAcceptance: true,
    securityLevel: 'Confidential',
    approver: {
      id: '1',
      name: 'Sarah Johnson',
      title: 'IT Director',
      email: 'fms-admin@edaratgroup.com',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1'
    }
  },
  {
    id: '3',
    title: 'Financial Report Q1 2024',
    type: 'Form',
    fileType: 'xlsx',
    fileSize: '0.9 MB',
    department: 'Finance/Budget Reports/2024 Q1',
    uploadedBy: 'Fatima Al-Zahra',
    uploadedAt: new Date('2024-02-01 11:00:00'),
    lastModified: new Date('2024-02-01 11:00:00'),
    accessType: 'restricted',
    approvalStatus: 'approved',
    tags: ['financial', 'quarterly', 'report'],
    description: 'First quarter financial performance and budget analysis.',
    url: '/documents/financial-report-q1-2024.xlsx',
    securityLevel: 'Highly Confidential'
  },
  {
    id: '4',
    title: 'Emergency Response Procedures',
    type: 'SOP',
    fileType: 'pdf',
    fileSize: '1.5 MB',
    department: 'Operations/Standard Operating Procedures',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-10 08:45:00'),
    lastModified: new Date('2024-01-10 08:45:00'),
    accessType: 'public',
    approvalStatus: 'approved',
    tags: ['emergency', 'safety', 'procedures'],
    description: 'Step-by-step emergency response and evacuation procedures.',
    url: '/documents/emergency-response.pdf',
    expiryDate: new Date('2025-03-31'),
    requiresAcceptance: true
  },
  {
    id: '5',
    title: 'Marketing Strategy 2024',
    type: 'Guide',
    fileType: 'docx',
    fileSize: '0.8 MB',
    department: 'Marketing/Brand Guidelines',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-25 16:45:00'),
    lastModified: new Date('2024-01-25 16:45:00'),
    accessType: 'department',
    approvalStatus: 'pending',
    tags: ['marketing', 'strategy', '2024'],
    description: 'Comprehensive marketing strategy and campaign planning for 2024.',
    url: '/documents/marketing-strategy-2024.docx'
  },
  // Additional Human Resources Documents
  {
    id: '6',
    title: 'Performance Review Guidelines',
    type: 'Manual',
    fileType: 'pdf',
    fileSize: '1.5 MB',
    department: 'Human Resources/Policies/Employee Guidelines',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-12 13:20:00'),
    lastModified: new Date('2024-01-12 13:20:00'),
    accessType: 'department',
    approvalStatus: 'approved',
    approvedBy: 'Admin User',
    approvedAt: new Date('2024-01-10 14:30:00'),
    tags: ['performance', 'review', 'hr', 'evaluation'],
    description: 'Complete guide for conducting employee performance reviews and evaluations.',
    url: '/documents/performance-review-guidelines.pdf'
  },
  {
    id: '7',
    title: 'Remote Work Policy',
    type: 'Policy',
    fileType: 'docx',
    fileSize: '0.8 MB',
    department: 'Human Resources/Policies/Code of Conduct',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-18 15:10:00'),
    lastModified: new Date('2024-01-18 15:10:00'),
    accessType: 'public',
    approvalStatus: 'approved',
    tags: ['remote', 'work', 'policy', 'flexible'],
    description: 'Guidelines and requirements for remote work arrangements and hybrid schedules.',
    url: '/documents/remote-work-policy.docx',
    expiryDate: new Date('2025-08-31'),
    requiresAcceptance: true
  },
  {
    id: '8',
    title: 'Benefits Enrollment Guide',
    type: 'Guide',
    fileType: 'pdf',
    fileSize: '1.5 MB',
    department: 'Human Resources/Benefits',
    uploadedBy: 'Fatima Al-Zahra',
    uploadedAt: new Date('2024-01-08 09:30:00'),
    lastModified: new Date('2024-01-08 09:30:00'),
    accessType: 'public',
    approvalStatus: 'approved',
    tags: ['benefits', 'enrollment', 'health', 'insurance'],
    description: 'Step-by-step guide for employee benefits enrollment and coverage options.',
    url: '/documents/benefits-enrollment-guide.pdf',
    expiryDate: new Date('2025-11-30'),
    requiresAcceptance: true,
    notifyAllAfterApproval: true
  },
  {
    id: '9',
    title: 'Onboarding Checklist Template',
    type: 'Form',
    fileType: 'xlsx',
    fileSize: '0.9 MB',
    department: 'Human Resources/Training Materials',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-22 11:45:00'),
    lastModified: new Date('2024-01-22 11:45:00'),
    accessType: 'department',
    approvalStatus: 'pending',
    tags: ['onboarding', 'checklist', 'new hire'],
    description: 'Template checklist for new employee onboarding process and documentation.',
    url: '/documents/onboarding-checklist.xlsx'
  },
  {
    id: '10',
    title: 'Code of Conduct Handbook',
    type: 'Policy',
    fileType: 'pdf',
    fileSize: '1.5 MB',
    department: 'Human Resources/Policies/Code of Conduct',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-30 17:20:00'),
    lastModified: new Date('2024-01-30 17:20:00'),
    accessType: 'public',
    approvalStatus: 'approved',
    tags: ['conduct', 'policy', 'ethics'],
    description: 'Company code of conduct and ethical guidelines for all employees.',
    url: '/documents/code-of-conduct.pdf',
    expiryDate: new Date('2025-12-31'),
    requiresAcceptance: true
  },
  {
    id: '11',
    title: 'API Security Guidelines',
    type: 'Manual',
    fileType: 'docx',
    fileSize: '0.8 MB',
    department: 'Information Technology/System Documentation/API Documentation',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-02-05 12:15:00'),
    lastModified: new Date('2024-02-05 12:15:00'),
    accessType: 'department',
    approvalStatus: 'approved',
    approvedBy: 'Admin User',
    approvedAt: new Date('2024-01-13 09:15:00'),
    tags: ['api', 'security', 'documentation'],
    description: 'Security best practices for API development and integration.',
    url: '/documents/api-security.docx'
  },
  {
    id: '12',
    title: 'Q2 Budget Analysis',
    type: 'Form',
    fileType: 'xlsx',
    fileSize: '0.9 MB',
    department: 'Finance/Budget Reports/2024 Q2',
    uploadedBy: 'Fatima Al-Zahra',
    uploadedAt: new Date('2024-02-10 14:30:00'),
    lastModified: new Date('2024-02-10 14:30:00'),
    accessType: 'restricted',
    approvalStatus: 'approved',
    tags: ['budget', 'quarterly', 'analysis'],
    description: 'Second quarter budget analysis and variance report.',
    url: '/documents/q2-budget-analysis.xlsx'
  },
  // Additional Information Technology Documents
  {
    id: '13',
    title: 'Software Installation Guidelines',
    type: 'SOP',
    fileType: 'pdf',
    fileSize: '1.5 MB',
    department: 'Information Technology',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-14 16:40:00'),
    lastModified: new Date('2024-01-14 16:40:00'),
    accessType: 'department',
    approvalStatus: 'approved',
    tags: ['software', 'installation', 'procedures', 'it'],
    description: 'Standard procedures for software installation and approval process.',
    url: '/documents/software-installation-guidelines.pdf'
  },
  {
    id: '11',
    title: 'Network Access Procedures',
    type: 'SOP',
    fileType: 'docx',
    fileSize: '0.8 MB',
    department: 'Information Technology',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-16 13:55:00'),
    lastModified: new Date('2024-01-16 13:55:00'),
    accessType: 'restricted',
    approvalStatus: 'approved',
    tags: ['network', 'access', 'security', 'vpn'],
    description: 'Procedures for network access requests, VPN setup, and security protocols.',
    url: '/documents/network-access-procedures.docx'
  },
  {
    id: '12',
    title: 'Data Backup Protocol',
    type: 'Manual',
    fileType: 'pdf',
    fileSize: '1.5 MB',
    department: 'Information Technology',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-11 10:25:00'),
    lastModified: new Date('2024-01-11 10:25:00'),
    accessType: 'department',
    approvalStatus: 'approved',
    tags: ['backup', 'data', 'recovery', 'protocol'],
    description: 'Comprehensive data backup and disaster recovery protocols.',
    url: '/documents/data-backup-protocol.pdf'
  },
  {
    id: '13',
    title: 'IT Help Desk Manual',
    type: 'Manual',
    fileType: 'docx',
    fileSize: '0.8 MB',
    department: 'Information Technology',
    uploadedBy: 'Fatima Al-Zahra',
    uploadedAt: new Date('2024-01-19 15:35:00'),
    lastModified: new Date('2024-01-19 15:35:00'),
    accessType: 'department',
    approvalStatus: 'pending',
    tags: ['helpdesk', 'support', 'troubleshooting'],
    description: 'Complete manual for IT help desk operations and troubleshooting procedures.',
    url: '/documents/it-helpdesk-manual.docx'
  },
  // Additional Finance Documents
  {
    id: '14',
    title: 'Expense Reimbursement Policy',
    type: 'Policy',
    fileType: 'pdf',
    fileSize: '1.5 MB',
    department: 'Finance',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-13 08:50:00'),
    lastModified: new Date('2024-01-13 08:50:00'),
    accessType: 'public',
    approvalStatus: 'approved',
    tags: ['expense', 'reimbursement', 'policy', 'finance'],
    description: 'Policy and procedures for employee expense reimbursement and approvals.',
    url: '/documents/expense-reimbursement-policy.pdf'
  },
  {
    id: '15',
    title: 'Budget Planning Template',
    type: 'Form',
    fileType: 'xlsx',
    fileSize: '0.9 MB',
    department: 'Finance',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-17 12:10:00'),
    lastModified: new Date('2024-01-17 12:10:00'),
    accessType: 'department',
    approvalStatus: 'approved',
    tags: ['budget', 'planning', 'template', 'finance'],
    description: 'Template for annual budget planning and departmental expense forecasting.',
    url: '/documents/budget-planning-template.xlsx'
  },
  {
    id: '16',
    title: 'Quarterly Tax Guidelines',
    type: 'Guide',
    fileType: 'docx',
    fileSize: '0.8 MB',
    department: 'Finance',
    uploadedBy: 'Fatima Al-Zahra',
    uploadedAt: new Date('2024-01-21 14:25:00'),
    lastModified: new Date('2024-01-21 14:25:00'),
    accessType: 'restricted',
    approvalStatus: 'pending',
    tags: ['tax', 'quarterly', 'guidelines', 'compliance'],
    description: 'Guidelines for quarterly tax reporting and compliance requirements.',
    url: '/documents/quarterly-tax-guidelines.docx'
  },
  {
    id: '17',
    title: 'Financial Audit Checklist',
    type: 'Form',
    fileType: 'xlsx',
    fileSize: '0.9 MB',
    department: 'Finance',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-24 11:35:00'),
    lastModified: new Date('2024-01-24 11:35:00'),
    accessType: 'restricted',
    approvalStatus: 'approved',
    tags: ['audit', 'checklist', 'compliance', 'finance'],
    description: 'Comprehensive checklist for internal and external financial audits.',
    url: '/documents/financial-audit-checklist.xlsx'
  },
  // Additional Operations Documents
  {
    id: '18',
    title: 'Quality Control Manual',
    type: 'Manual',
    fileType: 'pdf',
    fileSize: '1.5 MB',
    department: 'Operations',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-09 07:45:00'),
    lastModified: new Date('2024-01-09 07:45:00'),
    accessType: 'department',
    approvalStatus: 'approved',
    tags: ['quality', 'control', 'manual', 'operations'],
    description: 'Complete quality control procedures and standards for operations.',
    url: '/documents/quality-control-manual.pdf'
  },
  {
    id: '19',
    title: 'Supply Chain Management SOP',
    type: 'SOP',
    fileType: 'docx',
    fileSize: '0.8 MB',
    department: 'Operations',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-15 10:30:00'),
    lastModified: new Date('2024-01-15 10:30:00'),
    accessType: 'department',
    approvalStatus: 'approved',
    tags: ['supply chain', 'management', 'procurement'],
    description: 'Standard operating procedures for supply chain and procurement management.',
    url: '/documents/supply-chain-sop.docx'
  },
  {
    id: '20',
    title: 'Equipment Maintenance Schedule',
    type: 'Form',
    fileType: 'xlsx',
    fileSize: '0.9 MB',
    department: 'Operations',
    uploadedBy: 'Fatima Al-Zahra',
    uploadedAt: new Date('2024-01-23 16:50:00'),
    lastModified: new Date('2024-01-23 16:50:00'),
    accessType: 'department',
    approvalStatus: 'pending',
    tags: ['equipment', 'maintenance', 'schedule', 'operations'],
    description: 'Scheduled maintenance calendar and procedures for all operational equipment.',
    url: '/documents/equipment-maintenance-schedule.xlsx'
  },
  {
    id: '21',
    title: 'Safety Training Manual',
    type: 'Manual',
    fileType: 'pdf',
    fileSize: '1.5 MB',
    department: 'Operations',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-26 09:40:00'),
    lastModified: new Date('2024-01-26 09:40:00'),
    accessType: 'public',
    approvalStatus: 'approved',
    tags: ['safety', 'training', 'manual', 'workplace'],
    description: 'Comprehensive workplace safety training manual and procedures.',
    url: '/documents/safety-training-manual.pdf'
  },
  // Additional Marketing Documents
  {
    id: '22',
    title: 'Brand Guidelines Document',
    type: 'Guide',
    fileType: 'pdf',
    fileSize: '1.5 MB',
    department: 'Marketing',
    uploadedBy: 'Fatima Al-Zahra',
    uploadedAt: new Date('2024-01-12 13:20:00'),
    lastModified: new Date('2024-01-12 13:20:00'),
    accessType: 'department',
    approvalStatus: 'approved',
    tags: ['brand', 'guidelines', 'marketing', 'design'],
    description: 'Official brand guidelines including logos, colors, fonts, and usage rules.',
    url: '/documents/brand-guidelines.pdf'
  },
  {
    id: '23',
    title: 'Social Media Content Calendar',
    type: 'Form',
    fileType: 'xlsx',
    fileSize: '0.9 MB',
    department: 'Marketing',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-18 15:10:00'),
    lastModified: new Date('2024-01-18 15:10:00'),
    accessType: 'department',
    approvalStatus: 'pending',
    tags: ['social media', 'content', 'calendar', 'marketing'],
    description: 'Monthly content calendar for social media posts and campaigns.',
    url: '/documents/social-media-calendar.xlsx'
  },
  {
    id: '24',
    title: 'Campaign Performance Report',
    type: 'Form',
    fileType: 'xlsx',
    fileSize: '0.9 MB',
    department: 'Marketing',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-20 14:20:00'),
    lastModified: new Date('2024-01-20 14:20:00'),
    accessType: 'department',
    approvalStatus: 'approved',
    tags: ['campaign', 'performance', 'report', 'analytics'],
    description: 'Quarterly marketing campaign performance analysis and metrics.',
    url: '/documents/campaign-performance-report.xlsx'
  },
  {
    id: '25',
    title: 'Customer Segmentation Analysis',
    type: 'Guide',
    fileType: 'docx',
    fileSize: '0.8 MB',
    department: 'Marketing',
    uploadedBy: 'Fatima Al-Zahra',
    uploadedAt: new Date('2024-01-27 13:15:00'),
    lastModified: new Date('2024-01-27 13:15:00'),
    accessType: 'restricted',
    approvalStatus: 'approved',
    tags: ['customer', 'segmentation', 'analysis', 'marketing'],
    description: 'Detailed customer segmentation analysis and targeting strategies.',
    url: '/documents/customer-segmentation.docx'
  },
  // Additional Legal Documents
  {
    id: '26',
    title: 'Contract Review Checklist',
    type: 'Form',
    fileType: 'pdf',
    fileSize: '1.5 MB',
    department: 'Legal',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-11 10:25:00'),
    lastModified: new Date('2024-01-11 10:25:00'),
    accessType: 'department',
    approvalStatus: 'approved',
    tags: ['contract', 'review', 'checklist', 'legal'],
    description: 'Comprehensive checklist for contract review and approval process.',
    url: '/documents/contract-review-checklist.pdf'
  },
  {
    id: '27',
    title: 'Compliance Training Manual',
    type: 'Manual',
    fileType: 'docx',
    fileSize: '0.8 MB',
    department: 'Legal',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-16 13:55:00'),
    lastModified: new Date('2024-01-16 13:55:00'),
    accessType: 'public',
    approvalStatus: 'approved',
    tags: ['compliance', 'training', 'legal', 'regulations'],
    description: 'Training manual for regulatory compliance and legal requirements.',
    url: '/documents/compliance-training-manual.docx'
  },
  {
    id: '28',
    title: 'Privacy Policy Updates',
    type: 'Policy',
    fileType: 'pdf',
    fileSize: '1.5 MB',
    department: 'Legal',
    uploadedBy: 'Fatima Al-Zahra',
    uploadedAt: new Date('2024-01-19 15:35:00'),
    lastModified: new Date('2024-01-19 15:35:00'),
    accessType: 'public',
    approvalStatus: 'pending',
    tags: ['privacy', 'policy', 'updates', 'gdpr'],
    description: 'Updated privacy policy reflecting new data protection regulations.',
    url: '/documents/privacy-policy-updates.pdf'
  },
  {
    id: '29',
    title: 'Intellectual Property Guide',
    type: 'Guide',
    fileType: 'docx',
    fileSize: '0.8 MB',
    department: 'Legal',
    uploadedBy: 'Ahmed Al-Rashid',
    uploadedAt: new Date('2024-01-25 16:45:00'),
    lastModified: new Date('2024-01-25 16:45:00'),
    accessType: 'department',
    approvalStatus: 'approved',
    tags: ['intellectual property', 'ip', 'guide', 'legal'],
    description: 'Guide to intellectual property protection and trademark procedures.',
    url: '/documents/ip-guide.docx'
  },
  // Web Privacy Policy Document
  {
    id: '30',
    title: 'Web Privacy Policy',
    type: 'Policy',
    fileType: 'pdf',
    fileSize: '1.5 MB',
    department: 'Legal',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-28 17:45:00'),
    lastModified: new Date('2024-01-28 17:45:00'),
    accessType: 'public',
    approvalStatus: 'approved',
    tags: ['privacy', 'policy', 'web', 'gdpr', 'compliance'],
    description: 'Comprehensive web privacy policy outlining data collection, usage, and user rights.',
    url: '/Web-Privacy-Policy.pdf',
    htmlPreviewUrl: '/Web-Privacy-Policy.html',
    expiryDate: new Date('2026-01-28'),
    requiresAcceptance: true
  }
];
// Document Acceptances Data
export const mockDocumentAcceptances: DocumentAcceptance[] = [
  {
    id: '1',
    documentId: '1', // Employee Handbook 2024
    userId: '2',
    userName: 'Ahmed Al-Rashid',
    userEmail: 'fms-hr@edaratgroup.com',
    acceptedAt: new Date('2024-01-16T10:30:00'),
    acceptanceType: 'signed'
  },
  {
    id: '2',
    documentId: '7', // Remote Work Policy
    userId: '3',
    userName: 'Fatima Al-Zahra',
    userEmail: 'fms-em001@edaratgroup.com',
    acceptedAt: new Date('2024-01-19T14:20:00'),
    acceptanceType: 'acknowledged'
  },
  {
    id: '3',
    documentId: '1', // Employee Handbook 2024
    userId: '1',
    userName: 'Sarah Johnson',
    userEmail: 'fms-admin@edaratgroup.com',
    acceptedAt: new Date('2024-01-15T11:45:00'),
    acceptanceType: 'signed'
  }
];
// universal departments
export const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Human Resources',
    color: '#6B7280', // Grey for folders
    documentCount: 12,
    pendingCount: 3,
    parentId: null,
    path: 'Human Resources',
    children: [
      {
        id: '1-1',
        name: 'Policies',
        color: '#3B82F6', // Blue label
        documentCount: 5,
        pendingCount: 1,
        parentId: '1',
        path: 'Human Resources/Policies',
        children: [
          {
            id: '1-1-1',
            name: 'Employee Guidelines',
            color: '#10B981', // Green label
            documentCount: 3,
            pendingCount: 0,
            parentId: '1-1',
            path: 'Human Resources/Policies/Employee Guidelines'
          },
          {
            id: '1-1-2',
            name: 'Code of Conduct',
            color: '#F59E0B', // Amber label
            documentCount: 2,
            pendingCount: 1,
            parentId: '1-1',
            path: 'Human Resources/Policies/Code of Conduct'
          }
        ]
      },
      {
        id: '1-2',
        name: 'Benefits',
        color: '#6B7280', // No color label - grey (realistic)
        documentCount: 4,
        pendingCount: 1,
        parentId: '1',
        path: 'Human Resources/Benefits'
      },
      {
        id: '1-3',
        name: 'Training Materials',
        color: '#F59E0B', // Amber label
        documentCount: 3,
        pendingCount: 1,
        parentId: '1',
        path: 'Human Resources/Training Materials'
      }
    ]
  },
  {
    id: '2',
    name: 'Information Technology',
    color: '#6B7280', // Grey for folders
    documentCount: 15,
    pendingCount: 2,
    parentId: null,
    path: 'Information Technology',
    children: [
      {
        id: '2-1',
        name: 'Security Policies',
        color: '#EF4444', // Red label
        documentCount: 6,
        pendingCount: 1,
        parentId: '2',
        path: 'Information Technology/Security Policies'
      },
      {
        id: '2-2',
        name: 'System Documentation',
        color: '#8B5CF6', // Purple label
        documentCount: 7,
        pendingCount: 1,
        parentId: '2',
        path: 'Information Technology/System Documentation',
        children: [
          {
            id: '2-2-1',
            name: 'API Documentation',
            color: '#06B6D4', // Cyan label
            documentCount: 4,
            pendingCount: 0,
            parentId: '2-2',
            path: 'Information Technology/System Documentation/API Documentation'
          },
          {
            id: '2-2-2',
            name: 'Database Schemas',
            color: '#8B5CF6', // Purple label
            documentCount: 3,
            pendingCount: 1,
            parentId: '2-2',
            path: 'Information Technology/System Documentation/Database Schemas'
          }
        ]
      },
      {
        id: '2-3',
        name: 'User Manuals',
        color: '#6B7280', // No color label - grey (realistic)
        documentCount: 2,
        pendingCount: 0,
        parentId: '2',
        path: 'Information Technology/User Manuals'
      }
    ]
  },
  {
    id: '3',
    name: 'Finance',
    color: '#6B7280', // Grey for folders
    documentCount: 18,
    pendingCount: 4,
    parentId: null,
    path: 'Finance',
    children: [
      {
        id: '3-1',
        name: 'Budget Reports',
        color: '#F59E0B', // Amber label
        documentCount: 8,
        pendingCount: 2,
        parentId: '3',
        path: 'Finance/Budget Reports',
        children: [
          {
            id: '3-1-1',
            name: '2024 Q1',
            color: '#10B981', // Green label
            documentCount: 4,
            pendingCount: 0,
            parentId: '3-1',
            path: 'Finance/Budget Reports/2024 Q1'
          },
          {
            id: '3-1-2',
            name: '2024 Q2',
            color: '#F59E0B', // Amber label
            documentCount: 4,
            pendingCount: 2,
            parentId: '3-1',
            path: 'Finance/Budget Reports/2024 Q2'
          }
        ]
      },
      {
        id: '3-2',
        name: 'Expense Policies',
        color: '#EF4444', // Red label
        documentCount: 5,
        pendingCount: 1,
        parentId: '3',
        path: 'Finance/Expense Policies'
      },
      {
        id: '3-3',
        name: 'Audit Documents',
        color: '#DC2626', // Dark red label
        documentCount: 5,
        pendingCount: 1,
        parentId: '3',
        path: 'Finance/Audit Documents'
      }
    ]
  },
  {
    id: '4',
    name: 'Legal',
    color: '#6B7280', // Grey for folders
    documentCount: 14,
    pendingCount: 3,
    parentId: null,
    path: 'Legal',
    children: [
      {
        id: '4-1',
        name: 'Contracts',
        color: '#EF4444', // Red label
        documentCount: 8,
        pendingCount: 2,
        parentId: '4',
        path: 'Legal/Contracts',
        children: [
          {
            id: '4-1-1',
            name: 'Employee Contracts',
            color: '#3B82F6', // Blue label
            documentCount: 5,
            pendingCount: 1,
            parentId: '4-1',
            path: 'Legal/Contracts/Employee Contracts'
          },
          {
            id: '4-1-2',
            name: 'Vendor Agreements',
            color: '#10B981', // Green label
            documentCount: 3,
            pendingCount: 1,
            parentId: '4-1',
            path: 'Legal/Contracts/Vendor Agreements'
          }
        ]
      },
      {
        id: '4-2',
        name: 'Compliance',
        color: '#DC2626', // Dark red label
        documentCount: 6,
        pendingCount: 1,
        parentId: '4',
        path: 'Legal/Compliance'
      }
    ]
  },
  {
    id: '5',
    name: 'Operations',
    color: '#6B7280', // Grey for folders
    documentCount: 11,
    pendingCount: 2,
    parentId: null,
    path: 'Operations',
    children: [
      {
        id: '5-1',
        name: 'Standard Operating Procedures',
        color: '#8B5CF6', // Purple label
        documentCount: 7,
        pendingCount: 1,
        parentId: '5',
        path: 'Operations/Standard Operating Procedures'
      },
      {
        id: '5-2',
        name: 'Quality Assurance',
        color: '#6B7280', // No color label - grey (realistic)
        documentCount: 4,
        pendingCount: 1,
        parentId: '5',
        path: 'Operations/Quality Assurance'
      }
    ]
  },
  {
    id: '6',
    name: 'Marketing',
    color: '#6B7280', // Grey for folders
    documentCount: 13,
    pendingCount: 2,
    parentId: null,
    path: 'Marketing',
    children: [
      {
        id: '6-1',
        name: 'Brand Guidelines',
        color: '#EC4899', // Pink label
        documentCount: 4,
        pendingCount: 0,
        parentId: '6',
        path: 'Marketing/Brand Guidelines'
      },
      {
        id: '6-2',
        name: 'Campaign Materials',
        color: '#DB2777', // Dark pink label
        documentCount: 9,
        pendingCount: 2,
        parentId: '6',
        path: 'Marketing/Campaign Materials',
        children: [
          {
            id: '6-2-1',
            name: '2024 Q1 Campaign',
            color: '#F97316', // Orange label
            documentCount: 4,
            pendingCount: 1,
            parentId: '6-2',
            path: 'Marketing/Campaign Materials/2024 Q1 Campaign'
          },
          {
            id: '6-2-2',
            name: '2024 Q2 Campaign',
            color: '#EAB308', // Yellow label
            documentCount: 5,
            pendingCount: 1,
            parentId: '6-2',
            path: 'Marketing/Campaign Materials/2024 Q2 Campaign'
          }
        ]
      }
    ]
  }
];
// universal audit logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Sarah Johnson',
    documentId: '1',
    documentTitle: 'Employee Handbook 2024',
    action: 'approve',
    timestamp: new Date('2024-01-15T10:30:00')
  },
  {
    id: '2',
    userId: '2',
    userName: 'Ahmed Al-Rashid',
    documentId: '2',
    documentTitle: 'IT Security Policy',
    action: 'upload',
    timestamp: new Date('2024-01-20T14:20:00')
  },
  {
    id: '3',
    userId: '3',
    userName: 'Fatima Al-Zahra',
    documentId: '1',
    documentTitle: 'Employee Handbook 2024',
    action: 'view',
    timestamp: new Date('2024-01-21T09:15:00')
  },
  {
    id: '4',
    userId: '1',
    userName: 'Sarah Johnson',
    documentId: '3',
    documentTitle: 'Financial Report Q1 2024',
    action: 'approve',
    timestamp: new Date('2024-02-01T11:00:00')
  },
  {
    id: '5',
    userId: '2',
    userName: 'Ahmed Al-Rashid',
    documentId: '1',
    documentTitle: 'Employee Handbook 2024',
    action: 'download',
    timestamp: new Date('2024-01-22T16:45:00')
  }
];
// Notifications Data
export const mockNotifications: Record<string, Notification[]> = {
  admin: [
    {
      id: '1',
      title: 'New Documents Need Review',
      message: '3 documents uploaded and pending approval workflow setup',
      type: 'info',
      timestamp: new Date('2024-01-20T15:00:00'),
      read: false,
      actionUrl: '/documents',
      userId: '1'
    },
    {
      id: '2',
      title: 'System Backup Completed',
      message: 'Daily backup completed successfully',
      type: 'success',
      timestamp: new Date('2024-01-21T02:00:00'),
      read: true,
      userId: '1'
    },
    {
      id: '3',
      title: 'Storage Warning',
      message: 'Document storage is 85% full',
      type: 'warning',
      timestamp: new Date('2024-01-21T09:30:00'),
      read: false,
      userId: '1'
    },
    {
      id: '4',
      title: 'New User Registration',
      message: 'New employee account requires approval',
      type: 'info',
      timestamp: new Date('2024-01-21T11:20:00'),
      read: false,
      userId: '1'
    },
    {
      id: '5',
      title: 'Security Update',
      message: 'Critical security patch available',
      type: 'error',
      timestamp: new Date('2024-01-21T13:15:00'),
      read: false,
      userId: '1'
    }
  ],
  manager: [
    {
      id: '6',
      title: 'Document Approval Required',
      message: 'IT Security Policy requires your approval',
      type: 'warning',
      timestamp: new Date('2024-01-25T10:30:00'),
      read: false,
      actionUrl: '/documents/2',
      userId: '2',
      documentId: '2',
      actions: [
        { type: 'acknowledge', label: 'Acknowledge' },
        { type: 'approve', label: 'Approve' }
      ]
    },
    {
      id: '7',
      title: 'Marketing Strategy Approval',
      message: 'Marketing Strategy 2024 awaits your approval',
      type: 'warning',
      timestamp: new Date('2024-01-24T14:20:00'),
      read: false,
      actionUrl: '/documents/5',
      userId: '2',
      documentId: '5',
      actions: [
        { type: 'acknowledge', label: 'Acknowledge' },
        { type: 'approve', label: 'Approve' }
      ]
    },
    {
      id: '8',
      title: 'Subject Report Due',
      message: 'Monthly HR report due in 3 days',
      type: 'info',
      timestamp: new Date('2024-01-21T08:00:00'),
      read: true,
      userId: '2',
      actions: [
        { type: 'acknowledge', label: 'Acknowledge' }
      ]
    },
    {
      id: '9',
      title: 'New Policy Published',
      message: 'Emergency Response Procedures updated',
      type: 'info',
      timestamp: new Date('2024-01-10T14:45:00'),
      read: true,
      userId: '2',
      actions: [
        { type: 'acknowledge', label: 'Acknowledge' }
      ]
    },
    {
      id: '10',
      title: 'Team Training Reminder',
      message: 'Security training scheduled for next week',
      type: 'info',
      timestamp: new Date('2024-01-21T16:20:00'),
      read: false,
      userId: '2',
      actions: [
        { type: 'acknowledge', label: 'Acknowledge' }
      ]
    }
  ],
  employee: [
    {
      id: '10',
      title: 'Document Updated - Leave Policy',
      message: 'Leave Policy has been updated with new vacation guidelines',
      type: 'info',
      timestamp: new Date('2024-01-25T14:30:00'),
      read: false,
      userId: '3',
      documentId: '3',
      actionUrl: '/documents/3',
      actions: [
        { type: 'acknowledge', label: 'Acknowledge' }
      ]
    },
    {
      id: '11',
      title: 'Document Updated - Employee Handbook',
      message: 'Employee Handbook 2024 has been updated with new policies',
      type: 'info',
      timestamp: new Date('2024-01-24T10:15:00'),
      read: false,
      userId: '3',
      documentId: '1',
      actionUrl: '/documents/1',
      actions: [
        { type: 'acknowledge', label: 'Acknowledge' }
      ]
    },
    {
      id: '12',
      title: 'New Document - Health & Safety Guidelines',
      message: 'New Health & Safety Guidelines document is now available',
      type: 'info',
      timestamp: new Date('2024-01-23T16:45:00'),
      read: false,
      userId: '3',
      documentId: '4',
      actionUrl: '/documents/4',
      actions: [
        { type: 'acknowledge', label: 'Acknowledge' }
      ]
    },
    {
      id: '13',
      title: 'Document Updated - Emergency Procedures',
      message: 'Emergency Response Procedures have been updated',
      type: 'warning',
      timestamp: new Date('2024-01-22T09:20:00'),
      read: false,
      userId: '3',
      documentId: '6',
      actionUrl: '/documents/6',
      actions: [
        { type: 'acknowledge', label: 'Acknowledge' }
      ]
    },
    {
      id: '14',
      title: 'Training Reminder',
      message: 'Complete mandatory security training by Friday',
      type: 'warning',
      timestamp: new Date('2024-01-21T09:00:00'),
      read: true,
      userId: '3',
      actions: [
        { type: 'acknowledge', label: 'Acknowledge' }
      ]
    },
    {
      id: '15',
      title: 'System Maintenance',
      message: 'Document system will be offline Sunday 2-4 AM',
      type: 'info',
      timestamp: new Date('2024-01-19T17:30:00'),
      read: true,
      userId: '3',
      actions: [
        { type: 'acknowledge', label: 'Acknowledge' }
      ]
    }
  ]
};
// Get user notifications
export const getUserNotifications = (userRole: 'admin' | 'manager' | 'employee'): Notification[] => {
  return mockNotifications[userRole] || [];
};

// Get all department paths for upload modal
export const getAllDepartmentPaths = (): string[] => {
  const paths: string[] = [];
  
  const extractPaths = (dept: Department) => {
    if (dept.path) {
      paths.push(dept.path);
    }
    if (dept.children) {
      dept.children.forEach(child => extractPaths(child));
    }
  };
  
  mockDepartments.forEach(dept => extractPaths(dept));
  return paths.sort();
};

// ISO 9000 Sections Data
export const mockISO9000Sections: ISO9000Section[] = [
  {
    id: '1',
    title: 'Quality Management System',
    color: '#08bed5',
    icon: Award,
    documents: [
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
        approvalStatus: 'approved',
        tags: ['ISO9000', 'Quality', 'Policy'],
        description: 'Comprehensive quality policy statement for the organization.',
        url: '/documents/iso9000/quality-policy.pdf',
        securityLevel: 'Public'
      },
      {
        id: 'iso-2',
        title: 'Quality Objectives',
        type: 'Document',
        fileType: 'pdf',
        fileSize: '850 KB',
        department: 'Quality Management System',
        uploadedBy: 'ISO Administrator',
        uploadedAt: new Date('2024-01-10 10:30:00'),
        lastModified: new Date('2024-01-10 10:30:00'),
        accessType: 'department',
        approvalStatus: 'approved',
        tags: ['ISO9000', 'Quality', 'Objectives'],
        description: 'Measurable quality objectives aligned with company strategy.',
        url: '/documents/iso9000/quality-objectives.pdf',
        securityLevel: 'Restricted'
      },
      {
        id: 'iso-3',
        title: 'Management Review',
        type: 'Procedure',
        fileType: 'pdf',
        fileSize: '1.5 MB',
        department: 'Quality Management System',
        uploadedBy: 'ISO Administrator',
        uploadedAt: new Date('2024-01-11 14:00:00'),
        lastModified: new Date('2024-01-11 14:00:00'),
        accessType: 'restricted',
        approvalStatus: 'pending',
        tags: ['ISO9000', 'Management', 'Review'],
        description: 'Management review procedure for quality system assessment.',
        url: '/documents/iso9000/management-review.pdf',
        securityLevel: 'Confidential',
        assignedTo: '4',  // Assigned to ISO Administrator
        assignedDate: new Date('2024-01-11 14:00:00'),
        approver: {
          id: '4',
          name: 'ISO Administrator',
          title: 'Quality Manager',
          email: 'admini_iso@edaratgroup.com',
          avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
          approved: false
        }
      },
      {
        id: 'iso-4',
        title: 'Quality Manual',
        type: 'Manual',
        fileType: 'pdf',
        fileSize: '3.2 MB',
        department: 'Quality Management System',
        uploadedBy: 'ISO Administrator',
        uploadedAt: new Date('2024-01-12 11:00:00'),
        lastModified: new Date('2024-01-12 11:00:00'),
        accessType: 'public',
        approvalStatus: 'approved',
        tags: ['ISO9000', 'Quality', 'Manual'],
        description: 'Complete quality management system manual.',
        url: '/documents/iso9000/quality-manual.pdf',
        securityLevel: 'Public'
      },
      {
        id: 'iso-5',
        title: 'Process Mapping',
        type: 'Diagram',
        fileType: 'pdf',
        fileSize: '2.1 MB',
        department: 'Quality Management System',
        uploadedBy: 'ISO Administrator',
        uploadedAt: new Date('2024-01-13 09:30:00'),
        lastModified: new Date('2024-01-13 09:30:00'),
        accessType: 'department',
        approvalStatus: 'pending',
        tags: ['ISO9000', 'Process', 'Mapping'],
        description: 'Visual representation of key organizational processes.',
        url: '/documents/iso9000/process-mapping.pdf',
        securityLevel: 'Restricted'
      },
      {
        id: 'iso-6',
        title: 'Risk Assessment',
        type: 'Assessment',
        fileType: 'pdf',
        fileSize: '1.8 MB',
        department: 'Quality Management System',
        uploadedBy: 'ISO Administrator',
        uploadedAt: new Date('2024-01-14 13:00:00'),
        lastModified: new Date('2024-01-14 13:00:00'),
        accessType: 'restricted',
        approvalStatus: 'approved',
        tags: ['ISO9000', 'Risk', 'Assessment'],
        description: 'Comprehensive risk assessment for quality management.',
        url: '/documents/iso9000/risk-assessment.pdf',
        securityLevel: 'Confidential'
      },
      {
        id: 'iso-7',
        title: 'Corrective Actions',
        type: 'Procedure',
        fileType: 'pdf',
        fileSize: '1.3 MB',
        department: 'Quality Management System',
        uploadedBy: 'ISO Administrator',
        uploadedAt: new Date('2024-01-15 10:00:00'),
        lastModified: new Date('2024-01-15 10:00:00'),
        accessType: 'public',
        approvalStatus: 'approved',
        tags: ['ISO9000', 'Corrective', 'Actions'],
        description: 'Procedure for handling non-conformities and corrective actions.',
        url: '/documents/iso9000/corrective-actions.pdf',
        securityLevel: 'Public'
      }
    ]
  },
  {
    id: '2',
    title: 'Document Control',
    color: '#03778d',
    icon: FileText,
    documents: [
      {
        id: 'iso-8',
        title: 'Document Control Procedure',
        type: 'SOP',
        fileType: 'pdf',
        fileSize: '2.1 MB',
        department: 'Document Control',
        uploadedBy: 'ISO Administrator',
        uploadedAt: new Date('2024-01-16 09:00:00'),
        lastModified: new Date('2024-01-16 09:00:00'),
        accessType: 'public',
        approvalStatus: 'pending',
        tags: ['ISO9000', 'Document', 'Control'],
        description: 'Standard operating procedure for document control.',
        url: '/documents/iso9000/document-control-procedure.pdf',
        securityLevel: 'Public'
      },
      {
        id: 'iso-9',
        title: 'Document Approval Matrix',
        type: 'Matrix',
        fileType: 'pdf',
        fileSize: '950 KB',
        department: 'Document Control',
        uploadedBy: 'ISO Administrator',
        uploadedAt: new Date('2024-01-17 10:30:00'),
        lastModified: new Date('2024-01-17 10:30:00'),
        accessType: 'department',
        approvalStatus: 'pending',
        tags: ['ISO9000', 'Approval', 'Matrix'],
        description: 'Matrix defining document approval workflows.',
        url: '/documents/iso9000/document-approval-matrix.pdf',
        securityLevel: 'Restricted'
      },
      {
        id: 'iso-10',
        title: 'Version Control',
        type: 'Guideline',
        fileType: 'pdf',
        fileSize: '1.3 MB',
        department: 'Document Control',
        uploadedBy: 'ISO Administrator',
        uploadedAt: new Date('2024-01-18 14:00:00'),
        lastModified: new Date('2024-01-18 14:00:00'),
        accessType: 'public',
        approvalStatus: 'approved',
        tags: ['ISO9000', 'Version', 'Control'],
        description: 'Guidelines for document version control.',
        url: '/documents/iso9000/version-control.pdf',
        securityLevel: 'Public'
      }
    ]
  },
  {
    id: '3',
    title: 'Internal Audits',
    color: '#08bed5',
    icon: Shield,
    documents: [
      {
        id: 'iso-16',
        title: 'Audit Program',
        type: 'Program',
        fileType: 'pdf',
        fileSize: '1.8 MB',
        department: 'Internal Audits',
        uploadedBy: 'ISO Administrator',
        uploadedAt: new Date('2024-01-19 11:00:00'),
        lastModified: new Date('2024-01-19 11:00:00'),
        accessType: 'department',
        approvalStatus: 'pending',
        tags: ['ISO9000', 'Audit', 'Program'],
        description: 'Annual internal audit program.',
        url: '/documents/iso9000/audit-program.pdf',
        securityLevel: 'Restricted'
      },
      {
        id: 'iso-17',
        title: 'Audit Checklist',
        type: 'Checklist',
        fileType: 'pdf',
        fileSize: '750 KB',
        department: 'Internal Audits',
        uploadedBy: 'ISO Administrator',
        uploadedAt: new Date('2024-01-20 09:30:00'),
        lastModified: new Date('2024-01-20 09:30:00'),
        accessType: 'public',
        approvalStatus: 'approved',
        tags: ['ISO9000', 'Audit', 'Checklist'],
        description: 'Comprehensive audit checklist template.',
        url: '/documents/iso9000/audit-checklist.pdf',
        securityLevel: 'Public'
      }
    ]
  },
  {
    id: '4',
    title: 'Training & Competence',
    color: '#03778d',
    icon: Users,
    documents: [
      {
        id: 'iso-20',
        title: 'Training Matrix',
        type: 'Matrix',
        fileType: 'xlsx',
        fileSize: '650 KB',
        department: 'Training & Competence',
        uploadedBy: 'HR Manager',
        uploadedAt: new Date('2024-01-21 10:00:00'),
        lastModified: new Date('2024-01-21 10:00:00'),
        accessType: 'public',
        approvalStatus: 'approved',
        tags: ['ISO9000', 'Training', 'Matrix'],
        description: 'Comprehensive training requirements matrix.',
        url: '/documents/iso9000/training-matrix.xlsx',
        securityLevel: 'Public'
      },
      {
        id: 'iso-21',
        title: 'Competence Assessment',
        type: 'Assessment',
        fileType: 'pdf',
        fileSize: '1.4 MB',
        department: 'Training & Competence',
        uploadedBy: 'HR Manager',
        uploadedAt: new Date('2024-01-22 11:30:00'),
        lastModified: new Date('2024-01-22 11:30:00'),
        accessType: 'department',
        approvalStatus: 'pending',
        tags: ['ISO9000', 'Competence', 'Assessment'],
        description: 'Employee competence assessment framework.',
        url: '/documents/iso9000/competence-assessment.pdf',
        securityLevel: 'Restricted'
      },
      {
        id: 'iso-22',
        title: 'Training Records',
        type: 'Manual',
        fileType: 'pdf',
        fileSize: '2.8 MB',
        department: 'Training & Competence',
        uploadedBy: 'HR Manager',
        uploadedAt: new Date('2024-01-23 14:00:00'),
        lastModified: new Date('2024-01-23 14:00:00'),
        accessType: 'restricted',
        approvalStatus: 'approved',
        tags: ['ISO9000', 'Training', 'Records'],
        description: 'Historical training records database.',
        url: '/documents/iso9000/training-records.pdf',
        securityLevel: 'Confidential'
      }
    ]
  },
  {
    id: '5',
    title: 'Customer Satisfaction',
    color: '#08bed5',
    icon: Heart,
    documents: [
      {
        id: 'iso-29',
        title: 'Customer Feedback',
        type: 'Guide',
        fileType: 'pdf',
        fileSize: '1.1 MB',
        department: 'Customer Satisfaction',
        uploadedBy: 'Quality Manager',
        uploadedAt: new Date('2024-01-24 09:00:00'),
        lastModified: new Date('2024-01-24 09:00:00'),
        accessType: 'public',
        approvalStatus: 'approved',
        tags: ['ISO9000', 'Customer', 'Feedback'],
        description: 'Customer feedback collection and analysis procedures.',
        url: '/documents/iso9000/customer-feedback.pdf',
        securityLevel: 'Public'
      },
      {
        id: 'iso-30',
        title: 'Complaint Handling',
        type: 'SOP',
        fileType: 'pdf',
        fileSize: '1.6 MB',
        department: 'Customer Satisfaction',
        uploadedBy: 'Quality Manager',
        uploadedAt: new Date('2024-01-25 10:30:00'),
        lastModified: new Date('2024-01-25 10:30:00'),
        accessType: 'department',
        approvalStatus: 'pending',
        tags: ['ISO9000', 'Complaint', 'Handling'],
        description: 'Standard procedure for handling customer complaints.',
        url: '/documents/iso9000/complaint-handling.pdf',
        securityLevel: 'Restricted'
      },
      {
        id: 'iso-31',
        title: 'Service Level Agreement',
        type: 'Policy',
        fileType: 'pdf',
        fileSize: '980 KB',
        department: 'Customer Satisfaction',
        uploadedBy: 'Quality Manager',
        uploadedAt: new Date('2024-01-26 14:00:00'),
        lastModified: new Date('2024-01-26 14:00:00'),
        accessType: 'restricted',
        approvalStatus: 'approved',
        tags: ['ISO9000', 'SLA', 'Service'],
        description: 'Service level agreements with customers.',
        url: '/documents/iso9000/service-level-agreement.pdf',
        securityLevel: 'Confidential'
      }
    ]
  },
  {
    id: '6',
    title: 'Continuous Improvement',
    color: '#03778d',
    icon: TrendingUp,
    documents: [
      {
        id: 'iso-32',
        title: 'Improvement Projects',
        type: 'Manual',
        fileType: 'pdf',
        fileSize: '1.9 MB',
        department: 'Continuous Improvement',
        uploadedBy: 'Process Manager',
        uploadedAt: new Date('2024-01-27 09:00:00'),
        lastModified: new Date('2024-01-27 09:00:00'),
        accessType: 'public',
        approvalStatus: 'approved',
        tags: ['ISO9000', 'Improvement', 'Projects'],
        description: 'Active continuous improvement project portfolio.',
        url: '/documents/iso9000/improvement-projects.pdf',
        securityLevel: 'Public'
      },
      {
        id: 'iso-33',
        title: 'KPI Dashboard',
        type: 'Guide',
        fileType: 'pdf',
        fileSize: '2.3 MB',
        department: 'Continuous Improvement',
        uploadedBy: 'Process Manager',
        uploadedAt: new Date('2024-01-28 10:30:00'),
        lastModified: new Date('2024-01-28 10:30:00'),
        accessType: 'department',
        approvalStatus: 'pending',
        tags: ['ISO9000', 'KPI', 'Dashboard'],
        description: 'Key performance indicators dashboard and metrics.',
        url: '/documents/iso9000/kpi-dashboard.pdf',
        securityLevel: 'Restricted'
      },
      {
        id: 'iso-34',
        title: 'Performance Metrics',
        type: 'Manual',
        fileType: 'pdf',
        fileSize: '1.7 MB',
        department: 'Continuous Improvement',
        uploadedBy: 'Process Manager',
        uploadedAt: new Date('2024-01-29 11:00:00'),
        lastModified: new Date('2024-01-29 11:00:00'),
        accessType: 'restricted',
        approvalStatus: 'approved',
        tags: ['ISO9000', 'Performance', 'Metrics'],
        description: 'Organizational performance metrics framework.',
        url: '/documents/iso9000/performance-metrics.pdf',
        securityLevel: 'Confidential'
      }
    ]
  },
  {
    id: '7',
    title: 'Risk Management',
    color: '#08bed5',
    icon: Shield,
    documents: [
      {
        id: 'iso-38',
        title: 'Risk Assessment Matrix',
        type: 'Manual',
        fileType: 'xlsx',
        fileSize: '850 KB',
        department: 'Risk Management',
        uploadedBy: 'Risk Manager',
        uploadedAt: new Date('2024-01-30 09:00:00'),
        lastModified: new Date('2024-01-30 09:00:00'),
        accessType: 'restricted',
        approvalStatus: 'approved',
        tags: ['ISO9000', 'Risk', 'Assessment'],
        description: 'Comprehensive risk assessment matrix.',
        url: '/documents/iso9000/risk-assessment-matrix.xlsx',
        securityLevel: 'Confidential'
      },
      {
        id: 'iso-39',
        title: 'Risk Mitigation Plan',
        type: 'Policy',
        fileType: 'pdf',
        fileSize: '1.5 MB',
        department: 'Risk Management',
        uploadedBy: 'Risk Manager',
        uploadedAt: new Date('2024-01-31 10:30:00'),
        lastModified: new Date('2024-01-31 10:30:00'),
        accessType: 'department',
        approvalStatus: 'pending',
        tags: ['ISO9000', 'Risk', 'Mitigation'],
        description: 'Strategic risk mitigation planning document.',
        url: '/documents/iso9000/risk-mitigation-plan.pdf',
        securityLevel: 'Restricted'
      },
      {
        id: 'iso-40',
        title: 'Business Continuity',
        type: 'SOP',
        fileType: 'pdf',
        fileSize: '2.2 MB',
        department: 'Risk Management',
        uploadedBy: 'Risk Manager',
        uploadedAt: new Date('2024-02-01 11:00:00'),
        lastModified: new Date('2024-02-01 11:00:00'),
        accessType: 'restricted',
        approvalStatus: 'approved',
        tags: ['ISO9000', 'Business', 'Continuity'],
        description: 'Business continuity and disaster recovery procedures.',
        url: '/documents/iso9000/business-continuity.pdf',
        securityLevel: 'Top Secret'
      }
    ]
  },
  {
    id: '8',
    title: 'Process Management',
    color: '#03778d',
    icon: FileText,
    documents: [
      {
        id: 'iso-43',
        title: 'Process Documentation',
        type: 'SOP',
        fileType: 'pdf',
        fileSize: '1.8 MB',
        department: 'Process Management',
        uploadedBy: 'Process Owner',
        uploadedAt: new Date('2024-02-02 09:00:00'),
        lastModified: new Date('2024-02-02 09:00:00'),
        accessType: 'public',
        approvalStatus: 'approved',
        tags: ['ISO9000', 'Process', 'Documentation'],
        description: 'Comprehensive process documentation library.',
        url: '/documents/iso9000/process-documentation.pdf',
        securityLevel: 'Public'
      },
      {
        id: 'iso-44',
        title: 'Process Flow Charts',
        type: 'Guide',
        fileType: 'pdf',
        fileSize: '3.1 MB',
        department: 'Process Management',
        uploadedBy: 'Process Owner',
        uploadedAt: new Date('2024-02-03 10:30:00'),
        lastModified: new Date('2024-02-03 10:30:00'),
        accessType: 'public',
        approvalStatus: 'approved',
        tags: ['ISO9000', 'Process', 'Flow'],
        description: 'Visual process flow charts and diagrams.',
        url: '/documents/iso9000/process-flow-charts.pdf',
        securityLevel: 'Public'
      },
      {
        id: 'iso-45',
        title: 'Process Optimization',
        type: 'Manual',
        fileType: 'pdf',
        fileSize: '1.9 MB',
        department: 'Process Management',
        uploadedBy: 'Process Owner',
        uploadedAt: new Date('2024-02-04 11:00:00'),
        lastModified: new Date('2024-02-04 11:00:00'),
        accessType: 'department',
        approvalStatus: 'pending',
        tags: ['ISO9000', 'Process', 'Optimization'],
        description: 'Process optimization strategies and guidelines.',
        url: '/documents/iso9000/process-optimization.pdf',
        securityLevel: 'Restricted'
      }
    ]
  }
];

// ISO2 Sections Data (ISO 9001, 14001, 45001, 27001, 50001, 22000)
export const mockISO2Sections: ISO2Section[] = [
  {
    id: '1',
    title: 'Quality Management System',
    color: '#0AACCC',
    documents: [
      { id: '1', title: 'Quality Policy', type: 'Policy', url: '#' },
      { id: '2', title: 'Quality Objectives', type: 'Document', url: '#' },
      { id: '3', title: 'Management Review', type: 'Procedure', url: '#' },
      { id: '4', title: 'Internal Audit', type: 'Procedure', url: '#' },
      { id: '5', title: 'Corrective Actions', type: 'Form', url: '#' }
    ]
  },
  {
    id: '2',
    title: 'Environmental Management',
    color: '#10B981',
    documents: [
      { id: '6', title: 'Environmental Policy', type: 'Policy', url: '#' },
      { id: '7', title: 'Environmental Aspects', type: 'Register', url: '#' },
      { id: '8', title: 'Legal Compliance', type: 'Checklist', url: '#' },
      { id: '9', title: 'Emergency Response', type: 'Plan', url: '#' },
      { id: '10', title: 'Environmental Training', type: 'Record', url: '#' }
    ]
  },
  {
    id: '3',
    title: 'Occupational Health & Safety',
    color: '#F59E0B',
    documents: [
      { id: '11', title: 'OH&S Policy', type: 'Policy', url: '#' },
      { id: '12', title: 'Risk Assessment', type: 'Form', url: '#' },
      { id: '13', title: 'Safety Procedures', type: 'SOP', url: '#' },
      { id: '14', title: 'Incident Investigation', type: 'Form', url: '#' },
      { id: '15', title: 'Safety Training Records', type: 'Register', url: '#' }
    ]
  },
  {
    id: '4',
    title: 'Information Security',
    color: '#8B5CF6',
    documents: [
      { id: '16', title: 'Information Security Policy', type: 'Policy', url: '#' },
      { id: '17', title: 'Risk Management', type: 'Procedure', url: '#' },
      { id: '18', title: 'Access Control', type: 'SOP', url: '#' },
      { id: '19', title: 'Incident Management', type: 'Plan', url: '#' },
      { id: '20', title: 'Security Awareness', type: 'Training', url: '#' }
    ]
  },
  {
    id: '5',
    title: 'Energy Management',
    color: '#EF4444',
    documents: [
      { id: '21', title: 'Energy Policy', type: 'Policy', url: '#' },
      { id: '22', title: 'Energy Baseline', type: 'Report', url: '#' },
      { id: '23', title: 'Energy Review', type: 'Assessment', url: '#' },
      { id: '24', title: 'Energy Performance', type: 'Indicators', url: '#' },
      { id: '25', title: 'Energy Action Plan', type: 'Plan', url: '#' }
    ]
  },
  {
    id: '6',
    title: 'Food Safety Management',
    color: '#06B6D4',
    documents: [
      { id: '26', title: 'Food Safety Policy', type: 'Policy', url: '#' },
      { id: '27', title: 'HACCP Plan', type: 'Plan', url: '#' },
      { id: '28', title: 'Prerequisite Programs', type: 'SOP', url: '#' },
      { id: '29', title: 'Traceability System', type: 'Procedure', url: '#' },
      { id: '30', title: 'Corrective Actions', type: 'Form', url: '#' }
    ]
  }
];

// EDC (Edarat Data Center) Sections Data
export const mockEDCSections: EDCSection[] = [
  {
    id: '1',
    title: 'Data Center Infrastructure',
    color: '#08bed5',
    documents: [
      { id: '1', title: 'Server Configuration', type: 'Configuration', url: '#', securityLevel: 'Confidential' },
      { id: '2', title: 'Network Architecture', type: 'Documentation', url: '#', securityLevel: 'Top Secret' },
      { id: '3', title: 'Power Management', type: 'Procedure', url: '#', securityLevel: 'Restricted' },
      { id: '4', title: 'Cooling Systems', type: 'Manual', url: '#', securityLevel: 'Public' },
      { id: '5', title: 'Security Protocols', type: 'Policy', url: '#', securityLevel: 'Top Secret' },
      { id: '6', title: 'Rack Management', type: 'Procedure', url: '#', securityLevel: 'Restricted' },
      { id: '7', title: 'Cable Management', type: 'Guideline', url: '#', securityLevel: 'Public' },
      { id: '8', title: 'Environmental Controls', type: 'Manual', url: '#', securityLevel: 'Confidential' }
    ]
  },
  {
    id: '2',
    title: 'Data Management',
    color: '#03778d',
    documents: [
      { id: '9', title: 'Data Backup Strategy', type: 'Policy', url: '#', securityLevel: 'Top Secret' },
      { id: '10', title: 'Data Retention', type: 'Procedure', url: '#', securityLevel: 'Confidential' },
      { id: '11', title: 'Data Classification', type: 'Guideline', url: '#', securityLevel: 'Restricted' },
      { id: '12', title: 'Data Migration', type: 'Plan', url: '#', securityLevel: 'Top Secret' }
    ]
  },
  {
    id: '3',
    title: 'System Monitoring',
    color: '#08bed5',
    documents: [
      { id: '13', title: 'Performance Metrics', type: 'Dashboard', url: '#', securityLevel: 'Public' },
      { id: '14', title: 'Alert Configuration', type: 'Setup', url: '#', securityLevel: 'Restricted' },
      { id: '15', title: 'Log Management', type: 'Procedure', url: '#', securityLevel: 'Confidential' },
      { id: '16', title: 'Health Checks', type: 'Script', url: '#', securityLevel: 'Public' },
      { id: '17', title: 'Capacity Planning', type: 'Report', url: '#', securityLevel: 'Restricted' },
      { id: '18', title: 'Resource Monitoring', type: 'Dashboard', url: '#', securityLevel: 'Public' },
      { id: '19', title: 'Threshold Management', type: 'Configuration', url: '#', securityLevel: 'Confidential' },
      { id: '20', title: 'Reporting Tools', type: 'Manual', url: '#', securityLevel: 'Public' },
      { id: '21', title: 'Dashboard Setup', type: 'Guide', url: '#', securityLevel: 'Restricted' },
      { id: '22', title: 'Notification Rules', type: 'Policy', url: '#', securityLevel: 'Top Secret' },
      { id: '23', title: 'Monitoring Schedule', type: 'Calendar', url: '#', securityLevel: 'Confidential' },
      { id: '24', title: 'System Alerts', type: 'Configuration', url: '#', securityLevel: 'Restricted' }
    ]
  },
  {
    id: '4',
    title: 'Security & Compliance',
    color: '#03778d',
    documents: [
      { id: '25', title: 'Access Control', type: 'Policy', url: '#', securityLevel: 'Top Secret' },
      { id: '26', title: 'Audit Procedures', type: 'Checklist', url: '#', securityLevel: 'Confidential' },
      { id: '27', title: 'Incident Response', type: 'Plan', url: '#', securityLevel: 'Top Secret' },
      { id: '28', title: 'Compliance Framework', type: 'Document', url: '#', securityLevel: 'Restricted' },
      { id: '29', title: 'Security Training', type: 'Material', url: '#', securityLevel: 'Public' }
    ]
  },
  {
    id: '5',
    title: 'Disaster Recovery',
    color: '#08bed5',
    documents: [
      { id: '30', title: 'DR Strategy', type: 'Plan', url: '#', securityLevel: 'Top Secret' },
      { id: '31', title: 'Backup Procedures', type: 'SOP', url: '#', securityLevel: 'Confidential' },
      { id: '32', title: 'Recovery Testing', type: 'Schedule', url: '#', securityLevel: 'Restricted' }
    ]
  },
  {
    id: '6',
    title: 'Operations & Maintenance',
    color: '#03778d',
    documents: [
      { id: '33', title: 'Maintenance Schedule', type: 'Calendar', url: '#', securityLevel: 'Public' },
      { id: '34', title: 'Change Management', type: 'Process', url: '#', securityLevel: 'Restricted' },
      { id: '35', title: 'Vendor Management', type: 'Agreement', url: '#', securityLevel: 'Confidential' },
      { id: '36', title: 'Service Level Agreements', type: 'SLA', url: '#', securityLevel: 'Public' },
      { id: '37', title: 'Performance Reports', type: 'Dashboard', url: '#', securityLevel: 'Public' },
      { id: '38', title: 'Work Order System', type: 'Procedure', url: '#', securityLevel: 'Restricted' },
      { id: '39', title: 'Asset Management', type: 'Database', url: '#', securityLevel: 'Confidential' },
      { id: '40', title: 'Maintenance Logs', type: 'Record', url: '#', securityLevel: 'Restricted' }
    ]
  }
];

// CE (Cyber Security) Sections Data
export const mockCESections: CESection[] = [
  // Start with empty array - user will create subjects
];
