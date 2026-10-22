import fs from 'node:fs';
import path from 'node:path';
import { PROMPT_CATEGORIES, type PromptCategory, type PromptEntry } from '../src/lib/data/prompts.ts';

const PROMPT_TEMPLATES: Record<PromptCategory, Array<{
  title: string;
  tags: string[];
  body: string;
}>> = {
  "Coding": [
    {
      title: "Clean Architecture REST Controller Generator",
      tags: ["typescript", "clean-architecture", "backend"],
      body: `You are a Principal Software Architect. Implement a production-grade TypeScript controller and service layer for {entityName}.\nRequirements:\n1. Strict input validation using Zod.\n2. Inversion of control / Dependency injection pattern.\n3. Detailed domain error types (NotFound, Conflict, Unauthorized) mapped to HTTP status codes.\n4. Idempotency handling for mutating endpoints.\n5. Full unit test coverage blueprint with Vitest.`
    },
    {
      title: "Idiomatic Concurrent Go Worker Pool",
      tags: ["golang", "concurrency", "performance"],
      body: `Design a thread-safe, bounded worker pool in Golang to process high-throughput jobs: {jobType}.\n- Implement context cancellation and graceful SIGTERM shutdown.\n- Prevent goroutine leaks using sync.WaitGroup and channel buffering.\n- Collect metrics on throughput, active workers, and queue backlog.\n- Write benchmark tests demonstrating allocation efficiency.`
    },
    {
      title: "High-Performance React TanStack Virtualizer",
      tags: ["react", "frontend", "optimization"],
      body: `Create a responsive React 19 component that renders 100,000+ rows using TanStack Virtual.\n- Support dynamic row heights and smooth scroll-to-index.\n- Implement keyboard navigation (Arrow Up/Down, Home, End).\n- Maintain accessible ARIA grid roles.\n- Optimize re-renders with memoization and CSS content-visibility.`
    },
    {
      title: "Drizzle ORM Normalized Schema with Foreign Keys & Indexes",
      tags: ["sql", "database", "drizzle-orm"],
      body: `Define a relational schema in TypeScript using Drizzle ORM for {domainModel}.\n- Define primary keys (UUIDv7 or ULID), foreign key constraints with cascade behaviors.\n- Add composite indexes for common queries.\n- Add soft-delete timestamps and automatic updated_at triggers.\n- Include sample seed data with complex joins.`
    },
    {
      title: "Robust Retry with Exponential Backoff & Jitter",
      tags: ["resilience", "networking", "distributed-systems"],
      body: `Implement a resilient HTTP client wrapper in TypeScript that handles transient network errors and rate limits (429, 503).\n- Exponential backoff with Full Jitter algorithm.\n- Respect 'Retry-After' response headers.\n- Circuit breaker integration to trip after N consecutive failures.\n- Emits telemetry events for monitoring.`
    }
  ],
  "Debugging": [
    {
      title: "Deep Memory Leak & Heap Dump Diagnostic Protocol",
      tags: ["nodejs", "memory", "profiling"],
      body: `Analyze the provided Node.js V8 heap profile or memory growth symptom: {issueDescription}.\n1. Identify potential retaining paths keeping objects from being garbage collected (closures, unremoved event listeners, global caches).\n2. Provide specific diagnostic commands using --inspect, heap snapshots, and clinic.js.\n3. Give the exact code refactor required to isolate and eliminate the retention leak.`
    },
    {
      title: "Distributed Async Race Condition Root Cause Analysis",
      tags: ["concurrency", "distributed", "debugging"],
      body: `Given the following intermittent database/state inconsistency: {errorLog}.\n1. Formulate 3 distinct hypotheses on where concurrency or async race conditions occur.\n2. Trace database transaction isolation levels (Read Committed vs Serializable) and optimistic locking opportunities.\n3. Propose a deterministic reproduction script to prove the race condition.`
    },
    {
      title: "Microservice 504 Gateway Timeout Cascade Debugger",
      tags: ["networking", "microservices", "latency"],
      body: `Our API gateway is returning 504 Gateway Timeouts under sudden traffic spikes. Here is the architecture and tracing logs: {context}.\n1. Analyze upstream connection pool exhaustion and DNS resolution bottleneck risks.\n2. Evaluate timeout budgets across the downstream call graph.\n3. Provide immediate configuration tweaks and architectural circuit-breaker defenses.`
    },
    {
      title: "Hydration Mismatch Detector & SSR Stabilizer",
      tags: ["react", "nextjs", "ssr"],
      body: `We are encountering React SSR hydration mismatch warning: '{errorMessage}'.\n- Explain the exact divergence between server render tree and client DOM.\n- Audit common culprits (window/localStorage access, date formatting, browser extensions, Math.random).\n- Refactor the component using clean useEffect state hydration or suppressHydrationWarning strategies.`
    },
    {
      title: "SQL Query Plan Profiler & Index Optimizer",
      tags: ["postgresql", "performance", "explain-analyze"],
      body: `Review this slow PostgreSQL EXPLAIN (ANALYZE, BUFFERS) query plan: {explainOutput}.\n1. Identify sequential scans, expensive nested loops, or hash join memory spillage.\n2. Point out missing partial indexes, bloated table statistics, or planner misestimations.\n3. Provide the optimized SQL query rewrite and precise CREATE INDEX DDL.`
    }
  ],
  "Code Review": [
    {
      title: "Senior Security & Vulnerability Focused Code Review",
      tags: ["security", "owasp", "code-review"],
      body: `Conduct an exhaustive security-focused code review on this pull request diff: {diff}.\n- Check for OWASP Top 10: SQL injection, IDOR, SSRF, XSS, and broken access controls.\n- Validate authentication and session lifecycle checks.\n- Ensure no secrets, tokens, or PII are logged or transmitted insecurely.\n- Provide line-by-line remediations with explanations of the threat vectors.`
    },
    {
      title: "API Design & Backward Compatibility Audit",
      tags: ["api-design", "rest", "versioning"],
      body: `Review the proposed API modifications to ensure zero breaking changes for existing consumers: {apiSpec}.\n- Verify field deprecation cycles, response schema additions, and query parameter defaults.\n- Check naming conventions for consistency and RESTful idempotency.\n- Ensure pagination semantics (cursor vs offset) adhere to enterprise standards.`
    },
    {
      title: "Clean Code & SOLID Principles Maintainability Review",
      tags: ["refactoring", "clean-code", "solid"],
      body: `Evaluate this codebase module against SOLID design principles and Clean Architecture: {codeSnippet}.\n1. Single Responsibility: are classes/modules doing too much?\n2. Interface Segregation: are interfaces lean and purposeful?\n3. High Cyclomatic Complexity: identify deeply nested conditionals to simplify with early returns or strategy patterns.`
    },
    {
      title: "Frontend Accessibility (a11y) & WCAG 2.1 AA Audit",
      tags: ["accessibility", "a11y", "wcag"],
      body: `Audit this UI component implementation for WCAG 2.1 AA compliance: {componentCode}.\n- Check keyboard navigation (focus traps, tab order, Esc behavior).\n- Verify correct ARIA attributes (role, aria-expanded, aria-controls, aria-live).\n- Confirm semantic HTML5 elements are preferred over generic div/span tags.\n- Validate color contrast ratios and screen-reader announcements.`
    },
    {
      title: "Distributed Systems Failure Mode & Chaos Review",
      tags: ["distributed-systems", "fault-tolerance", "chaos"],
      body: `Review the proposed microservice communication flow: {systemFlow}.\n- What happens if Service B is slow (p99 > 5s)?\n- What happens if the message queue drops messages or delivers duplicates?\n- Are state mutations idempotent? How are distributed transactions compensated?\n- Provide concrete resiliency recommendations.`
    }
  ],
  "Testing": [
    {
      title: "Comprehensive E2E Playwright Journey Generator",
      tags: ["playwright", "e2e", "qa"],
      body: `Write an end-to-end test in Playwright for the user journey: {journeyName}.\n- Use data-testid selectors for UI resilience.\n- Test both happy path and edge-case failure states.\n- Include custom authentication fixtures.\n- Ensure zero race conditions by avoiding hardcoded sleep statements in favor of web assertions.`
    },
    {
      title: "Edge-Case Property-Based Test Suite",
      tags: ["unit-testing", "fast-check", "edge-cases"],
      body: `Create property-based tests using fast-check (or equivalent) for the function: {functionSignature}.\n- Test invariant properties across extreme inputs: empty strings, MAX_INT, unicode emojis, SQL injection strings.\n- Assert that reversing operations produces original values.\n- Verify graceful error handling rather than unhandled exceptions.`
    },
    {
      title: "Contract Testing with Pact for Microservices",
      tags: ["contract-testing", "pact", "microservices"],
      body: `Define consumer-driven contract tests using Pact for the service contract between {consumer} and {provider}.\n- Define expected request headers, payloads, and response bodies with type matchers.\n- Handle negative 4xx/5xx responses.\n- Generate the Pact JSON contract specification to run in CI.`
    },
    {
      title: "High-Load Locust Performance Stress Test",
      tags: ["load-testing", "locust", "performance"],
      body: `Write a Python Locust load-testing scenario simulating 10,000 concurrent users accessing {endpointList}.\n- Simulate realistic user think time and task weighting.\n- Test user authentication token renewal.\n- Assert SLA thresholds: p95 response time < 200ms, error rate < 0.1%.`
    },
    {
      title: "Mocking Strategy for Third-Party API Integrations",
      tags: ["mocking", "msw", "integration-tests"],
      body: `Set up Mock Service Worker (MSW) handlers in TypeScript to intercept and test third-party integrations with {apiName}.\n- Mock successful 200 responses, 429 rate limit errors with retry headers, and 500 server crashes.\n- Test how your application client handles network timeouts and malformed JSON payloads.`
    }
  ],
  "Documentation": [
    {
      title: "Stripe-Grade Developer API Reference & Quickstart",
      tags: ["api-docs", "developer-experience", "openapi"],
      body: `Write a developer-first documentation guide for the {apiEndpoint} endpoint.\n- Clear explanation of the endpoint's purpose, authentication method, and rate limits.\n- Side-by-side request and response examples in cURL, JavaScript, and Python.\n- Detailed parameter table with data types, constraints, and descriptions.\n- Error handling table explaining every possible status code and resolution.`
    },
    {
      title: "Architecture Decision Record (ADR) Formal Template",
      tags: ["adr", "architecture", "governance"],
      body: `Draft a formal Architecture Decision Record (ADR) for: {decisionTitle}.\n- Context: What technical problem or business constraint prompted this decision?\n- Decision: What choice was made, and what alternative solutions were evaluated?\n- Consequences: What are the positive trade-offs, negative costs, and operational obligations?`
    },
    {
      title: "Production Incident Post-Mortem & Root Cause Analysis",
      tags: ["post-mortem", "sre", "reliability"],
      body: `Draft a blameless engineering incident post-mortem for: {incidentDetails}.\n- Executive Summary: Impact duration, affected users, financial SLA impact.\n- Incident Timeline: Minute-by-minute detection, triage, mitigation, and resolution events.\n- Root Cause Analysis using the '5 Whys' framework.\n- Action Items: Preventative engineering work with assigned owners and priority levels.`
    },
    {
      title: "Comprehensive Open-Source README & Quickstart",
      tags: ["readme", "open-source", "dx"],
      body: `Write a high-converting, crystal-clear GitHub README for the project: {projectName}.\n- Catchy hero tagline and dynamic badge links (build, license, coverage).\n- Key features with bulleted visual icons.\n- 60-second quickstart installation and environment variable guide.\n- Contributing guidelines, security vulnerability disclosure, and MIT license summary.`
    },
    {
      title: "System Runbook & Operational Disaster Recovery Guide",
      tags: ["runbook", "devops", "sre"],
      body: `Write a production runbook for on-call engineers handling alerts for {serviceName}.\n- Alert Definition: What triggers this alert, and what is the customer impact?\n- Diagnostic Steps: Exact CLI commands, logs to check, and metrics dashboards.\n- Mitigation Playbook: Step-by-step instructions to stabilize service within 5 minutes.\n- Escalation Matrix: Who to notify if primary mitigation fails.`
    }
  ],
  "Architecture": [
    {
      title: "Event-Driven Microservices Architecture Blueprint",
      tags: ["event-driven", "kafka", "microservices"],
      body: `Design an event-driven architecture for {systemDomain}.\n- Identify event producers, consumers, and message schemas (Protobuf/Avro).\n- Choose between Apache Kafka, RabbitMQ, and AWS SQS with trade-offs.\n- Implement transactional outbox pattern to guarantee at-least-once delivery.\n- Define consumer group scaling strategies and dead-letter queue (DLQ) redrive policies.`
    },
    {
      title: "Multi-Tenant SaaS Data Isolation Architecture",
      tags: ["multi-tenancy", "saas", "security"],
      body: `Architect a secure multi-tenant data storage strategy for an enterprise B2B SaaS platform.\n- Compare Shared DB + Tenant Column (Row-Level Security) vs Schema-per-tenant vs DB-per-tenant.\n- Design automated tenant provisioning, backup isolation, and data deletion for GDPR.\n- Define cross-tenant data leakage prevention guardrails at the ORM/DB connection level.`
    },
    {
      title: "Zero-Downtime Database Migration Architecture",
      tags: ["database", "migrations", "zero-downtime"],
      body: `Design a multi-phase zero-downtime schema migration plan for table: {tableName} with 100M+ rows.\n- Phase 1: Expand schema (add column, dual-writing).\n- Phase 2: Backfill historical records asynchronously with batch limits.\n- Phase 3: Transition application reads to the new column.\n- Phase 4: Contract schema (deprecate and drop old columns safely).`
    },
    {
      title: "Global Low-Latency Edge Caching & State Architecture",
      tags: ["edge", "cdn", "caching"],
      body: `Design an ultra-low latency edge caching strategy for a global application: {appName}.\n- Cache invalidation strategies: stale-while-revalidate, surrogate keys, and edge webhooks.\n- Handling dynamic authenticated user sessions without bypassing cache.\n- Distributed edge database evaluation (Cloudflare D1, PlanetScale, Turso) vs centralized read replicas.`
    },
    {
      title: "Zero-Trust Security & Identity Architecture",
      tags: ["security", "zero-trust", "iam"],
      body: `Formulate a Zero-Trust architecture specification for enterprise infrastructure.\n- Mutual TLS (mTLS) service-to-service communication with automated certificate rotation.\n- Short-lived scoped JWT access tokens with centralized revocation lists.\n- Fine-grained role-based (RBAC) and attribute-based (ABAC) authorization layers.`
    }
  ],
  "Research": [
    {
      title: "Systematic Literature Review & Meta-Synthesis",
      tags: ["academic", "literature-review", "methodology"],
      body: `Conduct a rigorous literature review framework on: {researchTopic}.\n1. Define search string syntax for PubMed, IEEE Xplore, and Google Scholar.\n2. Formulate explicit inclusion and exclusion criteria based on study methodology.\n3. Create a data extraction matrix comparing sample size, methodology, statistical power, and key findings.\n4. Synthesize contradictions and identify critical unanswered research gaps.`
    },
    {
      title: "Hypothesis Formulation & Statistical Test Design",
      tags: ["statistics", "methodology", "data-science"],
      body: `Given the research objective: {objective}.\n- Formulate primary Null Hypothesis (H0) and Alternative Hypothesis (H1).\n- Determine appropriate statistical test (e.g., ANOVA, Chi-Square, Mann-Whitney U, Regression).\n- Calculate required sample size (Power Analysis) for statistical significance (alpha = 0.05, power = 0.80).\n- Detail methods to control for confounding variables and selection bias.`
    },
    {
      title: "Competitive Landscape Matrix & Moat Analysis",
      tags: ["market-research", "strategy", "competitors"],
      body: `Perform a comprehensive competitive landscape analysis for the market sector: {marketSector}.\n- Map direct, indirect, and emerging substitute competitors.\n- Evaluate each player across Pricing, Feature Depth, Enterprise Readiness, and Developer Mindshare.\n- Analyze sustainable competitive moats (Network Effects, Switching Costs, Proprietary Data, Scale Economies).`
    },
    {
      title: "Qualitative User Interview Coding & Thematic Analysis",
      tags: ["ux-research", "qualitative", "thematic-analysis"],
      body: `Analyze the following qualitative interview transcripts: {transcripts}.\n1. Perform first-cycle open coding to identify recurring verbatim phrases.\n2. Group initial codes into second-cycle thematic clusters.\n3. Identify user pain points, emotional friction points, and unmet jobs-to-be-done (JTBD).\n4. Formulate actionable product development recommendations based on evidence.`
    },
    {
      title: "Technological Feasibility & Risk Assessment",
      tags: ["feasibility", "technology", "risk-assessment"],
      body: `Evaluate the technical feasibility of building: {proposedTechnology}.\n- Assess state-of-the-art computational limits, bandwidth bottlenecks, and inference costs.\n- Identify primary architectural failure points and regulatory/compliance roadblocks.\n- Recommend a phased proof-of-concept (PoC) roadmap with measurable validation milestones.`
    }
  ],
  "Academic Writing": [
    {
      title: "High-Impact Abstract & Executive Research Summary",
      tags: ["abstract", "academic", "publishing"],
      body: `Draft a publication-ready 250-word journal abstract based on this research paper draft: {paperNotes}.\n- Background & Motivation (2 sentences): Why does this research matter?\n- Methods (2 sentences): What novel technique or experiment was conducted?\n- Results (2 sentences): What are the key empirical findings with specific quantitative metrics?\n- Conclusion & Significance (1 sentence): How does this advance the field?`
    },
    {
      title: "Peer-Review Critique & Rebuttal Letter Drafter",
      tags: ["peer-review", "rebuttal", "journal"],
      body: `Draft a professional, courteous, and methodologically sound response to reviewer feedback on manuscript: {reviewerComment}.\n- Express appreciation for the reviewer's insight.\n- Clearly outline the concrete revisions, additional experiments, or statistical clarifications made.\n- Provide before-and-after excerpts showing the modified manuscript sections.`
    },
    {
      title: "Dissertation Introduction & Problem Statement",
      tags: ["dissertation", "thesis", "introduction"],
      body: `Draft a compelling opening chapter introduction for a PhD dissertation on: {thesisTopic}.\n- Establish the broader theoretical landscape and historical trajectory of the discipline.\n- Articulate the core research problem and intellectual stakes.\n- Outline the research questions and chapter-by-chapter organizational roadmap.`
    },
    {
      title: "Academic Discussion Section & Limitations Framing",
      tags: ["discussion", "limitations", "academic"],
      body: `Write a balanced academic Discussion section for findings: {findingsData}.\n- Contextualize results against foundational literature.\n- Discuss theoretical and practical implications.\n- Frame methodological limitations transparently (sample constraints, generalizability) while demonstrating why they do not invalidate primary conclusions.`
    },
    {
      title: "Formal Methodology & Experimental Protocol Documentation",
      tags: ["methodology", "reproducibility", "science"],
      body: `Write a replicable Materials and Methods section for: {experimentDetails}.\n- Document equipment specifications, software version numbers, and chemical/dataset sources.\n- Detail step-by-step procedural workflows.\n- Specify data cleaning, normalization, and statistical validation techniques.`
    }
  ],
  "Literature Review": [
    {
      title: "Historical Paradigm Shift Chronology & Synthesis",
      tags: ["history-of-ideas", "synthesis", "review"],
      body: `Synthesize the historical evolution of theories regarding: {conceptName} over the past 30 years.\n- Phase 1: Foundational models and early assumptions.\n- Phase 2: Empirical challenges and critical anomalies.\n- Phase 3: Contemporary synthesis and current emerging paradigms.\n- Highlight seminal papers and authors representing each philosophical shift.`
    },
    {
      title: "Comparative Theoretical Framework Evaluation",
      tags: ["theory", "frameworks", "comparative"],
      body: `Compare and contrast the two dominant theoretical frameworks in: {field}:\n- Framework A vs Framework B.\n- Compare ontological assumptions, explanatory power, and testability.\n- Identify specific empirical scenarios where Framework A outperforms Framework B, and vice versa.`
    },
    {
      title: "Interdisciplinary Cross-Pollination Review",
      tags: ["interdisciplinary", "innovation", "review"],
      body: `Investigate how concepts from {fieldOne} (e.g., evolutionary biology) can be synthesized to solve persistent problems in {fieldTwo} (e.g., distributed algorithms).\n- Identify parallel mechanisms and isomorphic structures.\n- Review recent cross-disciplinary publications.\n- Propose a novel hybrid model combining both domains.`
    },
    {
      title: "Methodological Divide Meta-Analysis",
      tags: ["meta-analysis", "methodology", "epistemology"],
      body: `Analyze the tension between quantitative and qualitative methodologies within research on: {topic}.\n- Critique the strengths and vulnerabilities of each approach in current published studies.\n- Recommend a mixed-methods convergent design that bridges the divide.`
    },
    {
      title: "Systematic Review Citation Graph Mapping",
      tags: ["citation-analysis", "bibliometrics", "research"],
      body: `Structure a bibliometric citation map for: {field}.\n- Identify high-citation cluster hubs, bridge papers connecting disparate sub-disciplines, and declining conceptual branches.\n- Provide a categorized reading list for researchers entering this domain.`
    }
  ],
  "Data Analysis": [
    {
      title: "Exploratory Data Analysis (EDA) Python Script with Visuals",
      tags: ["python", "pandas", "eda"],
      body: `Generate a production Python script using Pandas, Seaborn, and Polars to perform comprehensive EDA on: {datasetDescription}.\n- Automated missing value imputation and outlier detection (IQR & Z-score).\n- Correlation matrices with heatmaps.\n- Feature distribution skewness analysis with recommended transformations (Box-Cox/Log).\n- Summary report of actionable patterns and anomalies.`
    },
    {
      title: "Predictive Machine Learning Pipeline with Cross-Validation",
      tags: ["machine-learning", "scikit-learn", "xgboost"],
      body: `Construct an end-to-end classification pipeline for: {targetVariable}.\n- Feature engineering: one-hot encoding, target encoding, interaction terms.\n- Stratified K-fold cross-validation to prevent data leakage.\n- Hyperparameter tuning using Optuna.\n- Model interpretability using SHAP values and feature importance plots.`
    },
    {
      title: "Time-Series Forecasting with Seasonal Decomposition",
      tags: ["time-series", "forecasting", "prophet"],
      body: `Build a time-series forecasting model for daily metric: {metricName}.\n- Decompose series into trend, seasonality, and residual noise.\n- Check stationarity via Augmented Dickey-Fuller (ADF) test.\n- Implement and compare ARIMA/SARIMAX vs Prophet models.\n- Output prediction intervals and calculate backtested MAPE/RMSE scores.`
    },
    {
      title: "Customer Cohort Retention & Churn Analysis",
      tags: ["cohort-analysis", "retention", "sql"],
      body: `Write optimized SQL and Python scripts to calculate monthly customer retention cohorts for: {transactionData}.\n- Calculate Day 1, Day 7, Day 30, and Month 1-12 retention curves.\n- Segment cohorts by acquisition channel and initial purchase value.\n- Identify early behavioral indicators strongly correlated with long-term retention.`
    },
    {
      title: "A/B Test Statistical Significance & Bayesian Analysis",
      tags: ["ab-testing", "bayesian", "experimentation"],
      body: `Analyze the results of an A/B test with conversion metrics: {variantMetrics}.\n- Frequentist Z-test with two-tailed p-value and 95% confidence intervals.\n- Bayesian calculation: probability that Variant B beats Variant A, and expected loss.\n- Recommend whether to conclude the test, extend runtime, or abandon due to low power.`
    }
  ],
  "Marketing": [
    {
      title: "Go-To-Market (GTM) Launch Strategy & Channel Matrix",
      tags: ["gtm", "launch", "strategy"],
      body: `Develop a comprehensive 90-day Go-To-Market launch strategy for: {productName}.\n- Ideal Customer Profile (ICP) definition and pain-point matrix.\n- Channel prioritization (Paid acquisition, Organic SEO, Product-led growth, Outbound sales).\n- Week-by-week launch calendar covering pre-launch teaser, launch day blitz, and post-launch retention.\n- North Star KPI metrics and CAC/LTV targets.`
    },
    {
      title: "B2B Account-Based Marketing (ABM) Playbook",
      tags: ["abm", "b2b", "enterprise"],
      body: `Create a targeted ABM playbook for landing Tier-1 Enterprise accounts in: {industry}.\n- Tier 1 account identification criteria and bespoke value proposition framing.\n- Multi-touch outreach sequence across LinkedIn, email, executive direct mail, and tailored microsites.\n- Content asset requirements: bespoke ROI calculator and customer case studies.`
    },
    {
      title: "Viral Product Hunt Launch Sequence & Assets",
      tags: ["product-hunt", "launch", "growth"],
      body: `Craft an end-to-end Product Hunt launch package for: {product}.\n- Compelling headline, tagline (under 60 chars), and maker comment detailing the origin story.\n- Engaging GIF demo storyboard instructions.\n- Outreach schedule for day-of community support without triggering voting penalty algorithms.\n- First-hour response template addressing technical questions.`
    },
    {
      title: "High-Converting Webinar Funnel & Follow-Up Sequence",
      tags: ["webinars", "funnels", "lead-gen"],
      body: `Plan a high-converting B2B webinar funnel on: {topic}.\n- Irresistible webinar title and registration landing page copy.\n- 4-part email reminder sequence (7 days out, 24 hours, 1 hour, live now).\n- 45-minute presentation script outline keeping viewer retention above 70%.\n- Post-event segmentation emails for attendees vs no-shows.`
    },
    {
      title: "Referral & Viral Growth Loop Architecture",
      tags: ["viral-loops", "plg", "referral"],
      body: `Design a self-reinforcing product referral loop for: {appType}.\n- Two-sided incentive mechanics (Dropbox/Robinhood style).\n- In-app trigger moments when user satisfaction peaks (the 'Aha' moment).\n- Frictionless sharing mechanisms across WhatsApp, Twitter, and email.\n- Metrics tracking: K-factor calculation and cycle time optimization.`
    }
  ],
  "Copywriting": [
    {
      title: "Landing Page Hero Section & Value Proposition Copy",
      tags: ["landing-page", "hero", "conversion"],
      body: `Write 5 distinct high-converting variations of a landing page Hero Section for: {productOffer}.\nEach variation must include:\n1. Attention-grabbing headline (under 10 words) focused on the core transformational outcome.\n2. Subheadline addressing the primary objection and ideal audience.\n3. Primary call-to-action (CTA) button copy with low psychological friction.\n4. Trust badge / social proof placement recommendation.`
    },
    {
      title: "PAS (Problem-Agitate-Solve) Sales Letter",
      tags: ["pas", "direct-response", "sales-copy"],
      body: `Write a compelling sales narrative using the PAS framework for: {productOrService}.\n- Problem: State the visceral everyday frustration the customer experiences.\n- Agitate: Intensify the cost of inaction, wasted time, and emotional toll.\n- Solution: Introduce your product as the natural, proven relief.\n- Call to Action: Urge immediate action with an ironclad guarantee.`
    },
    {
      title: "Feature-to-Benefit Emotional Matrix Rewrite",
      tags: ["benefits", "psychology", "refactor"],
      body: `Transform this list of dry technical specifications into compelling customer-centric benefits: {technicalFeatures}.\nFor each feature provide:\n- The Technical Spec.\n- The Functional Benefit (What it does for their workflow).\n- The Emotional Benefit (How it makes them feel or elevates their status).`
    },
    {
      title: "High-Converting Microcopy & UI Empty State Copy",
      tags: ["microcopy", "ux-writing", "conversion"],
      body: `Write thoughtful UX microcopy for {userAction} in an application.\n- Button tooltips clarifying non-destructive actions.\n- Form field inline helper text and friendly validation errors.\n- Engaging empty state copy that guides users to take their first meaningful action.`
    },
    {
      title: "Irresistible B2B Case Study Narrative (STAR Framework)",
      tags: ["case-study", "social-proof", "storytelling"],
      body: `Write a customer success story using the STAR framework for client: {clientName}.\n- Situation: The chaotic landscape prior to adopting the solution.\n- Task: The ambitious milestone they needed to achieve within tight constraints.\n- Action: How they implemented the product and team adoption.\n- Result: Hard quantitative business metrics achieved (+340% ROI, 14 hours saved weekly).`
    }
  ],
  "SEO": [
    {
      title: "Programmatic SEO Architecture & Database Keyword Blueprint",
      tags: ["programmatic-seo", "p-seo", "scale"],
      body: `Design a programmatic SEO strategy for: {niche}.\n- Identify scalable keyword modifier patterns (e.g., '[Tool] vs [Tool]', 'Best [Category] for [Persona]').\n- Define database schema fields needed to generate high-value, non-thin dynamic pages.\n- Outline content modules that guarantee unique value on every programmatic URL.\n- Internal linking silo structure to distribute domain authority.`
    },
    {
      title: "Semantic Content Optimization & Entities Extraction",
      tags: ["on-page-seo", "semantic-seo", "nlp"],
      body: `Analyze the top-ranking competitors for target keyword: {targetKeyword}.\n- Extract essential Wikidata entities, LSI keywords, and subtopics required for topical authority.\n- Structure comprehensive H2 and H3 heading outlines covering search intent.\n- Draft an FAQ schema section targeting Google People Also Ask (PAA) rich snippets.`
    },
    {
      title: "Technical SEO Core Web Vitals Audit & Remediation",
      tags: ["technical-seo", "core-web-vitals", "speed"],
      body: `Provide a technical diagnostic and fix list for a site failing Core Web Vitals: {urlOrMetrics}.\n- LCP (Largest Contentful Paint): Prioritize critical path CSS, font preloading, and image optimization.\n- INP (Interaction to Next Paint): Break up long JavaScript tasks and defer non-critical scripts.\n- CLS (Cumulative Layout Shift): Reserve explicit aspect-ratio containers for dynamic ads and hero banners.`
    },
    {
      title: "Link-Worthy Data Study & Digital PR Pitch",
      tags: ["backlinks", "digital-pr", "outreach"],
      body: `Design a data-driven original research study in {industry} designed to earn editorial backlinks.\n- Outline the survey methodology or proprietary dataset to analyze.\n- Identify 3 counterintuitive, headline-grabbing statistical conclusions.\n- Draft an email pitch tailored to journalists at Forbes, TechCrunch, and industry publications.`
    },
    {
      title: "SEO Internal Linking & Topic Cluster Strategy",
      tags: ["internal-linking", "topic-clusters", "architecture"],
      body: `Construct a topical authority cluster for pillar topic: {pillarTopic}.\n- 1 Pillar page: Comprehensive, evergreen cornerstone guide.\n- 8 Sub-topic cluster articles addressing specific long-tail queries.\n- Bidirectional internal linking architecture ensuring search engine spiders discover all nodes.`
    }
  ],
  "Social Media": [
    {
      title: "Viral LinkedIn Thought Leadership Breakdown",
      tags: ["linkedin", "b2b", "personal-brand"],
      body: `Write a high-engagement LinkedIn post based on this professional insight: {insight}.\n- Hook (First 2 lines): Bold, counter-narrative statement that stops the scroll.\n- Body: Concise, bulleted breakdown with ample white space for mobile readability.\n- Personal takeaway or vulnerability that humanizes the lesson.\n- Open-ended question prompting meaningful comments and discussions.`
    },
    {
      title: "High-Retention Twitter/X Educational Thread",
      tags: ["twitter", "x", "threads"],
      body: `Craft an 8-tweet educational thread breaking down: {complexConcept}.\n- Tweet 1: High-conviction hook promising clear ROI for reading the thread.\n- Tweets 2-6: Step-by-step principles with concrete examples and zero fluff.\n- Tweet 7: Key takeaway summary graphic concept.\n- Tweet 8: Retweet prompt and call to action to follow for more.`
    },
    {
      title: "Short-Form Video Script (Reels / TikTok / Shorts)",
      tags: ["tiktok", "reels", "video-script"],
      body: `Write a 60-second video script for: {topic}.\n- Seconds 0-3 (Visual + Verbal Hook): Dramatic pattern interrupt statement.\n- Seconds 4-20: Establish problem and why traditional advice is broken.\n- Seconds 21-45: Fast-paced, 3-step actionable demonstration with on-screen text cues.\n- Seconds 46-60: Clear CTA to save the video and comment for a resource link.`
    },
    {
      title: "Social Media Community Management & Crisis Response",
      tags: ["crisis-management", "community", "pr"],
      body: `Draft a social media public response statement to address an active customer complaint: {complaint}.\n- Acknowledge the issue transparently without defensiveness.\n- Clarify immediate remediation steps underway.\n- Direct sensitive discussions to a private executive support channel.\n- Maintain an empathetic, composed brand voice.`
    },
    {
      title: "Monthly Multi-Platform Content Calendar Strategy",
      tags: ["content-calendar", "strategy", "planning"],
      body: `Develop a 30-day content calendar matrix for: {brandName}.\n- Balance across 4 content pillars: Industry Education, Customer Proof, Culture/Behind-the-Scenes, and Direct Product Value.\n- Adapt content formats across LinkedIn, X, Instagram, and YouTube.\n- Include specific posting time recommendations and engagement tracking metrics.`
    }
  ],
  "Email Marketing": [
    {
      title: "Automated 5-Day Onboarding Welcome Sequence",
      tags: ["welcome-sequence", "onboarding", "retention"],
      body: `Write a 5-email onboarding sequence for new users signing up for {productName}.\n- Email 1 (Day 0): Instant welcome, deliver value, guide them to complete their first action.\n- Email 2 (Day 1): Overcome the #1 onboarding hurdle with a 2-minute video tutorial.\n- Email 3 (Day 3): Customer case study showing what's possible with the tool.\n- Email 4 (Day 5): Introduce advanced power features.\n- Email 5 (Day 7): Feedback check-in or upgrade incentive.`
    },
    {
      title: "Cold Outbound Email Sequence with High Reply Rates",
      tags: ["cold-email", "b2b-sales", "outbound"],
      body: `Draft a 3-part cold email sequence targeting decision-makers in {targetRole} at {targetCompanyType}.\n- Email 1: 50-75 words, personalized trigger event, specific pain point observation, low-friction ask.\n- Email 2 (3 days later): Provide a relevant piece of data or asset without being pushy.\n- Email 3 (7 days later): Clean breakup email that frequently prompts delayed responses.`
    },
    {
      title: "Re-Engagement & Churn Win-Back Campaign",
      tags: ["win-back", "churn", "retention"],
      body: `Write a 3-email re-engagement campaign for users who have been inactive for 60+ days: {productName}.\n- Email 1: 'Is everything okay?' - Genuine check-in acknowledging that things get busy.\n- Email 2: Highlight top new features and performance speedups released since they left.\n- Email 3: Limited-time reactivation credit or complimentary strategy consultation.`
    },
    {
      title: "High-Converting Product Launch Announcement Email",
      tags: ["product-launch", "announcement", "conversion"],
      body: `Draft a major product update broadcast email announcing: {featureName}.\n- Intriguing subject line (under 40 characters) optimized for mobile preview text.\n- The 'Why we built this' founder story.\n- Bulleted GIF walk-through of the top 3 capabilities.\n- Prominent, single-minded CTA button driving users directly into the feature.`
    },
    {
      title: "Weekly Value-First Newsletter Template & Curated Digest",
      tags: ["newsletter", "curation", "editorial"],
      body: `Create a clean newsletter layout for weekly edition covering {topic}.\n- Editorial introduction: Founder's hot take on this week's news.\n- Top 3 Curated Resources with 2-sentence takeaways.\n- Practical Tip of the Week: Step-by-step tutorial.\n- Community Question of the Week with polling links.`
    }
  ],
  "Content Strategy": [
    {
      title: "B2B Content Hub & Pillar-Cluster Roadmap",
      tags: ["content-strategy", "architecture", "b2b"],
      body: `Develop a comprehensive 6-month content strategy for: {companyNiche}.\n- Map buyer journeys from Awareness (TOFU) to Consideration (MOFU) to Decision (BOFU).\n- Identify 3 foundational pillar topics and 15 supporting cluster articles.\n- Establish content reuse workflows (turn 1 webinar into 4 articles, 12 social posts, and 2 videos).\n- Define ROI tracking framework connecting content views to pipeline revenue.`
    },
    {
      title: "Thought Leadership Executive Ghostwriting Strategy",
      tags: ["ghostwriting", "executive", "branding"],
      body: `Design a ghostwriting cadence for our C-Suite executive on topic: {executiveTopic}.\n- Extract authentic personal anecdotes and proprietary industry viewpoints.\n- Structure long-form essays for Medium/Substack paired with LinkedIn commentary.\n- Maintain distinct voice principles: assertive, concise, data-backed, accessible.`
    },
    {
      title: "Competitor Content Gap & SERP Cannibalization Audit",
      tags: ["gap-analysis", "audit", "serp"],
      body: `Conduct a content gap analysis between our domain and key competitors: {competitorUrls}.\n- Identify high-volume, low-difficulty topics our competitors rank for that we lack.\n- Detect internal content cannibalization where two of our articles compete for the same intent.\n- Recommend consolidation, 301 redirects, or net-new content creation.`
    },
    {
      title: "Omnichannel Content Repurposing Matrix",
      tags: ["repurposing", "workflows", "distribution"],
      body: `Create an SOP (Standard Operating Procedure) for repurposing a single 30-minute podcast into 10 multi-format assets:\n- 1 In-depth technical blog post.\n- 1 Email newsletter edition.\n- 3 Vertical video reels (TikTok, YouTube Shorts, IG).\n- 2 LinkedIn breakdown carousels.\n- 3 Actionable Twitter/X threads.`
    },
    {
      title: "Editorial Style Guide & Brand Voice Governance",
      tags: ["style-guide", "governance", "branding"],
      body: `Draft a standardized Editorial Style Guide for our marketing and technical writers.\n- Voice pillars (e.g., Confident but humble, Technical but clear).\n- Rules on jargon, acronyms, capitalization, and Oxford commas.\n- Guidelines for AI-assisted writing, fact-checking requirements, and plagiarism checks.`
    }
  ],
  "Creative Writing": [
    {
      title: "Compelling Character Arc & Psychological Profile",
      tags: ["fiction", "character-design", "psychology"],
      body: `Build a multi-dimensional protagonist profile for a story set in: {setting}.\n- Core desire (What they consciously want) vs Unconscious need (What they actually need to grow).\n- The Fatal Flaw / The Lie they believe about themselves.\n- Formative childhood wound (The Ghost/Backstory).\n- Dialogue cadence, physical mannerisms, and internal moral boundaries.`
    },
    {
      title: "High-Tension Climactic Scene Scripting",
      tags: ["pacing", "dialogue", "tension"],
      body: `Write a high-stakes confrontation scene between two characters who love each other but are on opposing sides of a conflict: {conflict}.\n- Subtext in dialogue: characters say one thing while meaning another.\n- Physical blocking and micro-actions that mirror emotional shifts.\n- Pacing that accelerates steadily toward an irreversible choice.`
    },
    {
      title: "Immersive Worldbuilding & Magic System Rules",
      tags: ["worldbuilding", "fantasy", "sci-fi"],
      body: `Design an internally consistent magic or advanced technology system for: {worldConcept}.\n- The Source of power and biological/societal costs of utilizing it.\n- Hard limitations: What is strictly impossible, and what happens when pushed beyond safe limits?\n- How this system influences economic commerce, warfare, religion, and social hierarchies.`
    },
    {
      title: "Atmospheric Sensory Setting Description",
      tags: ["sensory", "prose", "atmosphere"],
      body: `Write a richly detailed opening passage establishing the setting: {location}.\n- Engage all five senses (sight, smell, sound, touch, taste) rather than visual description alone.\n- Establish mood and thematic foreboding through carefully chosen figurative language.\n- Ensure description reveals character psychology through how they perceive their environment.`
    },
    {
      title: "Plot Twist & Foreshadowing Architecture",
      tags: ["plotting", "mystery", "twists"],
      body: `Architect a narrative plot twist for a mystery/thriller about: {premise}.\n- The Revealed Truth: What actually happened?\n- The False Assumption: What did the audience and protagonist believe occurred?\n- Foreshadowing breadcrumbs: 3 subtle, fair-play clues planted earlier that only make sense in retrospect.`
    }
  ],
  "Editing": [
    {
      title: "Developmental Fiction Manuscript Structural Critique",
      tags: ["developmental-editing", "pacing", "structure"],
      body: `Perform a developmental edit on the provided manuscript chapter: {chapterText}.\n- Evaluate pacing: where does the story drag or rush past emotional moments?\n- Assess character consistency, agency, and motivation.\n- Check narrative point of view (POV) consistency and eliminate head-hopping.\n- Provide concrete suggestions to heighten narrative stakes.`
    },
    {
      title: "Line Editing for Cadence, Rhythm, and Voice",
      tags: ["line-editing", "style", "cadence"],
      body: `Line edit this prose passage for musicality and flow: {textPassage}.\n- Vary sentence lengths to create dynamic reading rhythm.\n- Eliminate passive voice, weak adverbs, and repetitive filter words ('he saw', 'she felt').\n- Enhance active verbs and sensory precision while preserving the author's unique voice.`
    },
    {
      title: "Ruthless Tightening & Word Count Reduction (25% Cut)",
      tags: ["copy-editing", "conciseness", "clarity"],
      body: `Edit this 1,000-word draft down to under 750 words without losing any core insights or arguments: {draftText}.\n- Cut redundancies, throat-clearing opening phrases, and filler words.\n- Convert wordy prepositional phrases into crisp, punchy sentences.\n- Show side-by-side diff with word count tracking.`
    },
    {
      title: "Technical Accuracy & Fact-Checking Verification Protocol",
      tags: ["fact-checking", "accuracy", "verification"],
      body: `Audit the following technical article draft for factual correctness: {articleText}.\n- Verify citations, scientific claims, statistical calculations, and software release timelines.\n- Flag vague assertions that require primary source links.\n- Note potential copyright or trademark attribution requirements.`
    },
    {
      title: "Tone Shift & Audience Repositioning Rewrite",
      tags: ["tone", "repositioning", "audience"],
      body: `Rewrite this casual internal engineering memo: {memoText} into a polished, professional board-level update for non-technical investors.\n- Strip internal acronyms and explain architectural choices in business terms (revenue risk, customer retention).\n- Maintain an authoritative, measured executive tone.`
    }
  ],
  "Business Strategy": [
    {
      title: "Blue Ocean Strategy & Value Innovation Canvas",
      tags: ["blue-ocean", "strategy", "innovation"],
      body: `Apply Blue Ocean Strategy to reimagine our business in the {industry} market.\n- Four Actions Framework (ERRC Grid):\n  1. Eliminate: Which factors that the industry takes for granted should be eliminated?\n  2. Reduce: Which factors should be reduced well below industry standards?\n  3. Raise: Which factors should be raised well above industry standards?\n  4. Create: Which factors should be created that the industry has never offered?`
    },
    {
      title: "Unit Economics, CAC Payback & LTV Optimization",
      tags: ["unit-economics", "saas-metrics", "finance"],
      body: `Analyze the unit economics for our SaaS model: {metricsData}.\n- Calculate Customer Acquisition Cost (CAC), Lifetime Value (LTV), and CAC Payback Period.\n- Identify sensitivity levers (churn reduction, pricing expansion, self-serve onboarding).\n- Recommend concrete pricing and packaging adjustments to achieve a 4:1 LTV-to-CAC ratio.`
    },
    {
      title: "Comprehensive Risk Assessment & Threat Modeling Matrix",
      tags: ["risk-management", "governance", "strategy"],
      body: `Conduct an enterprise risk assessment for: {businessInitiative}.\n- Assess risks across Operational, Financial, Regulatory, and Cyber vectors.\n- Score each risk on a 5x5 Likelihood vs Impact severity matrix.\n- Formulate specific mitigation controls and contingency fallbacks for all high-risk items.`
    },
    {
      title: "M&A Target Evaluation & Synergies Scorecard",
      tags: ["ma", "corporate-development", "valuation"],
      body: `Create an acquisition screening scorecard for potential targets in {sector}.\n- Strategic fit criteria: Product portfolio expansion, technical talent, customer base overlap.\n- Financial metrics: ARR growth, net revenue retention (NRR), gross margins.\n- Integration risk factors: Cultural friction, tech stack debt, customer retention vulnerability.`
    },
    {
      title: "Organizational OKR (Objectives & Key Results) Cascade",
      tags: ["okrs", "operations", "leadership"],
      body: `Design an aligned OKR cascade for Q3 across Company, Product, and Engineering for objective: {topObjective}.\n- 3 inspiring, qualitative Objectives.\n- 3-4 strictly measurable, ambitious Key Results per objective (using 'measured from X to Y' format).\n- Weekly tracking cadence and red/yellow/green grading rubric.`
    }
  ],
  "Sales": [
    {
      title: "Enterprise Discovery Call Question Script (MEDDPICC)",
      tags: ["discovery", "meddpicc", "enterprise-sales"],
      body: `Generate a discovery call question framework using MEDDPICC for prospect in {industry}.\n- Metrics: Uncover quantifiable financial outcomes the prospect must deliver.\n- Economic Buyer: Identify the true budget holder.\n- Decision Criteria & Decision Process: Map formal evaluation steps.\n- Paper Process: Unpack procurement, legal, and security review cycles.\n- Implicate Pain: Highlight cost of inaction.`
    },
    {
      title: "Objection Handling Script Matrix (Pricing, Competitors, Timing)",
      tags: ["objection-handling", "scripts", "closing"],
      body: `Write battle-tested objection responses for our sales team facing objections regarding {productName}:\n1. 'Your price is too high compared to Competitor X.'\n2. 'We don't have the internal engineering bandwidth to integrate this right now.'\n3. 'We already built an in-house tool that works well enough.'\n4. 'Check back with us in Q4 when budgets renew.'`
    },
    {
      title: "Executive Mutual Action Plan (MAP) for Enterprise Deals",
      tags: ["map", "enterprise-sales", "closing"],
      body: `Draft a collaborative Mutual Action Plan (MAP) to present to the VP of Engineering to close a contract by {targetCloseDate}.\n- Milestone-by-milestone schedule: Technical validation, security questionnaire, legal redlines, procurement approval, onboarding kickoff.\n- Assigned owners on both Buyer and Vendor teams.\n- Highlight shared dependencies and business risk if the go-live date slips.`
    },
    {
      title: "Post-Demo Champion Enablement Toolkit",
      tags: ["sales-enablement", "internal-champion", "b2b"],
      body: `Equip our internal champion to pitch our solution: {solutionName} to their CFO.\n- 1-page executive summary highlighting hard financial ROI and payback timeline.\n- Internal slide deck answering common security, compliance, and migration questions.\n- Script for how the champion should respond when the CFO asks 'Why now?'`
    },
    {
      title: "Contract Renewal & Upsell Expansion Script",
      tags: ["account-management", "upsell", "expansion"],
      body: `Write an annual contract renewal and tier expansion proposal for customer: {customerName}.\n- Celebrate their team's usage achievements and quantitative value derived over the past 12 months.\n- Introduce higher-tier capabilities (SSO, audit logs, dedicated support) aligned with their growth.\n- Provide multi-year discount incentives to secure long-term commitment.`
    }
  ],
  "Customer Support": [
    {
      title: "De-escalation Macro for Outages & Service Disruptions",
      tags: ["de-escalation", "support", "incident-response"],
      body: `Write an empathetic, highly professional customer support macro to handle furious enterprise customers during an active unexpected service outage: {outageDetails}.\n- Validate customer frustration without accepting legal liability.\n- Clearly outline status page links and our engineers' immediate actions.\n- Promise scheduled updates every 30 minutes until resolution.\n- Offer proactive post-incident credits.`
    },
    {
      title: "Clear Step-by-Step Technical Troubleshooting Guide",
      tags: ["troubleshooting", "kb", "tier-2"],
      body: `Write a customer-facing help center article guiding non-technical users to resolve error: {errorName}.\n- Symptoms: How to know if you are experiencing this issue.\n- Quick Fix (2 minutes): Browser cache, cookie reset, or permission check.\n- Advanced Resolution: Step-by-step screenshots instructions.\n- When to contact support: Exact diagnostic logs to attach.`
    },
    {
      title: "Polite Feature Request Decline with Alternative Workarounds",
      tags: ["feature-requests", "customer-success", "support"],
      body: `Draft a thoughtful support response to a long-time paying customer requesting a feature: {requestedFeature} that is not on our product roadmap.\n- Express genuine gratitude for their detailed product feedback.\n- Explain the architectural or strategic reasoning honestly without defensive jargon.\n- Provide an ingenious workaround using our existing API or integration hooks.\n- Ensure the customer feels respected and valued.`
    },
    {
      title: "VIP Onboarding & White-Glove Welcome Playbook",
      tags: ["vip", "white-glove", "customer-success"],
      body: `Draft a dedicated communication cadence for a new $50K+ ARR enterprise account.\n- Day 1: Welcome letter from VP of Customer Experience and dedicated CSM introduction.\n- Day 7: Milestone review checking user seat activations and integration status.\n- Day 30: Quarterly business review (QBR) scheduling and feedback collection.`
    },
    {
      title: "Automated Ticket Tagging & Sentiment Classification Rules",
      tags: ["automation", "nlp", "tagging"],
      body: `Define comprehensive regex and prompt classification rules to automatically tag incoming support tickets by:\n- Urgency: P1 (System Down), P2 (Major Bug), P3 (Minor Glitch), P4 (Inquiry).\n- Category: Billing, Authentication, Integration, Feature Request, Legal/Security.\n- Churn Risk: Detect frustrated sentiment and phrases like 'canceling my account'.`
    }
  ],
  "Product Management": [
    {
      title: "Comprehensive PRD (Product Requirement Document)",
      tags: ["prd", "product-management", "specs"],
      body: `Author an exhaustive Product Requirements Document (PRD) for feature: {featureName}.\n- Executive Summary & Problem Statement: Why are we building this now?\n- Target Personas & Primary Use Cases.\n- In-Scope vs Out-of-Scope boundaries.\n- Detailed Functional Requirements and Edge Cases.\n- Non-functional requirements (Latency < 100ms, 99.99% Availability).\n- Success Metrics & Launch Milestones.`
    },
    {
      title: "RICE Framework Scoring & Backlog Prioritization",
      tags: ["rice", "prioritization", "backlog"],
      body: `Evaluate and rank these 5 prospective product initiatives using the RICE framework: {initiativesList}.\nFor each initiative provide:\n- Reach: Estimated users impacted per quarter.\n- Impact: Minimal (0.5), Medium (1), High (2), Massive (3).\n- Confidence: Low (50%), Medium (80%), High (100%).\n- Effort: Person-months required.\n- Calculated RICE Score = (R * I * C) / E with prioritized recommendation.`
    },
    {
      title: "User Story Mapping & Sprint Epic Breakdown",
      tags: ["user-stories", "agile", "scrum"],
      body: `Break down the high-level initiative: {epicName} into detailed Agile User Stories.\nFor each story provide:\n- Standard format: As a [persona], I want [action], so that [business value].\n- Acceptance Criteria written in Given-When-Then (Gherkin) syntax.\n- Technical implementation notes and potential QA risks.`
    },
    {
      title: "Product Analytics Tracking Plan & Funnel Taxonomy",
      tags: ["analytics", "tracking", "mixpanel"],
      body: `Design a behavioral tracking schema for our checkout flow: {checkoutFlow}.\n- Define explicit event names in Object-Action format (e.g., 'checkout_plan_selected').\n- Specify required property keys (plan_tier, billing_cycle, coupon_applied, user_id).\n- Map drop-off funnel conversion rates to monitor in Amplitude/Mixpanel.`
    },
    {
      title: "Feature Sunsetting & Deprecation Plan",
      tags: ["sunsetting", "deprecation", "lifecycle"],
      body: `Draft a feature sunsetting roadmap for legacy capability: {legacyFeature}.\n- Identify active usage cohorts and migration alternatives.\n- 90-day communication schedule (in-app banners, email warnings, API deprecation headers).\n- Engineering plan for database cleanup, code removal, and redirect routing.`
    }
  ],
  "Project Management": [
    {
      title: "Critical Path Method (CPM) Schedule & Dependency Map",
      tags: ["cpm", "scheduling", "dependencies"],
      body: `Analyze the following software release tasks and dependencies: {taskList}.\n- Identify early start, early finish, late start, and late finish dates.\n- Map the Critical Path of tasks where any delay directly postpones the release date.\n- Calculate float/slack time for non-critical activities.\n- Recommend fast-tracking or crashing strategies to compress delivery time by 2 weeks.`
    },
    {
      title: "Weekly Stakeholder Status Report (RAG Status)",
      tags: ["status-report", "stakeholders", "rag"],
      body: `Draft an executive project status report for initiative: {projectName}.\n- Overall Project Health: Red / Amber / Green (RAG) with 2-sentence rationale.\n- Key Milestones Achieved This Week.\n- Planned Deliverables for Next Week.\n- Top 3 Risks, Blockers, and Required Decisions from Leadership.`
    },
    {
      title: "Sprint Retrospective Facilitation Guide & Action Items",
      tags: ["retrospective", "agile", "continuous-improvement"],
      body: `Design an engaging, blameless 60-minute Sprint Retrospective for an engineering team recovering from a difficult release.\n- Warm-up icebreaker to foster psychological safety.\n- Structured reflection exercise: What went well? What went wrong? What confused us?\n- Voting process to select the top 2 systemic issues.\n- SMART action items with single owners to implement in the next sprint.`
    },
    {
      title: "Vendor RFP (Request for Proposal) Evaluation Matrix",
      tags: ["rfp", "procurement", "vendor-management"],
      body: `Create a weighted evaluation scorecard to assess 3 competitive enterprise software vendors for: {projectRequirement}.\n- Category weights: Security & Compliance (25%), Technical Fit (30%), Pricing & TCO (25%), Support SLA (20%).\n- Specific grading questions for vendor demos and architecture reviews.\n- Final recommendation summary formula.`
    },
    {
      title: "Comprehensive Change Management & Training Plan",
      tags: ["change-management", "training", "adoption"],
      body: `Design a change management plan for rolling out a new enterprise tool to 1,000+ employees: {toolName}.\n- Stakeholder impact assessment by department.\n- Communication cascade: Leadership vision, manager briefings, end-user FAQs.\n- Phased training schedule: Live interactive webinars, self-paced video guides, and office hours.`
    }
  ],
  "Productivity": [
    {
      title: "Eisenhower Matrix Daily Task Triage System",
      tags: ["time-management", "eisenhower", "focus"],
      body: `Take my disorganized list of 20 tasks: {taskList} and categorize them using the Eisenhower Matrix:\n1. Urgent & Important (Do First: High stakes deadlines today).\n2. Important, Not Urgent (Schedule: High-leverage strategic growth).\n3. Urgent, Not Important (Delegate / Automate: Interruptions and admin work).\n4. Neither Urgent nor Important (Eliminate: Distractions to delete).\nProvide a recommended sequence for my workday.`
    },
    {
      title: "Weekly Review & Digital Declutter Protocol",
      tags: ["weekly-review", "gtd", "habits"],
      body: `Guide me through a comprehensive 45-minute Getting Things Done (GTD) Weekly Review.\n- Inbox Zero clearing across Email, Slack, Downloads folder, and Desktop notes.\n- Review open projects against active milestones.\n- Calibrate upcoming 14-day calendar commitments and decline low-value meetings.\n- Identify top 3 Needle-Moving Priorities for the upcoming week.`
    },
    {
      title: "Ultradian Rhythm Deep Work Block Optimizer",
      tags: ["deep-work", "energy-management", "focus"],
      body: `Structure my daily schedule around 90-minute ultradian focus rhythms based on my peak mental energy hours: {energyHours}.\n- Match high-cognitive load tasks (writing, architecture, debugging) to peak dopamine periods.\n- Schedule restorative low-cognitive tasks (admin, email, meetings) during energy dips.\n- Include protocols for pre-focus transition routines and deliberate decompression walks.`
    },
    {
      title: "Automated Personal Dashboard & Habit Tracker Setup",
      tags: ["notion", "habits", "tracking"],
      body: `Design a minimal, friction-free personal productivity dashboard in Notion or Obsidian.\n- Daily non-negotiable habit tracking (Exercise, Deep Work, Reading, Sleep).\n- Active Project tracker linked to current week sprint goals.\n- Quick-capture scratchpad that syncs seamlessly from mobile to desktop.`
    },
    {
      title: "Meeting Audit & Calendar De-bloat Strategy",
      tags: ["calendar", "meetings", "efficiency"],
      body: `Audit my recurring weekly meeting schedule: {calendarList}.\n- Identify meetings that can be transitioned entirely to asynchronous Loom videos or Slack updates.\n- Consolidate fragmented 30-minute meetings into single batch blocks to preserve 3+ hour focus stretches.\n- Draft polite email templates to step down from non-essential recurring committees.`
    }
  ],
  "Brainstorming": [
    {
      title: "SCAMPER Creative Ideation Framework",
      tags: ["scamper", "innovation", "creativity"],
      body: `Apply the SCAMPER framework to generate 15 breakthrough product variations for: {productOrService}.\n- Substitute: What materials, components, or audiences can we swap?\n- Combine: What complementary services can we package together?\n- Adapt: What ideas from completely unrelated industries can we borrow?\n- Modify/Magnify: What feature can we exaggerate to an extreme?\n- Put to another use: How can this serve a non-obvious demographic?\n- Eliminate: What complex feature can we remove to simplify drastically?\n- Reverse: What if we flipped the business model upside down?`
    },
    {
      title: "Crazy Eights Fast-Paced Design Sprint Exercise",
      tags: ["design-sprint", "crazy-eights", "ux"],
      body: `Facilitate a 'Crazy Eights' ideation exercise to solve the user problem: {userFriction}.\n- Generate 8 distinct, wildly divergent concepts in 8 minutes.\n- Concept 1: The conservative industry standard.\n- Concept 2: The voice-first / ambient AI approach.\n- Concept 3: The ultra-minimalist single-button solution.\n- Concept 4: The community-powered crowdsourced approach.\n- Concepts 5-8: Experimental boundary-pushing ideas.`
    },
    {
      title: "First Principles Deconstruction & Reassembly",
      tags: ["first-principles", "physics", "strategy"],
      body: `Deconstruct the industry problem: {industryProblem} to fundamental physics and mathematical truths.\n- Strip away historical assumptions, industry dogma, and 'the way it has always been done'.\n- What are the irreducible, non-negotiable raw costs and requirements?\n- Build an alternative, highly efficient solution from ground zero based solely on those foundational truths.`
    },
    {
      title: "Worst Possible Idea Reverse-Engineering",
      tags: ["lateral-thinking", "reverse-ideation", "humor"],
      body: `We are brainstorming solutions for: {goal}.\n1. Generate 5 intentionally terrible, catastrophic ideas that would make the problem exponentially worse.\n2. For each terrible idea, analyze the underlying assumption that makes it dreadful.\n3. Reverse that dreadful property to uncover an unexpected, highly creative breakthrough solution.`
    },
    {
      title: "Cross-Industry Analogy Transposition Matrix",
      tags: ["analogies", "cross-pollination", "ideation"],
      body: `Brainstorm novel business models for {myBusiness} by transposing proven mechanics from other successful industries:\n- What would this look like as 'The Netflix of {myBusiness}' (Subscription / Unlimited)?\n- What would this look like as 'The Airbnb of {myBusiness}' (Peer-to-peer marketplace)?\n- What would this look like as 'The Costco of {myBusiness}' (Negative margin membership club)?\n- What would this look like as 'The Duolingo of {myBusiness}' (Gamified bite-sized education)?`
    }
  ],
  "Personal Growth": [
    {
      title: "Annual Life Audit & Ikigai Purpose Calibration",
      tags: ["ikigai", "life-audit", "purpose"],
      body: `Guide me through an intensive annual life audit across Career, Health, Relationships, and Wealth.\n- Audit where my actual weekly time goes vs my stated core values.\n- Map my current activities against the Ikigai framework (What I love, What I'm good at, What the world needs, What I can get paid for).\n- Identify energy-draining obligations to eliminate over the next 90 days.`
    },
    {
      title: "Stoic Fear Setting & Worst-Case Scenario Preparation",
      tags: ["stoicism", "fear-setting", "resilience"],
      body: `I am hesitating on taking a major career/business leap: {decision}.\nLead me through Tim Ferriss's Stoic 'Fear Setting' exercise:\n1. Define: What is the absolute worst that could happen if I take this action and fail completely?\n2. Prevent: What specific actions can I take right now to decrease the likelihood of that worst-case outcome?\n3. Repair: If the worst-case happens, how could I recover or get back to baseline?\n4. Cost of Inaction: What will my life look like in 1, 3, and 5 years if I do not act?`
    },
    {
      title: "Cognitive Distortion Audit & Reframing Journal",
      tags: ["cbt", "mindset", "psychology"],
      body: `Help me examine this recurring negative self-talk thought: '{limitingBelief}'.\n1. Identify cognitive distortions present (All-or-Nothing thinking, Catastrophizing, Mind Reading, Emotional Reasoning).\n2. Examine the evidence: What objective empirical facts support this thought? What objective facts contradict it?\n3. Synthesize an objective, compassionate, and grounded reframed perspective.`
    },
    {
      title: "Socratic Career Crossroad Decision Tree",
      tags: ["career", "socratic", "decisions"],
      body: `I am deciding between two career paths: Path A: {pathA} vs Path B: {pathB}.\n- Ask me 5 probing Socratic questions that force me to confront my underlying motivations (prestige vs autonomy, security vs upside).\n- Evaluate both paths across 5-year compounding potential and downside risk asymmetry.\n- Help me identify which path aligns with my authentic self rather than external expectations.`
    },
    {
      title: "Deliberate Practice & Skill Mastery Curriculum",
      tags: ["mastery", "learning", "skill-acquisition"],
      body: `Design a 6-month deliberate practice curriculum to achieve top 10% proficiency in: {skillName}.\n- Deconstruct the skill into its foundational sub-competencies.\n- Design targeted practice drills with immediate feedback mechanisms.\n- Create a progressive overload schedule that consistently challenges my cognitive threshold.\n- Recommend top books, mentors, and projects to validate real-world competency.`
    }
  ]
};

export function generateDistinctPrompts(): PromptEntry[] {
  const allPrompts: PromptEntry[] = [];
  const authors = ["deepmind", "karpathy_fan", "gpt_master", "claude_whisperer", "prompt_crafter", "research_lead", "system_architect", "growth_engineer"];

  PROMPT_CATEGORIES.forEach((cat) => {
    const templates = PROMPT_TEMPLATES[cat] || [];
    
    // Generate 12 distinct prompts per category
    for (let i = 0; i < 12; i++) {
      let title = "";
      let tags: string[] = [];
      let body = "";

      if (templates[i % templates.length]) {
        const t = templates[i % templates.length];
        const iterationSuffix = i >= templates.length ? ` - Level ${Math.floor(i / templates.length) + 1}` : "";
        title = `${t.title}${iterationSuffix}`;
        tags = t.tags;
        body = t.body;
      } else {
        title = `Advanced ${cat} Framework Protocol ${i + 1}`;
        tags = [cat.toLowerCase().replace(/\s+/g, '-'), "strategy", "workflow"];
        body = `You are a world-class authority in ${cat}.\nYour task is to analyze the following problem with rigor and provide an actionable, step-by-step resolution.\nContext: {context}\nDeliverables:\n1. Root diagnosis and fundamental breakdown.\n2. Best-practice implementation framework.\n3. Common pitfalls to avoid.`;
      }

      const author = authors[(cat.length + i) % authors.length];
      const likes = 350 + ((i * 127 + cat.length * 89) % 2500);
      const uses = likes * 4 + ((i * 349) % 3000);

      allPrompts.push({
        title,
        cat,
        tags,
        body,
        likes,
        uses,
        author,
      });
    }
  });

  return allPrompts;
}

const prompts = generateDistinctPrompts();
const outputPath = path.resolve(process.cwd(), 'src/lib/data/prompts.ts');

const fileContent = `export type PromptCategory = ${PROMPT_CATEGORIES.map(c => `"${c}"`).join(" | ")};

export interface PromptEntry {
  title: string;
  cat: PromptCategory;
  tags: string[];
  body: string;
  likes: number;
  uses: number;
  author: string;
}

export const PROMPT_CATEGORIES: PromptCategory[] = ${JSON.stringify(PROMPT_CATEGORIES, null, 2)};

export const PROMPTS: PromptEntry[] = ${JSON.stringify(prompts, null, 2)};
`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`Generated ${prompts.length} distinct prompts across ${PROMPT_CATEGORIES.length} categories.`);
