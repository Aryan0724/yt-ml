# PreYT Product Philosophy & Directives

## The Core Product Question
**PreYT's homepage should answer one question: "What should I pay attention to today?"**

Every element must help the creator discover an opportunity, understand why it matters, or take the next action. PreYT is a **Creator Intelligence Platform**, not just an AI thumbnail analyzer.

## The Creator Loop
Every feature must contribute to this core loop:
**Discover → Opportunity → Idea → Package → Publish → Learn**

1. **Discover**: What's hot? What's rising?
2. **Opportunity**: Is there room to win here?
3. **Idea**: What should I actually make?
4. **Package**: Title + Thumbnail validation.
5. **Publish**: Pushing to YouTube.
6. **Learn**: What actually worked?

## Hard Rules
1. **The information itself is the interface.** No giant analytics dashboards, no 12 KPI cards, no fake "market intelligence" wallpaper.
2. **Real data only.** No fabricated metrics. No decorative analytics. Every number must have a traceable source. Every recommendation must have evidence.
3. **No Supabase.** The architecture is self-hosted: Next.js → FastAPI → PostgreSQL + Redis.
4. **No mock data in production.** If a data provider (like DataForSEO) is unavailable, show an honest empty state prompting configuration. Never manufacture today's trends.
