import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { connectToDatabase } from "../util/mongodb";
import { DataGrid } from "@material-ui/data-grid";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import ListSubheader from "@material-ui/core/ListSubheader";

import AddIcon from '@mui/icons-material/Add';

import Modal from "@material-ui/core/Modal";
import { Box } from "@material-ui/core";

export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  const admins = await db
    .collection("admin")
    .find()
    .sort({})
    .limit(20)
    .toArray();

  const customers = await db.collection("customer").find().sort({}).toArray();
  const passwords = await db.collection("password").find().sort({}).toArray();

  return {
    props: {
      admin: JSON.parse(JSON.stringify(admins)),
      customer: JSON.parse(JSON.stringify(customers)),
      password: JSON.parse(JSON.stringify(passwords)),
    },
  };
}

const useStyles2 = makeStyles({
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 100,
  },
  selectEmpty: {
    // marginTop: theme.spacing(2),
  },
  root: {
    "& .super-app-theme--header": {
      backgroundColor: "rgba(255, 7, 0, 0.55)",
    },
  },
});

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: 500,
    overflow: "auto",
  },
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  button_text_rows: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  TextField: {
    marginLeft: theme.spacing(1),
    width: 240,
  },
  TextField1: {
    width: 150,
  },
  formControl: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 150,
  },
  div: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    maxHeight: 200,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  List: {
    width: "100%",
    maxWidth: 360,
    maxHeight: 500,
    backgroundColor: theme.palette.background.paper,
  },
  toRight: {
    float: "right",
    marginRight: 10,
    height: 50
  },
  toRight2: {
    float: "right",
    height: 50
  }
}));

const boxStyle = {
  padding: 30,
  margin: "50px",
};

function groupByKey(array, key) {
  return array.reduce((hash, obj) => {
    if (obj[key] === undefined) return hash;
    return Object.assign(hash, {
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    });
  }, {});
}

function AdminMgt({ admin: admins, customer: customers, password: passwords }) {
  const classes = useStyles();

  const [status, setStatus] = useState();

  const [company, setCompany] = useState("");
  const [companyError, setCompanyError] = useState(false);

  const [row, setRow] = useState([]);

  // modal
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [del, setDel] = useState(false);

  // form inside modal
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  // list inside modal edit
  const [admin, setAdmin] = useState("");
  const [username_edit, setUsername_edit] = useState("");
  const [userId_edit, setUserId_edit] = useState("");
  const [status_edit, setStatus_edit] = useState();
  const [checked, setChecked] = React.useState([]);

  const [loading, setLoading] = useState(false)
  const [deleteComplete, setDeleteComplate] = useState(false)
  const [submitComplete, setSubmitComplete] = useState(false)

  useEffect(() => {
    const newChecked = [];

    if (admin !== "") {
      const groupid_list = customers.filter((customer) =>
        admin.groupId.includes(customer.company)
      );

      groupid_list.map((groupid) => {
        newChecked.push(groupid);
      });

      setChecked(newChecked);
      // console.log(newChecked)
    }
  }, [userId_edit]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const group = groupByKey(customers, "groupID");

  const router = useRouter();

  const handleChangeText = (e) => {
    if (e.target.name === "name") {
      setUsername(e.target.value);
    } else if (e.target.name === "USER_ID") {
      setUserId(e.target.value);
    }
  };

  const handleEdit = (e) => {
    if (e.target.name === "name") {
      setUsername_edit(e.target.value);
    } else if (e.target.name === "USER_ID") {
      setUserId_edit(e.target.value);
    }
  };

  const handleOpen = (name) => {
    if (name == "add" || name == "password") {
      setOpen(name);
    } else {
      setAdmin(name.row);
      setUsername_edit(name.row.username);
      setUserId_edit(name.row.userId);
      setStatus_edit(name.row.status);
      setOpen(name.row.userId);
      setDel(true);
    }
  };

  const handleOpen_delete = (name) => {
    setAdmin(name.row);

    setDel(name.row.userId);
  };

  const handleClose = () => {
    setOpen(false);
    setDel(false);
  };

  useEffect(() => {
    let array = [];
    admins.map((admin, index) => {
      array.push({
        id: index,
        username: admin.username,
        status: admin.status,
        userId: admin.userId,
        groupId: admin.groupId.map((groupid) =>
          Object.keys(group).includes(groupid)
            ? group[groupid.toString()][0].company
            : null
        ),
      });
    });
    setRow(array);
  }, []);

  const handleChangeCompany = (event) => {
    setCompany(event.target.value);
  };

  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
  };

  const handleChangeStatus_edit = (event) => {
    setStatus_edit(event.target.value);
  };

  const classes2 = useStyles2();

  const submit = async (value) => {
    setLoading(true)

    let username_submit = username
    let userId_submit = userId
    let status_submit = status
    let groupId_submit = [company.groupID]

    if(value !== "add"){
      username_submit = username_edit
      userId_submit = userId_edit
      status_submit = status_edit

      let newArray = []
      checked.map(obj => {
        newArray.push(obj.groupID)
      })
      groupId_submit = newArray
    }
    
    await fetch("/api/admin", {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({
        username: username_submit,
        userId: userId_submit,
        status: status_submit,
        groupId: groupId_submit,
      }), // body data type must match "Content-Type" header
    }).then(function(response){
      setSubmitComplete(true)
      router.reload()

      
    })

  };

  const handleDelete = async () => {
    setLoading(true)

    await fetch("/api/admin", {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({
        userId: admin.userId,
      }), // body data type must match "Content-Type" header
    }).then(function(response){
      console.log("response: ", response)
      setDeleteComplate(true)

      router.reload()
    }) 
      
  };

  const columns = [
    {
      field: "username",
      headerClassName: "super-app-theme--header",
      headerName: "ชื่อผู้ใช้",
      width: 150,
    },
    {
      field: "status",
      headerName: "สถานะ",
      headerClassName: "super-app-theme--header",
      width: 200,
    },
    {
      field: "userId",
      headerName: "ไอดีผู้ใช้",
      headerClassName: "super-app-theme--header",
      width: 180,
      editable: true,
    },
    {
      field: "groupId",
      headerName: "ลูกค้าที่ดูแล",
      headerClassName: "super-app-theme--header",
      width: 220,
      disableClickEventBubbling: true,
    },
    {
      field: "edit",
      headerName: "แก้ไข",
      headerClassName: "super-app-theme--header",
      // sortable: false,
      width: 150,
      // hide: true,
      disableClickEventBubbling: true,
      renderCell: function edit(params) {
        // console.log(params.row)
        return (
          <div>
            <Button
              onClick={() => handleOpen(params)}
              color="primary"
              variant="contained"
            >
              แก้ไข
            </Button>
            <Modal
              open={open === params.row.userId ? true : false}
              onClose={handleClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <div style={modalStyle} className={classes.paper}>
                {submitComplete ? <h2 style={{alignContent: "center"}}>แก้ไขสำเร็จ</h2> :
                  loading ? <h2 style={{alignContent: "center"}}>Loading</h2> :
                  <div>
                    <h2 id="simple-modal-title">แก้ไขข้อมูล</h2>
                    <p id="simple-modal-description">กรอกข้อมูลด้านล่าง</p>

                    <TextField
                      className={classes.TextField1}
                      required
                      name="name"
                      label="ชื่อผู้ใช้"
                      value={username_edit}
                      onChange={(e) => handleEdit(e)}
                    />
                    <TextField
                      className={classes.TextField}
                      disable
                      required
                      name="USER_ID"
                      label="USER ID"
                      value={userId_edit}
                      onChange={(e) => handleEdit(e)}
                    />

                    <div>
                      <List
                        subheader={<ListSubheader>รายชื่อลูกค้า</ListSubheader>}
                        className={classes.List}
                      >
                        {customers.map((customer) => {
                          const labelId = `checkbox-list-label-${customer.company}`;

                          return (
                            <ListItem
                              key={customer.company}
                              role={undefined}
                              dense
                              button
                              onClick={handleToggle(customer)}
                            >
                              <ListItemIcon>
                                <Checkbox
                                  edge="start"
                                  checked={checked.indexOf(customer) !== -1}
                                  tabIndex={-1}
                                  disableRipple
                                  inputProps={{ "aria-labelledby": labelId }}
                                />
                              </ListItemIcon>
                              <ListItemText
                                id={labelId}
                                primary={customer.company}
                              />
                            </ListItem>
                          );
                        })}
                      </List>

                      <FormControl
                        className={classes.formControl}
                        error={companyError}
                      >
                        <InputLabel id="demo-simple-select-outlined-label1">
                          Status
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label1"
                          id="demo-simple-select-outlined"
                          value={status_edit ? status_edit : ""}
                          onChange={handleChangeStatus_edit}
                          label="Status"
                        >
                          <MenuItem key="แคชเชียร์" value="แคชเชียร์">
                            แคชเชียร์
                          </MenuItem>
                          <MenuItem
                            key="เจ้าของ หรือ ผู้ช่วย"
                            value="เจ้าของ หรือ ผู้ช่วย"
                          >
                            เจ้าของ หรือ ผู้ช่วย
                          </MenuItem>
                          <MenuItem key="ลูกค้า" value="ลูกค้า">
                            ลูกค้า
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    <Button
                      className={classes.button}
                      onClick={() => submit(params)}
                      variant="contained"
                      color="primary"
                    >
                      ยืนยัน
                    </Button>
                    <Button
                      className={classes.button}
                      onClick={handleClose}
                      variant="contained"
                      color="secondary"
                    >
                      ยกเลิก
                    </Button>

                  </div>
                }

              </div>
            </Modal>
            <Button
              onClick={() => handleOpen_delete(params)}
              variant="contained"
              color="secondary"
            >
              ลบ
            </Button>
            <Modal
              open={del === params.row.userId ? true : false}
              onClose={handleClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >


                <div style={modalStyle} className={classes.paper}>

              {deleteComplete ? 
                <h2 style={{alignContent: "center"}}>ลบสำเร็จ</h2> :
                
                loading ? <h2 style={{alignContent: "center"}}>Loading</h2> :

                <div>
                  <h2 id="simple-modal-title">ยืนยันการลบ</h2>
                  <p id="simple-modal-description">
                    ท่านต้องการลบ {admin.username} ใช่ไหม
                  </p>

                  <Button
                    onClick={() => handleDelete()}
                    variant="contained"
                    color="primary"
                  >
                    ยืนยัน
                  </Button>
                  <Button
                    onClick={handleClose}
                    variant="contained"
                    color="secondary"
                  >
                    ยกเลิก
                  </Button>
                </div>

                }

                </div> 
              
            </Modal>
          </div>
        );
      },
    },
  ];

  return (
    <div>
        <Box style={boxStyle}>
        

        <div style={{ width: "83%" }}>
          <h3>รายชื่อแอดมิน 
          
          <Button
          onClick={() => handleOpen("add")}
          color="primary"
          variant="contained"
          className={classes.toRight2}
        >
          <AddIcon />เพิ่ม admin
        </Button>
        <Modal
          open={open == "add" ? true : false}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes.paper}>
            {submitComplete ? <h2 style={{alignContent: "center"}}>เพิ่มแอดมินสำเร็จ</h2> :
                  loading ? <h2 style={{alignContent: "center"}}>Loading</h2> : 
                  <div>
                    <h2 id="simple-modal-title">เพิ่ม Admin</h2>
                    <p id="simple-modal-description">กรอกข้อมูลด้านล่าง</p>

                    <TextField
                      className={classes.TextField1}
                      required
                      name="name"
                      label="ชื่อผู้ใช้"
                      onChange={(e) => handleChangeText(e)}
                    />
                    <TextField
                      className={classes.TextField}
                      required
                      name="USER_ID"
                      label="USER ID"
                      onChange={(e) => handleChangeText(e)}
                    />

                    <div>
                      <FormControl
                        // variant="outlined"
                        className={classes.formControl}
                        error={companyError}
                      >
                        <InputLabel id="demo-simple-select-outlined-label1">
                          ชื่อลูกค้า
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label1"
                          id="demo-simple-select-outlined"
                          value={company ? company : ""}
                          onChange={handleChangeCompany}
                          label="Company"
                        >
                          {customers.map((company) => {
                            return (
                              <MenuItem key={company.company} value={company}>
                                {company.company}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>

                      <FormControl className={classes.formControl} error={companyError}>
                        <InputLabel id="demo-simple-select-outlined-label1">
                          Status
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label1"
                          id="demo-simple-select-outlined"
                          value={status ? status : ""}
                          onChange={handleChangeStatus}
                          label="Status"
                        >
                          <MenuItem key="แคชเชียร์" value="แคชเชียร์">
                            แคชเชียร์
                          </MenuItem>
                          <MenuItem
                            key="เจ้าของ หรือ ผู้ช่วย"
                            value="เจ้าของ หรือ ผู้ช่วย"
                          >
                            เจ้าของ หรือ ผู้ช่วย
                          </MenuItem>
                          <MenuItem key="ลูกค้า" value="ลูกค้า">
                            ลูกค้า
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    <Button
                      className={classes.button}
                      onClick={() => submit("add")}
                      variant="contained"
                      color="primary"
                    >
                      ยืนยัน
                    </Button>
                    <Button
                      className={classes.button}
                      onClick={handleClose}
                      variant="contained"
                      color="secondary"
                    >
                      ยกเลิก
                    </Button>

                  </div>
                  }
          </div>
        </Modal> &emsp;

        
        
          </h3>
          
        </div>
        <div style={{ height: 300, width: "83%" }} className={classes2.root}>
          <DataGrid
            rows={row}
            columns={columns}
            hideFooterPagination={true}
          />
        </div>
        <br />

        
        <br />
        
      </Box>
      
    </div>
  );
}

export default AdminMgt;
