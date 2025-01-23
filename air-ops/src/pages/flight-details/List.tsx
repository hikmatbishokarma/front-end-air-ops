import {
  Datagrid,
  List,
  TextField,
  BooleanField,
  EditButton,
} from 'react-admin';
import './test.css'
export const FlightDetailsList = () => {
  return (
    <List>
      <Datagrid bulkActionButtons={false}>
        <TextField source='tailNo' title='Tail No' />
        <TextField source='depatureDate' title='Depature Date Time' />
        <BooleanField source='status' title='Status' />
        <EditButton />
      </Datagrid>

      <div className='quotatios'>
        <div className="head_part">
          <div className="name_address">
            <h3>JetSetGo Aviation Services Pvt ltd</h3>
            <p>S-3 LEVEL, BLOCK E, INTERNATIONAL TRADE TOWER, NEHRU PLACE, South Delhi,</p>
            <p>Delhi, 110019</p>
            <p>Phone: +91-11-40845858</p>
            <p>E-mail: info@jetsetgo.in</p>
          </div>
          <div className="date_details">
            <p><strong>Aircraft :</strong>Hawker Beechcraft 800XP</p>
            <p><strong>Quotation No. :</strong>7990</p>
            <p><strong>Date : </strong>28.02.2024</p>
          </div>
        </div>

        <div className="disc">
          <p>Dear Sir/Madam,</p>
          <p>We are Pleased to offer to you the Hawker Beechcraft 800XP Aircraft. The commercials for the same will be as follows</p>
        </div>
        <div className="table_head">
          <h2>Flight Details</h2>
        </div>
        <div className="table_div">
          <table>
            <tr>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
              <th>ETD</th>
              <th>Apx. fly Time</th>
              <th>Remarks</th>
            </tr>
            <tr>
              <td>28February 24</td>
              <td>Begumpet</td>
              <td>Shamshabad,Hyderabad</td>
              <td>TBN</td>
              <td>00:30 </td>
              <td>Positioning</td>
            </tr>
            <tr>
              <td>28February 24</td>
              <td>Begumpet</td>
              <td>Shamshabad,Hyderabad</td>
              <td>TBN</td>
              <td>00:30 </td>
              <td>Positioning</td>
            </tr>
            <tr>
              <td>28February 24</td>
              <td>Begumpet</td>
              <td>Shamshabad,Hyderabad</td>
              <td>TBN</td>
              <td>00:30 </td>
              <td>Positioning</td>
            </tr>
          </table>
        </div>
        <div className="table_head">
          <h2>Estimated Charter Cost </h2>
          <span>INR(₹)</span>
        </div>

        <div className="table_div">
          <table>
            <tr>
              <th>Date</th>
              <th>From</th>

            </tr>
            <tr>
              <td>28February 24</td>
              <td>Begumpet</td>
            </tr>
            <tr>
              <td>28February 24</td>
              <td>Begumpet</td>
            </tr>
          </table>
        </div>

        <div className="note_disc">
          <p>Please Note :1. All quotations/options provided above are subject to all necessary permission and aircraft availability at the time of charter confirmation & as per the
            COVID protocol <br/>
            2. Any miscellaneous charges including watch hour extensions (if required) will be charged on actuals <br/>
            3. Timings to be confirmed on the basis of NOTAM and watch hours at respective Airports. <br/>
            4. If at Day/Night Halt Parking Is Unavailable Due to any reason, The Aircraft/Helicopter Shall Be Positioned And Parked To Nearest Airport and all associated charges will
            be charged Extra</p>
        </div>

      </div>

    </List>
  );
};
