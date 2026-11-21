# Reconnaissance Analysis Report

**Analysis mode:** Offline review of supplied files only. No network requests or credential use were performed.

## 1. Executive Summary

- **Apparent target:** `vulnhub.com`, inferred from the directory contents and supplied host lists. No scan directory timestamp or explicit authorization/scope statement was supplied.
- **Scope assumption:** `vulnhub.com` and its named subdomains are candidates for owner scope verification only. They are **not confirmed in scope** by this dataset. Third-party domains, IP literals, and `localhost` are uncertain or out of scope unless separately authorized.
- **Main observations:** 21,105 merged URLs across 641 hostnames; 6,829 entries in the interesting-URL file, which includes extensive third-party and unrelated URLs. Three hosts are listed live. JavaScript analysis artifacts contain 12 unique endpoint strings, primarily third-party analytics or library references. The secret scan output is a single 88 KB minified-code line, not a set of discrete secrets.
- **Limitations:** No scan timestamp, authorization statement, download log, or mapping from downloaded file names to original JavaScript URLs. The extracted endpoints are not evidence of live routes. Nothing in this analysis establishes a vulnerability or valid credential.

## 2. Scan Inventory

Counts below are line counts; duplicate counts are exact-line duplicates. The original URL lists contain no exact duplicate lines.

| Input | Entries | Notes |
|---|---:|---|
| `subdomains.txt` | 5 | 5 unique |
| `live.txt` | 3 | 3 unique |
| `live_details.txt` | 3 | HTTP metadata for the listed live hosts |
| `all_urls.txt` | 21,105 | 21,105 unique; 641 distinct parsed hostnames |
| `interesting_endpoints.txt` | 6,829 | 6,829 unique; broad pattern output includes unrelated hosts |
| `parameter_urls.txt` | 3,568 | 3,568 unique |
| `js_files.txt` | 20 | 20 unique source URL entries |
| Downloaded JavaScript | 14 | Files `js_1.js`–`js_13.js` except `js_14.js`–`js_16.js`, plus `js_17.js`; 14 files present, 6 listed URLs have no evident corresponding local file |
| `js_analysis/endpoints.txt` | 12 | 12 unique extracted strings |
| `js_analysis/parameters.txt` | 30 | 30 unique parameter tokens |
| `js_analysis/potential_secrets.txt` | 1 line | 88,062 bytes; line is minified source rather than a structured list of secret matches |

The scan directory name has no recognizable target/timestamp format. `live.txt` lists `staging.vulnhub.com`, `www.vulnhub.com`, and `download.vulnhub.com`; all have `[200]` in `live_details.txt`.

## 3. Scope Review

The files do not state the authorized root domain or program scope. The following is an evidence-based *candidate classification*, not an authorization decision.

- **Candidate owner assets; scope uncertain pending owner confirmation:** `vulnhub.com`, `www.vulnhub.com`, `staging.vulnhub.com`, `download.vulnhub.com`, `blog.vulnhub.com`, `ctf-team.vulnhub.com`, `testphp.vulnhub.com`. The subdomain list names five hosts; URL data also includes additional VulnHub subdomains.
- **Out of scope unless explicitly included:** third-party hosts such as `google-analytics.com`, `googletagmanager.com`, `facebook.com`, `twitter.com`, `youtube.com`, `cloudflare.com`, CDNs, and linked documentation/vendor sites.
- **Uncertain / do not test based on these files:** unrelated domains found in historical/crawled URLs, IP-literal URLs (including `192.168.126.162`), and `localhost` URLs. Their presence does not establish ownership or authorization.

## 4. Interesting URLs

The “interesting” file is a broad matcher, not a curated list. Representative entries below were selected for manual review based on their path or host; none were validated online.

| URL (query values omitted) | Category / source | Scope | Priority / confidence | Reason |
|---|---|---|---|---|
| `https://www.vulnhub.com/api/v1/entries/` | API; `interesting_endpoints.txt` and `js_analysis/endpoints.txt` | Uncertain | P2 / Medium | API-like path on apparent target. The JavaScript extraction may instead reflect an external string; route and controls are unverified. |
| `https://staging.vulnhub.com/` | Staging infrastructure; `live_details.txt` | Uncertain | P2 / Medium | Listed as a live host with status 200; verify that staging is authorized and intended to be in scope. |
| `http://192.168.126.162/hotelcal/admin`, `/oop/admin`, `/zeuscart/admin` | Admin-looking paths; `interesting_endpoints.txt` | Uncertain, likely unrelated | P4 / Low | Private IP and paths occur in collected content; no ownership relationship established. Do not connect or test. |
| `http://localhost/admin` | Admin-looking path; `interesting_endpoints.txt` | Out of scope / artifact | P4 / Low | Localhost string in collected data is not a target host. |
| `https://www.google-analytics.com/gtm/js?id=` and `https://www.googletagmanager.com/gtag/js?id=` | Third-party analytics; endpoint extraction | Out of scope unless separately authorized | P4 / High (string observed) | Vendor script/configuration references, not VulnHub backend APIs. |

No matching authentication, file-handling, or debug/docs paths were found by the focused path-pattern review of `interesting_endpoints.txt`. This only describes that list and pattern set; it is not proof such routes do not exist.

## 5. API Endpoint Analysis

`js_analysis/endpoints.txt` contains these 12 unique strings. All were found as strings; existence, method, authentication, and accessibility are unverified.

| Endpoint string | Category / source | Scope | Priority / confidence | Notes |
|---|---|---|---|---|
| `https://ampcid.google.com/v1/publisher:getClientId` | Third-party analytics; `js_analysis/endpoints.txt` | Out of scope | P4 / High | Vendor URL string. |
| `https://getbootstrap.com/)` | Documentation URL; same source | Out of scope | P4 / High | Trailing `)` indicates extraction artifact. |
| `https://github.com/twbs/bootstrap/blob/master/LICENSE)` | Documentation URL; same source | Out of scope | P4 / High | Trailing `)` indicates extraction artifact. |
| `https://github.com/twbs/bootstrap/graphs/contributors)` | Documentation URL; same source | Out of scope | P4 / High | Trailing `)` indicates extraction artifact. |
| `https://popper.js.org/)` | Documentation URL; same source | Out of scope | P4 / High | Trailing `)` indicates extraction artifact. |
| `https://stats.g.doubleclick.net/j/collect` | Analytics; same source | Out of scope | P4 / High | Third-party collection endpoint. |
| `https://tagassistant.google.com/` | Analytics tooling; same source | Out of scope | P4 / High | Third-party URL. |
| `https://www.google.%/ads/ga-audiences` | Analytics; same source | Out of scope | P4 / High | Malformed/templated hostname. |
| `https://www.google-analytics.com/debug/bootstrap?id=` | Analytics; same source | Out of scope | P4 / High | Third-party URL; parameter name `id`. |
| `https://www.google-analytics.com/gtm/js?id=` | Analytics; same source | Out of scope | P4 / High | Third-party URL; parameter name `id`. |
| `https://www.google.com/ads/ga-audiences` | Analytics; same source | Out of scope | P4 / High | Third-party URL. |
| `https://www.googletagmanager.com/gtag/js?id=` | Analytics; same source | Out of scope | P4 / High | Third-party URL; parameter name `id`. |

`endpoints_raw.txt` has 12 lines and 573 bytes; it is the raw extractor evidence. `endpoints.txt` has 12 lines and 507 bytes, with the strings reproduced above. The extracted endpoint set is dominated by analytics and documentation URLs; no confirmed first-party API family was established from these files.

## 6. JavaScript Analysis

Downloaded files and sizes are listed below. The provided `js_files.txt` has 20 URLs, but no download manifest ties a URL to a local filename. Therefore the mapping is **unknown** for every local file; file order was not used to infer it.

| Local file | Size | Review notes |
|---|---:|---|
| `js_1.js` | 88,145 B | Two-line, minified library-like content; no source map marker detected. Broad `password` token match is not a credential finding. |
| `js_2.js` | 60,010 B | Minified library-like content; contains a `sourceMappingURL` reference. Corresponding map file is not present in supplied tree. |
| `js_3.js` | 1,239 B | Small; no notable credential/configuration markers found by static keyword review. |
| `js_4.js` | 880 B | Small; no notable credential/configuration markers found by static keyword review. |
| `js_5.js` | 4,688 B | 156 lines; no notable credential/configuration markers found by static keyword review. |
| `js_6.js` | 52,310 B | 105 lines; strings include third-party analytics URLs consistent with endpoint output. |
| `js_7.js` | 1,239 B | Small; no notable credential/configuration markers found by static keyword review. |
| `js_8.js` | 1,239 B | Small; no notable credential/configuration markers found by static keyword review. |
| `js_9.js` | 1,239 B | Small; no notable credential/configuration markers found by static keyword review. |
| `js_10.js` | 1,239 B | Small; no notable credential/configuration markers found by static keyword review. |
| `js_11.js` | 1,239 B | Small; no notable credential/configuration markers found by static keyword review. |
| `js_12.js` | 880 B | 30 lines; no notable credential/configuration markers found by static keyword review. |
| `js_13.js` | 4,688 B | 156 lines; no notable credential/configuration markers found by static keyword review. |
| `js_17.js` | 880 B | 30 lines; no notable credential/configuration markers found by static keyword review. |

Static keyword review found no clear first-party authentication flow, OAuth configuration, WebSocket URL, GraphQL operation, or privileged client-side role check in the supplied extracted summaries. This is not a full semantic audit: minification and the absence of a reliable URL mapping limit attribution. `js_analysis/interesting_strings.txt` is present (153,167 bytes), but its broad extracted strings require manual contextual interpretation.

**Source maps:** one `sourceMappingURL` marker was detected in `js_2.js`; the downloaded tree contains no `.map` file. The referenced URL/path and any embedded source content were not established from the available mapping, so accessibility and source disclosure are unknown.

## 7. Potential Secrets and API Keys

No discrete credential finding can be substantiated from the supplied secret scan output. `js_analysis/potential_secrets.txt` consists of one 88,062-byte line beginning with minified jQuery-style code (`2:!function...`), rather than separately delimited match records. This strongly suggests a regex/extraction false positive or malformed output. Static review also found the word `password` in `js_1.js`, but no credential assignment was established; it is likely library text. `js_2.js` contains an `apiKey` token match in minified library content, but no value/context supports classifying it as a credential. **No secret values are reproduced here.**

- **Classification:** likely false-positive/malformed extractor output; no confirmed or possible secret-like value isolated.
- **Confidence:** Medium for “no discrete match in supplied scan output”; low for absence of any credential across all code, given minification and limited mapping.
- **Safe action:** have the owner inspect the original source context and rerun a context-aware local scanner. If a real credential is identified, revoke/rotate it and review its intended restrictions; do not try it against a service.

## 8. Parameter Analysis

`js_analysis/parameters.txt` contains 30 unique tokens, many generic or analytics-related (`id`, `key`, `l`, `null`, `src`, `state`-like candidate names). `parameter_urls.txt` contains 3,568 unique URL lines. Because this list includes third-party and historical URLs, parameter names should be interpreted only alongside host and URL context; values have been omitted from this report.

The corpus includes examples of query-bearing functionality on the apparent target and external sites, but no strong first-party redirect, file, token, or access-control parameter finding was established from the supplied summary files. Review `parameter_urls.txt` filtered to owner-confirmed hosts before prioritizing inputs. Parameter names alone do not imply a vulnerability.

## 9. Prioritised Review Queue

- **P1:** None supported by the supplied evidence.
- **P2:** Confirm scope for `staging.vulnhub.com`; owner-review the apparent `/api/v1/entries/` route if it is in scope. Both are leads only.
- **P3:** After scope confirmation, review first-party parameterized URLs from `parameter_urls.txt`, retaining path and parameter-name combinations while redacting values.
- **P4:** Treat third-party analytics/documentation references, generic extracted strings, admin-looking URLs on private IP/localhost, and the malformed secret-scan output as informational or likely noise.

## 10. Limitations and False Positives

- No explicit authorization, scope list, scan timestamp, download log, or URL-to-JavaScript filename mapping is supplied.
- 6 of 20 listed JavaScript URLs have no corresponding local file by count; the evidence does not identify which URL downloads failed. Present files are 14, not proof of 14 successful unique URL downloads.
- The `.map` file referenced by a downloaded JS file is absent from the supplied data; public accessibility was not tested.
- Several JavaScript files are minified; analysis was static and keyword-oriented, not a complete deminification or semantic review.
- URL lists include hundreds of hosts, external content, analytics, documentation, and likely historical links. The `interesting_endpoints.txt` filter has substantial false-positive noise.
- The potential-secrets output is one unusually large minified line; regex limitations and line formatting prevent meaningful per-match classification.
- URL strings and extracted routes are unverified; no HTTP methods, status, access controls, or vulnerability claims can be inferred.
- No malformed URL count was asserted beyond the visibly malformed endpoint string `https://www.google.%/ads/ga-audiences` and extractor-added trailing parentheses in some library/documentation URLs.

## 11. Recommended Next Steps

1. Obtain the authorized scope and scan timestamp from the asset owner or scan operator before testing any host.
2. Ask for the original downloader manifest/log to map each `js_N.js` to its source URL and identify missing downloads.
3. Re-run local secret extraction with match-level context, then inspect only redacted snippets in the corresponding original JS. Rotate any owner-confirmed credential exposure.
4. Filter URL and parameter inventories to confirmed first-party hosts; deduplicate while preserving distinct paths and parameter-name combinations.
5. Have the owner review the staging host and `/api/v1/entries/` route manually within the approved assessment process. Do not infer access or vulnerability from the route name.

## 12. Evidence Appendix

All references below are relative to `EXAMPLE_O/P/` unless otherwise noted. Line numbers refer to the supplied files.

| Evidence | Location | Redacted/summary evidence |
|---|---|---|
| Apparent target host set | `subdomains.txt`, lines 1–5 | Includes `download.vulnhub.com`, `staging.vulnhub.com`, `www.vulnhub.com`, `blog.vulnhub.com`, `ctf-team.vulnhub.com`. |
| Live host metadata | `live_details.txt`, lines 1–3 | Three VulnHub hosts reported with status `[200]`; titles/technologies recorded in source. |
| Broad URL corpus | `all_urls.txt`, lines 1–21,105 | 21,105 unique lines; 641 parsed hostnames. |
| Interesting-URL noise and samples | `interesting_endpoints.txt`, lines 1–6,829 | Contains both target URLs and unrelated external/private/local URLs. |
| API-like route | `js_analysis/endpoints.txt`, line 1 | `https://ampcid.google.com/v1/publisher:getClientId`; remaining lines are listed in Section 5. |
| Secret-scan artifact | `js_analysis/potential_secrets.txt`, line 1 | 88,062-byte minified line; no credential value copied. |
| Parameter tokens | `js_analysis/parameters.txt`, lines 1–30 | 30 unique entries; generic names require URL context. |
| Source map marker | `js_downloads/js_2.js`, line 7 | `sourceMappingURL` comment present; map file absent. |
| Broad password keyword | `js_downloads/js_1.js`, line 2 | Minified library text includes a `password` keyword; no credential assignment established. |
| JS source URL candidates | `js_files.txt`, lines 1–20 | 20 source URLs; no mapping to local filenames is provided. |
