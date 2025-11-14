# Architecture Documentation - GitHub AI Coding Agent

## 🏛️ System Architecture

This document provides a detailed technical overview of how the AI coding agent workflows operate.

---

## Overview Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Input                               │
│  (Feature Ticket, Repo Info, Branch Name)                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    n8n Workflow Engine                           │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │  1. Input Processing & Validation                         │   │
│ │     - Validate repository exists                          │   │
│ │     - Check branch accessibility                          │   │
│ │     - Prepare context data                                │   │
│ └──────────────────┬───────────────────────────────────────┘   │
│                    │                                             │
│                    ▼                                             │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │  2. Repository Analysis                                   │   │
│ │     - Fetch repository metadata                           │   │
│ │     - Get file structure                                  │   │
│ │     - Retrieve base branch SHA                            │   │
│ └──────────────────┬───────────────────────────────────────┘   │
│                    │                                             │
│                    ▼                                             │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │  3. AI Code Generation                                    │   │
│ │     ┌─────────────────────────────────────────────┐      │   │
│ │     │   Claude AI Agent (Anthropic)               │      │   │
│ │     │   - Analyze feature requirements            │      │   │
│ │     │   - Generate implementation plan            │      │   │
│ │     │   - Create code files                       │      │   │
│ │     │   - Generate tests (optional)               │      │   │
│ │     │                                              │      │   │
│ │     │   MCP Tools (Optional):                     │      │   │
│ │     │   - Read existing files                     │      │   │
│ │     │   - Search codebase                         │      │   │
│ │     │   - Understand patterns                     │      │   │
│ │     └─────────────────────────────────────────────┘      │   │
│ └──────────────────┬───────────────────────────────────────┘   │
│                    │                                             │
│                    ▼                                             │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │  4. Git Operations (via GitHub API)                      │   │
│ │     - Create feature branch                              │   │
│ │     - Commit files (multiple commits)                    │   │
│ │     - Create pull request                                │   │
│ └──────────────────┬───────────────────────────────────────┘   │
│                    │                                             │
└────────────────────┼─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Repository                             │
│  - New branch created                                            │
│  - Files committed                                               │
│  - Pull request opened                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. Trigger & Input Processing

#### Manual Trigger
```javascript
Input Schema:
{
  feature_ticket: string,  // Required: Feature description
  repo_owner: string,      // Required: GitHub username/org
  repo_name: string,       // Required: Repository name
  base_branch: string      // Optional: Default "main"
}
```

#### Set Input Parameters Node
- **Type**: Set (n8n-nodes-base.set)
- **Purpose**: Normalize and validate input data
- **Operations**:
  - Set default values for optional parameters
  - Validate required fields
  - Pass data to subsequent nodes

---

### 2. Repository Analysis Layer

#### Get Repository Info
```http
GET https://api.github.com/repos/{owner}/{repo}
Authorization: token {GITHUB_TOKEN}
```

**Response Data Used**:
- `default_branch`: Fallback if base_branch not specified
- `description`: Context for AI agent
- `language`: Primary programming language
- `topics`: Technology tags

#### Get Repository Structure (Advanced Workflow)
```http
GET https://api.github.com/repos/{owner}/{repo}/git/trees/{branch}?recursive=1
Authorization: token {GITHUB_TOKEN}
```

**Response Data Used**:
- File tree for understanding project structure
- Helps AI understand where to place new files
- Identifies existing patterns and conventions

#### Get Base Branch SHA
```http
GET https://api.github.com/repos/{owner}/{repo}/git/refs/heads/{branch}
Authorization: token {GITHUB_TOKEN}
```

**Response Data Used**:
- `object.sha`: Commit SHA to branch from

---

### 3. AI Agent Layer

#### Anthropic Chat Model Configuration

```javascript
Model: claude-3-5-sonnet-20241022
Parameters:
  - maxTokens: 8000        // Maximum response length
  - temperature: 0.2-0.3   // Lower = more deterministic
```

#### AI Agent Prompt Structure

The prompt includes:

1. **Context Section**:
   - Repository information
   - Technology stack
   - Existing file structure

2. **Task Definition**:
   - Feature requirements
   - Implementation guidelines
   - Output format specification

3. **Instructions**:
   - Code quality standards
   - Testing requirements
   - Documentation needs

4. **Output Schema**:
```json
{
  "implementation_plan": "string",
  "files": [
    {
      "path": "string",
      "content": "string",
      "action": "create|update",
      "reason": "string"
    }
  ],
  "dependencies": [
    {
      "name": "string",
      "version": "string",
      "reason": "string"
    }
  ],
  "pr_title": "string",
  "pr_description": "string"
}
```

#### MCP Integration (Advanced Workflow)

**MCP Tools Available**:

1. **GitHub Read File**:
   - Reads existing files from repository
   - Helps AI understand current implementation
   - Ensures consistency with existing code

2. **GitHub Search Code**:
   - Searches for patterns in codebase
   - Finds similar implementations
   - Identifies conventions to follow

**MCP Architecture**:
```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│  AI Agent   │─────▶│  MCP Server  │─────▶│   GitHub    │
│   (n8n)     │◀─────│   (stdio)    │◀─────│     API     │
└─────────────┘      └──────────────┘      └─────────────┘
```

---

### 4. Git Operations Layer

#### Branch Creation

```http
POST https://api.github.com/repos/{owner}/{repo}/git/refs
Content-Type: application/json
Authorization: token {GITHUB_TOKEN}

{
  "ref": "refs/heads/ai-agent/{feature-slug}-{timestamp}",
  "sha": "{base_branch_sha}"
}
```

**Branch Naming Convention**:
```
ai-agent/{feature-description-slug}-{unix-timestamp}

Examples:
- ai-agent/add-user-authentication-1705234567890
- ai-agent/fix-memory-leak-websocket-1705234568901
```

#### File Commit

For each file generated by AI:

```http
PUT https://api.github.com/repos/{owner}/{repo}/contents/{file_path}
Content-Type: application/json
Authorization: token {GITHUB_TOKEN}

{
  "message": "{action}: {file_path}\n\n{reason}",
  "content": "{base64_encoded_content}",
  "branch": "{branch_name}"
}
```

**Commit Message Format**:
```
{action}: {file_path}

{reason_for_change}
```

Examples:
- `create: src/auth/jwt.ts\n\nAdd JWT token generation and validation`
- `update: src/middleware/auth.ts\n\nAdd token expiration handling`

#### Pull Request Creation

```http
POST https://api.github.com/repos/{owner}/{repo}/pulls
Content-Type: application/json
Authorization: token {GITHUB_TOKEN}

{
  "title": "{pr_title}",
  "body": "{pr_description}\n\n---\n\n🤖 Generated by AI Agent",
  "head": "{branch_name}",
  "base": "{base_branch}"
}
```

---

## Data Flow

### Node-to-Node Data Passing

n8n uses a JSON-based data passing system:

```javascript
// Example data flow through workflow

// 1. After "Set Input Parameters"
{
  feature_ticket: "Add user auth",
  repo_owner: "username",
  repo_name: "myrepo",
  base_branch: "main"
}

// 2. After "Get Repository Info"
{
  ...previous_data,
  default_branch: "main",
  repo_description: "My awesome project",
  repo_language: "JavaScript"
}

// 3. After "Prepare Context"
{
  ...previous_data,
  branch_name: "ai-agent/add-user-auth-1705234567890",
  base_sha: "abc123def456...",
  file_structure: "src/\n  index.js\n  utils/\n..."
}

// 4. After "AI Agent"
{
  ...previous_data,
  output: "{\"implementation_plan\":\"...\",\"files\":[...]}"
}

// 5. After "Split Files"
// Multiple items, one per file
[
  {
    file_path: "src/auth.js",
    file_content: "...",
    file_action: "create",
    ...context
  },
  {
    file_path: "tests/auth.test.js",
    file_content: "...",
    file_action: "create",
    ...context
  }
]
```

---

## Error Handling

### Current Implementation

Each HTTP Request node has built-in error handling:
- Retry on 5xx errors (server errors)
- Fail on 4xx errors (client errors)
- Timeout after 60 seconds

### Recommended Enhancements

```javascript
// Add Error Trigger node
{
  "on_error": {
    "notification": {
      "type": "email",
      "to": "dev-team@company.com",
      "subject": "AI Agent Workflow Failed",
      "body": "Error: {{$json.error.message}}"
    },
    "retry": {
      "max_attempts": 3,
      "backoff": "exponential"
    }
  }
}
```

---

## Performance Considerations

### Bottlenecks

1. **AI Generation**: 10-60 seconds depending on complexity
2. **GitHub API**: Rate limited to 5000 requests/hour
3. **File Commits**: Sequential, can be slow for many files

### Optimization Strategies

1. **Parallel API Calls**: Where possible, make GitHub API calls in parallel
2. **Caching**: Cache repository structure for repeated operations
3. **Batch Commits**: Consider combining files into single commits
4. **Model Selection**: Use Claude Haiku for simpler tasks (faster, cheaper)

### Token Usage

**Typical Token Consumption**:
```
Input Tokens:
- System prompt: ~800 tokens
- Repository context: ~1000-3000 tokens
- Feature description: ~100-500 tokens
Total Input: ~2000-4000 tokens

Output Tokens:
- Implementation plan: ~200-500 tokens
- Code files: ~2000-6000 tokens
Total Output: ~2500-7000 tokens

Total per execution: ~4500-11000 tokens
Cost (Claude Sonnet 3.5): ~$0.04-$0.10 per run
```

---

## Security Architecture

### Authentication Flow

```
User → n8n Workflow
         ├─→ Anthropic API (API Key)
         └─→ GitHub API (Personal Access Token)
```

### Credential Storage

- **n8n Credentials**: Encrypted at rest
- **Environment Variables**: For sensitive configuration
- **No Hardcoding**: Credentials never in workflow JSON

### API Token Permissions

**GitHub Token Minimum Scopes**:
- `repo` (full control) - Required for creating branches, committing, PRs

**Future Improvement**:
- Use GitHub Apps for more granular permissions
- Implement token rotation
- Add IP whitelisting

---

## Scalability

### Current Limitations

- **Single Repository**: One repo per execution
- **Sequential Processing**: Files committed one at a time
- **No Queuing**: Manual or webhook triggers only

### Scaling Strategies

1. **Multi-Repository Support**:
```javascript
// Add Loop node
for (const repo of repositories) {
  executeWorkflow(repo);
}
```

2. **Queue Integration**:
```javascript
// Add Redis or RabbitMQ
- Accept tickets in queue
- Process asynchronously
- Handle rate limits gracefully
```

3. **Distributed Processing**:
```javascript
// Deploy multiple n8n instances
- Load balancer
- Shared credential store
- Centralized logging
```

---

## Monitoring & Observability

### Recommended Metrics

```javascript
Metrics to Track:
- Workflow executions per day
- Success/failure rate
- Average execution time
- API token usage
- Cost per PR generated
- Lines of code generated
```

### Logging Strategy

```javascript
// Add logging nodes after each major step
{
  "timestamp": "ISO8601",
  "workflow_id": "uuid",
  "step": "ai_generation",
  "status": "success",
  "duration_ms": 15420,
  "tokens_used": 8500,
  "cost_usd": 0.068
}
```

### Integration Options

- **DataDog**: For comprehensive monitoring
- **Sentry**: For error tracking
- **CloudWatch**: For AWS deployments
- **Custom Dashboards**: Grafana + Prometheus

---

## Extensibility Points

### Custom Nodes

You can add custom nodes for:

1. **Code Quality Checks**:
   - ESLint
   - Prettier
   - SonarQube

2. **Security Scanning**:
   - Snyk
   - OWASP Dependency Check
   - CodeQL

3. **Testing**:
   - Run unit tests
   - Integration tests
   - E2E tests

4. **Notifications**:
   - Slack
   - Discord
   - Email
   - SMS

### Webhook Extensions

```javascript
// Example: Jira Integration
{
  "trigger": "Jira Issue Created with label 'ai-agent'",
  "action": "Extract issue description → Run workflow"
}

// Example: Slack Command
{
  "trigger": "/create-feature [description]",
  "action": "Parse command → Run workflow → Reply with PR link"
}
```

---

## Technology Stack

### Core Technologies

- **n8n**: Workflow automation platform
- **Claude AI**: Code generation (Anthropic)
- **GitHub API**: Repository management
- **MCP**: Model Context Protocol (optional)

### Dependencies

```json
{
  "@n8n/n8n-nodes-langchain": "^1.0.0",
  "n8n": "^1.0.0"
}
```

### Optional Enhancements

- **TypeScript**: For type-safe workflow development
- **Docker**: For containerized deployment
- **Kubernetes**: For orchestration at scale
- **Redis**: For caching and queuing

---

## Comparison: Basic vs Advanced Workflow

| Feature | Basic Workflow | Advanced (MCP) Workflow |
|---------|---------------|------------------------|
| Setup Complexity | Low | Medium-High |
| Dependencies | Minimal | Requires MCP server |
| Code Understanding | Limited | Deep (reads existing files) |
| Accuracy | Good | Excellent |
| Response Time | 15-30s | 30-60s |
| Cost per Run | $0.04-0.08 | $0.08-0.15 |
| Best For | Simple features | Complex integrations |

---

## Future Enhancements Roadmap

### Phase 1: Core Improvements
- [ ] Better error handling and retries
- [ ] Notification system
- [ ] Cost tracking dashboard
- [ ] Workflow templates for common patterns

### Phase 2: Advanced Features
- [ ] Multi-repository support
- [ ] Automated code review
- [ ] Test generation and execution
- [ ] Performance benchmarking

### Phase 3: Enterprise Features
- [ ] Team collaboration features
- [ ] Approval workflows
- [ ] Compliance checks
- [ ] Audit logging
- [ ] SSO integration

---

## Related Architectures

### Alternative Approaches

1. **Direct Claude API**:
   - No n8n required
   - More control, more code
   - Higher maintenance

2. **GitHub Actions**:
   - Integrated with GitHub
   - Limited to GitHub events
   - YAML configuration

3. **Custom Backend Service**:
   - Full control
   - Higher development cost
   - Custom UI needed

### Why n8n + Claude?

**Advantages**:
- ✅ Visual workflow builder
- ✅ Easy to modify and maintain
- ✅ Rich ecosystem of integrations
- ✅ No code deployment required
- ✅ Built-in error handling
- ✅ Credential management

**Trade-offs**:
- ❌ Requires n8n hosting
- ❌ Learning curve for n8n
- ❌ Some overhead vs direct API

---

## Conclusion

This architecture provides a robust, scalable foundation for AI-powered code generation. The modular design allows for easy customization and extension to meet specific needs.

**Key Strengths**:
- Separation of concerns
- Easy to understand and modify
- Leverages best-in-class tools
- Extensible and scalable

**Next Steps**:
1. Deploy and test the basic workflow
2. Gather metrics and feedback
3. Iterate based on real-world usage
4. Add enhancements incrementally

---

For implementation details, see [README-N8N-AI-AGENT.md](./README-N8N-AI-AGENT.md)

For quick setup, see [QUICKSTART.md](./QUICKSTART.md)
