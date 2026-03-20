export interface ProfileConfig {
  // Basic Profile Information
  profile: {
    name: string;
    username: string;
    title: string;
    description: string;
    bio: string;
    image: string;
    website: string;
    location: string;
    email?: string;
    currentFocus: string[];
    funFact: string;
  };

  // Social Links
  socialLinks: {
    github: string;
    linkedin?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
    [key: string]: string | undefined;
  };

  // Skills and Technologies
  skills: string[];

  // Stats to display
  stats: {
    projects: string;
    profileViews: string;
    streak: string;
    botUsers?: string;
    [key: string]: string | undefined;
  };

  // Achievements
  achievements: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;

  // Terminal Configuration
  terminal: {
    hostname: string;
    username: string;
    theme: 'dark' | 'light' | 'matrix' | 'cyberpunk';
    welcomeMessage: string[];
    customCommands: {
      [command: string]: {
        description: string;
        output: string[] | (() => string[]);
        action?: 'navigate' | 'external' | 'function';
        target?: string;
      };
    };
    enabledCommands: string[];
    prompt: string;
  };

  // System Information for neofetch
  systemInfo: {
    os: string;
    host: string;
    kernel: string;
    uptime: string;
    packages: string;
    shell: string;
    resolution: string;
    de: string;
    wm: string;
    terminal: string;
    cpu: string;
    gpu: string;
    memory: string;
    ascii?: string[];
  };

  // Project Configuration
  projects: {
    featuredRepos: string[];
    excludeRepos: string[];
    categories: {
      [category: string]: string[];
    };
  };

  // Blog Configuration
  blogs: {
    enabled: boolean;
    featuredPosts: string[];
    categories: string[];
    availableBlogs: string[];
  };

  // SEO Configuration
  seo: {
    siteName: string;
    keywords: string[];
    author: string;
    twitterHandle?: string;
    ogImage?: string;
  };

  // Theme Configuration
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    terminalBackground: string;
    terminalText: string;
    font: string;
  };

  // Navigation Configuration
  navigation: {
    brandName: string;
    brandUrl: string;
    links: Array<{
      name: string;
      path: string;
      external?: boolean;
      color?: string;
    }>;
    systemInfo: {
      // os: string;
      shell: string;
      showDateTime: boolean;
    };
  };

  // Footer Configuration
  footer: {
    statusMessage: string;
    madeWithLove: {
      enabled: boolean;
      text: string;
      location: string;
    };
    systemStatus: {
      enabled: boolean;
      message: string;
    };
  };
}

// Default configuration - Users can override any of these values
export const profileConfig: ProfileConfig = {
  profile: {
    name: "Rey Lorenz Cabanog",
    username: "reycxz",
    title: "Full Stack Developer & Cyber Security Enthusiast | Computer Engineering Student",
    description: "Building secure, scalable systems with React.js, Laravel, and Python. Passionate about DFIR and Network Security.",
    bio: "I'm a passionate developer who loves creating innovative solutions and learning new technologies. Always excited to work on interesting projects and collaborate with fellow developers!",
    image: "/H.svg",
    website: "https://www.linkedin.com/in/reylorenzc/",
    location: "Navotas City, PH",
    email: "reylorenzc@gmail.com",
    currentFocus: [
      "Developing a multi-agency booking platform using Laravel",
      "Advancing in SOC Operations and Digital Forensics (DFIR)",
      "Contributing to open source projects",
      "Completing my Computer Engineering degree at TIP Manila (Class of 2027)"
    ],
    funFact: "I am a working student. I juggle work and class."
  },

  socialLinks: {
    github: "https://github.com/reycxz",
    website: "https://www.linkedin.com/in/reylorenzc/",
    messenger: "https://m.me/ReylorenzCabanog"
  },

  skills: [
    "PHP",
    "Laravel",
    "JavaScript",
    "React.js",
    "HTML5 & CSS3",
    "Python",
    "C++",
    "SQL",
    "Cisco Networking",
    "Linux"
  ],

  stats: {
    projects: "4+",
    profileViews: "13+",
    streak: "29 days",
    totalStars: "3+"
  },

  achievements: [
    {
      title: "Full-Stack Web Developer",
      description: "Developing a multi-agency booking platform with Laravel and React.js",
      icon: ">"
    },
    {
      title: "Cybersecurity Specialist",
      description: "Obtained various certificate in CyberSecurity",
      icon: ">"
    },
    {
      title: "Computer Engineering Student",
      description: "Incoming 4th year at TIP Manila specializing in CyberSecurity",
      icon: ">"
    },
    {
      title: "Cisco Certified Professional",
      description: "Skilled in Networking. Obtained CCNA1 and CCNA2 Certifications",
      icon: ">"
    }
  ],

  terminal: {
    hostname: "iamrey.dev",
    username: "reycxz",
    theme: "dark",
    welcomeMessage: [
      "",
      "╭─────────────────────────────────────────────────────────────────────────────╮",
      "│                                                                             │",
      "│    ██╗ █████╗ ███╗   ███╗██████╗ ███████╗██╗   ██╗                          │",
      "│    ██║██╔══██╗████╗ ████║██╔══██╗██╔════╝╚██╗ ██╔╝                          │",
      "│    ██║███████║██╔████╔██║██████╔╝█████╗   ╚████╔╝                           │",
      "│    ██║██╔══██║██║╚██╔╝██║██╔══██╗██╔══╝    ╚██╔╝                            │",
      "│    ██║██║  ██║██║ ╚═╝ ██║██║  ██║███████╗   ██║                             │",
      "│    ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝                             │",
      "│                                                                             │",
      "│                                                                             │",
      "├─────────────────────────────────────────────────────────────────────────────┤",
      "│                                                                             │",
      "│  > Welcome to my digital workspace! I'm a passionate developer who loves    │",
      "│     building innovative solutions with modern technologies.                 │",
      "│                                                                             │",
      "│  > What you can do here:                                                    │",
      "│     ▸ Explore my projects and skills                                        │",
      "│     ▸ Read my technical blog posts                                          │",
      "│     ▸ Play with interactive commands                                        │",
      "│     ▸ Discover easter eggs and hidden features                              │",
      "│                                                                             │",
      "│  > Quick Start:                                                             │",
      "│     ▸ Type 'help' for a comprehensive command guide                         │",
      "│     ▸ Try 'neofetch' to see system information                              │",
      "│     ▸ Use 'skills' to explore my technical abilities                        │",
      "│     ▸ Run 'cd projects' to browse my work                                   │",
      "│                                                                             │",
      "│  > Pro Tips:                                                                │",
      "│     ▸ Use ↑/↓ arrows to navigate command history                            │",
      "│     ▸ Press Tab for command auto-completion                                 │",
      "│     ▸ Try aliases like 'll', 'cls', or 'h' for shortcuts                    │",
      "│                                                                             │",
      "╰─────────────────────────────────────────────────────────────────────────────╯",
      "",
      "> Ready to explore? The terminal awaits your commands...",
      ""
    ],
    customCommands: {
      "hire-me": {
        description: "Get my contact information",
        output: [
          "Contact Information:",
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          "",
          "Email: reylorenzc@gmail.com",
          "LinkedIn: linkedin.com/in/reylorenzc",
          "GitHub: github.com/reycxz",
          "",
          "Available for:",
          "• Full-time opportunities",
          "• Freelance projects",
          "• Open source collaboration",
          "• Technical consulting",
          "",
          "Let's build something amazing together! >"
        ]
      },
      "coffee": {
        description: "Buy me a coffee",
        output: [
          "Thanks for considering!",
          "",
          "If you like my work, you can support me:",
          "• GitHub Sponsors: github.com/sponsors/reycxz",
          "• PayPal: paypal.me/reycxz",
          "",
          "Every coffee helps me code better!"
        ]
      },
      "joke": {
        description: "Tell a programming joke",
        output: () => {
          const jokes = [
            "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
            "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
            "Why do Java developers wear glasses? Because they can't C#! 👓",
            "There are only 10 types of people in the world: those who understand binary and those who don't.",
            "A SQL query goes into a bar, walks up to two tables and asks: 'Can I join you?' 🍺"
          ];
          return [jokes[Math.floor(Math.random() * jokes.length)]];
        }
      }
    },
    enabledCommands: [
      "help", "about", "whoami", "profile", "projects", "neofetch", "clear",
      "ls", "cd", "pwd", "fortune", "cowsay", "tree", "ps", "top", "grep",
      "cat", "man", "history", "date", "uptime", "uname", "parrot", "sl",
      "hire-me", "coffee", "joke"
    ],
    prompt: "hrithik@iamdhakrey.dev:~$"
  },

  systemInfo: {
    os: "Arch Linux x86_64",
    host: "iamrey.dev",
    kernel: "6.1.0-kali7-amd64",
    uptime: "2 hours, 34 mins",
    packages: "1337 (pacman)",
    shell: "zsh 5.9",
    resolution: "1920x1080",
    de: "Awesome",
    wm: "Awesome",
    terminal: "alacritty",
    cpu: "Intel i7-10750H (12) @ 2.6GHz",
    gpu: "NVIDIA GeForce GTX 1650",
    memory: "3840MiB / 15951MiB"
  },

  projects: {
    featuredRepos: [], // Will be filled from GitHub API
    excludeRepos: ["private-repo", "test-repo"],
    categories: {
      "Web Development": ["react-app", "vue-project"],
      "CLI Tools": ["cli-tool", "automation-script"],
      "Libraries": ["npm-package", "python-lib"]
    }
  },

  blogs: {
    enabled: true,
    featuredPosts: ["blog-linking-guide", "react-typescript-guide", "linux_commands"],
    categories: ["React", "TypeScript", "Linux", "DevOps", "Tutorial", "Programming", "Documentation"],
    availableBlogs: [
      "blog-linking-guide.md",
      "react-typescript-guide.md",
    ]
  },

  seo: {
    siteName: "Rey Lorenz - Developer Portfolio",
    keywords: ["developer", "portfolio", "react", "typescript", "javascript"],
    author: "Rey Lorenz Cabanog",
    twitterHandle: "@reycxzzz",
    ogImage: "/og-image.jpg"
  },

  theme: {
    primaryColor: "#0070f3",
    secondaryColor: "#ff6b6b",
    accentColor: "#4ecdc4",
    backgroundColor: "#000000",
    textColor: "#ffffff",
    terminalBackground: "#1a1a1a",
    terminalText: "#00ff00",
    font: "CascadiaCode, 'Courier New', monospace"
  },

  navigation: {
    brandName: "iamrey.dev",
    brandUrl: "/",
    links: [
      { name: "blogs", path: "/blogs", color: "var(--theme-primary)" },
      { name: "projects", path: "/projects", color: "var(--theme-secondary)" },
      // { name: "profile", path: "/profile", color: "var(--theme-accent)" },
      { name: "messenger", path: "https://m.me/reylorenzcabanog", external: true, color: "var(--theme-muted)" },
      { name: "gh", path: "https://github.com/reycxz/", external: true, color: "var(--theme-muted)" }
    ],
    systemInfo: {
      // os: "Linux 6.1.0",
      shell: "zsh",
      showDateTime: false
    }
  },

  footer: {
    statusMessage: "Connected",
    madeWithLove: {
      enabled: true,
      text: "Made with ❤️ and ⚡",
      location: "Arch Linux"
    },
    systemStatus: {
      enabled: true,
      message: "Linux 6.15.0 •  System OK"
    }
  }
};

export default profileConfig;
