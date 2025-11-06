import React from "react";
import "./Resources.css";

export default function Resources() {
  const resources = [
    // === Programming & DSA ===
    {
      title: "📘 GeeksforGeeks",
      desc: "Master DSA, algorithms, and interview prep from the ground up.",
      link: "https://www.geeksforgeeks.org/",
      tag: "DSA & Coding",
    },
    {
      title: "💡 LeetCode",
      desc: "Sharpen your coding and problem-solving skills with real interview questions.",
      link: "https://leetcode.com/",
      tag: "Competitive Coding",
    },
    {
      title: "🔥 HackerRank",
      desc: "Practice coding challenges, contests, and improve programming logic.",
      link: "https://www.hackerrank.com/",
      tag: "Coding Practice",
    },
    {
      title: "📘 Learn Python",
      desc: "Interactive Python tutorials and hands-on coding exercises.",
      link: "https://www.learnpython.org/",
      tag: "Programming",
    },
    {
      title: "💻 W3Schools",
      desc: "A great beginner-friendly place for learning web and programming basics.",
      link: "https://www.w3schools.com/",
      tag: "Web Development",
    },

    // === Web Development ===
    {
      title: "🌐 freeCodeCamp",
      desc: "Free, full-length courses on Web Dev, Data Science, and more.",
      link: "https://www.freecodecamp.org/",
      tag: "Web Development",
    },
    {
      title: "⚛️ React Docs",
      desc: "Official documentation for mastering React.",
      link: "https://react.dev/",
      tag: "Frontend",
    },
    {
      title: "🧩 MDN Web Docs",
      desc: "The best official docs for HTML, CSS, and JavaScript.",
      link: "https://developer.mozilla.org/",
      tag: "Web Dev",
    },
    {
      title: "📦 CSS-Tricks",
      desc: "Tips, tutorials, and snippets for mastering front-end styling.",
      link: "https://css-tricks.com/",
      tag: "Frontend",
    },
    {
      title: "🧠 Roadmap.sh",
      desc: "Developer roadmaps to learn Web Dev, DevOps, AI, and more step-by-step.",
      link: "https://roadmap.sh/",
      tag: "Guides",
    },

    // === AI & Machine Learning ===
    {
      title: "🤖 Google ML Crash Course",
      desc: "Google’s official machine learning fundamentals course.",
      link: "https://developers.google.com/machine-learning/crash-course",
      tag: "AI & ML",
    },
    {
      title: "📊 Kaggle",
      desc: "Learn ML, explore datasets, and participate in real-world AI competitions.",
      link: "https://www.kaggle.com/",
      tag: "Data Science",
    },
    {
      title: "🧠 Fast.ai",
      desc: "Top practical course on AI & deep learning for developers.",
      link: "https://course.fast.ai/",
      tag: "Machine Learning",
    },
    {
      title: "📘 TensorFlow Tutorials",
      desc: "Learn TensorFlow and build neural networks with official examples.",
      link: "https://www.tensorflow.org/tutorials",
      tag: "Deep Learning",
    },
    {
      title: "🧮 PyTorch Tutorials",
      desc: "Hands-on deep learning with PyTorch — from basics to advanced models.",
      link: "https://pytorch.org/tutorials/",
      tag: "AI Framework",
    },

    // === Cloud & DevOps ===
    {
      title: "☁️ AWS Cloud Learning",
      desc: "Free AWS Cloud courses and DevOps learning paths.",
      link: "https://aws.amazon.com/training/",
      tag: "Cloud",
    },
    {
      title: "🐳 Docker Docs",
      desc: "Official guide for learning Docker, images, and containers.",
      link: "https://docs.docker.com/get-started/",
      tag: "DevOps",
    },
    {
      title: "⚙️ Kubernetes Docs",
      desc: "Everything about Kubernetes orchestration and cluster management.",
      link: "https://kubernetes.io/docs/tutorials/",
      tag: "DevOps",
    },
    {
      title: "🚀 Microsoft Learn",
      desc: "Microsoft’s free learning hub for Azure, DevOps, and more.",
      link: "https://learn.microsoft.com/",
      tag: "Cloud & DevOps",
    },
    {
      title: "☁️ Google Cloud Skills Boost",
      desc: "Free hands-on labs and courses from Google Cloud.",
      link: "https://www.cloudskillsboost.google/",
      tag: "Cloud",
    },

    // === Career & Learning ===
    {
      title: "🎓 Coursera",
      desc: "University-level professional certifications and career paths.",
      link: "https://www.coursera.org/",
      tag: "Learning",
    },
    {
      title: "🎯 LinkedIn Learning",
      desc: "Courses for tech, leadership, and career skills by experts.",
      link: "https://www.linkedin.com/learning/",
      tag: "Career Growth",
    },
    {
      title: "📚 EdX",
      desc: "Courses from MIT, Harvard, and top universities for free.",
      link: "https://www.edx.org/",
      tag: "Education",
    },
    {
      title: "🧭 Roadmap Generator",
      desc: "Visual learning paths for every software engineering role.",
      link: "https://roadmap.sh/",
      tag: "Career",
    },
    {
      title: "💬 InterviewBit",
      desc: "Ace coding interviews with guided problem-solving sessions.",
      link: "https://www.interviewbit.com/",
      tag: "Interviews",
    },
  ];

  return (
    <div className="resources-page">
      <h2>🌐 Learning Resources Hub</h2>
      <p className="subtitle">
        Discover handpicked websites to learn coding, AI, web development, and more!
      </p>

      <div className="resources-grid">
        {resources.map((res, idx) => (
          <div key={idx} className="resource-card">
            <div className="resource-tag">{res.tag}</div>
            <h3>{res.title}</h3>
            <p>{res.desc}</p>
            <a href={res.link} target="_blank" rel="noopener noreferrer">
              Visit Site →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
