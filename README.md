# 🐍 NEON SNAKE 4K

> **A futuristic neon arcade Snake experience built for modern web
> browsers.**

![NEON SNAKE
4K](https://img.shields.io/badge/NEON%20SNAKE-4K-00F5FF?style=for-the-badge&labelColor=05070D)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Canvas](https://img.shields.io/badge/HTML5-Canvas-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

------------------------------------------------------------------------

##🔗 Live Demo: https://lnkd.in/gGrcb-cz

------------------------------------------------------------------------

## ⚡ Overview

**NEON SNAKE 4K** is a browser-based Snake game redesigned as a
futuristic neon arcade experience.

The project combines classic Snake mechanics with:

-   🎮 10 progressive levels
-   ⚡ Gradual difficulty and speed progression
-   🧱 Static and dynamic obstacles
-   🍎 Multiple food types
-   🔥 Combo scoring up to **x10**
-   🪙 Coin-based rewards in **Snake Challenge**
-   🤖 One-time **Auto Play** activation for **500 coins**
-   🌌 Futuristic neon/cyberpunk visual style
-   🔊 Procedural Web Audio gameplay feedback
-   💾 Local browser persistence
-   🖥️ Desktop keyboard controls
-   📱 Mobile touch controls and swipe support
-   📐 Responsive gameplay board
-   🚀 Production deployment through GitHub + Vercel

The project is intentionally designed as a **client-side web
application** without unnecessary backend infrastructure.

------------------------------------------------------------------------

## 🎯 Project Goals

The main goals of NEON SNAKE 4K are:

1.  Create a polished and responsive Snake game.
2.  Keep the core gameplay simple and immediately understandable.
3.  Add meaningful progression through 10 levels.
4.  Introduce different food values and combo scoring.
5.  Provide two distinct gameplay modes.
6.  Support both desktop and mobile players.
7.  Keep the MVP lightweight and practical.
8.  Maintain a futuristic visual identity without sacrificing usability.

------------------------------------------------------------------------

# 🎮 Game Modes
## 🐍 Snake Challenge

The primary progression-oriented mode.

Features:

-   Progressive 10-level gameplay
-   Increasing difficulty
-   Obstacles
-   Normal, Golden and Bonus food
-   Combo system up to x10
-   Coin collection
-   Auto Play availability through the coin system
-   Level completion rewards

### 🪙 Coin Rule

Coins are available **only in Snake Challenge**.

Coins are **not displayed, earned, or used** in Neon Velocity.

------------------------------------------------------------------------

## ⚡ Neon Velocity

A speed-focused mode containing:

-   Speed customization
-   Auto Play
-   Progressive gameplay
-   Obstacles and collision mechanics
-   Score/combo gameplay

### Important Mode Rule

**Auto Play and Custom Speed are not separate main modes.**

They are features inside **Neon Velocity**.

Neon Velocity does **not** use the coin system.

------------------------------------------------------------------------

# 🪙 Coin & Auto Play System

## Coin System

Coins persist through browser `localStorage`.

The coin system is restricted to **Snake Challenge**.

The existing reward system supports gameplay rewards such as:

  Event                                    Reward
  ------------------ ----------------------------
  Normal Food                           +10 score
  Golden Food                           +50 score
  Bonus Food                           +100 score
  Combo                      Up to x10 multiplier
  Level completion     Existing configured reward
  Victory              Existing configured reward

> The exact coin reward values for individual events are
> implementation-dependent and should not be duplicated or awarded
> twice.

------------------------------------------------------------------------

## 🤖 Auto Play

Auto Play is a **one-time activation**, not a permanent unlock.

### Cost

**500 coins = 1 Auto Play activation**

Rules:

-   Player must have at least 500 coins.
-   Exactly 500 coins are deducted when activation succeeds.
-   A single activation can be used once.
-   Auto Play does not permanently unlock.
-   After Auto Play ends/stops, another activation requires another 500
    coins.
-   Double clicks, duplicate event handlers and rerenders must never
    charge the player twice.

### Auto Play Behavior

Auto Play should:

-   Target available food intelligently.
-   Avoid walls.
-   Avoid obstacles.
-   Avoid the snake's own body.
-   Continue working across levels.
-   Respect the selected speed.
-   Use local JavaScript/TypeScript game logic.
-   Avoid random movement as its primary strategy.
-   Avoid external AI services.

------------------------------------------------------------------------

# 🍎 Food System

NEON SNAKE 4K supports multiple food types:

### Normal Food

**+10 score**

### Golden Food

**+50 score**

### Bonus Food

**+100 score**

------------------------------------------------------------------------

## 🛡️ Safe Food Spawning

Food must **never** spawn:

-   Inside an obstacle
-   On top of an obstacle
-   Overlapping an obstacle
-   Touching an obstacle

Validation should consider the **complete food hitbox**, not only its
center point.

A small safety margin should be used around obstacles.

The system should work with:

-   Static obstacles
-   Moving obstacles
-   Rotating obstacles
-   Laser/dynamic obstacles
-   Procedural obstacles

If a moving obstacle makes an existing food position unsafe, the food
should be repositioned.

A shared validation concept such as:

`isValidFoodPosition(position)`

should be used where practical.

Food placement should use:

1.  Bounded placement attempts
2.  Collision validation
3.  Safe deterministic fallback

The game must not freeze because a valid food position was difficult to
find.

------------------------------------------------------------------------

# 🔥 Combo System

The game includes a combo mechanic that can increase up to:

**x10**

Combos provide additional gameplay depth and reward consistent food
collection.

Combo feedback should be visually clear without requiring audio.

------------------------------------------------------------------------

# 🧱 Levels & Obstacles

NEON SNAKE 4K contains:

## 10 Progressive Levels

Each level increases the challenge through combinations of:

-   Gradual speed progression
-   More complex obstacle layouts
-   Dynamic hazards
-   Increasing gameplay pressure

Obstacle types can include:

-   Static obstacles
-   Moving obstacles
-   Rotating obstacles
-   Laser/dynamic obstacles

------------------------------------------------------------------------

# ⏱️ Level Transition System

When a player completes a level:

1.  Gameplay freezes.
2.  The next level is prepared.
3.  The existing game board remains visible.
4.  The next-level obstacle layout appears faintly in the background.
5.  The countdown runs:

``` text
3
2
1
GO
```

6.  The countdown remains in the foreground.
7.  After `GO`, gameplay resumes.
8.  The same prepared obstacle layout becomes active.

### Important

There is **no separate preview screen or preview panel**.

The next-level obstacles are shown directly on the existing game board
behind the countdown.

The preview should remain subtle/dim so the countdown stays readable.

------------------------------------------------------------------------

# ⚡ Speed Progression

The game uses **gradual speed progression**.

There should be:

-   No sudden post-level speed boost.
-   No unexpected speed jump after the countdown.
-   A controlled increase in difficulty over progression.
-   Consistent behavior in both main modes.

The selected custom speed in Neon Velocity should be respected by
gameplay and Auto Play.

------------------------------------------------------------------------

# 🎮 Controls

## Desktop

Supported movement controls:

-   `Arrow Up`
-   `Arrow Down`
-   `Arrow Left`
-   `Arrow Right`

and:

-   `W`
-   `A`
-   `S`
-   `D`

------------------------------------------------------------------------

## 📱 Mobile

Mobile gameplay uses touch controls.

The preferred D-pad arrangement is:

``` text
        ↑

   ←         →

        ↓
```

Each direction is an **independent button**.

The controls should remain:

-   Separated
-   Easy to press
-   Thumb-friendly
-   Visually consistent with the existing neon design

Swipe control can also be supported where implemented.

------------------------------------------------------------------------

# 📐 Responsive Design

NEON SNAKE 4K is designed for:

-   Desktop
-   Laptop
-   Tablet
-   Mobile

The game board must:

-   Fit the available viewport.
-   Preserve its aspect ratio.
-   Avoid stretching.
-   Avoid cropping.
-   Avoid horizontal/vertical overflow.
-   Handle high-DPI displays correctly.
-   Keep controls usable on small screens.

The responsive implementation should preserve the existing visual
identity rather than introducing unnecessary redesigns.

------------------------------------------------------------------------

# 🎨 UI / UX

The design direction is:

> **Futuristic • Neon • Cyberpunk • Arcade • Premium**

Core UX principles:

-   Gameplay first
-   Fast start
-   Minimal unnecessary UI
-   Clear feedback
-   Consistent visual identity
-   Responsive interaction
-   Keyboard-first desktop experience
-   Touch-first mobile experience

## Main Screens

1.  Main Menu
2.  Mode Selection
3.  How to Play
4.  Settings
5.  Gameplay
6.  Level Transition
7.  Game Over
8.  Victory

------------------------------------------------------------------------

# 🖥️ Gameplay HUD

## Snake Challenge

Relevant gameplay information includes:

-   Level
-   Score
-   Combo
-   Coins
-   Auto Play status

## Neon Velocity

Relevant gameplay information includes:

-   Score
-   Speed
-   Combo
-   Auto Play status

**Coins must not appear in Neon Velocity.**

------------------------------------------------------------------------

# 🔊 Audio

The project uses the browser's:

**Web Audio API**

for procedural/gameplay sound feedback.

Audio should remain optional.

If audio cannot initialize or is unavailable, gameplay should continue
normally.

Settings can provide sound/music controls where implemented.

------------------------------------------------------------------------

# 💾 Local Storage

The project uses browser `localStorage` for local persistence.

Stored information can include:

-   High score
-   Coin balance
-   Sound settings
-   Music settings
-   Other relevant local game preferences

Local storage is intended for convenience and persistence on the
player's browser.

It is **not a secure server-side database** and should not be treated as
tamper-proof.

------------------------------------------------------------------------

# 🏗️ System Architecture

NEON SNAKE 4K uses a practical client-side architecture.

``` text
┌─────────────────────────────┐
│        React UI Layer       │
│ Menu • Modes • HUD • Forms  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Game State Manager    │
│ Menu • Play • Pause • Game  │
│ Over • Victory • Transition │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│         Game Engine         │
│ Update • Collision • Score  │
│ Combo • Levels • Progress   │
└───────┬─────────┬───────────┘
        │         │
        ▼         ▼
┌────────────┐ ┌──────────────┐
│  Obstacles │ │     Food     │
│  Manager   │ │    Manager   │
└────────────┘ └──────────────┘
        │         │
        └────┬────┘
             ▼
┌─────────────────────────────┐
│       Canvas Renderer       │
└──────────────┬──────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌────────────┐   ┌────────────┐
│ Web Audio  │   │ localStorage│
└────────────┘   └────────────┘
```

------------------------------------------------------------------------

# 🧰 Technology Stack

  Technology      Purpose
  --------------- ------------------------------------------
  React           UI and component structure
  TypeScript      Type-safe application/game logic
  Vite            Development and production build tooling
  HTML5 Canvas    High-performance game rendering
  CSS             Futuristic responsive UI
  Web Audio API   Procedural/gameplay audio
  localStorage    Local game persistence
  Git             Version control
  GitHub          Source repository
  Vercel          Production deployment

------------------------------------------------------------------------

# 📁 Recommended Project Structure

``` text
neon-snake-4k/
│
├── public/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── game/
│   ├── rendering/
│   ├── input/
│   ├── audio/
│   ├── storage/
│   └── styles/
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── index.html
└── README.md
```

The exact structure may differ from the current implementation; the
important principle is to keep UI, game logic, rendering, input, audio
and persistence logically separated.

------------------------------------------------------------------------

# 🚀 Getting Started

## Requirements

Install:

-   Node.js
-   npm
-   Git

Then open the project directory.

``` powershell
cd "C:\Users\Abhinandon\.gemini\antigravity-ide\scratch\neon-snake-4k"
```

------------------------------------------------------------------------

## Install Dependencies

``` powershell
npm install
```

------------------------------------------------------------------------

## Run Development Server

``` powershell
npm run dev
```

Open the local address shown by Vite, normally:

``` text
http://localhost:5173/
```

------------------------------------------------------------------------

## Production Build

``` powershell
npm run build
```

This runs TypeScript compilation and the Vite production build.

The production files are generated in:

``` text
dist/
```

------------------------------------------------------------------------

## Preview Production Build

``` powershell
npm run preview
```

Then open:

``` text
http://localhost:4173/
```

------------------------------------------------------------------------

# 🔄 Git Workflow

After making changes:

``` powershell
git status
git add .
git commit -m "Update NEON SNAKE 4K"
git push origin main
```

If GitHub is already connected, pushing to `main` can trigger the Vercel
production deployment.

Do not repeatedly run `git init` or add the remote again when the
repository is already configured.

------------------------------------------------------------------------

# 🚀 Deployment

Production deployment flow:

``` text
Developer
   │
   ▼
Local Project
   │
   ▼
Git Commit
   │
   ▼
GitHub / main
   │
   ▼
Vercel Build
   │
   ▼
Production
   │
   ▼
Player Browser
```

Before deployment:

``` powershell
npm run build
```

The build should complete successfully before pushing the release.

------------------------------------------------------------------------

# 🧪 Testing Checklist

## Gameplay

-   [ ] Snake movement works
-   [ ] Keyboard controls work
-   [ ] Mobile controls work
-   [ ] Swipe works where implemented
-   [ ] Wall collision works
-   [ ] Self collision works
-   [ ] Obstacle collision works
-   [ ] Food collection works
-   [ ] Score updates correctly
-   [ ] Combo reaches x10 correctly

## Food

-   [ ] Normal food works
-   [ ] Golden food works
-   [ ] Bonus food works
-   [ ] Food never spawns inside obstacles
-   [ ] Food never overlaps obstacle hitboxes
-   [ ] Moving obstacles cannot leave food invalid

## Levels

-   [ ] All 10 levels work
-   [ ] Difficulty progresses
-   [ ] Speed increases gradually
-   [ ] No sudden post-level speed boost
-   [ ] Countdown works
-   [ ] Next-level obstacles appear faintly behind countdown
-   [ ] Same prepared obstacle layout activates after GO

## Modes

-   [ ] Snake Challenge works
-   [ ] Neon Velocity works
-   [ ] Coins appear only in Snake Challenge
-   [ ] Neon Velocity awards no coins
-   [ ] Speed customization works in Neon Velocity
-   [ ] Auto Play works correctly

## Auto Play

-   [ ] Requires 500 coins
-   [ ] Deducts exactly 500 coins once
-   [ ] Cannot double-charge
-   [ ] Targets food
-   [ ] Avoids obstacles
-   [ ] Avoids walls
-   [ ] Avoids self-collision
-   [ ] Requires another 500 coins for another use

## Responsive

-   [ ] Desktop layout works
-   [ ] Laptop layout works
-   [ ] Tablet layout works
-   [ ] Mobile board fits viewport
-   [ ] No canvas cropping
-   [ ] No canvas stretching
-   [ ] No unwanted overflow
-   [ ] Four mobile buttons are separated and usable

------------------------------------------------------------------------

# ⚠️ MVP Out of Scope

To keep the project focused, the current MVP does not require:

-   ❌ Multiplayer
-   ❌ Online leaderboard
-   ❌ User accounts
-   ❌ Authentication
-   ❌ Cloud database
-   ❌ Payment/monetization system
-   ❌ Social features
-   ❌ Server-side game simulation
-   ❌ External AI services
-   ❌ Unnecessary third-party backend services

These can be considered only in a future version if product requirements
justify them.

------------------------------------------------------------------------

# 🔐 Security Notes

NEON SNAKE 4K does not require passwords or sensitive user information
for the MVP.

Important safeguards:

-   Validate localStorage values before using them.
-   Guard coin transactions against duplicate execution.
-   Prevent invalid game-state transitions.
-   Keep game logic deterministic where possible.
-   Treat browser storage as untrusted client-side data.

------------------------------------------------------------------------

# 📊 Performance Goals

The project targets smooth gameplay around:

**\~60 FPS on capable modern devices**

Performance priorities:

-   Efficient Canvas rendering
-   Efficient collision checks
-   Bounded food-placement attempts
-   Controlled obstacle calculations
-   Avoid unnecessary React rerenders during the game loop
-   Correct device-pixel-ratio handling

------------------------------------------------------------------------

# 🛠️ Bug-Fixing Strategy

When an issue appears:

``` text
1. Reproduce
      ↓
2. Identify Root Cause
      ↓
3. Apply Smallest Safe Fix
      ↓
4. Test Affected Feature
      ↓
5. Run Regression Tests
      ↓
6. npm run build
      ↓
7. Commit + Push
```

Avoid redesigning working systems when fixing isolated bugs.

------------------------------------------------------------------------

# 📌 Product Definition

NEON SNAKE 4K is a **responsive futuristic Snake game for the web**
featuring:

> **10 progressive levels + two gameplay modes + obstacles + multiple
> food types + x10 combo scoring + Snake Challenge coins + 500-coin
> one-time Auto Play + responsive controls + Web Audio + local
> persistence + production deployment.**

------------------------------------------------------------------------

# 🌌 Design Philosophy

The project follows one simple principle:

> **Classic gameplay. Futuristic experience.**

The goal is not to overload Snake with unnecessary features.

Every feature should improve at least one of:

-   Gameplay
-   Progression
-   Responsiveness
-   Replayability
-   Feedback
-   Visual experience

------------------------------------------------------------------------

# 📜 Current Project Status

  Feature                         Status
  ------------------------------- -------------------
  Snake Gameplay                  ✅ Completed
  10 Levels                       ✅ Completed
  Progressive Difficulty          ✅ Completed
  Obstacles                       ✅ Completed
  Multiple Food Types             ✅ Completed
  Combo x10                       ✅ Completed
  Snake Challenge                 ✅ Completed
  Neon Velocity                   ✅ Completed
  Coin System                     ✅ Completed
  Auto Play --- 500 coins/use     ✅ Completed
  Responsive Laptop Layout        ✅ Fixed
  Responsive Mobile Layout        ✅ Improved
  Separate Mobile Controls        ✅ Improved
  Level Countdown                 ✅ Completed
  Next-Level Background Preview   🔧 In Improvement
  Web Audio                       ✅ Completed
  localStorage                    ✅ Completed
  GitHub                          ✅ Connected
  Vercel                          🚀 Live
  Production Build                ✅ Successful

------------------------------------------------------------------------

# 👨‍💻 Project

**NEON SNAKE 4K**

A futuristic browser Snake game project focused on gameplay,
progression, responsive design and modern web technologies.

------------------------------------------------------------------------

## 👨‍💻 Author

### Abhinandan Khot

**AI Enthusiast \| Full Stack Developer \| Innovator**

GitHub: `ABHINANDAN-KHOT-18`

------------------------------------------------------------------------

## ⭐ If You Like the Project

Give the repository a ⭐ on GitHub and explore the source code.

``` text
NEON SNAKE 4K
Classic Snake → Reimagined for the Neon Era.
```
------------------------------------------------------------------------
