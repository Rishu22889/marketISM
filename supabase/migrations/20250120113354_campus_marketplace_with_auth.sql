-- Location: supabase/migrations/20250120113354_campus_marketplace_with_auth.sql
-- Schema Analysis: Fresh project - no existing tables
-- Integration Type: Complete new marketplace schema with authentication
-- Dependencies: None (fresh start)

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('student', 'admin', 'moderator');
CREATE TYPE public.product_condition AS ENUM ('new', 'excellent', 'good', 'fair');
CREATE TYPE public.product_category AS ENUM ('textbooks', 'electronics', 'furniture', 'bikes', 'clothing', 'sports', 'other');

-- 2. Core User Management Table
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    student_id TEXT,
    university TEXT DEFAULT 'IIT (ISM) Dhanbad',
    hostel_location TEXT,
    role public.user_role DEFAULT 'student'::public.user_role,
    avatar_url TEXT,
    phone_number TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products/Listings Table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category public.product_category NOT NULL,
    condition public.product_condition NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    original_price DECIMAL(10,2) CHECK (original_price >= price),
    images TEXT[] DEFAULT '{}',
    location TEXT,
    contact_preferences JSONB DEFAULT '{"phone": true, "email": true, "whatsapp": false}',
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Wishlist/Favorites Table
CREATE TABLE public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- 5. Product Views Table (for analytics)
CREATE TABLE public.product_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    viewed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_student_id ON public.user_profiles(student_id);
CREATE INDEX idx_products_seller_id ON public.products(seller_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_condition ON public.products(condition);
CREATE INDEX idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX idx_products_available ON public.products(is_available);
CREATE INDEX idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON public.wishlists(product_id);
CREATE INDEX idx_product_views_product_id ON public.product_views(product_id);

-- 7. Create storage bucket for product images (PUBLIC - marketplace images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,  -- Public bucket for product images (marketplace)
    10485760,  -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- 8. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies - Following Pattern System

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 4: Public read, private write for products
CREATE POLICY "public_can_read_products"
ON public.products
FOR SELECT
TO public
USING (is_available = true);

CREATE POLICY "users_manage_own_products"
ON public.products
FOR ALL
TO authenticated
USING (seller_id = auth.uid())
WITH CHECK (seller_id = auth.uid());

-- Pattern 2: Simple user ownership for wishlists
CREATE POLICY "users_manage_own_wishlists"
ON public.wishlists
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 4: Public read, authenticated write for product views
CREATE POLICY "anyone_can_view_product_views"
ON public.product_views
FOR SELECT
TO public
USING (true);

CREATE POLICY "authenticated_users_create_views"
ON public.product_views
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 10. Storage RLS Policies - Pattern 2: Public Storage

-- Anyone can view product images (including anonymous)
CREATE POLICY "public_can_view_product_images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Only authenticated users can upload product images
CREATE POLICY "authenticated_users_upload_product_images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Only file owner can update/delete their product images
CREATE POLICY "owners_manage_product_images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images' AND owner = auth.uid())
WITH CHECK (bucket_id = 'product-images' AND owner = auth.uid());

CREATE POLICY "owners_delete_product_images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND owner = auth.uid());

-- 11. Functions for automatic profile creation and view tracking
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (
        id, 
        email, 
        full_name, 
        role
    )
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')::public.user_role
    );
    RETURN NEW;
END;
$$;

-- Function to increment product views
CREATE OR REPLACE FUNCTION public.increment_product_views(product_uuid UUID)
RETURNS VOID
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update views count
    UPDATE public.products
    SET views_count = views_count + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = product_uuid;
    
    -- Record the view for analytics
    INSERT INTO public.product_views (product_id, viewer_id)
    VALUES (product_uuid, auth.uid())
    ON CONFLICT DO NOTHING;
END;
$$;

-- 12. Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_user_profiles_updated
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_products_updated
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 13. Complete Mock Data with Auth Users
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    student1_uuid UUID := gen_random_uuid();
    student2_uuid UUID := gen_random_uuid();
    product1_id UUID := gen_random_uuid();
    product2_id UUID := gen_random_uuid();
    product3_id UUID := gen_random_uuid();
    product4_id UUID := gen_random_uuid();
    product5_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@iitism.ac.in', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'student@iitism.ac.in', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Rahul Kumar", "role": "student"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'john.doe@iitism.ac.in', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Doe", "role": "student"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create sample products
    INSERT INTO public.products (id, seller_id, title, description, category, condition, price, original_price, images, location, views_count, created_at) VALUES
        (product1_id, student1_uuid, 'Engineering Mathematics by B.S. Grewal - 43rd Edition', 
         'Well-maintained textbook perfect for engineering students. All chapters intact, minimal highlighting.', 
         'textbooks'::public.product_category, 'good'::public.product_condition, 450.00, 650.00,
         ARRAY['https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg'],
         'Hostel 5, Room 204', 45, now() - interval '2 days'),

        (product2_id, student1_uuid, 'iPhone 13 128GB Blue - Excellent Condition with Box',
         'Barely used iPhone 13 in excellent condition. Comes with original box, charger, and screen protector already applied.',
         'electronics'::public.product_category, 'excellent'::public.product_condition, 52000.00, 69900.00,
         ARRAY['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'],
         'Girls Hostel 2', 128, now() - interval '1 day'),

        (product3_id, student2_uuid, 'Study Table with Chair - Wooden, Perfect for Hostel',
         'Sturdy wooden study table with matching chair. Perfect size for hostel rooms. Some minor scratches but very functional.',
         'furniture'::public.product_category, 'good'::public.product_condition, 2500.00, 4000.00,
         ARRAY['https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg'],
         'Hostel 7, Room 156', 67, now() - interval '3 days'),

        (product4_id, student2_uuid, 'Hero Splendor Plus 2022 - Well Maintained',
         'Well-maintained Hero Splendor Plus 2022 model. Regular servicing done. Good mileage and smooth ride.',
         'bikes'::public.product_category, 'excellent'::public.product_condition, 45000.00, 68000.00,
         ARRAY['https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg'],
         'Hostel 3, Room 89', 234, now() - interval '4 days'),

        (product5_id, student1_uuid, 'MacBook Air M1 2021 - 8GB RAM, 256GB SSD',
         'MacBook Air M1 2021 in excellent condition. Perfect for coding and academic work. Battery health at 95%.',
         'electronics'::public.product_category, 'excellent'::public.product_condition, 75000.00, 92900.00,
         ARRAY['https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg'],
         'Girls Hostel 1', 89, now() - interval '1 day');

    -- Create some wishlists
    INSERT INTO public.wishlists (user_id, product_id) VALUES
        (student2_uuid, product1_id),
        (student2_uuid, product2_id),
        (student1_uuid, product3_id);

    -- Create some product views for analytics
    INSERT INTO public.product_views (product_id, viewer_id, viewed_at) VALUES
        (product1_id, student2_uuid, now() - interval '1 hour'),
        (product2_id, student2_uuid, now() - interval '2 hours'),
        (product3_id, student1_uuid, now() - interval '30 minutes'),
        (product4_id, student1_uuid, now() - interval '3 hours'),
        (product5_id, student2_uuid, now() - interval '45 minutes');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 14. Helper function for search
CREATE OR REPLACE FUNCTION public.search_products(
    search_query TEXT DEFAULT '',
    category_filter public.product_category DEFAULT NULL,
    min_price DECIMAL DEFAULT NULL,
    max_price DECIMAL DEFAULT NULL,
    limit_count INTEGER DEFAULT 50,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
    id UUID,
    title TEXT,
    description TEXT,
    category public.product_category,
    condition public.product_condition,
    price DECIMAL,
    original_price DECIMAL,
    images TEXT[],
    location TEXT,
    views_count INTEGER,
    seller_name TEXT,
    seller_location TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.description,
        p.category,
        p.condition,
        p.price,
        p.original_price,
        p.images,
        p.location,
        p.views_count,
        up.full_name as seller_name,
        up.hostel_location as seller_location,
        p.created_at
    FROM public.products p
    JOIN public.user_profiles up ON p.seller_id = up.id
    WHERE p.is_available = true
        AND (search_query = '' OR (
            p.title ILIKE '%' || search_query || '%' OR 
            p.description ILIKE '%' || search_query || '%'
        ))
        AND (category_filter IS NULL OR p.category = category_filter)
        AND (min_price IS NULL OR p.price >= min_price)
        AND (max_price IS NULL OR p.price <= max_price)
    ORDER BY p.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$;