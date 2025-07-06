# ScanPass

**ScanPass** is a bilingual (English / French) web application that allows users to check whether a password has been compromised in known data breaches — without ever exposing or storing the password itself.

It uses the [HaveIBeenPwned](https://haveibeenpwned.com/API/v3#SearchingPwnedPasswordsByRange) API and follows the principle of **k-Anonymity** to protect user privacy. The application is designed to be simple, educational, and privacy-respecting.

## Features

- Password breach detection using HaveIBeenPwned's API
- Client-side hashing with SHA-1 (no password or full hash ever sent)
- Secure lookups using the k-Anonymity model
- Local comparison of results
- Bilingual user interface: English and French
- Responsive and accessible interface
- Clear, educational result messages

## How It Works

1. The user enters a password in a secure field.
2. The password is hashed locally using SHA-1.
3. The first 5 characters of the hash are sent to the HaveIBeenPwned API.
4. The API returns a list of matching hash suffixes with breach counts.
5. The full hash is compared locally.
6. A result is shown indicating whether the password has appeared in breaches.

## Why SHA-1?

SHA-1 is no longer secure for cryptographic purposes, but it is used here **only** for matching password hashes in a way that is compatible with HaveIBeenPwned. It is not used for encryption or storage. All operations are done client-side and the password is never exposed.

## Getting Started

```bash
# Clone the repository
git clone git@github.com:Toky245/ScanPass.git
cd ScanPass

# Install dependencies
npm install

# Run the app
npm run dev
