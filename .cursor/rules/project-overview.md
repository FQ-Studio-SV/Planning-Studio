# 🧠 Project Overview – Automated Jira Planner MVP

## Objective
Build a minimal viable product (MVP) of an automated planning tool for software development projects.  
The app integrates with Jira to generate user stories, time estimations, and schedules automatically based on user input.

## Core Functionalities
1. Accept a **project description** as input.
2. Collect **project details** (daily available hours, delivery time, and team assignments).
3. Assemble a complete **prompt** to send to the AI model.
4. Display AI-generated results and allow users to:
   - Download as CSV, or
   - (Optionally) send issues directly to Jira via its REST API.

---

## 🧭 Application Flow

The app consists of **three main steps**, each represented by a distinct screen or component:

### **Step 1 – Project Description**
- A large textarea input where the user describes the project goal, scope, and requirements.  
- A “Continue” button saves the description and moves to Step 2.

### **Step 2 – Project Details**
- Inputs for:
  - **Daily available working hours**
  - **Estimated delivery time (weeks)**
  - **Team member assignment** (automatically fetched from Jira using its REST API)
- When this step is completed, the app constructs the final AI prompt combining all collected data.

### **Step 3 – Results Visualization**
- Displays AI-generated results including:
  - User stories (Jira-style)
  - Story points and estimates
  - Week-by-week schedule
  - CSV preview for Jira import
- Allows:
  - Downloading the CSV file
  - (Optionally) Triggering Jira issue creation via the Issues API

---

## MVP Boundaries
- Only **one predefined Jira project** is used (already configured with API token).
- No authentication or project switching in this version.
- The UI flow must remain simple and linear.
- **Do not** add extra pages or functionality beyond these three steps.

---

## Goal
Demonstrate how AI and Jira integration can automate the planning phase of software development, reducing manual effort and pre-sprint meetings.
