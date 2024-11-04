import { RouteType } from "../interfaces/RouteType";
import NoneLayout from "../layouts/NoneLayout";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import VerificationCodePage from "../pages/auth/VerificationCodePage";
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
  },
  {
    path: "/auth",
    page: LoginPage,
    layout : NoneLayout
  },
  {
    path: "/auth/forgot-password",
    page: ForgotPasswordPage,
    layout : NoneLayout
  },
  {
    path: "/auth/verification-code",
    page: VerificationCodePage,
    layout : NoneLayout
  },
  {
    path: "/auth/reset-password",
    page: ResetPasswordPage,
    layout : NoneLayout
  }
];

const PrivateRoute : RouteType[] = [
  
]

export {PrivateRoute,PublicRoute}