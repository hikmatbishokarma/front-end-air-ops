import {
  Admin,
  CustomRoutes,
  Resource,
} from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { Route } from "react-router-dom";
import { Dashboard } from './Dashboard';
import StepperForm from "./components/stepper";
import { FlightInfoList } from "./pages/flight-info/List";
import { FlightInfoCreate } from "./pages/flight-info/Create";
import {Flight,CurrencyRupee,Policy,ManageAccounts,RequestQuote} from '@mui/icons-material';
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
import { RolesList } from "./pages/roles/List";
import { RolesCreate } from "./pages/roles/Create";
import { RolesEdit } from "./pages/roles/Edit";
import { QuotationsList } from "./pages/quotations/List";

export const App = () => (
  <Admin
    layout={Layout}
    dataProvider={dataProvider}
    authProvider={authProvider}
    dashboard={Dashboard}
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
     <Resource
      name="roles"
      list={RolesList}
     create={RolesCreate}
     edit={RolesEdit}
     icon={ManageAccounts}
    />
    <Resource
    name="quotations"
    list={QuotationsList}
    icon={RequestQuote}
    />
     <CustomRoutes>
        <Route path="/generate-quote" element={<StepperForm />} />
      </CustomRoutes>
  </Admin>
);
