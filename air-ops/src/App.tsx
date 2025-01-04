import { Admin, CustomRoutes, Resource } from 'react-admin';
import { Layout } from './Layout';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';
import { Route } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import StepperForm from './components/stepper';
import { FlightInfoList } from './pages/flight-info/List';
import { FlightInfoCreate } from './pages/flight-info/Create';
import { Flight, ManageAccounts, RequestQuote,Engineering,Medication,Person } from '@mui/icons-material';

import { FlightInfoEdit } from './pages/flight-info/Edit';

import { FlightDetailsCreate } from './pages/operations/Create';
import { FlightDetailsList } from './pages/operations/List';
import { FlightDetailsEdit } from './pages/operations/Edit';
import { RolesList } from './pages/roles/List';
import { RolesCreate } from './pages/roles/Create';
import { RolesEdit } from './pages/roles/Edit';
import { QuotationsList } from './pages/quotations/List';
import { QuotationsCreate } from './pages/quotations/Create';
import { QuotationsEdit } from './pages/quotations/Edit';
import PreviewQuotation from './pages/quotations/Preview';
import { PilotsCreate } from './pages/crew-details/pilots/Create';
import { PilotsEdit } from './pages/crew-details/pilots/Edit';
import { PilotsList } from './pages/crew-details/pilots/List';
import { EngineersCreate } from './pages/crew-details/engineers/Create';
import { EngineersEdit } from './pages/crew-details/engineers/Edit';
import { EngineersList } from './pages/crew-details/engineers/List';
import { DoctorsList } from './pages/crew-details/doctors/List';
import { DoctorsCreate } from './pages/crew-details/doctors/Create';
import { DoctorsEdit } from './pages/crew-details/doctors/Edit';

export const App = () => (
  <Admin
    layout={Layout}
    dataProvider={dataProvider}
    authProvider={authProvider}
    dashboard={Dashboard}
  >
    <Resource
      name='flight-info'
      list={FlightInfoList}
      create={FlightInfoCreate}
      edit={FlightInfoEdit}
      icon={Flight}
    />

    <Resource
      name='operations'
      list={FlightDetailsList}
      create={FlightDetailsCreate}
      edit={FlightDetailsEdit}
      icon={Flight}
    />
    <Resource
      name='pilots'
      list={PilotsList}
      create={PilotsCreate}
      edit={PilotsEdit}
      icon={Person}
    />
    <Resource
      name='engineers'
      list={EngineersList}
      create={EngineersCreate}
      edit={EngineersEdit}
      icon={Engineering}
    />
    <Resource
      name='doctors'
      list={DoctorsList}
      create={DoctorsCreate}
      edit={DoctorsEdit}
      icon={Medication}
    />
    <Resource
      name='roles'
      list={RolesList}
      create={RolesCreate}
      edit={RolesEdit}
      icon={ManageAccounts}
    />
    <Resource
      name='quotations'
      list={QuotationsList}
      create={QuotationsCreate}
      edit={QuotationsEdit}
      icon={RequestQuote}
    />
    <CustomRoutes>
      <Route path='/generate-quote' element={<StepperForm />} />
      <Route path='/preview/:id' element={<PreviewQuotation />} />
    </CustomRoutes>
  </Admin>
);
