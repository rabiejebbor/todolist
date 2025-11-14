# GitHub AI Coder - n8n Workflow

## ✅ Universal Workflow (Works on ALL n8n Installations)

**File**: `github-ai-coder-universal.json`

This workflow uses **ONLY built-in core n8n nodes** - no additional packages required!

### Why This Workflow is Different

❌ **OLD approach** (didn't work):
- Used `@n8n/n8n-nodes-langchain` nodes
- Required special LangChain package installation
- Showed "Install this node" errors
- Only worked on some n8n installations

✅ **NEW approach** (works everywhere):
- Uses **only core n8n nodes**:
  - Manual Trigger
  - Set (Edit Fields)
  - HTTP Request
  - Code
  - Aggregate
- **No package installation needed**
- Works on n8n Cloud, self-hosted, Docker - everywhere!
- Calls Claude API directly via HTTP Request

---

## 🚀 What This Workflow Does

### Input:
```json
{
  "feature_ticket": "Add user authentication with JWT tokens",
  "repo_owner": "your-github-username",
  "repo_name": "your-repository",
  "base_branch": "main"
}
```

### Process:
1. **Fetches** GitHub repository information
2. **Gets** current branch SHA
3. **Calls** Claude 3.5 Sonnet API with context
4. **Generates** production-ready code
5. **Creates** a new branch
6. **Commits** all generated files
7. **Opens** a pull request

### Output:
- ✅ Pull request URL
- ✅ PR number
- ✅ Files changed count
- ✅ Ready for code review!

---

## 📦 Workflow Structure

**13 Nodes Total**:

1. **When clicking 'Test workflow'** - Manual trigger
2. **Input Parameters** - Configure your inputs
3. **GitHub: Get Repository** - Fetch repo info
4. **GitHub: Get Branch SHA** - Get base commit
5. **Prepare AI Context** - Build Claude prompt
6. **Claude: Generate Code** - Call Anthropic API
7. **Parse AI Response** - Extract JSON response
8. **GitHub: Create Branch** - Create feature branch
9. **Split Files for Commit** - Process each file
10. **GitHub: Commit File** - Commit to branch
11. **Wait for All Commits** - Aggregate results
12. **GitHub: Create Pull Request** - Open PR
13. **Success! PR Created** - Format output

---

## ⚙️ Setup Instructions

### Step 1: Import Workflow

1. In n8n, go to **Workflows** → **Add Workflow** → **Import from File**
2. Select `github-ai-coder-universal.json`
3. Click **Import**
4. ✅ All nodes should load without errors!

### Step 2: Configure Anthropic Credential

Since we use HTTP Request, configure Header Auth:

1. Go to **Credentials** → **Add Credential**
2. Search for **"Header Auth"**
3. Fill in:
   - **Name**: `x-api-key`
   - **Value**: `YOUR_ANTHROPIC_API_KEY`
   - ⚠️ **NO "Bearer" or "token" prefix** - just your API key: `sk-ant-xxxxx`
4. Save as: `Anthropic API Key`

### Step 3: Configure GitHub Credential

1. Go to **Credentials** → **Add Credential**
2. Search for **"Header Auth"**
3. Fill in:
   - **Name**: `Authorization`
   - **Value**: `token YOUR_GITHUB_TOKEN`
   - ⚠️ **Include "token" prefix**: `token ghp_xxxxx`
4. Save as: `GitHub API Token`

### Step 4: Connect Credentials to Nodes

#### Connect Anthropic Credential:

Find this node:
- **Claude: Generate Code**

For this node:
1. Click the node
2. Scroll to **"Authentication"**
3. Select **"Generic Credential Type"** → **"Header Auth"**
4. Select `Anthropic API Key`

#### Connect GitHub Credential:

Find these nodes:
- **GitHub: Get Repository**
- **GitHub: Get Branch SHA**
- **GitHub: Create Branch**
- **GitHub: Commit File**
- **GitHub: Create Pull Request**

For each node:
1. Click the node
2. Scroll to **"Authentication"**
3. Select **"Generic Credential Type"** → **"Header Auth"**
4. Select `GitHub API Token`

### Step 5: Configure Input

Click on the **"Input Parameters"** node and set your defaults:

```javascript
{
  "feature_ticket": "Add a Hello World function",
  "repo_owner": "your-github-username",
  "repo_name": "test-repo",
  "base_branch": "main"
}
```

### Step 6: Test!

1. Click **"Test workflow"**
2. The workflow should execute successfully
3. Check your GitHub repository for the new PR!

---

## 🎯 Usage Examples

### Simple Feature
```json
{
  "feature_ticket": "Add a utility function that formats dates as YYYY-MM-DD",
  "repo_owner": "username",
  "repo_name": "utils-library",
  "base_branch": "main"
}
```

### API Endpoint
```json
{
  "feature_ticket": "Create a REST API endpoint POST /api/users that accepts name and email, validates input, and saves to database",
  "repo_owner": "username",
  "repo_name": "backend-api",
  "base_branch": "develop"
}
```

### React Component
```json
{
  "feature_ticket": "Build a reusable Button component in React with TypeScript, accepting props for variant (primary, secondary), size (small, medium, large), and onClick handler",
  "repo_owner": "username",
  "repo_name": "component-library",
  "base_branch": "main"
}
```

### Bug Fix
```json
{
  "feature_ticket": "Fix the memory leak in WebSocket connection by properly cleaning up event listeners on component unmount",
  "repo_owner": "username",
  "repo_name": "realtime-app",
  "base_branch": "main"
}
```

---

## 🐛 Troubleshooting

### "Install this node to use it"

**This should NOT happen** with this workflow! If you see this:
- Make sure you imported `github-ai-coder-universal.json`
- Check n8n version (requires 1.0.0+)
- Try restarting n8n

### "401 Unauthorized" from Claude API

**Problem**: Anthropic credential not configured correctly

**Solution**:
1. Check your API key is valid at [console.anthropic.com](https://console.anthropic.com/)
2. Verify Header Auth credential format:
   - Name: `x-api-key`
   - Value: `sk-ant-api03-xxxxxxxxxxxx` (your actual API key, NO prefix)
3. Make sure credential is connected to **"Claude: Generate Code"** node

### "401 Unauthorized" from GitHub

**Problem**: GitHub token format incorrect

**Solution**:
1. Check Header Auth credential format:
   - Name: `Authorization`
   - Value: `token ghp_xxxxxxxxxxxx` (MUST include "token" prefix)
2. Verify token has `repo` scope
3. Check token hasn't expired

### "Invalid JSON" from Claude

**Problem**: Claude returned markdown instead of pure JSON

**Solution**: The workflow handles this automatically! But if it still fails:
1. Check the **"Parse AI Response"** node
2. The code strips markdown code blocks
3. You may need to adjust the temperature (currently 0.3)

### Workflow Stops at "Claude: Generate Code"

**Problem**: Request timeout or rate limit

**Solution**:
1. Check you have API credits at [console.anthropic.com](https://console.anthropic.com/)
2. Increase timeout in HTTP Request node settings
3. Check if you hit rate limits (wait and retry)

### No Files Generated

**Problem**: Claude didn't return files array

**Solution**:
1. Make your feature ticket more specific
2. Check Claude's response in the workflow execution log
3. The prompt may need adjustment for your use case

---

## 💡 Customization

### Change AI Model

Edit the **"Claude: Generate Code"** node:

```json
{
  "model": "claude-3-5-sonnet-20241022"  // Current (recommended)
}
```

Available models:
- `claude-3-5-sonnet-20241022` - Best balance (recommended)
- `claude-3-5-haiku-20241022` - Fastest, cheapest
- `claude-3-opus-20240229` - Most powerful, expensive

### Adjust Creativity

In the **"Claude: Generate Code"** node, change `temperature`:

```json
{
  "temperature": 0.3  // Lower = more deterministic (0.0 - 1.0)
}
```

- `0.0-0.3` - More consistent, less creative (good for code)
- `0.4-0.7` - Balanced
- `0.8-1.0` - More creative, less predictable

### Customize Prompt

Edit the **"Prepare AI Context"** node's JavaScript code:

```javascript
const systemPrompt = `You are an expert software engineer...

// Add your customizations:
- Follow our company's coding standards
- Use TypeScript for all files
- Include comprehensive JSDoc comments
- Write unit tests using Jest
- Follow our error handling patterns
`;
```

### Add Notifications

After the **"Success! PR Created"** node, add:
- Slack node
- Email node
- Discord webhook

Example Slack message:
```
New PR created by AI! 🤖
{{ $('Success! PR Created').item.json.pr_url }}
```

---

## 📊 Performance

**Typical Execution**:
- Time: 15-45 seconds
- API Calls: 7-8 (5 GitHub + 1 Claude + aggregates)
- Cost: ~$0.04-$0.08 per execution
- Files Generated: 1-10 files

**Limits**:
- Claude API: 4,000-100,000 requests/day (depending on tier)
- GitHub API: 5,000 requests/hour
- Max tokens: 8,000 (configurable)

---

## 🔐 Security

### Best Practices

1. **Never commit credentials** to version control
2. **Use n8n's credential system** - they're encrypted
3. **Rotate tokens regularly** (every 90 days)
4. **Use separate tokens** for dev/prod
5. **Review ALL AI-generated PRs** before merging
6. **Enable branch protection** on main/master
7. **Require code reviews** for AI PRs

### GitHub Token Permissions

Minimum required scope:
- ✅ `repo` - Full control of private repositories

For public repos only:
- ✅ `public_repo` - Access to public repositories

---

## 📚 Documentation

- **Full Guide**: [../README-N8N-AI-AGENT.md](../README-N8N-AI-AGENT.md)
- **Setup Instructions**: [../SETUP-GUIDE.md](../SETUP-GUIDE.md)
- **Architecture**: [../ARCHITECTURE.md](../ARCHITECTURE.md)
- **Examples**: [../example-input.json](../example-input.json)

---

## ✅ Success Checklist

Before using in production:

- [ ] Workflow imports without errors
- [ ] All nodes show up correctly (no missing nodes)
- [ ] Anthropic credential configured and tested
- [ ] GitHub credential configured on all 5 GitHub nodes
- [ ] Test execution completes end-to-end
- [ ] Pull request created successfully in GitHub
- [ ] Generated code is reasonable quality
- [ ] You understand the workflow flow
- [ ] Prompts customized for your codebase
- [ ] Team trained on reviewing AI PRs

---

## 🆘 Need Help?

### Documentation
- [Setup Guide](../SETUP-GUIDE.md) - Detailed setup instructions
- [Full README](../README-N8N-AI-AGENT.md) - Complete documentation
- [Examples](../example-input.json) - Usage examples

### Community
- **n8n Community**: [community.n8n.io](https://community.n8n.io)
- **n8n Discord**: Join via n8n website
- **Anthropic Support**: [support.anthropic.com](https://support.anthropic.com)

### Common Questions

**Q: Does this work on n8n Cloud?**
A: Yes! It works on Cloud, self-hosted, Docker - everywhere.

**Q: Do I need to install any packages?**
A: No! This workflow uses only core built-in nodes.

**Q: Can I use a different AI model?**
A: Yes! Replace the Claude API call with OpenAI, Google, or any other LLM API.

**Q: Can it read existing files?**
A: Not in this version. For that, you'd need to add GitHub file reading before the AI call.

**Q: Is it production-ready?**
A: Yes, but ALWAYS review AI-generated code before merging!

---

## 🎉 Ready to Start!

1. **Import** the workflow
2. **Configure** two credentials (Anthropic + GitHub)
3. **Connect** credentials to nodes
4. **Test** with a simple feature
5. **Enjoy** automated coding! 🚀

---

**This workflow actually works! No more "Install this node" errors!** 💪
