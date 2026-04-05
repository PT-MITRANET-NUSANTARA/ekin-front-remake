import strings from '@/utils/strings';

export const getBreadcrumbItems = (links, pathname) => {
  const segments = pathname.split('/').filter(Boolean);

  const paths = segments.map((_, index) => {
    return '/' + segments.slice(0, index + 1).join('/');
  });

  const items = [];

  paths.forEach((path) => {
    links.forEach((group) => {
      group.children.forEach((child) => {
        if (child.path === path) {
          items.push({
            title: child.labelKey ? strings(child.labelKey) : child.label,
            path
          });
        }
      });
    });
  });

  return items;
};
