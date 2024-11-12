import { Task } from '../models';

export const staticTasks: Task[] = [
  {
    id: '1',
    title: 'Brainstorm Project Ideas at the Beach',
    description:
      'Grab your sunglasses and hit the beach to come up with some amazing project proposals.',
    notes: 'Don’t forget the sunscreen!',
    dueDate: '2024-12-01',
    completed: false,
    status: 'backlog',
  },
  {
    id: '2',
    title: 'Client Meeting at the Amusement Park',
    description:
      'Discuss project requirements while riding a roller coaster. Thrill and business in one go!',
    notes: 'Keep the discussions brief between the rides.',
    dueDate: '2024-12-05',
    completed: false,
    status: 'backlog',
  },
  {
    id: '3',
    title: 'Code Review and Pizza Party',
    description:
      'Review the latest code changes over a pizza party with your team.',
    notes: 'Remember, no pizza grease on the keyboards!',
    dueDate: '2024-11-20',
    completed: false,
    status: 'active',
  },
  {
    id: '4',
    title: 'Update Documentation with a Karaoke Session',
    description:
      'Sing your heart out while updating the user manual with the latest changes.',
    notes: 'Bonus points for performing an original song about your project!',
    dueDate: '2024-10-25',
    completed: false,
    status: 'overdue',
  },
  {
    id: '5',
    title: 'Treasure Hunt Team Building Activity',
    description:
      'Organize a treasure hunt to improve team cohesion and find hidden gems (or just candy).',
    notes:
      'Prepare clues that relate to your project to make it educational and fun!',
    dueDate: '2024-10-30',
    completed: true,
    status: 'completed',
  },
];
