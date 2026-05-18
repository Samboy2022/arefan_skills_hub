# **\[Feature Name\] \- Detailed Engineering & Design Specification**

**Version:** \[1.0.0\] | **Date:** \[YYYY-MM-DD\] | **Status:** \[Draft/Approved\]

**Priority:** \[High/Medium/Low\] | **Complexity:** \[High/Medium/Low\]

**Lead Engineer:** \[Name\] | **Lead Designer:** \[Name\]

## **1\. Overview & Business Logic**

**Purpose:** The \[Feature Name\] service enables users to \[Primary purpose of the feature, e.g., seamlessly transfer funds between internal accounts\]. This service is \[context on usage frequency or importance, e.g., a critical user path accessed daily\] and must be \[key qualitative goals, e.g., highly performant, exceptionally secure, and intuitive for non-technical users\].

**Business Value:** \[Why are we building this? E.g., This feature reduces support tickets related to manual fund transfers by 40% and increases daily active user engagement by providing a frictionless financial tool\].

**Key Capabilities:**

* \[Capability 1: e.g., Real-time data synchronization across multiple devices\]  
* \[Capability 2: e.g., Secure, tokenized third-party authentication\]  
* \[Capability 3: e.g., Robust offline support for core read actions with optimistic UI updates\]  
* \[Capability 4: e.g., Comprehensive audit logging for all user-initiated state changes\]

## **2\. Software Architecture & Design Principles**

*This feature must strictly adhere to the following engineering patterns to ensure long-term maintainability, testability, and scalability.*

* **Design Pattern (Container/Presenter):** We strictly enforce the separation of concerns. "Smart" Container components are responsible exclusively for data fetching, state management, and business logic. They pass data and callbacks down to "Dumb" Presenter components, which handle purely the UI rendering and user interactions.  
* **Custom Hooks:** All complex business logic, API calls, and derived state calculations must be extracted into reusable custom hooks (e.g., use\[Feature\]Data, use\[Feature\]Mutations, use\[Feature\]Validation). Components should rarely exceed 150-200 lines of code.  
* **Atomic Design:** UI components should be built following atomic design principles (Atoms \-\> Molecules \-\> Organisms \-\> Templates \-\> Pages) to maximize reusability across the application.  
* **Error Boundaries & Suspense:** The main feature module must be wrapped in a React Error Boundary to catch rendering errors and prevent full application crashes. Utilize React Suspense for declarative loading states during asynchronous data fetching.  
* **Immutability:** State must never be mutated directly. Always use functional state updates or libraries like Immer when dealing with deeply nested state objects.

## **3\. UI/UX & Component Specification**

### **Page Layout (Visual Hierarchy)**

┌──────────────────────────────────────────────┐  
│ HEADER                                       │  
├────────┬─────────────────────────────────────┤  
│        │                                     │  
│ SIDEBAR│  \[Primary Navigation/Tabs\]          │  
│        │  \[Option 1\] \[Option 2\]              │  
│        │                                     │  
│        │  \[Section 1 Title\]                  │  
│        │  ┌────┐ ┌────┐ ┌────┐               │  
│        │  │Item│ │Item│ │Item│               │  
│        │  └────┘ └────┘ └────┘               │  
│        │                                     │  
│        │  \[Main Form / Interaction Area\]     │  
│        │  \[Input Field 1\]                    │  
│        │  \[Input Field 2\]                    │  
│        │  \[Primary Action Button\]            │  
│        │                                     │  
│        │  \[Secondary Section / Summary\]      │  
│        │  ┌──────────────────────────────┐   │  
│        │  │ Data Point: Value            │   │  
│        │  │ Data Point: Value            │   │  
│        │  └──────────────────────────────┘   │  
│        │                                     │  
│        │  \[History / Activity Feed\]          │  
│        │  \[List of recent items\]             │  
└────────┴─────────────────────────────────────┘

### **Component Details & Modularity**

*This section details the specific React components, their distinct responsibilities, required props, and styling rules to ensure consistency and prevent monolithic component structures.*

#### **1\. Main Feature Container (\<\[FeatureName\]Container /\>)**

* **Responsibility:** Acts as the primary entry point and state manager for the feature. It does not render DOM elements directly (beyond layout wrappers); instead, it orchestrates data flow. It consumes the use\[Feature\]Data hook to fetch initial state and handles the global loading and error states for the entire view.  
* **Props:** None (typically instantiated by the router).  
* **State Dependencies:** Relies on global state (e.g., Zustand/Redux for user session context) and server state (React Query for fetching historical data).  
* **Styling Requirements:** \[theme-color\]/\[opacity\] min-h-screen w-full flex flex-col md:flex-row gap-\[size\] p-\[size\]

#### **2\. Navigation / Tab Group (\<\[Feature\]Navigation /\>)**

* **Responsibility:** Manages the active view state (e.g., switching between "Send to Bank" and "Internal Transfer"). It must be fully accessible, supporting keyboard navigation (arrow keys to switch tabs, Enter to select).  
* **Props:**  
  * activeTab: \[Feature\]Type  
  * onTabChange: (tab: \[Feature\]Type) \=\> void  
* **Interactive Element (Tab Button):**  
  * Base classes: flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2  
  * Active state: bg-primary text-white shadow-md  
  * Inactive state: text-primary/60 hover:text-primary hover:bg-primary/30

#### **3\. Data Entry Form (\<\[Feature\]Form /\>)**

* **Responsibility:** The core interaction area. It renders input fields based on the currently selected tab. Crucially, this component delegates form state management to a library like React Hook Form integrated with Zod for robust, performant validation without excessive re-renders.  
* **Props:**  
  * onSubmit: (data: \[FormType\]) \=\> Promise\<void\>  
  * isSubmitting: boolean  
  * initialData: Partial\<\[FormType\]\> (optional, for editing existing records)  
* **Specific Fields:**  
  * **A. \[Primary Input Field, e.g., Recipient Search\]**:  
    * Behavior: Must implement a debounced search function (e.g., 300ms delay) to prevent hammering the API on every keystroke. Include an auto-suggest dropdown that handles empty states ("No results found") gracefully.  
    * Styling: relative w-full px-4 py-3 rounded-lg border text-white placeholder-opacity focus:ring-2 focus:border-transparent  
  * **B. \[Secondary Input Field, e.g., Amount\]**:  
    * Behavior: Enforce strict numeric formatting. Strip out non-numeric characters on paste and format the value with currency symbols and comma separators on blur.  
    * Validation/Helper Text: text-xs mt-1 text-red-500 min-h-\[1rem\] (reserve space for the error message to prevent layout shift).

#### **4\. Dynamic Summary Area (\<\[Feature\]Summary /\>)**

* **Responsibility:** Provides a real-time reflection of the user's intended action. This is a pure component that relies solely on props to display calculated totals, fees, or expected outcomes before the user commits to the action.  
* **Props:**  
  * formData: \[FormType\]  
  * calculations: \[CalculationResultType\] (passed down from the container after running through a custom hook)  
* **Container Styling:** bg-\[theme-color\]/\[opacity\] border border-\[theme-color\]/\[opacity\] rounded-\[size\] p-\[size\] shadow-sm  
* **Data Display:**  
  * **\[Calculated Total\]**: Must prominently display the final impacted value. text-lg font-bold text-\[accent-color\]

#### **5\. History / Activity Feed (\<\[Feature\]ActivityFeed /\>)**

* **Responsibility:** Displays a paginated or infinite-scrolling list of recent actions related to this feature.  
* **Props:**  
  * items: \[EntityName\]\[\]  
  * isLoadingMore: boolean  
  * onLoadMore: () \=\> void  
* **Performance Consideration:** Since lists can grow large, utilize a virtualization library (like react-window or react-virtuoso) if the expected item count exceeds 50, ensuring DOM nodes are only rendered when visible in the viewport.

## **4\. API Contracts & Data Flow**

*Define the strict data interfaces expected between the frontend client and backend services.*

### **Request: \[POST/GET/PUT\] /api/v1/\[endpoint\]**

**Description:** \[What this endpoint does, e.g., Initiates a fund transfer transaction\]

**Headers Required:** Authorization: Bearer \<token\>, X-Idempotency-Key: \<uuid\> (for POST/PUT requests to prevent duplicate submissions).

**Payload Schema:**

interface \[Feature\]RequestDTO {  
  /\*\* \[Description: e.g., Unique identifier of the target recipient\] \*/  
  \[entityId\]: string;   
  /\*\* \[Description: e.g., Amount in lowest denomination (cents/kobo)\] \*/  
  \[amount\]: number;  
  /\*\* \[Description: e.g., Optional note attached to the transaction\] \*/  
  \[narration\]?: string;   
}

### **Response: 200 OK (or 201 Created)**

**Response Schema:**

interface \[Feature\]ResponseDTO {  
  success: boolean;  
  data: {  
    id: string;  
    status: '\[Status1\]' | '\[Status2\]'; // e.g., 'PROCESSING' | 'COMPLETED'  
    createdAt: string; // ISO 8601 UTC string  
    referenceCode: string;  
  };  
  metadata?: {  
    pagination?: {  
      currentPage: number;  
      totalPages: number;  
      hasNextPage: boolean;  
    };  
  }  
}

**Expected Latency:** \< \[e.g., 300ms\] for standard requests.

**Error Handling:** Backend will return standardized error envelopes (e.g., { error: { code: 'INSUFFICIENT\_FUNDS', message: '...' } }). The frontend must map these specific error codes to localized, user-friendly messages.

## **5\. State Management & Side Effects**

* **Global State:** \[e.g., Zustand useAppStore for user session data, theme preferences, and feature flags\].  
* **Form State:** Exclusively managed via react-hook-form to minimize re-renders. Avoid storing rapidly changing form inputs in global state.  
* **Server State:** Handled via \[e.g., React Query (@tanstack/react-query)\].  
  * **Query Keys:** Must be strictly typed arrays: \['\[feature\]', '\[entityId\]', filters\]  
  * **Cache Invalidation:** Upon a successful POST/PUT mutation, immediately invalidate the associated \['\[feature\]'\] query keys to trigger a background refetch and update the UI.  
  * **Optimistic Updates:** For low-risk mutations (e.g., liking an item, updating a local preference), implement optimistic UI updates within the React Query onMutate callback, reverting the change in the onError callback if the API request fails.

## **6\. Interactivity & User Flow**

1. **Initialization:** User navigates to /\[route\]. use\[Feature\]Query fetches initial data. The UI displays a skeleton loader while isLoading is true.  
2. **Interaction:** User inputs data into \<\[FormComponent\] /\>.  
3. **Validation:** Input is validated in real-time via \[e.g., Zod\] schema integration with the form library. Inline errors appear immediately on blur or attempted submission.  
4. **Submission:** User clicks \[Action\]. use\[Feature\]Mutation triggers. The submit button enters a disabled loading state to prevent double-submissions.  
5. **Authorization (If Applicable):** \[e.g., System prompts for a 4-digit PIN or biometric auth via WebAuthn\].  
6. **Resolution:**  
   * *Success:* A success toast notification appears, the form resets, and the cache is invalidated to reflect the new state in the history feed.  
   * *Error:* UI reverts any optimistic updates. An error toast displays a localized message mapped from the backend error code.

## **7\. Validation & Business Rules**

*Strict enforcement of business logic before data hits the network.*

// Zod/Yup Schema representation  
export const \[Feature\]Schema \= z.object({  
  \[Field 1\]: z.number().positive("Must be greater than 0").max(MAX\_LIMIT, "Exceeds allowed limit"),  
  \[Field 2\]: z.string().length(10, "Must be exactly 10 digits").regex(/^\[0-9\]+$/, "Must contain only numbers"),  
  \[Dependent Field\]: z.string().optional(),  
}).refine((data) \=\> {  
  // ✅ \[Business Rule 1\]: e.g., Dependent field is required IF Primary Field is present  
  if (data.primaryField && \!data.dependentField) return false;  
  return true;  
}, { message: "Dependent field required", path: \["dependentField"\] });

## **8\. Security, Compliance & NFRs**

### **Security**

* **Data Sanitization:** All text inputs displayed back to the user must be sanitized against XSS payloads. React handles DOM escaping automatically, but avoid dangerouslySetInnerHTML.  
* **Authentication:** Endpoint requires Bearer \[Token\] with \[specific\_role/scope\] permissions. Ensure the token is passed securely in headers, not in URL parameters.  
* **Rate Limiting:** Implement a minimum 300ms debounce on all search/filter inputs. Limit form submissions to prevent rapid-fire API spamming.

### **Performance**

* **Code Splitting:** Implement React.lazy for heavy sub-components (e.g., complex charts, large modal dialogs, PDF generators) that are not needed on initial render.  
* **Memoization:** Utilize useMemo for computationally expensive derived state (e.g., sorting/filtering large arrays locally) and useCallback for functions passed as props to heavily re-rendered child components.  
* **Bundle Size:** Monitor imports. E.g., import specific Lodash functions (lodash/debounce) rather than the entire library.

### **Accessibility (a11y)**

* **WCAG 2.1 AA Compliance:**  
* **Contrast:** Text-to-background contrast ratio must be at least 4.5:1.  
* **Keyboard Navigation:** All interactive elements (buttons, inputs, tabs) must be accessible via Tab and Space/Enter. Ensure visual focus rings are present (focus-visible).  
* **Screen Readers:** Use semantic HTML. Implement aria-label for icon-only buttons, aria-describedby for inputs with helper text, and aria-live="polite" for dynamic content changes (like loading spinners or toast messages).

## **9\. Testing Strategy**

*Testing is not an afterthought; it proves the specification is met.*

* **Unit Tests (Jest/Vitest):**  
  * **Target:** Custom hooks (use\[Feature\]Data), pure utility functions (e.g., fee calculators, data formatters), and Zod validation schemas.  
  * **Goal:** Verify business logic behaves correctly across various edge cases without mocking the DOM.  
* **Component Tests (React Testing Library):**  
  * **Target:** Presentational and Container components.  
  * **Goal:** Verify that specific props result in the correct UI rendering. Ensure error states render the correct UI elements and that form validation properly blocks submission attempts on invalid input.  
* **E2E Tests (Cypress/Playwright):**  
  * **Target:** The complete user journey.  
  * **Critical Path:** Navigate to page \-\> Wait for initial load \-\> Fill form with valid data \-\> Bypass/Simulate auth step \-\> Submit \-\> Intercept network request \-\> Verify success modal displays and database/history updates correctly.

## **10\. AI Agent Instructions \- STRICT ADHERENCE REQUIRED**

### **❌ DO NOT**

* **DO NOT** write monolithic components; enforce the Container/Presenter pattern and keep component files under 200 lines.  
* **DO NOT** use any types in TypeScript; use strict interfaces, utility types (Partial, Pick), or generics.  
* **DO NOT** mutate state directly; always use state setter functions or functional updates.  
* **DO NOT** hardcode environment variables, API URLs, or sensitive keys inside the component logic.  
* **DO NOT** use emojis in the UI or codebase comments unless explicitly requested by the design system.  
* **DO NOT** use inline CSS (style={{...}}); strictly use Tailwind CSS classes defined in the specification.  
* **DO NOT** expose raw backend error messages directly to the UI; map them to user-friendly messages.  
* **DO NOT** use alert(), prompt(), or confirm(); use the application's designated modal/toast system.

### **✅ ALWAYS DO**

* **ALWAYS** implement Zod/Yup schemas for robust form and API payload validation before sending data.  
* **ALWAYS** handle all three API states: isLoading, isSuccess, and isError, providing appropriate visual feedback for each.  
* **ALWAYS** use semantic HTML tags (\<nav\>, \<main\>, \<article\>, \<section\>, \<form\>).  
* **ALWAYS** provide descriptive aria-labels for icon-only buttons and ensure interactive elements have a focus-visible state.  
* **ALWAYS** extract complex business logic out of the component body and into pure utility functions or custom hooks to allow for isolated unit testing.  
* **ALWAYS** implement debouncing (lodash/debounce or custom hook) for any search, filter, or auto-suggest inputs.  
* **ALWAYS** include a fallback UI for React Suspense boundaries and Error Boundaries.  
* **ALWAYS** disable submit buttons while a network request isPending or isSubmitting to prevent duplicate transactions.