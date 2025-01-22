import { Edit, SimpleForm } from "react-admin"
import { PriceChildren } from "./Children"



export const PriceEdit=()=>{

    return (
        <Edit>
           <SimpleForm>
                      <PriceChildren/>
           </SimpleForm>
        </Edit>
    )
}
