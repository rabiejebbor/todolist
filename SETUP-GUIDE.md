# Complete Setup Guide - GitHub AI Coding Agent

## 🚀 Quick Start (10 Minutes)

This guide will help you set up the GitHub AI Coding Agent workflows in n8n.

---

## Prerequisites

Before starting, ensure you have:

- [ ] **n8n instance** running (version 1.0.0 or higher)
  - Self-hosted OR n8n Cloud
  - [Installation guide](https://docs.n8n.io/hosting/)

- [ ] **Anthropic API Key**
  - Sign up at [console.anthropic.com](https://console.anthropic.com/)
  - Navigate to API Keys and create a new key
  - Copy the key (starts with `sk-ant-...`)

- [ ] **GitHub Personal Access Token**
  - Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
  - Click "Generate new token (classic)"
  - Select scopes: `repo` (full control of private repositories)
  - Generate and copy the token (starts with `ghp_...`)

---

## Step 1: Install Required Packages (Self-Hosted Only)

If you're using **n8n Cloud**, skip to Step 2. All necessary nodes are pre-installed.

If you're using **self-hosted n8n**, you may need to install LangChain nodes:

### Check if LangChain is Installed

1. Open n8n
2. Try to add a new node
3. Search for "AI Agent" or "Anthropic Chat Model"
4. If you see them, you're good! Skip to Step 2.

### Install LangChain Nodes (if needed)

**For Docker installations:**

```bash
# Stop n8n container
docker stop n8n

# Start with package installation
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -e N8N_COMMUNITY_PACKAGES="@n8n/n8n-nodes-langchain" \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

**For npm installations:**

```bash
cd ~/.n8n/custom
npm install @n8n/n8n-nodes-langchain
# Restart n8n
```

---

## Step 2: Set Up Credentials

### A. Anthropic API Credential

1. In n8n, click **"Credentials"** in the left sidebar
2. Click **"Add Credential"**
3. Search for **"Anthropic API"**
4. Enter your API key
5. Click **"Test"** to verify
6. Click **"Save"**
7. Name it: `Anthropic Claude API`

✅ Anthropic configured!

### B. GitHub API Credential

We'll use Header Auth for GitHub API calls:

1. In n8n, go to **"Credentials"** → **"Add Credential"**
2. Search for **"Header Auth"**
3. Fill in:
   - **Name**: `Authorization`
   - **Value**: `token YOUR_GITHUB_TOKEN`
     - Replace `YOUR_GITHUB_TOKEN` with your actual token
     - **Important**: Include the word "token" before your token
     - Example: `token ghp_xxxxxxxxxxxxxxxxxxxx`
4. Click **"Save"**
5. Name it: `GitHub API Token`

✅ GitHub configured!

---

## Step 3: Import Workflows

### Choose Your Workflow

We provide two workflows:

#### **Option A: Simple Workflow** (Recommended for Getting Started)
- ✅ Easy setup
- ✅ Works with basic n8n installation
- ✅ No AI Agent complexity
- ✅ Uses direct Anthropic API calls
- ❌ No code reading capability

**File**: `workflows/github-ai-coder-simple.json`

#### **Option B: Advanced Workflow** (Recommended for Production)
- ✅ Can read existing repository files
- ✅ Searches codebase for patterns
- ✅ Better context understanding
- ✅ Smarter code generation
- ⚠️ Requires LangChain nodes
- ⚠️ Slightly more complex setup

**File**: `workflows/github-ai-coder-advanced.json`

### Import Steps

1. Download the workflow JSON file from the repository
2. In n8n, click **"Workflows"** in the sidebar
3. Click **"Add Workflow"** → **"Import from File"**
4. Select the downloaded JSON file
5. Click **"Import"**

✅ Workflow imported!

---

## Step 4: Configure the Workflow

### For Simple Workflow:

1. Open the imported workflow
2. Click on the **"Input: Feature Ticket"** node
3. Edit the "Set Values" to configure defaults:
   ```json
   {
     "feature_ticket": "Your default feature description",
     "repo_owner": "your-github-username",
     "repo_name": "your-repository-name",
     "base_branch": "main"
   }
   ```

4. Find all HTTP Request nodes that connect to GitHub:
   - **GitHub: Get Repository**
   - **GitHub: Get Branch SHA**
   - **GitHub: Create Branch**
   - **GitHub: Commit File**
   - **GitHub: Create Pull Request**

5. For each node:
   - Click the node
   - Scroll to **"Authentication"**
   - Select **"Generic Credential Type"**
   - Choose **"Header Auth"**
   - Select your `GitHub API Token` credential
   - Click outside to save

6. Click on the **"Call Claude API"** node:
   - Scroll to **"Authentication"**
   - Select **"Generic Credential Type"**
   - Choose **"Header Auth"**
   - Select your `Anthropic Claude API` credential

7. Click **"Save"** (top right)

✅ Simple workflow configured!

### For Advanced Workflow:

1. Follow steps 1-5 from Simple Workflow for GitHub nodes

2. Click on the **"Claude 3.5 Sonnet"** node:
   - In the **"Credential for Anthropic API"** dropdown
   - Select your `Anthropic Claude API` credential

3. **Important**: The advanced workflow uses Tool nodes
   - The **"Tool: Read GitHub File"**, **"Tool: Search Code"**, and **"Tool: List Files"** nodes reference sub-workflows
   - You can use these as-is (they're designed to work within the same workflow)
   - OR import the separate tool implementation workflows for better organization

4. Click **"Save"**

✅ Advanced workflow configured!

---

## Step 5: Test the Workflow

### Configure Test Input

1. Click on the **"Input Parameters"** or **"Input: Feature Ticket"** node
2. Click **"Execute Node"** to set test data
3. Or provide input when executing:

```json
{
  "feature_ticket": "Add a simple Hello World function in utils/hello.js that returns 'Hello, World!' when called",
  "repo_owner": "your-github-username",
  "repo_name": "test-repository",
  "base_branch": "main"
}
```

### Run the Workflow

1. Click **"Test workflow"** button (top right)
2. Click **"Execute Workflow"**
3. Watch the workflow execute!

**What should happen:**
- ✅ Fetches repository information
- ✅ Gets branch SHA
- ✅ Calls Claude AI to generate code
- ✅ Creates a new branch
- ✅ Commits the generated files
- ✅ Creates a pull request
- ✅ Shows PR URL in the output

### Check Your GitHub Repository

1. Go to your GitHub repository
2. Click **"Pull requests"**
3. You should see a new PR with:
   - 🤖 Title starting with "feat:" or similar
   - Branch name starting with "ai-agent/"
   - Generated code in the files
   - Comprehensive description

✅ It works!

---

## Troubleshooting

### Issue: "Install this node to use it"

**Problem**: LangChain nodes not available

**Solution**:
- If using **n8n Cloud**: Contact support, nodes should be pre-installed
- If using **self-hosted**: See Step 1 to install `@n8n/n8n-nodes-langchain`
- Restart n8n after installation

### Issue: "401 Unauthorized" from GitHub

**Problem**: GitHub token not configured correctly

**Solution**:
1. Check your Header Auth credential format:
   - Must be: `token ghp_xxxxxxxxxxxx`
   - Include the word "token" before your token
   - No extra spaces
2. Verify token has `repo` scope
3. Check token hasn't expired

### Issue: "401 Unauthorized" from Anthropic

**Problem**: Anthropic API key invalid or missing credits

**Solution**:
1. Verify API key at [console.anthropic.com](https://console.anthropic.com/)
2. Check you have API credits available
3. Ensure key is correctly entered in credential

### Issue: "Unprocessable Entity (422)" when creating branch

**Problem**: Branch already exists or base branch not found

**Solution**:
- The workflow generates unique branch names with timestamps
- If this occurs, wait a few seconds and try again
- Verify your `base_branch` exists (default is "main")

### Issue: "AI returns markdown instead of JSON"

**Problem**: AI response includes code blocks

**Solution**:
- The workflows include parsing logic to handle this
- If it still fails, check the "Parse AI Response" or "Parse AI Output" node
- The code strips markdown code blocks: ` ```json ` and ` ``` `

### Issue: "Rate limit exceeded"

**Problem**: Too many API calls

**Solution**:
- **GitHub**: 5,000 requests/hour limit
  - Wait an hour or use a different token
- **Anthropic**: Check your rate limits in console
  - Upgrade tier or wait for limit reset

### Issue: Workflow stops at AI Agent node

**Problem**: Infinite loop or no tool responses

**Solution**:
1. Check the AI Agent node timeout (default 60s)
2. Increase timeout in node settings
3. Simplify the feature ticket for testing
4. Verify Claude API credential is working

---

## Advanced Configuration

### Customize AI Prompts

#### Simple Workflow

Edit the **"Prepare AI Prompt"** node's JavaScript code:

```javascript
const systemPrompt = `You are an expert software engineer...

// Add your customizations here:
- Follow our coding standards: ...
- Use our testing framework: ...
- Include comprehensive error handling
`;
```

#### Advanced Workflow

Edit the **"AI Agent"** node's prompt:

1. Click the AI Agent node
2. Find the "Text" field under "Prompt"
3. Customize the instructions
4. Add specific requirements for your codebase

### Change AI Model

To use a different Claude model:

1. Find the model configuration
   - Simple: In "Call Claude API" node, change the "model" field
   - Advanced: In "Claude 3.5 Sonnet" node, change "Model"

2. Available models:
   - `claude-3-5-sonnet-20241022` (Recommended - best balance)
   - `claude-3-opus-20240229` (Most powerful, slower, expensive)
   - `claude-3-haiku-20240307` (Fastest, cheapest, less capable)

### Adjust Token Limits

To change maximum response length:

1. Find the model node or API call
2. Change `maxTokens` value:
   - Default: 8000
   - Minimum: 1024
   - Maximum: 200000 (Claude 3.5 Sonnet)

**Note**: Higher tokens = higher cost

### Add Notifications

Add a Slack/Discord/Email node after "Success Output":

1. Add new node after final node
2. Configure notification service
3. Include PR URL in message:
   ```
   New PR created: {{ $('Success Output').item.json.pr_url }}
   ```

---

## Production Deployment

### Environment Variables

For self-hosted n8n, set these environment variables:

```bash
# Required
N8N_BASIC_AUTH_USER=your_username
N8N_BASIC_AUTH_PASSWORD=your_secure_password

# Optional but recommended
N8N_HOST=your-n8n-domain.com
N8N_PROTOCOL=https
N8N_PORT=443

# For community packages (if needed)
N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
```

### Security Best Practices

1. **Never commit credentials** to version control
2. **Use n8n's credential management** - all credentials are encrypted
3. **Rotate tokens regularly** (every 90 days)
4. **Use separate tokens** for development and production
5. **Enable branch protection** on your main branch
6. **Require PR reviews** before merging AI-generated code

### Webhook Trigger (Optional)

To trigger via API instead of manual execution:

1. Replace "Manual Trigger" node with "Webhook" node
2. Set HTTP Method to POST
3. Set Path to `/github-ai-agent`
4. Activate the workflow
5. Call from external systems:

```bash
curl -X POST https://your-n8n-instance.com/webhook/github-ai-agent \
  -H "Content-Type: application/json" \
  -d '{
    "feature_ticket": "Add user authentication",
    "repo_owner": "username",
    "repo_name": "repository",
    "base_branch": "main"
  }'
```

---

## Maintenance

### Update Workflows

When new versions are released:

1. Export your current workflow (for backup)
2. Import the new version
3. Reconfigure credentials
4. Test before using in production

### Monitor Costs

Track API usage:

1. **Anthropic Console**: Monitor token usage and costs
2. **GitHub API**: Check rate limit usage
3. Set up budget alerts in Anthropic console

**Typical costs**:
- Simple feature: ~$0.03-$0.08
- Complex feature: ~$0.10-$0.20

### Backup

Regularly export and backup your workflows:

1. Go to Workflows
2. Click the workflow
3. Click menu (three dots)
4. Select "Download"
5. Save JSON file to version control (without credentials)

---

## Getting Help

### Documentation

- [Full Documentation](./README-N8N-AI-AGENT.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Example Inputs](./example-input.json)

### Community

- **n8n Community**: [community.n8n.io](https://community.n8n.io)
- **n8n Discord**: Join via n8n website
- **Anthropic Support**: [support.anthropic.com](https://support.anthropic.com)

### Common Questions

**Q: Can I use GPT-4 instead of Claude?**
A: Yes! Replace the Anthropic nodes with OpenAI nodes. The workflow structure is the same.

**Q: Does this work with private repositories?**
A: Yes, as long as your GitHub token has access to the repository.

**Q: Can I deploy this on n8n Cloud?**
A: Yes! n8n Cloud includes all necessary nodes pre-installed.

**Q: How do I add more tools to the AI Agent?**
A: Create new Tool Workflow nodes following the pattern in the advanced workflow.

**Q: Can I use this with GitLab or Bitbucket?**
A: With modifications, yes. Replace GitHub API calls with GitLab/Bitbucket API calls.

---

## Next Steps

After successful setup:

1. ✅ Test with simple features first
2. ✅ Gradually increase complexity
3. ✅ Customize prompts for your codebase
4. ✅ Add error notifications
5. ✅ Integrate with your issue tracker (Jira, Linear, etc.)
6. ✅ Set up webhook triggers for automation
7. ✅ Create custom tools for your specific needs

---

## Success Checklist

Before using in production, verify:

- [ ] Both workflows import successfully
- [ ] Credentials are configured and tested
- [ ] Test workflow executes end-to-end
- [ ] Pull request is created in GitHub
- [ ] Generated code is reasonable quality
- [ ] You can customize the prompts
- [ ] Error handling works correctly
- [ ] Notifications are set up (optional)
- [ ] Costs are acceptable
- [ ] Team knows how to use it

---

**🎉 Congratulations! You're ready to automate your coding with AI!**

For advanced features, integrations, and customizations, see the [complete documentation](./README-N8N-AI-AGENT.md).

Need help? Check the [troubleshooting section](#troubleshooting) or reach out to the community.

Happy automating! 🚀
