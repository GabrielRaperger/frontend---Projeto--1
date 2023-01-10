import NoMatch from "../components/template/NoMatch";
import Dashboard from "../components/dashboard/Dashboard";
import CenterData from "../components/center/CenterData";
import CenterForm from "../components/center/CenterForm";
import CenterTable from "../components/center/CenterTable";
import RoomData from "../components/room/RoomData";
import RoomForm from "../components/room/RoomForm";
import RoomTable from "../components/room/RoomTable";
import UserTable from "../components/user/UserTable";
import UserData from "../components/user/UserData";
import UserForm from "../components/user/UserForm";
import Signin from "../components/auth/Signin";
import RequireAuth from "../components/template/RequireAuth";
import VerifyAccount from "../components/auth/VerifyAccount";
import ForgotPassword from "../components/auth/ForgotPassword";
import ResetPassword from "../components/auth/ResetPassword";
import ReserveTable from "../components/reserve/ReserveTable";
import ReserveForm from "../components/reserve/ReserveForm";
import ReserveData from "../components/reserve/ReserveData";

const routes = [
  {
    path: "/",
    exact: true,
    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
  },
  {
    path: "/center-table",
    element: (
      <RequireAuth>
        <CenterTable />
      </RequireAuth>
    ),
  },
  {
    path: "/center-form",
    element: (
      <RequireAuth>
        <CenterForm />
      </RequireAuth>
    ),
  },
  {
    path: "/center-form/:id",
    element: (
      <RequireAuth>
        <CenterForm />
      </RequireAuth>
    ),
  },
  {
    path: "/center-data/:id",
    element: (
      <RequireAuth>
        <CenterData />
      </RequireAuth>
    ),
  },
  {
    path: "/room-table",
    element: (
      <RequireAuth>
        <RoomTable />
      </RequireAuth>
    ),
  },
  {
    path: "/room-data/:id",
    element: (
      <RequireAuth>
        <RoomData />
      </RequireAuth>
    ),
  },
  {
    path: "/room-form/:id",
    element: (
      <RequireAuth>
        <RoomForm />
      </RequireAuth>
    ),
  },
  {
    path: "/room-form",
    element: (
      <RequireAuth>
        <RoomForm />
      </RequireAuth>
    ),
  },
  {
    path: "/user-table",
    element: (
      <RequireAuth>
        <UserTable />
      </RequireAuth>
    ),
  },
  {
    path: "/user-data/:id",
    element: (
      <RequireAuth>
        <UserData />
      </RequireAuth>
    ),
  },
  {
    path: "/user-form/:id",
    element: (
      <RequireAuth>
        <UserForm />
      </RequireAuth>
    ),
  },
  {
    path: "/user-form",
    element: (
      <RequireAuth>
        <UserForm />
      </RequireAuth>
    ),
  },
  {
    path: "/reserve-table",
    element: (
      <RequireAuth>
        <ReserveTable />
      </RequireAuth>
    ),
  },
  {
    path: "/reserve-data/:id",
    element: (
      <RequireAuth>
        <ReserveData />
      </RequireAuth>
    ),
  },
  {
    path: "/reserve-form",
    element: (
      <RequireAuth>
        <ReserveForm />
      </RequireAuth>
    ),
  },
  {
    path: "/reserve-form/:id",
    element: (
      <RequireAuth>
        <ReserveForm />
      </RequireAuth>
    ),
  },
  {
    path: "/auth/signin",
    element: <Signin />,
  },
  {
    path: "/auth/reset-password/:id/:token",
    element: <ResetPassword />,
  },
  {
    path: "/auth/reset-password",
    element: <ForgotPassword />,
  },
  {
    path: "/auth/verify/:id/:token",
    element: <VerifyAccount />,
  },
  {
    path: "*",
    element: <NoMatch />,
  },
];

export default routes;
