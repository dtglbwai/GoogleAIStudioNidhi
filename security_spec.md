# Firestore Security Specification

## 1. Data Invariants
- Every document in `/transactions`, `/applications`, `/salesInvoices`, and `/purchaseBills` MUST declare `ownerId` matching `request.auth.uid` on creation and preserve `ownerId` immutably on updates.
- All entity document IDs and reference IDs MUST match `^[a-zA-Z0-9_\-]+$` with length 1–128 characters.
- All timestamps (`createdAt`, `updatedAt`) MUST equal `request.time` at write time; `createdAt` is immutable once created.
- Every collection restricts `list` queries using `resource.data.ownerId == request.auth.uid` (or verified bootstrapped admin token) with zero `get()` / `exists()` calls inside `allow list`.
- Terminal statuses (`Completed`/`Reversed` for transactions, `Approved`/`Rejected` for applications, `Paid`/`Cancelled` for invoices/bills) lock non-admin updates.

## 2. Adversarial Test Matrix ("Dirty Dozen")
1. Unauthenticated read on `/transactions/txn-1` -> `PERMISSION_DENIED`
2. Unauthenticated list on `/transactions` -> `PERMISSION_DENIED`
3. Spoofed `ownerId` create (`/transactions/txn-1` with `ownerId: 'victim'`) -> `PERMISSION_DENIED`
4. Shadow field injection (`extraAdminFlag: true`) -> `PERMISSION_DENIED`
5. Oversized description (`> 500` chars) -> `PERMISSION_DENIED`
6. Invalid document ID (`txn/../admin` or `> 128` chars) -> `PERMISSION_DENIED`
7. Client-forged `createdAt` timestamp != `request.time` -> `PERMISSION_DENIED`
8. Unverified email trying admin access (`email: 'dtglbw@gmail.com'`, `email_verified: false`) -> `PERMISSION_DENIED`
9. Cross-user `get` on another user's `/salesInvoices/inv-other` -> `PERMISSION_DENIED`
10. Modifying immutable `ownerId` or `createdAt` on `/applications/app-1` update -> `PERMISSION_DENIED`
11. Non-admin updating a terminal `Paid` `/purchaseBills/bill-1` -> `PERMISSION_DENIED`
12. Privilege escalation create/write to `/admins/{uid}` by non-admin -> `PERMISSION_DENIED`
