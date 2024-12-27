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
import { FlightInfoList } from "./pages/flight-info/List";
import { FlightInfoCreate } from "./pages/flight-info/Create";
import {Flight,CurrencyRupee,Policy} from '@mui/icons-material';
import { PriceList } from "./pages/price/List";
import { PriceCreate } from "./pages/price/Create";
import { PriceEdit } from "./pages/price/Edit";
import { FlightInfoEdit } from "./pages/flight-info/Edit";
import { TermsAndConditionsList } from "./pages/terms-and-conditions/List";
import { TermsAndConditionsCreate } from "./pages/terms-and-conditions/Create";
import { TermsAndConditionsEdit } from "./pages/terms-and-conditions/Edit";
import { FlightDetailsCreate } from "./pages/flight-details/Create";
import { FlightDetailsList } from "./pages/flight-details/List";
import { FlightDetailsEdit } from "./pages/flight-details/Edit";

export const App = () => (
  <Admin
    layout={Layout}
    dataProvider={dataProvider}
    authProvider={authProvider}
  >
   <Resource
      name="flight-info"
      list={FlightInfoList}
     create={FlightInfoCreate}
     edit={FlightInfoEdit}
     icon={Flight}
    />
    <Resource
      name="prices"
      list={PriceList}
     create={PriceCreate}
     edit={PriceEdit}
     icon={CurrencyRupee}
    />
    <Resource
      name="terms-and-conditions"
      list={TermsAndConditionsList}
     create={TermsAndConditionsCreate}
     edit={TermsAndConditionsEdit}
     icon={Policy}
    />
     <Resource
      name="flight-details"
      list={FlightDetailsList}
     create={FlightDetailsCreate}
     edit={FlightDetailsEdit}
     icon={Flight}
    />
     <CustomRoutes>
        <Route path="/stepper-form" element={<StepperForm />} />
      </CustomRoutes>
  </Admin>
);
