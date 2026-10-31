# 🧠 Think

> **A minimal visual thinking tool for turning one question into a clear path forward.**

Think gives you a blank canvas to work through a decision or problem. Start with one question, explore possible answers as branches, and follow the path that matters. As your thinking gets deeper, a simple depth indicator helps you notice when you might be overthinking instead of moving toward a decision.

**The goal isn't to find the perfect answer. It's to find an answer good enough to take the next step.**

## 💡 Why Think?

Sometimes one question leads to another, then another, until the original problem gets buried under hypothetical situations and unrelated thoughts.

Writing everything down doesn't always help. It can make it easier to follow every thought instead of staying focused on the question you started with.

Think uses visual hierarchy to make your reasoning easier to follow. Questions and answers form a connected tree, so you can see how each thought relates to the original problem.

## 🧭 How it works

1. **❓ Start with a question.** Put the decision or problem you want to think through on the canvas.
2. **🌱 Add possible answers.** Each answer becomes a branch from the question.
3. **🔎 Follow a branch.** Choose an answer and add a follow-up question beneath it.
4. **🗺️ See your thinking take shape.** The canvas shows how your questions and answers connect.
5. **⏸️ Know when to pause.** At five question levels, Think prompts you to check whether you're still solving the original problem or going deeper than necessary.
6. **➡️ Decide what to do next.** Stop when you have enough information to take a reasonable next step, or continue if the question genuinely needs more thought.

## 🎨 A focused canvas

Think keeps the interface deliberately simple:

- 🖼️ A blank, spacious canvas.
- 🌿 Connected question and answer nodes.
- ↕️ Vertical and horizontal layout options.
- 📊 A visible indicator for the current thinking depth.
- 🛠️ Simple controls for editing, navigating, and arranging the canvas.

The five-level indicator is a **gentle checkpoint, not a hard limit**. Some problems need more thought. The point is to notice when more thinking may no longer be helping.

## 🔒 Local-first by design

Think is designed to work without an account or backend. Thinking data is stored locally in the browser using IndexedDB, so a server-side database and user registration are not required for the core experience.

> 💾 Local browser storage is device- and browser-specific. Clearing browser data can remove saved sessions.

## ⚙️ Tech stack

- ⚛️ **React + Vite** — client-side application
- 📘 **TypeScript** — typed application code
- 🕸️ **React Flow (`@xyflow/react`)** — interactive canvas and connected nodes
- 🧩 **Zustand** — application state
- 💾 **Dexie.js + IndexedDB** — local persistence
- 🎨 **CSS** — styling, with shared design tokens kept in one file

## 🚧 Project status

Think is an independent project in development. The focus is on getting the core thinking experience right before considering additional features.

## ✨ Guiding principle

### Ask. Explore. Recognize. Act.

Think is not meant to help you think about everything. It's meant to help you think clearly about the thing that matters right now.
