import React, { useState, useEffect } from 'react';
import './list.scss';
import 'antd/dist/antd.css';
import { Select, message, Spin, Modal } from 'antd';
import Alerts from './Alerts';
import axios from 'axios';

const { Option } = Select;
// experience 
// and patience
// if you have both this things you can do anything 

const Add = (props: any) => {

    const [pagetype, setPagetype] = useState('add');
    const [features, setFeatures] = useState([
        {
            id: 1,
            name: 'Live',
            status: true,
        },
        {
            id: 2,
            name: 'Object Detection',
            status: true,
        },
        {
            id: 3,
            name: 'Anomaly Detection',
            status: true,
        },
    ]);

    const [alerts, setAlerts] = useState([]);
    const [camera_name, setCamera_name] = useState('');
    const [camera_link, setCamera_link] = useState('');
    const [priority, setPriority] = useState('');
    const [description, setDescription] = useState('');
    const [formloader, setFormloader] = useState(false);
    const [camera_id, setCamera_id] = useState(0);
    const [cameraList, setCameraList]=useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [singleData, setSingleData] = useState({});

    const onChangeFeature = (id: any) => {
        let arr: any = [];
        features.map((item: any) => {
            if (item.id === id) {
                item.status = !item.status;
            }
            arr.push(item);
        });
        setFeatures(arr);
    }
    // add camera
    const add_camera = () => {

        // check link is matching with camera
        console.log('cameraList',cameraList);
        let status=false;
        let arr:any[]=[];
        if(cameraList.length>0){
            for(let item of cameraList){
                // @ts-ignore
                if(item.Rtsp_Link==camera_link && item.Active==false){
                    status=true;
                    arr=[...arr,item];
                    // @ts-ignore
                } else if(item.Rtsp_Link==camera_link && item.Active==true){
                    message.warning('Duplicate Rtsp link. Please try with different one');return;
                }
            }
        }
        // rtsp://admin:algo1234%23@192.168.2.64:554/Streaming/Channels/705
        console.log('status',status);
        console.log('arr',arr);
        if(status==true){
            setSingleData(arr);
            setIsModalVisible(true);
        }else{
            let featurelist: any = [];
            for (let item of features) {
                if (item.status == true) {
                    featurelist = [...featurelist, item.name];
                }
            }
            if (!camera_name) {
                message.warning('Invalid camera name.');
                return;
            } else if (!camera_link) {
                message.warning('Invalid camera link.');
                return;
            } else if (!description) {
                message.warning('Invalid description.');
                return;
            } else if (!priority) {
                message.warning('Invalid priority.');
                return;
            } else if (featurelist.length == 0) {
                message.warning('Please select at least 1 feature.');
                return;
            }
            let params = {
                Rtsp_Link: camera_link,
                Camera_Name: camera_name,
                Description: description,
                Feature: featurelist,
                Priority: priority,
            }
            // console.log('params',params);
            setFormloader(true);
            const headers = {
                "Content-Type": "application/json; charset=utf-8"
            }
            let url = `${process.env.REACT_APP_BASE_URL}/api/camera/create`;
            axios.post(url, params, {
                headers: headers
            })
            .then((res) => {
                if (res.data.success == true) {
                    message.success(res.data.message);
                    props.showScreen();
                    props.loadlist();
                    getalertlist();
                    let arr:any[]=[];
                    start_servilence(arr);
                } else {
                    message.warning(res.data.message);
                }
                setFormloader(false);
            });
        }        
    }
    
    const start_servilence=(arr: any)=>{
        // let params = {
        //     Camera_List: camera_name,
        //     Video_Path: camera_link,
        //     Alerts:arr,
        // }
        
        let params={
            camera_list:[
                {
                    camera_name: camera_name,
                    rtsp_link: camera_link,
                    alerts:arr
                }
            ]
        }
        console.log('params',params);
        // return;
        const headers = {
            "Content-Type": "application/json",
            "accept":"application/json",
        }
        let url = `${process.env.REACT_APP_START_SURVIELLANCE}`;
        axios.post(url, params, {
            headers: headers
        })
        .then((res) => {
            console.log('servilence res',res);
            // if (res.data.success == true) {} else {}
        });
    }
    // get alert list
    const getalertlist = () => {
        let url=`${process.env.REACT_APP_BASE_URL}/api/alert/`+camera_name;
        axios.get(url)
        .then((response: any)=>{
            console.log('alert response',response);
            if(response.data.success==true){
                let arr: any=[];
                for(let item of response.data.alerts){
                    arr=[...arr,item.Alert_Name];
                }
                console.log('arr',arr);
                return;
            }else{}
        })
        .catch((error: any)=>{})
    }

    useEffect(() => {
        console.log('list',props.list);
        setCameraList(props.list);
        if (props.cameradata.Rtsp_Link) {
            setCamera_link(props.cameradata.Rtsp_Link);
            setCamera_name(props.cameradata.Camera_Name);
            setDescription(props.cameradata.Description);
            setPriority(props.cameradata.Priority);
            setCamera_id(props.cameradata._id);
            setPagetype('edit');
            let featurelist: any = [];
            for(let item of features){
                if (props.cameradata.Feature.includes(item.name)) {
                    item.status = true;
                } else {
                    item.status = false;
                }
                featurelist=[...featurelist, item];
            }
            setFeatures(features);
        } else {
            setCamera_link('');
            setCamera_name('');
            setDescription('');
            setPriority('');
            setCamera_id(0);
            setPagetype('add');
            setFeatures(features);
        }
    },[]);

    const update_camera = () => {
        let featurelist: any = [];
        for (let item of features) {
            if (item.status == true) {
                featurelist = [...featurelist, item.name];
            }
        }
        if (!camera_name) {
            message.warning('Invalid camera name.');
            return;
        } else if (!camera_link) {
            message.warning('Invalid camera link.');
            return;
        } else if (!description) {
            message.warning('Invalid description.');
            return;
        } else if (!priority) {
            message.warning('Invalid priority.');
            return;
        } else if (featurelist.length == 0) {
            message.warning('Please select at least 1 feature.');
            return;
        }
        let params = {
            Rtsp_Link: camera_link,
            Camera_Name: camera_name,
            Description: description,
            Feature: featurelist,
            Priority: priority,
        }
        // console.log('params', params);
        // return;
        setFormloader(true);
        const headers = {
            "Content-Type": "application/json; charset=utf-8"
        }
        let url = `${process.env.REACT_APP_BASE_URL}/api/camera/update/` + camera_id;
        axios.put(url, params, {
            headers: headers
        })
        .then((res) => {
            if (res.data.success == true) {
                // message.success('Camera is updated successfully.');            
                props.showScreen();
                props.loadlist();
                getalertlist();
                start_servilence(props.cameradata.Alert);
            } else {
                message.warning(res.data.message);
            }
            setFormloader(false);
        });
    }
    const activate_camera=()=>{
        setIsModalVisible(false);
        const headers = {
            "Content-Type": "application/json; charset=utf-8"
        }
        // @ts-ignore
        let id=singleData[0]._id;
        // rtsp://admin:algo1234%23@192.168.2.64:554/Streaming/Channels/705
        let url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_ACTIVATE_CAMERA}${id}`;
        axios.get(url, {
            headers: headers
        })
        .then((res) => {
            if (res.data.success == true) {
                message.success('Camera is activated successfully.');
                props.showScreen();
                props.loadlist();
                getalertlist();
            } else {
                message.warning('Please try again!');
            }
            setFormloader(false);
        });
    }
    const handleCancel=()=>{
        setIsModalVisible(false);
    }

    return (
        <div className="add-camera-section">

        <Modal 
            title="Confirm" 
            visible={isModalVisible} 
            onOk={activate_camera} 
            onCancel={handleCancel}
        >
            <p>Do you want to enable camera ?</p>
        </Modal>

            <div className='corner' style={{padding:'35px 80px'}}>
                <Spin spinning={formloader}>
                    <div className='form-basic-details'>
                        <div>
                            <label htmlFor="">Name</label>
                            <input
                                type="text"
                                placeholder='Camera Name'
                                value={camera_name}
                                onChange={(e) => setCamera_name(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="">Link</label>
                            <input
                                type="text"
                                placeholder='Camera link'
                                value={camera_link}
                                onChange={(e) => setCamera_link(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="">Priority</label>
                            <input
                                type="text"
                                placeholder='High'
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <label style={{ marginBottom: 10 }}>Description</label>
                        <textarea
                            rows={4}
                            cols={50}
                            maxLength={200}
                            placeholder="Maximum 200 characters."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{
                                width: '96%',
                                padding: 10,
                                border: '1px solid #9d9d9d',
                                outline: 'none',
                                fontSize: 15,
                            }}
                        ></textarea>
                    </div>

                    <div className="bottom-form-content">
                        <h2>Add Features</h2>
                        <ul>
                            {features && features.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                checked={item.status}
                                                type="checkbox"
                                                id="flexCheckDefault"
                                                onChange={() => onChangeFeature(item.id)}
                                            />
                                            &nbsp;&nbsp;
                                            <label
                                                className="form-check-label"
                                                style={{ fontSize: 18, marginTop: 2 }}
                                            >
                                                {item.name}
                                            </label>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>

                        {props.activescreen != 'view' ? (
                            <div className="form-button-group">
                                <button
                                    className="outlined-button"
                                    style={{ width: 117 }}
                                    onClick={() => props.showScreen()}
                                >
                                    Cancel
                                </button>
                                {pagetype == 'edit' ? (
                                    <button
                                        className="filled-button"
                                        style={{ width: 117 }}
                                        onClick={() => update_camera()}
                                    >
                                        Update
                                    </button>
                                ) : (
                                    <button
                                        className="filled-button"
                                        style={{width:220}}
                                        onClick={() => add_camera()}
                                    >
                                        Save & Start Surveillance
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="form-button-group">
                                <button
                                    className="outlined-button"
                                    style={{ width: 117 }}
                                    onClick={() => props.showScreen()}
                                >
                                    Back
                                </button>
                            </div>
                        )}
                    </div>
                </Spin>
            </div>
            {pagetype == 'edit' && (
                <Alerts
                    camera_name={props ? props.cameradata.Camera_Name : ''}
                />
            )}
        </div>
    );
};

export default Add;




