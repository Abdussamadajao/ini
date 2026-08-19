# Ini - Complete Feature List

> **Ini** is a personal finance tracking mobile app built with Expo (React Native). It helps users manage income, expenses, categories, and gain insights into their spending habits.

---

## 1. Authentication & Account

| Feature                | Description                                                                                                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **User Registration**  | Create an account with full name, username, email, and password (with confirmation). Field-level error handling from API. Validated with Yup schemas.                      |
| **Email Login**        | Sign in with email and password. Field-specific errors displayed on email/password fields.                                                                                 |
| **Email Verification** | 6-digit OTP verification with on-screen numeric keypad. Visual dot indicator for entered digits. Resend cooldown timer (10 minutes). Auto-redirect if no unverified email. |
| **Forgot Password**    | Enter email to receive a password reset OTP code. Redirects to reset password screen.                                                                                      |
| **Reset Password**     | 6-digit OTP entry with on-screen keypad, countdown timer (10 min), new password + confirm password fields. Shows the target email address.                                 |
| **Session Management** | Persistent sessions stored via Zustand + `expo-secure-store`. Auto-hydrates on app launch.                                                                                 |
| **Logout**             | Sign out and clear all local auth state.                                                                                                                                   |
| **Auth Guard**         | Protected routes redirect unauthenticated users to the login screen.                                                                                                       |

---

## 2. Onboarding

| Feature                          | Description                                                                            |
| -------------------------------- | -------------------------------------------------------------------------------------- |
| **Swipeable Onboarding Screens** | Multi-page swiper (react-native-swiper) introducing the app's core value propositions. |
| **Skip Option**                  | Users can skip onboarding at any time and go directly to login.                        |
| **Page Indicator Dots**          | Active dot animation shows current onboarding step.                                    |

---

## 3. Dashboard (Home Screen)

| Feature                       | Description                                                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Net Worth Card**            | Displays total net worth (income minus expenses) with a trend chip showing savings rate.                            |
| **Income/Expenses Breakdown** | Shows total income and total expenses as stat chips within the net worth card.                                      |
| **Income Streams**            | Horizontal scrollable cards showing each income source with remaining balance, percentage used, and a progress bar. |
| **Spending Chart**            | Visual chart showing income vs. expense trends over a selected period (line/bar chart).                             |
| **Recent Transactions**       | List of the most recent transactions with category icons, amounts, and dates.                                       |

---

## 4. Transactions (Wallet)

| Feature                            | Description                                                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Transaction List**               | Infinite-scrolling list of all income and expense transactions.                                                                |
| **Search**                         | Search bar to find transactions by keyword.                                                                                    |
| **Tab Filtering**                  | Switch between "All", "Income", and "Expense" tabs.                                                                            |
| **Advanced Filters**               | Filter modal with date range presets, custom date range, category multi-select, and min/max amount range.                      |
| **Filter Active Indicator**        | Visual dot on the filter icon when filters are applied.                                                                        |
| **Pull-to-Refresh**                | Refresh transaction data from the server.                                                                                      |
| **Transaction Details**            | Tap any transaction to view full details including amount, category, date/time, notes, tags, and receipt image.                |
| **Source Account Flow (Expenses)** | For expenses linked to an income pool, shows a "Before → After" balance flow showing how the expense affected the income pool. |

---

## 5. Add Income

| Feature                | Description                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Create Income**      | Add a new income entry with amount, source name, category, date, notes, and tag (Monthly/Bonus/One-time).     |
| **Category Selection** | Pick from available income categories via a modal with icon previews. Option to add custom categories inline. |
| **Date Picker**        | Select the recorded date for the income.                                                                      |
| **Form Validation**    | Yup + Formik validation. Submit button disabled until form is valid and dirty.                                |

---

## 6. Add Expense

| Feature                     | Description                                                                                                    |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Create Expense**          | Add a new expense with amount, category, date, notes, source name, and receipt upload.                         |
| **Receipt Upload**          | Pick image from gallery, upload to Cloudinary, preview with option to remove. Shows uploading state.           |
| **Link to Income Pool**     | Optionally link an expense to an existing income source to track spending against that income.                 |
| **Income Source Selection** | Modal to pick which income pool the expense draws from.                                                        |
| **Category Selection**      | Pick from available expense categories via a modal with icon previews. Option to add custom categories inline. |
| **Date Picker**             | Select the recorded date for the expense.                                                                      |
| **Form Validation**         | Yup + Formik validation. Submit button disabled until form is valid and dirty.                                 |

---

## 7. Edit & Delete Transactions

| Feature                      | Description                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Edit Income**              | Modify amount, source name, category, date, notes, and tag of an existing income.                                   |
| **Edit Expense**             | Modify amount, category, date, notes, receipt, and linked income of an existing expense.                            |
| **Delete Transaction**       | Delete any transaction with a confirmation bottom-sheet modal. Invalidates related cache (income summaries, lists). |
| **Optimistic Cache Updates** | Related queries (income summaries, transaction lists) are automatically invalidated after mutations.                |

---

## 8. Categories

| Feature                      | Description                                                                                        |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| **View Categories**          | Browse all categories with tabs for Income and Expense types.                                      |
| **Create Category**          | Add a new custom category with name, icon (Material Icons), color, and type.                       |
| **Edit Category**            | Update category name, icon, and color.                                                             |
| **Delete Category**          | Remove a custom category.                                                                          |
| **System Categories**        | Pre-defined system categories that come built-in (marked with `is_system` flag).                   |
| **Category Icons & Colors**  | Each category has a customizable icon and color used throughout the app for visual identification. |
| **Inline Category Creation** | Add custom categories directly from the category selection modal in income/expense forms.          |

---

## 9. Reports & Insights

| Feature                  | Description                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| **AI Insights Card**     | Displays AI-generated financial insights with a lightbulb icon and category pill.          |
| **Spending Donut Chart** | SVG-based donut chart showing spending distribution across categories with percentages.    |
| **Category Legend**      | Color-coded legend listing each spending category with its percentage.                     |
| **Savings Trend**        | Shows current savings rate with period-over-period change (up/down trend pill).            |
| **Income Trend**         | Current income with comparison to previous period.                                         |
| **Total Spent**          | Aggregate total spending for the current period.                                           |
| **Observations/Tips**    | List of personalized spending observations and financial tips with color-coded icon cards. |
| **Spending Habits**      | Cards highlighting spending habit patterns with centered text layout.                      |
| **Call-to-Action Card**  | Prompt to take action (e.g., set a budget) with a styled button.                           |

---

## 10. Profile & Settings

| Feature                  | Description                                                                                                |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **User Card**            | Displays user avatar, name, email, and "Member Since" year.                                                |
| **Edit Profile**         | Update name, email, and avatar image.                                                                      |
| **Change Password**      | Change account password from within the app.                                                               |
| **Category Management**  | Quick access to the category management screen from profile settings.                                      |
| **Theme Switching**      | Toggle between Light and Dark mode via a segmented control.                                                |
| **Notification Toggles** | Toggle switches for transaction alerts and budget alerts. Uses animated Reanimated-based switch component. |
| **Export Data**          | Option to export personal data (UI placeholder).                                                           |
| **Delete Account**       | Danger-styled action to delete the user's account (UI placeholder).                                        |
| **App Version**          | Displays current app version from Expo config.                                                             |
| **Logout Button**        | Sign out with success toast notification.                                                                  |

---

## 11. Navigation & UI

| Feature                          | Description                                                                                                    |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Tab Navigation**               | 5-tab bottom navigation: Dashboard, Wallet, Add (FAB), Reports, Profile.                                       |
| **Floating Action Button (FAB)** | Center tab is a floating "+" button that opens a quick actions modal.                                          |
| **Quick Actions Modal**          | Bottom sheet with quick access to "Add Income" and "Add Expense".                                              |
| **Floating Tab Bar**             | Custom-styled rounded tab bar with shadow effects and theme-aware colors.                                      |
| **Custom Icons**                 | SVG-based tab icons (dashboard, transactions, report, profile) with focused/unfocused states.                  |
| **Toast Notifications**          | Success/error/info toasts for user feedback on all actions.                                                    |
| **Skeleton Loading**             | Skeleton placeholders shown during data loading states.                                                        |
| **Error States**                 | Inline error components with retry functionality for failed API calls.                                         |
| **Bottom Sheet Modals**          | Smooth bottom sheet modals (via @gorhom/bottom-sheet) for filters, confirmations, and quick actions.           |
| **Safe Area Handling**           | Custom SafeArea wrapper component with proper insets on all screens.                                           |
| **Keyboard Avoiding**            | Themed keyboard-avoiding views for forms on both iOS and Android.                                              |
| **Info Banner**                  | Reusable banner component with variants (primary, success, warning, error, escrow) and optional action button. |

---

## 12. Shared Components

| Component                | Description                                                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **OnscreenKeypad**       | Custom 3x4 numeric keypad for OTP entry. Supports key press and backspace. Used in verify-email and reset-password screens. |
| **ReceiptUploadField**   | Image picker with Cloudinary upload, preview display, and remove button. Shows uploading state.                             |
| **SegmentedTabs**        | Generic pill-style segmented tab switcher with active/inactive styling.                                                     |
| **FormikCategorySelect** | Category dropdown with icon previews, loading/error states, and inline "Add custom category" button.                        |
| **AnimatedSwitch**       | Reanimated-based toggle switch with smooth color interpolation and thumb animation.                                         |
| **Avatar**               | User avatar display component.                                                                                              |
| **CategoryIcon**         | Reusable category icon with colored background circle.                                                                      |
| **BlurBackdrop**         | Blur effect backdrop overlay component.                                                                                     |
| **AuthBgDecor**          | Decorative background blobs for auth screens.                                                                               |
| **SearchBar**            | Themed search input with icon.                                                                                              |
| **Header**               | Screen header with title and optional back button.                                                                          |

---

## 13. Technical Features

| Feature                 | Description                                                                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Expo Router**         | File-based routing with grouped layouts (auth group, tabs group).                                                                         |
| **State Management**    | Zustand stores for auth state and transaction UI state, with persistence via expo-secure-store.                                           |
| **API Layer**           | Axios-based HTTP client with automatic JWT token injection via interceptors.                                                              |
| **React Query**         | TanStack React Query for server-state management with caching, invalidation, and infinite scroll.                                         |
| **Better Auth**         | Authentication powered by Better Auth with email/password and email OTP plugins.                                                          |
| **Formik + Yup**        | Form handling and validation. Buttons disabled until form is valid and dirty. Field-level error mapping from API responses.               |
| **Theming System**      | Custom theme engine with light/dark mode support, customizable colors (including escrow palette), spacing, radius, and typography tokens. |
| **Manrope Font**        | Custom font family (Manrope) with multiple weights for a polished typography system.                                                      |
| **Reanimated**          | React Native Reanimated for smooth animations (switch toggle, transitions).                                                               |
| **Cloudinary**          | Image upload service for expense receipts via direct upload API.                                                                          |
| **Type Safety**         | Full TypeScript coverage across types, stores, API calls, and components.                                                                 |
| **Screen Architecture** | Separated screen components (index.tsx) from form logic (form.tsx) and styles (styles.ts) for maintainability.                            |

---

## User Model

| Field             | Description                         |
| ----------------- | ----------------------------------- |
| `id`              | Unique user identifier              |
| `name`            | Full display name                   |
| `username`        | Unique username                     |
| `email`           | Email address                       |
| `emailVerified`   | Whether the email has been verified |
| `avatarUrl`       | Custom avatar URL                   |
| `bio`             | User biography                      |
| `displayUsername` | Display username override           |
| `image`           | Profile image URL                   |
| `phone`           | Phone number                        |
| `createdAt`       | Account creation timestamp          |
| `updatedAt`       | Last update timestamp               |

---

## Feature Summary by Screen

| Screen              | Key Capabilities                                              |
| ------------------- | ------------------------------------------------------------- |
| Onboarding          | Welcome slides, skip, navigation to auth                      |
| Login               | Email/password, field-level errors, forgot password link      |
| Register            | Full name, username, email, password with validation          |
| Verify Email        | 6-digit OTP via on-screen keypad, 10-min resend timer         |
| Forgot Password     | Email input, sends reset OTP                                  |
| Reset Password      | 6-digit OTP keypad, new password + confirm, resend timer      |
| Dashboard           | Net worth, income streams, chart, recent transactions         |
| Transactions        | Search, filter, infinite list, tap for details                |
| Add Income          | Amount, source, category, date, notes, tag                    |
| Add Expense         | Amount, category, date, notes, receipt upload, link to income |
| Edit Income         | Modify all income fields                                      |
| Edit Expense        | Modify all expense fields                                     |
| Transaction Details | Full view with edit/delete, source flow visualization         |
| Categories          | List, create, edit, delete with icon/color picker             |
| Reports             | Donut chart, insights, savings trend, observations            |
| Profile             | User info, settings, theme, notifications, logout             |
| Edit Profile        | Update name, email, avatar                                    |
| Change Password     | Password change form                                          |
