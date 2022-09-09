import React, { useState, useEffect } from 'react';
import './list.scss';
import Add from './Add';
import { Tooltip, Spin, message, Modal } from 'antd';
import axios from 'axios';

// experience 
// and patience
// if you have both this things you can do anything 


const List = () => {

  const [activescreen, setActivescreen] = useState(0);
  const [allselected, setAllselected] = useState(false);
  const [displayalertstatus, setDisplayalertstatus] = useState(false);
  const [emailalertstatus, setEmailalertstatus] = useState(false);
  const [cameraList, setCameraList] = useState([]);
  const [copyCameraList, setCopyCameraList] = useState([]);
  const [tableloader, setTableloader] = useState(false);
  const [cameradata, setCameradata] = useState({});
  const [cameraId, setCameraId] = useState(0);
  const [deletemodalstatus, setDeletemodalstatus] = useState(false);
  const [viewmodalstatus, setViewModalStatus] = useState(false);
  const [viewdata, setViewdata] = useState({});
  const [activepage, setActivepage] = useState({});

  const [cameraemailalerts, setCameraemailalerts] = useState(false);
  const [cameradisplayalerts, setCameradisplayalerts] = useState(false);
  
  const handleSelectAll = () => {
    setAllselected(!allselected);
    cameraList.map((camera: any, index) => {
      camera.rowselected = !allselected;
    });
  }

  const handledisplayalerts = () => {
    setDisplayalertstatus(!displayalertstatus);
    cameraList.map((camera: any, index) => {
      camera.Display_Auto_Alert = !displayalertstatus;
      // let fire api
      let status = !displayalertstatus;
      let showmessage = 0;
      if (cameraList.length == (index + 1)) {
        showmessage = 1;
      }
      update_camera_status(status, camera, 'display', showmessage);
    });
  }
  const handleemailalerts = () => {
    setEmailalertstatus(!emailalertstatus);
    cameraList.map((camera: any, index) => {
      camera.Email_Auto_Alert = !emailalertstatus;
      // let fire api
      let status = !emailalertstatus;
      let showmessage = 0;
      if (cameraList.length == (index + 1)) {
        showmessage = 1;
      }
      update_camera_status(status, camera, 'email', showmessage);
    });
  }
  // @ts-ignore
  const update_camera_status = (status, item, type, showmessage) => {
    let params = {};
    if (type == 'email') {
      params = {
        Rtsp_Link: item.Rtsp_Link,
        Camera_Name: item.Camera_Name,
        Description: item.Description,
        Feature: item.Feature,
        Priority: item.Priority,
        Email_Auto_Alert: status,
        Display_Auto_Alert: item.Display_Auto_Alert,
      }
    } else {
      params = {
        Rtsp_Link: item.Rtsp_Link,
        Camera_Name: item.Camera_Name,
        Description: item.Description,
        Feature: item.Feature,
        Priority: item.Priority,
        Email_Auto_Alert: item.Email_Auto_Alert,
        Display_Auto_Alert: status,
      }
    }

    setTableloader(true);
    setTimeout(() => {
      const headers = {
        "Content-Type": "application/json; charset=utf-8"
      }
      let url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_CAMERA_UPDATE}` + item._id;
      axios.put(url, params, {
        headers: headers
      })
        .then((res) => {
          if (res.data.success == true) {
            if (showmessage == 1) {
              message.success('Camera alert status is updated successfully.');
              getcameralist();
            }
          } else {
            message.warning(res.data.message);
          }
          setTableloader(false);
        });
    }, 1000);
  }

  const onChangeSingleEmailAlerts = (item: any) => {
    let arr: any = [];
    cameraList.map((camera: any, index) => {
      if (camera._id === item._id) {
        camera.Email_Auto_Alert = !camera.Email_Auto_Alert;
      }
      arr = [...arr, camera];
    });
    let status = item.Email_Auto_Alert;
    update_camera(status, item, 'email');
    setCameraList(arr);
  }

  const onChangeSingleDisplayAlerts = (item: any) => {
    let arr: any = [];
    cameraList.map((camera: any, index) => {
      if (camera._id === item._id) {
        camera.Display_Auto_Alert = !camera.Display_Auto_Alert;
      }
      arr = [...arr, camera];
    });
    let status = item.Display_Auto_Alert;
    update_camera(status, item, 'display');
    setCameraList(arr);
  }

  const onChangeSingleRowSelected = (id: any) => {
    let arr: any = [];
    cameraList.map((camera: any, index) => {
      if (camera._id === id) {
        camera.rowselected = !camera.rowselected;
      }
      arr = [...arr, camera];
    });
    setCameraList(arr);
  }
  

  // get camera list
  const getcameralist = () => {
    let url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_CAMERA}`;
    setTableloader(true);
    axios.get(url)
      .then(function (response) {
        let arr: any = [];
        for (let item of response.data.cameras) {
          if(item.Active===true){
            if (allselected == true) {
              item.rowselected = true;
            } else {
              item.rowselected = false;
            }
            arr = [...arr, item];
          }
        }
        console.log('arr',arr);
        setCameraList(arr.reverse());
        setCopyCameraList(response.data.cameras);
        setTableloader(false);
      })
      .catch(function (error) {
        setTableloader(false);
      })
  }

  useEffect(() => {
    getcameralist();
  }, []);

  const show_camera_tab = () => {
    setActivescreen(0);
    setActivepage('');
  }
  // @ts-ignore
  const update_camera = (status, item, type) => {
    let params = {};
    if (type == 'email') {
      params = {
        Rtsp_Link: item.Rtsp_Link,
        Camera_Name: item.Camera_Name,
        Description: item.Description,
        Feature: item.Feature,
        Priority: item.Priority,
        Email_Auto_Alert: status,
        Display_Auto_Alert: item.Display_Auto_Alert,
      }
    } else {
      params = {
        Rtsp_Link: item.Rtsp_Link,
        Camera_Name: item.Camera_Name,
        Description: item.Description,
        Feature: item.Feature,
        Priority: item.Priority,
        Email_Auto_Alert: item.Email_Auto_Alert,
        Display_Auto_Alert: status,
      }
    }
    setTableloader(true);
    setTimeout(() => {
      const headers = {
        "Content-Type": "application/json; charset=utf-8"
      }
      let url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_CAMERA_UPDATE}` + item._id;
      axios.put(url, params, {
        headers: headers
      })
        .then((res) => {
          if (res.data.success == true) {
            message.success('Camera alert status is updated successfully.');
            getcameralist();
          } else {
            message.warning(res.data.message);
          }
          setTableloader(false);
        });
    }, 1000);
  }

  const showeditpage = (item: any) => {
    setCameradata(item);
    setActivescreen(1);
  }

  const showviewpage = (item: any) => {
    setCameradata(item);
    setActivescreen(1);
    setActivepage('view');
  }

  const showaddpage = (num: any) => {
    setCameradata({});
    setActivescreen(1);
  }

  const showdeletemodal = (item: any) => {
    setDeletemodalstatus(true);
    setCameraId(item._id);
  }

  const showviewmodal = (item: any) => {
    setViewModalStatus(true);
    setViewdata(item);
  }

  // delete camera
  const delete_camera = () => {
    setTableloader(true);
    const headers = {
      "Content-Type": "application/json; charset=utf-8"
    }
    let url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_CAMERA_DELETE}` + cameraId;
    axios.delete(url, {
      headers: headers
    })
      .then((res) => {
        if (res.data.success == true) {
          message.success('Camera is deleted successfully.');
          setTableloader(false);
          setDeletemodalstatus(false);
          getcameralist();
        } else {
          message.warning('Something went wrong.Please try again!');
          setTableloader(false);
        }
      });
  }

  const hide_delete_modal = () => {
    setDeletemodalstatus(false);
    setCameraId(cameraId);
  }
  const update_email_alert=(e: any)=>{
    setCameraemailalerts(e.target.checked);
    const headers = {
      "Content-Type": "application/json; charset=utf-8"
    }
    let url=`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_CAMERA_ALL_EMAIL_ALERTS}alert=`+e.target.checked;
    axios.get(url, {
      headers: headers
    })
    .then((res)=> {
      if(res.data.success==true){
        message.success('Email alert status is updated successfully..');
        setTableloader(false);
      }else{
        message.warning('Something went wrong.Please try again!');
      }
    });
  }
  const update_diplay_alert=(e: any)=>{
    setCameradisplayalerts(e.target.checked);
    const headers = {
      "Content-Type": "application/json; charset=utf-8"
    }
    let url=`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_CAMERA_ALL_DISPLAY_ALERTS}alert=`+e.target.checked;
    axios.get(url, {
      headers: headers
    })
    .then((res)=> {
      if(res.data.success==true){
        message.success('Display alert status is updated successfully..');
        setTableloader(false);
      }else{
        message.warning('Something went wrong.Please try again!');
      }
    });
  }

  return (
    <section className='camera-directory-list-section' style={{ marginTop: -15 }}>
      {activescreen === 1 ? (
        <>
        <Add
          showScreen={show_camera_tab}
          loadlist={()=>getcameralist()}
          cameradata={cameradata}
          list={copyCameraList}
          activescreen={activepage}
        />
        </>
      ) : (
        <div className="container">
          <div className="row top-filter-section">
            <Spin spinning={tableloader}>
              <div className="col-md-12">
                <div className="row" style={{ paddingTop: 30 }}>
                  <div className="col-lg-9 grid-view">
                    <div style={{ marginRight: 6 }}>
                      <div
                        className="form-check d-flex"
                      >
                        <input
                          className="form-check-input"
                          checked={allselected}
                          type="checkbox"
                          id="flexCheckDefault"
                          onChange={handleSelectAll}
                        />
                        &nbsp;&nbsp;
                        <label className="form-check-label"
                          style={{ fontSize: 18, marginTop: 2 }}>
                          All
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-12 d-flex hide-for-mobile">
                      <div style={{ marginRight:6 }}>
                        <div
                        className="form-check" 
                        >
                          <input 
                            className="form-check-input" 
                            checked={emailalertstatus} 
                            type="checkbox" 
                            id="flexCheckDefault"
                            onChange={handleemailalerts}
                            disabled={allselected==true?false:true}
                          /> 
                          &nbsp;&nbsp;
                          <label className="form-check-label" 
                          style={{ fontSize:18,marginTop:2 }}>
                            Email auto alerts
                          </label>
                        </div>
                      </div>
                      <div>
                        <div className="form-check" style={{ marginRight:6 }}>
                          <input 
                            className="form-check-input" 
                            checked={displayalertstatus} 
                            type="checkbox" 
                            id="flexCheckDefault"
                            onChange={handledisplayalerts}
                            disabled={allselected==true?false:true}
                          />
                          &nbsp;&nbsp;
                          <label 
                            className="form-check-label" 
                            style={{ fontSize:18,marginTop:2 }}
                          >
                            Display auto alerts
                          </label>
                        </div>
                      </div>
                      <div>
                        <div className="form-check" style={{ marginRight:6 }}>
                            <input 
                              className="form-check-input" 
                              // checked={cameraemailalerts} 
                              type="checkbox" 
                              id="flexCheckDefault"
                              // onChange={update_email_alert}
                            /> 
                            &nbsp;&nbsp;
                            <label 
                              className="form-check-label" 
                              style={{ fontSize:18,marginTop:2 }}
                            >
                            Email alerts
                            </label>
                        </div>
                      </div>
                      <div>
                        <div className="form-check" style={{ marginRight:6 }}>
                            <input 
                              className="form-check-input" 
                              // checked={cameradisplayalerts} 
                              type="checkbox" 
                              id="flexCheckDefault"
                              // onChange={update_diplay_alert}
                            /> 
                            &nbsp;&nbsp;
                            <label 
                              className="form-check-label" 
                              style={{ fontSize:18,marginTop:2 }}
                            >
                            Display alerts
                            </label>
                        </div>
                      </div>
                    </div>
                    <div className="hide-to-desktop">
                      <div style={{ marginRight:6 }}>
                        <div
                        className="form-check" 
                        >
                          <input 
                            className="form-check-input" 
                            checked={emailalertstatus} 
                            type="checkbox" 
                            id="flexCheckDefault"
                            onChange={handleemailalerts}
                            disabled={allselected==true?false:true}
                          /> 
                          &nbsp;&nbsp;
                          <label className="form-check-label" 
                          style={{ fontSize:18,marginTop:2 }}>
                            Email auto alerts
                          </label>
                        </div>
                      </div>
                      <div className="form-check" style={{ marginRight: 6 }}>
                        <input
                          className="form-check-input"
                          checked={displayalertstatus}
                          type="checkbox"
                          id="flexCheckDefault"
                          onChange={handledisplayalerts}
                          disabled={allselected == true ? false : true}
                        />
                        &nbsp;&nbsp;
                        <label
                          className="form-check-label"
                          style={{ fontSize: 18, marginTop: 2 }}
                        >
                          Display auto alerts
                        </label>
                      </div>

                      <div className="form-check" style={{ marginRight: 6 }}>
                        <input
                          className="form-check-input"
                          // checked={emailalertstatus} 
                          type="checkbox"
                          id="flexCheckDefault"
                        // onChange={handleemailalerts}
                        />
                        &nbsp;&nbsp;
                        <label
                          className="form-check-label"
                          style={{ fontSize: 18, marginTop: 2 }}
                        >
                          Email alerts
                        </label>
                      </div>
                      <div className="form-check" style={{ marginRight: 6 }}>
                        <input
                          className="form-check-input"
                          // checked={displayalertstatus} 
                          type="checkbox"
                          id="flexCheckDefault"
                        // onChange={handledisplayalerts}
                        />
                        &nbsp;&nbsp;
                        <label
                          className="form-check-label"
                          style={{ fontSize: 18, marginTop: 2 }}
                        >
                          Display alerts
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <button
                      className='addButton'
                      onClick={() => showaddpage(1)}
                      style={{
                        float: 'right'
                      }}
                    >Add New Camera</button>
                  </div>
                </div>
                <div className='table-width'>
                  <table className='w-100'>
                    <tr>
                      <th className='left-radius'></th>
                      <th>Camera</th>
                      <th>Link</th>
                      <th>Priority</th>
                      <th>Email Auto Alerts</th>
                      <th>Display Auto Alerts</th>
                      <th className='right-radius'></th>
                    </tr>
                    {cameraList && cameraList.map((item: any, index) => (
                      <tr className={'border-radius'} key={index}>
                        <td className='left-radius'>
                          <div
                            className="form-check"
                            style={{ marginLeft: '28%' }}
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="flexCheckDefault"
                              checked={item.rowselected}
                              onChange={() => onChangeSingleRowSelected(item._id)}
                            />
                          </div>
                        </td>
                        <td>{item.Camera_Name}</td>
                        <td  className="td-link-cls">{item.Rtsp_Link}</td>
                        <td style={{ textTransform: 'capitalize' }}>{item.Priority}</td>
                        <td>
                          <div className="form-check"
                            style={{ marginLeft: '28%' }}
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="flexCheckDefault"
                              checked={item.Email_Auto_Alert}
                              onChange={() => onChangeSingleEmailAlerts(item)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="form-check" style={{ marginLeft: '28%' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="flexCheckDefault"
                              checked={item.Display_Auto_Alert}
                              onChange={() => onChangeSingleDisplayAlerts(item)}
                            />
                          </div>
                        </td>
                        <td className='right-radius'>
                          <div className='d-flex'>
                            <a href="#" onClick={() => showeditpage(item)}>
                              <Tooltip title='Edit Camera'>
                                <i
                                  style={{
                                    fontSize: 24,
                                    color: '#ff00f7'
                                  }}
                                  className='bx bx-edit-alt'></i>
                              </Tooltip>
                            </a>
                            <a href="# " onClick={() => showviewpage(item)}>
                              <Tooltip title='View Camera'>
                                <i
                                  style={{
                                    fontSize: 24,
                                    color: '#0a57eb',
                                    marginLeft: 10
                                  }}
                                  className='bx bx-show'></i>
                              </Tooltip>
                            </a>
                            <a href="#" onClick={() => showdeletemodal(item)}>
                              <Tooltip title='Delete Camera'>
                                <i style={{
                                  fontSize: 24,
                                  color: '#eb0a0a',
                                  marginLeft: 10
                                }} className='bx bx-trash'></i>
                              </Tooltip>
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>
            </Spin>

            {/* Start delete modal  */}
            <Modal
              title="Delete Confirmation"
              visible={deletemodalstatus}
              onOk={() => delete_camera()}
              onCancel={() => hide_delete_modal()}
              width={500}
              okText='Delete'
            >
              <p style={{ padding: '0px 16px', fontSize: 16 }}>
                Are you sure you want to delete the selected camera?
              </p>
            </Modal>
            {/* End delete modal  */}

            {/* Start view  modal  */}
            {/* @ts-ignore  */}
            <Modal
              title="Camera Details"
              visible={viewmodalstatus}
              onOk={() => setViewModalStatus(false)}
              onCancel={() => setViewModalStatus(false)}
              width={500}
              okText='ok'
            >
              <p style={{ padding: '0 0', fontSize: 15 }}>
                {/* @ts-ignore  */}
                <b>Camera name:</b> {(viewdata && viewdata.Camera_Name) ? viewdata.Camera_Name : '---'}<br />
                {/* @ts-ignore  */}
                <b>Description:</b> {(viewdata && viewdata.Description) ? viewdata.Description : '---'}<br />
                {/* @ts-ignore  */}
                <b>Display auto alert:</b> {(viewdata && viewdata.Display_Auto_Alert) ? (viewdata.Display_Auto_Alert == true ? 'Yes' : 'No') : '---'}<br />
                {/* @ts-ignore  */}
                <b>Email auto alert:</b> {(viewdata && viewdata.Email_Auto_Alert) ? (viewdata.Email_Auto_Alert == true ? 'Yes' : 'No') : '---'}<br />
                {/* @ts-ignore  */}
                <b>Priority:</b> {(viewdata && viewdata.Priority) ? (viewdata.Priority) : '---'}<br />
                {/* @ts-ignore  */}
                <b>Link:</b> {(viewdata && viewdata.Rtsp_Link) ? (viewdata.Rtsp_Link) : '---'}<br />
                {/* @ts-ignore  */}
                <b>Status:</b> {(viewdata && viewdata.Status) ? (viewdata.Status) : '---'}<br />
              </p>
            </Modal>
            {/* End view modal  */}

          </div>
        </div>
      )
      }
    </section>
  );
};

export default List;
