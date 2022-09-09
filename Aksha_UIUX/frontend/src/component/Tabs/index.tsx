import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { TabPanel, TabContext } from "@mui/lab";
import { TabProps } from "./tabs.types";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import "./tabs.scss";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { getDurationTime } from "../../global_store/reducers/investigationReducer";
import { useDispatch } from "react-redux";

const useStyles = makeStyles({
  tabBg: {
    background: "white",
  },
  toggleButtonContainer: {
    position: "absolute",
    right: "0",
    border: " 1px solid #0A57EB",
    borderRadius: "17px",
  },
  dropBtn: {
    position: "absolute",
    right: "0",
    top: "-11px",
  },
  toggleClass: {
    background: "#0A57EB!important",
    color: "white!important",
    borderRadius: "16px!important",
    "&:hover": {
      background: "#0A57EB!important",
      color: "white!important",
      borderRadius: "16px!important",
    },
  },
  quantityRoot: {
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&:focus-within": {
      backgroundColor: "transparent",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "0px solid red",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "0px solid #484850",
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "0px solid #484850",
      borderWidth: "0px!important",
    },
  },
});

function ColorTabs({ tabName, pages }: TabProps) {
  let location = useLocation();
  const [value, setValue] = React.useState("one");
  const classes = useStyles();
  const [toggleDays, setToggleDays] = React.useState(false);
  const [age, setAge] = React.useState("");
  const dispatch = useDispatch();
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const selectChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
    if (event.target.value === "") {
      dispatch(getDurationTime(0));
    } else {
      dispatch(getDurationTime(event.target.value));
    }
  };
  // reminder not gone to participant 

  return (
    <Box sx={{ width: "100%" }} className="tab-wrapper">
      <TabContext value={value}>
        <div>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="secondary tabs example"
            className={`px-4 pt-2 ${classes.tabBg} tabsColor`}
          >
            {tabName.map((tabs, index) => (
              <Tab key={index} value={tabs.value} label={tabs.label} />
            ))}

            {location.pathname === "/monitor" && (
              <div
                className={classes.toggleButtonContainer}
                id="monitor-holiday-buttons"
              >
                <Button
                  onClick={() => setToggleDays(true)}
                  className={toggleDays ? classes.toggleClass : ""}
                  style={{ width: "100px" }}
                >
                  Holiday
                </Button>
                <Button
                  onClick={() => setToggleDays(false)}
                  className={toggleDays ? "" : classes.toggleClass}
                  style={{ width: "100px" }}
                >
                  Work Day
                </Button>
              </div>
            )}
            {location.pathname === "/investigation" && value === "two" ? (
              <div className={classes.dropBtn}>
                <FormControl
                  sx={{ m: 1, minWidth: 120 }}
                  classes={{
                    root: classes.quantityRoot,
                  }}
                >
                  <Select
                    value={age}
                    onChange={selectChange}
                    displayEmpty
                    inputProps={{
                      "aria-label": "Without label",
                      underline: {
                        "&&&:before": {
                          border: "none",
                        },
                        "&&:after": {
                          border: "none",
                        },
                      },
                    }}
                  >
                    <MenuItem value="">Duration</MenuItem>
                    <MenuItem value={1}>1 hour</MenuItem>
                    <MenuItem value={2}>2 hour</MenuItem>
                    <MenuItem value={3}>3 hour</MenuItem>
                    <MenuItem value={4}>4 hour</MenuItem>
                  </Select>
                </FormControl>
              </div>
            ) : (
              ""
            )}
          </Tabs>
        </div>
        {pages.map((page, index) => (
          <TabPanel key={index} value={page.value}>
            {page.component}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
}

export default React.memo(ColorTabs);
