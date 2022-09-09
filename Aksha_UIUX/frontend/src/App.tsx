import { ThemeProvider } from "@emotion/react";
import Router from "./router/Router";
import theme from "./theme";
import { BrowserRouter } from "react-router-dom";
import Snackbar from "./component/common/toast";
import { mobileDevice } from "../src/global_store/reducers/deviceCheckReducer";
import { connect, useDispatch } from "react-redux";
import { isMobile } from './utils/common'
import { useEffect } from "react";

type propTypes = {
  show: boolean;
  indicator: string;
  message: string;
};

const App = (props: propTypes) => {
  const dispatch = useDispatch()

  useEffect(() => {
    console.log("===========isMobile.any()============")
    if (isMobile.any()) {
      //some code...
      console.log("===========mobile============")
      dispatch(mobileDevice({ is_mobile: true }))
    } else {
      console.log("===========desktop============")
      dispatch(mobileDevice({ is_mobile: false }))
    }
  })

  return (
    <div>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Router />
        </ThemeProvider>
      </BrowserRouter>
      <Snackbar
        show={props.show}
        indicator={props.indicator}
        message={props.message}
      />
    </div>
  );
};

function mapStateToProps(state: any) {
  let { show, indicator, message } = state.snackBar["toast"];

  return { show, indicator, message };
}
export default connect(mapStateToProps)(App);
