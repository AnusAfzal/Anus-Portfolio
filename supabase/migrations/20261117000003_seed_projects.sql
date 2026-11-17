-- =============================================================================
-- Migration 03: Idempotent Seed Data for Projects
-- Uses authentic data from portfolioData.js without fabricating links or duplicates
-- =============================================================================

INSERT INTO public.projects (
    title,
    slug,
    description,
    technologies,
    github_url,
    live_url,
    category,
    status,
    featured,
    display_order
)
VALUES
    (
        'LiftLog',
        'liftlog',
        'A dedicated fitness and workout tracking mobile application designed to log exercise routines, record training sets, and monitor fitness progression over time.',
        ARRAY['React Native', 'Expo', 'Supabase', 'JavaScript'],
        'https://github.com/AnusAfzal/LiftLog',
        NULL,
        'Mobile',
        'In Development',
        TRUE,
        1
    ),
    (
        'Moment',
        'moment',
        'A private university memories and community application engineered for students to preserve, catalog, and share daily campus moments and memories.',
        ARRAY['React Native', 'Expo', 'Node.js', 'Express.js'],
        'https://github.com/AnusAfzal/Moment-mobile',
        NULL,
        'Mobile',
        'In Development',
        TRUE,
        2
    ),
    (
        'Blog Website',
        'blog-website',
        'A dynamic server-side rendered blogging application built with Node.js and Express.js, featuring content creation, dynamic routing, and database storage.',
        ARRAY['Node.js', 'Express.js', 'EJS', 'MongoDB', 'CSS3'],
        'https://github.com/AnusAfzal/Web-Development-Projects/tree/main/Backend/Blog%20Website',
        NULL,
        'Full Stack',
        'Completed',
        FALSE,
        3
    ),
    (
        'Weather API Application',
        'weather-app',
        'A responsive meteorological application integrating third-party weather APIs to deliver real-time atmospheric data, temperature forecasts, and dynamic condition displays.',
        ARRAY['JavaScript', 'Weather API', 'HTML5', 'CSS3'],
        'https://github.com/AnusAfzal/Web-Development-Projects/tree/main/Frontend/Weather%20App',
        NULL,
        'Frontend',
        'Completed',
        FALSE,
        4
    ),
    (
        'Spotify Clone',
        'spotify-clone',
        'A frontend interface recreation of the popular music streaming service, highlighting component hierarchy, modern layout architecture, and audio player controls.',
        ARRAY['React', 'JavaScript', 'CSS3', 'HTML5'],
        'https://github.com/AnusAfzal/Spotify-Clone',
        NULL,
        'Frontend',
        'Completed',
        FALSE,
        5
    ),
    (
        'Amazon Clone',
        'amazon-clone',
        'An e-commerce web platform clone replicating Amazon''s core storefront experience, featuring product grid displays, shopping cart management, and price calculations.',
        ARRAY['React', 'JavaScript', 'CSS3', 'HTML5'],
        'https://github.com/AnusAfzal/Amazon-Clone',
        NULL,
        'Frontend',
        'Completed',
        FALSE,
        6
    )
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    technologies = EXCLUDED.technologies,
    github_url = EXCLUDED.github_url,
    live_url = EXCLUDED.live_url,
    category = EXCLUDED.category,
    status = EXCLUDED.status,
    featured = EXCLUDED.featured,
    display_order = EXCLUDED.display_order,
    updated_at = timezone('utc'::text, now());
