import { RouteType } from "../interfaces/RouteType";
import HomePage from "../pages/HomePage";
import PersonalInfoPage from "../pages/PersonalInfoPage";


const PublicRoute: RouteType[] = [
  {
    path: "/",
    page: HomePage,
  },
  {
    path: "/info",
    page: PersonalInfoPage,
  }
];

const PrivateRoute : RouteType[] = [
  
]

export {PrivateRoute,PublicRoute}