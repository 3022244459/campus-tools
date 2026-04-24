# App Testing Report – Campus Tool

## Overview
- **App name:** Campus Tool  
- **Tested versions:** Android & iOS  
- **Test date:** April 22–23, 2026  
- **Tester:** 6323000458_布锐特

## Test Scope
The following core features were tested across both Android and iOS platforms:

- Login  
- File upload  
- Navigation  
- Camera  
- Data saving  
- Lost and found  
- Club consultation  
- Wallet  
- Payments  

## Experience
Overall, the app runs smoothly on both platforms. Setup was straightforward, and most features work as expected. The user experience is generally positive, with only a few specific areas needing improvement.

## Test Results

| Feature             | Status      | Notes |
|---------------------|-------------|-------|
| Login               | ✅ Pass      | Works on both platforms |
| File upload         | ✅ Pass      | Functional |
| Navigation          | ✅ Pass      | Smooth |
| Camera              | ✅ Pass      | Works correctly |
| Data saving         | ⚠️ Needs fix | Issues with race conditions and idempotency |
| Lost and found      | ✅ Pass      | OK |
| Club consultation   | ✅ Pass      | OK |
| Wallet              | ⚠️ Needs fix | Balance update issues |
| Payments            | ⚠️ Needs fix | Double debit risk |

## Issues Found

### 1. Double Debit (Idempotency Failure)
- **Description:** Payment requests can be processed more than once, leading to double deductions.
- **Reproduce:** Submit the same payment request multiple times (e.g., due to network retry).
- **Suggested fix:** Implement strict idempotency keys. Every client request must carry a unique ID. The server should reject duplicate IDs.

### 2. Race Conditions in Balance Updates
- **Description:** Concurrent balance updates (e.g., wallet + payments) can overwrite each other, causing incorrect balances.
- **Suggested fix:** Use optimistic or pessimistic locking for balance transactions.

### 3. Offline Map Data Corruption
- **Description:** Map data saved offline can become corrupted.
- **Suggested fix:** Download to a temporary file → verify checksum (hash) → atomically move into place. Validate map data on app launch.

### 4. The "App Killed in Background" Problem
- **Description:** When the app is killed while in the background, some state or data is not properly restored.
- **Suggested fix:** Improve saved instance state handling to fully restore UI and data after process death.

## Stability
- ❌ No crashes  
- ❌ No freezes  
- ✅ App remains stable during all tested scenarios

## Missing Features
None. All expected features are present.

## Improvement Recommendations (Minor Fixes)
1. **Saved instance state** – Ensure full state restoration after app is killed in background.
2. **Idempotency keys** – Prevent duplicate payment processing.
3. **Atomic file operations + checksum validation** – For offline map data.
4. **Optimistic/pessimistic locking** – For wallet balance updates.

## Conclusion
**Needs minor fixes** – The app is stable, feature-complete, and generally usable. With the four improvements above (especially idempotency and race condition fixes), the app will be ready for production release.

---

*Report generated on April 23, 2026*