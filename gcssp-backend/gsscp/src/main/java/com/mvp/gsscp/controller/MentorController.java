package com.mvp.gsscp.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/mentor")
public class MentorController {

    @GetMapping("/roadmap")
    public Map<String, Object> generateRoadmap(@RequestParam String goal) {
        goal = goal == null ? "" : goal.toLowerCase();
        Map<String, Object> roadmap = new LinkedHashMap<>();
        List<Map<String, Object>> steps = new ArrayList<>();

        // --- Focused maps (existing behavior) ---
        if (goal.contains("ai") || goal.contains("machine")) {
            roadmap.put("career", "AI Engineer");
            roadmap.put("summary", "Master Artificial Intelligence, Machine Learning, and Deep Learning to build intelligent systems.");

            steps.add(step(
                    "Learn Python",
                    "Start with Python basics and libraries like NumPy, Pandas, and Matplotlib.",
                    new String[]{
                            "https://www.w3schools.com/python/",
                            "https://www.learnpython.org/",
                            "https://www.youtube.com/watch?v=_uQrJ0TkZlc"
                    }
            ));

            steps.add(step(
                    "Math for Machine Learning",
                    "Learn Linear Algebra, Calculus, and Probability — the foundation for ML models.",
                    new String[]{
                            "https://www.khanacademy.org/math/linear-algebra",
                            "https://www.coursera.org/learn/machine-learning-math",
                            "https://www.3blue1brown.com/topics/linear-algebra"
                    }
            ));

            steps.add(step(
                    "Machine Learning",
                    "Understand supervised & unsupervised learning using scikit-learn.",
                    new String[]{
                            "https://scikit-learn.org/stable/",
                            "https://www.youtube.com/watch?v=GwIo3gDZCVQ",
                            "https://www.coursera.org/learn/machine-learning"
                    }
            ));

            steps.add(step(
                    "Deep Learning",
                    "Learn TensorFlow and PyTorch to train neural networks (CNNs, RNNs, Transformers).",
                    new String[]{
                            "https://www.tensorflow.org/learn",
                            "https://pytorch.org/tutorials/",
                            "https://www.deeplearning.ai/"
                    }
            ));

            steps.add(step(
                    "Projects & Portfolio",
                    "Build and publish AI projects — image classifier, chatbot, or recommendation system.",
                    new String[]{
                            "https://github.com/topics/machine-learning-projects",
                            "https://www.kaggle.com/",
                            "https://www.tensorflow.org/tutorials"
                    }
            ));
        }

        else if (goal.contains("web")) {
            roadmap.put("career", "Web Developer");
            roadmap.put("summary", "Learn full-stack web development — front-end, back-end, and deployment.");

            steps.add(step("HTML, CSS, JS", "Start with front-end basics.", new String[]{
                    "https://developer.mozilla.org/en-US/docs/Web",
                    "https://www.freecodecamp.org/learn",
                    "https://www.youtube.com/watch?v=3JluqTojuME"
            }));

            steps.add(step("Frontend Frameworks", "Learn React or Angular for building dynamic UIs.", new String[]{
                    "https://react.dev/learn",
                    "https://angular.io/start",
                    "https://www.youtube.com/watch?v=bMknfKXIFA8"
            }));

            steps.add(step("Backend Development", "Build REST APIs using Node.js, Express, or Spring Boot.", new String[]{
                    "https://expressjs.com/",
                    "https://spring.io/guides",
                    "https://www.youtube.com/watch?v=Oe421EPjeBE"
            }));

            steps.add(step("Databases", "Work with MySQL or MongoDB to store data.", new String[]{
                    "https://www.mongodb.com/docs/",
                    "https://dev.mysql.com/doc/",
                    "https://www.youtube.com/watch?v=7S_tz1z_5bA"
            }));

            steps.add(step("Deployment", "Deploy your apps using Vercel, AWS, or Docker.", new String[]{
                    "https://vercel.com/docs",
                    "https://aws.amazon.com/getting-started/",
                    "https://docs.docker.com/get-started/"
            }));
        }

        else if (goal.contains("data")) {
            roadmap.put("career", "Data Scientist");
            roadmap.put("summary", "Learn to collect, clean, visualize, and analyze data to gain insights.");

            steps.add(step("Python & Statistics", "Use Pandas, NumPy, and Matplotlib.", new String[]{
                    "https://pandas.pydata.org/docs/",
                    "https://numpy.org/learn/",
                    "https://www.youtube.com/watch?v=r-uOLxNrNk8"
            }));

            steps.add(step("SQL & Databases", "Master data extraction and analysis.", new String[]{
                    "https://www.w3schools.com/sql/",
                    "https://mode.com/sql-tutorial/",
                    "https://www.kaggle.com/learn/intro-to-sql"
            }));

            steps.add(step("Machine Learning", "Build regression, classification, and clustering models.", new String[]{
                    "https://scikit-learn.org/stable/",
                    "https://www.youtube.com/watch?v=7eh4d6sabA0",
                    "https://www.coursera.org/learn/machine-learning"
            }));

            steps.add(step("Visualization", "Use Power BI, Tableau, or Seaborn to present data.", new String[]{
                    "https://public.tableau.com/en-us/s/resources",
                    "https://powerbi.microsoft.com/en-us/",
                    "https://seaborn.pydata.org/tutorial.html"
            }));

            steps.add(step("Portfolio Projects", "Publish case studies and notebooks.", new String[]{
                    "https://www.kaggle.com/",
                    "https://github.com/topics/data-analysis",
                    "https://medium.com/tag/data-science"
            }));
        }

        else if (goal.contains("cyber")) {
            roadmap.put("career", "Cybersecurity Analyst");
            roadmap.put("summary", "Learn how to secure systems, networks, and applications.");

            steps.add(step("Networking Basics", "Understand TCP/IP, DNS, and protocols.", new String[]{
                    "https://www.coursera.org/learn/comptia-networkplus",
                    "https://www.geeksforgeeks.org/computer-network-tutorials/",
                    "https://www.youtube.com/watch?v=qiQR5rTSshw"
            }));

            steps.add(step("Linux & Scripting", "Use Linux commands and Bash scripting for automation.", new String[]{
                    "https://ubuntu.com/tutorials/command-line-for-beginners",
                    "https://www.learnshell.org/",
                    "https://www.youtube.com/watch?v=oxuRxtrO2Ag"
            }));

            steps.add(step("Ethical Hacking", "Learn to find vulnerabilities and test security.", new String[]{
                    "https://www.udemy.com/course/learn-ethical-hacking-from-scratch/",
                    "https://www.hackthebox.com/",
                    "https://owasp.org/"
            }));

            steps.add(step("Security Tools", "Work with Wireshark, Burp Suite, and Nmap.", new String[]{
                    "https://www.wireshark.org/docs/",
                    "https://portswigger.net/burp",
                    "https://nmap.org/book/inst-windows.html"
            }));

            steps.add(step("Certifications", "Get CEH, CompTIA Security+, or OSCP.", new String[]{
                    "https://www.eccouncil.org/",
                    "https://www.comptia.org/",
                    "https://www.offsec.com/"
            }));
        }

        // --- If no focused keyword or 'all' requested: provide extended guide ---
        else {
            roadmap.put("career", "General Tech Roadmap");
            roadmap.put("summary", "A well-rounded plan for growing in software & tech careers.");

            steps.add(step("Programming Basics", "Learn Python or Java.", new String[]{
                    "https://www.w3schools.com/python/",
                    "https://www.learnjavaonline.org/",
                    "https://www.freecodecamp.org/"
            }));

            steps.add(step("Data Structures & Algorithms", "Master the fundamentals for interviews & building efficient systems.", new String[]{
                    "https://www.geeksforgeeks.org/data-structures/",
                    "https://visualgo.net/",
                    "https://www.youtube.com/watch?v=8hly31xKli0"
            }));

            steps.add(step("Build Projects", "Make projects that solve real problems and put them on GitHub.", new String[]{
                    "https://github.com/topics/beginner-project",
                    "https://devpost.com/",
                    "https://www.freecodecamp.org/news/project-ideas-for-beginners/"
            }));

            steps.add(step("Soft Skills & Communication", "Learn to communicate clearly, write docs, and work in teams.", new String[]{
                    "https://www.coursera.org/specializations/communication-skills",
                    "https://grammarly.com/",
                    "https://writingcenter.unc.edu/tips-and-tools/"
            }));
        }

        // --- Add extended guide section (technical + non-technical + branches) ---
        roadmap.put("detailedGuide", buildDetailedGuide());

        // keep original steps for focused cases
        roadmap.put("steps", steps);
        return roadmap;
    }

    // Build a richer guide containing technical roles, non-technical roles, and engineering branches
    private Map<String, Object> buildDetailedGuide() {
        Map<String, Object> guide = new LinkedHashMap<>();

        // Technical Roles
        List<Map<String, Object>> technical = new ArrayList<>();
        technical.add(role("AI / ML Engineer",
                "Work on models, data pipelines and productionizing ML.",
                new String[]{
                        "https://www.coursera.org/specializations/deep-learning",
                        "https://www.kaggle.com/learn/overview",
                        "https://www.fast.ai/"
                }));
        technical.add(role("Full-stack Web Developer",
                "Frontend + backend + database + deployment.",
                new String[]{
                        "https://react.dev/learn",
                        "https://expressjs.com/",
                        "https://developer.mozilla.org/en-US/docs/Web"
                }));
        technical.add(role("Mobile Developer",
                "Build native / cross-platform mobile apps.",
                new String[]{
                        "https://developer.android.com/",
                        "https://developer.apple.com/ios/",
                        "https://reactnative.dev/docs/getting-started"
                }));
        technical.add(role("DevOps / SRE",
                "CI/CD, infra as code, monitoring and reliability.",
                new String[]{
                        "https://www.freecodecamp.org/news/what-is-devops/",
                        "https://aws.amazon.com/getting-started/",
                        "https://www.hashicorp.com/terraform"
                }));
        technical.add(role("Embedded Systems / IoT",
                "Firmware, microcontrollers, real-time systems.",
                new String[]{
                        "https://www.raspberrypi.org/documentation/",
                        "https://www.arduino.cc/",
                        "https://www.coursera.org/specializations/embedded-systems"
                }));
        technical.add(role("Cybersecurity Engineer",
                "Defend systems; penetration testing; secure coding.",
                new String[]{
                        "https://owasp.org/",
                        "https://www.hackthebox.com/",
                        "https://www.cybrary.it/"
                }));
        technical.add(role("Cloud Engineer",
                "Design, deploy and manage cloud solutions.",
                new String[]{
                        "https://aws.amazon.com/training/",
                        "https://cloud.google.com/training",
                        "https://www.microsoft.com/en-us/learn/azure"
                }));
        technical.add(role("QA / Test Engineer",
                "Automated testing, quality processes, test planning.",
                new String[]{
                        "https://www.guru99.com/software-testing.html",
                        "https://www.selenium.dev/",
                        "https://cucumber.io/"
                }));

        // Non-Technical Roles
        List<Map<String, Object>> nonTechnical = new ArrayList<>();
        nonTechnical.add(role("Product Manager",
                "Define product vision, work with engineering & stakeholders.",
                new String[]{
                        "https://www.coursera.org/specializations/product-management",
                        "https://www.intercom.com/blog/product-management-resources/"
                }));
        nonTechnical.add(role("UX / UI Designer",
                "Design user experiences and interfaces.",
                new String[]{
                        "https://www.coursera.org/specializations/ui-ux-design",
                        "https://www.nngroup.com/articles/definition-user-experience/"
                }));
        nonTechnical.add(role("Technical Writer",
                "Document APIs, user guides, and internal knowledge.",
                new String[]{
                        "https://developers.google.com/style",
                        "https://documentation.divio.com/"
                }));
        nonTechnical.add(role("Sales / Business Development (Tech)",
                "Sell and onboard customers, manage client relationships.",
                new String[]{
                        "https://www.hubspot.com/sales",
                        "https://www.saleshacker.com/"
                }));
        nonTechnical.add(role("Teaching / Academics",
                "Academia, tutoring, or online course creation.",
                new String[]{
                        "https://www.coursera.org/instructor",
                        "https://www.udemy.com/teaching/"
                }));

        // Engineering Branch Guides
        List<Map<String, Object>> branches = new ArrayList<>();
        branches.add(branch("Computer Science & Engineering (CSE)",
                "Focus: algorithms, systems, software engineering, ML, databases.",
                new String[]{
                        "https://www.geeksforgeeks.org/computer-science-tutorials/",
                        "https://cs50.harvard.edu/x/2022/"
                }));
        branches.add(branch("Electronics & Communication (ECE)",
                "Focus: analog/digital circuits, signals, embedded systems, communication.",
                new String[]{
                        "https://electronics-tutorials.ws/",
                        "https://www.allaboutcircuits.com/"
                }));
        branches.add(branch("Electrical & Electronics (EEE)",
                "Focus: power systems, control systems, circuits.",
                new String[]{
                        "https://learn.sparkfun.com/",
                        "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/"
                }));
        branches.add(branch("Mechanical Engineering (ME)",
                "Focus: thermodynamics, mechanics, manufacturing, CAD.",
                new String[]{
                        "https://nptel.ac.in/course.html",
                        "https://www.coursera.org/browse/engineering/mechanical-engineering"
                }));
        branches.add(branch("Civil Engineering (CE)",
                "Focus: structures, geotech, hydraulics, construction management.",
                new String[]{
                        "https://nptel.ac.in/course.html",
                        "https://www.coursera.org/browse/physical-science-and-engineering/civil-engineering"
                }));
        branches.add(branch("Information Technology (IT)",
                "Focus: web, databases, networking, systems integration.",
                new String[]{
                        "https://www.geeksforgeeks.org/",
                        "https://www.udacity.com/school-of-programming"
                }));
        branches.add(branch("Chemical Engineering",
                "Focus: process design, reaction engineering, materials.",
                new String[]{
                        "https://www.chemeurope.com/en/",
                        "https://nptel.ac.in/course.html"
                }));
        branches.add(branch("Biotechnology/Bioengineering",
                "Focus: molecular biology, bioprocessing, bioinformatics.",
                new String[]{
                        "https://www.ncbi.nlm.nih.gov/",
                        "https://www.coursera.org/browse/life-sciences"
                }));

        guide.put("technicalRoles", technical);
        guide.put("nonTechnicalRoles", nonTechnical);
        guide.put("engineeringBranches", branches);

        // Quick tips & extras
        guide.put("extras", Arrays.asList(
                "Build a GitHub portfolio with 3-5 solid projects.",
                "Write short case-studies for each project (problem, solution, impact).",
                "Practice DSA & system design for interviews.",
                "Contribute to open-source to gain credibility."
        ));

        return guide;
    }

    // Helper to create a step object
    private Map<String, Object> step(String title, String description, String[] resources) {
        Map<String, Object> step = new LinkedHashMap<>();
        step.put("title", title);
        step.put("description", description);
        step.put("resources", Arrays.asList(resources));
        return step;
    }

    // Helper to create role entry
    private Map<String, Object> role(String title, String description, String[] resources) {
        Map<String, Object> r = new LinkedHashMap<>();
        r.put("title", title);
        r.put("description", description);
        r.put("resources", Arrays.asList(resources));
        return r;
    }

    // Helper to create branch entry
    private Map<String, Object> branch(String title, String focus, String[] resources) {
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("branch", title);
        b.put("focus", focus);
        b.put("resources", Arrays.asList(resources));
        return b;
    }
}
