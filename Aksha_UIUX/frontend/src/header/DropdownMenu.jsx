import React, { Component } from 'react';
import { Dropdown,Menu, Space } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import {
  IconButton,Avatar,
} from "@mui/material";
import Profile from "../component/profile";

class DropdownMenu extends Component {
  // logout
  logout=()=>{
    window.localStorage.removeItem('isLoggedIn');
    window.localStorage.removeItem('userInfo');
    window.location.assign('/Login');
  }
  render() {
    const menu = (
      <Menu
        style={{width:160,marginTop:15}}
        items={[
          {
            key: '1',
            label: (
              <Profile>
                <a href="#" style={{color:'#000'}}>User Details</a>
              </Profile>
            ),
            icon: <UserOutlined style={{fontSize:15}}/>,
          },
          {
            key: '2',
            label: (
              <a href="#" onClick={this.logout} style={{color:'#000'}}>Logout</a>
            ),
            icon: <LogoutOutlined style={{fontSize:15}}/>,
          },
        ]}
      />
    )
    console.log('isLoggedIn',localStorage.getItem('isLoggedIn'));
    return (
      <div>
        {localStorage.getItem('isLoggedIn')=='true' ? (
          <Dropdown overlay={menu}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <div
                  style={{
                    backgroundColor: "#F6F6F6",
                    padding: "6px 4px",
                    borderRadius: "12px",
                  }}
                >
                  <IconButton sx={{ p: 0 }}>
                    &nbsp;
                    <img
                      alt="Remy Sharp"
                      src={require("../assets/images/header/user.png")}
                    />
                    &nbsp;
                    <Avatar
                      alt="Remy Sharp"
                      src={require("../assets/images/header/avatar.png")}
                    />
                  </IconButton>
                </div>
              </Space>
            </a>
          </Dropdown>
        ):(
          <div
            style={{
              backgroundColor: "#F6F6F6",
              padding: "6px 4px",
              borderRadius: "12px",
              cursor:'context-menu'
            }}
          >
            <IconButton sx={{ p: 0 }}>
              &nbsp;
              <img
                alt="Remy Sharp"
                src={require("../assets/images/header/user.png")}
              />
              &nbsp;
              <Avatar
                alt="Remy Sharp"
                src={require("../assets/images/header/avatar.png")}
              />
            </IconButton>
          </div>
        )}
      </div>
    )
  }
}

export default DropdownMenu;
