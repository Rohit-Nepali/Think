# PRD: Think

## 1. Product overview

**Working name:** Think\
**Product type:** Minimal, local-first visual thinking tool\
**Platform:** Web application\
**Primary goal:** Help a person think through one question without
getting trapped in endless hypothetical branches.

Think is a blank visual canvas where a user starts with one question,
adds possible answers as branches, and follows an answer by asking the
next question. The canvas makes the depth of that reasoning visible.
When the active line of thinking reaches five question levels, the
application shows a prompt encouraging the user to check whether they
are still making progress or are overthinking.

The product should feel quiet, focused, and deliberately simple.

> The goal isn't to find the perfect answer. The goal is to find an
> answer good enough to take the next step.

## 2. Problem statement

When people try to solve a problem, one question can lead to many
related questions, hypothetical situations, and possibilities. Writing
everything down can make this worse: related thoughts become mixed
together, and the original question gets lost.

Think addresses this by: - Keeping the original question visible. -
Showing questions and answers in a clear visual hierarchy. - Letting the
user explore one answer path at a time. - Making the depth of the active
path visible. - Prompting the user to pause when the reasoning gets
deep.

Think is not intended to be a general-purpose mind map, notes app, task
manager, journal, or AI assistant.

## 3. Product principles

1.  **One canvas:** The canvas is the application. Do not build a
    dashboard or feature-heavy shell around it.
2.  **One original question:** Every thinking session begins with one
    root question.
3.  **Visible hierarchy:** Questions, answers, and their relationships
    must be easy to understand visually.
4.  **Focused exploration:** A user can select an answer and continue
    from that answer with another question.
5.  **Awareness, not restriction:** Five levels trigger a reflection
    prompt. The application must not forcibly prevent further thinking.
6.  **Local-first:** User content stays in the browser. No account or
    server is required.
7.  **Minimal interface:** Every visible control must support creating,
    navigating, or understanding the thinking tree.

## 4. Target user and primary use case

A person who: - Has a decision or problem they want to think through. -
Tends to generate too many hypothetical questions. - Wants to see the
structure of their reasoning. - Needs a gentle signal when they may be
going too deep.

**Primary use case**

1.  Open the website.
2.  Enter an original question.
3.  Add possible answers beneath it.
4.  Select an answer.
5.  Ask a follow-up question beneath that answer.
6.  Repeat as needed.
7.  Notice the depth indicator and five-level reflection prompt.
8.  Decide whether to continue or stop and take a reasonable next step.

## 5. Core user experience

### 5.1 Initial state

-   Open directly into a clean, blank, white canvas.
-   Show a small, unobtrusive prompt to enter the first question.
-   Do not show a marketing landing page, dashboard, sidebar, tutorial,
    or sample project.
-   Once the root question is submitted, display it as the first
    question node on the canvas.

### 5.2 Questions and answer branches

The thinking tree has two conceptual elements:

-   **Question:** A question the user is trying to answer.
-   **Answer:** One possible answer to a question.

A question can have multiple answer branches. The user can add, edit, or
delete their own answers.

The user can select an answer and add a follow-up question beneath it.
This creates the next level of the thinking path.

Unselected answers remain visible as alternatives. The user can select a
different answer and continue exploring that path without losing
existing branches.

The interface must make it visually clear which answer is selected and
which path is currently active.

### 5.3 Depth tracking

-   Count question levels along the currently selected path, starting
    with the root question as level 1.
-   Display the current depth in a small, unobtrusive indicator.
-   Do not count sibling answers as additional depth.
-   When the active path reaches **level 5**, show a gentle reflection
    prompt.
-   The prompt should ask the user to consider whether the current
    question is necessary to answer the original question and whether
    they already have enough information to act.
-   Give the user a clear choice to stop exploring or continue.
-   Do not automatically delete, collapse, or block any branches.

Suggested prompt:

**Are you still solving the original question?**

-   Is this question necessary before I can take the next step?
-   Do I already have enough information to make a reasonable decision?

Actions: - **I have enough. Stop here.** - **Continue thinking.**

The warning should appear once when the active path first reaches level
5. It should not repeatedly interrupt the user while they edit the same
level.

### 5.4 Canvas interactions

The canvas should support: - Pan and zoom. - Fit the visible tree to the
viewport. - Select a question or answer. - Add an answer to a
question. - Add a follow-up question to a selected answer. - Edit
question and answer text. - Delete a question or answer, with a clear
confirmation if deleting it also removes descendants. - Move nodes only
if needed for layout correction; the tree relationships must remain
intact.

The layout should automatically position new nodes so the user does not
need to manually draw or connect every branch.

### 5.5 Persistence

-   Automatically save changes locally.
-   Restore the current thinking tree after a refresh or browser
    restart.
-   Use IndexedDB through Dexie.js.
-   Do not require login, registration, cloud sync, or a backend.
-   If local persistence fails, show a small, understandable error
    message. Do not silently claim that work was saved.

For the MVP, support one current workspace/session. Do not build session
history, folders, sharing, export, or cross-device sync.

## 6. Visual and interaction design

### 6.1 Design direction

The interface should be minimal, neutral, and functional.

-   White canvas background.
-   Dark, readable text.
-   Subtle neutral borders.
-   Small, restrained controls.
-   Simple rectangular or softly rounded nodes.
-   Thin, understated connecting lines.
-   Clear visual distinction between the active path and inactive
    alternatives.
-   No gradients, decorative illustrations, elaborate animations, glass
    effects, or unnecessary shadows.

The visual hierarchy of the tree should do the work. The interface
should not compete with the user's thoughts.

### 6.2 Layout

-   The canvas occupies almost the entire viewport.
-   A very small toolbar may contain only essential canvas actions, such
    as zoom controls and fit-to-view.
-   Keep the depth indicator visible but unobtrusive.
-   Editing controls should appear close to the selected node or in a
    small contextual popover.
-   Avoid a permanent left sidebar or dashboard navigation.

### 6.3 Design tokens: single source of truth

All design tokens must be defined in exactly one file:

`src/styles/tokens.css`

This file is the sole source of truth for: - Color palette. - Typography
and font sizes. - Spacing scale. - Border widths and radii. - Shadows. -
Node dimensions or sizing variables where appropriate. - Canvas and
interaction colors. - Focus and warning states.

Rules: - Components must consume CSS custom properties from
`tokens.css`. - Do not redefine token values in component stylesheets. -
Do not create separate light/dark token files or duplicate token
definitions. - Do not introduce a second token system in a Tailwind,
JavaScript, or component-library configuration. - Component-specific
layout rules may live with their components, but shared design values
must come from `tokens.css`. - Keep the initial palette light-only. Do
not add theme switching to the MVP.

## 7. Functional requirements

  -----------------------------------------------------------------------
  ID                      Requirement             Priority
  ----------------------- ----------------------- -----------------------
  FR-01                   User can enter and      Must
                          create one root         
                          question.               

  FR-02                   User can add multiple   Must
                          answer branches to a    
                          question.               

  FR-03                   User can select an      Must
                          answer branch.          

  FR-04                   User can add a          Must
                          follow-up question to   
                          the selected answer.    

  FR-05                   User can edit question  Must
                          and answer text.        

  FR-06                   User can delete a node  Must
                          and its descendants     
                          safely.                 

  FR-07                   The canvas visually     Must
                          represents parent-child 
                          relationships.          

  FR-08                   The active answer path  Must
                          is visually             
                          distinguishable.        

  FR-09                   The application         Must
                          calculates active       
                          question depth.         

  FR-10                   A reflection prompt     Must
                          appears at level 5.     

  FR-11                   User can choose to stop Must
                          or continue after the   
                          prompt.                 

  FR-12                   Canvas supports pan,    Must
                          zoom, and fit-to-view.  

  FR-13                   The current workspace   Must
                          is automatically saved  
                          to IndexedDB.           

  FR-14                   The current workspace   Must
                          is restored after       
                          reload.                 
  -----------------------------------------------------------------------

## 8. Explicitly out of scope

Do not implement: - User accounts or authentication. - Backend, REST
API, or GraphQL. - Cloud database or cloud synchronization. -
AI-generated questions, answers, or suggestions. - AI chat. - Notes,
journaling, or rich-text documents. - Thought parking lot or
unrelated-thought collection. - Tasks, reminders, or productivity
dashboards. - Collaboration or sharing. - Multiple workspaces or session
history. - Export/import. - Templates or example boards. - Dark mode or
theme customization. - Analytics or user tracking. - Mobile-specific
native application features.

Do not add features just because a library makes them possible.

## 9. Technical decisions

Use a client-side React application.

  -----------------------------------------------------------------------
  Concern                 Technology              Notes
  ----------------------- ----------------------- -----------------------
  Build tooling           Vite                    Lightweight client-side
                                                  development and build
                                                  tooling

  UI                      React                   The application is an
                                                  interactive client-side
                                                  canvas

  Language                TypeScript              Use strict typing

  Canvas                  `@xyflow/react`         Node rendering, edges,
                                                  pan, zoom, and canvas
                                                  interactions

  State                   Zustand                 Keep the shared tree
                                                  and selection state
                                                  simple

  Persistence             Dexie.js + IndexedDB    Local workspace
                                                  persistence

  Styling                 Plain CSS               Avoid an unnecessary
                                                  styling framework
  -----------------------------------------------------------------------

Do not use Next.js. The MVP has no server rendering, SEO requirement,
backend routes, or server-side functionality. React with Vite is
sufficient.

Do not add a routing library unless the application develops a real
routing requirement.

## 10. Suggested project structure

Keep the project small. Do not create abstractions, folders, hooks, or
utility files without a concrete need.

``` text
src/
├── app/
│   └── App.tsx
├── components/
│   ├── Canvas.tsx
│   ├── QuestionNode.tsx
│   ├── AnswerNode.tsx
│   ├── CanvasToolbar.tsx
│   └── DepthPrompt.tsx
├── store/
│   └── thinkingStore.ts
├── db/
│   └── database.ts
├── types/
│   └── thinking.ts
├── styles/
│   ├── tokens.css
│   └── global.css
└── main.tsx
```

This is a starting structure, not a requirement to create empty files
for every item. If a component is small and does not need its own file,
keep it together. Avoid barrel files and unnecessary index files.

## 11. Data model

Use a simple typed model. Keep the application data independent of React
Flow's rendering-specific node and edge objects.

A suggested conceptual model:

``` ts
type Question = {
  id: string;
  text: string;
  parentAnswerId: string | null;
  answerIds: string[];
};

type Answer = {
  id: string;
  text: string;
  questionId: string;
  followUpQuestionId: string | null;
};

type ThinkingWorkspace = {
  id: string;
  rootQuestionId: string | null;
  questions: Record<string, Question>;
  answers: Record<string, Answer>;
  selectedAnswerId: string | null;
  updatedAt: number;
};
```

Implementation notes: - The root question has `parentAnswerId: null`. -
Each answer belongs to exactly one question. - An answer can lead to
zero or one follow-up question. - A follow-up question belongs to the
answer that leads to it. - Keep IDs stable. - Derive the active path and
its depth from the relationships and current selection. Do not store
several copies of the same derived information. - Persist the domain
workspace, not temporary React Flow viewport state unless needed to
restore a useful canvas position.

The implementation may adjust this model if a simpler, equally clear
representation is found. Do not build a generic graph engine.

## 12. Architecture and code quality constraints

-   Keep business logic separate from React Flow rendering.
-   React Flow is responsible for canvas rendering, node positioning,
    edges, pan, and zoom.
-   Application logic is responsible for question/answer relationships,
    selection, active-path depth, and the level-five prompt.
-   Keep IndexedDB access in one small persistence module.
-   Keep Zustand state focused on the current workspace and user
    interactions.
-   Avoid duplicating workspace data in multiple stores.
-   Derive values such as active depth instead of storing redundant
    state.
-   Use TypeScript types for domain data and component props.
-   Use small, readable components.
-   Avoid premature abstractions, generic frameworks, and unnecessary
    custom hooks.
-   Do not add dependencies without a clear requirement.
-   Handle loading and persistence errors visibly but unobtrusively.

## 13. Acceptance criteria

The MVP is complete when all of the following work:

1.  Opening the website shows a clean blank canvas and a way to enter
    the root question.
2.  Creating a root question displays it on the canvas.
3.  The user can add at least two answer branches to that question.
4.  Selecting an answer allows the user to add a follow-up question
    beneath it.
5.  The user can repeat this process to build a hierarchy of questions
    and answers.
6.  The user can switch to another answer branch without losing the
    previously created branch.
7.  The active path and current question depth are visually clear.
8.  Reaching question level 5 displays the reflection prompt.
9.  The user can stop or continue from the prompt.
10. Editing and deleting nodes updates the tree correctly.
11. The canvas can be panned, zoomed, and fitted to view.
12. Refreshing the browser restores the saved workspace.
13. The application works without an account, backend, or network
    connection after its initial assets have loaded.
14. All shared visual tokens are defined in `src/styles/tokens.css`,
    with no duplicated token definitions elsewhere.

## 14. Implementation instructions for GitHub Copilot

Build the application in small, verifiable steps.

Before coding: 1. Inspect the existing repository and its package
manager. 2. Reuse existing setup where it is appropriate. 3. Do not
overwrite or move unrelated files. 4. Confirm the actual application
root before creating files.

Implementation order: 1. Set up or verify the Vite + React + TypeScript
application. 2. Create `tokens.css` and `global.css`. 3. Implement the
question and answer domain types. 4. Implement the workspace state and
core tree operations. 5. Implement IndexedDB persistence and
restoration. 6. Implement the React Flow canvas and custom
question/answer nodes. 7. Implement branch selection and active-path
depth calculation. 8. Implement the level-five reflection prompt. 9. Add
essential editing, deletion, pan, zoom, and fit-to-view interactions.
10. Test the complete flow and fix issues before adding anything else.

After each step: - Run TypeScript checks and the available build/test
commands. - Fix errors before proceeding. - Keep the implementation
consistent with the product principles and explicit out-of-scope list.

**Important:** Do not expand the product scope. Do not add a dashboard,
AI features, authentication, cloud storage, session management, or
decorative UI. Prefer the simplest implementation that satisfies the
requirements.
