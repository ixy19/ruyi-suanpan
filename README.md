# 茹意算盤 Ruyi Suanpan — Website Starter

## 已建立內容
- Responsive static website (Traditional Chinese-first interface with a basic English UI toggle)
- Founder illustration imported from your ZIP archive
- 65 Word documents extracted into individual article pages and a searchable library
- Four core knowledge pillars, plus market commentary and course/reference resources
- Financial Q&A demo (browser-local only; not connected to a shared database)
- Three sample financial-learning quiz levels
- About, contact, privacy, and educational disclaimer pages

## Important before public launch
All imported articles are labelled as editorial drafts / pending review. They may contain time-sensitive tax rules, insurance product details, interest rates, market data, or unverified claims. Review dates, figures, legal references, citations, and professional compliance before publishing. The site does not provide individualized financial, tax, legal, insurance, or investment advice.

The English toggle currently translates key navigation and selected homepage copy only. Article bodies remain in the original Chinese; English translations should be created and reviewed article by article.

## Current technical limits
This is a static front-end starter. Q&A entries are saved only in the visitor's own browser using localStorage. They are NOT sent to the founder and are NOT visible to other visitors. There is no secure admin login, shared database, email notification workflow, or real submission backend yet. Do not collect sensitive personal or financial information in this demo.

## Publish with GitHub + Cloudflare Pages
1. Download and unzip this project.
2. Open your GitHub repository: https://github.com/ixy19/ruyi-suanpan
3. Upload the contents of this folder to the repository root (not the outer folder itself), then commit the changes.
4. In Cloudflare, open Workers & Pages → Create → Pages → Connect to Git.
5. Select `ixy19/ruyi-suanpan`; use framework preset `None`; leave build command blank; set build output directory to `/` (or the repository root, depending on the Cloudflare UI).
6. Deploy. Cloudflare will provide a preview URL. Add a custom domain later if desired.

## Next backend phase
For shared anonymous Q&A, moderation, article management, admin authentication, and email notifications, connect Supabase (database + row-level security + authentication) and a server-side email provider such as Resend. Keep service-role keys and email API keys on the server only; never place secret keys in browser JavaScript.
