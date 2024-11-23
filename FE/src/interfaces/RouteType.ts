export type RouteType = {
    path: string;
    page: React.ComponentType<any>;
    layout?: React.ComponentType<{ children: React.ReactNode }>;
    children?: RouteType[]; // Các route con (nested routes)
  }