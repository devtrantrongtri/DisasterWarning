import { RouteType } from "../interfaces/RouteType";
import HomePage from "../pages/HomePage";


const PublicRoute: RouteType[] = [
  {
    path: "/",
    page: HomePage,
  }
];

const PrivateRoute : RouteType[] = [
    
]

export {PrivateRoute,PublicRoute}