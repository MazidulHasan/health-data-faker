const marker = "<!-- groq-pr-review -->";

const {
  GITHUB_TOKEN,
  GROQ_API_KEY,
  GROQ_MODEL = "qwen/qwen3.6-27b",
  GITHUB_REPOSITORY,
  PR_NUMBER,
} = process.env;

if (!GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN is required.");
}

if (!GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is required. Add it as a GitHub Actions repository secret.");
}

if (!GITHUB_REPOSITORY || !PR_NUMBER) {
  throw new Error("GITHUB_REPOSITORY and PR_NUMBER are required.");
}

const [owner, repo] = GITHUB_REPOSITORY.split("/");
const githubBaseUrl = "https://api.github.com";

async function github(path, options = {}) {
  const response = await fetch(`${githubBaseUrl}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status}: ${body}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function groq(messages) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: 0.2,
      max_completion_tokens: 1800,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Groq API ${response.status}: ${body}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim();
}

function truncate(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}\n\n[Diff truncated for review size.]`;
}

const pr = await github(`/repos/${owner}/${repo}/pulls/${PR_NUMBER}`);
const files = await github(`/repos/${owner}/${repo}/pulls/${PR_NUMBER}/files?per_page=100`);

const changedFiles = files
  .map((file) => {
    const patch = file.patch || "[No textual patch available]";
    return [
      `File: ${file.filename}`,
      `Status: ${file.status}`,
      `Changes: +${file.additions} -${file.deletions}`,
      "Patch:",
      patch,
    ].join("\n");
  })
  .join("\n\n---\n\n");

const diffContext = truncate(changedFiles, 55000);

const review = await groq([
  {
    role: "system",
    content: [
      "You are a senior software engineer reviewing a GitHub pull request.",
      "Be concise, practical, and specific.",
      "Do not invent issues that are not supported by the diff.",
      "Focus on correctness, regressions, security, maintainability, and missing tests.",
      "End with a clear recommendation: Merge, Merge after fixes, or Do not merge.",
    ].join(" "),
  },
  {
    role: "user",
    content: [
      `Repository: ${GITHUB_REPOSITORY}`,
      `PR title: ${pr.title}`,
      `PR body: ${pr.body || "[No PR body provided]"}`,
      "",
      "Review this pull request diff.",
      "Respond with these sections:",
      "1. What I understand",
      "2. Key concerns",
      "3. Suggested fixes",
      "4. Merge recommendation",
      "",
      diffContext,
    ].join("\n"),
  },
]);

if (!review) {
  throw new Error("Groq returned an empty review.");
}

const body = `${marker}
## Groq PR Review

${review}

---
Model: \`${GROQ_MODEL}\``;

const comments = await github(`/repos/${owner}/${repo}/issues/${PR_NUMBER}/comments?per_page=100`);
const existing = comments.find((comment) => comment.body?.includes(marker));

if (existing) {
  await github(`/repos/${owner}/${repo}/issues/comments/${existing.id}`, {
    method: "PATCH",
    body: JSON.stringify({ body }),
  });
} else {
  await github(`/repos/${owner}/${repo}/issues/${PR_NUMBER}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}
