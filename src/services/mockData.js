// VIPER SCM - Initial Domain Seed Data (Ejada Supply Chain Management)

export const INITIAL_USERS = [
  {
    id: 'user-coord-1',
    username: 'coordinator',
    password: 'admin123',
    domain: 'coordinator',
    fullName: 'Ahmed Al-Coordinator',
    email: 'coordinator@ejada.com',
    roleTitle: 'SCM Operations Coordinator'
  },
  {
    id: 'user-supp-1',
    username: 'supplier1',
    password: 'supp123',
    domain: 'supplier',
    fullName: 'TechCorp Hardware Solutions',
    email: 'contact@techcorp-sa.com',
    roleTitle: 'Tier-1 Certified Hardware Supplier',
    supplierId: 'supp-001'
  },
  {
    id: 'user-cust-1',
    username: 'customer1',
    password: 'cust123',
    domain: 'customer',
    fullName: 'Ejada Enterprise Solutions (Fahad)',
    email: 'fahad@ejada.com',
    roleTitle: 'Enterprise Procurement Client',
    customerId: 'cust-001'
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'cust-001',
    customerCode: 'CUST-001',
    customerName: 'Ejada IT Enterprise',
    contactPerson: 'Fahad Mansour',
    email: 'fahad@ejada.com',
    phone: '+966-11-234-5678',
    address: 'Building 4, Riyadh Tech Valley, Riyadh, KSA',
    accountStatus: 'Active',
    creditLimit: 100000.00,
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'cust-002',
    customerCode: 'CUST-002',
    customerName: 'Saudi Aramco Services Group',
    contactPerson: 'Tariq Al-Otaibi',
    email: 'tariq@aramco-services.com',
    phone: '+966-13-876-5432',
    address: 'Tower B, Dhahran Complex, Dhahran, KSA',
    accountStatus: 'Active',
    creditLimit: 250000.00,
    createdAt: '2026-02-10T10:30:00Z'
  },
  {
    id: 'cust-003',
    customerCode: 'CUST-003',
    customerName: 'Al-Rajhi Financial Corp',
    contactPerson: 'Sarah Al-Ghamdi',
    email: 'sarah@alrajhi-corp.com',
    phone: '+966-11-987-6543',
    address: 'King Fahd Road, Financial District, Riyadh, KSA',
    accountStatus: 'Active',
    creditLimit: 150000.00,
    createdAt: '2026-02-28T14:15:00Z'
  },
  {
    id: 'cust-004',
    customerCode: 'CUST-004',
    customerName: 'STC Infrastructure Solutions',
    contactPerson: 'Khalid Bin Nasser',
    email: 'khalid@stc-infra.sa',
    phone: '+966-11-456-7890',
    address: 'Digital City, Building 12, Riyadh, KSA',
    accountStatus: 'Active',
    creditLimit: 300000.00,
    createdAt: '2026-03-01T11:00:00Z'
  },
  {
    id: 'cust-005',
    customerCode: 'CUST-005',
    customerName: 'SABIC Consulting Services',
    contactPerson: 'Reem Al-Hassan',
    email: 'reem@sabic-consult.sa',
    phone: '+966-13-321-6549',
    address: 'Industrial Area Phase 2, Jubail, KSA',
    accountStatus: 'Active',
    creditLimit: 180000.00,
    createdAt: '2026-03-05T16:45:00Z'
  },
  {
    id: 'cust-006',
    customerCode: 'CUST-006',
    customerName: 'National Water Company (NWC)',
    contactPerson: 'Majed Al-Ghamdi',
    email: 'majed@nwc.com.sa',
    phone: '+966-11-888-9999',
    address: 'King Abdullah Financial District, Riyadh, KSA',
    accountStatus: 'Active',
    creditLimit: 220000.00,
    createdAt: '2026-03-08T09:15:00Z'
  },
  {
    id: 'cust-007',
    customerCode: 'CUST-007',
    customerName: 'Riyadh Bank Digital Systems',
    contactPerson: 'Zaid Al-Harbi',
    email: 'zaid@riyadbank.com.sa',
    phone: '+966-11-765-4321',
    address: 'Olaya Street, Al-Woroud, Riyadh, KSA',
    accountStatus: 'Active',
    creditLimit: 280000.00,
    createdAt: '2026-03-10T12:00:00Z'
  }
];

export const INITIAL_ITEMS = [
  {
    id: 'item-001',
    itemCode: 'ITEM-001',
    itemName: 'Dell PowerEdge R750 Enterprise Server',
    category: 'Servers & Hardware',
    description: '2U Rack Server, 2x Intel Xeon Gold 6330, 64GB DDR4 ECC RAM, 4TB NVMe SSD RAID-10',
    unitPrice: 4850.00,
    stockQuantity: 24,
    reorderLevel: 5,
    unitOfMeasure: 'Units',
    createdAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'item-002',
    itemCode: 'ITEM-002',
    itemName: 'Cisco Catalyst 9300 48-Port Switch',
    category: 'Networking',
    description: 'Layer 3 Managed Gigabit Switch, 48x 10/100/1000 PoE+ Ports, 4x 10G SFP+ uplinks',
    unitPrice: 3200.00,
    stockQuantity: 40,
    reorderLevel: 10,
    unitOfMeasure: 'Units',
    createdAt: '2026-01-12T09:30:00Z'
  },
  {
    id: 'item-003',
    itemCode: 'ITEM-003',
    itemName: 'Oracle Enterprise Database License (Per Core)',
    category: 'Software & Licenses',
    description: 'Oracle RDBMS 19c Enterprise Edition per-core perpetual license with 1-year premier support',
    unitPrice: 9500.00,
    stockQuantity: 50,
    reorderLevel: 5,
    unitOfMeasure: 'Licenses',
    createdAt: '2026-01-18T10:00:00Z'
  },
  {
    id: 'item-004',
    itemCode: 'ITEM-004',
    itemName: 'Enterprise CyberSecurity Audit & Architecture Package',
    category: 'Business Consultation',
    description: '40-Hour comprehensive security audit, architecture review, and penetration testing engagement',
    unitPrice: 12000.00,
    stockQuantity: 15,
    reorderLevel: 2,
    unitOfMeasure: 'Packages',
    createdAt: '2026-02-01T11:00:00Z'
  },
  {
    id: 'item-005',
    itemCode: 'ITEM-005',
    itemName: 'Cloud Infrastructure Migration Implementation',
    category: 'IT Services',
    description: '80-Hour cloud modernization and lift-and-shift workload execution by certified engineers',
    unitPrice: 16500.00,
    stockQuantity: 10,
    reorderLevel: 2,
    unitOfMeasure: 'Packages',
    createdAt: '2026-02-15T13:00:00Z'
  },
  {
    id: 'item-006',
    itemCode: 'ITEM-006',
    itemName: 'APC Smart-UPS RT 10kVA On-Line Rackmount',
    category: 'Power & Infrastructure',
    description: 'High density 230V double-conversion on-line power protection for data centers with SNMP card',
    unitPrice: 5400.00,
    stockQuantity: 8,
    reorderLevel: 3,
    unitOfMeasure: 'Units',
    createdAt: '2026-03-01T15:00:00Z'
  },
  {
    id: 'item-007',
    itemCode: 'ITEM-007',
    itemName: 'HPE ProLiant DL380 Gen10 Plus Server',
    category: 'Servers & Hardware',
    description: '2P 2U computing server with Intel Xeon Silver, 128GB RAM, 8x SFF drive cage, redundant 800W PSU',
    unitPrice: 5120.00,
    stockQuantity: 18,
    reorderLevel: 4,
    unitOfMeasure: 'Units',
    createdAt: '2026-03-02T10:00:00Z'
  },
  {
    id: 'item-008',
    itemCode: 'ITEM-008',
    itemName: 'Fortinet FortiGate 200F Next-Gen Firewall',
    category: 'Networking',
    description: 'Enterprise security appliance with 27 Gbps firewall throughput, 3 Gbps SSL inspection',
    unitPrice: 6800.00,
    stockQuantity: 12,
    reorderLevel: 3,
    unitOfMeasure: 'Units',
    createdAt: '2026-03-04T11:30:00Z'
  },
  {
    id: 'item-009',
    itemCode: 'ITEM-009',
    itemName: 'Red Hat Enterprise Linux Server License',
    category: 'Software & Licenses',
    description: 'RHEL Premium Standard Subscription (2 sockets / 2 VMs) with 24x7 support coverage',
    unitPrice: 1499.00,
    stockQuantity: 65,
    reorderLevel: 10,
    unitOfMeasure: 'Licenses',
    createdAt: '2026-03-06T14:00:00Z'
  }
];

export const INITIAL_SUPPLIERS = [
  {
    id: 'supp-001',
    supplierCode: 'SUPP-001',
    supplierName: 'TechCorp Solutions KSA',
    contactName: 'Omar Al-Fulan',
    email: 'omar@techcorp-sa.com',
    phone: '+966-50-111-2233',
    location: 'Riyadh Logistics Park',
    specialty: 'Enterprise Servers & Hardware',
    rating: 4.8
  },
  {
    id: 'supp-002',
    supplierCode: 'SUPP-002',
    supplierName: 'Global Telecom & Networking Corp',
    contactName: 'Faisal Al-Zahrani',
    email: 'faisal@globalnet.sa',
    phone: '+966-55-444-5566',
    location: 'Jeddah Commercial Center',
    specialty: 'Networking & Telecommunications',
    rating: 4.6
  },
  {
    id: 'supp-003',
    supplierCode: 'SUPP-003',
    supplierName: 'Apex Cloud & Consulting Partners',
    contactName: 'Hiba Al-Dossari',
    email: 'hiba@apexconsult.com',
    phone: '+966-53-777-8899',
    location: 'Khobar Innovation Tower',
    specialty: 'Software Licenses & IT Consulting',
    rating: 4.9
  },
  {
    id: 'supp-004',
    supplierCode: 'SUPP-004',
    supplierName: 'Middle East Power & Cooling Systems',
    contactName: 'Nasser Al-Subaie',
    email: 'nasser@mepower.sa',
    phone: '+966-54-333-8811',
    location: 'Dammam Industrial Hub',
    specialty: 'Power & Infrastructure',
    rating: 4.7
  }
];

export const INITIAL_REQUESTS = [
  {
    id: 'req-001',
    requestCode: 'REQ-2026-001',
    customerId: 'cust-001',
    itemId: 'item-001',
    quantity: 5,
    priority: 'High',
    status: 'Assigned',
    deliveryDate: '2026-10-15',
    notes: 'Urgent expansion for Ejada main data cluster. Servers must have redundant power supplies.',
    assignedSupplierId: 'supp-001',
    createdAt: '2026-09-01T08:30:00Z',
    updatedAt: '2026-09-05T14:00:00Z'
  },
  {
    id: 'req-002',
    requestCode: 'REQ-2026-002',
    customerId: 'cust-002',
    itemId: 'item-002',
    quantity: 10,
    priority: 'Critical',
    status: 'In-Review',
    deliveryDate: '2026-09-30',
    notes: 'Core switch replacements for Dhahran branch. Supplier feedback requested immediately.',
    assignedSupplierId: 'supp-002',
    createdAt: '2026-09-03T11:00:00Z',
    updatedAt: '2026-09-08T09:15:00Z'
  },
  {
    id: 'req-003',
    requestCode: 'REQ-2026-003',
    customerId: 'cust-003',
    itemId: 'item-004',
    quantity: 2,
    priority: 'Medium',
    status: 'Pending',
    deliveryDate: '2026-11-01',
    notes: 'Annual cybersecurity compliance audit. Not yet assigned to supplier.',
    assignedSupplierId: null, // intentionally unassigned to support genuine blocker testing TC-11
    createdAt: '2026-09-05T15:20:00Z',
    updatedAt: '2026-09-05T15:20:00Z'
  },
  {
    id: 'req-004',
    requestCode: 'REQ-2026-004',
    customerId: 'cust-004',
    itemId: 'item-003',
    quantity: 4,
    priority: 'High',
    status: 'Accepted',
    deliveryDate: '2026-10-05',
    notes: 'Database core licensing for STC billing engine upgrade.',
    assignedSupplierId: 'supp-003',
    createdAt: '2026-09-07T10:00:00Z',
    updatedAt: '2026-09-09T16:00:00Z'
  },
  {
    id: 'req-005',
    requestCode: 'REQ-2026-005',
    customerId: 'cust-005',
    itemId: 'item-005',
    quantity: 1,
    priority: 'Low',
    status: 'Completed',
    deliveryDate: '2026-09-10',
    notes: 'Cloud migration phase 1 completed on time.',
    assignedSupplierId: 'supp-003',
    createdAt: '2026-08-20T09:00:00Z',
    updatedAt: '2026-09-10T12:00:00Z'
  },
  {
    id: 'req-006',
    requestCode: 'REQ-2026-006',
    customerId: 'cust-006',
    itemId: 'item-006',
    quantity: 3,
    priority: 'Medium',
    status: 'Assigned',
    deliveryDate: '2026-10-20',
    notes: 'UPS backup units for NWC regional telemetry dispatch stations.',
    assignedSupplierId: 'supp-004',
    createdAt: '2026-09-08T14:30:00Z',
    updatedAt: '2026-09-08T14:30:00Z'
  },
  {
    id: 'req-007',
    requestCode: 'REQ-2026-007',
    customerId: 'cust-007',
    itemId: 'item-007',
    quantity: 6,
    priority: 'High',
    status: 'In-Review',
    deliveryDate: '2026-10-12',
    notes: 'High-availability HPE server cluster for Riyadh Bank core payment microservices.',
    assignedSupplierId: 'supp-001',
    createdAt: '2026-09-09T11:00:00Z',
    updatedAt: '2026-09-10T08:45:00Z'
  },
  {
    id: 'req-008',
    requestCode: 'REQ-2026-008',
    customerId: 'cust-001',
    itemId: 'item-008',
    quantity: 2,
    priority: 'Critical',
    status: 'Accepted',
    deliveryDate: '2026-09-25',
    notes: 'Perimeter next-generation firewall upgrade for corporate gateway.',
    assignedSupplierId: 'supp-002',
    createdAt: '2026-09-10T15:00:00Z',
    updatedAt: '2026-09-12T16:30:00Z'
  }
];

export const INITIAL_FEEDBACKS = [
  {
    id: 'fb-001',
    requestId: 'req-002',
    supplierId: 'supp-002',
    capacity: 'Full',
    deliverableQuantity: 10,
    timeframeDays: 14,
    comments: '10 Cisco switches in stock at Jeddah warehouse. Staging and pre-configuration will take 3 days.',
    submittedAt: '2026-09-08T10:00:00Z'
  },
  {
    id: 'fb-002',
    requestId: 'req-004',
    supplierId: 'supp-003',
    capacity: 'Full',
    deliverableQuantity: 4,
    timeframeDays: 3,
    comments: 'Electronic licenses generated and ready for activation key transfer upon coordinator signoff.',
    submittedAt: '2026-09-09T17:00:00Z'
  },
  {
    id: 'fb-003',
    requestId: 'req-007',
    supplierId: 'supp-001',
    capacity: 'Full',
    deliverableQuantity: 6,
    timeframeDays: 10,
    comments: '6 HPE ProLiant Gen10 servers staged in Riyadh distribution center. Ready for logistics dispatch.',
    submittedAt: '2026-09-10T09:30:00Z'
  },
  {
    id: 'fb-004',
    requestId: 'req-008',
    supplierId: 'supp-002',
    capacity: 'Full',
    deliverableQuantity: 2,
    timeframeDays: 5,
    comments: 'FortiGate 200F firewalls allocated with gold support contracts attached.',
    submittedAt: '2026-09-12T16:30:00Z'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-001',
    supplierId: 'supp-001',
    requestId: 'req-001',
    title: 'Request REQ-2026-001 Delivery Date Updated',
    message: 'The coordinator updated the required delivery date to 2026-10-15.',
    type: 'UPDATE',
    isRead: false,
    createdAt: '2026-09-05T14:00:00Z'
  },
  {
    id: 'notif-002',
    supplierId: 'supp-002',
    requestId: 'req-002',
    title: 'Request REQ-2026-002 Escalated to Critical Priority',
    message: 'Priority changed from High to Critical due to client milestone.',
    type: 'UPDATE',
    isRead: false,
    createdAt: '2026-09-08T09:15:00Z'
  },
  {
    id: 'notif-003',
    supplierId: 'supp-001',
    requestId: 'req-007',
    title: 'New Supply Request Assigned: REQ-2026-007',
    message: 'HPE Server order from Riyadh Bank assigned to TechCorp Solutions.',
    type: 'ASSIGN',
    isRead: false,
    createdAt: '2026-09-09T11:05:00Z'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-001',
    userDomain: 'coordinator',
    action: 'CREATE_REQUEST',
    entityName: 'Request',
    entityId: 'req-001',
    payloadSizeKb: 1.45,
    executionTimeMs: 42.5,
    details: 'Created Supply Request REQ-2026-001 for Ejada IT Enterprise',
    createdAt: '2026-09-01T08:30:00Z'
  },
  {
    id: 'log-002',
    userDomain: 'supplier',
    action: 'SUBMIT_FEEDBACK',
    entityName: 'Feedback',
    entityId: 'fb-001',
    payloadSizeKb: 0.85,
    executionTimeMs: 38.2,
    details: 'Submitted Full capacity feedback for REQ-2026-002',
    createdAt: '2026-09-08T10:00:00Z'
  },
  {
    id: 'log-003',
    userDomain: 'coordinator',
    action: 'ASSIGN_SUPPLIER',
    entityName: 'Request',
    entityId: 'req-007',
    payloadSizeKb: 1.2,
    executionTimeMs: 29.8,
    details: 'Assigned REQ-2026-007 to TechCorp Solutions KSA',
    createdAt: '2026-09-09T11:00:00Z'
  }
];

