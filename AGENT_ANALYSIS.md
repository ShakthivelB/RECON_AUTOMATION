# Recon Output Analysis Guide for Coding Agents

## Purpose

This document instructs a coding agent to analyse the output of **Bash
Recon Automation** and produce a clear, evidence-based reconnaissance
report.

The goal is to identify and prioritise:

-   Interesting URLs and potentially sensitive routes
-   API endpoints and application functionality
-   JavaScript files and client-side application behaviour
-   Potentially exposed secrets, API keys, tokens, and credentials
-   Parameters and inputs that may be useful for authorised security
    testing
-   Duplicates, false positives, and items requiring manual verification

This is an analysis guide, not permission to test every discovered
asset. Only analyse and validate assets that are within the target's
explicitly authorised scope.

------------------------------------------------------------------------

## 1. Input directory and expected files

The agent should first locate the recon output directory supplied by the
user. Do not assume a fixed directory name.

Expected structure:

``` text
recon_<target>_<timestamp>/
├── subdomains.txt
├── live.txt
├── live_details.txt
├── gau.txt
├── katana.txt
├── all_urls.txt
├── interesting_endpoints.txt
├── parameter_urls.txt
├── js_files.txt
├── js_downloads/
│   ├── js_1.js
│   ├── js_2.js
│   └── ...
└── js_analysis/
    ├── endpoints_raw.txt
    ├── endpoints.txt
    ├── potential_secrets.txt
    ├── interesting_strings.txt
    └── parameters.txt
```

Some files or directories may be absent or empty. Report missing inputs
and continue with the available evidence. Never invent findings to fill
gaps.

### Initial inventory

Record:

-   Target domain and scan timestamp, if available from the directory
    name or files
-   Number of discovered subdomains
-   Number of live hosts
-   Number of collected URLs
-   Number of interesting URLs
-   Number of JavaScript URLs
-   Number of successfully downloaded JavaScript files
-   Number of extracted endpoints, parameter names, and potential secret
    matches

Check for empty files, duplicate entries, malformed URLs, and download
failures where evidence is available.

------------------------------------------------------------------------

## 2. Scope and asset handling

Before analysing findings:

1.  Identify the authorised root domain and any explicitly provided
    in-scope hosts.
2.  Classify each discovered hostname as likely in-scope, out-of-scope,
    or uncertain.
3.  Do not assume that every subdomain discovered by passive enumeration
    is authorised.
4.  Do not follow links, make requests, authenticate, submit forms, or
    interact with discovered services unless the user has explicitly
    authorised that activity and the action is within scope.
5.  Treat third-party domains, CDNs, analytics providers, identity
    providers, cloud storage, and vendor APIs as separate assets
    requiring scope verification.

The default task is **offline analysis of the supplied files**. Do not
perform live validation or use discovered credentials.

------------------------------------------------------------------------

## 3. Interesting URL analysis

Review `all_urls.txt`, `interesting_endpoints.txt`,
`parameter_urls.txt`, `gau.txt`, and `katana.txt`.

Identify and classify URLs into useful categories:

  -----------------------------------------------------------------------
  Category                Examples of patterns    Why it may matter
  ----------------------- ----------------------- -----------------------
  Authentication          `/login`, `/signin`,    Authentication and
                          `/logout`, `/auth/`,    session workflows
                          `/oauth/`, `/sso/`      

  Account and user        `/user/`, `/users/`,    User-specific
                          `/account/`,            functionality and
                          `/profile/`             access control

  Administration          `/admin/`, `/manage/`,  Administrative
                          `/dashboard/`,          interfaces
                          `/console/`             

  API                     `/api/`, `/v1/`,        Application data and
                          `/v2/`, `/graphql`      backend operations

  File handling           `/upload`, `/download`, File processing and
                          `/export`, `/import`    data exposure review

  Search and filtering    `/search`, `/filter`,   User-controlled query
                          `/query`                inputs

  Redirect and callback   `/redirect`,            Redirect and OAuth flow
                          `/callback`, `/return`, review
                          `next=`, `redirect=`    

  Debug and diagnostics   `/debug`, `/test`,      Potentially sensitive
                          `/status`, `/health`,   operational information
                          `/swagger`, `/openapi`  

  Infrastructure          `staging`, `dev`,       Non-production or
                          `test`, `internal`,     internal-looking assets
                          `sandbox`               

  Static resources        `.js`, `.json`, `.map`, Client-side logic and
                          `.config`               possible metadata
  -----------------------------------------------------------------------

These patterns are leads, not proof of a vulnerability.

For each high-interest URL, record:

-   Full URL (redact sensitive query values)
-   Hostname
-   Source file(s): GAU, Katana, merged URLs, or another input
-   Category
-   Relevant path and parameter names
-   Why it was selected
-   Scope status: in-scope / out-of-scope / uncertain
-   Priority for manual review
-   Evidence and confidence

Do not label an endpoint as vulnerable merely because its path contains
`admin`, `debug`, `token`, or similar text.

### URL deduplication and normalisation

-   Remove exact duplicates.
-   Preserve meaningful path differences.
-   Normalise host casing and default ports where safe.
-   Do not discard query parameter names.
-   Do not merge URLs if doing so would hide distinct parameter
    combinations or path behaviour.
-   Redact possible secrets in query strings before placing URLs in the
    report.

------------------------------------------------------------------------

## 4. API endpoint analysis

Analyse `js_analysis/endpoints.txt`, `js_analysis/endpoints_raw.txt`,
and the URL lists.

Group endpoints by:

-   Host
-   API version
-   Functional area
-   HTTP path
-   Query parameter names, if present
-   Source JavaScript file, where traceable

Look for endpoint families such as:

``` text
/api/
/api/v1/
/api/v2/
/graphql
/auth/
/oauth/
/users/
/accounts/
/admin/
/internal/
```

For each endpoint, include:

  Field             Description
  ----------------- ----------------------------------------------
  Endpoint          Discovered URL or path
  Host              Hostname associated with the endpoint
  Source            JavaScript filename or input list
  Category          Authentication, user, admin, file, API, etc.
  Parameters        Names only; do not expose secret values
  Scope             In-scope, out-of-scope, or uncertain
  Review priority   High, medium, or low
  Confidence        High, medium, or low
  Notes             Why it may deserve review

### Important distinctions

-   A URL string in JavaScript does not prove the endpoint is live.
-   A route name does not prove that the route is accessible.
-   A client-side route does not necessarily map to a backend API.
-   A discovered API path does not establish its HTTP method,
    authentication requirements, or access controls.
-   Do not guess HTTP methods or request bodies unless the source code
    explicitly shows them.

------------------------------------------------------------------------

## 5. JavaScript file analysis

Analyse every downloaded file under `js_downloads/`. Use `js_files.txt`
to map downloaded files back to their original URLs where possible.

For each JavaScript file, inspect for:

1.  API base URLs and route definitions
2.  Authentication and session handling logic
3.  OAuth, SSO, and identity-provider configuration
4.  Access-token or API-key references
5.  Feature flags and environment configuration
6.  Internal-looking hostnames and service names
7.  Source map references (`sourceMappingURL`)
8.  WebSocket URLs (`ws://` or `wss://`)
9.  GraphQL endpoints and operation names
10. File upload, download, and export functionality
11. Client-side role or permission checks
12. Debug settings and verbose error handling
13. Third-party integrations and SDK configuration
14. Sensitive information accidentally embedded in client-side code

### JavaScript mapping

Create a mapping table:

  ----------------------------------------------------------------------------
  Local file    Original JS                Size Analysis      Notable findings
                URL                             status        
  ------------- ------------- ----------------- ------------- ----------------
  `js_1.js`     Original URL,         File size Analysed /    Short
                if known                        failed        evidence-based
                                                              summary

  ----------------------------------------------------------------------------

If the mapping between `js_1.js` and its original URL cannot be
established, state that it is unknown. Do not infer the mapping from
file order unless the download process or logs prove it.

### Source maps

Identify references ending in `.map` or `sourceMappingURL`.

Report:

-   Referencing JavaScript file
-   Source map URL or path
-   Whether the source map file is actually present in the supplied data
-   Whether source paths or source content appear to be included

Do not claim a source map is publicly accessible unless it was actually
obtained and included in the evidence.

### Minified or obfuscated files

If a file is minified:

-   Use formatting or static parsing only if the required tool is
    available.
-   Preserve the original file.
-   Record any derived/beautified copy separately.
-   Do not claim that obfuscated content was fully analysed if it could
    not be interpreted.

------------------------------------------------------------------------

## 6. Potential secrets and exposed API keys

Review `js_analysis/potential_secrets.txt` and inspect the relevant
original JavaScript context to reduce false positives.

Look for possible:

-   API keys
-   Access tokens
-   Client secrets
-   Bearer tokens
-   Basic-auth credentials
-   Cloud service credentials
-   Private keys
-   Signing secrets
-   Database connection strings
-   Webhook secrets
-   Internal service credentials

### Secret classification

Classify each match:

  -----------------------------------------------------------------------
  Classification                      Meaning
  ----------------------------------- -----------------------------------
  Confirmed secret-like value         The code contains a value that
                                      strongly resembles a credential,
                                      but validity is unverified

  Possible secret                     A suspicious assignment or
                                      token-like string needs manual
                                      review

  Public client identifier            An identifier designed to be
                                      visible to clients; not
                                      automatically a secret

  Placeholder/example                 A sample, dummy, test, or
                                      documentation value

  False positive                      A non-secret value matched by a
                                      broad pattern

  Unknown                             Insufficient evidence to classify
  -----------------------------------------------------------------------

A string named `apiKey` is not automatically a secret. Some browser-side
API keys are intentionally public and protected by domain restrictions,
quotas, or limited permissions. Determine the likely credential type and
context before assigning severity.

### Required evidence for each match

Record:

-   Finding ID
-   File name
-   Original JavaScript URL, if known
-   Line number, if available
-   Secret type suspected
-   Short contextual snippet with the value redacted
-   Confidence
-   Whether it appears to be a placeholder
-   Recommended owner review or remediation

**Never print complete credentials, private keys, tokens, passwords, or
secret values in the report.** Use a safe redaction such as:

``` text
sk_live_****************
Bearer eyJhbGci... [REDACTED]
client_secret = [REDACTED]
```

Do not send secrets to online scanners, public paste sites, external AI
services, or third-party validation APIs. Do not attempt to use, replay,
or authenticate with discovered credentials. Do not test whether a key
works unless the asset owner has explicitly authorised a safe validation
procedure.

### Severity guidance

-   **Critical:** Strong evidence of a highly privileged private key or
    credential exposed, with impact established by the owner or an
    explicitly authorised assessment.
-   **High:** Strong evidence of a sensitive credential exposure, but
    privilege or impact is not yet established.
-   **Medium:** Potential credential or sensitive configuration
    requiring verification.
-   **Low / Informational:** Public client identifier, placeholder, test
    value, or non-sensitive configuration.
-   **Unconfirmed:** Insufficient evidence to assign a reliable
    severity.

Do not assign Critical or High based only on a regex match.

------------------------------------------------------------------------

## 7. Parameter analysis

Review `parameter_urls.txt` and `js_analysis/parameters.txt`.

Group parameter names by URL and functionality.

Pay attention to names such as:

-   `id`, `user`, `account`, `tenant`
-   `redirect`, `return`, `next`, `callback`
-   `url`, `uri`, `path`, `file`
-   `search`, `query`, `filter`, `sort`
-   `token`, `code`, `state`
-   `role`, `permission`
-   `debug`, `environment`

These names can help prioritise manual review for access control, input
handling, redirect handling, and information exposure.

Do not assume a vulnerability based on a parameter name. Do not include
sensitive parameter values in the report.

------------------------------------------------------------------------

## 8. Prioritisation

Prioritise findings based on evidence, scope, and potential impact.

  -----------------------------------------------------------------------
  Priority                            Examples
  ----------------------------------- -----------------------------------
  P1 -- Immediate review              Strong evidence of a private
                                      credential, sensitive internal
                                      endpoint, or critical exposure

  P2 -- High review                   Authentication routes, privileged
                                      API families, sensitive file
                                      handling, or potentially sensitive
                                      configuration

  P3 -- Normal review                 User/account APIs, parameterised
                                      routes, redirect/callback
                                      functionality

  P4 -- Informational                 Public assets, generic routes,
                                      public client identifiers,
                                      duplicates, and low-confidence
                                      matches
  -----------------------------------------------------------------------

Priority is a triage recommendation, not a vulnerability severity
rating. Keep confidence and severity separate.

------------------------------------------------------------------------

## 9. Required final report

Create a Markdown report named:

``` text
RECON_ANALYSIS_REPORT.md
```

Use this structure:

``` markdown
# Reconnaissance Analysis Report

## 1. Executive Summary
- Target
- Scan timestamp
- Scope assumptions
- Main observations
- Important limitations

## 2. Scan Inventory
- Subdomains
- Live hosts
- Total URLs
- Interesting URLs
- JavaScript URLs
- Downloaded JavaScript files
- Extracted endpoints
- Potential secret matches

## 3. Scope Review
- In-scope assets
- Out-of-scope assets
- Uncertain assets

## 4. Interesting URLs
- Categorised URL findings
- Evidence
- Priority
- Confidence

## 5. API Endpoint Analysis
- Endpoint inventory
- Endpoint groups
- Source files
- Parameters
- Manual review recommendations

## 6. JavaScript Analysis
- File inventory
- Original URL mapping
- API routes
- Authentication logic
- Environment/configuration findings
- Source map references
- Third-party integrations

## 7. Potential Secrets and API Keys
- Redacted evidence only
- Suspected credential type
- File and line reference
- Confidence
- False-positive assessment
- Safe remediation advice

## 8. Parameter Analysis
- Interesting parameter names
- Associated URLs
- Manual review recommendations

## 9. Prioritised Review Queue
- P1
- P2
- P3
- P4

## 10. Limitations and False Positives
- Missing files
- Failed downloads
- Minified/obfuscated files
- Unverified endpoints
- Regex limitations
- Scope uncertainty

## 11. Recommended Next Steps
- Safe manual review tasks
- Owner verification
- Remediation recommendations

## 12. Evidence Appendix
- Source file
- Line number or exact evidence location
- Redacted snippet
```

------------------------------------------------------------------------

## 10. Quality requirements

The coding agent must follow these rules:

-   Analyse the supplied recon output, not an imagined scan.
-   Never fabricate endpoints, secrets, source URLs, HTTP methods, line
    numbers, or vulnerability findings.
-   Cite the exact local source file for every finding.
-   Include line numbers when they can be reliably obtained.
-   Clearly distinguish observed facts, inferred observations, and
    recommendations.
-   Deduplicate findings without losing their source references.
-   Redact all sensitive values.
-   Mark unverified endpoints as unverified.
-   Mark uncertain scope explicitly.
-   Explain false positives and confidence.
-   Do not modify or delete the original recon output.
-   Write generated reports to a separate analysis output directory.
-   If no findings exist for a category, explicitly state that no
    matching evidence was found in the supplied files.

## 11. Suggested output layout

Keep the original recon results unchanged and create a separate report
directory:

``` text
recon_<target>_<timestamp>/
│
├── [Original recon files]
│
└── analysis_report/
    ├── RECON_ANALYSIS_REPORT.md
    ├── interesting_urls.md
    ├── api_endpoints.md
    ├── javascript_analysis.md
    ├── potential_secrets_redacted.md
    └── evidence/
        └── findings_index.md
```

The individual Markdown files are optional. The consolidated
`RECON_ANALYSIS_REPORT.md` is mandatory.

------------------------------------------------------------------------

## Final instruction to the coding agent

Perform a thorough, offline, evidence-based analysis of the supplied
Bash Recon Automation output. Correlate URLs, endpoints, JavaScript
files, parameters, and potential secrets across all available files.
Prioritise genuinely interesting findings, explain why each matters, and
provide exact evidence references.

The most important deliverable is a useful, readable reconnaissance
report that helps an authorised security tester decide what to manually
review next.

**Do not claim that a vulnerability or exposed credential is confirmed
unless the available evidence actually establishes it.**
