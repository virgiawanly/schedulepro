import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 0,
    label: 'Dashboard',
    isTitle: true,
  },
  {
    id: 1,
    label: 'Dashboard',
    icon: 'monitor-dot',
    link: '/admin/dashboard',
  },
  {
    id: 2,
    label: 'Jobs',
    isTitle: true,
  },
  {
    id: 4,
    label: 'Jobs',
    icon: 'briefcase',
    link: '/admin/jobs',
  },
  {
    id: 5,
    label: 'Quotes',
    icon: 'notepad-text',
    link: '/admin/quotes',
  },
  {
    id: 6,
    label: 'Invoices',
    icon: 'banknote',
    link: '/admin/invoices',
  },
  {
    id: 3,
    label: 'Scheduling',
    icon: 'calendar',
    link: '/admin/jobs',
  },
  {
    id: 7,
    label: 'General',
    isTitle: true,
  },
  {
    id: 8,
    label: 'Services',
    icon: 'box',
    subItems: [
      {
        id: 8.1,
        label: 'Services',
        link: '/admin/services',
        parentId: 8,
      },
      {
        id: 8.2,
        label: 'Materials',
        link: '/admin/materials',
        parentId: 8,
      },
      {
        id: 8.3,
        label: 'Bundles',
        link: '/admin/bundles',
        parentId: 8,
      },
    ],
  },
  {
    id: 9,
    label: 'Employees',
    icon: 'user',
    link: '/admin/employees',
  },
  {
    id: 10,
    label: 'Teams',
    icon: 'users',
    link: '/admin/teams',
  },
  {
    id: 11,
    label: 'CRM',
    icon: 'contact',
    subItems: [
      {
        id: 11.1,
        label: 'Customers',
        link: '/admin/customers',
        parentId: 11,
      },
      {
        id: 11.2,
        label: 'Customer Announcements',
        link: '/admin/customer-announcements',
        parentId: 11,
      },
      {
        id: 11.3,
        label: 'Announcement Templates',
        link: '/admin/customer-announcement-templates',
        parentId: 11,
      },
    ],
  },
  {
    id: 12,
    label: 'Settings',
    isTitle: true,
  },
  {
    id: 13,
    label: 'Settings',
    icon: 'settings',
    link: '/admin/settings',
  },
];
