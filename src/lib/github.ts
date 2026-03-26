const BASE_URL = "https://api.github.com";

const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const OWNER = import.meta.env.VITE_GITHUB_OWNER;
const REPO = import.meta.env.VITE_GITHUB_REPO;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: "application/vnd.github+json",
};

const columnToLabelMap: Record<string, string> = {
  todo: "todo",
  inProgress: "in-progress",
  done: "done",
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

export async function createIssue(title: string, body: string) {
  return githubFetch(`/repos/${OWNER}/${REPO}/issues`, {
    method: "POST",
    body: JSON.stringify({
      title,
      body,
      labels: ["todo"],
    }),
  });
}

export async function updateIssueStatus(issueNumber: number, newStatus: keyof typeof columnToLabelMap) {
  return githubFetch(`/repos/${OWNER}/${REPO}/issues/${issueNumber}`, {
    method: "PATCH",
    body: JSON.stringify({
      labels: [columnToLabelMap[newStatus]],
    }),
  });
}

export async function closeIssue(issueNumber: number) {
  const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues/${issueNumber}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        state: "closed",
        labels: ["closed"],
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to close issue");
  }

  return response.json();
}