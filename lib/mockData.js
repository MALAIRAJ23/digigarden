// lib/mockData.js
export const MOCK_NOTES = [
  {
    id: "1",
    title: "Python Basics",
    slug: "python-basics",
    content: `# Python Basics

Python is a high-level, easy-to-read programming language.

See [[Python Loops]] for loop examples.

- Variables
- Loops
- Functions

`,
    tags: ["python", "basics"],
    visibility: "private",
  },

  {
    id: "2",
    title: "Python Loops",
    slug: "python-loops",
    content: `# Python Loops

Loops are used for iteration.

\`\`\`python
for i in range(5):
    print(i)
\`\`\`

`,
    tags: ["python", "loops"],
    visibility: "public",
  },

  {
    id: "3",
    title: "Intern Prep Guide",
    slug: "intern-prep-guide",
    content: `# Internship Preparation

Steps to prepare for intern drives:

1. Learn DS & Algorithms  
2. Practice interviews  
3. Build strong projects  
4. Learn Python + SQL  

Related topic: [[Python Basics]]

`,
    tags: ["career", "internship"],
    visibility: "public",
  },
];
