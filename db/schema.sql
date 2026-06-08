-- ==========================================
-- 1. MANAJEMEN PENGGUNA & CRM
-- ==========================================
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'member',     -- 'admin', 'member'
    crm_data JSON,                  -- Format dinamis untuk Monday.com style (nama, telepon, status lead, dll)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_email ON users(email);

-- ==========================================
-- 2. KATEGORI (Hirarki Parent/Child Universal)
-- ==========================================
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    parent_id TEXT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,             -- 'blog', 'product', 'service', 'portfolio', 'project'
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
);
CREATE INDEX idx_categories_type_slug ON categories(type, slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- ==========================================
-- 3. CMS: STATIC PAGES (Desain Polos & Bersih)
-- ==========================================
CREATE TABLE pages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    seo_title TEXT,
    seo_description TEXT,
    status TEXT DEFAULT 'draft',    -- 'draft', 'published'
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);

-- ==========================================
-- 4. CMS: BLOG (Desain Tipografi & Jurnalistik)
-- ==========================================
CREATE TABLE blogs (
    id TEXT PRIMARY KEY,
    category_id TEXT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    cover_image_url TEXT,
    author_id TEXT NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    status TEXT DEFAULT 'draft',
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (author_id) REFERENCES users(id)
);
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_status ON blogs(status);

-- ==========================================
-- 5. CMS: SERVICES (Desain Konversi & Fitur)
-- ==========================================
CREATE TABLE services (
    id TEXT PRIMARY KEY,
    category_id TEXT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    icon_name TEXT,
    content TEXT,
    benefits_json JSON,             -- Array fitur/keuntungan
    cta_text TEXT DEFAULT 'Konsultasi Sekarang',
    status TEXT DEFAULT 'draft',
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
CREATE INDEX idx_services_slug ON services(slug);

-- ==========================================
-- 6. CMS: PORTFOLIO (Desain Visual & Studi Kasus)
-- ==========================================
CREATE TABLE portfolios (
    id TEXT PRIMARY KEY,
    category_id TEXT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    client_name TEXT,
    completion_date DATE,
    website_url TEXT,
    cover_image_url TEXT,
    content TEXT,
    gallery_json JSON,              -- Array URL gambar
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
CREATE INDEX idx_portfolios_slug ON portfolios(slug);

-- ==========================================
-- 7. CMS: PRODUCTS (Katalog Produk Bisnis)
-- ==========================================
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    category_id TEXT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    content TEXT,
    price REAL DEFAULT 0,
    currency TEXT DEFAULT 'IDR',
    cover_image_url TEXT,
    gallery_json JSON,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);

-- ==========================================
-- 8. PENGATURAN GLOBAL & TERJEMAHAN (i18n)
-- ==========================================
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value JSON
);

CREATE TABLE translations (
    id TEXT PRIMARY KEY,
    lang_code TEXT NOT NULL,        -- 'id', 'en'
    key TEXT NOT NULL,              -- 'nav.home'
    value TEXT NOT NULL,
    UNIQUE(lang_code, key)
);
CREATE INDEX idx_translations_lang ON translations(lang_code);

-- ==========================================
-- 9. MANAJEMEN MENU
-- ==========================================
CREATE TABLE menus (
    id TEXT PRIMARY KEY,
    parent_id TEXT NULL,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (parent_id) REFERENCES menus(id) ON DELETE CASCADE
);
CREATE INDEX idx_menus_parent ON menus(parent_id);

-- ==========================================
-- 10. MANAJEMEN PROYEK (Project Tracking CRM)
-- ==========================================
CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    category_id TEXT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'planning', -- 'planning', 'in-progress', 'review', 'completed'
    start_date DATE,
    end_date DATE,
    budget REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);

CREATE TABLE project_tracks (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    progress_percentage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'todo',     -- 'todo', 'doing', 'done', 'blocked'
    notes_for_client TEXT,
    updated_by TEXT NOT NULL,       -- Admin yang melakukan update
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id)
);
CREATE INDEX idx_project_tracks_project ON project_tracks(project_id);

-- ==========================================
-- 11. MANAJEMEN KONTAK & TIKET
-- ==========================================
CREATE TABLE contacts (
    id TEXT PRIMARY KEY,
    tracking_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',   -- 'unread', 'read', 'replied'
    admin_reply TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_contacts_tracking_id ON contacts(tracking_id);
CREATE INDEX idx_contacts_status ON contacts(status);

-- ==========================================
-- 12. MANAJEMEN WIDGETS (Sistem ala WordPress)
-- ==========================================
CREATE TABLE widgets (
    id TEXT PRIMARY KEY,
    area TEXT NOT NULL,             -- 'sidebar_blog', 'sidebar_service', 'footer_1', dll
    type TEXT NOT NULL,             -- 'html', 'recent_posts', 'categories', 'text'
    title TEXT,
    content JSON,                   -- Konfigurasi widget
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,    -- 1 (aktif), 0 (nonaktif)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_widgets_area_active ON widgets(area, is_active);
