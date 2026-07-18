import { db } from "./src/lib/db";
import { helpArticles } from "./src/lib/db/schema";
import { randomUUID } from "crypto";

async function main() {
  console.log("Deleting old articles...");
  await db.delete(helpArticles);

  console.log("Seeding industry expert articles...");
  
  const articles = [
    // AUTHENTICATION
    { category: "authentication", title: "Auth0: What is Authentication?", slug: "auth0-what-is-authentication", url: "https://auth0.com/intro-to-iam/what-is-authentication", summary: "A comprehensive guide by Auth0 on the fundamentals of user authentication." },
    { category: "authentication", title: "OWASP Authentication Cheat Sheet", slug: "owasp-auth-cheat-sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html", summary: "The definitive guide to secure authentication implementation by OWASP." },
    { category: "authentication", title: "OAuth 2.0 Simplified", slug: "oauth-2-simplified", url: "https://oauth.net/2/", summary: "An expert breakdown of the OAuth 2.0 framework and how it handles authorization." },
    { category: "authentication", title: "Understanding JWTs (JSON Web Tokens)", slug: "understanding-jwts", url: "https://jwt.io/introduction", summary: "Learn how JWTs are used for secure authentication across modern web apps." },
    { category: "authentication", title: "WebAuthn & Passkeys Guide", slug: "webauthn-guide", url: "https://webauthn.guide/", summary: "A developer's guide to implementing passwordless authentication using WebAuthn." },

    // ACCOUNT
    { category: "account", title: "Best Practices for User Profile Management", slug: "user-profile-management", url: "https://www.nngroup.com/articles/user-profiles/", summary: "Nielsen Norman Group's research on designing effective account settings pages." },
    { category: "account", title: "Stripe: Managing Customer Accounts", slug: "stripe-customer-accounts", url: "https://stripe.com/docs/billing/customer", summary: "Industry standard guide on how SaaS platforms manage user accounts." },
    { category: "account", title: "GDPR Guidelines for User Data", slug: "gdpr-user-data", url: "https://gdpr.eu/data-privacy/", summary: "Expert documentation on how user account data must be handled." },
    { category: "account", title: "Designing Account Recovery Flows", slug: "account-recovery-flows", url: "https://www.smashingmagazine.com/2021/04/designing-account-recovery-flows/", summary: "Smashing Magazine's best practices for account recovery." },
    { category: "account", title: "The UX of Account Settings", slug: "ux-account-settings", url: "https://uxdesign.cc/the-ux-of-account-settings-4b08c2a3b0f", summary: "A deep dive into building intuitive account management screens." },

    // SECURITY
    { category: "security", title: "OWASP Top 10 Web Application Security Risks", slug: "owasp-top-10", url: "https://owasp.org/www-project-top-ten/", summary: "The most critical security risks to web applications, according to industry experts." },
    { category: "security", title: "Cloudflare: What is Web Security?", slug: "cloudflare-web-security", url: "https://www.cloudflare.com/learning/security/what-is-web-security/", summary: "Cloudflare's comprehensive guide to protecting web applications." },
    { category: "security", title: "NIST Cybersecurity Framework", slug: "nist-framework", url: "https://www.nist.gov/cyberframework", summary: "The gold standard framework for improving organizational cybersecurity." },
    { category: "security", title: "CORS (Cross-Origin Resource Sharing)", slug: "mdn-cors", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS", summary: "Mozilla Developer Network's guide to CORS security policies." },
    { category: "security", title: "Defending Against CSRF Attacks", slug: "csrf-defense", url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html", summary: "How to protect your application from Cross-Site Request Forgery." },

    // API
    { category: "api", title: "Microsoft REST API Guidelines", slug: "microsoft-rest-api", url: "https://github.com/microsoft/api-guidelines", summary: "Microsoft's official guidelines for designing RESTful APIs." },
    { category: "api", title: "GraphQL vs REST", slug: "graphql-vs-rest", url: "https://www.apollographql.com/blog/graphql/basics/graphql-vs-rest/", summary: "Apollo's expert comparison between GraphQL and traditional REST APIs." },
    { category: "api", title: "API Rate Limiting Strategies", slug: "api-rate-limiting", url: "https://cloud.google.com/architecture/rate-limiting-strategies-techniques", summary: "Google Cloud's architectural guide to API rate limiting." },
    { category: "api", title: "Stripe's API Design Philosophy", slug: "stripe-api-design", url: "https://stripe.com/blog/api-versioning", summary: "How Stripe designed one of the best APIs in the industry." },
    { category: "api", title: "Webhooks Best Practices", slug: "webhooks-best-practices", url: "https://hookdeck.com/webhooks/guides/webhooks-best-practices", summary: "The definitive guide to securely receiving and processing webhooks." },

    // PRIVACY
    { category: "privacy", title: "GDPR Compliance Checklist", slug: "gdpr-checklist", url: "https://gdpr.eu/checklist/", summary: "The official checklist for ensuring your application is GDPR compliant." },
    { category: "privacy", title: "CCPA Guide for Developers", slug: "ccpa-guide", url: "https://oag.ca.gov/privacy/ccpa", summary: "Understanding the California Consumer Privacy Act." },
    { category: "privacy", title: "Apple's Privacy Guidelines", slug: "apple-privacy", url: "https://developer.apple.com/app-store/app-privacy-details/", summary: "How Apple enforces privacy across applications." },
    { category: "privacy", title: "Data Minimization Principles", slug: "data-minimization", url: "https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/principles/data-minimization/", summary: "Why collecting less data is better for security and privacy." },
    { category: "privacy", title: "SOC 2 Compliance Overview", slug: "soc2-overview", url: "https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/sorhome.html", summary: "What SaaS companies need to know about SOC 2 compliance." },

    // ANALYTICS
    { category: "analytics", title: "Google Analytics 4 Documentation", slug: "ga4-docs", url: "https://developers.google.com/analytics", summary: "The official developer documentation for GA4." },
    { category: "analytics", title: "PostHog: Product Analytics Guide", slug: "posthog-analytics", url: "https://posthog.com/product-analytics", summary: "How to use product analytics to improve user retention." },
    { category: "analytics", title: "Mixpanel vs Amplitude", slug: "mixpanel-amplitude", url: "https://mixpanel.com/blog/mixpanel-vs-amplitude/", summary: "A comparison of the top event-based analytics platforms." },
    { category: "analytics", title: "Tracking SaaS Metrics (ARR, MRR, Churn)", slug: "saas-metrics", url: "https://www.profitwell.com/recur/all/saas-metrics", summary: "ProfitWell's expert guide to the most important analytics for SaaS." },
    { category: "analytics", title: "A/B Testing Best Practices", slug: "ab-testing", url: "https://vwo.com/ab-testing/", summary: "How to run statistically significant A/B tests." },

    // TROUBLESHOOTING
    { category: "troubleshooting", title: "How to Debug React Applications", slug: "debug-react", url: "https://react.dev/learn/react-developer-tools", summary: "The official guide to using React Developer Tools for troubleshooting." },
    { category: "troubleshooting", title: "Debugging Node.js Performance", slug: "debug-nodejs", url: "https://nodejs.org/en/docs/guides/debugging-getting-started/", summary: "How to find memory leaks and bottlenecks in Node.js." },
    { category: "troubleshooting", title: "Frontend Performance Troubleshooting", slug: "frontend-performance", url: "https://web.dev/fast/", summary: "Google's web.dev guide to diagnosing frontend performance issues." },
    { category: "troubleshooting", title: "Understanding HTTP Error Codes", slug: "http-errors", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status", summary: "MDN's comprehensive list of all HTTP status codes." },
    { category: "troubleshooting", title: "Debugging CSS Grid & Flexbox", slug: "debug-css", url: "https://developer.chrome.com/docs/devtools/css/grid/", summary: "Using Chrome DevTools to troubleshoot layout issues." },

    // SEARCH & FINDER
    { category: "search", title: "Algolia Search Design Guidelines", slug: "algolia-design", url: "https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/in-depth/search-ux-best-practices/", summary: "Algolia's expert advice on designing intuitive search experiences." },
    { category: "search", title: "Elasticsearch Architecture", slug: "elasticsearch-arch", url: "https://www.elastic.co/guide/en/elasticsearch/reference/current/elasticsearch-intro.html", summary: "How Elasticsearch powers enterprise search." },
    { category: "search", title: "Vector Databases for AI Search", slug: "vector-dbs", url: "https://www.pinecone.io/learn/vector-database/", summary: "Pinecone's guide to how vector databases improve semantic search." },
    { category: "search", title: "Designing Filters and Facets", slug: "filters-facets", url: "https://www.smashingmagazine.com/2021/08/designing-filters-facets-ecommerce/", summary: "Best practices for building complex filtering systems." },
    { category: "search", title: "The Anatomy of a Search Result", slug: "search-result-ux", url: "https://uxplanet.org/anatomy-of-a-search-result-page-37a5496de5b8", summary: "How to present search results effectively to users." },

    // AI RANKINGS
    { category: "rankings", title: "LMSYS Chatbot Arena Leaderboard", slug: "lmsys-leaderboard", url: "https://chat.lmsys.org/", summary: "The industry standard crowdsourced LLM ranking system." },
    { category: "rankings", title: "Hugging Face Open LLM Leaderboard", slug: "huggingface-leaderboard", url: "https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard", summary: "The definitive ranking for open-source AI models." },
    { category: "rankings", title: "Understanding AI Benchmarks (MMLU, HumanEval)", slug: "ai-benchmarks", url: "https://arxiv.org/abs/2009.03300", summary: "A deep dive into how AI models are objectively scored." },
    { category: "rankings", title: "The Problem with AI Evaluation", slug: "ai-eval-problems", url: "https://scale.com/blog/llm-evaluation", summary: "Scale AI's expert take on why ranking AI models is incredibly difficult." },
    { category: "rankings", title: "Gartner Magic Quadrant for AI", slug: "gartner-ai", url: "https://www.gartner.com/en/information-technology/research/magic-quadrant", summary: "How enterprise analysts rank AI vendors." },

    // PUBLIC STACKS
    { category: "stacks", title: "The Modern Data Stack", slug: "modern-data-stack", url: "https://a16z.com/2020/10/15/the-emerging-architectures-for-modern-data-infrastructure/", summary: "Andreessen Horowitz's breakdown of modern technology stacks." },
    { category: "stacks", title: "Jamstack Architecture", slug: "jamstack", url: "https://jamstack.org/what-is-jamstack/", summary: "The official guide to building decoupled web applications." },
    { category: "stacks", title: "Awesome Tech Stacks", slug: "awesome-stacks", url: "https://github.com/techstacks/techstacks", summary: "A curated list of technology stacks used by top companies." },
    { category: "stacks", title: "Choosing the Right Tech Stack for SaaS", slug: "saas-tech-stack", url: "https://www.ycombinator.com/library/4D-how-to-choose-your-tech-stack", summary: "Y Combinator's advice on picking technologies for a startup." },
    { category: "stacks", title: "Vercel's Edge Architecture", slug: "vercel-edge", url: "https://vercel.com/docs/edge-network/overview", summary: "How Vercel's tech stack delivers applications globally." }
  ];

  const toInsert = articles.map(a => ({
    id: randomUUID(),
    title: a.title,
    slug: a.slug,
    content: `Redirects to ${a.url}`, // Actually handled by UI but required by schema
    summary: a.summary,
    category: a.category,
    status: "published",
    read_time: 5,
    // Add the URL to tags or just modify the schema slightly if it doesn't have URL. 
    // Wait, the original schema didn't have a URL field.
    // Let me store the URL in a way the frontend can use it. Maybe I can modify help.tsx to look at the slug if it's a URL, or store the URL in the `tags` field?
    // Actually, in help.tsx I did `<a href={\`/help/\${article.slug}\`}`. I can change help.tsx to `<a href={article.slug.startsWith('http') ? article.slug : \`/help/\${article.slug}\`}` and put the URL in the slug!
    // Let's do exactly that: put the URL in the slug!
  }));

  for (const article of toInsert) {
    // Overwrite slug with the actual URL so it opens directly in the new tab!
    article.slug = articles.find(x => x.title === article.title)!.url;
    await db.insert(helpArticles).values(article);
  }

  console.log(`Successfully seeded ${toInsert.length} industry expert articles!`);
  process.exit(0);
}

main().catch(console.error);
