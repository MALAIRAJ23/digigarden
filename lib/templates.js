// lib/templates.js

export const NOTE_TEMPLATES = {
  blank: {
    title: "New Note",
    content: "",
    tags: [],
    visibility: "private"
  },
  
  daily: {
    title: `Daily Journal - ${new Date().toLocaleDateString()}`,
    content: `# Daily Journal - ${new Date().toLocaleDateString()}

## Today's Goals
- 
- 
- 

## What I Learned
- 

## Thoughts & Reflections
- 

## Tomorrow's Focus
- 

---
*Created: ${new Date().toLocaleString()}*`,
    tags: ["journal", "daily"],
    visibility: "private"
  },
  
  meeting: {
    title: "Meeting Notes - ",
    content: `# Meeting Notes

**Date:** ${new Date().toLocaleDateString()}
**Attendees:** 
**Duration:** 

## Agenda
- 

## Key Points
- 

## Action Items
- [ ] 
- [ ] 

## Follow-up
- 

## Next Meeting
**Date:** 
**Topics:** `,
    tags: ["meeting", "work"],
    visibility: "private"
  },
  
  project: {
    title: "Project: ",
    content: `# Project: [Project Name]

## Overview
Brief description of the project.

## Goals & Objectives
- 
- 

## Requirements
- 
- 

## Timeline
- **Start Date:** 
- **Milestones:** 
- **End Date:** 

## Resources
- 
- 

## Notes
- 

## Related Links
- [[]]`,
    tags: ["project", "planning"],
    visibility: "private"
  },
  
  book: {
    title: "Book Review: ",
    content: `# Book Review: [Book Title]

**Author:** 
**Genre:** 
**Pages:** 
**Rating:** ⭐⭐⭐⭐⭐

## Summary
Brief summary of the book.

## Key Takeaways
- 
- 
- 

## Favorite Quotes
> 

## My Thoughts
What I liked and didn't like about the book.

## Recommendations
Would I recommend this book? To whom?

## Related Books
- [[]]`,
    tags: ["book", "review", "reading"],
    visibility: "private"
  },
  
  idea: {
    title: "Idea: ",
    content: `# Idea: [Brief Description]

## The Concept
Detailed explanation of the idea.

## Why This Matters
- 
- 

## Potential Applications
- 
- 

## Next Steps
- [ ] 
- [ ] 

## Related Ideas
- [[]]

## Resources & References
- `,
    tags: ["idea", "brainstorm"],
    visibility: "private"
  }
};

export function getTemplate(templateKey) {
  return NOTE_TEMPLATES[templateKey] || NOTE_TEMPLATES.blank;
}