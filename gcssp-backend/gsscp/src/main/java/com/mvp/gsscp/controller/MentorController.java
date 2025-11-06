package com.mvp.gsscp.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/mentor")
public class MentorController {

    @GetMapping("/roadmap")
    public Map<String, Object> generateRoadmap(@RequestParam String goal) {
        // Normalize goal input for flexibility
        goal = goal == null ? "" : goal.toLowerCase()
                .replaceAll("[^a-z0-9 ]", " ")  // remove symbols like /, -, _
                .replaceAll("\\s+", " ")        // collapse extra spaces
                .trim();

        Map<String, Object> roadmap = new LinkedHashMap<>();
        List<Map<String, Object>> steps = new ArrayList<>();

        // --- AI Engineer ---
        if (goal.contains("ai") || goal.contains("machine learning") || goal.contains("ml")) {
            roadmap.put("career", "AI Engineer");
            roadmap.put("summary", "Master Artificial Intelligence, Machine Learning, and Deep Learning to build intelligent systems.");

            steps.add(step("Learn Python", "Start with Python basics and libraries like NumPy, Pandas, and Matplotlib.",
                    new String[]{
                            "https://www.w3schools.com/python/",
                            "https://www.learnpython.org/",
                            "https://www.youtube.com/watch?v=_uQrJ0TkZlc"
                    }));

            steps.add(step("Math for Machine Learning", "Learn Linear Algebra, Calculus, and Probability — the foundation for ML models.",
                    new String[]{
                            "https://www.khanacademy.org/math/linear-algebra",
                            "https://www.coursera.org/learn/machine-learning-math",
                            "https://www.3blue1brown.com/topics/linear-algebra"
                    }));

            steps.add(step("Machine Learning", "Understand supervised & unsupervised learning using scikit-learn.",
                    new String[]{
                            "https://scikit-learn.org/stable/",
                            "https://www.youtube.com/watch?v=GwIo3gDZCVQ",
                            "https://www.coursera.org/learn/machine-learning"
                    }));

            steps.add(step("Deep Learning", "Learn TensorFlow and PyTorch to train neural networks (CNNs, RNNs, Transformers).",
                    new String[]{
                            "https://www.tensorflow.org/learn",
                            "https://pytorch.org/tutorials/",
                            "https://www.deeplearning.ai/"
                    }));

            steps.add(step("Projects & Portfolio", "Build and publish AI projects — image classifier, chatbot, or recommendation system.",
                    new String[]{
                            "https://github.com/topics/machine-learning-projects",
                            "https://www.kaggle.com/",
                            "https://www.tensorflow.org/tutorials"
                    }));
        }

        // --- Web Developer ---
        else if (goal.contains("web") || goal.contains("frontend") || goal.contains("backend") || goal.contains("fullstack")) {
            roadmap.put("career", "Web Developer");
            roadmap.put("summary", "Learn full-stack web development — front-end, back-end, and deployment.");

            steps.add(step("HTML, CSS, JS", "Start with front-end basics.",
                    new String[]{
                            "https://developer.mozilla.org/en-US/docs/Web",
                            "https://www.freecodecamp.org/learn",
                            "https://www.youtube.com/watch?v=3JluqTojuME"
                    }));

            steps.add(step("Frontend Frameworks", "Learn React or Angular for building dynamic UIs.",
                    new String[]{
                            "https://react.dev/learn",
                            "https://angular.io/start",
                            "https://www.youtube.com/watch?v=bMknfKXIFA8"
                    }));

            steps.add(step("Backend Development", "Build REST APIs using Node.js, Express, or Spring Boot.",
                    new String[]{
                            "https://expressjs.com/",
                            "https://spring.io/guides",
                            "https://www.youtube.com/watch?v=Oe421EPjeBE"
                    }));

            steps.add(step("Databases", "Work with MySQL or MongoDB to store data.",
                    new String[]{
                            "https://www.mongodb.com/docs/",
                            "https://dev.mysql.com/doc/",
                            "https://www.youtube.com/watch?v=7S_tz1z_5bA"
                    }));

            steps.add(step("Deployment", "Deploy your apps using Vercel, AWS, or Docker.",
                    new String[]{
                            "https://vercel.com/docs",
                            "https://aws.amazon.com/getting-started/",
                            "https://docs.docker.com/get-started/"
                    }));
        }

        // --- Data Scientist ---
        else if (goal.contains("data") || goal.contains("analytics") || goal.contains("data science")) {
            roadmap.put("career", "Data Scientist");
            roadmap.put("summary", "Learn to collect, clean, visualize, and analyze data to gain insights.");

            steps.add(step("Python & Statistics", "Use Pandas, NumPy, and Matplotlib.",
                    new String[]{
                            "https://pandas.pydata.org/docs/",
                            "https://numpy.org/learn/",
                            "https://www.youtube.com/watch?v=r-uOLxNrNk8"
                    }));

            steps.add(step("SQL & Databases", "Master data extraction and analysis.",
                    new String[]{
                            "https://www.w3schools.com/sql/",
                            "https://mode.com/sql-tutorial/",
                            "https://www.kaggle.com/learn/intro-to-sql"
                    }));

            steps.add(step("Machine Learning", "Build regression, classification, and clustering models.",
                    new String[]{
                            "https://scikit-learn.org/stable/",
                            "https://www.youtube.com/watch?v=7eh4d6sabA0",
                            "https://www.coursera.org/learn/machine-learning"
                    }));

            steps.add(step("Visualization", "Use Power BI, Tableau, or Seaborn to present data.",
                    new String[]{
                            "https://public.tableau.com/en-us/s/resources",
                            "https://powerbi.microsoft.com/en-us/",
                            "https://seaborn.pydata.org/tutorial.html"
                    }));

            steps.add(step("Portfolio Projects", "Publish case studies and notebooks.",
                    new String[]{
                            "https://www.kaggle.com/",
                            "https://github.com/topics/data-analysis",
                            "https://medium.com/tag/data-science"
                    }));
        }

        // --- Cybersecurity ---
        else if (goal.contains("cyber") || goal.contains("security") || goal.contains("ethical hacking")) {
            roadmap.put("career", "Cybersecurity Analyst");
            roadmap.put("summary", "Learn how to secure systems, networks, and applications.");

            steps.add(step("Networking Basics", "Understand TCP/IP, DNS, and protocols.",
                    new String[]{
                            "https://www.coursera.org/learn/comptia-networkplus",
                            "https://www.geeksforgeeks.org/computer-network-tutorials/",
                            "https://www.youtube.com/watch?v=qiQR5rTSshw"
                    }));

            steps.add(step("Linux & Scripting", "Use Linux commands and Bash scripting for automation.",
                    new String[]{
                            "https://ubuntu.com/tutorials/command-line-for-beginners",
                            "https://www.learnshell.org/",
                            "https://www.youtube.com/watch?v=oxuRxtrO2Ag"
                    }));

            steps.add(step("Ethical Hacking", "Learn to find vulnerabilities and test security.",
                    new String[]{
                            "https://www.udemy.com/course/learn-ethical-hacking-from-scratch/",
                            "https://www.hackthebox.com/",
                            "https://owasp.org/"
                    }));

            steps.add(step("Security Tools", "Work with Wireshark, Burp Suite, and Nmap.",
                    new String[]{
                            "https://www.wireshark.org/docs/",
                            "https://portswigger.net/burp",
                            "https://nmap.org/book/inst-windows.html"
                    }));

            steps.add(step("Certifications", "Get CEH, CompTIA Security+, or OSCP.",
                    new String[]{
                            "https://www.eccouncil.org/",
                            "https://www.comptia.org/",
                            "https://www.offsec.com/"
                    }));
        }

        // --- DevOps / SRE ---
        else if (goal.contains("devops") || goal.contains("sre") || goal.contains("site reliability")) {
            roadmap.put("career", "DevOps Engineer / SRE");
            roadmap.put("summary", "Learn automation, CI/CD, infrastructure as code, containerization, and monitoring.");

            steps.add(step("Linux & Shell Scripting", "Learn Linux commands, permissions, and shell scripting.",
                    new String[]{
                            "https://ubuntu.com/tutorials/command-line-for-beginners",
                            "https://www.learnshell.org/",
                            "https://www.youtube.com/watch?v=oxuRxtrO2Ag"
                    }));

            steps.add(step("Version Control (Git)", "Collaborate and manage code with Git and GitHub.",
                    new String[]{
                            "https://git-scm.com/docs",
                            "https://www.youtube.com/watch?v=RGOj5yH7evk",
                            "https://www.atlassian.com/git/tutorials"
                    }));

            steps.add(step("CI/CD Pipelines", "Automate builds, tests, and deployments with Jenkins or GitHub Actions.",
                    new String[]{
                            "https://www.jenkins.io/doc/",
                            "https://docs.github.com/en/actions",
                            "https://www.coursera.org/learn/devops"
                    }));

            steps.add(step("Containerization (Docker)", "Learn Docker to build and run applications in containers.",
                    new String[]{
                            "https://docs.docker.com/get-started/",
                            "https://www.youtube.com/watch?v=pTFZFxd4hOI",
                            "https://docker-curriculum.com/"
                    }));

            steps.add(step("Orchestration (Kubernetes)", "Manage container clusters using Kubernetes.",
                    new String[]{
                            "https://kubernetes.io/docs/tutorials/",
                            "https://www.youtube.com/watch?v=X48VuDVv0do",
                            "https://www.coursera.org/learn/google-kubernetes-engine"
                    }));

            steps.add(step("Cloud Platforms", "Deploy and scale on AWS, Azure, or GCP.",
                    new String[]{
                            "https://aws.amazon.com/training/",
                            "https://cloud.google.com/training",
                            "https://learn.microsoft.com/en-us/training/"
                    }));

            steps.add(step("Monitoring & Logging", "Use Prometheus, Grafana, and ELK Stack for observability.",
                    new String[]{
                            "https://prometheus.io/docs/introduction/overview/",
                            "https://grafana.com/docs/",
                            "https://www.elastic.co/what-is/elk-stack"
                    }));
        }

        // --- Default General Tech Roadmap ---
        else {
            roadmap.put("career", "General Tech Roadmap");
            roadmap.put("summary", "A well-rounded plan for growing in software & tech careers.");
            steps.add(step("Programming Basics", "Learn Python or Java.",
                    new String[]{
                            "https://www.w3schools.com/python/",
                            "https://www.learnjavaonline.org/",
                            "https://www.freecodecamp.org/"
                    }));
            steps.add(step("Data Structures & Algorithms", "Master DSA for building efficient systems.",
                    new String[]{
                            "https://www.geeksforgeeks.org/data-structures/",
                            "https://visualgo.net/",
                            "https://www.youtube.com/watch?v=8hly31xKli0"
                    }));
            steps.add(step("Build Projects", "Make projects and host them on GitHub.",
                    new String[]{
                            "https://github.com/topics/beginner-project",
                            "https://devpost.com/",
                            "https://www.freecodecamp.org/news/project-ideas-for-beginners/"
                    }));
            steps.add(step("Soft Skills & Communication", "Improve communication and teamwork.",
                    new String[]{
                            "https://www.coursera.org/specializations/communication-skills",
                            "https://grammarly.com/",
                            "https://writingcenter.unc.edu/tips-and-tools/"
                    }));
        }

        roadmap.put("detailedGuide", buildDetailedGuide());
        roadmap.put("steps", steps);
        return roadmap;
    }

    // === Helper Functions ===
    private Map<String, Object> step(String title, String description, String[] resources) {
        Map<String, Object> step = new LinkedHashMap<>();
        step.put("title", title);
        step.put("description", description);
        step.put("resources", Arrays.asList(resources));
        return step;
    }

    private Map<String, Object> buildDetailedGuide() {
        Map<String, Object> guide = new LinkedHashMap<>();
        guide.put("extras", Arrays.asList(
                "Build a GitHub portfolio with 3-5 solid projects.",
                "Practice DSA & system design regularly.",
                "Contribute to open-source projects.",
                "Write tech blogs and improve visibility."
        ));
        return guide;
    }
}
