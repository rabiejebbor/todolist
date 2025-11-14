# GitHub AI Coding Agent - n8n Workflows

🤖 **Automated code generation and PR creation using n8n and Claude AI**

This repository contains two n8n workflows that automate the process of creating features and pull requests on GitHub using AI agents powered by Claude (Anthropic).

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Workflows](#workflows)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Architecture](#architecture)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## 🎯 Overview

These workflows transform feature tickets into production-ready code and GitHub pull requests automatically. Simply provide a feature description, and the AI agent will:

1. Analyze your repository structure
2. Generate appropriate code changes
3. Create a new branch
4. Commit the changes
5. Open a pull request

## ✨ Features

- **Automated Code Generation**: Claude AI generates production-ready code based on feature descriptions
- **Repository Analysis**: Understands your codebase structure and conventions
- **Branch Management**: Automatically creates feature branches
- **Pull Request Creation**: Opens PRs with comprehensive descriptions
- **MCP Integration** (Advanced version): Uses Model Context Protocol for enhanced code understanding
- **Customizable**: Easy to modify prompts and workflows to match your needs

## 📦 Workflows

### 1. **Basic Workflow** (`github-ai-coding-agent-workflow.json`)
- Simpler setup with fewer dependencies
- Direct Claude AI integration
- Best for: Straightforward code generation tasks

### 2. **Advanced Workflow with MCP** (`github-ai-coding-agent-with-mcp-workflow.json`)
- Enhanced with Model Context Protocol
- Can read existing files and search code
- Better understanding of repository context
- Best for: Complex codebases requiring deep analysis

---

## 🔧 Prerequisites

### Required

1. **n8n Instance** (v1.0.0 or higher)
   - Self-hosted or cloud instance
   - [Installation guide](https://docs.n8n.io/hosting/)

2. **Anthropic API Key**
   - Sign up at [Anthropic Console](https://console.anthropic.com/)
   - Create an API key

3. **GitHub Personal Access Token**
   - Create at [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
   - Required scopes: `repo` (full control of private repositories)

### Optional (for MCP version)

4. **MCP Server Setup**
   - GitHub MCP server for enhanced repository access
   - [MCP Setup Guide](https://www.modelcontextprotocol.io/)

---

## 📥 Installation

### Step 1: Import Workflow into n8n

1. Open your n8n instance
2. Click on **"Workflows"** in the sidebar
3. Click **"Add Workflow"** → **"Import from File"**
4. Select either:
   - `github-ai-coding-agent-workflow.json` (basic version)
   - `github-ai-coding-agent-with-mcp-workflow.json` (advanced version)
5. Click **"Import"**

### Step 2: Install Required Nodes

n8n should automatically detect and install required nodes. If not, manually install:

```bash
# For basic workflow
npm install @n8n/n8n-nodes-langchain

# For MCP workflow (additional)
npm install @n8n/n8n-nodes-langchain
```

For community MCP node (alternative):
```bash
# Set environment variable
export N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true

# Install community package
n8n-community-install n8n-nodes-mcp
```

---

## ⚙️ Configuration

### 1. Set Up Anthropic API Credentials

1. In n8n, go to **"Credentials"** → **"Add Credential"**
2. Search for **"Anthropic API"**
3. Enter your API key
4. Save with a memorable name (e.g., "Anthropic Claude API")

### 2. Set Up GitHub Authentication

1. In n8n, go to **"Credentials"** → **"Add Credential"**
2. Search for **"Header Auth"** (for HTTP Request nodes)
3. Configure:
   - **Name**: `Authorization`
   - **Value**: `token YOUR_GITHUB_TOKEN`
4. Save as "GitHub API Token"

### 3. Update Workflow Nodes

#### Basic Workflow:

1. Open the imported workflow
2. Click on **"Anthropic Chat Model - Claude"** node
3. Select your Anthropic credential
4. Click on each **"HTTP Request"** node (4 nodes total):
   - Get Repository Info
   - Get Base Branch SHA
   - Create New Branch
   - Commit File to Branch
   - Create Pull Request
5. For each, set **Authentication** → **Generic Credential Type** → **Header Auth** → Select "GitHub API Token"

#### Advanced Workflow (MCP):

Follow the same steps as Basic, plus:

6. Click on **"MCP - GitHub Read File"** and **"MCP - GitHub Search Code"** nodes
7. Configure MCP server connection (see MCP Setup section below)

### 4. MCP Server Setup (Advanced Workflow Only)

To enable MCP tools:

1. Install GitHub MCP server:
```bash
npm install -g @modelcontextprotocol/server-github
```

2. Configure MCP server in n8n:
   - Server name: `github`
   - Connection type: `stdio` or `http`
   - Command: Path to MCP server executable

3. Ensure environment variable is set:
```bash
export N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
```

---

## 🚀 Usage

### Input Parameters

When executing the workflow, provide the following inputs:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `feature_ticket` | Description of the feature to implement | "Add user authentication with JWT tokens" |
| `repo_owner` | GitHub repository owner/organization | "your-username" |
| `repo_name` | Repository name | "my-awesome-project" |
| `base_branch` | Base branch for the PR (default: main) | "main" or "develop" |

### Execution Methods

#### Method 1: Manual Trigger (Default)

1. Open the workflow in n8n
2. Click **"Execute Workflow"**
3. Provide input in JSON format:
```json
{
  "feature_ticket": "Add a REST API endpoint for user profile updates",
  "repo_owner": "your-username",
  "repo_name": "my-api-project",
  "base_branch": "main"
}
```
4. Click **"Execute"**

#### Method 2: Webhook Trigger (Optional)

Replace the "Manual Trigger" node with a "Webhook" node to create an API endpoint:

1. Delete the **"Manual Trigger"** node
2. Add a **"Webhook"** node
3. Set **HTTP Method** to `POST`
4. Set **Path** to `/github-ai-agent`
5. Activate the workflow
6. Send POST requests:

```bash
curl -X POST https://your-n8n-instance.com/webhook/github-ai-agent \
  -H "Content-Type: application/json" \
  -d '{
    "feature_ticket": "Implement user search functionality",
    "repo_owner": "your-username",
    "repo_name": "my-project",
    "base_branch": "main"
  }'
```

#### Method 3: Schedule (Optional)

Add a **"Schedule Trigger"** to automatically process tickets from an issue tracker or database.

---

## 🏗️ Architecture

### Workflow Flow

```
┌─────────────────┐
│  Manual Trigger │
│   or Webhook    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Set Input Params│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Get Repo Info   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Get Branch SHA   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Prepare Context  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   AI Agent      │◄─── Anthropic Claude
│  (with MCP)     │◄─── MCP Tools (optional)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Parse AI Response│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Create Branch    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Split Files     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Commit Files    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Aggregate Commits│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Create PR      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Success Response │
└─────────────────┘
```

### Key Components

1. **Input Processing**: Validates and prepares repository information
2. **Repository Analysis**: Fetches metadata, structure, and context
3. **AI Agent**: Claude generates code based on context and requirements
4. **Git Operations**: Creates branch and commits changes via GitHub API
5. **PR Creation**: Opens pull request with detailed description

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Authentication Errors

**Problem**: `401 Unauthorized` or `403 Forbidden`

**Solutions**:
- Verify GitHub token has correct scopes (`repo`)
- Check token hasn't expired
- Ensure Header Auth is configured correctly in ALL HTTP Request nodes
- Token format should be: `token ghp_xxxxxxxxxxxx` (note the "token" prefix)

#### 2. AI Agent Not Responding

**Problem**: Workflow hangs at AI Agent node

**Solutions**:
- Check Anthropic API key is valid
- Verify you have API credits
- Increase timeout in AI Agent node settings
- Check if you're hitting rate limits

#### 3. Invalid JSON Response

**Problem**: Parse AI Response fails

**Solutions**:
- Adjust AI Agent prompt to emphasize JSON-only output
- Lower temperature in Claude model settings (0.2 - 0.3)
- Add output parser to AI Agent node
- Check Claude's response in execution log

#### 4. MCP Tools Not Working

**Problem**: MCP nodes fail to connect

**Solutions**:
- Verify `N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true` is set
- Check MCP server is running
- Verify server name matches in MCP Tool nodes
- Review MCP server logs for connection errors

#### 5. Branch Already Exists

**Problem**: `422 Unprocessable Entity` when creating branch

**Solutions**:
- The workflow generates unique branch names with timestamps
- If it still occurs, check for clock skew
- Modify branch naming logic in "Generate Branch Name" node

#### 6. File Commit Errors

**Problem**: Failed to commit files

**Solutions**:
- Ensure file paths don't start with `/`
- Verify base64 encoding is working
- Check file size limits (GitHub has 100MB limit)
- Ensure branch exists before committing

---

## 🎯 Best Practices

### 1. Feature Ticket Writing

Write clear, detailed feature descriptions:

**Good**:
```
Add user authentication with JWT tokens:
- Implement login/logout endpoints
- Create middleware for token validation
- Add refresh token mechanism
- Include error handling for expired tokens
```

**Bad**:
```
Add auth
```

### 2. Repository Preparation

- Ensure repository has clear structure
- Add README with architecture overview
- Document coding conventions
- Include existing tests as examples

### 3. Prompt Engineering

Customize the AI Agent prompt for your needs:

- Add specific coding standards
- Include testing requirements
- Specify documentation format
- Add security considerations

### 4. Review AI-Generated Code

**Always review PRs before merging**:
- Check for security vulnerabilities
- Verify tests are comprehensive
- Ensure code follows conventions
- Test functionality locally

### 5. Cost Management

- Set `maxTokens` appropriately (4000-8000)
- Use temperature 0.2-0.3 for code generation
- Consider using Claude Sonnet 3.5 for best price/performance
- Monitor Anthropic API usage

### 6. Error Handling

Add error handling nodes:
- Email notifications on failure
- Slack/Discord alerts
- Retry logic for API calls
- Logging to external service

---

## 🔐 Security Considerations

### API Keys and Tokens

- **Never commit** API keys or tokens to version control
- Use n8n's credential management system
- Rotate tokens regularly
- Use separate tokens for development and production

### Code Review

AI-generated code should be treated like any other code:
- **Mandatory code review** before merging
- Run security scans (e.g., Snyk, SonarQube)
- Verify dependencies are legitimate
- Check for common vulnerabilities (SQL injection, XSS, etc.)

### Repository Access

- Use tokens with minimal required permissions
- Consider using GitHub Apps instead of personal tokens
- Implement branch protection rules
- Require PR reviews even for AI-generated code

---

## 📊 Advanced Customizations

### Add Code Review Step

Insert after "Create Pull Request":

1. Add **GitHub** node
2. Configure to request reviews from team members
3. Connect to Create Pull Request node

### Integrate with Issue Tracking

Replace Manual Trigger with:

1. **GitHub Trigger** - Listen for new issues with specific label
2. Extract issue description
3. Pass to AI Agent
4. Comment on issue with PR link

### Add Testing

After file commits, before PR creation:

1. Add **Git** node to clone repository
2. Add **Execute Command** node to run tests
3. Only create PR if tests pass
4. Comment test results on PR

### Multi-Repository Support

Modify workflow to:

1. Accept array of repositories
2. Add **Loop** node to process each
3. Aggregate results
4. Send summary report

---

## 📚 Additional Resources

### n8n Documentation
- [n8n Docs](https://docs.n8n.io/)
- [AI Agent Node](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/)
- [Workflow Templates](https://n8n.io/workflows/)

### Anthropic Claude
- [Claude API Docs](https://docs.anthropic.com/)
- [Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering)
- [Claude Pricing](https://www.anthropic.com/pricing)

### Model Context Protocol (MCP)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [MCP GitHub Server](https://github.com/modelcontextprotocol/servers)
- [n8n MCP Integration](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolmcp/)

### GitHub API
- [GitHub REST API](https://docs.github.com/en/rest)
- [Creating Pull Requests](https://docs.github.com/en/rest/pulls/pulls)
- [Git Database API](https://docs.github.com/en/rest/git)

---

## 🤝 Contributing

Improvements and suggestions are welcome! Common enhancement areas:

- Additional programming language support
- More sophisticated error handling
- Integration with other AI models
- Support for monorepos
- Enhanced testing capabilities

---

## 📝 License

These workflows are provided as-is for educational and commercial use. Feel free to modify and distribute.

---

## ⚠️ Disclaimer

This tool generates code using AI. While Claude is highly capable, always:
- Review generated code carefully
- Test thoroughly before deploying
- Follow your organization's security policies
- Monitor API costs
- Comply with rate limits

AI-generated code should be treated as a starting point, not a finished product.

---

## 🆘 Support

### Issues and Questions

- n8n Community: [community.n8n.io](https://community.n8n.io)
- Anthropic Support: [support.anthropic.com](https://support.anthropic.com)
- GitHub API Issues: [GitHub Community](https://github.community)

### Example Configurations

Check the `examples/` directory for:
- Sample feature tickets
- Input JSON templates
- Custom prompt variations
- Integration examples

---

## 🎉 Success Stories

After setup, you can:

- Transform Jira/Linear tickets into PRs automatically
- Generate boilerplate code for new features
- Create API endpoints from specifications
- Implement bug fixes from issue descriptions
- Generate tests for existing code

---

**Happy Automating! 🚀**

Built with ❤️ using n8n and Claude AI
