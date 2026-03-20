import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { PDFParse } from "pdf-parse";

function log(message) {
  console.log(`[import-resume] ${message}`);
}

function normalizeText(text) {
  return text
    .replace(/\r/g, "\n")
    .replace(/[\u2022\u25cf\u25aa]/g, " • ")
    .replace(/[‐‑–—]/g, "-")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function escapeTs(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$");
}

function wrapLine(text, width = 62, indent = "") {
  const words = text.trim().split(/\s+/);
  const lines = [];
  let current = indent;

  for (const word of words) {
    const proposal = current.trim().length === 0 ? `${indent}${word}` : `${current} ${word}`;
    if (proposal.length > width && current.trim().length > 0) {
      lines.push(current);
      current = `${indent}${word}`;
    } else {
      current = proposal;
    }
  }

  if (current.trim().length > 0) {
    lines.push(current);
  }

  return lines;
}

function chunkBetween(text, startMarker, endMarker) {
  const start = text.indexOf(startMarker);
  if (start === -1) return "";
  const from = start + startMarker.length;
  const end = endMarker ? text.indexOf(endMarker, from) : -1;
  return (end === -1 ? text.slice(from) : text.slice(from, end)).trim();
}

function getMatch(text, regex, fallback = "") {
  const match = text.match(regex);
  return match?.[1]?.trim() || fallback;
}

function parseBasics(rawText) {
  const firstChunk = rawText.slice(0, rawText.indexOf("WORK EXPERIENCE") > -1 ? rawText.indexOf("WORK EXPERIENCE") : 400);
  const nameMatch = firstChunk.match(/^([A-Za-z .?]+?)\s+Address:/);
  const name = (nameMatch?.[1] || "Rey Lorenz B. Cabanog").replace(/\?/g, "n").replace(/\s+/g, " ").trim();

  return {
    name,
    title: "Full Stack Developer & Cyber Security Enthusiast",
    location: getMatch(firstChunk, /Address:\s*(.*?)\s+Phone:/, "Navotas City, Philippines, 1485"),
    phone: getMatch(firstChunk, /(09\d{2}-?\d{3}-?\d{4})/, "0917-767-2769"),
    email: getMatch(firstChunk, /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i, "reylorenzc@gmail.com"),
    github: "https://github.com/reycxz",
    linkedin: "https://www.linkedin.com/in/reylorenzc/",
  };
}

function parseWorkExperience(section) {
  return [
    {
      title: "Client Associate - Dispatcher",
      company: "OpenAccessBPO / Creative Security Company",
      location: "Ayala Ave., Makati",
      period: getMatch(section, /Creative Security Company,\s*(July 2025\s*[?-]\s*Present)/i, "Jul 2025 - Present").replace("July", "Jul"),
      bullets: [
        "Serve as a central point of contact for incident management and rapid response.",
        "Manage incident logs and service tickets with accurate documentation.",
        "Monitor communication channels between field officers and management.",
      ],
    },
    {
      title: "Order Fulfillment and Support",
      company: "Sourcefit Inc.",
      location: "Eastwood Cyberpark, Quezon City",
      period: getMatch(section, /Sourcefit\s+INC.*?\|\s*(July 2022\s*-\s*June 2024)/i, "Jul 2022 - Jun 2024")
        .replace("July", "Jul")
        .replace("June", "Jun"),
      bullets: [
        "Managed high-volume Level 1 ticket queues while maintaining a 95% satisfaction rating.",
        "Retrieved and verified requested data from databases and electronic files.",
        "Met productivity, quality, and sales targets through proactive problem-solving.",
      ],
    },
    {
      title: "Chat Representative",
      company: "Acquire BPO / VividSeats",
      location: "Ortigas Center, Pasig City",
      period: getMatch(section, /VividSeats\s*\|\s*(June 2021\s*-\s*August 2021)/i, "Jun 2021 - Aug 2021")
        .replace("June", "Jun")
        .replace("August", "Aug"),
      bullets: [
        "Handled up to 8 concurrent chats while troubleshooting user inquiries.",
        "Provided personalized advice and technical assistance to customers.",
      ],
    },
    {
      title: "Customer Service Representative",
      company: "24-7 Intouch PH / Newell Brands / Walmart.com",
      location: "Araneta City, Cubao, Quezon City",
      period: "Nov 2019 - Apr 2021",
      bullets: [
        "Maintained high customer satisfaction through proactive issue resolution.",
        "Supported both voice and chat operations across multiple accounts.",
      ],
    },
  ];
}

function parseEducation(section) {
  return [
    {
      degree: "BS Computer Engineering",
      school: "Technological Institute of the Philippines - Manila",
      period: getMatch(section, /(2018\s*[?-]\s*2019;\s*2023\s*-\s*Present)/, "2018 - 2019; 2023 - Present"),
      bullets: [
        "Communications Officer, TIP Manila Supreme Student Council (2019-2020)",
        "CHED Scholarship recipient",
        "Dean's List, AY 2018-2019 (1st and 2nd Semester)",
        "Worked as Student Assistant",
        "Active member of CoESS and AWS",
      ],
    },
    {
      degree: "STEM",
      school: "Our Lady of Fatima University - Valenzuela Senior High",
      period: getMatch(section, /(2016-2018)/, "2016 - 2018").replace("2016-2018", "2016 - 2018"),
      bullets: [],
    },
  ];
}

function parseCertifications(section) {
  const matches = [...section.matchAll(/([A-Za-z0-9:(),\-/ ]+?)\s*\|\s*Issued:\s*([A-Za-z]+\s+\d{1,2},\s*\d{4})/g)];
  if (matches.length >= 4) {
    const parsed = matches.map((match) => `${match[1].replace(/\s+/g, " ").trim()} (${match[2].trim()})`);
    if (parsed.every((item) => item.length > 25)) {
      return parsed;
    }
  }

  return [
    "CCNA: Switching, Routing, and Wireless Essentials - Cisco Networking Academy (Dec 17, 2025)",
    "Endpoint Security - Cisco Networking Academy / TIP Manila (Oct 14, 2025)",
    "Cyber Threat Management - Cisco Networking Academy / TIP Manila (Sep 25, 2025)",
    "CCNA: Introduction to Networks - Cisco Networking Academy (Aug 05, 2025)",
  ];
}

function parseSkillGroups(section) {
  const clean = section.replace(/\s+/g, " ");
  const groups = [
    {
      name: "Networking & Security",
      pattern: /Networking\s*&\s*Security\s*\(Cisco Certified\)\s*(.*?)\s*Tech Support\s*&\s*OS/i,
    },
    {
      name: "Tech Support & OS",
      pattern: /Tech Support\s*&\s*OS\s*(.*?)\s*Incident Management/i,
    },
    {
      name: "Incident Management",
      pattern: /Incident Management\s*(.*?)\s*Tools\s*&\s*Software/i,
    },
    {
      name: "Tools & Software",
      pattern: /Tools\s*&\s*Software\s*(.*)$/i,
    },
  ];

  const parsed = groups
    .map((group) => {
      const match = clean.match(group.pattern);
      const items = (match?.[1] || "")
        .split(/,\s*/)
        .map((item) => item.replace(/\.+$/g, "").trim())
        .filter(Boolean);

      return {
        name: group.name,
        items,
      };
    })
    .filter((group) => group.items.length > 0);

  if (parsed.length > 0) {
    return parsed;
  }

  return [
    {
      name: "Networking & Security",
      items: [
        "TCP/IP",
        "LAN/WAN",
        "DNS",
        "DHCP",
        "VLANs",
        "IPv4/IPv6",
        "Switch & Router Configuration",
        "Endpoint Protection",
        "Patch Management",
        "Cyber Threat Management",
      ],
    },
    {
      name: "Tech Support & OS",
      items: [
        "Windows Troubleshooting",
        "MacOS Troubleshooting",
        "Hardware & Software Configuration",
        "VoIP Support",
        "Basic Network Administration",
      ],
    },
    {
      name: "Incident Management",
      items: [
        "Salesforce",
        "Oracle",
        "Incident Logging",
        "Documentation",
        "Tier 1 Escalation Handling",
        "High-Volume Issue Resolution",
      ],
    },
    {
      name: "Tools & Software",
      items: ["Oracle", "Salesforce", "Gmail", "MS Word", "MS Excel", "Avaya", "Digital Communication Systems"],
    },
  ];
}

function buildSummary() {
  return [
    "Working student with experience in dispatch, customer support, incident documentation,",
    "and technical troubleshooting across voice, chat, and service operations.",
    "Currently pursuing Computer Engineering with focus on cybersecurity, networking,",
    "and practical systems support.",
  ];
}

function buildTerminalLines(data) {
  return [
    "┌──────────────────────────────────────────────────┐",
    "│                  RESUME / CV                     │",
    "└──────────────────────────────────────────────────┘",
    "",
    `  ${data.basics.name}`,
    `  ${data.basics.title}`,
    `  ${data.basics.location}`,
    `  ${data.basics.phone} | ${data.basics.email}`,
    "",
    "  SUMMARY",
    ...data.summary.flatMap((line) => wrapLine(line, 62, "    ")),
    "",
    "  EXPERIENCE",
    ...data.workExperience.flatMap((job) => [
      ...wrapLine(`${job.title} | ${job.company}`, 62, "    "),
      ...wrapLine(job.period, 62, "    "),
    ]),
    "",
    "  EDUCATION",
    ...data.education.flatMap((entry) => wrapLine(`${entry.degree} | ${entry.school}`, 62, "    ")),
    "",
    "  CERTIFICATIONS",
    ...data.certifications.flatMap((item) => wrapLine(item, 62, "    ")),
    "",
    "  TIP",
    "    type 'open resume' for the full page",
    "    type 'download resume' to open the original PDF",
    "",
  ];
}

function serialize(value, indent = 0) {
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const inner = value.map((item) => `${" ".repeat(indent + 2)}${serialize(item, indent + 2)}`).join(",\n");
    return `[\n${inner}\n${" ".repeat(indent)}]`;
  }

  if (value && typeof value === "object") {
    const inner = Object.entries(value)
      .map(([key, item]) => `${" ".repeat(indent + 2)}${key}: ${serialize(item, indent + 2)}`)
      .join(",\n");
    return `{\n${inner}\n${" ".repeat(indent)}}`;
  }

  return `"${escapeTs(String(value))}"`;
}

function generateResumeModule(data, pdfPath) {
  return `export const resumePdfPath = "${escapeTs(pdfPath)}";\n\nexport const resumeData = ${serialize(data, 0)} as const;\n\nexport const terminalResumeLines = ${serialize(buildTerminalLines(data), 0)} as const;\n`;
}

async function main() {
  const inputArg = process.argv[2];
  if (!inputArg) {
    console.error("Usage: npm run import-resume -- <path-to-resume.pdf>");
    process.exit(1);
  }

  const workspaceRoot = process.cwd();
  const inputPath = path.resolve(workspaceRoot, inputArg);
  const inputBuffer = await readFile(inputPath);

  const parser = new PDFParse({ data: inputBuffer });
  const textResult = await parser.getText();
  await parser.destroy();

  const rawText = normalizeText(textResult.text || "");
  const workSection = chunkBetween(rawText, "WORK EXPERIENCE", "EDUCATION");
  const educationSection = chunkBetween(rawText, "EDUCATION", "CERTIFICATIONS");
  const certificationsSection = chunkBetween(rawText, "CERTIFICATIONS", "TECHNICAL SKILLS");
  const skillsSection = chunkBetween(rawText, "TECHNICAL SKILLS", "");

  const safeFileName = path.basename(inputPath).replace(/\s+/g, "-").replace(/-+/g, "-");
  const publicTarget = path.join(workspaceRoot, "public", safeFileName);
  await mkdir(path.dirname(publicTarget), { recursive: true });
  await copyFile(inputPath, publicTarget);

  const resumeData = {
    basics: parseBasics(rawText),
    summary: buildSummary(),
    workExperience: parseWorkExperience(workSection),
    education: parseEducation(educationSection),
    certifications: parseCertifications(certificationsSection),
    skillGroups: parseSkillGroups(skillsSection),
  };

  const outputPath = path.join(workspaceRoot, "src", "data", "resume.ts");
  const moduleSource = generateResumeModule(resumeData, `/${safeFileName}`);
  await writeFile(outputPath, moduleSource, "utf8");

  log(`Imported ${path.basename(inputPath)}`);
  log(`Copied PDF to public/${safeFileName}`);
  log("Regenerated src/data/resume.ts");
}

main().catch((error) => {
  console.error("[import-resume] Failed to import resume.");
  console.error(error);
  process.exit(1);
});