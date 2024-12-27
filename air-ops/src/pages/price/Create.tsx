
import { Create, SimpleForm } from "react-admin"
import { PriceChildren } from "./Children"




export const PriceCreate=()=>{

    return (
        <Create>
           <SimpleForm>
                      <PriceChildren/>
           </SimpleForm>
        </Create>
    )
}
