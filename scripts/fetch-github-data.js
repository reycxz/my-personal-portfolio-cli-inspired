import fs from 'fs';
import path from 'path';

// Change username if needed, defaults to reycxz as requested
const USERNAME = 'reycxz'; 

async function fetchGitHubData() {
  const headers = {
    'User-Agent': 'Node.js GitHub Fetcher',
    'Accept': 'application/vnd.github.v3+json'
  };
  
  // Optional: Use GH token if rate limited
  if (process.env.GH_TOKEN || process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GH_TOKEN || process.env.GITHUB_TOKEN}`;
  }

  try {
    console.log(`📊 Fetching user information for ${USERNAME}...`);
    const userRes = await fetch(`https://api.github.com/users/${USERNAME}`, { headers });
    if (!userRes.ok) {
        if (userRes.status === 403 || userRes.status === 429) {
            console.error("❌ GitHub API Rate Limit Exceeded. Please provide a GITHUB_TOKEN environment variable.");
        }
        throw new Error(`User API failed: ${userRes.statusText}`);
    }
    const user = await userRes.json();

    console.log(`📁 Fetching repositories...`);
    let repos = [];
    let page = 1;
    while (true) {
        const repoRes = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&page=${page}`, { headers });
        if (!repoRes.ok) throw new Error(`Repo API failed: ${repoRes.statusText}`);
        const pageRepos = await repoRes.json();
        repos = repos.concat(pageRepos);
        if (pageRepos.length < 100) break;
        page++;
    }

    console.log(`🔍 Processing ${repos.length} repositories...`);
    const enhancedRepos = [];
    for (const repo of repos) {
        if (repo.fork) continue;
        
        let primaryLanguages = [];
        let languageStats = {};
        
        if (repo.language) {
            primaryLanguages = [repo.language];
            
            // Try fetching languages, though rate limiting might block this if too many repos
            // Since we're trying to keep it simple, we'll only fetch if there are few repos
            // or we'll just skip to prevent rate limits without auth
            try {
                const langRes = await fetch(repo.languages_url, { headers });
                if (langRes.ok) {
                    languageStats = await langRes.json();
                    primaryLanguages = Object.keys(languageStats).slice(0, 2);
                }
            } catch (e) {}
        }
        
        enhancedRepos.push({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            homepageUrl: repo.homepage,
            primaryLanguage: { name: repo.language },
            primaryLanguages: primaryLanguages,
            languageStats: languageStats,
            stargazerCount: repo.stargazers_count,
            forkCount: repo.forks_count,
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            pushedAt: repo.pushed_at,
            repositoryTopics: repo.topics || [],
            licenseInfo: repo.license,
            isPrivate: repo.private,
            isFork: repo.fork,
            isArchived: repo.archived
        });
    }

    const totalRepos = enhancedRepos.length;
    const totalStars = enhancedRepos.reduce((sum, r) => sum + r.stargazerCount, 0);
    const totalForks = enhancedRepos.reduce((sum, r) => sum + r.forkCount, 0);
    
    const allLanguagesSet = new Set();
    enhancedRepos.forEach(r => {
        if (r.primaryLanguages) r.primaryLanguages.forEach(l => allLanguagesSet.add(l));
    });
    
    const stats = {
        totalRepos,
        totalStars,
        totalForks,
        languages: Array.from(new Set(enhancedRepos.map(r => r.primaryLanguage?.name).filter(Boolean))),
        allLanguages: Array.from(allLanguagesSet).sort()
    };

    const featuredRepos = [...enhancedRepos]
        .filter(r => r.description && !r.isArchived)
        .sort((a, b) => b.stargazerCount - a.stargazerCount)
        .slice(0, 12);
        
    const featuredNames = new Set(featuredRepos.map(r => r.name));
    const nonFeaturedRepos = enhancedRepos.filter(r => !featuredNames.has(r.name));
    
    const byLanguage = {};
    nonFeaturedRepos.forEach(repo => {
        const lang = repo.primaryLanguage?.name;
        if (lang) {
            if (!byLanguage[lang]) byLanguage[lang] = [];
            byLanguage[lang].push(repo);
        }
    });

    const finalData = {
        lastUpdated: new Date().toISOString(),
        user: {
            login: user.login,
            name: user.name,
            avatarUrl: user.avatar_url,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            publicRepos: user.public_repos
        },
        repositories: nonFeaturedRepos,
        stats,
        featured: featuredRepos,
        byLanguage
    };

    const outPath = path.join(process.cwd(), 'src', 'data', 'github-projects.json');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(finalData, null, 2));
    
    console.log(`\n✅ GitHub data fetched successfully!`);
    console.log(`   • Total Public Repos: ${stats.totalRepos}`);
    console.log(`   • Total Stars: ${stats.totalStars}`);
    console.log(`   • Total Forks: ${stats.totalForks}`);
    console.log(`\n🚀 Generated: src/data/github-projects.json`);

  } catch (err) {
    console.error(`\n❌ Fetch failed: ${err.message}`);
    process.exit(1);
  }
}

fetchGitHubData();
