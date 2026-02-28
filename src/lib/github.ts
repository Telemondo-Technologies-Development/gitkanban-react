const BASE_URL = "https://api.github.com";

const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const OWNER = import.meta.env.VITE_GITHUB_OWNER;
const REPO = import.meta.env.VITE_GITHUB_REPO;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: "application/vnd.github+json",
};

async function githubFetch(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchIssues() {
  return githubFetch(`/repos/${OWNER}/${REPO}/issues?state=open`);
}

export async function createIssue(title: string) {
  return githubFetch(`/repos/${OWNER}/${REPO}/issues`, {
    method: "POST",
    body: JSON.stringify({
      title,
      labels: ["todo"],
    }),
  });
}

export async function updateIssueStatus(issueNumber: number, newStatus: string) {
  return githubFetch(`/repos/${OWNER}/${REPO}/issues/${issueNumber}`, {
    method: "PATCH",
    body: JSON.stringify({
      labels: [newStatus],
    }),
  });
}