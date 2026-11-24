from qa_helpers import add_qa_item

def add_section_b(doc):
    # Q13
    add_qa_item(
        doc,
        q_num=13,
        question="Why did you choose React 19 for the frontend of Job Executive?",
        short_answer="React 19 was selected for its advanced concurrent rendering capabilities, streamlined hook ergonomics, high-performance Virtual DOM diffing, and strong ecosystem synergy with TypeScript and Tailwind CSS. It allows complex UI state—such as real-time filtering, 3D canvas rendering, and multi-role dashboards—to update smoothly without jank.",
        explanation="React 19 improves hydration performance and component rendering pipelines. Its component model enables strict encapsulation: job cards, status badges, application modals, and dashboard tables exist as reusable, self-contained functional components. Coupled with TypeScript, every prop and hook state transition is statically validated at compile time, eliminating undefined runtime exceptions.",
        code_example="""// frontend/App.tsx
import React, { useState, useEffect } from "react";
import { JobSeeker, Employer, Admin, Job, BlogPost } from "./types";
import * as api from "./services/apiService";""",
        code_caption="frontend/App.tsx",
        follow_up="How does React 19's rendering pipeline differ from earlier React versions in managing heavy UI updates?",
        key_points=[
            "Concurrent rendering prevents UI freezing during complex state transitions.",
            "Clean functional component architecture with full TypeScript type safety.",
            "Seamless integration with Three.js canvas and Tailwind utility classes."
        ]
    )

    # Q14
    add_qa_item(
        doc,
        q_num=14,
        question="How is routing handled in Job Executive without external libraries like react-router-dom?",
        short_answer="Routing is implemented as a deterministic state machine managed by a single activeView state variable in App.tsx. Valid views are constrained by a TypeScript union type ('home' | 'jobs' | 'companies' | 'blog' | 'dashboard' | 'login' | 'signup'), and App.tsx renders the corresponding view component conditionally.",
        explanation="In recruitment applications where access to dashboards strictly depends on authentication state, external routing libraries often introduce complexities such as flash-of-unauthorized-content, browser history synchronization bugs, and 404 rewrite requirements on static hosts. Job Executive's state-machine router guarantees that navigation transitions occur atomically in memory. When a user logs in, activeView is updated to 'dashboard' alongside currentUser in the same React render cycle.",
        code_example="""// frontend/App.tsx
type ActiveView = "home" | "jobs" | "companies" | "blog" | "dashboard" | "login" | "signup";

const [activeView, setActiveView] = useState<ActiveView>("home");

// Conditional view rendering
{activeView === "home" && <LandingPage onExplore={() => setActiveView("jobs")} />}
{activeView === "jobs" && <JobsExplorePage jobs={jobs} onApply={handleOpenApply} />}
{activeView === "dashboard" && renderRoleDashboard()}""",
        code_caption="frontend/App.tsx",
        follow_up="What happens when a user clicks the browser's back button in this state-machine routing setup?",
        key_points=[
            "TypeScript union type enforces valid navigation states.",
            "Eliminates routing flash and unauthorized layout leakage.",
            "Zero server configuration required for static web hosting."
        ]
    )

    # Q15
    add_qa_item(
        doc,
        q_num=15,
        question="What are the trade-offs of using a state-machine view router versus React Router?",
        short_answer="The state-machine router offers zero bundle overhead, instantaneous navigation, atomic role guards, and zero static host 404 issues. The trade-offs are that individual views do not have unique URL paths in the browser address bar, making direct deep-linking and browser back/forward history navigation unavailable without manual window.history integration.",
        explanation="For our project's scope, protecting candidate and employer workflows with strict authentication took priority over deep-linking. In a future production iteration, deep-linking can be achieved either by adopting HTML5 History API (window.history.pushState) or adding react-router-dom with custom ProtectedRoute wrappers.",
        code_example="""// Simple HTML5 History Integration Pattern (Future Enhancement)
const navigateTo = (view: ActiveView) => {
  window.history.pushState({ view }, "", `/${view === "home" ? "" : view}`);
  setActiveView(view);
};""",
        code_caption="Potential Browser History Enhancement",
        follow_up="How would you implement deep-linking for individual job postings (e.g. /jobs/:id) in this architecture?",
        key_points=[
            "Benefits: Zero bundle weight, no 404 rewrite issues, atomic auth guard.",
            "Drawbacks: No out-of-the-box browser history or URL deep-linking.",
            "Mitigation: Can be bridged via HTML5 pushState or standard router adoption."
        ]
    )

    # Q16
    add_qa_item(
        doc,
        q_num=16,
        question="How is user authentication state initialized and persisted across page reloads?",
        short_answer="Authentication state is persisted by storing the JWT token in browser localStorage upon login. When the application mounts, a useEffect hook checks for localStorage.getItem('token'). If found, it dispatches api.getUserProfile() (GET /api/auth/me) to validate the token and re-hydrate the currentUser and currentUserRole state.",
        explanation="If the user closes their browser or refreshes the page, React memory state is reset. The initialization effect runs on mount: it retrieves the token, triggers the profile API call with the token attached by the Axios interceptor, and upon a successful 200 response, restores the dashboard view. If the token is invalid or expired, the backend returns a 401 error, triggering the Axios response interceptor to remove the expired token from localStorage and keep the user on the public home view.",
        code_example="""// frontend/App.tsx
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const restoreUser = async () => {
    try {
      const profile = await api.getUserProfile();
      if (profile?.user) {
        setCurrentUser(profile.user);
        setCurrentUserRole(profile.user.role);
        setActiveView("dashboard");
      }
    } catch {
      localStorage.removeItem("token");
    }
  };
  restoreUser();
}, []);""",
        code_caption="frontend/App.tsx",
        follow_up="What security risk is associated with storing JWTs in localStorage, and how can it be mitigated?",
        key_points=[
            "Token stored in localStorage and verified against /api/auth/me on mount.",
            "Automatic session restoration seamlessly transitions authenticated users to dashboard.",
            "401 failures cleanly purge stale tokens and reset state."
        ]
    )

    # Q17
    add_qa_item(
        doc,
        q_num=17,
        question="How do Axios interceptors simplify authentication in your application?",
        short_answer="Axios interceptors centralize token attachment and error handling in a single place. The request interceptor automatically injects the Authorization: Bearer <token> header into every outgoing HTTP request, while the response interceptor catches 401 Unauthorized responses globally, clearing expired tokens and redirecting users to the login screen.",
        explanation="Without interceptors, every single API call (e.g. applyJob, getMyJobs, updateStatus, createJob) would require manual boilerplate to read localStorage and attach the header. Furthermore, if a token expired midway through a user's session, individual components would need repetitive error handling. The interceptor pipeline handles this transparently across the entire application.",
        code_example="""// frontend/services/axiosInstance.ts
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);""",
        code_caption="frontend/services/axiosInstance.ts",
        follow_up="What happens if multiple simultaneous requests return 401 at the same time?",
        key_points=[
            "Request interceptor automatically adds Bearer token header to all requests.",
            "Response interceptor provides centralized 401 session eviction.",
            "Eliminates repetitive authorization boilerplate across all services."
        ]
    )

    # Q18
    add_qa_item(
        doc,
        q_num=18,
        question="How do you prevent layout shift or unauthorized content flashing during session validation?",
        short_answer="Unauthorized content flashing is prevented by initializing activeView to 'home' by default and displaying non-blocking loading states during session restoration. The dashboard view is only rendered once getUserProfile() successfully resolves and confirms the user's role.",
        explanation="If activeView defaulted to 'dashboard' before token validation completed, an unauthenticated visitor would see a brief flash of an empty dashboard before being redirected. By defaulting to the public 'home' landing page, visitors immediately see engaging content, while returning authenticated users experience a smooth transition to their dashboard once their identity is cryptographically verified.",
        code_example="""// Default UI State: Secure Fallback
const [activeView, setActiveView] = useState<ActiveView>("home");
const [currentUser, setCurrentUser] = useState<User | null>(null);

// Dashboard is guarded by both view state AND currentUser presence
{activeView === "dashboard" && currentUser && renderRoleDashboard()}""",
        code_caption="frontend/App.tsx",
        follow_up="How would you implement a skeleton loading screen during the session restoration phase?",
        key_points=[
            "Default state always falls back to the public landing page.",
            "Dashboards require both activeView === 'dashboard' AND valid currentUser object.",
            "Prevents Flash of Unauthorized Content (FOUC) and Cumulative Layout Shift (CLS)."
        ]
    )

    # Q19
    add_qa_item(
        doc,
        q_num=19,
        question="How did you structure your TypeScript interfaces to maintain alignment with backend schemas?",
        short_answer="TypeScript interfaces are centralized in frontend/types/index.ts, mirroring the Mongoose schemas for User, Job, Application, and BlogPost. Specialized sub-interfaces (JobSeeker, Employer, Admin) extend the base User type, enforcing role-specific type safety across all components.",
        explanation="Frontend data normalization functions (e.g. normalizeSeeker, normalizeEmployer, normalizeJob) act as anti-corruption layers. When backend APIs return documents with MongoDB _id fields, the normalization layer maps _id to id and assigns sensible default values for optional fields (such as empty arrays for skills or 0 for expectedSalary). This prevents undefined is not an object crashes in UI components.",
        code_example="""// frontend/types/index.ts
export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: "SEEKER" | "EMPLOYER" | "ADMIN";
}

export interface JobSeeker extends BaseUser {
  role: "SEEKER";
  resumeUrl?: string;
  skills?: string[];
  expectedSalary?: number;
}

export interface Employer extends BaseUser {
  role: "EMPLOYER";
  companyName?: string;
  companyWebsite?: string;
}""",
        code_caption="frontend/types/index.ts",
        follow_up="What is the benefit of using discriminated unions (e.g. role: 'SEEKER') in TypeScript?",
        key_points=[
            "Centralized domain models in types/index.ts mirror backend Mongoose schemas.",
            "Normalization functions guarantee default values and eliminate undefined errors.",
            "Discriminated unions enable safe type narrowing in dashboard components."
        ]
    )

    # Q20
    add_qa_item(
        doc,
        q_num=20,
        question="How does the 3D Hero visual work, and how did you prevent it from blocking UI rendering?",
        short_answer="The 3D Hero visual is built using Three.js and @react-three/fiber wrapped inside a responsive Canvas component. It renders a floating, rotating executive briefcase surrounded by subtle geometric particles. Rendering is decoupled from React's main DOM reconciliation via requestAnimationFrame, ensuring 60 FPS graphics without UI lag.",
        explanation="In HeroVisual.tsx, the 3D scene uses procedural meshes (box geometries for the briefcase body and handle) with standard metallic/roughness materials and ambient/directional lighting. The useFrame hook from React Three Fiber updates mesh rotation angles on every GPU frame cycle outside React's state lifecycle. The canvas is styled with pointer-events-none and absolute positioning, allowing text and CTA buttons above it to remain fully interactive without event blocking.",
        code_example="""// frontend/components/landing/HeroVisual.tsx (Conceptual Pattern)
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

function FloatingBriefcase() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.5;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.15;
  });
  return <mesh ref={meshRef}><boxGeometry args={[2, 1.4, 0.6]} /><meshStandardMaterial color="#1E3A8A" /></mesh>;
}""",
        code_caption="frontend/components/landing/HeroVisual.tsx",
        follow_up="What happens to the 3D Canvas on low-end mobile devices with limited GPU memory?",
        key_points=[
            "Uses React Three Fiber with procedural geometries for low bundle size.",
            "Animation runs inside requestAnimationFrame outside React's state tree.",
            "Layered behind DOM content with pointer-events-none for fluid touch responsiveness."
        ]
    )

    # Q21
    add_qa_item(
        doc,
        q_num=21,
        question="How is multi-faceted job filtering implemented on the frontend?",
        short_answer="Multi-faceted filtering in JobsExplorePage.tsx combines controlled search inputs (keyword, location, category dropdown, job type pills, and salary range slider). Filter changes update a local state object, which either filters the in-memory jobs collection or triggers a debounced API query to GET /api/job with matching query parameters.",
        explanation="Users can filter jobs along five orthogonal dimensions simultaneously: 1. Text search across title, description, and company name. 2. Geographic location. 3. Industry category (from 22+ domains). 4. Employment type (Full-time, Part-time, Contract, Internship, Freelance). 5. Salary range. The UI updates instantaneously, showing matching job counts and an empty state if no vacancies match the selected criteria.",
        code_example="""// frontend/components/jobs/JobsExplorePage.tsx
const filteredJobs = jobs.filter((job) => {
  const matchesSearch = !search || 
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase());
  const matchesCategory = !category || job.category === category;
  const matchesType = !jobType || job.jobType === jobType;
  const matchesSalary = !minSalary || (job.maxSalary >= Number(minSalary));
  return matchesSearch && matchesCategory && matchesType && matchesSalary;
});""",
        code_caption="frontend/components/jobs/JobsExplorePage.tsx",
        follow_up="When is it better to filter in-memory on the client versus querying the database on every filter change?",
        key_points=[
            "Multi-faceted filtering across search, category, location, type, and compensation.",
            "Controlled React form inputs ensure predictable, declarative filter state.",
            "Instant UI updates with responsive count badges and fallback empty states."
        ]
    )

    # Q22
    add_qa_item(
        doc,
        q_num=22,
        question="How do you manage loading and error states across asynchronous API calls?",
        short_answer="Loading states are tracked using boolean flags (isLoading, isSubmitting) that disable interactive buttons and display spinner indicators during in-flight network requests. Errors are caught in try/catch blocks and surfaced to users via toast notifications and contextual inline alert messages.",
        explanation="Whenever an asynchronous action is triggered (e.g. handleLogin or handleApply), the function immediately sets setIsLoading(true) and clears previous errors. Inside a try block, the API call executes. Upon completion, state updates take place; if an error occurs, catch (err: any) extracts the backend error message (err.response?.data?.msg || err.message) and renders it safely without crashing the UI. A finally block guarantees that setIsLoading(false) executes regardless of outcome.",
        code_example="""// Standard Async Handler Pattern in App.tsx
const handleLogin = async (email: string, password: string, role: UserRole) => {
  setAuthError(null);
  setIsLoading(true);
  try {
    await api.authenticateUser(email, password, role);
    const profile = await api.getUserProfile();
    setCurrentUser(profile.user);
    setActiveView("dashboard");
  } catch (error: any) {
    setAuthError(error.response?.data?.msg || "Login failed");
  } finally {
    setIsLoading(false);
  }
};""",
        code_caption="frontend/App.tsx",
        follow_up="How do you handle race conditions when two async requests finish out of order?",
        key_points=[
            "Explicit isLoading flags disable duplicate button clicks during API flights.",
            "try/catch/finally blocks guarantee clean state restoration.",
            "Backend error messages (err.response?.data?.msg) surfaced gracefully via toast notifications."
        ]
    )

    # Q23
    add_qa_item(
        doc,
        q_num=23,
        question="What is your strategy for component composition and reusability?",
        short_answer="Components follow atomic design principles: reusable primitives (Modal, Button, Badge, Toaster) are decoupled from domain logic. Domain components (JobCard, ApplicantRow, BlogCard) compose these primitives, while container components (Dashboards, ExplorePage) manage data fetching and lifecycle orchestration.",
        explanation="For example, the generic Modal component handles backdrop clicks, escape key dismissals, scroll locking, and enter/exit CSS transitions. Domain-specific dialogs—such as ApplyModal, PostJobModal, and JobDetailsModal—simply pass children into the Modal component. This eliminates duplicated modal backdrop logic and guarantees consistent accessibility across the application.",
        code_example="""// Generic Modal Composition (frontend/components/Modal.tsx)
<Modal isOpen={isApplyOpen} onClose={() => setIsApplyOpen(false)} title="Submit Application">
  <ApplyForm jobId={selectedJob.id} onSubmit={handleApplicationSubmit} />
</Modal>""",
        code_caption="frontend/components/Modal.tsx usage",
        follow_up="How does prop drilling become an issue in large component trees, and how do you resolve it?",
        key_points=[
            "Atomic component separation: UI primitives vs domain containers.",
            "Generic Modal wrapper handles overlay, dismiss, and scroll locking.",
            "High reusability reduces codebase duplication and enforces visual consistency."
        ]
    )

    # Q24
    add_qa_item(
        doc,
        q_num=24,
        question="How did you implement responsive design across mobile, tablet, and desktop viewports?",
        short_answer="Responsive design is achieved using Tailwind CSS mobile-first breakpoint modifiers (sm:, md:, lg:, xl:). Layouts default to single-column flex or grid structures for mobile devices and gracefully expand into multi-column dashboard grids and persistent sidebars on larger screens.",
        explanation="Navigation menus collapse into a mobile hamburger drawer on viewports under 768px (md:hidden). Dashboard statistics display as a single column on mobile, a 2-column grid on tablet, and a 4-column row on desktop (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4). Tables in candidate applicant lists feature horizontal scroll containers with whitespace-nowrap to prevent text clipping on narrow mobile screens.",
        code_example="""// Responsive Grid Example
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {jobs.map(job => <JobCard key={job.id} job={job} />)}
</div>""",
        code_caption="Tailwind CSS Responsive Grid",
        follow_up="What strategies do you use to test responsiveness across real mobile devices?",
        key_points=[
            "Mobile-first responsive architecture using Tailwind CSS breakpoints.",
            "Dynamic collapse of complex multi-column dashboards on smaller screens.",
            "Horizontal overflow containers preserve table data readability on mobile."
        ]
    )

    # Q25
    add_qa_item(
        doc,
        q_num=25,
        question="How do modals (e.g. ApplyModal, PostJobModal) manage state and unmounting?",
        short_answer="Modals are controlled components whose visibility is driven by boolean state in their parent container. When unmounted or closed, internal form state is reset, and a cleanup effect restores document.body.style.overflow to prevent scroll lock leaks.",
        explanation="When a user clicks 'Apply', parent state sets selectedJob and isApplyModalOpen(true). The modal renders in the DOM, applying a backdrop blur. An event listener attached to the window listens for the 'Escape' key to close the modal. When the modal closes, local validation errors and text inputs are cleared, ensuring that opening the modal for a different job presents a clean, empty form.",
        code_example="""// frontend/components/Modal.tsx
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }
  return () => { document.body.style.overflow = "unset"; };
}, [isOpen]);""",
        code_caption="frontend/components/Modal.tsx",
        follow_up="Why is it important to clean up document body styles in an unmount cleanup function?",
        key_points=[
            "Controlled visibility via parent boolean state.",
            "Automatic body scroll-locking with cleanup on unmount.",
            "Escape key and backdrop click listeners provide intuitive dismissal."
        ]
    )

    # Q26
    add_qa_item(
        doc,
        q_num=26,
        question="How do you prevent unnecessary re-renders in large lists like the job explore feed?",
        short_answer="Unnecessary re-renders are prevented by assigning unique, stable key props (job._id) to list items, keeping component state localized to card elements, and avoiding inline anonymous arrow functions in hot rendering paths.",
        explanation="When rendering dozens of job cards, using array indices as keys causes React to re-render all elements whenever the list is sorted or filtered. Using unique MongoDB _ids allows React's reconciliation algorithm to identify exactly which items were added, removed, or moved. In addition, bookmark or apply actions only mutate the specific targeted item rather than cloning and re-rendering the entire parent container.",
        code_example="""// Stable Key Reconciliation
{jobs.map((job) => (
  <JobCard 
    key={job.id || job._id} 
    job={job} 
    onSelect={() => handleSelectJob(job)} 
  />
))}""",
        code_caption="Stable Key Usage in Lists",
        follow_up="When would you introduce React.memo or windowing libraries like react-window?",
        key_points=[
            "Stable unique keys (_id) ensure optimal Virtual DOM diffing during filtering.",
            "State localized to leaf components prevents parent container re-renders.",
            "Pagination (limit: 20) keeps DOM node counts within optimal browser budgets."
        ]
    )

    # Q27
    add_qa_item(
        doc,
        q_num=27,
        question="How does the toast notification system work without heavy third-party dependencies?",
        short_answer="Job Executive includes a lightweight, custom Toaster and showToast utility in frontend/components/ui.ts. Notifications are published to an event listener or state array, rendering self-dismissing animated banner toasts with success, error, and info color accents.",
        explanation="Third-party notification libraries (e.g. react-toastify) often add 30-50KB to the bundle footprint. Our custom notification system renders an animated toast container fixed to the viewport corner. When showToast.success(message) is called, a timer automatically dismisses the notification after 4 seconds, complete with a manual close button and CSS fade-in-down keyframe animation.",
        code_example="""// frontend/components/ui.ts
export const showToast = {
  success: (msg: string) => dispatchToast(msg, "success"),
  error: (msg: string) => dispatchToast(msg, "error"),
  info: (msg: string) => dispatchToast(msg, "info"),
};""",
        code_caption="frontend/components/ui.ts",
        follow_up="How does decoupling toast notifications from React component trees improve code readability?",
        key_points=[
            "Zero external dependency overhead saves 30-50KB bundle weight.",
            "Programmatic showToast.success() invocation from any service or handler.",
            "Self-dismissing with auto-cleanup timer and keyframe animations."
        ]
    )
