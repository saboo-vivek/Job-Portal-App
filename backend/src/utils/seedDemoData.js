const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Job = require("../models/job.model");
const Application = require("../models/application.model");

/**
 * Public demonstration accounts and realistic job seed script.
 * Fully idempotent: Safe to execute repeatedly without duplicating records or dropping tables.
 */

const DEMO_PASSWORD = "Demo@12345";

// Primary Demo Users Configuration
const DEMO_USERS = [
  {
    name: "Alex Rivera",
    email: "demo.seeker@jobexecutive.com",
    role: "SEEKER",
    phone: "+91 98765 43210",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "Next.js",
      "Tailwind CSS",
      "MongoDB",
      "Docker",
      "GraphQL",
      "REST APIs",
    ],
    resumeUrl: "https://drive.google.com/file/d/1DemoSeekerResumeExecutive2026/view?usp=sharing",
    expectedSalary: 1600000,
    jobAlertsEnabled: true,
    jobAlertsPreferences: {
      keywords: ["Full Stack", "Frontend", "Backend", "React", "Node.js"],
      jobTypes: ["Full-Time", "Contract"],
      locationTypes: ["Remote", "Hybrid"],
      minSalary: 1400000,
    },
    isDemo: true,
  },
  {
    name: "Nexus Tech Innovations",
    email: "demo.employer@jobexecutive.com",
    role: "EMPLOYER",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200",
    description:
      "Enterprise cloud infrastructure, generative AI systems, and scalable developer tools trusted by Fortune 500 engineering organizations worldwide.",
    website: "https://nexustech.io",
    contactInfo: "+91 (80) 4567-8900 • careers@nexustech.io",
    officeAddress: "Prestige Tech Park, Outer Ring Road, Bengaluru, Karnataka 560103",
    reviews: [
      {
        reviewerName: "Rahul Sharma",
        rating: 5,
        comment:
          "Exceptional engineering culture with high degree of autonomy, world-class mentorship, and great work-life balance.",
        date: new Date("2026-01-15"),
      },
      {
        reviewerName: "Priya Nair",
        rating: 4,
        comment:
          "Challenging technical problems at massive scale. Great compensation packages and modern tech stacks.",
        date: new Date("2026-02-02"),
      },
    ],
    isDemo: true,
  },
  {
    name: "Job Executive Root Admin",
    email: "demo.admin@jobexecutive.com",
    role: "ADMIN",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    isDemo: true,
  },
];

// Additional partner employer profiles to provide authentic diversity
const PARTNER_EMPLOYERS = [
  {
    name: "CloudScale Systems",
    email: "careers@cloudscalesystems.in",
    role: "EMPLOYER",
    logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=200",
    description: "Cloud-native Kubernetes orchestration and distributed microservices platform.",
    website: "https://cloudscale.in",
    contactInfo: "+91 (40) 6789-0123",
    officeAddress: "Hitec City, Madhapur, Hyderabad, Telangana 500081",
    isDemo: true,
  },
  {
    name: "Aether AI Labs",
    email: "talent@aetherailabs.com",
    role: "EMPLOYER",
    logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=200",
    description: "Applied research lab commercializing large multimodal models and autonomous agents.",
    website: "https://aetherailabs.com",
    contactInfo: "+91 (124) 432-1000",
    officeAddress: "Cyber City, DLF Phase 2, Gurugram, Haryana 122002",
    isDemo: true,
  },
  {
    name: "FinEdge Technologies",
    email: "people@finedgetech.com",
    role: "EMPLOYER",
    logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=200",
    description: "Algorithmic payment rails and digital banking infrastructure for high-growth commerce.",
    website: "https://finedgetech.com",
    contactInfo: "+91 (22) 2850-9900",
    officeAddress: "Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051",
    isDemo: true,
  },
];

// 36+ Comprehensive & Realistic Indian Job Postings across all required fields
const SEEDED_JOBS_SPEC = [
  // 1. Software Development & Architecture
  {
    title: "Senior Full Stack Engineer (React & Node.js)",
    description:
      "Design and architect high-throughput microservices using React 19, TypeScript, and Node.js. You will lead technical design reviews, improve API throughput, and mentor engineers across sprint cycles.",
    location: "Bengaluru, Karnataka",
    experienceLevel: "Senior",
    salaryMin: 2200000,
    salaryMax: 3200000,
    jobType: "Full-Time",
    locationType: "Hybrid",
    employerEmail: "demo.employer@jobexecutive.com",
  },
  {
    title: "Lead Frontend Architect (React, Next.js, Design Systems)",
    description:
      "Drive frontend architecture across global SaaS applications. Build high-performance component systems, establish WebGL visualizations, and enforce sub-second Core Web Vitals.",
    location: "Bengaluru, Karnataka",
    experienceLevel: "Lead / Staff",
    salaryMin: 3000000,
    salaryMax: 4200000,
    jobType: "Full-Time",
    locationType: "Remote",
    employerEmail: "demo.employer@jobexecutive.com",
  },
  {
    title: "Junior Frontend Developer (React & TypeScript)",
    description:
      "Collaborate with UI/UX designers to implement responsive landing pages, interactive dashboards, and client-side data visualizations. Excellent opportunity for fast career growth.",
    location: "Pune, Maharashtra",
    experienceLevel: "Entry",
    salaryMin: 600000,
    salaryMax: 900000,
    jobType: "Full-Time",
    locationType: "Hybrid",
    employerEmail: "demo.employer@jobexecutive.com",
  },
  {
    title: "Backend Engineer (Go & Distributed Systems)",
    description:
      "Build ultra-low latency event-driven backend microservices using Golang, Kafka, and Redis. Handle millions of concurrent WebSocket transactions and optimize database writes.",
    location: "Hyderabad, Telangana",
    experienceLevel: "Mid-Level",
    salaryMin: 1600000,
    salaryMax: 2400000,
    jobType: "Full-Time",
    locationType: "On-site",
    employerEmail: "careers@cloudscalesystems.in",
  },

  // 2. Java & Python Development
  {
    title: "Senior Java Microservices Architect (Spring Boot)",
    description:
      "Lead enterprise Java development using Spring Boot, Spring Cloud, and Docker. Optimize multi-tenant database clusters, integrate message brokers, and ensure 99.99% uptime.",
    location: "Pune, Maharashtra",
    experienceLevel: "Senior",
    salaryMin: 2400000,
    salaryMax: 3500000,
    jobType: "Full-Time",
    locationType: "Hybrid",
    employerEmail: "people@finedgetech.com",
  },
  {
    title: "Python Backend Developer (FastAPI & Celery)",
    description:
      "Develop asynchronous REST and GraphQL APIs using FastAPI, PostgreSQL, and Celery worker pools. Integrate machine learning inference pipelines into consumer-facing platforms.",
    location: "Noida, Delhi NCR",
    experienceLevel: "Mid-Level",
    salaryMin: 1400000,
    salaryMax: 2000000,
    jobType: "Full-Time",
    locationType: "Hybrid",
    employerEmail: "talent@aetherailabs.com",
  },
  {
    title: "Java Developer (Fresher / Graduate Trainee)",
    description:
      "Exciting entry-level position for recent CS/IT graduates. Undergo structured engineering training in Core Java, RESTful web services, Git workflows, and unit testing frameworks.",
    location: "Chennai, Tamil Nadu",
    experienceLevel: "Fresher",
    salaryMin: 450000,
    salaryMax: 650000,
    jobType: "Full-Time",
    locationType: "On-site",
    employerEmail: "demo.employer@jobexecutive.com",
  },

  // 3. Data Science & Machine Learning / AI
  {
    title: "Senior Data Scientist (Predictive Modeling & NLP)",
    description:
      "Apply statistical methods and machine learning models to large-scale behavioral data. Experience with PyTorch, Scikit-Learn, and building automated model retraining pipelines is essential.",
    location: "Bengaluru, Karnataka",
    experienceLevel: "Senior",
    salaryMin: 2600000,
    salaryMax: 3800000,
    jobType: "Full-Time",
    locationType: "Hybrid",
    employerEmail: "talent@aetherailabs.com",
  },
  {
    title: "Machine Learning Engineer (LLM Fine-Tuning & RAG)",
    description:
      "Deploy generative AI applications using LangChain, vLLM, and vector search databases (Milvus / Pinecone). Fine-tune open weights models (Llama 3, Mistral) for enterprise retrieval.",
    location: "Gurugram, Haryana",
    experienceLevel: "Mid-Level",
    salaryMin: 2000000,
    salaryMax: 2800000,
    jobType: "Full-Time",
    locationType: "Remote",
    employerEmail: "talent@aetherailabs.com",
  },
  {
    title: "Data Analyst (SQL, Tableau, Python)",
    description:
      "Transform complex business metrics into intuitive executive dashboards. Write optimized SQL analytical queries, build ETL workflows in dbt, and uncover actionable growth opportunities.",
    location: "Mumbai, Maharashtra",
    experienceLevel: "1-3 years",
    salaryMin: 800000,
    salaryMax: 1300000,
    jobType: "Full-Time",
    locationType: "Hybrid",
    employerEmail: "people@finedgetech.com",
  },
  {
    title: "AI Research Intern (Computer Vision / GenAI)",
    description:
      "3-6 month internship for passionate students or early researchers. Assist in implementing diffusion models, evaluating benchmark datasets, and contributing to open-source toolkits.",
    location: "Bengaluru, Karnataka",
    experienceLevel: "Internship",
    salaryMin: 350000,
    salaryMax: 500000,
    jobType: "Internship",
    locationType: "Hybrid",
    employerEmail: "talent@aetherailabs.com",
  },

  // 4. DevOps & Cloud Engineering
  {
    title: "DevOps & Site Reliability Engineer (Kubernetes, AWS)",
    description:
      "Manage multi-region AWS cloud infrastructure using Terraform, Helm, and GitHub Actions. Implement zero-downtime canary deployments, Prometheus alerting, and automated disaster recovery.",
    location: "Hyderabad, Telangana",
    experienceLevel: "Senior",
    salaryMin: 2200000,
    salaryMax: 3200000,
    jobType: "Full-Time",
    locationType: "Remote",
    employerEmail: "careers@cloudscalesystems.in",
  },
  {
    title: "Cloud Infrastructure Engineer (GCP & Terraform)",
    description:
      "Provision and govern secure Google Cloud environments (GKE, Cloud SQL, Pub/Sub). Enforce infrastructure-as-code best practices, cost optimization, and IAM security guardrails.",
    location: "Bengaluru, Karnataka",
    experienceLevel: "Mid-Level",
    salaryMin: 1500000,
    salaryMax: 2200000,
    jobType: "Full-Time",
    locationType: "Hybrid",
    employerEmail: "careers@cloudscalesystems.in",
  },

  // 5. Cybersecurity
  {
    title: "Information Security & DevSecOps Specialist",
    description:
      "Lead application security testing (SAST/DAST), vulnerability management, and cloud posture security. Conduct penetration tests and implement SOC 2 / ISO 27001 compliance policies.",
    location: "Delhi NCR",
    experienceLevel: "Senior",
    salaryMin: 2400000,
    salaryMax: 3400000,
    jobType: "Full-Time",
    locationType: "Hybrid",
    employerEmail: "demo.employer@jobexecutive.com",
  },
  {
    title: "SOC Security Analyst (Incident Response)",
    description:
      "Monitor SIEM alerts, triage security events, investigate phishing attempts, and participate in incident response runbooks to safeguard enterprise endpoints and databases.",
    location: "Mumbai, Maharashtra",
    experienceLevel: "1-3 years",
    salaryMin: 900000,
    salaryMax: 1400000,
    jobType: "Full-Time",
    locationType: "On-site",
    employerEmail: "people@finedgetech.com",
  },

  // 6. UI/UX Design & Product Management
  {
    title: "Senior Product Designer (UI/UX & Design Systems)",
    description:
      "Lead end-to-end design for complex B2B workflow software. Craft comprehensive component libraries in Figma, conduct user discovery interviews, and prototype interactive states.",
    location: "Bengaluru, Karnataka",
    experienceLevel: "Senior",
    salaryMin: 1800000,
    salaryMax: 2800000,
    jobType: "Full-Time",
    locationType: "Remote",
    employerEmail: "demo.employer@jobexecutive.com",
  },
  {
    title: "Product Manager (SaaS & Developer Platforms)",
    description:
      "Own product roadmap, feature requirements (PRDs), sprint backlogs, and go-to-market execution. Partner with engineering and sales leaders to deliver high-retention enterprise features.",
    location: "Gurugram, Haryana",
    experienceLevel: "Senior",
    salaryMin: 2400000,
    salaryMax: 3600000,
    jobType: "Full-Time",
    locationType: "Hybrid",
    employerEmail: "demo.employer@jobexecutive.com",
  },
  {
    title: "Associate Product Manager (APM)",
    description:
      "Work directly with senior product managers to gather customer feedback, run A/B conversion experiments, define user stories, and track product analytics metrics in Mixpanel.",
    location: "Bengaluru, Karnataka",
    experienceLevel: "Entry",
    salaryMin: 1000000,
    salaryMax: 1500000,
    jobType: "Full-Time",
    locationType: "On-site",
    employerEmail: "demo.employer@jobexecutive.com",
  },

  // 7. Digital Marketing & Business Development
  {
    title: "Growth & Digital Marketing Lead (B2B SaaS)",
    description:
      "Oversee organic SEO, content distribution, paid performance marketing (LinkedIn/Google Ads), and outbound funnel optimization. Scale organic inbound leads across tech sectors.",
    location: "Mumbai, Maharashtra",
    experienceLevel: "Mid-Level",
    salaryMin: 1300000,
    salaryMax: 1900000,
    jobType: "Full-Time",
    locationType: "Hybrid",
    employerEmail: "demo.employer@jobexecutive.com",
  },
  {
    title: "Business Development Representative (Enterprise Tech)",
    description:
      "Generate new enterprise pipeline through strategic outreach, product demonstrations, and qualification of inbound prospects. Uncapped performance incentives provided.",
    location: "Noida, Delhi NCR",
    experienceLevel: "1-3 years",
    salaryMin: 700000,
    salaryMax: 1100000,
    jobType: "Full-Time",
    locationType: "On-site",
    employerEmail: "careers@cloudscalesystems.in",
  },
  {
    title: "Enterprise Account Executive (FinTech Solutions)",
    description:
      "Manage high-value enterprise sales cycles from discovery to contract closing. Negotiate commercial terms with CTOs and Heads of Infrastructure across banking and retail sectors.",
    location: "Mumbai, Maharashtra",
    experienceLevel: "Senior",
    salaryMin: 2200000,
    salaryMax: 3500000,
    jobType: "Full-Time",
    locationType: "Hybrid",
    employerEmail: "people@finedgetech.com",
  },

  // 8. Human Resources & Talent Acquisition
  {
    title: "Technical Talent Acquisition Lead",
    description:
      "Spearhead full-cycle technical recruiting across senior engineering, product, and AI research hires. Build candidate talent pools, negotiate offers, and elevate employer branding.",
    location: "Bengaluru, Karnataka",
    experienceLevel: "Mid-Level",
    salaryMin: 1200000,
    salaryMax: 1800000,
    jobType: "Full-Time",
    locationType: "Hybrid",
    employerEmail: "demo.employer@jobexecutive.com",
  },
  {
    title: "People Operations & HR Specialist",
    description:
      "Oversee employee onboarding, cultural programs, compliance, benefits administration, and HR policies across distributed engineering teams throughout India.",
    location: "Pune, Maharashtra",
    experienceLevel: "1-3 years",
    salaryMin: 750000,
    salaryMax: 1100000,
    jobType: "Full-Time",
    locationType: "Hybrid",
    employerEmail: "demo.employer@jobexecutive.com",
  },

  // 9. Finance, Accounting & Operations
  {
    title: "Senior Financial Analyst & Controller",
    description:
      "Manage financial modeling, budget forecasting, investor reporting, and corporate tax compliance. Partner with executive leadership to guide strategic resource allocation.",
    location: "Mumbai, Maharashtra",
    experienceLevel: "Senior",
    salaryMin: 1800000,
    salaryMax: 2600000,
    jobType: "Full-Time",
    locationType: "On-site",
    employerEmail: "people@finedgetech.com",
  },
  {
    title: "Operations & Logistics Manager",
    description:
      "Streamline operational processes, vendor contracts, IT hardware provisioning, and workplace administration to ensure friction-free productivity across remote and physical offices.",
    location: "Ahmedabad, Gujarat",
    experienceLevel: "Mid-Level",
    salaryMin: 1100000,
    salaryMax: 1600000,
    jobType: "Full-Time",
    locationType: "On-site",
    employerEmail: "demo.employer@jobexecutive.com",
  },

  // 10. Customer Support & Success
  {
    title: "Customer Success Manager (Enterprise Accounts)",
    description:
      "Drive product adoption, conduct quarterly business reviews (QBRs), resolve technical roadblocks, and maintain 98%+ enterprise retention across key accounts.",
    location: "Bengaluru, Karnataka",
    experienceLevel: "Mid-Level",
    salaryMin: 1200000,
    salaryMax: 1700000,
    jobType: "Full-Time",
    locationType: "Remote",
    employerEmail: "demo.employer@jobexecutive.com",
  },
  {
    title: "Technical Support Engineer (L2 / Tier 2)",
    description:
      "Troubleshoot API integrations, inspect server logs, isolate bugs, and provide timely resolutions for technical enterprise customers via Zendesk and Slack channels.",
    location: "Kolkata, West Bengal",
    experienceLevel: "1-3 years",
    salaryMin: 650000,
    salaryMax: 950000,
    jobType: "Full-Time",
    locationType: "Remote",
    employerEmail: "careers@cloudscalesystems.in",
  },

  // 11. Additional Diverse Roles (Contract, Part-Time, Hybrid Across Cities)
  {
    title: "Contract React Native Mobile Developer (6-Month Term)",
    description:
      "Build cross-platform iOS and Android mobile features using React Native and Redux Toolkit. Experience with offline caching, push notifications, and App Store releases.",
    location: "Remote, India",
    experienceLevel: "3-5 years",
    salaryMin: 1400000,
    salaryMax: 2000000,
    jobType: "Contract",
    locationType: "Remote",
    employerEmail: "demo.employer@jobexecutive.com",
  },
  {
    title: "Part-Time Technical Content Writer (Engineering Blog)",
    description:
      "Write in-depth developer tutorials, engineering architectural breakdowns, and release overviews for software developers. 20 hours per week flexible schedule.",
    location: "Remote, India",
    experienceLevel: "1-3 years",
    salaryMin: 400000,
    salaryMax: 650000,
    jobType: "Part-Time",
    locationType: "Remote",
    employerEmail: "demo.employer@jobexecutive.com",
  },
  {
    title: "Cybersecurity Analyst (Internship)",
    description:
      "Gain hands-on exposure to vulnerability scanners, threat intelligence gathering, firewall rule reviews, and security awareness campaigns.",
    location: "Delhi NCR",
    experienceLevel: "Internship",
    salaryMin: 300000,
    salaryMax: 450000,
    jobType: "Internship",
    locationType: "On-site",
    employerEmail: "people@finedgetech.com",
  },
  {
    title: "QA Automation Engineer (Cypress, Playwright, Jest)",
    description:
      "Develop robust automated end-to-end and integration test suites. Integrate test automation into continuous delivery pipelines to safeguard release quality.",
    location: "Pune, Maharashtra",
    experienceLevel: "Mid-Level",
    salaryMin: 1200000,
    salaryMax: 1800000,
    jobType: "Full-Time",
    locationType: "Hybrid",
    employerEmail: "demo.employer@jobexecutive.com",
  },
  {
    title: "Staff Data Engineer (Spark, Snowflake, dbt)",
    description:
      "Architect petabyte-scale data lakes and streaming ingestion pipelines using Apache Spark, Kafka, and Snowflake. Enforce data quality and schema governance.",
    location: "Bengaluru, Karnataka",
    experienceLevel: "Lead / Staff",
    salaryMin: 3200000,
    salaryMax: 4400000,
    jobType: "Full-Time",
    locationType: "Hybrid",
    employerEmail: "careers@cloudscalesystems.in",
  },
  {
    title: "Sales Development Executive (Fresher / Graduate)",
    description:
      "Kickstart your technology sales career. Qualify enterprise prospects, book discovery meetings, and master modern CRM and sales automation tools.",
    location: "Ahmedabad, Gujarat",
    experienceLevel: "Fresher",
    salaryMin: 450000,
    salaryMax: 600000,
    jobType: "Full-Time",
    locationType: "On-site",
    employerEmail: "demo.employer@jobexecutive.com",
  },
  {
    title: "Database Administrator (MongoDB & PostgreSQL)",
    description:
      "Maintain high-availability database clusters, configure sharding, optimize slow aggregation pipelines, and execute seamless backup/restore procedures.",
    location: "Chennai, Tamil Nadu",
    experienceLevel: "Senior",
    salaryMin: 2000000,
    salaryMax: 2900000,
    jobType: "Full-Time",
    locationType: "Hybrid",
    employerEmail: "careers@cloudscalesystems.in",
  },
  {
    title: "Lead AI Solutions Architect",
    description:
      "Consult with enterprise clients to design custom AI workflows, evaluate infrastructure readiness, and oversee deployment of high-impact intelligent agents.",
    location: "Gurugram, Haryana",
    experienceLevel: "Lead / Staff",
    salaryMin: 3400000,
    salaryMax: 4800000,
    jobType: "Full-Time",
    locationType: "Hybrid",
    employerEmail: "talent@aetherailabs.com",
  },
];

/**
 * Main seeding function: idempotent, safe, non-destructive.
 */
async function seedDemoData() {
  console.log("🌱 Starting safe database seeding process...");

  try {
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
    const employerMap = new Map();

    // 1. Seed / Update Primary Demo Accounts
    for (const u of DEMO_USERS) {
      const existing = await User.findOne({ email: u.email });
      if (!existing) {
        const created = await User.create({
          ...u,
          password: hashedPassword,
        });
        console.log(`✅ Seeded demo account: ${u.email} (${u.role})`);
        if (u.role === "EMPLOYER") employerMap.set(u.email, created._id);
      } else {
        // Ensure role, name, and demo flag remain consistent without altering real state
        await User.updateOne(
          { _id: existing._id },
          {
            $set: {
              name: u.name,
              role: u.role,
              isDemo: true,
              ...(u.logo && { logo: u.logo }),
              ...(u.photoUrl && { photoUrl: u.photoUrl }),
              ...(u.skills && { skills: u.skills }),
              ...(u.resumeUrl && { resumeUrl: u.resumeUrl }),
              ...(u.expectedSalary && { expectedSalary: u.expectedSalary }),
              ...(u.officeAddress && { officeAddress: u.officeAddress }),
              ...(u.website && { website: u.website }),
              ...(u.contactInfo && { contactInfo: u.contactInfo }),
              ...(u.description && { description: u.description }),
            },
          }
        );
        console.log(`✔ Demo account verified: ${u.email}`);
        if (u.role === "EMPLOYER") employerMap.set(u.email, existing._id);
      }
    }

    // 2. Seed / Update Partner Employer Profiles
    for (const p of PARTNER_EMPLOYERS) {
      const existing = await User.findOne({ email: p.email });
      if (!existing) {
        const created = await User.create({
          ...p,
          password: hashedPassword,
        });
        console.log(`✅ Seeded partner employer: ${p.name}`);
        employerMap.set(p.email, created._id);
      } else {
        await User.updateOne({ _id: existing._id }, { $set: { isDemo: true } });
        employerMap.set(p.email, existing._id);
      }
    }

    const defaultEmployerId = employerMap.get("demo.employer@jobexecutive.com");

    // 3. Seed Realistic Job Vacancies (Idempotent per Title + Employer)
    let seededJobCount = 0;
    const seededJobIds = [];

    for (const jobSpec of SEEDED_JOBS_SPEC) {
      const employerId = employerMap.get(jobSpec.employerEmail) || defaultEmployerId;

      const existingJob = await Job.findOne({
        title: jobSpec.title,
        employerId: employerId,
      });

      if (!existingJob) {
        const newJob = await Job.create({
          title: jobSpec.title,
          description: jobSpec.description,
          location: jobSpec.location,
          experienceLevel: jobSpec.experienceLevel,
          salaryMin: jobSpec.salaryMin,
          salaryMax: jobSpec.salaryMax,
          jobType: jobSpec.jobType,
          locationType: jobSpec.locationType,
          employerId: employerId,
          isDemo: true,
          applicants: [],
          shortlisted: [],
          rejected: [],
        });
        seededJobIds.push(newJob._id);
        seededJobCount++;
      } else {
        await Job.updateOne(
          { _id: existingJob._id },
          {
            $set: {
              isDemo: true,
              description: jobSpec.description,
              salaryMin: jobSpec.salaryMin,
              salaryMax: jobSpec.salaryMax,
              location: jobSpec.location,
              experienceLevel: jobSpec.experienceLevel,
              jobType: jobSpec.jobType,
              locationType: jobSpec.locationType,
            },
          }
        );
        seededJobIds.push(existingJob._id);
      }
    }

    console.log(`💼 Seeded/Verified ${SEEDED_JOBS_SPEC.length} job postings (${seededJobCount} new)`);

    // 4. Seed sample application for demo seeker to demo employer job
    const demoSeeker = await User.findOne({ email: "demo.seeker@jobexecutive.com" });
    if (demoSeeker && seededJobIds.length > 0) {
      const sampleJobId = seededJobIds[0];
      const existingApp = await Application.findOne({
        jobId: sampleJobId,
        seekerId: demoSeeker._id,
      });

      if (!existingApp) {
        const app = await Application.create({
          jobId: sampleJobId,
          seekerId: demoSeeker._id,
          status: "SHORTLISTED",
        });

        await User.findByIdAndUpdate(demoSeeker._id, {
          $addToSet: { appliedJobs: sampleJobId },
        });

        await Job.findByIdAndUpdate(sampleJobId, {
          $addToSet: { applicants: demoSeeker._id, shortlisted: demoSeeker._id },
        });

        console.log(`📄 Seeded demonstration application link: ${app._id}`);
      }
    }

    console.log("✨ Safe database seeding finished successfully.");
    return { success: true, count: SEEDED_JOBS_SPEC.length };
  } catch (err) {
    console.error("❌ Error during demo data seeding:", err);
    throw err;
  }
}

// Allow standalone execution: `node src/utils/seedDemoData.js`
if (require.main === module) {
  require("dotenv").config();
  const mongoose = require("mongoose");
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jobexecutive";

  mongoose
    .connect(mongoUri)
    .then(async () => {
      console.log("Connected to MongoDB for standalone seeding...");
      await seedDemoData();
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Failed to connect or seed:", err);
      process.exit(1);
    });
}

module.exports = seedDemoData;
