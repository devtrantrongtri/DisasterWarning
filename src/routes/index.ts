import { RouteType } from "../interfaces/RouteType";
import AdminLayout from "../layouts/AdminLayout";
import NoneLayout from "../layouts/NoneLayout";
import DashboardPage from "../pages/admin/DashboardPage";
import DisasterCategoriesPage from "../pages/admin/DisasterCategoriesPage";
import DisasterDetailsPage from "../pages/admin/DisasterDetailsPage";
import UserManagementPage from "../pages/admin/UserManagementPage";
import WarningManagementPage from "../pages/admin/WarningManagementPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
import RegistrationPage from "../pages/auth/RegistrationPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import VerificationCodePage from "../pages/auth/VerificationCodePage";
import HomePage from "../pages/HomePage";
import PersonalInfoPage from "../pages/PersonalInfoPage";
import DisasterInfoPage from "../pages/disaster/DisasterInfoPage";
import LocationPage from "../pages/location/Location";

const PublicRoute: RouteType[] = [
  {
    path: "/",
    page: HomePage,
  },
  {
    path: "/info",
    page: PersonalInfoPage,
  },
  {
    path: "/auth",
    page: LoginPage,
    layout: NoneLayout,
  },
  {
    path: "/auth/forgot-password",
    page: ForgotPasswordPage,
    layout: NoneLayout,
  },
  {
    path: "/auth/verification-code",
    page: VerificationCodePage,
    layout: NoneLayout,
  },
  {
    path: "/auth/reset-password",
    page: ResetPasswordPage,
    layout: NoneLayout,
  },
  {
    path: "/auth/register",
    page: RegistrationPage,
    layout: NoneLayout,
  },
  {
    path: "/disaster",
    page: DisasterInfoPage,
  },
  {
    path: "/location",
    page: LocationPage,
  }
];

const PrivateRoute: RouteType[] = [
  { 
    path: "/dashboard",
    page: AdminLayout,
    layout: NoneLayout,
    children: [
      { 
        path: "", 
        page: DashboardPage,
        layout: NoneLayout,
      },
      { 
        path: "disaster-categories", 
        page: DisasterCategoriesPage,
        layout: NoneLayout,
      },
      { 
        path: "disaster-details", 
        page: DisasterDetailsPage,
        layout: NoneLayout,
      },
      { 
        path: "warning-management",
        page: WarningManagementPage,
        layout: NoneLayout,
      },
      { 
        path: "user-management",
        page: UserManagementPage,
        layout: NoneLayout,
      },
    ],
  },
];


export { PrivateRoute, PublicRoute };
