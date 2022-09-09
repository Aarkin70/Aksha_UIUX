import React, { Component } from 'react';
import { Modal, Tooltip, Checkbox, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

class DeleteAlertModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible:false,
            cameralist:[],
            selectallcameras:false,
            cameras:[],
            selectedCameras:[],
            delete_camera_list:[],
            alert_id:0,
            alertlist:[],
            CAMERA_LIST:[],
        }
    }
    showModal=()=>{
        this.setState({isModalVisible:true,selectallcameras:false,cameras:[this.props.camera]});
    }
    handleOk=()=>{
        this.setState({ isModalVisible:false });
        let status=this.state.selectedCameras.length>1?true:false;
        this.props.delete(this.props.data._id,status,this.state.selectedCameras);
    }
    handleCancel=()=>{
        this.setState({isModalVisible:false});
    }
    onChange=(e)=>{
        this.setState({selectallcameras:e.target.checked});
        if(e.target.checked==true) {
            this.get_camera_by_id();
            setTimeout(()=>{
                this.setState({cameras:this.state.delete_camera_list});
            },600);
        } else {
            this.setState({cameras:[this.props.camera]});
        }
    }
    handleChange=(value)=>{
        this.setState({cameras:value});
    }
    componentDidMount(){
        this.setState({
            selectedCameras:this.props.data.Camera_Name,
            cameras:[this.props.camera],
            selectallcameras:false,
            alert_id:this.props.data._id,
        });
        this.get_camera_by_id();
        this.getcameralist();
    }
     // get camera list
    getcameralist = () => {
        let url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_CAMERA}`;
        axios.get(url)
        .then((response)=>{
            let arr=[];
            for(let item of response.data.cameras){
                if(item.Active==true){
                    arr=[...arr,item];
                }
            }
            this.setState({CAMERA_LIST:arr.data.cameras});
        })
        .catch( (error)=>{
        })
    }
    // get camera by id
    get_camera_by_id=()=>{
        let _id=this.props.data._id;
        let url=`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_ALERT_FIND_CAMERAS_BY_ALERTS_ID}`+_id;
        axios.get(url)
        .then((res)=> {
          if(res.data.success==true){
            this.setState({cameralist:res.data.CameraNames,delete_camera_list:res.data.CameraNames});
          }
        });
    }
    // delete alert
    delete_alert = ()=>{
        let id=this.props.data._id;
        let url=`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_ALERT_DELETE}${id}`;
        const headers = {
            "Content-Type": "application/json; charset=utf-8"
        }
        let params={
            Camera_Name:this.state.cameras,
        };
        // @ts-ignore
        axios.put(url, params, { headers: headers })
        .then((res)=> {
          if(res.data.success==true){
            message.success('Alert is deleted successfully.');  
            this.setState({
                isModalVisible:false,
            },()=>this.props.refresh());
            this.get_camera_by_id();
            this.getalertlist();
            setTimeout(()=>{
                this.start_servilence();
            },2000);
          }else{
            message.warning('Please try again!');
          }
        });
    }
    // start survilence
    start_servilence=()=>{
        let arr=[];
        let camera_names=[];
        if(this.state.alertlist.length>0){
            camera_names=this.state.alertlist[0].Camera_Name;
        }
        if(camera_names.length>0){
            for(let item of this.state.CAMERA_LIST){
                if(camera_names.includes(item.Camera_Name)){
                    let obj={
                        Camera_name:item.Camera_Name,
                        Rtsp_Link:item.Rtsp_Link,
                        Alert:item.Alert,
                    }
                    arr=[...arr,obj];
                }
            }
        }
        setTimeout(()=>{
            let params = {
                Camera_List:arr,
            }
            return;
            const headers = {
                "Content-Type": "application/json; charset=utf-8"
            }
            let url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_START_SURVIELLANCE}`;
            axios.post(url, params, {
                headers: headers
            })
            .then((res) => {
                console.log('servilence res',res);
                if (res.data.success == true) {} else {}
            });
            
        },500);
        
    }
    // get alert list
    getalertlist = () => {
        let url = `${process.env.REACT_APP_BASE_URL}/api/alert/`+this.props.camera;
        this.setState({tableloader:false});
        axios.get(url)
        .then((response)=>{
            if(response.data.success==true){
                
                let arr=[];
                for(let item of response.data.alerts){
                    if(item._id==this.state.alert_id){
                        arr=[...arr,item];
                    }
                }
                this.setState({alertlist:arr});
            }else{}
        })
        .catch((error)=>{
            this.setState({tableloader:false});
        })
    }

      
    render() {
    return (
      <div>
        <a href="#">
            <Tooltip title="Delete Alert">
                <i 
                style={{
                    fontSize: 24,
                    marginLeft: 10,
                    color:'#eb0a0a'
                }}
                onClick={this.showModal}
                className='bx bx-trash'></i>
            </Tooltip>
        </a>
        <Modal 
            title={`Are you sure you want to delete alert ${this.props.data.Alert_Name}?`}
            visible={this.state.isModalVisible} 
            onOk={this.delete_alert} 
            onCancel={this.handleCancel}
            okText={'Delete'}
        >
            <Select
                mode="multiple"
                allowClear
                value={this.state.cameras}
                style={{width:'100%'}}
                maxTagCount={3}
                onChange={this.handleChange}
            >
                {this.state.cameralist && this.state.cameralist.map((item,index) => {
                    return (
                        <Option value={item} key={index}>
                            {item}
                        </Option>
                    )
                })}
            </Select>
            <Checkbox 
                onChange={this.onChange}
                checked={this.state.selectallcameras}
                style={{marginTop:20}}
            >
                Select All Cameras
            </Checkbox>
        </Modal>
      </div>
    )
  }
}

export default DeleteAlertModal;
