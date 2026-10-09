# i am repath

repath.life, told as a waterford story: the takeaway counter by day, and critique, dáildex, leemerchat, leemerlabs and warren by night.

## Run

```bash
npm install
npm run dev
```

## Story art

Stills are generated with FLUX.3 and clips with Seedance 2.0 Mini, both through OpenRouter. Put `OPENROUTER_API_KEY` in `.env` (never commit it), then:

```bash
npm run story:generate -- --dry
npm run story:generate -- --kind=image
npm run story:optimize
```

The shot list, prompts and reference chain live in `scripts/story/manifest.ts`. The full redesign is written up in `docs/REDESIGN_PLAN.md`.

## Build

```bash
npm run build
```
