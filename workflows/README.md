# n8n Workflows for GitHub AI Coding Agent

This directory contains the working n8n workflow files for the GitHub AI Coding Agent.

## 📦 Available Workflows

### 1. **Simple Workflow** (Recommended for Getting Started)

**File**: `github-ai-coder-simple.json`

- ✅ Easy to set up
- ✅ Works with basic n8n installation
- ✅ Uses direct Anthropic API calls
- ✅ Perfect for learning and simple tasks
- ❌ Cannot read existing repository files

**Use when**: You're getting started, have simple feature requests, or don't need AI to read existing code.

---

### 2. **Advanced Workflow** (Production-Ready)

**File**: `github-ai-coder-advanced.json`

- ✅ Can read existing repository files
- ✅ Searches codebase for patterns
- ✅ Uses AI Agent with tools
- ✅ Better context understanding
- ✅ Smarter code generation
- ⚠️ Requires LangChain nodes installed

**Use when**: You need AI to understand existing code, work with complex codebases, or want production-quality results.

---

### 3. **Tool Implementations** (For Advanced Workflow)

#### `tool-read-github-file.json`
- Implements GitHub file reading capability
- Used by advanced workflow to read existing files
- Helps AI understand current code structure

#### `tool-search-github-code.json`
- Implements GitHub code search
- Finds similar implementations and patterns
- Helps AI follow repository conventions

**Note**: These tools are referenced by the advanced workflow. You can import them separately for better organization, or they can work inline within the advanced workflow.

---

## 🚀 Quick Import Instructions

1. **Choose a workflow** (Simple or Advanced)
2. **Download the JSON file**
3. **In n8n**:
   - Go to Workflows → Add Workflow → Import from File
   - Select the downloaded JSON
   - Click Import
4. **Configure credentials** (see [SETUP-GUIDE.md](../SETUP-GUIDE.md))
5. **Test the workflow**

---

## 📋 What's Included in Each Workflow

### Simple Workflow Nodes:
1. Manual Trigger
2. Input: Feature Ticket (configure your inputs)
3. GitHub: Get Repository
4. GitHub: Get Branch SHA
5. Prepare AI Prompt
6. Call Claude API
7. Parse AI Response
8. GitHub: Create Branch
9. Split Files
10. GitHub: Commit File
11. Wait for All Commits
12. GitHub: Create Pull Request
13. Output: PR Created

**Total**: 13 nodes

### Advanced Workflow Nodes:
1. Manual Trigger
2. Input Parameters
3. Get Repository Info
4. Get File Structure
5. Get Branch SHA
6. Prepare Context
7. AI Agent (with tools)
8. Claude 3.5 Sonnet (AI model)
9. Tool: Read GitHub File
10. Tool: Search Code
11. Tool: List Files
12. Parse AI Output
13. Create Branch
14. Split Files
15. Commit File
16. Aggregate Commits
17. Create Pull Request
18. Success Output

**Total**: 18 nodes (15 main + 3 tool nodes)

---

## ⚙️ Configuration Required

### For All Workflows:

1. **Anthropic API Credential**
   - Type: Anthropic API
   - Get key from: [console.anthropic.com](https://console.anthropic.com/)

2. **GitHub API Credential**
   - Type: Header Auth
   - Format: `token ghp_xxxxxxxxxxxx`
   - Get token from: [GitHub Settings](https://github.com/settings/tokens)

3. **Input Configuration**
   - Edit the "Input" node to set defaults
   - Or provide values when executing

### For Advanced Workflow Only:

4. **LangChain Nodes**
   - Pre-installed on n8n Cloud
   - Self-hosted: Install `@n8n/n8n-nodes-langchain`

---

## 💡 Workflow Comparison

| Feature | Simple Workflow | Advanced Workflow |
|---------|----------------|-------------------|
| Setup Difficulty | Easy ⭐ | Medium ⭐⭐⭐ |
| Code Quality | Good | Excellent |
| Context Awareness | Basic | Deep |
| Can Read Files | ❌ | ✅ |
| Can Search Code | ❌ | ✅ |
| Execution Time | 15-30s | 30-60s |
| Cost per Run | ~$0.04 | ~$0.08 |
| Dependencies | Minimal | LangChain |
| Best For | Simple tasks | Production use |

---

## 🎯 How to Use

### Example Input:

```json
{
  "feature_ticket": "Add a user authentication middleware with JWT token validation and error handling for expired tokens",
  "repo_owner": "your-github-username",
  "repo_name": "your-repository",
  "base_branch": "main"
}
```

### Example Output:

- ✅ New branch created: `ai-agent/add-user-authentication-middleware-1705234567890`
- ✅ Files committed (1-10 files)
- ✅ Pull request opened with:
  - Professional title
  - Comprehensive description
  - Implementation plan
  - Testing instructions

---

## 🐛 Troubleshooting

### "Install this node to use it"

**Problem**: Required nodes not installed

**Solution**:
- For **n8n Cloud**: Nodes are pre-installed, contact support if issues
- For **self-hosted**: Install `@n8n/n8n-nodes-langchain`
  ```bash
  npm install @n8n/n8n-nodes-langchain
  ```

### "401 Unauthorized" Errors

**Problem**: Credentials not configured

**Solution**:
1. Check GitHub token format: `token ghp_xxxx` (include "token" prefix)
2. Verify Anthropic API key is valid
3. Ensure credentials are connected to ALL HTTP Request nodes

### Workflow Doesn't Execute

**Problem**: Nodes not connected properly

**Solution**:
1. Check all nodes have connections (lines between them)
2. Verify no red exclamation marks on nodes
3. Click "Test workflow" to see specific errors

---

## 📚 Documentation

- **Setup Guide**: [../SETUP-GUIDE.md](../SETUP-GUIDE.md) - Detailed setup instructions
- **Full Documentation**: [../README-N8N-AI-AGENT.md](../README-N8N-AI-AGENT.md) - Complete guide
- **Architecture**: [../ARCHITECTURE.md](../ARCHITECTURE.md) - Technical details
- **Examples**: [../example-input.json](../example-input.json) - Usage examples

---

## 🔄 Updates

### v2.0 (Latest) - 2025-01-14
- ✅ Fixed node type compatibility issues
- ✅ Simplified workflows for better reliability
- ✅ Added working tool implementations
- ✅ Improved error handling
- ✅ Better documentation

### v1.0 - 2025-01-14
- ⚠️ Initial release (deprecated)
- Had node compatibility issues

---

## 🆘 Need Help?

1. **Check the Setup Guide**: [SETUP-GUIDE.md](../SETUP-GUIDE.md)
2. **Review Examples**: [example-input.json](../example-input.json)
3. **Community**: [n8n Community Forums](https://community.n8n.io)
4. **Issues**: Open a GitHub issue

---

## ✅ Success Checklist

Before considering setup complete:

- [ ] Workflow imports without errors
- [ ] All nodes show as available (no missing nodes)
- [ ] Anthropic credential configured and tested
- [ ] GitHub credential configured on all HTTP nodes
- [ ] Test execution completes successfully
- [ ] Pull request created in GitHub
- [ ] Generated code looks reasonable
- [ ] You understand how to customize prompts

---

**Ready to start? Pick a workflow and follow the [Setup Guide](../SETUP-GUIDE.md)!** 🚀
