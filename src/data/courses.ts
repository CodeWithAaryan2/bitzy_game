import type { Course } from '@/types';

export const courses: Course[] = [
  {
    id: '1', slug: 'html-basics', title: 'HTML Fundamentals', description: 'Master the building blocks of the web.', longDescription: 'Master the building blocks of the web. Learn semantic markup, forms, media, and accessibility.',
    color: '#E34C26', difficulty: 'Beginner', category: 'Frontend', tags: ['html', 'web', 'beginner'],
    totalLessons: 15, totalQuizzes: 3, totalChallenges: 5, estimatedHours: 8, xpReward: 500, coinReward: 250,
    modules: [
      { id: '1', title: 'Introduction to HTML', description: 'Learn what HTML is and how it structures web content.', order: 1, lessons: [
        { id: '1-1', title: 'What is HTML?', slug: 'what-is-html', description: 'Understanding the foundation of the web.', type: 'reading', duration: '10 min', xpReward: 20, isCompleted: false },
        { id: '1-2', title: 'HTML Document Structure', slug: 'html-structure', description: 'The DOCTYPE, html, head, and body elements.', type: 'reading', duration: '12 min', xpReward: 20, isCompleted: false },
        { id: '1-3', title: 'Text Elements', slug: 'text-elements', description: 'Headings, paragraphs, spans, and divs.', type: 'interactive', duration: '15 min', xpReward: 25, isCompleted: false },
      ]},
      { id: '2', title: 'HTML Forms', description: 'Create interactive forms for user input.', order: 2, lessons: [
        { id: '2-1', title: 'Form Basics', slug: 'form-basics', description: 'The form element and input types.', type: 'reading', duration: '12 min', xpReward: 20, isCompleted: false },
        { id: '2-2', title: 'Input Validation', slug: 'input-validation', description: 'HTML5 validation attributes.', type: 'interactive', duration: '15 min', xpReward: 25, isCompleted: false },
      ]},
      { id: '3', title: 'Media & Embedding', description: 'Add images, audio, video, and embed content.', order: 3, lessons: [
        { id: '3-1', title: 'Images & Media', slug: 'images-media', description: 'The img, audio, and video tags.', type: 'reading', duration: '10 min', xpReward: 20, isCompleted: false },
      ]},
    ],
  },
  {
    id: '2', slug: 'css-fundamentals', title: 'CSS Fundamentals', description: 'Style your web pages beautifully.', longDescription: 'Style your web pages beautifully. Learn selectors, box model, flexbox, grid, and animations.',
    color: '#264DE4', difficulty: 'Beginner', category: 'Frontend', tags: ['css', 'styling', 'web', 'beginner'],
    totalLessons: 12, totalQuizzes: 3, totalChallenges: 5, estimatedHours: 10, xpReward: 600, coinReward: 300,
    modules: [
      { id: '4', title: 'CSS Basics', description: 'Learn how to style HTML elements.', order: 1, lessons: [
        { id: '4-1', title: 'Introduction to CSS', slug: 'intro-to-css', description: 'What is CSS and how does it work?', type: 'reading', duration: '10 min', xpReward: 20, isCompleted: false },
        { id: '4-2', title: 'CSS Selectors', slug: 'css-selectors', description: 'Target elements with precision.', type: 'reading', duration: '12 min', xpReward: 20, isCompleted: false },
      ]},
      { id: '5', title: 'Layout & Box Model', description: 'Understand sizing, spacing, and positioning.', order: 2, lessons: [
        { id: '5-1', title: 'The Box Model', slug: 'box-model', description: 'Content, padding, border, margin.', type: 'interactive', duration: '15 min', xpReward: 25, isCompleted: false },
        { id: '5-2', title: 'Flexbox Layout', slug: 'flexbox', description: 'One-dimensional layout system.', type: 'reading', duration: '15 min', xpReward: 25, isCompleted: false },
      ]},
      { id: '6', title: 'Grid & Responsive', description: 'Advanced layouts and mobile design.', order: 3, lessons: [
        { id: '6-1', title: 'CSS Grid', slug: 'css-grid', description: 'Two-dimensional layout system.', type: 'reading', duration: '15 min', xpReward: 25, isCompleted: false },
      ]},
    ],
  },
  {
    id: '3', slug: 'javascript-basics', title: 'JavaScript Basics', description: 'The programming language of the web.', longDescription: 'The programming language of the web. Variables, functions, arrays, objects, DOM, and async programming.',
    color: '#F7DF1E', difficulty: 'Beginner', category: 'Frontend', tags: ['javascript', 'programming', 'web', 'beginner'],
    totalLessons: 20, totalQuizzes: 5, totalChallenges: 8, estimatedHours: 15, xpReward: 800, coinReward: 400,
    modules: [
      { id: '7', title: 'JS Fundamentals', description: 'Variables, data types, and operators.', order: 1, lessons: [
        { id: '7-1', title: 'What is JavaScript?', slug: 'what-is-javascript', description: 'The programming language of the web.', type: 'reading', duration: '12 min', xpReward: 20, isCompleted: false },
        { id: '7-2', title: 'Variables & Data Types', slug: 'variables-types', description: 'let, const, strings, numbers, booleans.', type: 'interactive', duration: '15 min', xpReward: 25, isCompleted: false },
      ]},
      { id: '8', title: 'Functions & Control Flow', description: 'Conditionals, loops, and reusable code.', order: 2, lessons: [
        { id: '8-1', title: 'Functions', slug: 'functions', description: 'Declaring and calling functions.', type: 'reading', duration: '12 min', xpReward: 20, isCompleted: false },
        { id: '8-2', title: 'Conditionals & Loops', slug: 'conditionals-loops', description: 'if/else, switch, for, while.', type: 'interactive', duration: '15 min', xpReward: 25, isCompleted: false },
      ]},
      { id: '9', title: 'Arrays & Objects', description: 'Working with data structures in JS.', order: 3, lessons: [
        { id: '9-1', title: 'Arrays Deep Dive', slug: 'arrays-deep', description: 'map, filter, reduce, find, sort.', type: 'reading', duration: '15 min', xpReward: 25, isCompleted: false },
        { id: '9-2', title: 'Objects & Methods', slug: 'objects-methods', description: 'Creating and manipulating objects.', type: 'interactive', duration: '15 min', xpReward: 25, isCompleted: false },
      ]},
    ],
  },
  {
    id: '4', slug: 'react-basics', title: 'React Fundamentals', description: 'Build modern UIs with React.', longDescription: 'Build modern UIs with React. Components, hooks, state management, and more.',
    color: '#61DAFB', difficulty: 'Medium', category: 'Frontend', tags: ['react', 'frontend', 'javascript', 'intermediate'],
    totalLessons: 18, totalQuizzes: 4, totalChallenges: 6, estimatedHours: 20, xpReward: 1000, coinReward: 500,
    modules: [
      { id: '10', title: 'React Basics', description: 'Components, JSX, and props.', order: 1, lessons: [
        { id: '10-1', title: 'What is React?', slug: 'what-is-react', description: 'Introduction to the React library.', type: 'reading', duration: '15 min', xpReward: 25, isCompleted: false },
        { id: '10-2', title: 'JSX & Components', slug: 'jsx-components', description: 'Writing HTML in JavaScript.', type: 'interactive', duration: '15 min', xpReward: 25, isCompleted: false },
      ]},
      { id: '11', title: 'Hooks & State', description: 'Manage state and side effects.', order: 2, lessons: [
        { id: '11-1', title: 'useState Hook', slug: 'usestate-hook', description: 'Managing component state.', type: 'interactive', duration: '15 min', xpReward: 25, isCompleted: false },
        { id: '11-2', title: 'useEffect Hook', slug: 'useeffect-hook', description: 'Handling side effects.', type: 'reading', duration: '15 min', xpReward: 25, isCompleted: false },
      ]},
      { id: '12', title: 'Advanced Patterns', description: 'Context, refs, performance.', order: 3, lessons: [
        { id: '12-1', title: 'Context API', slug: 'context-api', description: 'Share state without prop drilling.', type: 'reading', duration: '15 min', xpReward: 25, isCompleted: false },
      ]},
    ],
  },
  {
    id: '5', slug: 'python-basics', title: 'Python Fundamentals', description: 'Learn Python, the most beginner-friendly language.', longDescription: 'Learn Python, the most beginner-friendly programming language. Perfect for data science and automation.',
    color: '#3776AB', difficulty: 'Beginner', category: 'Backend', tags: ['python', 'programming', 'backend', 'beginner'],
    totalLessons: 20, totalQuizzes: 5, totalChallenges: 8, estimatedHours: 18, xpReward: 800, coinReward: 400,
    modules: [
      { id: '13', title: 'Python Basics', description: 'Syntax, variables, and data types.', order: 1, lessons: [
        { id: '13-1', title: 'Hello, Python!', slug: 'hello-python', description: 'Write your first Python program.', type: 'interactive', duration: '10 min', xpReward: 20, isCompleted: false },
        { id: '13-2', title: 'Variables & Types', slug: 'python-variables', description: 'Strings, numbers, lists, dicts.', type: 'reading', duration: '12 min', xpReward: 20, isCompleted: false },
      ]},
      { id: '14', title: 'Control Flow & Functions', description: 'Loops, conditionals, and functions.', order: 2, lessons: [
        { id: '14-1', title: 'If Statements & Loops', slug: 'python-loops', description: 'Control the flow of your program.', type: 'interactive', duration: '15 min', xpReward: 25, isCompleted: false },
        { id: '14-2', title: 'Functions in Python', slug: 'python-functions', description: 'Defining and calling functions.', type: 'reading', duration: '12 min', xpReward: 20, isCompleted: false },
      ]},
      { id: '15', title: 'Data Structures', description: 'Lists, dicts, sets, and tuples.', order: 3, lessons: [
        { id: '15-1', title: 'List Comprehensions', slug: 'list-comprehensions', description: 'Pythonic way to create lists.', type: 'interactive', duration: '15 min', xpReward: 25, isCompleted: false },
      ]},
    ],
  },
  {
    id: '6', slug: 'typescript-basics', title: 'TypeScript Essentials', description: 'Add type safety to your JavaScript.', longDescription: 'Add type safety to your JavaScript. Interfaces, generics, and advanced types.',
    color: '#3178C6', difficulty: 'Medium', category: 'Frontend', tags: ['typescript', 'javascript', 'types', 'intermediate'],
    totalLessons: 14, totalQuizzes: 3, totalChallenges: 5, estimatedHours: 12, xpReward: 700, coinReward: 350,
    modules: [
      { id: '16', title: 'TS Basics', description: 'Types, interfaces, and configuration.', order: 1, lessons: [
        { id: '16-1', title: 'Why TypeScript?', slug: 'why-typescript', description: 'Benefits of type safety.', type: 'reading', duration: '10 min', xpReward: 20, isCompleted: false },
        { id: '16-2', title: 'Basic Types', slug: 'basic-types', description: 'string, number, boolean, arrays.', type: 'interactive', duration: '15 min', xpReward: 25, isCompleted: false },
      ]},
      { id: '17', title: 'Advanced Types', description: 'Generics, unions, and type guards.', order: 2, lessons: [
        { id: '17-1', title: 'Interfaces & Types', slug: 'interfaces', description: 'Defining object shapes.', type: 'reading', duration: '12 min', xpReward: 20, isCompleted: false },
        { id: '17-2', title: 'Generics', slug: 'generics', description: 'Reusable type-safe components.', type: 'interactive', duration: '15 min', xpReward: 25, isCompleted: false },
      ]},
    ],
  },
  {
    id: '7', slug: 'nodejs-basics', title: 'Node.js & Backend', description: 'Build server-side applications with Node.js.', longDescription: 'Build server-side applications with Node.js. Express, APIs, databases, and deployment.',
    color: '#339933', difficulty: 'Medium', category: 'Backend', tags: ['nodejs', 'backend', 'express', 'api'],
    totalLessons: 16, totalQuizzes: 4, totalChallenges: 6, estimatedHours: 16, xpReward: 900, coinReward: 450,
    modules: [
      { id: '18', title: 'Node.js Basics', description: 'Runtime, modules, and npm.', order: 1, lessons: [
        { id: '18-1', title: 'What is Node.js?', slug: 'what-is-nodejs', description: 'JavaScript on the server.', type: 'reading', duration: '12 min', xpReward: 20, isCompleted: false },
        { id: '18-2', title: 'Express.js Setup', slug: 'express-setup', description: 'Building your first server.', type: 'interactive', duration: '15 min', xpReward: 25, isCompleted: false },
      ]},
      { id: '19', title: 'APIs & Databases', description: 'REST APIs, middleware, and MongoDB.', order: 2, lessons: [
        { id: '19-1', title: 'REST API Design', slug: 'rest-api', description: 'Building RESTful endpoints.', type: 'reading', duration: '15 min', xpReward: 25, isCompleted: false },
        { id: '19-2', title: 'Database Connection', slug: 'database', description: 'Connecting to MongoDB.', type: 'interactive', duration: '15 min', xpReward: 25, isCompleted: false },
      ]},
    ],
  },
  {
    id: '8', slug: 'sql-basics', title: 'SQL & Databases', description: 'Master database queries with SQL.', longDescription: 'Master database queries with SQL. SELECT, JOIN, GROUP BY, and database design.',
    color: '#336791', difficulty: 'Beginner', category: 'Backend', tags: ['sql', 'database', 'backend', 'beginner'],
    totalLessons: 10, totalQuizzes: 3, totalChallenges: 4, estimatedHours: 10, xpReward: 600, coinReward: 300,
    modules: [
      { id: '20', title: 'SQL Basics', description: 'Queries, filters, and sorting.', order: 1, lessons: [
        { id: '20-1', title: 'What is SQL?', slug: 'what-is-sql', description: 'Introduction to databases.', type: 'reading', duration: '10 min', xpReward: 20, isCompleted: false },
        { id: '20-2', title: 'SELECT & WHERE', slug: 'select-where', description: 'Fetching and filtering data.', type: 'interactive', duration: '15 min', xpReward: 25, isCompleted: false },
      ]},
      { id: '21', title: 'Advanced Queries', description: 'JOINs, GROUP BY, and subqueries.', order: 2, lessons: [
        { id: '21-1', title: 'JOIN Operations', slug: 'joins', description: 'Combining tables.', type: 'reading', duration: '12 min', xpReward: 20, isCompleted: false },
      ]},
    ],
  },
  {
    id: '9', slug: 'git-github', title: 'Git & GitHub', description: 'Version control essentials.', longDescription: 'Version control essentials. Commit, branch, merge, and collaborate with GitHub.',
    color: '#F05032', difficulty: 'Beginner', category: 'Tools', tags: ['git', 'github', 'version-control', 'tools'],
    totalLessons: 12, totalQuizzes: 2, totalChallenges: 4, estimatedHours: 8, xpReward: 500, coinReward: 250,
    modules: [
      { id: '22', title: 'Git Basics', description: 'init, add, commit, and log.', order: 1, lessons: [
        { id: '22-1', title: 'Why Version Control?', slug: 'why-git', description: 'Track changes to your code.', type: 'reading', duration: '10 min', xpReward: 20, isCompleted: false },
        { id: '22-2', title: 'Your First Commit', slug: 'first-commit', description: 'Initialize and commit.', type: 'interactive', duration: '12 min', xpReward: 20, isCompleted: false },
      ]},
      { id: '23', title: 'Branching & GitHub', description: 'Collaborate with branches and pull requests.', order: 2, lessons: [
        { id: '23-1', title: 'Branching', slug: 'branching', description: 'Create and merge branches.', type: 'reading', duration: '12 min', xpReward: 20, isCompleted: false },
      ]},
    ],
  },
  {
    id: '10', slug: 'data-structures', title: 'Data Structures', description: 'Essential computer science concepts.', longDescription: 'Essential computer science concepts. Arrays, linked lists, trees, graphs, and algorithms.',
    color: '#8B5CF6', difficulty: 'Hard', category: 'Computer Science', tags: ['algorithms', 'data-structures', 'cs', 'advanced'],
    totalLessons: 18, totalQuizzes: 5, totalChallenges: 10, estimatedHours: 24, xpReward: 1200, coinReward: 600,
    modules: [
      { id: '24', title: 'Linear Structures', description: 'Arrays, lists, stacks, queues.', order: 1, lessons: [
        { id: '24-1', title: 'Arrays vs Linked Lists', slug: 'arrays-vs-lists', description: 'Memory layout and performance.', type: 'reading', duration: '15 min', xpReward: 25, isCompleted: false },
        { id: '24-2', title: 'Stacks & Queues', slug: 'stacks-queues', description: 'LIFO and FIFO structures.', type: 'interactive', duration: '15 min', xpReward: 25, isCompleted: false },
      ]},
      { id: '25', title: 'Trees & Graphs', description: 'Binary trees, BST, DFS, BFS.', order: 2, lessons: [
        { id: '25-1', title: 'Binary Trees', slug: 'binary-trees', description: 'Structure and traversal.', type: 'reading', duration: '15 min', xpReward: 25, isCompleted: false },
        { id: '25-2', title: 'Graph Algorithms', slug: 'graph-algorithms', description: 'DFS, BFS, shortest path.', type: 'interactive', duration: '18 min', xpReward: 30, isCompleted: false },
      ]},
      { id: '26', title: 'Sorting & Searching', description: 'Bubble, merge, quick, binary search.', order: 3, lessons: [
        { id: '26-1', title: 'Sorting Algorithms', slug: 'sorting', description: 'Compare and conquer approaches.', type: 'interactive', duration: '18 min', xpReward: 30, isCompleted: false },
      ]},
    ],
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find(c => c.slug === slug);
}

export function getAllCourses(): Course[] {
  return courses;
}

export function getLessonBySlug(courseSlug: string, lessonSlug: string): { lesson: CourseLesson; module: CourseModule } | undefined {
  const course = getCourseBySlug(courseSlug);
  if (!course) return undefined;
  for (const module of course.modules) {
    const lesson = module.lessons.find(l => l.slug === lessonSlug);
    if (lesson) return { lesson, module };
  }
  return undefined;
}

export function getAdjacentLesson(courseSlug: string, lessonSlug: string, direction: 'prev' | 'next'): { lesson: CourseLesson; module: CourseModule } | undefined {
  const course = getCourseBySlug(courseSlug);
  if (!course) return undefined;
  const allLessons: { lesson: CourseLesson; module: CourseModule }[] = [];
  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      allLessons.push({ lesson, module });
    }
  }
  const idx = allLessons.findIndex(l => l.lesson.slug === lessonSlug);
  if (idx === -1) return undefined;
  if (direction === 'prev') return idx > 0 ? allLessons[idx - 1] : undefined;
  return idx < allLessons.length - 1 ? allLessons[idx + 1] : undefined;
}