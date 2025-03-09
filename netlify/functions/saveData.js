const { Octokit } = require("@octokit/rest");

exports.handler = async function(event, context) {
  // Initialize GitHub API client
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });

  // Make sure it's a POST request
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    // Parse the input data
    const { file, data } = JSON.parse(event.body);
    
    if (!file || !data) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing file or data" })
      };
    }

    // Only allow updating specific files
    const allowedFiles = ["agents.json", "tasks.json", "assigned-tasks.json"];
    if (!allowedFiles.includes(file)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid file name" })
      };
    }

    const owner = "nictherealtor";
    const repo = "onboarding";
    const path = `data/${file}`;

    // Get the current file to get its SHA
    const fileResponse = await octokit.repos.getContent({
      owner,
      repo,
      path
    });

    // Update the file on GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Update ${file}`,
      content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
      sha: fileResponse.data.sha
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
      headers: {
        "Content-Type": "application/json"
      }
    };
  } catch (error) {
    console.error("Error saving data:", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to save data" })
    };
  }
};
