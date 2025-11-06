package com.mvp.gsscp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // 👤 Full name of the user

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String bio;
    private String jobRole;
    private String interests;
    private String programmingLanguages;

    // 🖼️ Profile image stored as Base64 (large size safe)
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String profileImage;

    private String createdAt;
    private String updatedAt;

    // ✅ Enhanced Profile Fields
    private String college;    // 🎓 College name
    private String degree;     // 📘 Degree or specialization
    private String skills;     // 🧠 Key skills (comma-separated)
    private String linkedin;   // 🔗 LinkedIn profile link
    private String github;     // 💻 GitHub profile link

    // 📄 Resume (Base64 or link)
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String resume;

    // ==========================
    // 🔧 Getters & Setters
    // ==========================

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public String getBio() {
        return bio;
    }
    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getJobRole() {
        return jobRole;
    }
    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public String getInterests() {
        return interests;
    }
    public void setInterests(String interests) {
        this.interests = interests;
    }

    public String getProgrammingLanguages() {
        return programmingLanguages;
    }
    public void setProgrammingLanguages(String programmingLanguages) {
        this.programmingLanguages = programmingLanguages;
    }

    public String getProfileImage() {
        return profileImage;
    }
    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public String getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCollege() {
        return college;
    }
    public void setCollege(String college) {
        this.college = college;
    }

    public String getDegree() {
        return degree;
    }
    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getSkills() {
        return skills;
    }
    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getLinkedin() {
        return linkedin;
    }
    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }

    public String getGithub() {
        return github;
    }
    public void setGithub(String github) {
        this.github = github;
    }

    public String getResume() {
        return resume;
    }
    public void setResume(String resume) {
        this.resume = resume;
    }
}
