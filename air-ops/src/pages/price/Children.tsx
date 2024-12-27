import { ReactNode } from "react"
import { BooleanInput, CheckboxGroupInput, NumberInput } from "react-admin"



export const PriceChildren=():ReactNode=>{

    return(<>
     <BooleanInput source="status" label="Status"/>
            <NumberInput min={0} source="basePrice" label="Base Price"/>
            <NumberInput min={0}  source="duration" label="Duration"/>
            <NumberInput min={0} source="groundHandlingCharge" label="Ground Handling Charge"/>
            <NumberInput min={0} source="crewBeltingCharge" label="Crew Belting Charge"/>
            <NumberInput min={0} source="miscellaneousCharge" label="Miscellaneous Charge"/>
            <CheckboxGroupInput source="taxes" label="Taxes" choices={[{id:"isSGST",name: "SGST"},{id:"isCGST",name: "CGST"},{id:"isIGST",name: "IGST"}]}/>

    </>)

}