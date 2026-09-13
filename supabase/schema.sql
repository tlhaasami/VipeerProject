-- ====================================================================
-- VIPER Supply Chain Management (SCM) - Supabase Database Schema
-- Baseline Version 1.0 (SE3002 Quality Engineering)
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users & Authentication Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    domain VARCHAR(20) NOT NULL CHECK (domain IN ('coordinator', 'supplier', 'customer')),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Customers Table (FR-02 Manage Customers)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_code VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    address TEXT NOT NULL,
    account_status VARCHAR(20) DEFAULT 'Active' CHECK (account_status IN ('Active', 'Suspended', 'Pending')),
    credit_limit NUMERIC(12, 2) DEFAULT 50000.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Items Table (FR-03 Manage Items)
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_code VARCHAR(20) UNIQUE NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    reorder_level INTEGER NOT NULL DEFAULT 10,
    unit_of_measure VARCHAR(20) DEFAULT 'Units',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Suppliers Table
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_code VARCHAR(20) UNIQUE NOT NULL,
    supplier_name VARCHAR(100) NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    location VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 4.50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Supply Requests Table (FR-01 Manage Requests)
CREATE TABLE IF NOT EXISTS public.requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_code VARCHAR(30) UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE RESTRICT,
    item_id UUID REFERENCES public.items(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Assigned', 'In-Review', 'Accepted', 'Rejected', 'Completed', 'Cancelled')),
    delivery_date DATE NOT NULL,
    notes TEXT,
    assigned_supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Supplier Feedback Table (FR-05 Submit Feedback on Request)
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
    capacity VARCHAR(20) NOT NULL CHECK (capacity IN ('Full', 'Partial', 'Cannot-Supply')),
    deliverable_quantity INTEGER NOT NULL,
    timeframe_days INTEGER NOT NULL CHECK (timeframe_days >= 0),
    comments TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Notifications Table (FR-06 Request Modification Notifications)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
    request_id UUID REFERENCES public.requests(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'UPDATE' CHECK (type IN ('UPDATE', 'CANCEL', 'FEEDBACK_RECEIVED', 'INFO')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Audit Trail / Performance Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_domain VARCHAR(30) NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity_name VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50),
    payload_size_kb NUMERIC(6, 2) DEFAULT 1.20,
    execution_time_ms NUMERIC(8, 2) NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Security: Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Anonymous read/write policy for demo / educational access
CREATE POLICY "Public Read Access" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public Read/Write Customers" ON public.customers FOR ALL USING (true);
CREATE POLICY "Public Read/Write Items" ON public.items FOR ALL USING (true);
CREATE POLICY "Public Read/Write Suppliers" ON public.suppliers FOR ALL USING (true);
CREATE POLICY "Public Read/Write Requests" ON public.requests FOR ALL USING (true);
CREATE POLICY "Public Read/Write Feedbacks" ON public.feedbacks FOR ALL USING (true);
CREATE POLICY "Public Read/Write Notifications" ON public.notifications FOR ALL USING (true);
CREATE POLICY "Public Read/Write Logs" ON public.audit_logs FOR ALL USING (true);
