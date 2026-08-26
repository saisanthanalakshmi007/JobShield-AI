# Security Policy

## Overview

JobShield AI is an AI-assisted recruitment scam detection and awareness project developed for the OMNIKON National Hackathon 2026.

## Reporting a Security Issue

If you discover a security vulnerability or accidentally exposed credential, please report it privately to the project maintainers rather than publicly disclosing sensitive information.

## API Keys and Secrets

API keys and other credentials must never be committed to this repository.

The project uses environment variables for sensitive configuration.

The following files are intentionally excluded from version control:

- `.env`
- `.env.*`
- `backend/.env`
- Python virtual environments

## Responsible Disclosure

Please do not publish API keys, passwords, tokens, personal information, or other sensitive data in GitHub issues, pull requests, commits, or other public repository content.

## AI Safety

JobShield AI provides decision-support and awareness guidance. Its AI-generated analysis should not be treated as definitive proof that a job posting or employer is fraudulent.

Users should independently verify employers through official company websites and trusted recruitment channels.