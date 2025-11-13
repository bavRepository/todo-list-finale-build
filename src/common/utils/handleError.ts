import { setAppErrorAC } from "@/app/app-slice"
import { ResultCode } from "@/common/enums"
import { isErrorWithMessage } from "./isErrorWithMessage"
import { BaseQueryApi, FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue } from "@reduxjs/toolkit/query/react"

export const handleError = (
  api: BaseQueryApi,
  res: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>,
) => {
  let error = "Some error occurred"

  if (res.error) {
    switch (res.error.status) {
      case "FETCH_ERROR":
      case "PARSING_ERROR":
      case "CUSTOM_ERROR":
      case "TIMEOUT_ERROR":
        error = res.error.error
        break
      case 403:
        error = "403 Forbidden Error. Check API-KEY"
        break
      case 400:
        // Когда у нас data = unknown или undefined
        //1 sposob api.dispatch(setAppErrorAC({ error: res.error.data.message }))
        //2 sposob api.dispatch(setAppErrorAC({ error: JSON.stringify(res.error) }))
        //3sposob aktualniy type guard / type predicate
        if (isErrorWithMessage(res.error.data)) {
          error = res.error.data.message
        } else {
          error = JSON.stringify(res.error.data)
        }
        break
      default:
        if (res.error.status >= 500 && res.error.status < 600) {
          error = "Server error occurred. Please try again later."
        } else {
          error = JSON.stringify(res.error)
        }
        break
    }
    api.dispatch(setAppErrorAC({ error }))
  }
  // 2. Result code errors if implicit error like 200 OK but result code 1
  if ((res.data as { resultCode: ResultCode }).resultCode === ResultCode.Error) {
    const messages = (res.data as { messages: string[] }).messages
    error = messages.length ? messages[0] : error
    api.dispatch(setAppErrorAC({ error }))
  }
}
