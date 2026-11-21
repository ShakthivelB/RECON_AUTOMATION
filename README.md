# 🔍 Bash Recon Automation

**Automated Bug Bounty Reconnaissance Tool**

A Bash-based reconnaissance automation script designed to streamline the initial stages of authorized bug bounty hunting and web application security testing.

The tool combines subdomain enumeration, live host detection, historical URL collection, active crawling, endpoint discovery, parameter extraction, and JavaScript intelligence gathering into a single workflow.

---

## 🚀 Features

| Feature | Tool | Description |
|---|---|---|
| Subdomain Enumeration | Subfinder | Discovers subdomains of the target domain |
| Live Host Detection | httpx | Identifies accessible HTTP/HTTPS hosts |
| HTTP Metadata | httpx | Collects status codes, page titles and technologies |
| Historical URL Discovery | GAU | Collects URLs from historical sources |
| Active Crawling | Katana | Crawls live hosts and discovers JavaScript-related URLs |
| Endpoint Filtering | grep | Identifies interesting application endpoints |
| JavaScript Discovery | grep | Identifies JavaScript files from collected URLs |
| JavaScript Downloading | curl | Downloads discovered JavaScript files |
| Parallel Extraction | xargs | Processes multiple JavaScript files concurrently |
| Secret Pattern Detection | grep | Identifies potential hardcoded secrets |
| Parameter Discovery | grep | Extracts parameter names from JavaScript files |

## 🫸🏻 USAGE

```
./recon -h
./recon --help
./recon -v
./recon --version
```

## 🛠️ Requirements

### Required tools

- [Subfinder](https://github.com/projectdiscovery/subfinder)
- [httpx](https://github.com/projectdiscovery/httpx)
- [GAU](https://github.com/lc/gau)
- [Katana](https://github.com/projectdiscovery/katana)
- curl
- grep
- awk
- sort
- xargs
- find

### Operating System

Recommended:
- Kali Linux
- Ubuntu
- Linux Mint
- Other Linux distributions with Bash

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/bash-recon-automation.git

cd bash-recon-automation
```

### 2. Install dependencies

Install Go-based reconnaissance tools:

```bash
go install github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest

go install github.com/projectdiscovery/httpx/cmd/httpx@latest

go install github.com/projectdiscovery/katana/cmd/katana@latest

go install github.com/lc/gau/v2/cmd/gau@latest
```

Install system dependencies:

```bash
sudo apt update

sudo apt install curl grep gawk coreutils findutils -y
```

Ensure your Go binary directory is available in PATH:

```bash
export PATH="$PATH:$(go env GOPATH)/bin"
```

### 3. Make the script executable

```bash
chmod +x recon.sh
```

## ⚡ Usage

Run the reconnaissance script by providing a target domain:

```bash
./recon.sh example.com
```

The script automatically performs the following operations:

1. Subdomain enumeration
2. Live host detection
3. HTTP metadata collection
4. Historical URL collection
5. Active crawling
6. URL merging and deduplication
7. Interesting endpoint filtering
8. JavaScript discovery and downloading
9. Parallel JavaScript intelligence extraction
10. Parameter discovery
11. Final reconnaissance summary

## 🔬 JavaScript Intelligence Extraction

One of the main features is automated JavaScript analysis using `xargs`.

Downloaded JavaScript files are processed concurrently to identify:

- API endpoints
- Interesting application routes
- Potential hardcoded secrets
- Authentication-related keywords
- Administrative and internal route patterns
- URL parameter names

The extraction process uses:

```bash
find "$OUT/js_downloads" -type f -name '*.js' -print0 |
xargs -0 -r -P 10 -I {} sh -c '
    grep -Eo "YOUR_REGEX" "$1" || true
' _ {}
```

`-P 10` allows up to 10 concurrent processes.

This improves processing efficiency when handling multiple JavaScript files.

**Note:** Regex-based extraction is a starting point. It does not guarantee detection of all endpoints or secrets, particularly in minified or obfuscated JavaScript.

## 📁 Output Structure

Every scan generates a timestamped output directory.

```text
recon_example.com_YYYYMMDD_HHMMSS/
│
├── subdomains.txt
├── live.txt
├── live_details.txt
│
├── gau.txt
├── katana.txt
├── all_urls.txt
│
├── interesting_endpoints.txt
├── parameter_urls.txt
├── js_files.txt
│
├── js_downloads/
│   ├── js_1.js
│   ├── js_2.js
│   └── js_3.js
│
└── js_analysis/
    ├── endpoints_raw.txt
    ├── endpoints.txt
    ├── potential_secrets.txt
    ├── interesting_strings.txt
    └── parameters.txt
```

### Important output files

| File | Purpose |
|---|---|
| `subdomains.txt` | Discovered subdomains |
| `live.txt` | Responsive web hosts |
| `live_details.txt` | HTTP metadata |
| `gau.txt` | Historical URLs |
| `katana.txt` | Crawled URLs |
| `all_urls.txt` | Combined and deduplicated URLs |
| `interesting_endpoints.txt` | Potentially interesting endpoints |
| `parameter_urls.txt` | URLs containing query parameters |
| `js_files.txt` | Discovered JavaScript URLs |
| `endpoints.txt` | Extracted JavaScript endpoints |
| `potential_secrets.txt` | Potential sensitive assignments |
| `interesting_strings.txt` | Interesting JavaScript strings |
| `parameters.txt` | Extracted JavaScript parameter names |

## 🧠 Reconnaissance Workflow

```text
          TARGET DOMAIN
                |
                v
           SUBFINDER
                |
                v
             HTTPX
                |
                v
        LIVE HOST DETECTION
                |
          +-----+-----+
          |           |
          v           v
         GAU        KATANA
          |           |
          +-----+-----+
                |
                v
       URL MERGE & DEDUP
                |
                v
       ENDPOINT FILTERING
                |
                v
       JAVASCRIPT DISCOVERY
                |
                v
        JS FILE DOWNLOAD
                |
                v
       PARALLEL PROCESSING
             XARGS
                |
       +--------+--------+
       |        |        |
       v        v        v
   ENDPOINTS  SECRETS  PARAMETERS
       |        |        |
       +--------+--------+
                |
                v
         FINAL REPORT
```

## ⚙️ Configuration

The JavaScript extraction stage currently uses:

```bash
-P 10
```

This means up to 10 concurrent extraction processes.

You can adjust the value based on your system resources:

| Value | Usage |
|---|---|
| `-P 2` | Low-resource systems |
| `-P 5` | Moderate processing |
| `-P 10` | Higher parallel processing |
| `-P 20` | Systems with sufficient resources |

More parallel processes do not always mean faster execution.


## Make it as a global tool


You can install your recon script globally in Linux Mint/Kali using /usr/local/bin. This is the recommended location for manually installed scripts (rather than /usr/bin, which is generally managed by the package manager).

* Navigate to the directory containing recon and run below command 

```
    sudo install -m 755 ./recon /usr/local/bin/recon
```

## 🤖 AI-Assisted Reconnaissance Analysis

Bash Recon Automation also supports AI-assisted security analysis through a dedicated Markdown agent instruction file.

The `RECON_ANALYSIS_AGENT_GUIDE.md` file provides instructions to AI coding agents such as:

- Claude Code
- Gemini CLI
- Cursor
- GitHub Copilot
- Other AI-powered coding agents

The guide instructs the agent to analyse the generated reconnaissance output and produce a structured security intelligence report.

### 🔍 What can the AI agent analyse?

| Analysis | Description |
|---|---|
| Interesting URLs | Identifies sensitive routes, authentication pages, admin panels and debug endpoints |
| API Endpoints | Extracts and categorises discovered API routes |
| JavaScript Analysis | Reviews downloaded JS files for API routes, configurations and application logic |
| Exposed API Keys | Identifies potential hardcoded API keys and credentials |
| Secret Detection | Reviews potential tokens, client secrets and sensitive values |
| Parameter Analysis | Identifies interesting URL and JavaScript parameters |
| Prioritisation | Creates a prioritised manual review queue |
| Reporting | Generates a consolidated Markdown reconnaissance report |

### 📄 Agent Configuration

The repository includes:

```text
RECON_ANALYSIS_AGENT_GUIDE.md
```

This file acts as the analysis instruction guide for the AI coding agent.

It defines:
- What files to analyse
- How to correlate URLs and JavaScript findings
- How to identify potential exposed credentials
- How to distinguish false positives from meaningful findings
- How to prioritise interesting endpoints
- How to generate the final analysis report

### ⚡ How to use

**Step 1:** Run the reconnaissance tool.

```bash
./recon.sh example.com
```

**Step 2:** Open the generated reconnaissance output folder in your preferred AI coding agent.

**Step 3:** Provide the agent with this instruction:

```text
Read RECON_ANALYSIS_AGENT_GUIDE.md.

Analyse the complete reconnaissance output directory.

Review all available files, including:
- Subdomains
- Live hosts
- Historical URLs
- Katana crawl results
- Interesting endpoints
- JavaScript files
- Extracted API endpoints
- Potential secrets
- URL and JavaScript parameters

Correlate the findings and identify the most
interesting items for authorised security testing.

Pay particular attention to:
1. Sensitive API endpoints
2. Authentication and admin routes
3. Potential exposed API keys and secrets
4. Interesting JavaScript functionality
5. Internal-looking endpoints
6. Interesting parameters

Generate a detailed report named:

RECON_ANALYSIS_REPORT.md

Include evidence, source filenames, confidence,
false-positive assessment and prioritised findings.

Do not modify the original recon files.
Do not expose complete secret values.
```

**Step 4:** Review the generated report.

The agent should create:

```text
analysis_report/
├── RECON_ANALYSIS_REPORT.md
├── interesting_urls.md
├── api_endpoints.md
├── javascript_analysis.md
├── potential_secrets_redacted.md
└── evidence/
    └── findings_index.md
```

**Important:** AI-generated findings are leads for manual investigation, not confirmed vulnerabilities. The analysis guide requires offline analysis by default and prohibits unauthorised credential use or testing.

---

## 🔮 Future Improvements

- [ ] Integrate AI-powered reconnaissance analysis directly into the workflow.
- [ ] Automate report generation using local LLMs or coding agents.
- [ ] Add JSON export for AI-based analysis.
- [ ] Build an interactive HTML reconnaissance dashboard.
- [ ] Add vulnerability correlation and finding deduplication.

## 🔮 Future Improvements

Planned enhancements:

- [ ] Integrate `xnLinkFinder` for deeper JavaScript endpoint extraction.
- [ ] Integrate `SecretFinder` for additional secret detection.
- [ ] Add JavaScript de-minification.
- [ ] Add automatic endpoint validation using httpx.
- [ ] Add directory and content discovery.
- [ ] Add Nuclei vulnerability scanning.
- [ ] Add screenshot collection.
- [ ] Generate HTML reconnaissance reports.
- [ ] Add configurable concurrency and timeout options.
- [ ] Add notification support.

## 🔐 Legal Disclaimer

This tool is intended for educational purposes and authorized security testing.

- Only scan domains you own or have explicit permission to test.
- Follow the scope and rules of the applicable bug bounty program.
- Do not access, use, or disclose discovered credentials without authorization.
- The tool does not guarantee vulnerability discovery.
- The author is not responsible for unauthorized or unlawful use.

## 👨‍💻 Author

**Shakthivel B**

Cybersecurity | Web Application Security | Bug Bounty | Reconnaissance

GitHub: YOUR_GITHUB_PROFILE

LinkedIn: YOUR_LINKEDIN_PROFILE

---

⭐ If you find this project useful, consider giving it a star!