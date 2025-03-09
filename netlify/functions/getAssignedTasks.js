const { Octokit } = require("@octokit/rest");

exports.handler = async function(event, context) {
  // Initialize GitHub API client
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });

  try {
    // Replace with your GitHub username and repository name
    const owner = "nictherealtor";
    const repo = "onboarding";
    const path = "data/assigned-tasks.json";

    // Get the file from GitHub
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path
    });

    // Decode the content (base64 encoded)
    const content = Buffer.from(response.data.content, 'base64').toString();
    
    return {
      statusCode: 200,
      body: content,
      headers: {
        "Content-Type": "application/json"
      }
    };
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch assigned tasks" })
    };
  }
};
