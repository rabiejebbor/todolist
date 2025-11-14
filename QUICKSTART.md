# Quick Start Guide - GitHub AI Coding Agent

Get your AI coding agent up and running in **under 10 minutes**!

## 🚀 5-Minute Setup

### Prerequisites Checklist

- [ ] n8n instance running (cloud or self-hosted)
- [ ] Anthropic API key ([Get one here](https://console.anthropic.com/))
- [ ] GitHub Personal Access Token with `repo` scope ([Create here](https://github.com/settings/tokens))

---

## Step 1: Import Workflow (1 minute)

1. Download `github-ai-coding-agent-workflow.json`
2. Open n8n
3. Click **"Workflows"** → **"Add Workflow"** → **"Import from File"**
4. Select the downloaded JSON file
5. Click **"Import"**

✅ Workflow imported!

---

## Step 2: Configure Anthropic API (2 minutes)

1. In n8n, click **"Credentials"** (left sidebar)
2. Click **"Add Credential"**
3. Search for **"Anthropic API"**
4. Paste your API key
5. Name it: `Anthropic Claude API`
6. Click **"Save"**

Now connect it to the workflow:

1. Open your imported workflow
2. Click the **"Anthropic Chat Model - Claude"** node
3. In the **"Credential"** dropdown, select `Anthropic Claude API`
4. Click outside to save

✅ Claude AI connected!

---

## Step 3: Configure GitHub API (3 minutes)

1. Go to **"Credentials"** → **"Add Credential"**
2. Search for **"Header Auth"**
3. Fill in:
   - **Name**: `Authorization`
   - **Value**: `token YOUR_GITHUB_TOKEN` ⚠️ Replace with your actual token
4. Save as: `GitHub API Token`

Now connect it to ALL HTTP Request nodes:

In your workflow, update these **5 nodes**:
- Get Repository Info
- Get Base Branch SHA
- Create New Branch
- Commit File to Branch
- Create Pull Request

For each node:
1. Click the node
2. Scroll to **"Authentication"**
3. Select **"Generic Credential Type"**
4. Choose **"Header Auth"**
5. Select `GitHub API Token`
6. Click outside to save

✅ GitHub connected!

---

## Step 4: First Run (2 minutes)

1. Click **"Execute Workflow"** button (top right)
2. In the input panel, paste:

```json
{
  "feature_ticket": "Add a simple Hello World function in a new file utils/hello.js",
  "repo_owner": "YOUR_GITHUB_USERNAME",
  "repo_name": "YOUR_TEST_REPO",
  "base_branch": "main"
}
```

⚠️ **Important**: Replace with your actual GitHub username and a test repository!

3. Click **"Execute"**
4. Watch the magic happen! 🪄

The workflow will:
- Analyze your repository
- Generate the code
- Create a new branch
- Commit the file
- Open a pull request

Check your GitHub repository for the new PR!

✅ First PR created by AI!

---

## 🎯 What's Next?

### Try More Complex Features

Now that it works, try something more interesting:

```json
{
  "feature_ticket": "Add a user authentication middleware with JWT token validation, including error handling for expired and invalid tokens",
  "repo_owner": "YOUR_GITHUB_USERNAME",
  "repo_name": "YOUR_TEST_REPO",
  "base_branch": "main"
}
```

### Make It Production-Ready

1. **Add Error Handling**:
   - Add "Error Trigger" nodes
   - Send notifications on failure

2. **Create a Webhook**:
   - Replace "Manual Trigger" with "Webhook"
   - Get an API endpoint to trigger from anywhere

3. **Integrate with Issue Tracker**:
   - Connect to Jira, Linear, or GitHub Issues
   - Auto-generate PRs from tickets

---

## 🐛 Quick Troubleshooting

### "401 Unauthorized" Error

**Fix**: Double-check your GitHub token format:
- Should be: `token ghp_xxxxxxxxxxxxx`
- Include the word "token" before your actual token
- Make sure token has `repo` scope

### "AI Agent Not Responding"

**Fix**:
- Verify Anthropic API key is correct
- Check you have API credits at [console.anthropic.com](https://console.anthropic.com)
- Wait 30-60 seconds (AI generation can take time)

### "Branch Already Exists"

**Fix**: The workflow auto-generates unique branch names with timestamps. If this happens:
- Wait a few seconds and try again
- Or delete the existing branch in GitHub

### "Invalid JSON Response"

**Fix**:
- The AI sometimes adds markdown formatting
- Click the "Anthropic Chat Model" node
- Lower "Temperature" to `0.2`
- This makes responses more deterministic

---

## 💡 Pro Tips

### 1. Write Better Feature Tickets

**Instead of**:
```
Add login
```

**Write**:
```
Implement user login functionality:
- Create POST /api/login endpoint
- Accept email and password
- Validate credentials against database
- Return JWT token on success
- Return 401 on invalid credentials
- Add rate limiting (5 attempts per 15 minutes)
- Include unit tests
```

### 2. Start Small

Test with simple features first:
- Add a utility function
- Create a simple component
- Add a configuration file

Then progress to:
- Full features with multiple files
- Database migrations
- Complex business logic

### 3. Review Before Merging

**Always** review the generated PR:
- Check for security issues
- Verify tests are comprehensive
- Ensure code quality
- Test locally

### 4. Customize the Prompt

Edit the AI Agent node's prompt to:
- Add your coding standards
- Specify testing frameworks
- Include documentation requirements
- Enforce security practices

---

## 📊 Usage Pattern

A typical workflow:

1. **Morning**: Create a list of feature tickets
2. **Trigger**: Run workflow for each feature
3. **Review**: Check PRs during code review time
4. **Iterate**: Request changes or merge
5. **Deploy**: Follow your normal CI/CD process

---

## 🎓 Learning Path

### Week 1: Basics
- [x] Import and configure workflow
- [ ] Generate 5 simple features
- [ ] Understand each node's purpose
- [ ] Customize input parameters

### Week 2: Customization
- [ ] Modify AI prompts for your codebase
- [ ] Add error notifications
- [ ] Create webhook endpoint
- [ ] Integrate with issue tracker

### Week 3: Advanced
- [ ] Try the MCP version
- [ ] Add code review automation
- [ ] Implement testing gates
- [ ] Set up monitoring

---

## 🔗 Quick Links

- [Full Documentation](./README-N8N-AI-AGENT.md)
- [Example Inputs](./example-input.json)
- [n8n Docs](https://docs.n8n.io/)
- [Claude API Docs](https://docs.anthropic.com/)
- [GitHub API Docs](https://docs.github.com/en/rest)

---

## 🆘 Need Help?

- **n8n Community**: [community.n8n.io](https://community.n8n.io)
- **GitHub Issues**: Open an issue in this repo
- **Discord**: Join n8n Discord for real-time help

---

## 🎉 You're All Set!

Your AI coding agent is ready to:
- ✅ Save hours on boilerplate code
- ✅ Generate consistent, well-structured code
- ✅ Accelerate feature development
- ✅ Automate repetitive coding tasks

**Now go build something amazing!** 🚀

---

**Next Steps**: Check out [README-N8N-AI-AGENT.md](./README-N8N-AI-AGENT.md) for advanced features like MCP integration, error handling, and production deployment strategies.
