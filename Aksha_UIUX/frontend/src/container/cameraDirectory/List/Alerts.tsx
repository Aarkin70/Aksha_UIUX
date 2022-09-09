import React, { Component } from 'react';
import { Tooltip, Spin, Modal, Select, message } from 'antd';
import DeleteAlertModal from './custom/DeleteAlertModal';
import axios from 'axios';
import moment from 'moment';
import CanvasDraw2 from '../../../component/common/canvasDraw2';
import ImageBox from "../../../component/common/canvasFramesForAlert";
import NoDataFound from '../NoDataFound'
import { ContentPasteSearchOutlined } from '@mui/icons-material';
import { connect, useDispatch } from "react-redux";

const { Option } = Select;

class Alerts extends Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            alertlist: [],
            modalStatus: false,
            tableloader: false,
            formloader: false,
            modalopened: '',
            isMobileDevice: false,
            weeks: [
                {
                    id: 1,
                    name: 'Mon',
                    value: 'Monday',
                    selected: true,
                },
                {
                    id: 2,
                    name: 'Tue',
                    value: 'Tuesday',
                    selected: true,
                },
                {
                    id: 3,
                    name: 'Wed',
                    value: 'Wednesday',
                    selected: true,
                },
                {
                    id: 4,
                    name: 'Thu',
                    value: 'Thursday',
                    selected: true,
                },
                {
                    id: 5,
                    name: 'Fri',
                    value: 'Friday',
                    selected: true,
                },
                {
                    id: 6,
                    name: 'Sat',
                    value: 'Saturday',
                    selected: true,
                },
                {
                    id: 7,
                    name: 'Sun',
                    value: 'Sunday',
                    selected: true,
                },
            ],
            activeStep: 0,
            selectedCamera: [],
            selectedObjectofInter: 'Person',
            selectedfrequency: 'Daily',
            selecteButttonDay: 'Working Day',
            cameralist: [],
            alert_name: '',
            alert_description: '',
            props_camera: '',
            start_time: '',
            end_time: '',
            timeList: [
                { label: '00 AM', value: '0' },
                { label: '01 AM', value: '1' },
                { label: '02 AM', value: '2' },
                { label: '03 AM', value: '3' },
                { label: '04 AM', value: '4' },
                { label: '05 AM', value: '5' },
                { label: '06 AM', value: '6' },
                { label: '07 AM', value: '7' },
                { label: '08 AM', value: '8' },
                { label: '09 AM', value: '9' },
                { label: '10 AM', value: '10' },
                { label: '11 AM', value: '11' },
                { label: '12 PM', value: '12' },
                { label: '01 PM', value: '13' },
                { label: '02 PM', value: '14' },
                { label: '03 PM', value: '15' },
                { label: '04 PM', value: '16' },
                { label: '05 PM', value: '17' },
                { label: '06 PM', value: '18' },
                { label: '07 PM', value: '19' },
                { label: '08 PM', value: '20' },
                { label: '09 PM', value: '21' },
                { label: '10 PM', value: '22' },
                { label: '11 PM', value: '23' },
            ],
            viewmodalstatus: false,
            viewdata: {},
            alert_status: '',
            display_activation: '',
            email_activation: '',
            edit_alert_id: '',
            camera_img: '',
            add_camera_img: [],
            aipollygon: [],
            listofobjectlabels: [],
            viewimagedata: {},
            noAvailableStatus: false,
            listOfCamera: [],
            working_day: true,
            holiday: false,
        }
    }
    // show add alert popup
    handleShow = () => {
        this.setState({
            modalStatus: true,
            submittype: 'add',
            activeStep: 0,
            selectedCamera: [this.state.props_camera],
            modalopened: "",
            alert_name: '',
            alert_description: '',
            selectedObjectofInter: 'Person',
            selecteButttonDay: 'Holiday',
            start_time: '',
            end_time: '',
            alert_status: '',
            display_activation: '',
            email_activation: '',
            weekarr: [],
        });
    }
    handleClose = () => this.setState({ modalStatus: false, submittype: '' });

    // get alert list
    getalertlist = () => {
        let url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_ALERT}${this.state.props_camera}`;
        this.setState({ tableloader: false });
        axios.get(url)
            .then((response: any) => {
                if (response.data.success == true) {
                    this.setState({
                        tableloader: false,
                        alertlist: response.data.alerts.reverse(),
                        noAvailableStatus: true,
                    });
                } else {
                    this.setState({
                        tableloader: false,
                        noAvailableStatus: true,
                    });
                }
            })
            .catch((error: any) => {
                this.setState({ tableloader: false });
            })
    }

    // get camera list
    getcameralist = () => {
        let url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_CAMERA}`;
        axios.get(url)
            .then((response) => {
                let arr: any[] = [];
                for (let item of response.data.cameras) {
                    if (item.Active == true) {
                        arr = [...arr, item];
                    }
                }
                console.log('arr', arr);
                this.setState({ cameralist: arr.reverse() });
            })
            .catch((error) => { });
    }

    // get alert list
    getimagebycameraname = async (type: any) => {
        let camera_names = type ? type : [this.state.props_camera]
        let arr: any = []
        for (let i = 0; i < camera_names.length; i++) {
            let url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_AREA_OF_INTERESET}` + camera_names[i];
            this.setState({ tableloader: false });
            axios.get(url)
                .then((response: any) => {
                    if (response.data.success == true) {
                        arr.push(response.data.image)
                        this.setState({ camera_img: response.data.image, add_camera_img: arr });
                    } else {
                    }
                })
                .catch((error: any) => {
                })
        }
    }
    componentDidMount() {
        this.getcameralist();
        // console.log('props',this.props.camera_name);
        if (this.props) {
            this.setState({ props_camera: this.props.camera_name }, () => {
                this.getalertlist();
                this.getimagebycameraname(null);
            });
        }
        this.getoobjectofinterestlabels();
    }

    // on change week
    handleChangeWeek = (id: any) => {
        let arr: any = [];
        // @ts-ignore
        this.state.weeks.map((item: any, index) => {
            if (item.id === id) {
                item.selected = !item.selected;
            }
            arr.push(item);
        });
        this.setState({ weeks: arr });
    }

    // on select all cameras
    handleSelectAllCameras = (e: any) => {
        if (e.target.checked) {
            let arr: any = [];
            // @ts-ignore
            this.state.cameralist.map((item: any) => {
                arr.push(item.Camera_Name);
            });
            this.setState({ selectedCamera: arr }, () => {
                this.getimagebycameraname(arr)
            });
        } else {
            this.setState({ selectedCamera: [] });
        }
    }

    showstep0 = () => {
        this.setState({ activeStep: 0 });
    }
    showstep1 = () => {
        if (this.state.alert_name == '') {
            message.warning('Alert name is required.'); return;
        } else if (this.state.alert_description == '') {
            message.warning('Alert description is required.'); return;
        } else if (this.state.selectedCamera.length == 0) {
            message.warning('Please select the camera first'); return;
        }
        this.setState({ activeStep: 1 });
    }
    showstep2 = () => {
        this.setState({ activeStep: 2 });
    }
    toDataUrl = (url: any, callback: any) => {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
    }

    // camera_list:[
    //     {
    //         came
    //         vid
    //         Alert
    //     },{

    //     }
    // ],

    add_alert = () => {
        let weekarr: any = [];
        for (let item of this.state.weeks) {
            if (item.selected == true) {
                weekarr = [...weekarr, item.value];
            }
        }
        if (this.state.selectedCamera.length == 1) {
            if (this.state.aipollygon.length == 0) {
                message.warning('Please draw object on given image');
                return;
            }
        }

        let params = {
            Alert_Name: this.state.alert_name,
            Alert_Description: this.state.alert_description,
            Camera_Name: this.state.selectedCamera,
            Object_Class: this.state.selectedObjectofInter,
            Holiday_Status: this.state.holiday,
            Workday_Status: this.state.working_day,
            Alert_Status: 'active',
            Days_Active: weekarr,
            Display_Activation: true,
            Email_Activation: true,
            Start_Time: this.state.start_time,
            End_Time: this.state.end_time,
            Object_Area: this.state.selectedCamera.length > 1 ? [] : this.state.aipollygon,
        }

        // console.log('params',params);	
        // return;	
        let url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_ALERT_CREATE} `;
        const headers = {
            "Content-Type": "application/json; charset=utf-8"
        }
        axios.post(url, params, {
            headers: headers
        })
            .then((res) => {
                if (res.data.success == true) {
                    // console.log('res',res);
                    message.success('Alert is created successfully.');

                    this.setState({
                        activeStep: 0,
                        alert_name: '',
                        alert_description: '',
                        selectedCamera: [],
                        selectedObjectofInter: '',
                        selecteButttonDay: '',
                        start_time: '',
                        end_time: '',
                        modalStatus: false,
                    }, () => this.getalertlist());
                    this.getcameralist();
                    setTimeout(() => {
                        this.handleClose();
                        this.start_servilence();
                        // window.location.assign('/monitor');
                    }, 1000);
                } else {
                    message.warning(res.data.message);
                }
            });
    }
    // start survilence
    start_servilence = () => {
        let arr: any[] = [];

        if (this.state.selectedCamera.length > 0) {
            for (let item of this.state.cameralist) {
                if (this.state.selectedCamera.includes(item.Camera_Name)) {
                    let obj = {
                        Camera_name: item.Camera_Name,
                        Rtsp_Link: item.Rtsp_Link,
                        Alert: item.Alert,
                    }
                    arr = [...arr, obj];
                }
            }
        }
        let params = {
            Camera_List: arr,
        }

        // return;

        const headers = {
            "Content-Type": "application/json; charset=utf-8"
        }
        let url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_START_SURVIELLANCE}`;
        axios.post(url, params, {
            headers: headers
        })
            .then((res) => {

                if (res.data.success == true) { } else { }
            });
    }


    handleChangeCamera = (value: any) => {
        console.log("=====value=====", value)
        this.setState({ selectedCamera: value });
        this.getimagebycameraname(value)
    }

    handleChangeObjectofInter = (value: any) => {
        this.setState({ selectedObjectofInter: value });
    }

    handleChangeFrequency = (value: any) => {
        this.setState({ selectedfrequency: value });

        if (value == 'Daily') {
            let arr: any = [];
            // @ts-ignore
            this.state.weeks.map((item: any) => {
                item.selected = true;
                arr.push(item);
            })
            this.setState({ weeks: arr });
        } else {
            let arr: any = [];
            // @ts-ignore
            this.state.weeks.map((item: any) => {
                item.selected = false;
                arr.push(item);
            });
            this.setState({ weeks: arr });
        }
    }


    onChangeSingleEmailAlerts = (item: any) => {
        let arr: any = [];
        let display_activ = false;
        let id = '';
        this.state.alertlist.map((alert: any) => {
            if (alert._id === item._id) {
                alert.Email_Activation = !alert.Email_Activation;
                display_activ = alert.Display_Activation;
                id = alert._id;
            }
            arr = [...arr, alert];
        });
        let email_ac = item.Email_Activation;
        // @ts-ignore
        this.updatealert(id, email_ac, display_activ, item, 'email');
        this.setState({ alertlist: arr });
    }

    onChangeSingleDisplayAlerts = (item: any) => {
        let arr: any = [];
        let email_active = false;
        let id = '';
        this.state.alertlist.map((alert: any) => {
            if (alert._id === item._id) {
                alert.Display_Activation = !alert.Display_Activation;
                email_active = alert.Email_Activation;
                id = alert._id;
            }
            arr = [...arr, alert];
        });
        let display_active = item.Display_Activation;

        // @ts-ignore
        this.updatealert(id, email_active, display_active, item, 'display');
        this.setState({ alertlist: arr });
    }

    // @ts-ignore
    updatealert = (id, email_active, display_active, item, type) => {
        let weekarr: any = [];
        for (let item of this.state.weeks) {
            if (item.selected == true) {
                weekarr = [...weekarr, item.value];
            }
        }
        let message2 = '';
        if (type == 'email') {
            if (email_active == true) {
                message2 = 'Email notification will be send.';
            } else {
                message2 = 'Email notification will not be send.';
            }
        } else {
            if (display_active == true) {
                message2 = 'Alert will be displayed.';
            } else if (display_active == false) {
                message2 = 'Your alert will not be displayed.';
            }
        }
        let params = {
            Alert_Name: item.Alert_Name,
            Alert_Description: item.Alert_Description,
            Camera_Name: item.Camera_Name,
            Object_Class: item.Object_Class,
            Holiday_Status: item.Holiday_Status,
            Workday_Status: item.Workday_Status,
            Alert_Status: item.Alert_Status,
            Days_Active: weekarr,
            Display_Activation: display_active,
            Email_Activation: email_active,
            Start_Time: item.Start_Time,
            End_Time: item.End_Time,
            Object_Area: item.Object_Area,
        }
        let url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_ALERT_UPDATE}` + id;
        const headers = {
            "Content-Type": "application/json; charset=utf-8"
        }
        axios.put(url, params, {
            headers: headers
        })
            .then((res) => {
                if (res.data.success == true) {
                    message.success(message2);
                    this.setState({
                        activeStep: 0,
                        alert_name: '',
                        alert_description: '',
                        selectedCamera: [],
                        selectedObjectofInter: '',
                        selecteButttonDay: '',
                        start_time: '',
                        end_time: '',
                        modalStatus: false,
                        submittype: '',
                        edit_alert_id: '',
                        alert_status: '',
                        display_activation: false,
                        email_activation: false,
                    }, () => this.getalertlist());
                    setTimeout(() => {
                        this.handleClose();
                    }, 4000);
                } else {
                    message.warning(res.data.message);
                }
            });
    }

    showviewmodal = (item: any) => {
        this.setState({
            viewdata: item,
            viewmodalstatus: true,
        });
        this.setState({ viewimagedata: item });

    }
    showeditmodal = (item: any) => {
        let weekarr: any = [];
        for (let item2 of this.state.weeks) {
            if (item.Days_Active.includes(item2.value)) {
                item2.selected = true;
            } else {
                item2.selected = false;
            }
            weekarr = [...weekarr, item2];
        }
        let obj = {};
        if (this.state.camera_img) {
            let img = this.state.camera_img;
            this.toDataUrl(img, async function (myBase64: any) {
                // @ts-ignore
                obj.base_url = await myBase64;
                // @ts-ignore
                obj.Results = Array.isArray(item.Object_Area)
                    ? item.Object_Area.flat(1)
                    : `${item.Object_Area[0].x[0]} ${item.Object_Area[0].x[1]},${item.Object_Area[0].y[0]} ${item.Object_Area[0].y[1]} ,${item.Object_Area[0].w[0]} ${item.Object_Area[0].w[1]},${item.Object_Area[0].h[0]} ${item.Object_Area[0].h[1]}`;
            });
        }
        setTimeout(() => {
            this.setState({ viewimagedata: obj });
        }, 500);
        let from_time = 0;
        let to_time = 0;
        for (let single of this.state.timeList) {
            if (item.Start_Time == single.value) {
                from_time = single.label;
            }
            if (item.End_Time == single.value) {
                to_time = single.label;
            }
        }
        this.setState({
            viewdata: item,
            modalStatus: true,

            alert_name: item.Alert_Name,
            alert_description: item.Alert_Description,
            selectedCamera: item.Camera_Name,
            selectedObjectofInter: item.Object_Class,
            holiday: item.Holiday_Status,
            working_day: item.Workday_Status,
            start_time: from_time,
            end_time: to_time,
            alert_status: item.Alert_Status,
            display_activation: item.Display_Activation,
            email_activation: item.Email_Activation,
            weekarr: weekarr,
            edit_alert_id: item._id,
            submittype: 'edit',
            modalopened: 'edit',
            activeStep: 3,
        });
        let arr: string[] = [];
        if (item.Camera_Name.length > 1) {
            for (let single of item.Camera_Name) {
                for (let inner of this.state.cameralist) {
                    if (inner.Camera_Name == single && (inner.image != '')) {
                        let obj = {
                            name: inner.Camera_Name,
                            image: inner.image
                        }
                        // @ts-ignore
                        arr = [...arr, obj];
                    }
                }
            }
        }
        setTimeout(() => {
            // @ts-ignore

            this.setState({ listOfCamera: arr });

        }, 2000);
    }
    showviewdetailsmodal = (item: any) => {

        let weekarr: any = [];
        for (let item2 of this.state.weeks) {
            if (item.Days_Active.includes(item2.value)) {
                item2.selected = true;
            } else {
                item2.selected = false;
            }
            weekarr = [...weekarr, item2];
        }
        let obj = {};
        if (this.state.camera_img) {
            let img = this.state.camera_img;
            this.toDataUrl(img, async function (myBase64: any) {
                // @ts-ignore
                obj.base_url = await myBase64;
                // @ts-ignore
                obj.Results = Array.isArray(item.Object_Area)
                    ? item.Object_Area.flat(1)
                    : `${item.Object_Area[0].x[0]} ${item.Object_Area[0].x[1]},${item.Object_Area[0].y[0]} ${item.Object_Area[0].y[1]} ,${item.Object_Area[0].w[0]} ${item.Object_Area[0].w[1]},${item.Object_Area[0].h[0]} ${item.Object_Area[0].h[1]} `;
            });
        }
        setTimeout(() => {
            this.setState({ viewimagedata: obj });
        }, 500);
        let from_time = 0;
        let to_time = 0;
        for (let single of this.state.timeList) {
            if (item.Start_Time == single.value) {
                from_time = single.label;
            }
            if (item.End_Time == single.value) {
                to_time = single.label;
            }
        }
        this.setState({
            viewdata: item,
            modalStatus: true,
            alert_name: item.Alert_Name,
            alert_description: item.Alert_Description,
            selectedCamera: item.Camera_Name,
            selectedObjectofInter: item.Object_Class,
            holiday: item.Holiday_Status,
            working_day: item.Workday_Status,
            start_time: from_time,
            end_time: to_time,
            alert_status: item.Alert_Status,
            display_activation: item.Display_Activation,
            email_activation: item.Email_Activation,
            weekarr: weekarr,
            edit_alert_id: item._id,
            submittype: 'view',
            modalopened: 'view',
            activeStep: 3,
        });

        // @ts-ignore
        let arr: string[] = [];
        if (item.Camera_Name.length > 1) {
            for (let single of item.Camera_Name) {
                for (let inner of this.state.cameralist) {
                    if (inner.Camera_Name == single && (inner.image != '')) {
                        let obj = {
                            name: inner.Camera_Name,
                            image: inner.image
                        }
                        // @ts-ignore
                        arr = [...arr, obj];
                    }
                }
            }
        }
        setTimeout(() => {
            // @ts-ignore

            this.setState({ listOfCamera: arr });

        }, 2000);
    }
    update_alert = () => {
        let weekarr: any = [];
        for (let item of this.state.weeks) {
            if (item.selected == true) {
                weekarr = [...weekarr, item.value];
            }
        }
        let from_time = this.state.start_time;
        let to_time = this.state.end_time;
        for (let single of this.state.timeList) {
            if (this.state.start_time.includes('AM') || this.state.start_time.includes('PM')) {
                if (this.state.start_time == single.label) {
                    from_time = single.value;
                }
            }
            if (this.state.end_time.includes('AM') || this.state.end_time.includes('PM')) {
                if (this.state.end_time == single.label) {
                    to_time = single.value;
                }
            }
        }
        let params = {
            Alert_Name: this.state.alert_name,
            Alert_Description: this.state.alert_description,
            Camera_Name: this.state.selectedCamera,
            Object_Class: this.state.selectedObjectofInter,
            Holiday_Status: this.state.holiday,
            Workday_Status: this.state.working_day,
            Alert_Status: this.state.alert_status,
            Days_Active: weekarr,
            Display_Activation: this.state.display_activation,
            Email_Activation: this.state.email_activation,
            Start_Time: from_time,
            End_Time: to_time,
            Object_Area: this.state.selectedCamera.length > 1 ? [] : this.state.aipollygon,
        }

        // return;
        let url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_ALERT_UPDATE}` + this.state.edit_alert_id;
        const headers = {
            "Content-Type": "application/json; charset=utf-8"
        }
        axios.put(url, params, { headers: headers })
            .then((res) => {
                if (res.data.success == true) {

                    message.success('Alert is updated successfully.');

                    this.setState({
                        activeStep: 0,
                        alert_name: '',
                        alert_description: '',
                        selectedCamera: [],
                        selectedObjectofInter: '',
                        selecteButttonDay: '',
                        start_time: '',
                        end_time: '',
                        modalStatus: false,
                        submittype: '',
                        edit_alert_id: '',
                        alert_status: '',
                        display_activation: false,
                        email_activation: false,
                    }, () => this.getalertlist());
                    this.getcameralist();
                    setTimeout(() => {
                        this.handleClose();
                        this.start_servilence();
                    }, 2000);
                    this.getimagebycameraname(null);
                } else {
                    message.warning(res.data.message);
                }
            });
    }
    submit_button = () => {
        if (this.state.submittype == 'edit') {
            this.update_alert();
        } else {
            this.add_alert();
        }
    }
    //@ts-ignore
    setAIPolygen = (params: any) => {
        this.setState({ aipollygon: params });
    }
    getoobjectofinterestlabels = () => {
        let url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_OBJECT_OF_INTEREST_LABELS}`;
        axios.get(url)
            .then((res) => {
                if (res.data.success == true) {
                    this.setState({ listofobjectlabels: res.data.labels });
                }
            });
    }
    // @ts-ignore 
    checkIfImageExists = (url) => {
        const img = new Image();
        img.src = url;
        let status = true;
        if (img.complete) {
            status = true;
        } else {
            img.onload = () => {
                status = true;
            };
            img.onerror = () => {
                status = false;
            };
        }
        return status;
    }

    render() {
        console.log("====add_camera_img=======", this.state.add_camera_img, this.props.is_mobile)
        if (this.props.is_mobile) {
            if (!this.state.isMobileDevice) {
                this.setState({ isMobileDevice: true })
            }
        } else {
            if (this.state.isMobileDevice) {
                this.setState({ isMobileDevice: false })
            }
        }
        return (
            <div className='corner bg-white padding-cls-camera'>
                {/* @ts-ignore */}
                {this.state.alertlist && this.state.alertlist.length > 0 ? <Spin spinning={this.state.tableloader}>
                    <table className='w-100' style={{ fontSize: 15 }}>
                        <tr>
                            <th className='fs-14 left-radius'>Alert Name</th>
                            <th className='fs-14'>Email Alerts</th>
                            <th className='fs-14'>Display Alerts</th>
                            <th className='right-radius'></th>
                        </tr>
                        {/* @ts-ignore */}
                        {this.state.alertlist && this.state.alertlist.map((item: any, index) => (
                            <tr>
                                <td>
                                    {item.Camera_Name.length > 1 ? (
                                        <span
                                            style={{
                                                color: '#0a57eb',
                                                fontWeight: 500,
                                                textTransform: 'capitalize',
                                            }}
                                        >{item.Alert_Name}</span>
                                    ) : (
                                        <span style={{
                                            fontWeight: 500,
                                            textTransform: 'capitalize',
                                        }}>{item.Alert_Name}</span>
                                    )}

                                </td>
                                <td>
                                    <div className="form-check" style={{ marginLeft: '38%' }}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="flexCheckDefault"
                                            checked={item.Email_Activation}
                                            onChange={() => this.onChangeSingleEmailAlerts(item)}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className="form-check" style={{ marginLeft: '38%' }}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={item.Display_Activation}
                                            id="flexCheckDefault"
                                            onChange={() => this.onChangeSingleDisplayAlerts(item)}
                                        />
                                    </div>
                                </td>
                                <td className='right-radius'>
                                    <div className='d-flex'
                                        style={{
                                            position: 'relative',
                                            top: 5,
                                        }}
                                    >
                                        <a href="#" onClick={() => this.showeditmodal(item)}>
                                            <Tooltip title='Edit Alert'>
                                                <i
                                                    style={{
                                                        fontSize: 24,
                                                        color: '#ff00f7',
                                                        marginRight: 10
                                                    }}
                                                    className='bx bx-edit-alt'></i>
                                            </Tooltip>
                                        </a>

                                        <a href="#" onClick={() => this.showviewdetailsmodal(item)}>
                                            <Tooltip title="View Alert">
                                                <i
                                                    style={{
                                                        fontSize: 25,
                                                        color: '#0a57eb'
                                                    }}
                                                    className='bx bx-show'></i>
                                            </Tooltip>
                                        </a>
                                        <DeleteAlertModal
                                            data={item}
                                            camera={this.state.props_camera}
                                            refresh={() => this.getalertlist()}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {this.state.alertlist.length == 0 && (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center' }}>Data is not Available.</td>
                            </tr>
                        )}
                    </table>
                </Spin> : (<>
                    {this.state.noAvailableStatus == true ? <NoDataFound /> : ''}
                </>)}

                <button
                    className='addButton'
                    onClick={this.handleShow}
                    style={{
                        marginTop: 50,
                    }}
                >
                    Add Alert
                </button>


                <Modal
                    // @ts-ignore
                    title="Alert Details"
                    visible={this.state.viewmodalstatus}
                    onOk={() => this.setState({ viewmodalstatus: false })}
                    onCancel={() => this.setState({ viewmodalstatus: false })}
                    className='add-camera-modal'
                    width={500}
                    footer={false}
                >
                    {this.state.viewdata && (
                        <p>
                            Alert Name: {this.state.viewdata.Alert_Name ? this.state.viewdata.Alert_Name : '---'}<br />
                            Alert Description: {this.state.viewdata.Alert_Description ? this.state.viewdata.Alert_Description : '---'}<br />
                            Alert Status: {this.state.viewdata.Alert_Status ? this.state.viewdata.Alert_Status : '---'}<br />
                            Camera Name: {this.state.viewdata.Camera_Name ? this.state.viewdata.Camera_Name.join(", ").toString() : '---'}<br />
                            Days Active: {this.state.viewdata.Days_Active ? this.state.viewdata.Days_Active.join(", ").toString() : '---'}<br />
                            Display Activation: {this.state.viewdata.Display_Activation == true ? 'Yes' : 'No'}<br />
                            Email Activation: {this.state.viewdata.Email_Activation == true ? 'Yes' : 'No'}<br />
                            Start Time: {this.state.viewdata.Start_Time ? moment(this.state.viewdata.Start_Time).format('DD MMM, YYYY') : '---'}<br />
                            End Time: {this.state.viewdata.End_Time ? moment(this.state.viewdata.End_Time).format('DD MMM, YYYY') : '---'}<br />
                            Object Class: {this.state.viewdata.Object_Class ? this.state.viewdata.Object_Class : '---'}<br />
                            Holiday Status: {this.state.viewdata.Holiday_Status == true ? 'Yes' : 'No'}<br />
                            Weekday Status: {this.state.viewdata.Workday_Status == true ? 'Yes' : 'No'}<br />
                            Created At: {this.state.viewdata.Timestamp ? moment(this.state.viewdata.Timestamp).format('DD MMM, YYYY') : 'No'}<br />
                        </p>
                    )}
                </Modal>

                {/* start Add modal  */}
                <Modal
                    // @ts-ignore
                    visible={this.state.modalStatus}
                    onOk={this.handleClose}
                    onCancel={this.handleClose}
                    className='add-camera-modal'
                    width={'100%'}
                    footer={false}
                >
                    <div className="add-camera-step-form">
                        <div className="step-items">
                            <div className="item">
                                {/* @ts-ignore */}
                                <div className={(this.state.activeStep === 1 || this.state.activeStep === 2 || this.state.activeStep === 3) ? "icon active" : "icon"}>1</div>
                                <span>Alert Details</span>
                                {/* @ts-ignore */}
                                <div className={(this.state.activeStep === 2 || this.state.activeStep === 3) ? 'line active' : 'line'}></div>
                            </div>
                            <div className="item">
                                {/* @ts-ignore */}
                                <div className={(this.state.activeStep === 2 || this.state.activeStep === 3) ? "icon active" : "icon"}>2</div>
                                <span>Alert schedule</span>
                                {/* @ts-ignore */}
                                <div className={this.state.activeStep === 3 ? 'line active' : 'line'}></div>
                            </div>
                            <div className="item">
                                {/* @ts-ignore */}
                                <div className={(this.state.activeStep === 3) ? "icon active" : "icon"}>3</div>
                                <span>Save alert</span>
                            </div>
                        </div>

                        {/* <div 
                                    className="close-button"
                                    onClick={()=>this.handleClose()}
                                >
                                    <i className='bx bx-x'></i>
                                </div> */}

                        <div
                            className="container"

                            style={{ margin: '0 1px', maxWidth: '100%' }}
                        >
                            <div className="row">
                                <div className="col-lg-12" style={{ display: this.state.isMobileDevice ? 'block' : 'flex' }}>
                                    <div className="col-lg-7">
                                        {/* @ts-ignore */}
                                        <div className='row align-items-start '>
                                            {this.state.activeStep == 0 && (
                                                <div className="col-lg-8 left-content"
                                                    style={{ paddingRight: 30 }}>
                                                    <h2>Alert Details</h2>
                                                    <span>Add alert name, type camera & area of interest</span>
                                                    <br />
                                                    <br />
                                                    <div className="single-fleld">
                                                        <label htmlFor="">Alert Name</label>
                                                        <input
                                                            type="text"
                                                            placeholder='Eg. Vehicle entry'
                                                            // @ts-ignore 
                                                            value={this.state.alert_name}
                                                            onChange={(e) => this.setState({ alert_name: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="single-fleld">
                                                        <label htmlFor="">Alert Description</label>
                                                        <textarea
                                                            placeholder='Alert on vehicle entry in premises'
                                                            cols={30} rows={4} maxLength={100}
                                                            // @ts-ignore 
                                                            value={this.state.alert_description}
                                                            onChange={(e) => this.setState({ alert_description: e.target.value })}
                                                        ></textarea>
                                                    </div>
                                                    <div className="row px-0">
                                                        <div className="col-lg-8">
                                                            <div className="single-fleld">
                                                                <label htmlFor="">Camera</label>
                                                                <Select
                                                                    mode='multiple'
                                                                    style={{ width: '100%', height: 45, marginTop: 11 }}
                                                                    placeholder="Please Select Camera"
                                                                    // @ts-ignore 
                                                                    value={this.state.selectedCamera}
                                                                    onChange={(e) => { this.handleChangeCamera(e) }}
                                                                    className='form-select'
                                                                    maxTagCount={1}
                                                                >
                                                                    {/* @ts-ignore  */}
                                                                    {this.state.cameralist && this.state.cameralist.map((item: any, index: any) => (
                                                                        <Option key={index} value={item.Camera_Name}>{item.Camera_Name}</Option>
                                                                    ))}
                                                                </Select>

                                                                <div
                                                                    className="form-check"
                                                                    style={{ marginTop: 20 }}
                                                                >
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="selectallcameras"
                                                                        style={{ width: 18 }}
                                                                        onChange={this.handleSelectAllCameras}
                                                                    />
                                                                    &nbsp;&nbsp;
                                                                    <label
                                                                        className="form-check-label"
                                                                        style={{
                                                                            fontSize: 16,
                                                                            position: 'relative',
                                                                            top: 10,
                                                                        }}
                                                                        htmlFor='selectallcameras'
                                                                    >
                                                                        Select All Cameras
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-8">
                                                            <div className="single-fleld">
                                                                <label htmlFor="">Object of interest</label>
                                                                <Select
                                                                    style={{ width: '100%', height: 45, marginTop: 11 }}
                                                                    placeholder="Please select Object of interest"
                                                                    // @ts-ignore
                                                                    value={this.state.selectedObjectofInter}
                                                                    onChange={this.handleChangeObjectofInter}
                                                                    className='form-select'
                                                                    maxTagCount={1}
                                                                >
                                                                    {/* @ts-ignore */}
                                                                    {this.state.listofobjectlabels && this.state.listofobjectlabels.map((item, index) => {
                                                                        return (
                                                                            <Option value={item} key={index}>{item}</Option>
                                                                        )
                                                                    })}
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            )}
                                            {/* @ts-ignore */}
                                            {(this.state.activeStep == 1) && (
                                                <div className="col-lg-6 left-content" style={{
                                                    paddingRight: 30
                                                }}>
                                                    <h2>Alert Schedule</h2>
                                                    <span>Add days, time and repitiion</span>
                                                    <br />
                                                    <br />
                                                    <div className="single-fleld">
                                                        <label htmlFor="">Frequency</label>
                                                        <Select
                                                            style={{ width: '100%', height: 45, marginTop: 11 }}
                                                            placeholder="Please select"
                                                            // @ts-ignore
                                                            value={this.state.selectedfrequency}
                                                            onChange={this.handleChangeFrequency}
                                                            className='form-select'
                                                            maxTagCount={1}
                                                        >
                                                            <Option value="Daily">Daily</Option>
                                                            <Option value="Custom">Custom</Option>
                                                        </Select>
                                                    </div>

                                                    <div className="form-button-group">
                                                        <button
                                                            style={{ marginLeft: 0 }}
                                                            // @ts-ignore
                                                            className={this.state.working_day == true ?
                                                                "filled-button" : 'outlined-button'}
                                                            onClick={() => this.setState({ working_day: this.state.working_day == true ? false : true })}
                                                        >
                                                            Working Day
                                                        </button>
                                                        <button
                                                            style={{ marginLeft: 20 }}
                                                            // @ts-ignore
                                                            className={this.state.holiday == true ?
                                                                "filled-button" : 'outlined-button'}
                                                            onClick={() => this.setState({ holiday: this.state.holiday == true ? false : true })}
                                                        >
                                                            Holiday
                                                        </button>
                                                    </div>

                                                    <div
                                                        className="selected-days"
                                                        style={{ marginTop: 20 }}
                                                    >
                                                        {/* @ts-ignore */}
                                                        {this.state.weeks && this.state.weeks.map((item: any, index) => {
                                                            return (
                                                                <div className="day" key={index}>
                                                                    <div className="form-check">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            id="flexCheckDefault"
                                                                            checked={item.selected}
                                                                            onChange={() => this.handleChangeWeek(item.id)}
                                                                        />
                                                                    </div>
                                                                    <p>{item.name}</p>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    <div className='row'>
                                                        <div className="col-lg-6 mb-3">
                                                            <div className="single-fleld">
                                                                <label htmlFor="">From</label>
                                                                <Select
                                                                    style={{ width: '100%', height: 45, marginTop: 11 }}
                                                                    placeholder="From Time"
                                                                    className='form-select'
                                                                    defaultValue={this.state.start_time}
                                                                    value={this.state.start_time}
                                                                    onChange={(value) => this.setState({ start_time: value })}
                                                                >
                                                                    {this.state.timeList && this.state.timeList.map((item: any, index: any) => {
                                                                        return (
                                                                            <Option value={item.value}>{item.label}</Option>
                                                                        )
                                                                    })}
                                                                </Select>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 mb-3">
                                                            <div className="single-fleld">
                                                                <label htmlFor="">To</label><br />
                                                                <Select
                                                                    style={{ width: '100%', height: 45, marginTop: 11 }}
                                                                    placeholder="To Time"
                                                                    className='form-select'
                                                                    value={this.state.end_time}
                                                                    onChange={(value) => this.setState({ end_time: value })}
                                                                >
                                                                    {this.state.timeList && this.state.timeList.map((item: any, index: any) => {
                                                                        return (
                                                                            <Option key={index} value={item.value}>{item.label}</Option>
                                                                        )
                                                                    })}
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div
                                                    className="form-button-group"
                                                    style={{ marginTop: 70 }}
                                                >
                                                    <button
                                                        className="outlined-button"
                                                        onClick={() => this.showstep0()}
                                                    >
                                                        Back
                                                    </button>
                                                    {this.state.modalopened == 'view' ? (
                                                        <button
                                                            onClick={() => this.showstep2()}
                                                            className="filled-button"
                                                        >
                                                            Next
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => this.showstep2()}
                                                            className="filled-button"
                                                        >
                                                            Save & Continue
                                                        </button>
                                                    )}
                                                </div> */}
                                                </div>
                                            )}
                                            {/* @ts-ignore */}
                                            {(this.state.activeStep === 2 || this.state.activeStep === 3) && (
                                                <div className="col-lg-8 left-content">
                                                    <h2>All Set!</h2>
                                                    <span>Confirm details and save alert</span>
                                                    <br />
                                                    <br />
                                                    <div className="alert-card">
                                                        <div className="alert-header">
                                                            <img
                                                                src='./assets/img/Warning.png'
                                                                style={{
                                                                    width: 18,
                                                                    marginRight: 8,
                                                                }}
                                                            />
                                                            Alert XYZ
                                                            {this.state.modalopened == 'view' ? (
                                                                <img
                                                                    src='./assets/img/Checks.png'
                                                                    style={{
                                                                        position: 'relative',
                                                                        left: 302,
                                                                        width: 22,
                                                                    }}
                                                                />
                                                            ) : (
                                                                <i
                                                                    className='bx bx-pencil'
                                                                    style={{
                                                                        position: 'relative',
                                                                        left: 302,
                                                                        width: 22,
                                                                        top: 4,
                                                                        fontSize: 18,
                                                                    }}
                                                                ></i>
                                                            )}
                                                        </div>
                                                        <div className="content" style={{ padding: '20px 25px' }}>
                                                            <div className="row px-0" style={{ marginBottom: 20 }}>
                                                                <div className="col-lg-6">
                                                                    <div className="single-fleld">
                                                                        <label htmlFor="">Object of interest</label>
                                                                        <Select

                                                                            style={{
                                                                                width: '100%',
                                                                                height: 45,
                                                                                marginTop: 11,
                                                                                pointerEvents: this.state.modalopened == 'view' ? 'none' : 'auto',
                                                                            }}
                                                                            placeholder="Object of interest"
                                                                            // @ts-ignore
                                                                            value={this.state.selectedObjectofInter}
                                                                            onChange={this.handleChangeObjectofInter}
                                                                            className='form-select'
                                                                            maxTagCount={1}
                                                                        >
                                                                            {/* @ts-ignore */}
                                                                            {this.state.listofobjectlabels && this.state.listofobjectlabels.map((item, index) => {
                                                                                return (
                                                                                    <Option value={item} key={index}>{item}</Option>
                                                                                )
                                                                            })}
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <div className="single-fleld">
                                                                        <label htmlFor="">Frequency</label>
                                                                        <Select
                                                                            style={{
                                                                                width: '100%',
                                                                                height: 45,
                                                                                marginTop: 11,
                                                                                pointerEvents: this.state.modalopened == 'view' ? 'none' : 'auto',
                                                                            }}
                                                                            placeholder="Please Select Frequency"
                                                                            // @ts-ignore
                                                                            value={this.state.selectedfrequency}
                                                                            onChange={this.handleChangeFrequency}
                                                                            className='form-select'
                                                                            maxTagCount={1}
                                                                        >
                                                                            <Option value="Daily">Daily</Option>
                                                                            <Option value="Custom">Custom</Option>
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="form-button-group" style={{ marginBottom: 20 }}>
                                                                <button
                                                                    style={{ marginLeft: 0, pointerEvents: this.state.modalopened == 'view' ? 'none' : 'auto' }}
                                                                    // @ts-ignore
                                                                    className={this.state.working_day == true ? "filled-button" : 'outlined-button'}
                                                                    onClick={() => this.setState({ working_day: this.state.working_day == true ? false : true })}
                                                                >
                                                                    Working Day
                                                                </button>
                                                                <button
                                                                    style={{ marginLeft: 20, pointerEvents: this.state.modalopened == 'view' ? 'none' : 'auto' }}
                                                                    // @ts-ignore
                                                                    className={this.state.holiday == true ?
                                                                        "filled-button" : 'outlined-button'}
                                                                    onClick={() => this.setState({ holiday: this.state.holiday == true ? false : true })}
                                                                >
                                                                    Holiday
                                                                </button>
                                                            </div>
                                                            <div className="selected-days">
                                                                {/* @ts-ignore */}
                                                                {this.state.weeks && this.state.weeks.map((item: any, index) => {
                                                                    return (
                                                                        <div className="day" key={index} style={{ pointerEvents: this.state.modalopened == 'view' ? 'none' : 'auto' }}>
                                                                            <div className="form-check">
                                                                                <input
                                                                                    className="form-check-input"
                                                                                    type="checkbox"
                                                                                    id="flexCheckDefault"
                                                                                    checked={item.selected}
                                                                                    onChange={() => this.handleChangeWeek(item.id)}
                                                                                />
                                                                            </div>
                                                                            <p>{item.name}</p>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                            <div className="row px-0">
                                                                <div className="col-lg-6 mb-3">
                                                                    <div className="single-fleld">
                                                                        <label htmlFor="">From</label>
                                                                        <Select
                                                                            style={{
                                                                                width: '100%',
                                                                                height: 45,
                                                                                marginTop: 11,
                                                                                pointerEvents: this.state.modalopened == 'view' ? 'none' : 'auto',
                                                                            }}
                                                                            placeholder="From Time"
                                                                            className='form-select'
                                                                            defaultValue={this.state.start_time}
                                                                            value={this.state.start_time}
                                                                            onChange={(value) => this.setState({ start_time: value })}
                                                                        >
                                                                            {this.state.timeList && this.state.timeList.map((item: any, index: any) => {
                                                                                return (
                                                                                    <Option value={item.value}>{item.label}</Option>
                                                                                )
                                                                            })}
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 mb-3">
                                                                    <div className="single-fleld">
                                                                        <label htmlFor="">To</label><br />
                                                                        <Select
                                                                            style={{
                                                                                width: '100%',
                                                                                height: 45,
                                                                                marginTop: 11,
                                                                                pointerEvents: this.state.modalopened == 'view' ? 'none' : 'auto',
                                                                            }}
                                                                            placeholder="To Time"
                                                                            className='form-select'
                                                                            value={this.state.end_time}
                                                                            onChange={(value) => this.setState({ end_time: value })}
                                                                        >
                                                                            {this.state.timeList && this.state.timeList.map((item: any, index: any) => {
                                                                                return (
                                                                                    <Option key={index} value={item.value}>{item.label}</Option>
                                                                                )
                                                                            })}
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 mb-3">
                                                                    <div className="single-fleld">
                                                                        <label htmlFor="">Camera</label><br />
                                                                        <Select
                                                                            mode='multiple'
                                                                            style={{
                                                                                width: '100%',
                                                                                height: 45,
                                                                                marginTop: 11,
                                                                                pointerEvents: this.state.modalopened == 'view' ? 'none' : 'auto',
                                                                            }}
                                                                            placeholder="Please select"
                                                                            // ts-ignore
                                                                            value={this.state.selectedCamera}
                                                                            onChange={this.handleChangeCamera}
                                                                            className='form-select'
                                                                            maxTagCount={1}
                                                                        >
                                                                            {/* ts-ignore */}
                                                                            {this.state.cameralist && this.state.cameralist.map((item: any, index: any) => (
                                                                                <Option key={index} value={item.Camera_Name}>{item.Camera_Name}</Option>
                                                                            ))}
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>

                                                </div>
                                            )}
                                            {!this.state.isMobileDevice && <div>
                                                {this.state.activeStep == 0 && (

                                                    <div className="form-button-group"
                                                        style={{ marginTop: 70 }}>
                                                        <button
                                                            className="outlined-button"
                                                            onClick={() => this.handleClose()}
                                                        >
                                                            Cancel
                                                        </button>
                                                        {this.state.modalopened == 'view' ? (
                                                            <button
                                                                onClick={() => this.showstep1()}
                                                                className="filled-button"
                                                            >
                                                                Next
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => this.showstep1()}
                                                                className="filled-button"
                                                            >
                                                                Save & Continue
                                                            </button>
                                                        )}
                                                    </div>)}

                                                {(this.state.activeStep == 1) && (

                                                    <div
                                                        className="form-button-group"
                                                        style={{ marginTop: 70 }}
                                                    >
                                                        <button
                                                            className="outlined-button"
                                                            onClick={() => this.showstep0()}
                                                        >
                                                            Back
                                                        </button>
                                                        {this.state.modalopened == 'view' ? (
                                                            <button
                                                                onClick={() => this.showstep2()}
                                                                className="filled-button"
                                                            >
                                                                Next
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => this.showstep2()}
                                                                className="filled-button"
                                                            >
                                                                Save & Continue
                                                            </button>
                                                        )}
                                                    </div>)}

                                                {(this.state.activeStep === 2 || this.state.activeStep === 3) && this.state.modalopened != 'view' && (
                                                    <div className="form-button-group">
                                                        <button
                                                            className="outlined-button"
                                                            onClick={() => this.showstep1()}
                                                        >
                                                            Back
                                                        </button>
                                                        <button
                                                            onClick={() => this.submit_button()}
                                                            className="filled-button"
                                                            style={{ marginRight: '10%' }}
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                )}
                                            </div>}
                                        </div>
                                    </div>
                                    <div className="col-lg-6">


                                        {(this.state.submittype == 'add' && this.state.add_camera_img.length > 0) && (
                                            <div style={{ marginTop: 130 }}>
                                                {this.state.add_camera_img && this.state.add_camera_img.map((item: any, index: any) => {
                                                    return (
                                                        <div key={index} style={{ marginBottom: 20 }}>
                                                            <p>{item && <b>Camera name:</b>} {item ? item.split('/').splice(-1) : ''} </p>
                                                            {item ? <CanvasDraw2
                                                                imageUrl={item}
                                                                setAIPolygen={this.setAIPolygen}
                                                                styleProperities={{ width: this.state.isMobileDevice ? 300 : 478, height: 342 }}
                                                            /> : <div></div>}
                                                        </div>)
                                                })}
                                            </div>
                                        )}

                                        {((this.state.modalopened == 'view' || this.state.submittype == 'edit') &&
                                            this.state.selectedCamera.length > 0) && (
                                                <div style={{ marginTop: 122 }}>
                                                    {this.state.viewdata.Camera_Name.length > 0 && (
                                                        <div>
                                                            {this.state.listOfCamera && this.state.listOfCamera.map((item: any, index: any) => {
                                                                if (item != "") {
                                                                    return (
                                                                        <div key={index} style={{ marginBottom: 20 }}>
                                                                            <p><b>Camera name:</b> {item.name ? item.name : '---'} </p>
                                                                            <img src={item.image} style={{ maxWidth: this.state.isMobileDevice ? 300 : 473 }} />
                                                                        </div>
                                                                    )
                                                                }
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                        {/* @ts-ignore */}
                                        {((this.state.camera_img != null && this.state.camera_img != '')) && (
                                            <div>
                                                {((this.state.modalopened == 'view' || this.state.submittype == 'edit') &&
                                                    (this.state.selectedCamera.length > 0)) && (
                                                        <div style={{ marginTop: 130 }}>
                                                            <ImageBox data={this.state.viewimagedata} aIPolygen={""} />
                                                        </div>
                                                    )}
                                                {/* {(this.state.submittype=='edit' && this.state.selectedCamera.length==1)&& (
                                                                <div style={{marginTop:this.state.submittype=='add'?130:20}}>
                                                                    <CanvasDraw2
                                                                        imageUrl={this.state.camera_img}
                                                                        setAIPolygen={this.setAIPolygen}
                                                                    />
                                                                </div>
                                                            )} */}
                                            </div>
                                        )}


                                    </div>
                                    {this.state.isMobileDevice && <div>
                                        {this.state.activeStep == 0 && (

                                            <div className="form-button-group"
                                                style={{ marginTop: 70 }}>
                                                <button
                                                    className="outlined-button"
                                                    onClick={() => this.handleClose()}
                                                >
                                                    Cancel
                                                </button>
                                                {this.state.modalopened == 'view' ? (
                                                    <button
                                                        onClick={() => this.showstep1()}
                                                        className="filled-button"
                                                    >
                                                        Next
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => this.showstep1()}
                                                        className="filled-button"
                                                    >
                                                        Save & Continue
                                                    </button>
                                                )}
                                            </div>)}

                                        {(this.state.activeStep == 1) && (

                                            <div
                                                className="form-button-group"
                                                style={{ marginTop: 70 }}
                                            >
                                                <button
                                                    className="outlined-button"
                                                    onClick={() => this.showstep0()}
                                                >
                                                    Back
                                                </button>
                                                {this.state.modalopened == 'view' ? (
                                                    <button
                                                        onClick={() => this.showstep2()}
                                                        className="filled-button"
                                                    >
                                                        Next
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => this.showstep2()}
                                                        className="filled-button"
                                                    >
                                                        Save & Continue
                                                    </button>
                                                )}
                                            </div>)}

                                        {(this.state.activeStep === 2 || this.state.activeStep === 3) && this.state.modalopened != 'view' && (
                                            <div className="form-button-group">
                                                <button
                                                    className="outlined-button"
                                                    onClick={() => this.showstep1()}
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    onClick={() => this.submit_button()}
                                                    className="filled-button"
                                                    style={{ marginRight: '10%' }}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        )}
                                    </div>}
                                </div>
                            </div>
                        </div>

                    </div>

                </Modal>
                {/* End  Add modal */}

            </div>
        )
    }
}

function mapStateToProps(state: any) {
    let { is_mobile } = state.isMobileDevice.is_mobile;
    return { is_mobile };
}
export default connect(mapStateToProps)(Alerts);
