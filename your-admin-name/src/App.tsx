import {
  Admin,
  CustomRoutes,
  Resource,
} from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { Route } from "react-router-dom";
import StepperForm from "./components/stepper";
import { FlightDetailList } from "./pages/flight-details/List";
import { FlightDetailsCreate } from "./pages/flight-details/Create";
import {Flight} from '@mui/icons-material';

export const App = () => (
  <Admin
    layout={Layout}
    dataProvider={dataProvider}
    authProvider={authProvider}
  >
   <Resource
      name="flight-details"
      list={FlightDetailList}
     create={FlightDetailsCreate}
     icon={Flight}
    />
     <CustomRoutes>
        <Route path="/stepper-form" element={<StepperForm />} />
      </CustomRoutes>
  </Admin>
);
