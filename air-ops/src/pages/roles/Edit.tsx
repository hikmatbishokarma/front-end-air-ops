


import { Edit, SimpleForm } from "react-admin"
import { RolesChildren } from "./Children"



export const RolesEdit=()=>{

    return (
        <Edit>
           <SimpleForm>
                      <RolesChildren/>
           </SimpleForm>
        </Edit>
    )
}