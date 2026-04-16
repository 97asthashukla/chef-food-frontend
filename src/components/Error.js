import { useRouteError } from "react-router"
export const Error = ()=>{
    let error = useRouteError()
    console.log(error,"glgkkg")
  return (<div className="error">
    <h5>OOPS!!!</h5>
    <h6>Something went wrong  {`${error.status} - ${error.data}`}</h6>
  </div>)
}